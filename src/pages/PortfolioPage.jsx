import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import NFTCard from '../components/ui/NFTCard';

export default function PortfolioPage() {
  const { user, walletInfo } = useAuth();
  const [userTx, setUserTx] = useState([]);
  const [txLoading, setTxLoading] = useState(false);
  const [now] = useState(() => Date.now());

  useEffect(() => {
    if (!walletInfo?.eoaAddress) {
      Promise.resolve().then(() => {
        setUserTx([]);
      });
      return;
    }
    const fetchUserTransactions = async () => {
      setTxLoading(true);
      try {
        const q = query(
          collection(db, 'mint_transactions'),
          where('eoaAddress', '==', walletInfo.eoaAddress.toLowerCase()),
          where('status', '==', 'success')
        );
        const querySnapshot = await getDocs(q);
        const list = [];
        querySnapshot.forEach((doc) => {
          list.push(doc.data());
        });
        // Sort by date descending
        list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setUserTx(list);
      } catch (err) {
        console.error('Error fetching portfolio:', err);
      } finally {
        setTxLoading(false);
      }
    };
    fetchUserTransactions();
  }, [walletInfo]);

  // Map database entries to gallery cards
  const nfts = userTx.map((tx) => ({
    title: tx.chain === 'polygon' ? 'Polygon Genesis Credential' : 'Base Genesis Credential',
    subtitle: `Verifiable professional achievement credential minted gas-free on ${
      tx.chain === 'polygon' ? 'Polygon Amoy' : 'Base Sepolia'
    } via MintFlow relayer.`,
    badge: 'Verifiable',
    meta: [
      `Issued: ${new Date(tx.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      })}`,
      `Hash: ${tx.transactionHash.slice(0, 6)}...${tx.transactionHash.slice(-4)}`,
    ],
  }));

  // Fallback items if they haven't minted anything yet
  const displayNFTs =
    nfts.length > 0
      ? nfts
      : [
          {
            title: 'Guest Pass',
            subtitle: 'You are signed in but haven\'t minted any dynamic credentials yet. Start your reputation journey.',
            badge: 'Demo Mode',
            meta: ['Ecosystem Guest', 'MintFlow Network'],
          },
        ];

  const activity = userTx.map((tx) => ({
    icon: 'workspace_premium',
    label: `Minted <strong>${
      tx.chain === 'polygon' ? 'Polygon' : 'Base'
    } Genesis Credential</strong> badge.`,
    time: `${Math.round((now - new Date(tx.createdAt).getTime()) / (1000 * 60 * 60 * 24))} days ago`,
    bg: 'bg-primary-fixed',
  }));

  const displayActivity =
    activity.length > 0
      ? activity
      : [
          {
            icon: 'verified_user',
            label: 'Identity linked dynamically via secure auth context.',
            time: 'Just now',
            bg: 'bg-surface-variant',
          },
        ];

  return (
    <div className="bg-background min-h-screen flex flex-col">
      <main className="flex-grow pt-[120px] px-lg pb-section max-w-[1440px] mx-auto w-full flex flex-col gap-section">
        {/* ── Profile Overview ── */}
        <section className="flex flex-col md:flex-row items-start md:items-center justify-between gap-lg bg-surface-container-lowest rounded-xl p-lg shadow-sm border border-outline-variant/20">
          <div className="flex items-center gap-md">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-surface bg-surface-container flex-shrink-0 flex items-center justify-center">
              <span className="material-symbols-outlined text-[48px] text-on-surface-variant">account_circle</span>
            </div>
            <div className="flex flex-col gap-xs">
              <div className="flex items-center gap-sm flex-wrap">
                <h1 className="font-display-md text-display-md text-on-surface" style={{ fontSize: '36px' }}>
                  {user ? user.email.split('@')[0] : 'Guest User'}
                </h1>
                <span className="flex items-center gap-base bg-secondary-container text-on-secondary-container rounded-full px-sm py-xs font-caption text-caption">
                  <span className="material-symbols-outlined fill text-[16px]">verified</span>
                  Verified Profile
                </span>
              </div>
              <p className="font-body-md text-on-surface-variant font-mono">
                {walletInfo?.smartAccountAddress
                  ? `Safe: ${walletInfo.smartAccountAddress}`
                  : 'Requires signed in wallet session'}
              </p>
            </div>
          </div>
          <div className="flex gap-md w-full md:w-auto">
            {[
              { num: user ? userTx.length : '0', label: 'Total\nCredentials' },
              { num: user ? [...new Set(userTx.map((t) => t.chain))].length : '0', label: 'Networks\nMastered' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-surface rounded-lg p-md flex-1 md:w-32 flex flex-col items-center justify-center border border-outline-variant/20"
              >
                <span className="font-display-md text-display-md text-primary" style={{ fontSize: '36px' }}>
                  {stat.num}
                </span>
                <span className="font-caption text-on-surface-variant uppercase tracking-wider mt-xs text-center whitespace-pre-line">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Featured Certificate Showcase ── */}
        <section className="bg-surface-container-high rounded-3xl overflow-hidden border border-outline-variant/20 shadow-2xl relative">
          <div className="absolute inset-0 bg-gradient-to-r from-secondary-container/20 to-primary/10" />
          <div className="flex flex-col md:flex-row items-center relative z-10 p-lg gap-xl">
            <div className="w-full md:w-1/2 flex justify-center">
              <div className="relative group perspective-1000">
                <div className="absolute inset-0 bg-primary/20 blur-2xl group-hover:bg-primary/40 transition-colors duration-500 rounded-full" />
                <img
                  src="/images/nft_certificate_1779176921309.png"
                  alt="Premium NFT Certificate"
                  className="w-full max-w-[400px] h-auto object-cover relative z-10 rounded-xl shadow-card transform transition-transform duration-700 hover:rotate-y-12 hover:scale-105 border border-white/10"
                />
              </div>
            </div>
            <div className="w-full md:w-1/2 space-y-md">
              <div className="inline-flex items-center gap-xs px-md py-xs bg-white/20 backdrop-blur-md rounded-full border border-white/10">
                <span className="material-symbols-outlined text-secondary text-[16px]">military_tech</span>
                <span className="font-bold text-xs uppercase tracking-widest text-primary">Master Certificate</span>
              </div>
              <h2 className="font-display-md text-[36px] text-on-surface leading-tight">Certified Web3 Onboarding</h2>
              <p className="font-body-md text-on-surface-variant max-w-md">
                A high-fidelity digital certificate of authenticity minted directly to your Safe smart wallet. Verified
                on-chain, permanent, and beautifully rendered.
              </p>
              <div className="flex items-center gap-md pt-sm">
                <button
                  onClick={() => alert('Certificate downloaded locally!')}
                  className="bg-primary text-on-primary px-xl py-sm rounded-full font-bold hover:brightness-95 transition-all shadow-md"
                >
                  Download Asset
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ── Content ── */}
        <div className="flex flex-col lg:flex-row gap-xl">
          {/* NFT Grid */}
          <div className="flex-grow flex flex-col gap-lg">
            <div className="flex justify-between items-end border-b border-outline-variant/20 pb-sm">
              <h2 className="font-heading-lg text-heading-lg text-on-surface">Credential Portfolio</h2>
            </div>
            {txLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-md">
                <div className="animate-pulse bg-surface h-64 rounded-xl border border-outline-variant/20" />
                <div className="animate-pulse bg-surface h-64 rounded-xl border border-outline-variant/20" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-md">
                {displayNFTs.map((nft, idx) => (
                  <NFTCard key={idx} {...nft} />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="w-full lg:w-[360px] flex flex-col gap-lg flex-shrink-0">
            {/* Actions */}
            <div className="bg-surface-container-lowest rounded-xl p-md border border-outline-variant/20 shadow-sm flex flex-col gap-sm">
              <h3 className="font-heading-lg text-[20px] text-on-surface mb-xs">Portfolio Actions</h3>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Profile URL copied to clipboard!');
                }}
                className="w-full bg-secondary-container text-on-secondary-container hover:brightness-95 transition-colors rounded-full py-sm px-md font-body-md flex items-center justify-center gap-sm"
              >
                <span className="material-symbols-outlined">share</span>
                Share Public Profile
              </button>
            </div>

            {/* Activity Timeline */}
            <div className="bg-surface-container-lowest rounded-xl p-md border border-outline-variant/20 shadow-sm flex flex-col gap-md flex-grow">
              <h3 className="font-heading-lg text-[20px] text-on-surface">Recent Activity</h3>
              <div className="flex flex-col gap-md relative">
                <div className="absolute left-[15px] top-2 bottom-2 w-px bg-outline-variant/30" />
                {displayActivity.map((ev, i) => (
                  <div key={i} className="flex gap-md relative z-10">
                    <div
                      className={`w-[32px] h-[32px] rounded-full ${ev.bg} text-on-primary-fixed flex items-center justify-center flex-shrink-0 border-4 border-surface-container-lowest`}
                    >
                      <span className="material-symbols-outlined text-[16px]">{ev.icon}</span>
                    </div>
                    <div className="flex flex-col gap-base pt-[4px]">
                      <p
                        className="font-body-md text-on-surface leading-tight text-xs"
                        dangerouslySetInnerHTML={{ __html: ev.label }}
                      />
                      <span className="font-caption text-on-surface-variant text-[10px]">{ev.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
