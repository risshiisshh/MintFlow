import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

export default function DashboardPage() {
  const { user, walletInfo, walletLoading, guestLogin } = useAuth();
  const [globalStats, setGlobalStats] = useState({
    totalTransactions: 0,
    totalSponsoredUSD: 0,
    polygonTransactions: 0,
    baseTransactions: 0,
    activeWalletsCount: 0,
  });
  const [userTx, setUserTx] = useState([]);
  const [txLoading, setTxLoading] = useState(false);

  // Fetch Global Stats
  useEffect(() => {
    const fetchGlobalStats = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? "" : "http://localhost:8080");
        const res = await fetch(`${apiUrl}/api/analytics`);
        if (res.ok) {
          const data = await res.json();
          setGlobalStats(data);
        }
      } catch (err) {
        console.error('Error fetching global stats:', err);
      }
    };
    fetchGlobalStats();
  }, []);

  // Fetch User-specific transactions from Firestore
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
          where('eoaAddress', '==', walletInfo.eoaAddress.toLowerCase())
        );
        const querySnapshot = await getDocs(q);
        const list = [];
        querySnapshot.forEach((doc) => {
          list.push(doc.data());
        });
        // Sort in memory by date descending
        list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setUserTx(list);
      } catch (err) {
        console.error('Error fetching user transactions:', err);
      } finally {
        setTxLoading(false);
      }
    };
    fetchUserTransactions();
  }, [walletInfo]);

  // Derived user statistics
  const successMints = userTx.filter((tx) => tx.status === 'success');
  const userSavings = successMints.reduce((acc, tx) => {
    return acc + (tx.chain === 'polygon' ? 1.25 : 0.85);
  }, 0);

  const barHeights = [20, 32, 24, 48, 36, 64];

  // Helper to format date
  const formatDate = (isoString) => {
    if (!isoString) return 'Recent';
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen px-xl pb-xl pt-[108px] bg-background">
      <div className="max-w-7xl mx-auto pt-lg">
        {/* ── Header ── */}
        <div className="flex justify-between items-end mb-xl">
          <div>
            <h2 className="font-display-md text-display-md text-primary mb-xs tracking-tight">Dashboard</h2>
            <p className="font-body-md text-on-surface-variant/80">
              Welcome back{user ? `, ${user.email}` : ''}. Your on-chain portfolio is optimized.
            </p>
          </div>
          <div className="flex items-center gap-sm bg-surface-variant/50 px-md py-sm rounded-full border border-outline-variant">
            <span className="material-symbols-outlined fill text-primary text-[20px]">verified_user</span>
            <span className="font-caption text-primary font-bold">Secured by UGF</span>
          </div>
        </div>

        {/* ── Bento Grid ── */}
        <div className="grid grid-cols-12 gap-lg mb-xl">
          {/* Wallet Status */}
          <div className="col-span-12 md:col-span-4 bg-surface p-lg rounded-lg shadow-card border border-outline-variant/50 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div className="bg-primary p-sm rounded-xl text-secondary-container">
                <span className="material-symbols-outlined text-[24px]">account_balance_wallet</span>
              </div>
              {user ? (
                <span className="flex items-center gap-base font-caption text-primary bg-secondary-container/20 px-sm py-1 rounded-full border border-secondary-container/30">
                  <span className="w-2 h-2 bg-primary rounded-full animate-pulse" /> Connected
                </span>
              ) : (
                <span className="flex items-center gap-base font-caption text-on-surface-variant bg-surface-variant px-sm py-1 rounded-full border border-outline-variant/30">
                  Disconnected
                </span>
              )}
            </div>
            <div className="mt-lg">
              <p className="font-caption text-on-surface-variant uppercase tracking-widest mb-xs">Custodian Smart Account</p>
              {walletLoading ? (
                <div className="animate-pulse bg-surface-container-high h-10 w-48 rounded" />
              ) : walletInfo?.smartAccountAddress ? (
                <>
                  <h3 className="font-display-md text-[24px] text-primary truncate" title={walletInfo.smartAccountAddress}>
                    {walletInfo.smartAccountAddress.slice(0, 8)}...{walletInfo.smartAccountAddress.slice(-6)}
                  </h3>
                  <p className="font-body-md text-on-surface-variant mt-xs font-mono text-sm opacity-60">
                    EOA Signer: {walletInfo.eoaAddress?.slice(0, 6) || 'Unknown'}...{walletInfo.eoaAddress?.slice(-4) || ''}
                  </p>
                </>
              ) : (
                <>
                  <h3 className="font-display-md text-[24px] text-primary">Not Linked</h3>
                  <button
                    onClick={guestLogin}
                    className="text-xs text-primary font-bold hover:underline mt-sm block"
                  >
                    Click to link a secure wallet
                  </button>
                </>
              )}
            </div>
          </div>

          {/* NFTs Owned */}
          <div className="col-span-12 md:col-span-3 bg-surface-variant p-lg rounded-lg flex flex-col items-center justify-center text-center relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="font-display-lg text-[64px] text-primary">
                {user ? successMints.length : 0}
              </h3>
              <p className="font-heading-lg text-[20px] text-on-surface-variant">Minted Badges</p>
              <Link
                to="/portfolio"
                className="inline-flex items-center gap-xs font-body-md text-primary mt-md font-bold hover:gap-sm transition-all"
              >
                View Gallery <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
            </div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/40 rounded-full blur-3xl group-hover:bg-white/60 transition-colors" />
          </div>

          {/* Gas Efficiency */}
          <div className="col-span-12 md:col-span-5 bg-primary p-lg rounded-lg text-white flex flex-col justify-between relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-sm mb-md text-secondary-container">
                <span className="material-symbols-outlined">speed</span>
                <span className="font-heading-lg text-white">Gas Efficiency</span>
              </div>
              <h3 className="font-display-md text-[48px]">${user ? userSavings.toFixed(2) : '0.00'}</h3>
              <p className="font-body-md text-secondary-container/80 mt-xs">
                Saved by you this month (Global Sponsored: ${globalStats.totalSponsoredUSD} USD)
              </p>
              <div className="mt-lg flex items-end gap-base h-16">
                {barHeights.map((h, i) => (
                  <div
                    key={i}
                    className="w-full rounded-t-sm bg-secondary-container"
                    style={{ height: `${h}px`, opacity: 0.3 + i * 0.12 }}
                  />
                ))}
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-secondary-container/5 to-transparent" />
          </div>
        </div>

        {/* ── Bottom Grid ── */}
        <div className="grid grid-cols-12 gap-xl">
          {/* Recent Transactions */}
          <div className="col-span-12 lg:col-span-8">
            <h3 className="font-heading-lg text-primary mb-lg">Recent Activity</h3>
            {txLoading ? (
              <div className="space-y-sm">
                <div className="animate-pulse bg-surface h-12 w-full rounded border border-outline-variant/30" />
                <div className="animate-pulse bg-surface h-12 w-full rounded border border-outline-variant/30" />
              </div>
            ) : userTx.length === 0 ? (
              <div className="bg-surface rounded-lg p-xl text-center border border-outline-variant/50">
                <span className="material-symbols-outlined text-[48px] text-on-surface-variant/40 mb-base">receipt_long</span>
                <p className="font-heading-lg text-primary mb-xs">No Transactions Mapped</p>
                <p className="font-body-md text-on-surface-variant mb-md">
                  You haven't enqueued any gasless mint actions yet. Try out the universal gas framework!
                </p>
                <Link
                  to="/mint"
                  className="inline-flex items-center gap-xs bg-primary text-on-primary px-lg py-sm rounded-full font-bold shadow-sm"
                >
                  <span className="material-symbols-outlined">auto_awesome</span> Mint Your First Badge
                </Link>
              </div>
            ) : (
              <div className="bg-surface rounded-lg overflow-x-auto shadow-sm border border-outline-variant/50">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-surface-variant/30 border-b border-outline-variant/50">
                      {['Date', 'Activity', 'Status', 'Sponsored Savings'].map((h) => (
                        <th key={h} className="px-lg py-md font-caption text-on-surface-variant uppercase tracking-wider">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/30">
                    {userTx.map((tx) => (
                      <tr key={tx.id} className="hover:bg-surface-container-low/50 transition-colors">
                        <td className="px-lg py-md font-body-md text-on-surface-variant">{formatDate(tx.createdAt)}</td>
                        <td className="px-lg py-md font-body-md font-bold text-primary">
                          Minted Genesis Credential ({tx.chain === 'polygon' ? 'Polygon' : 'Base'})
                        </td>
                        <td className="px-lg py-md">
                          <span
                            className={`border px-sm py-1 rounded-full text-caption font-bold ${
                              tx.status === 'success'
                                ? 'bg-secondary-container/20 text-secondary border-secondary/30'
                                : tx.status === 'failed'
                                ? 'bg-error/10 text-error border-error/20'
                                : 'bg-surface-variant text-on-surface-variant border-outline-variant/30 animate-pulse'
                            }`}
                          >
                            {tx.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-lg py-md font-body-md text-primary font-bold">
                          ${tx.chain === 'polygon' ? '1.25' : '0.85'}{' '}
                          <span className="text-caption font-normal opacity-40 ml-1">(Abstracted)</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="col-span-12 lg:col-span-4 space-y-lg">
            {/* Quick Mint */}
            <div className="bg-secondary-container p-lg rounded-lg shadow-lg hover:-translate-y-1 transition-transform relative overflow-hidden flex flex-col justify-between min-h-[280px]">
              <div className="relative z-10">
                <h4 className="font-display-md text-[32px] text-primary mb-sm leading-tight">Mint New Badge</h4>
                <p className="font-body-md text-primary/70 mb-lg max-w-[200px]">
                  Expand your reputation with zero-fee gas abstraction.
                </p>
              </div>
              <Link
                to="/mint"
                className="relative z-10 w-full bg-primary text-secondary-container py-md rounded-full font-bold flex items-center justify-center gap-sm hover:bg-primary/90 transition-colors"
              >
                <span className="material-symbols-outlined">add_circle</span>
                Start Minting
              </Link>
            </div>

            {/* Shield Level */}
            <div className="bg-surface-container-low p-lg rounded-lg border border-outline-variant/50">
              <div className="flex items-center gap-md mb-md">
                <div className="bg-surface p-sm rounded-xl shadow-sm">
                  <span className="material-symbols-outlined fill text-primary">shield</span>
                </div>
                <div>
                  <h4 className="font-heading-lg text-[18px] text-primary">Shield Level: Pro</h4>
                  <p className="font-caption text-on-surface-variant">Active monitoring enabled</p>
                </div>
              </div>
              <div className="space-y-sm">
                {['Universal Gas Framework', 'Cold Storage Sync', 'Audit Trail Logging'].map((item) => (
                  <div key={item} className="flex justify-between items-center py-2 border-b border-outline-variant/30 last:border-0">
                    <span className="font-body-md text-primary/80">{item}</span>
                    <span className="material-symbols-outlined fill text-primary text-[20px]">check_circle</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
