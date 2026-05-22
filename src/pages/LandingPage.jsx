import { Link } from 'react-router-dom';
import { useState } from 'react';

const features = [
  { id: 1, icon: 'money_off',   title: 'Gasless Minting',      desc: 'Your users never need to fund a wallet with ETH. We handle the transaction fees behind the scenes.', pos: 'col-start-1 row-start-1 md:col-start-1 md:row-start-1' },
  { id: 2, icon: 'face_3',      title: 'Beginner Mode',        desc: 'A streamlined interface that guides users through the process without overwhelming technical jargon.', pos: 'col-start-1 row-start-2 md:col-start-3 md:row-start-1' },
  { id: 3, icon: 'verified',    title: 'NFT Credentials',      desc: 'Issue verifiable digital certificates and memberships with enterprise-grade security and permanence.', pos: 'col-start-1 row-start-3 md:col-start-1 md:row-start-2' },
  { id: 4, icon: 'savings',     title: 'Gas Savings',          desc: 'Optimize your deployment costs with our intelligent batching and layer-2 network integrations.', pos: 'col-start-1 row-start-4 md:col-start-3 md:row-start-2' },
  { id: 5, icon: 'timer',       title: 'Instant Transactions', desc: 'Experience near-instant finality on Base, providing a Web2-like fluid experience for your users.', pos: 'col-start-1 row-start-5 md:col-start-1 md:row-start-3' },
  { id: 6, icon: 'wallet',      title: 'Wallet Simplicity',    desc: 'Support for social logins and embedded wallets. No seed phrases required for onboarding.', pos: 'col-start-1 row-start-6 md:col-start-3 md:row-start-3' },
];

const steps = [
  { num: 1, title: 'Connect Wallet',   desc: 'Sign in with any Base-compatible wallet.' },
  { num: 2, title: 'Choose Badge',     desc: 'Select your limited edition NFT badge.' },
  { num: 3, title: 'Pay Mock USD',     desc: 'One-click payment using test stablecoins.' },
  { num: 4, title: 'UGF Handles Gas',  desc: 'Our backend pays the ETH gas fee.' },
  { num: 5, title: 'NFT Minted',       desc: 'Asset arrives in your wallet instantly.' },
];

const showcaseItems = [
  { icon: 'workspace_premium', label: 'Genesis Pass',   from: 'from-secondary-container', to: 'to-primary-container' },
  { icon: 'star',              label: 'Pioneer Badge',  from: 'from-tertiary-container',  to: 'to-secondary-container' },
  { icon: 'local_fire_department', label: 'Early Adopter', from: 'from-primary',        to: 'to-secondary-container' },
];

