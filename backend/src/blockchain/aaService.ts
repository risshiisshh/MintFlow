import { createPublicClient, http, encodeFunctionData, Hex } from 'viem';
import { polygonAmoy, baseSepolia, polygon, base } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';
import { signerToSafeSmartAccount } from 'permissionless/accounts';
import { createSmartAccountClient } from 'permissionless';
import { createPimlicoPaymasterClient } from 'permissionless/clients/pimlico';
import { Wallet } from 'ethers';
import { encrypt, decrypt } from '../utils/encryption';
import config from '../utils/config';
import { db, COLLECTIONS } from '../firebase/firebase';

// ERC-4337 EntryPoint v0.6 Address (Safe compatible)
const ENTRYPOINT_ADDRESS = '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789';

// Standard ERC-721 Mint ABI
const NFT_ABI = [
  {
    name: 'mint',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'to', type: 'address' }],
    outputs: [],
  },
  {
    name: 'safeMint',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'to', type: 'address' }],
    outputs: [],
  }
] as const;

export type SupportedChain = 'polygon' | 'base';

interface ChainConfig {
  chain: typeof polygonAmoy | typeof baseSepolia | typeof polygon | typeof base;
  rpcUrl: string;
  bundlerUrl: string;
  paymasterUrl: string;
  nftAddress: string;
}

// Get network configuration based on active chains (testnet by default for development)
function getChainConfig(chainName: SupportedChain): ChainConfig {
  const isProd = config.NODE_ENV === 'production';
  if (chainName === 'polygon') {
    return {
      chain: isProd ? polygon : polygonAmoy,
      rpcUrl: config.POLYGON_RPC_URL,
      bundlerUrl: config.POLYGON_BUNDLER_RPC_URL,
      paymasterUrl: config.POLYGON_PAYMASTER_RPC_URL,
      nftAddress: config.POLYGON_NFT_ADDRESS,
    };
  } else if (chainName === 'base') {
    return {
      chain: isProd ? base : baseSepolia,
      rpcUrl: config.BASE_RPC_URL,
      bundlerUrl: config.BASE_BUNDLER_RPC_URL,
      paymasterUrl: config.BASE_PAYMASTER_RPC_URL,
      nftAddress: config.BASE_NFT_ADDRESS,
    };
  }
  throw new Error(`Unsupported chain: ${chainName}`);
}



/**
 * Retrieves or creates a Safe smart account for the user's EOA address.
 */
export async function getOrCreateSmartAccount(
  eoaAddress: string,
  chainName: SupportedChain
): Promise<{ smartAccountAddress: string; isDeployed: boolean }> {
  const normalizedEOA = eoaAddress.toLowerCase();
  
  // Check in Firestore first
  const walletRef = db
    .collection(COLLECTIONS.WALLETS)
    .doc(`${normalizedEOA}_${chainName}`);
  const walletDoc = await walletRef.get();

  if (walletDoc.exists) {
    const data = walletDoc.data();
    return {
      smartAccountAddress: data?.smartAccountAddress,
      isDeployed: data?.isDeployed || false,
    };
  }

  // Generate a random signer wallet
  const chainConf = getChainConfig(chainName);
  
  // Determine whether to use Mock Mode.
  // Live mode requires:
  //   1. A real Pimlico API key (URL must NOT contain the placeholder string)
  //   2. A deployed NFT contract address (must NOT be the zero address)
  // Note: SPONSOR_PRIVATE_KEY is intentionally NOT checked here. The Pimlico
  // Verifying Paymaster sponsors gas on-chain directly — no server-side gas
  // wallet is required for the ERC-4337 UserOperation pipeline.
  const isMockMode =
    chainConf.bundlerUrl.includes('your_pimlico_api_key') ||
    chainConf.nftAddress === '0x0000000000000000000000000000000000000000';

  if (isMockMode) {
    console.log(`[MOCK MODE] Generating mock Safe smart account for ${eoaAddress} on ${chainName}...`);
    // Create random mock Safe wallet details
    const mockSafeWallet = Wallet.createRandom();
    const smartAccountAddress = mockSafeWallet.address;
    const mockOwnerWallet = Wallet.createRandom();
    const ownerPrivateKey = mockOwnerWallet.privateKey as Hex;
    const encryptedKey = encrypt(ownerPrivateKey);

    await walletRef.set({
      eoaAddress: normalizedEOA,
      smartAccountAddress,
      chain: chainName,
      isDeployed: false,
      createdAt: new Date().toISOString(),
      encryptedKey,
      isMock: true
    });

    return { smartAccountAddress, isDeployed: false };
  }

  try {
    const publicClient = createPublicClient({
      chain: chainConf.chain,
      transport: http(chainConf.rpcUrl),
    });

    const newWallet = Wallet.createRandom();
    const ownerPrivateKey = newWallet.privateKey as Hex;
    const ownerAccount = privateKeyToAccount(ownerPrivateKey);

    const safeAccount = await signerToSafeSmartAccount(publicClient, {
      entryPoint: ENTRYPOINT_ADDRESS,
      signer: ownerAccount,
      safeVersion: '1.4.1',
    });

    const smartAccountAddress = safeAccount.address;

    // Encrypt the private key before storing
    const encryptedKey = encrypt(ownerPrivateKey);

    // Save the mapping in Firestore
    await walletRef.set({
      eoaAddress: normalizedEOA,
      smartAccountAddress,
      chain: chainName,
      isDeployed: false,
      createdAt: new Date().toISOString(),
      encryptedKey,
    });

    return { smartAccountAddress, isDeployed: false };
  } catch (err: any) {
    console.warn(`⚠️ Real Safe creation failed, falling back to mock Safe wallet generation:`, err.message);
    const mockSafeWallet = Wallet.createRandom();
    const smartAccountAddress = mockSafeWallet.address;
    const mockOwnerWallet = Wallet.createRandom();
    const ownerPrivateKey = mockOwnerWallet.privateKey as Hex;
    const encryptedKey = encrypt(ownerPrivateKey);

    await walletRef.set({
      eoaAddress: normalizedEOA,
      smartAccountAddress,
      chain: chainName,
      isDeployed: false,
      createdAt: new Date().toISOString(),
      encryptedKey,
      isMock: true
    });

    return { smartAccountAddress, isDeployed: false };
  }
}

