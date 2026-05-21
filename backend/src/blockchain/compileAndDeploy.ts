/**
 * compileAndDeploy.ts
 *
 * Usage:
 *   npx ts-node src/blockchain/compileAndDeploy.ts base   <DEPLOYER_PRIVATE_KEY>
 *   npx ts-node src/blockchain/compileAndDeploy.ts polygon <DEPLOYER_PRIVATE_KEY>
 *
 * The deployer address must have testnet ETH/MATIC for gas.
 * Get Base Sepolia ETH: https://basefaucet.com/ or https://sepoliafaucet.com/
 * Get Polygon Amoy MATIC: https://faucet.polygon.technology/
 *
 * On success, this script prints the deployed contract address.
 * Copy it into backend/.env as BASE_NFT_ADDRESS or POLYGON_NFT_ADDRESS.
 *
 * No Hardhat, no Foundry. Uses only:
 *  - solc (JS Solidity compiler, already installed as devDependency)
 *  - viem  (already a production dependency)
 *  - path/fs from Node stdlib
 */

import * as fs from 'fs';
import * as path from 'path';
import solc from 'solc';
import {
  createWalletClient,
  createPublicClient,
  http,
  parseEther,
  Hex,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { baseSepolia, polygonAmoy } from 'viem/chains';

// ── Argument Parsing ──────────────────────────────────────────────────────────
const [, , networkArg, privateKeyArg] = process.argv;

if (!networkArg || !privateKeyArg) {
  console.error('');
  console.error('❌ Usage: npx ts-node src/blockchain/compileAndDeploy.ts <network> <private_key>');
  console.error('   network: "base" or "polygon"');
  console.error('   private_key: 0x-prefixed 64-char hex key of the deployer wallet');
  console.error('');
  console.error('Example:');
  console.error('   npx ts-node src/blockchain/compileAndDeploy.ts base 0xabc123...');
  console.error('');
  process.exit(1);
}

if (networkArg !== 'base' && networkArg !== 'polygon') {
  console.error(`❌ Unknown network "${networkArg}". Must be "base" or "polygon".`);
  process.exit(1);
}

if (!/^0x[a-fA-F0-9]{64}$/.test(privateKeyArg)) {
  console.error('❌ Private key must be a 0x-prefixed 64-character hex string.');
  process.exit(1);
}

// ── Chain Configuration ───────────────────────────────────────────────────────
const CHAIN_CONFIG = {
  base: {
    chain: baseSepolia,
    rpcUrl: process.env.BASE_RPC_URL || 'https://sepolia.base.org',
    envKey: 'BASE_NFT_ADDRESS',
    name: 'Base Sepolia',
    explorer: 'https://sepolia.basescan.org',
  },
  polygon: {
    chain: polygonAmoy,
    rpcUrl: process.env.POLYGON_RPC_URL || 'https://rpc-amoy.polygon.technology',
    envKey: 'POLYGON_NFT_ADDRESS',
    name: 'Polygon Amoy',
    explorer: 'https://amoy.polygonscan.com',
  },
} as const;

const config = CHAIN_CONFIG[networkArg as 'base' | 'polygon'];

// ── Step 1: Read Solidity Source ──────────────────────────────────────────────
const contractPath = path.resolve(__dirname, 'contracts', 'MintFlowBadge.sol');

if (!fs.existsSync(contractPath)) {
  console.error(`❌ Contract source not found at: ${contractPath}`);
  console.error('   Ensure MintFlowBadge.sol exists in backend/src/blockchain/contracts/');
  process.exit(1);
}

const sourceCode = fs.readFileSync(contractPath, 'utf8');
console.log(`\n🔨 Compiling MintFlowBadge.sol for ${config.name}...`);

// ── Step 2: Compile with solcjs ───────────────────────────────────────────────
const solcInput = JSON.stringify({
  language: 'Solidity',
  sources: {
    'MintFlowBadge.sol': { content: sourceCode },
  },
  settings: {
    outputSelection: {
      'MintFlowBadge.sol': {
        MintFlowBadge: ['abi', 'evm.bytecode.object'],
      },
    },
    optimizer: { enabled: true, runs: 200 },
  },
});

const solcOutput = JSON.parse(solc.compile(solcInput));

// Check for compilation errors
if (solcOutput.errors) {
  const errors = solcOutput.errors.filter((e: { severity: string }) => e.severity === 'error');
  if (errors.length > 0) {
    console.error('\n❌ Compilation failed with errors:');
    errors.forEach((e: { formattedMessage: string }) => console.error('  ', e.formattedMessage));
    process.exit(1);
  }
  // Print warnings but don't fail
  const warnings = solcOutput.errors.filter((e: { severity: string }) => e.severity === 'warning');
  if (warnings.length > 0) {
    console.warn('\n⚠️  Compilation warnings (non-fatal):');
    warnings.forEach((e: { formattedMessage: string }) => console.warn('  ', e.formattedMessage));
  }
}

const contractOutput = solcOutput.sources?.['MintFlowBadge.sol'] ?? solcOutput.contracts?.['MintFlowBadge.sol']?.['MintFlowBadge'];
const contractData = solcOutput.contracts['MintFlowBadge.sol']['MintFlowBadge'];

if (!contractData) {
  console.error('❌ Compilation succeeded but no contract output found. Check solc output structure.');
  process.exit(1);
}

const abi = contractData.abi;
const bytecode = `0x${contractData.evm.bytecode.object}` as Hex;

if (!bytecode || bytecode === '0x') {
  console.error('❌ Bytecode is empty. Compilation may have failed silently.');
  process.exit(1);
}

console.log(`✅ Compiled successfully. ABI entries: ${abi.length}, Bytecode size: ${(bytecode.length - 2) / 2} bytes`);

// Persist the compiled artifact for reference / future use
const artifactPath = path.resolve(__dirname, 'contracts', 'MintFlowBadge.json');
fs.writeFileSync(artifactPath, JSON.stringify({ abi, bytecode }, null, 2), 'utf8');
console.log(`📄 Artifact written to: ${artifactPath}`);

// ── Step 3: Deploy via viem ───────────────────────────────────────────────────
console.log(`\n🚀 Deploying to ${config.name}...`);
console.log(`   RPC: ${config.rpcUrl}`);

const account = privateKeyToAccount(privateKeyArg as Hex);
console.log(`   Deployer: ${account.address}`);

const publicClient = createPublicClient({
  chain: config.chain,
  transport: http(config.rpcUrl),
});

const walletClient = createWalletClient({
  account,
  chain: config.chain,
  transport: http(config.rpcUrl),
});

async function deploy() {
  // Check deployer balance
  const balance = await publicClient.getBalance({ address: account.address });
  const balanceEth = Number(balance) / 1e18;
  console.log(`   Balance: ${balanceEth.toFixed(6)} ${networkArg === 'base' ? 'ETH' : 'MATIC'}`);

  if (balance === 0n) {
    console.error('\n❌ Deployer wallet has zero balance.');
    if (networkArg === 'base') {
      console.error('   Get Base Sepolia ETH from: https://basefaucet.com/ or https://sepoliafaucet.com/');
    } else {
      console.error('   Get Polygon Amoy MATIC from: https://faucet.polygon.technology/');
    }
    process.exit(1);
  }

  // Estimate gas before sending
  const deployGasEstimate = await publicClient.estimateGas({
    account: account.address,
    data: bytecode,
  });
  console.log(`   Estimated deploy gas: ${deployGasEstimate.toString()}`);

  // Send the deployment transaction
  const txHash = await walletClient.deployContract({
    abi,
    bytecode,
    args: [], // MintFlowBadge constructor takes no arguments
  });

  console.log(`\n⏳ Deployment tx sent: ${config.explorer}/tx/${txHash}`);
  console.log('   Waiting for confirmation (up to 60s)...');

  // Wait for receipt
  const receipt = await publicClient.waitForTransactionReceipt({
    hash: txHash,
    timeout: 60_000,
  });

  if (receipt.status !== 'success') {
    console.error(`\n❌ Deployment transaction reverted. Status: ${receipt.status}`);
    console.error(`   Check: ${config.explorer}/tx/${txHash}`);
    process.exit(1);
  }

  const contractAddress = receipt.contractAddress;
  if (!contractAddress) {
    console.error('❌ Receipt contained no contractAddress. This is unexpected.');
    process.exit(1);
  }

  // ── Success ──────────────────────────────────────────────────────────────
  console.log('\n' + '═'.repeat(60));
  console.log('✅  MintFlowBadge deployed successfully!');
  console.log('═'.repeat(60));
  console.log(`\n   Network  : ${config.name}`);
  console.log(`   Address  : ${contractAddress}`);
  console.log(`   Explorer : ${config.explorer}/address/${contractAddress}`);
  console.log(`   Tx Hash  : ${txHash}`);
  console.log('\n📋 Next Steps:');
  console.log(`   1. Open backend/.env`);
  console.log(`   2. Set ${config.envKey}=${contractAddress}`);
  console.log(`   3. Set the Pimlico API keys (see implementation_plan.md)`);
  console.log(`   4. Restart the backend server`);
  console.log('');
}

deploy().catch((err) => {
  console.error('\n❌ Deployment failed with an unexpected error:');
  console.error('  ', err.message || err);
  process.exit(1);
});
