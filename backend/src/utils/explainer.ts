/**
 * Standard ERC-4337 Account Abstraction error codes map
 */
const AA_ERRORS: Record<string, string> = {
  AA10: 'The smart account creation failed because the factory initialization parameters were invalid or the sender already exists.',
  AA21: 'The gas sponsorship paymaster has insufficient deposit in the EntryPoint contract. The MintFlow relayer pool is being automatically replenished.',
  AA25: 'The Paymaster signature is invalid. This indicates a cryptographic validation error between the backend relayer and the paymaster node.',
  AA31: 'The paymaster has run out of native tokens for gas fees on this network. Refill triggered.',
  AA32: 'The paymaster validation step failed on-chain. This happens when contract rules (like rate limits) reject gas sponsorship.',
  AA40: 'The user transaction failed validation. The smart wallet owner signature did not match the computed transaction digest.',
  AA90: 'The smart account deployment failed because it has already been initialized on this network.',
};

/**
 * Parses raw blockchain / EVM exception strings and translates them to friendly English.
 */
export function explainRevertReason(errorMessage: string): string {
  const normalizedError = errorMessage.toLowerCase();

  // 1. Search for ERC-4337 EntryPoint specific error codes (AAxx)
  for (const code of Object.keys(AA_ERRORS)) {
    if (errorMessage.includes(code)) {
      return `[ERC-4337 Code ${code}] ${AA_ERRORS[code]}`;
    }
  }

  // 2. Check for common EVM exception patterns
  if (normalizedError.includes('insufficient funds') || normalizedError.includes('below target')) {
    return 'The transaction relayer has run out of native network tokens (ETH/MATIC) to cover gas costs. The automated system has been alerted to refill the wallet.';
  }

  if (normalizedError.includes('nonce') || normalizedError.includes('sequence')) {
    return 'A sequence mismatch occurred in the mempool (nonce issue). The system will automatically adjust the transaction ordering and retry.';
  }

  if (normalizedError.includes('execution reverted') || normalizedError.includes('revert')) {
    if (normalizedError.includes('already minted') || normalizedError.includes('max supply')) {
      return 'The transaction reverted because you have already minted the maximum limit of NFTs allowed for this smart account.';
    }
    if (normalizedError.includes('paused')) {
      return 'The target NFT smart contract is currently paused by its administrator. No mints can be processed at this time.';
    }
    return 'The smart contract rejected the transaction during execution. This usually happens due to rule checks in the mint function (e.g., eligibility, token limit, or whitelist checks).';
  }

  if (normalizedError.includes('timeout') || normalizedError.includes('network error')) {
    return 'The bundler node or RPC endpoint timed out. The transaction queue will safely retry the operation when the network stabilizes.';
  }

  // 3. Fallback generic explanation
  return 'The transaction encountered an unexpected blockchain execution failure. It has been queued for a retry with safe parameter boundaries.';
}
