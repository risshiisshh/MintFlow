import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import StepperItem from '../components/ui/StepperItem';

export default function MintPage() {
  const { user, jwtToken, walletInfo, walletLoading, currentChain, setCurrentChain, guestLogin } = useAuth();
  const [mintStatus, setMintStatus] = useState('idle'); // idle | queued | processing | success | failed
  const [txId, setTxId] = useState(null);
  const [txHash, setTxHash] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [explainingMessage, setExplainingMessage] = useState(null);

  // Estimates based on standard gas rates
  const gasSavingsEstimate = currentChain === 'polygon' ? { traditional: 45.21, actual: 1.25 } : { traditional: 25.10, actual: 0.85 };

  const handleMint = async () => {
    if (!jwtToken) return;
    setMintStatus('queued');
    setErrorMessage(null);
    setExplainingMessage(null);
    setTxHash(null);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      const res = await fetch(`${apiUrl}/api/mint`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtToken}`
        },
        body: JSON.stringify({ chain: currentChain })
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to submit mint request');
      }
      const data = await res.json();
      setTxId(data.txId);
    } catch (err) {
      console.error('Error minting NFT', err);
      setMintStatus('failed');
      setErrorMessage(err.message);
    }
  };

  // Status polling effect
  useEffect(() => {
    if (!txId || !jwtToken) return;
    let timer;
    const checkStatus = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
        const res = await fetch(`${apiUrl}/api/mint/status/${txId}`, {
          headers: {
            'Authorization': `Bearer ${jwtToken}`
          }
        });
        if (!res.ok) {
          throw new Error('Failed to fetch transaction status');
        }
        const data = await res.json();
        if (data.status === 'success') {
          setMintStatus('success');
          setTxHash(data.transactionHash);
          setTxId(null);
        } else if (data.status === 'failed') {
          setMintStatus('failed');
          setErrorMessage(data.error || 'Transaction failed');
          setExplainingMessage(data.explanation || 'Transaction failed due to on-chain issues');
          setTxId(null);
        } else if (data.status === 'processing') {
          setMintStatus('processing');
        } else if (data.status === 'queued') {
          setMintStatus('queued');
        }
      } catch (err) {
        console.error('Status polling error', err);
      }
    };

    timer = setInterval(checkStatus, 2000);
    return () => clearInterval(timer);
  }, [txId, jwtToken]);

  // Stepper calculations based on current state
  const getStep1Status = () => {
    if (walletLoading) return 'active';
    return walletInfo?.smartAccountAddress ? 'complete' : 'pending';
  };

  const getStep2Status = () => {
    if (mintStatus === 'queued' || mintStatus === 'processing') return 'active';
    if (mintStatus === 'success') return 'complete';
    if (mintStatus === 'failed') return 'pending';
    return 'pending';
  };

  const getStep3Status = () => {
    if (mintStatus === 'processing') return 'active';
    if (mintStatus === 'success') return 'complete';
    return 'pending';
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row pt-32 pb-16 bg-background">
      {/* ── Left: NFT Preview ── */}
      <section className="w-full md:w-1/2 h-[50vh] md:h-[calc(100vh-128px)] md:sticky md:top-32 px-md flex items-center justify-center">
        <div
          className="relative w-full h-full max-w-2xl rounded-xl overflow-hidden shadow-sm border border-outline-variant/20 flex items-center justify-center group"
          style={{ backgroundColor: '#E8EBE6' }}
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-surface-dim/20 to-transparent pointer-events-none" />

          {/* NFT visual placeholder */}
          <div className="relative z-10 flex flex-col items-center justify-center w-full h-full p-8">
            <div className="w-48 h-64 rounded-2xl bg-gradient-to-br from-primary to-primary-container flex flex-col items-center justify-center shadow-modal">
              <span className="material-symbols-outlined fill text-[80px] text-secondary-container mb-4">workspace_premium</span>
              <p className="text-secondary-container font-bold text-sm uppercase tracking-widest">Credential NFT</p>
            </div>
          </div>

          {/* Glass Detail Badge */}
          <div className="absolute bottom-md left-md glass-panel rounded-lg p-md shadow-lg max-w-[320px]">
            <div className="flex items-center gap-xs mb-base">
              <span className="material-symbols-outlined fill text-secondary text-[18px]">verified</span>
              <span className="font-caption text-caption uppercase tracking-wider text-on-surface-variant font-bold">Authentic Credential</span>
            </div>
            <p className="font-display-md text-heading-lg text-primary">Senior Architect</p>
            <p className="font-body-md text-body-md text-on-surface-variant mt-xs">
              Professional certification tier issued on-chain with immutable proof of achievement.
            </p>
          </div>
        </div>
      </section>

      {/* ── Right: Interaction Panel ── */}
      <section className="w-full md:w-1/2 px-md md:px-xl flex flex-col justify-start md:pt-12">
        <div className="max-w-xl w-full">
          <header className="mb-xl">
            <h1 className="font-display-md text-display-md text-primary mb-sm">
              {mintStatus === 'idle' ? 'Mint Gasless NFT' : mintStatus === 'success' ? 'Mint Successful!' : 'Minting in progress'}
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              {mintStatus === 'idle' ? 'Select your network and trigger gasless smart contract minting sponsored by UGF.' : 'Your transaction is being processed on the blockchain. We\'re handling the network fees for you.'}
            </p>
          </header>

          {/* Chain tab selector */}
          <div className="mb-lg">
            <label className="text-caption text-on-surface-variant font-bold uppercase tracking-wider mb-xs block">Choose Network</label>
            <div className="flex gap-sm">
              <button
                disabled={mintStatus !== 'idle' && mintStatus !== 'failed' && mintStatus !== 'success'}
                onClick={() => setCurrentChain('base')}
                className={`flex-1 py-sm rounded-lg font-bold border transition-colors flex items-center justify-center gap-xs ${
                  currentChain === 'base'
                    ? 'bg-primary text-on-primary border-primary'
                    : 'bg-surface text-on-surface border-outline-variant/30 hover:bg-surface-container'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">hub</span>
                Base Sepolia
              </button>
              <button
                disabled={mintStatus !== 'idle' && mintStatus !== 'failed' && mintStatus !== 'success'}
                onClick={() => setCurrentChain('polygon')}
                className={`flex-1 py-sm rounded-lg font-bold border transition-colors flex items-center justify-center gap-xs ${
                  currentChain === 'polygon'
                    ? 'bg-primary text-on-primary border-primary'
                    : 'bg-surface text-on-surface border-outline-variant/30 hover:bg-surface-container'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">polygon</span>
                Polygon Amoy
              </button>
            </div>
          </div>

          {/* User wallet address */}
          {user && (
            <div className="mb-lg">
              <label className="text-caption text-on-surface-variant font-bold uppercase tracking-wider mb-xs block">Safe Account</label>
              {walletLoading ? (
                <div className="animate-pulse bg-surface-container-high h-12 w-full rounded-xl" />
              ) : walletInfo?.smartAccountAddress ? (
                <div className="p-md rounded-xl bg-surface-container-low border border-outline-variant/20 flex items-center justify-between">
                  <div className="overflow-hidden">
                    <p className="font-mono text-sm text-primary truncate">{walletInfo.smartAccountAddress}</p>
                    <p className="text-[10px] text-on-surface-variant mt-0.5">EOA Signer: {walletInfo.eoaAddress || user.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(walletInfo.smartAccountAddress);
                      alert('Safe address copied!');
                    }}
                    className="p-sm hover:bg-surface-container rounded-full text-primary"
                  >
                    <span className="material-symbols-outlined text-[20px]">content_copy</span>
                  </button>
                </div>
              ) : (
                <div className="p-md rounded-xl bg-error/10 border border-error/20 text-error text-sm">
                  Failed to fetch Safe Account. Contact support.
                </div>
              )}
            </div>
          )}

          {/* Gasless Savings Card */}
          <div className="bg-secondary-container rounded-lg p-lg relative overflow-hidden mb-xl shadow-sm">
            <div className="relative z-10">
              <h3 className="font-heading-lg text-heading-lg text-on-secondary-container mb-xs">Gasless Savings</h3>
              <div className="flex items-end gap-xs">
                <span className="font-display-md text-display-md text-on-secondary-container">$0.00</span>
                <span className="font-body-md text-on-secondary-container opacity-60 mb-xs">Fees Applied</span>
              </div>
              <p className="font-body-md text-on-secondary-container mt-sm opacity-80 italic">
                vs. ${gasSavingsEstimate.traditional} estimated traditional market cost (Sponsored: ${gasSavingsEstimate.actual} standard rate)
              </p>
            </div>
            <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-[120px] text-on-secondary-container opacity-10">savings</span>
          </div>

          {/* Transaction Progress Stepper */}
          <div className="space-y-xl relative mb-xl">
            <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-outline-variant/30" />
            <div
              className="absolute left-[19px] top-4 w-0.5 bg-secondary-container transition-all duration-1000"
              style={{
                height:
                  getStep3Status() === 'complete'
                    ? '100%'
                    : getStep2Status() === 'complete'
                    ? '66%'
                    : getStep1Status() === 'complete'
                    ? '33%'
                    : '0%',
              }}
            />
            <StepperItem
              status={getStep1Status()}
              title="Secure Wallet Linked"
              subtitle={
                walletLoading
                  ? 'Generating custodial smart account...'
                  : walletInfo?.smartAccountAddress
                  ? `${walletInfo.smartAccountAddress.slice(0, 6)}...${walletInfo.smartAccountAddress.slice(-4)} successfully authorized.`
                  : 'Requires active Sign In session.'
              }
            />
            <StepperItem
              status={getStep2Status()}
              title="Gas abstracted"
              subtitle={
                mintStatus === 'idle'
                  ? 'UGF relayer stands ready to sponsor fees.'
                  : mintStatus === 'success'
                  ? 'Covered successfully by Relayer Network!'
                  : 'MintFlow Labs is covering costs via Relayer Network.'
              }
            />
            <StepperItem
              status={getStep3Status()}
              title="Finalizing On-Chain"
              subtitle={
                mintStatus === 'success'
                  ? 'NFT minted successfully.'
                  : mintStatus === 'processing'
                  ? 'Broadcasting unique identifier to blockchain...'
                  : 'Broadcasting unique identifier to EVM once gas is sent.'
              }
            />
          </div>

          {/* Error display */}
          {mintStatus === 'failed' && errorMessage && (
            <div className="mb-xl p-md bg-error/10 border border-error/20 rounded-xl">
              <div className="flex gap-sm text-error mb-xs">
                <span className="material-symbols-outlined">warning</span>
                <span className="font-bold text-sm">Execution Failed</span>
              </div>
              <p className="text-xs text-on-surface-variant font-mono break-all">{errorMessage}</p>
              {explainingMessage && (
                <p className="text-xs text-error font-medium mt-base italic bg-white/40 p-sm rounded border border-error/10">
                  {explainingMessage}
                </p>
              )}
            </div>
          )}

          {/* Successful Transaction Details */}
          {mintStatus === 'success' && txHash && (
            <div className="mb-xl p-md bg-secondary-container/30 border border-secondary-fixed/30 rounded-xl">
              <div className="flex gap-sm text-secondary mb-base">
                <span className="material-symbols-outlined">check_circle</span>
                <span className="font-bold text-sm">Consensus Achieved</span>
              </div>
              <div className="space-y-sm text-xs">
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Explorer</span>
                  <a
                    href={
                      currentChain === 'polygon'
                        ? `https://amoy.polygonscan.com/tx/${txHash}`
                        : `https://sepolia.basescan.org/tx/${txHash}`
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary font-bold hover:underline font-mono"
                  >
                    {txHash.slice(0, 10)}...{txHash.slice(-8)}
                  </a>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Asset Class</span>
                  <span className="font-bold text-on-surface">ERC-721 Token (Genesis Credential)</span>
                </div>
              </div>
            </div>
          )}

          {/* CTA Actions */}
          <div className="mt-lg">
            {!user ? (
                <button
                  onClick={guestLogin}
                  className="w-full py-md bg-primary text-on-primary rounded-full flex items-center justify-center gap-sm font-bold shadow-md hover:brightness-95 transition-all"
                >
                  <span className="material-symbols-outlined">login</span>
                  <span>Sign In to Mint Gasless NFT</span>
                </button>
            ) : mintStatus === 'idle' || mintStatus === 'failed' || mintStatus === 'success' ? (
              <button
                onClick={handleMint}
                disabled={walletLoading}
                className="w-full py-md bg-primary text-on-primary rounded-full flex items-center justify-center gap-sm font-bold shadow-md hover:brightness-95 transition-all"
              >
                <span className="material-symbols-outlined">auto_awesome</span>
                <span>Mint Gasless NFT</span>
              </button>
            ) : (
              <button
                disabled
                className="w-full py-md bg-outline-variant/30 text-outline rounded-full flex items-center justify-center gap-sm cursor-not-allowed"
              >
                <span className="material-symbols-outlined animate-spin">sync</span>
                <span>{mintStatus === 'queued' ? 'Queued in transactional pool...' : 'Broadcasting operation...'}</span>
              </button>
            )}
            <p className="text-center font-caption text-on-surface-variant mt-sm">
              Powered by the <span className="font-bold text-primary">Universal Gas Framework</span>. No ETH required.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