export default function LandingPage() {
  const [activeFeature, setActiveFeature] = useState(null);

  return (
    <div className="bg-background">
      {/* ── Hero ── */}
      <section className="pt-[160px] pb-section px-lg max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-xl">
        <div className="flex-1 space-y-lg">
          <h1 className="font-display-xl text-5xl md:text-display-xl text-primary max-w-2xl leading-[0.85] tracking-[-0.02em]">
            Mint NFTs Without ETH
          </h1>
          <p className="font-heading-lg text-xl md:text-heading-lg text-on-surface-variant max-w-xl">
            MintFlow removes gas friction from Web3 onboarding using UGF-powered gas abstraction.
          </p>
          <div className="flex flex-wrap gap-md pt-sm">
            <Link
              to="/mint"
              className="bg-secondary-container text-on-secondary-container px-xl py-md rounded-full font-bold hover:brightness-95 transition-all active:scale-95 shadow-sm"
            >
              Start Minting
            </Link>
            <Link
              to="/transaction-flow"
              className="bg-surface-container-high text-on-surface px-xl py-md rounded-full font-bold hover:bg-surface-dim transition-colors active:scale-95 flex items-center gap-sm"
            >
              Try Demo Experience
              <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>
        </div>
        <div className="flex-1 w-full relative">
          <div className="absolute inset-0 bg-secondary-container/20 blur-3xl rounded-full" />
          <div className="relative z-10 w-full aspect-[4/3] rounded-xl flex items-center justify-center shadow-2xl overflow-hidden border border-outline-variant/30 group">
            <img 
              src="/images/landing_hero_3d_1779176557918.png" 
              alt="MintFlow Node Architecture" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
        </div>
      </section>

      {/* ── Trust Bar ── */}
      <section className="py-section bg-surface-container-low border-y border-outline-variant/20">
        <div className="max-w-7xl mx-auto px-lg">
          <p className="text-center font-body-md text-body-md text-outline uppercase tracking-widest mb-lg font-bold">
            Powered By Modern Infrastructure
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-lg opacity-70">
            {[
              { icon: 'layers', label: 'Base Sepolia' },
              { icon: 'bolt',   label: 'UGF Abstraction' },
              { icon: 'shield', label: 'Secure Wallet' },
              { icon: 'speed',  label: 'Gasless Tx' },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center gap-sm text-center">
                <span className="material-symbols-outlined fill text-[32px]">{item.icon}</span>
                <span className="font-heading-lg text-heading-lg">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features Grid (Interactive 8-Side Format) ── */}
      <section className="py-hero px-lg max-w-7xl mx-auto relative">
        <div className="text-center mb-xl space-y-sm">
          <h2 className="font-display-md text-3xl md:text-display-md text-primary">Designed for Humans</h2>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mx-auto">
            We abstracted away the complex blockchain mechanics so you can focus on building your community and delivering value.
          </p>
        </div>

        <div className="relative w-full max-w-5xl mx-auto">
          {/* Grid Layout: 3 columns (Left Cards, Image, Right Cards) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-lg items-center relative z-10">
            
            {/* Center Image (Visible on Desktop) */}
            <div className="hidden md:block col-start-2 row-start-1 row-span-3 relative h-[500px]">
              <div className="absolute inset-0 bg-primary/20 blur-[60px] rounded-full" />
              <img 
                src="/images/landing_about_product_1779176646242.png" 
                alt="Digital Dashboard" 
                className="w-full h-full object-contain relative z-10 drop-shadow-2xl animate-[float_6s_ease-in-out_infinite]"
              />
            </div>

            {/* Feature Cards */}
            {features.map((f) => (
              <div 
                key={f.title} 
                className={`bg-surface-container rounded-2xl p-lg border border-outline-variant/30 hover:border-primary/50 hover:shadow-lg transition-all duration-300 transform cursor-pointer ${f.pos} ${activeFeature === f.id ? 'scale-105 bg-surface-container-high' : 'hover:-translate-y-1'}`}
                onMouseEnter={() => setActiveFeature(f.id)}
                onMouseLeave={() => setActiveFeature(null)}
              >
                <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container mb-md">
                  <span className="material-symbols-outlined">{f.icon}</span>
                </div>
                <h3 className="font-heading-lg text-heading-lg text-on-surface mb-sm">{f.title}</h3>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">{f.desc}</p>
                <div className="mt-md text-secondary font-bold text-sm uppercase flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  Learn more <span className="material-symbols-outlined text-[16px]">arrow_right_alt</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works (Step-by-Step Pipeline) ── */}
      <section className="py-hero px-lg max-w-7xl mx-auto bg-surface-bright rounded-3xl mb-section overflow-hidden border border-outline-variant/20 shadow-sm">
        <div className="text-center mb-xl space-y-sm">
          <h2 className="font-display-md text-3xl md:text-display-md text-primary">How It Works</h2>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mx-auto">
            Your users follow a simple, 5-step journey that feels like Web2 but owns like Web3.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-xl">
          {/* Image */}
          <div className="w-full lg:w-1/2 relative h-[400px]">
            <img 
              src="/images/landing_how_it_works_1779176714127.png" 
              alt="Transaction Flow" 
              className="w-full h-full object-cover rounded-2xl shadow-xl"
            />
          </div>

          {/* Vertical Pipeline */}
          <div className="w-full lg:w-1/2 relative">
            <div className="absolute left-6 top-8 bottom-8 w-1 bg-outline-variant/30 rounded-full" />
            <div className="space-y-lg relative z-10">
              {/* eslint-disable-next-line no-unused-vars */}
              {steps.map((step, idx) => (
                <div key={step.num} className="flex gap-md group">
                  <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center font-bold text-on-surface-variant group-hover:bg-secondary-container group-hover:text-on-secondary-container transition-colors ring-8 ring-surface-bright flex-shrink-0 shadow-sm border border-outline-variant/20">
                    {step.num}
                  </div>
                  <div className="pt-2">
                    <h3 className="font-bold text-on-surface text-lg mb-1">{step.title}</h3>
                    <p className="text-on-surface-variant">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Collector Showcase ── */}
      <section className="py-section px-lg max-w-7xl mx-auto border-t border-surface-variant">
        <div className="text-center mb-xl space-y-sm">
          <h2 className="font-display-md text-3xl md:text-display-md text-primary">Collector Showcase</h2>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mx-auto">
            Premium NFT badge examples minted seamlessly via MintFlow.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
          {showcaseItems.map((item) => (
            <div key={item.label} className="group rounded-3xl overflow-hidden bg-surface-container shadow-sm hover:shadow-md transition-all border border-outline-variant/10">
              <div className={`aspect-square bg-gradient-to-br ${item.from} ${item.to} p-6 relative flex items-center justify-center`}>
                <span className="material-symbols-outlined fill text-[80px] text-on-primary mix-blend-overlay group-hover:scale-110 transition-transform duration-500">{item.icon}</span>
              </div>
              <div className="p-md text-center">
                <h3 className="font-heading-lg text-heading-lg text-on-surface">{item.label}</h3>
                <p className="text-sm text-on-surface-variant mt-1">Minted on Base Sepolia</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
}
