import { Link } from 'react-router-dom';

export default function SuccessPage() {
  return (
    <div className="bg-background min-h-screen pt-4">
      <main className="max-w-7xl mx-auto px-lg">
        {/* ── Hero: Mint Successful ── */}
        <section className="mt-hero text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-xs px-sm py-base bg-secondary-container text-on-secondary-container rounded-full mb-md shadow-sm">
            <span className="material-symbols-outlined text-[18px] fill">check_circle</span>
            <span className="font-caption text-caption font-bold tracking-wide">TRANSACTION VERIFIED</span>
          </div>
          <h1 className="font-display-lg text-display-lg text-primary mb-lg">Mint Successful</h1>
          
          {/* Horizontal Glass Credential Render */}
          <div className="relative w-full max-w-3xl aspect-[1.8/1] rounded-xl overflow-hidden shadow-xl mb-xl group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-container to-secondary opacity-90" />
            <div className="absolute inset-0 flex flex-col justify-between p-lg text-white z-10">
              <div className="flex justify-between items-start">
                <div className="flex flex-col items-start">
                  <span className="font-display-md text-display-md leading-none tracking-tight">MINTFLOW</span>
                  <span className="font-caption text-caption opacity-80 uppercase tracking-widest mt-base">Genesis Credential</span>
                </div>
                <span className="material-symbols-outlined text-[48px]">digital_out_of_home</span>
              </div>
              <div className="flex flex-col items-start gap-xs">
                <div className="glass-card px-md py-sm rounded-lg flex flex-col items-start border border-white/20">
                  <span className="font-caption text-caption opacity-70 uppercase tracking-wider text-primary">Owner Identity</span>
                  <span className="font-heading-lg text-heading-lg text-primary">0x4F...7E2a</span>
                </div>
                <div className="flex gap-md mt-sm">
                  <div className="flex flex-col items-start">
                    <span className="font-caption text-caption opacity-70 uppercase tracking-wider">Issuance Date</span>
                    <span className="font-body-md text-body-md font-bold">OCT 24, 2023</span>
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="font-caption text-caption opacity-70 uppercase tracking-wider">Block Hash</span>
                    <span className="font-body-md text-body-md font-bold">#9402...EF12</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Abstract Decorative Lines */}
            <div className="absolute inset-0 w-full h-full mix-blend-overlay opacity-30 pointer-events-none">
               <div className="w-[150%] h-[150%] absolute -top-1/4 -left-1/4 bg-[radial-gradient(circle_at_center,_transparent_30%,_rgba(255,255,255,0.2)_100%)]" />
               <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                 <path d="M0,100 C30,80 70,80 100,100" fill="none" stroke="white" strokeWidth="0.5" className="opacity-50" />
                 <path d="M0,100 C30,60 70,60 100,100" fill="none" stroke="white" strokeWidth="0.5" className="opacity-30" />
               </svg>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex flex-wrap justify-center gap-md">
            <button className="bg-secondary text-on-secondary px-xl py-md rounded-full font-bold flex items-center gap-sm hover:scale-[0.98] transition-all shadow-sm">
              <span className="material-symbols-outlined">share</span> Share Achievement
            </button>
            <button className="bg-surface-container-highest text-on-surface px-xl py-md rounded-full font-bold flex items-center gap-sm hover:scale-[0.98] transition-all">
              <span className="material-symbols-outlined">download</span> Download Asset
            </button>
            <button className="bg-surface-container-highest text-on-surface px-xl py-md rounded-full font-bold flex items-center gap-sm hover:scale-[0.98] transition-all">
              <span className="material-symbols-outlined">verified</span> View Certificate
            </button>
          </div>
        </section>

        {/* ── Middle Section: Network Consensus Ledger ── */}
        <section className="mt-section bg-surface-container-low rounded-xl p-lg md:p-xl border border-outline-variant/30">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-xl gap-md">
            <div>
              <h2 className="font-display-md text-display-md text-primary">Network Consensus</h2>
              <p className="text-on-surface-variant mt-xs">Real-time ledger validation and node synchronization data.</p>
            </div>
            <div className="flex items-center gap-sm bg-white/50 px-md py-sm rounded-full border border-outline-variant/20 shadow-sm">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-secondary" />
              </span>
              <span className="font-caption text-caption font-bold text-secondary uppercase tracking-widest">Mainnet Syncing</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
            {/* Ledger Details */}
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-md">
              <div className="p-md rounded-lg bg-surface-container-highest/50 border border-outline-variant/20">
                <div className="flex items-center gap-sm mb-sm text-secondary">
                  <span className="material-symbols-outlined">database</span>
                  <span className="font-bold uppercase tracking-wider text-caption">Block Details</span>
                </div>
                <div className="space-y-sm">
                  <div className="flex justify-between border-b border-outline-variant/20 pb-xs">
                    <span className="text-on-surface-variant font-caption">Block Height</span>
                    <span className="font-bold text-on-surface">#18,492,021</span>
                  </div>
                  <div className="flex justify-between border-b border-outline-variant/20 pb-xs">
                    <span className="text-on-surface-variant font-caption">Gas Fees</span>
                    <span className="font-bold text-on-surface">0.0012 ETH</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant font-caption">Validator Node</span>
                    <span className="font-bold text-on-surface">L-7749-X</span>
                  </div>
                </div>
              </div>
              
              <div className="p-md rounded-lg bg-surface-container-highest/50 border border-outline-variant/20">
                <div className="flex items-center gap-sm mb-sm text-secondary">
                  <span className="material-symbols-outlined">hub</span>
                  <span className="font-bold uppercase tracking-wider text-caption">Sync Status</span>
                </div>
                <div className="flex flex-col gap-sm">
                  <div className="w-full bg-surface-variant rounded-full h-2">
                    <div className="bg-secondary h-2 rounded-full w-[94%]" />
                  </div>
                  <span className="text-on-surface-variant font-caption">94% Nodes reached consensus (Finality imminent)</span>
                  <div className="flex gap-xs mt-xs">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-secondary-fixed flex items-center justify-center">
                        <span className="material-symbols-outlined text-[16px] text-on-secondary-fixed">check</span>
                      </div>
                    ))}
                    <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center animate-spin">
                      <span className="material-symbols-outlined text-[16px] text-on-surface-variant">sync</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Block Anchor Visualization */}
            <div className="bg-primary rounded-lg p-lg text-white flex flex-col justify-between relative overflow-hidden shadow-lg">
              <div className="relative z-10">
                <span className="font-caption text-caption text-primary-fixed opacity-70 uppercase mb-xs block tracking-widest">Block Anchor</span>
                <div className="h-px bg-white/20 w-full mb-md" />
                <div className="space-y-md">
                  <div className="flex gap-md items-start">
                    <span className="material-symbols-outlined text-secondary-fixed">anchor</span>
                    <div>
                      <span className="font-bold block text-on-primary">Immutable Hash</span>
                      <span className="text-caption text-on-primary opacity-70 font-mono break-all">f295...e49c1b</span>
                    </div>
                  </div>
                  <div className="flex gap-md items-start">
                    <span className="material-symbols-outlined text-secondary-fixed">lock</span>
                    <div>
                      <span className="font-bold block text-on-primary">State Proof</span>
                      <span className="text-caption text-on-primary opacity-70">Merkle Tree Verified</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-primary-fixed/10 rounded-full blur-2xl" />
            </div>
          </div>
        </section>

        {/* ── Bottom Section: Explore Next ── */}
        <section className="mt-section mb-hero">
          <h3 className="font-heading-lg text-heading-lg text-primary mb-lg">What's Next?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
            
            <Link to="/portfolio" className="group relative bg-surface-container-high rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 block border border-outline-variant/30">
              <div className="p-lg md:p-xl flex flex-col h-full justify-between relative z-10">
                <div>
                  <span className="material-symbols-outlined text-secondary text-[40px] mb-md fill">wallet</span>
                  <h4 className="font-display-md text-[32px] text-primary mb-sm leading-tight">View Portfolio</h4>
                  <p className="text-on-surface-variant max-w-xs">Track your growing collection of digital assets and verifiable credentials in one secure place.</p>
                </div>
                <div className="mt-xl">
                  <span className="text-secondary font-bold flex items-center gap-xs group-hover:gap-sm transition-all">
                    Open Dashboard <span className="material-symbols-outlined">arrow_forward</span>
                  </span>
                </div>
              </div>
              <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-secondary-fixed/20 rounded-full blur-3xl transition-all group-hover:scale-125" />
            </Link>
            
            <Link to="/marketplace" className="group relative bg-surface-container-high rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 block border border-outline-variant/30">
              <div className="p-lg md:p-xl flex flex-col h-full justify-between relative z-10">
                <div>
                  <span className="material-symbols-outlined text-secondary text-[40px] mb-md fill">storefront</span>
                  <h4 className="font-display-md text-[32px] text-primary mb-sm leading-tight">Explore Market</h4>
                  <p className="text-on-surface-variant max-w-xs">Discover exclusive new mints and premium financial products verified by the MintFlow network.</p>
                </div>
                <div className="mt-xl">
                  <span className="text-secondary font-bold flex items-center gap-xs group-hover:gap-sm transition-all">
                    Start Browsing <span className="material-symbols-outlined">arrow_forward</span>
                  </span>
                </div>
              </div>
              <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-primary-fixed/20 rounded-full blur-3xl transition-all group-hover:scale-125" />
            </Link>
            
          </div>
        </section>
      </main>
    </div>
  );
}