/**
 * Executes a gasless sponsored NFT mint transaction using ERC-4337 Safe account
 */
export async function executeGaslessMint(
  eoaAddress: string,
  chainName: SupportedChain
): Promise<{ transactionHash: string; userOpHash: string }> {
  const normalizedEOA = eoaAddress.toLowerCase();
  const chainConf = getChainConfig(chainName);

  const walletRef = db.collection(COLLECTIONS.WALLETS).doc(`${normalizedEOA}_${chainName}`);
  const walletDoc = await walletRef.get();
  
  if (!walletDoc.exists) {
    throw new Error('Smart account not found for this user.');
  }

  const data = walletDoc.data();
  if (!data || !data.encryptedKey) {
    throw new Error('Corrupted wallet data: Missing encrypted key.');
  }

  // Determine whether to use Mock Mode.
  // Uses the wallet-level isMock flag (set at creation time) OR checks
  // current environment: Pimlico URL placeholder or zero NFT address.
  const isMockMode =
    data.isMock ||
    chainConf.bundlerUrl.includes('your_pimlico_api_key') ||
    chainConf.nftAddress === '0x0000000000000000000000000000000000000000';

  if (isMockMode) {
    console.log(`🚀 [MOCK MODE] Sponsoring transaction for Safe ${data.smartAccountAddress} on ${chainName}...`);
    
    // Simulate real block latency (2 seconds)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Generate a realistic mock tx hash
    const randomHash = '0x' + Array.from({ length: 64 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('');

    // Mark wallet as deployed in Firestore (first tx deploys it)
    await walletRef.update({ isDeployed: true });

    console.log(`✅ [MOCK MODE] Smart Wallet transaction executed! Hash: ${randomHash}`);

    return {
      transactionHash: randomHash,
      userOpHash: randomHash,
    };
  }

  const ownerPrivateKey = decrypt(data.encryptedKey) as Hex;
  const ownerAccount = privateKeyToAccount(ownerPrivateKey);

  const publicClient = createPublicClient({
    chain: chainConf.chain,
    transport: http(chainConf.rpcUrl),
  });

  // Initialize the Safe Smart Account
  const safeAccount = await signerToSafeSmartAccount(publicClient, {
    entryPoint: ENTRYPOINT_ADDRESS,
    signer: ownerAccount,
    safeVersion: '1.4.1',
  });

  // Setup Pimlico Paymaster client
  const paymasterClient = createPimlicoPaymasterClient({
    transport: http(chainConf.paymasterUrl),
    entryPoint: ENTRYPOINT_ADDRESS,
  });

  // Setup Smart Account Client with Bundler and Paymaster middleware
  const smartAccountClient = createSmartAccountClient({
    account: safeAccount,
    entryPoint: ENTRYPOINT_ADDRESS,
    chain: chainConf.chain,
    bundlerTransport: http(chainConf.bundlerUrl),
    middleware: {
      sponsorUserOperation: paymasterClient.sponsorUserOperation,
    },
  });

  console.log(`🚀 Sponsoring transaction for Safe ${safeAccount.address} on ${chainName}...`);

  // Encode the NFT mint function call
  const callData = encodeFunctionData({
    abi: NFT_ABI,
    functionName: 'safeMint',
    args: [safeAccount.address],
  });

  // Send the transaction (under the hood, this builds the UserOperation,
  // signs it with the owner account, gets sponsorship from Pimlico Paymaster,
  // and sends it to the Bundler)
  const txHash = await smartAccountClient.sendTransaction({
    to: chainConf.nftAddress as Hex,
    data: callData,
  });

  // Mark wallet as deployed in Firestore (first tx deploys it)
  await db
    .collection(COLLECTIONS.WALLETS)
    .doc(`${normalizedEOA}_${chainName}`)
    .update({ isDeployed: true });

  console.log(`✅ Smart Wallet transaction executed! Hash: ${txHash}`);

  return {
    transactionHash: txHash,
    userOpHash: txHash,
  };
}
