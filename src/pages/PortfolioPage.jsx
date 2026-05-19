import NFTCard from '../components/ui/NFTCard';

const nfts = [
  {
    title: 'Senior Architect',
    subtitle: 'Advanced mastery in decentralized systems architecture and smart contract design.',
    badge: 'Verifiable',
    meta: ['Issued: Oct 2023', 'MintFlow Network'],
  },
  {
    title: 'Certified Architect',
    subtitle: 'Foundational certification in core blockchain infrastructure and protocol security.',
    badge: 'Verifiable',
    meta: ['Issued: Jan 2023', 'MintFlow Network'],
  },
  {
    title: 'Pioneer Badge',
    subtitle: 'Early ecosystem contributor with verified on-chain participation history.',
    badge: 'Verifiable',
    meta: ['Issued: Mar 2023', 'MintFlow Network'],
  },
];

const activity = [
  { icon: 'workspace_premium', label: 'Minted <strong>Senior Architect</strong> credential.', time: '2 days ago', bg: 'bg-primary-fixed' },
  { icon: 'verified_user',     label: 'Identity verified via KYC partner.',                 time: '1 month ago', bg: 'bg-surface-variant' },
];

export default function PortfolioPage() {
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
                <h1 className="font-display-md text-display-md text-on-surface" style={{ fontSize: '36px' }}>Alex Mercer</h1>
                <span className="flex items-center gap-base bg-secondary-container text-on-secondary-container rounded-full px-sm py-xs font-caption text-caption">
                  <span className="material-symbols-outlined fill text-[16px]">verified</span>
                  Verified Identity
                </span>
              </div>
              <p className="font-body-md text-on-surface-variant font-mono">0x71C...3E4b</p>
            </div>
          </div>
          <div className="flex gap-md w-full md:w-auto">
            {[{ num: '12', label: 'Total\nCredentials' }, { num: '4', label: 'Categories\nMastered' }].map((stat) => (
              <div key={stat.label} className="bg-surface rounded-lg p-md flex-1 md:w-32 flex flex-col items-center justify-center border border-outline-variant/20">
                <span className="font-display-md text-display-md text-primary" style={{ fontSize: '36px' }}>{stat.num}</span>
                <span className="font-caption text-on-surface-variant uppercase tracking-wider mt-xs text-center whitespace-pre-line">{stat.label}</span>
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
                <h2 className="font-display-md text-[36px] text-on-surface leading-tight">Certified Web3 Architect</h2>
                <p className="font-body-md text-on-surface-variant max-w-md">
                  A high-fidelity digital certificate of authenticity minted directly to your wallet. Verified on-chain, permanent, and beautifully rendered.
                </p>
                <div className="flex items-center gap-md pt-sm">
                   <button className="bg-primary text-on-primary px-xl py-sm rounded-full font-bold hover:brightness-95 transition-all shadow-md">
                     Download High-Res
                   </button>
                   <button className="text-primary font-bold hover:underline">View on Explorer</button>
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
              <button className="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-xs">
                <span className="material-symbols-outlined">filter_list</span>
                <span className="font-body-md hidden sm:inline">Filter</span>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-md">
              {nfts.map((nft) => <NFTCard key={nft.title} {...nft} />)}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="w-full lg:w-[360px] flex flex-col gap-lg flex-shrink-0">
            {/* Actions */}
            <div className="bg-surface-container-lowest rounded-xl p-md border border-outline-variant/20 shadow-sm flex flex-col gap-sm">
              <h3 className="font-heading-lg text-[20px] text-on-surface mb-xs">Portfolio Actions</h3>
              <button className="w-full bg-secondary-container text-on-secondary-container hover:brightness-95 transition-colors rounded-full py-sm px-md font-body-md flex items-center justify-center gap-sm">
                <span className="material-symbols-outlined">share</span>
                Share Public Profile
              </button>
              <button className="w-full bg-surface text-on-surface hover:bg-surface-variant transition-colors border border-outline-variant/30 rounded-full py-sm px-md font-body-md flex items-center justify-center gap-sm">
                <span className="material-symbols-outlined">download</span>
                Export Certificates (PDF)
              </button>
            </div>

            {/* Activity Timeline */}
            <div className="bg-surface-container-lowest rounded-xl p-md border border-outline-variant/20 shadow-sm flex flex-col gap-md flex-grow">
              <h3 className="font-heading-lg text-[20px] text-on-surface">Recent Activity</h3>
              <div className="flex flex-col gap-md relative">
                <div className="absolute left-[15px] top-2 bottom-2 w-px bg-outline-variant/30" />
                {activity.map((ev, i) => (
                  <div key={i} className="flex gap-md relative z-10">
                    <div className={`w-[32px] h-[32px] rounded-full ${ev.bg} text-on-primary-fixed flex items-center justify-center flex-shrink-0 border-4 border-surface-container-lowest`}>
                      <span className="material-symbols-outlined text-[16px]">{ev.icon}</span>
                    </div>
                    <div className="flex flex-col gap-base pt-[4px]">
                      <p className="font-body-md text-on-surface leading-tight" dangerouslySetInnerHTML={{ __html: ev.label }} />
                      <span className="font-caption text-on-surface-variant">{ev.time}</span>
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
