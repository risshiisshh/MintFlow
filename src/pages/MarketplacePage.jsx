import { useState } from 'react';
import CredentialCard from '../components/ui/CredentialCard';
import StatCard from '../components/ui/StatCard';

const credentials = [
  { icon: 'code',            title: 'Senior Solidity Dev',    issuer: 'Ethereum Foundation Approved',  trustScore: '98.4', verificationRate: '99.9%',  holders: '2.4k' },
  { icon: 'account_balance', title: 'KYC Compliance Tier 3', issuer: 'Verified by GlobalAuth',          trustScore: '99.1', verificationRate: '100.0%', holders: '85k' },
  { icon: 'shield',          title: 'Security Auditor V2',   issuer: 'Protocol Safety Guild',           trustScore: '94.7', verificationRate: '97.2%',  holders: '512' },
  { icon: 'diamond',         title: 'Genesis Validator',      issuer: 'MintFlow Ecosystem',              trustScore: '100',  verificationRate: '100%',   holders: '128' },
];

export default function MarketplacePage() {
  const [search, setSearch] = useState('');

  return (
    <div className="bg-background min-h-screen pt-hero">
      {/* ── Hero ── */}
      <section className="max-w-7xl mx-auto px-xl mb-section">
        <div className="flex flex-col md:flex-row items-end justify-between gap-lg mb-xl">
          <div className="max-w-2xl">
            <h1 className="font-display-lg text-display-lg text-primary mb-md">MintFlow Marketplace — Data-Driven Trust</h1>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-lg">
              The definitive ledger for professional on-chain credentials. Leveraging real-time network health metrics and verified trust scores to secure decentralized identity.
            </p>
          </div>
          <div className="flex gap-md bg-surface-container-low p-sm rounded-lg border border-outline-variant/30">
            <div className="flex flex-col">
              <span className="font-caption text-on-surface-variant uppercase tracking-widest">Network Status</span>
              <div className="flex items-center gap-xs">
                <span className="w-2 h-2 rounded-full bg-secondary" />
                <span className="font-heading-lg text-heading-lg text-primary">Optimal</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Bento */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
          <StatCard variant="dark"    label="Avg. Verification Rate" value="99.82%" sub="Real-time cryptographic consensus reached across 14,000+ nodes." />
          <StatCard variant="lime"    label="Active Holders"          value="1.2M+"  sub="Verified professionals actively managing credentials globally." />
          <StatCard variant="surface" label="Network Health Index"    value="98/100" icon="98%" />
        </div>
      </section>

      {/* ── Main: Filters + Grid ── */}
      <section className="max-w-7xl mx-auto px-xl pb-section flex flex-col md:flex-row gap-xl">
        {/* Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="sticky top-xl space-y-xl">
            <div>
              <h3 className="font-heading-lg text-heading-lg text-primary mb-md">Filters</h3>
              <div className="space-y-sm">
                <label className="flex flex-col gap-xs">
                  <span className="font-caption text-on-surface-variant uppercase font-bold">Search Ledger</span>
                  <input
                    type="text"
                    placeholder="Search protocol..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-surface border border-outline-variant rounded-lg px-md py-sm focus:border-secondary focus:ring-0 outline-none transition-colors"
                  />
                </label>
              </div>
            </div>
            <div>
              <h4 className="font-caption text-on-surface-variant uppercase font-bold mb-md">Verification Tier</h4>
              <div className="space-y-xs">
                {['Enterprise Gold', 'Community Verified', 'Staked Governance'].map((tier, i) => (
                  <label key={tier} className="flex items-center gap-sm cursor-pointer group">
                    <input type="checkbox" defaultChecked={i === 0} className="w-5 h-5 rounded border-outline-variant accent-secondary" />
                    <span className="font-body-md text-on-surface group-hover:text-secondary">{tier}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="p-lg bg-tertiary text-on-tertiary rounded-lg">
              <span className="material-symbols-outlined text-tertiary-fixed-dim mb-sm block">verified_user</span>
              <p className="font-caption text-caption">All metrics are verified through zero-knowledge proofs on the MintFlow mainnet.</p>
            </div>
          </div>
        </aside>

        {/* Grid */}
        <div className="flex-grow">
          <div className="flex items-center justify-between mb-lg">
            <span className="font-body-md text-on-surface-variant">Showing 24 verified credentials</span>
            <div className="flex items-center gap-xs">
              <span className="font-caption text-on-surface-variant">Sort by:</span>
              <select className="bg-transparent border-none font-bold text-primary focus:ring-0 cursor-pointer">
                <option>Highest Trust Score</option>
                <option>Most Holders</option>
                <option>Recently Added</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg">
            {credentials
              .filter((c) => c.title.toLowerCase().includes(search.toLowerCase()))
              .map((c) => (
                <CredentialCard key={c.title} {...c} />
              ))}
          </div>
          <div className="mt-xl flex justify-center">
            <button className="border border-outline-variant text-primary font-bold px-xl py-md rounded-full hover:bg-surface-container transition-colors">
              Load More Metrics
            </button>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-primary py-section overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-xl relative z-10 flex flex-col md:flex-row items-center gap-xl">
          <div className="flex-grow">
            <h2 className="font-display-md text-display-md text-on-primary mb-md">Immutable Proof of Merit.</h2>
            <p className="font-body-md text-on-primary-container max-w-xl mb-lg">
              MintFlow credentials aren't just badges; they are cryptographically signed statements of fact.
            </p>
            <div className="flex gap-md flex-wrap">
              <button className="bg-secondary-container text-on-secondary-container px-xl py-sm rounded-full font-bold hover:scale-105 transition-transform">
                Issue Your First Credential
              </button>
              <button className="border border-on-primary-container text-on-primary px-xl py-sm rounded-full font-bold hover:bg-on-primary-container/10 transition-colors">
                Documentation
              </button>
            </div>
          </div>
          <div className="w-full md:w-1/3">
            <div className="bg-white/5 border border-white/10 rounded-xl p-lg backdrop-blur-md">
              <div className="flex justify-between items-center mb-md">
                <span className="text-on-primary font-bold">Live Network Feed</span>
                <span className="w-2 h-2 rounded-full bg-secondary-container animate-pulse" />
              </div>
              <div className="space-y-sm">
                {[
                  { label: 'Solidity Dev #882',  time: 'Verified 2m ago' },
                  { label: 'KYC Tier 3 #104',    time: 'Verified 5m ago' },
                  { label: 'Security Guild #22', time: 'Verified 12m ago' },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between text-on-primary-container font-caption">
                    <span>{item.label}</span>
                    <span>{item.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
          <div className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-secondary-container via-transparent to-transparent" />
        </div>
      </section>
    </div>
  );
}
