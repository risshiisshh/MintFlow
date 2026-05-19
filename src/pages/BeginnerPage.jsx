import { Link } from 'react-router-dom';

const progressSteps = ['Welcome', 'Basics', 'Why Gasless', 'Safety', 'First Mint'];

const safetyCards = [
  { icon: 'shield',     title: 'No Private Keys',       desc: 'We manage the complex security keys behind the scenes. Just log in normally.' },
  { icon: 'lock',       title: 'Secure Infrastructure', desc: 'Built on industry-leading, audited smart contracts.' },
  { icon: 'visibility', title: 'Transparent',            desc: 'Every credential is public and verifiable, but your personal data remains private.' },
];

export default function BeginnerPage() {
  return (
    <div className="bg-background min-h-screen pt-hero">
      <main className="max-w-7xl mx-auto px-md grid grid-cols-1 lg:grid-cols-12 gap-xl pb-section">

        {/* ── Sidebar Progress ── */}
        <aside className="hidden lg:block lg:col-span-3 sticky top-hero self-start">
          <div className="bg-surface-container-low rounded-xl p-md">
            <h3 className="font-heading-lg text-heading-lg text-primary mb-lg">Beginner Mode</h3>
            <ol className="space-y-sm relative before:absolute before:inset-y-0 before:left-3 before:w-0.5 before:bg-surface-variant">
              {progressSteps.map((step, i) => (
                <li key={step} className="relative flex items-center gap-sm">
                  <div className={`w-6 h-6 rounded-full border-4 border-surface-container-low flex items-center justify-center z-10 shrink-0 ${i === 0 ? 'bg-secondary-container' : 'bg-surface-variant'}`} />
                  <span className={`font-body-md ${i === 0 ? 'text-primary font-bold' : 'text-on-surface-variant'}`}>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </aside>

        {/* ── Main Content ── */}
        <div className="lg:col-span-9 space-y-section pb-section">

          {/* Section 1: Welcome */}
          <section className="bg-surface-container rounded-xl p-xl flex flex-col items-start gap-md">
            <h1 className="font-display-lg text-display-lg text-primary max-w-2xl">Web3 for Everyone.</h1>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-xl text-lg">
              Welcome to a simpler internet. No confusing wallets, no complex jargon, just your achievements securely stored and easily shared. We handle the heavy lifting of the blockchain so you can focus on building your digital identity.
            </p>
          </section>

          {/* Section 2: What is Blockchain? */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-xl items-center">
            <div className="order-2 md:order-1 space-y-md">
              <h2 className="font-display-md text-display-md text-primary">What is Blockchain?</h2>
              <p className="font-body-md text-on-surface-variant">
                Think of it as a highly secure, public digital ledger. Instead of one company holding all the records, copies are kept safely across thousands of computers. When you earn a credential on MintFlow, it's etched into this ledger forever, proving it's authentically yours.
              </p>
            </div>
            <div className="order-1 md:order-2 h-64 bg-surface-container rounded-xl flex items-center justify-center relative overflow-hidden">
              <div className="grid grid-cols-3 gap-3 p-6 w-full h-full">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className={`rounded-lg flex items-center justify-center ${i % 2 === 0 ? 'bg-surface-container-high' : 'bg-surface-variant/50'}`}>
                    <span className="material-symbols-outlined text-primary/20 text-[20px]">
                      {i % 3 === 0 ? 'storage' : i % 3 === 1 ? 'link' : 'lock'}
                    </span>
                  </div>
                ))}
              </div>
              <span className="material-symbols-outlined text-6xl text-primary-container z-10 absolute">account_balance_wallet</span>
            </div>
          </section>

          {/* Section 3: Gas Fees */}
          <section className="bg-primary-container text-on-primary rounded-xl p-xl flex flex-col md:flex-row gap-xl items-center">
            <div className="flex-1 space-y-md">
              <h2 className="font-display-md text-display-md text-secondary-container">Gas Fees, Explained.</h2>
              <p className="font-body-md text-on-primary-container/90">
                In traditional Web3, every action requires a small payment to the network, like fuel for a car. This is called a "Gas Fee." It can be unpredictable and frustrating for beginners.
              </p>
              <p className="font-body-md text-on-primary-container font-bold">
                With MintFlow, we pay the gas for you. It's completely gasless, so your experience is as smooth as using any normal app.
              </p>
            </div>
            <div className="w-full md:w-1/3 aspect-square bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm border border-secondary-container/20">
              <span className="material-symbols-outlined fill text-8xl text-secondary-container">local_gas_station</span>
            </div>
          </section>

          {/* Section 4: Safety */}
          <section className="space-y-lg">
            <h2 className="font-display-md text-display-md text-primary text-center">Your Safety First</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-md">
              {safetyCards.map((card) => (
                <div key={card.title} className="bg-surface rounded-lg p-md border border-outline-variant/30 flex flex-col items-center text-center gap-sm">
                  <span className="material-symbols-outlined text-4xl text-primary-container">{card.icon}</span>
                  <h4 className="font-heading-lg text-heading-lg text-primary">{card.title}</h4>
                  <p className="font-body-md text-caption text-on-surface-variant">{card.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 5: NFT Credentials */}
          <section className="bg-surface-variant rounded-xl p-xl grid grid-cols-1 md:grid-cols-2 gap-xl items-center">
            <div className="space-y-md">
              <h2 className="font-display-md text-display-md text-primary">What are NFT Credentials?</h2>
              <p className="font-body-md text-on-surface-variant">
                Instead of a paper certificate that can be lost or forged, an NFT credential is a permanent, digital badge of your achievement. It lives in your digital wallet and can be verified by anyone, anywhere, instantly.
              </p>
              <Link
                to="/mint"
                className="mt-sm bg-secondary-container text-on-secondary-container font-bold px-xl py-sm rounded-full inline-flex items-center gap-xs hover:brightness-95 transition-colors"
              >
                Start Your First Mint <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>
            <div className="h-64 bg-surface rounded-xl flex items-center justify-center border border-outline-variant/20 shadow-sm">
              <div className="w-36 h-48 rounded-2xl bg-gradient-to-br from-primary to-primary-container flex flex-col items-center justify-center shadow-modal">
                <span className="material-symbols-outlined fill text-[60px] text-secondary-container mb-2">workspace_premium</span>
                <p className="text-secondary-container font-bold text-xs uppercase tracking-widest">Credential</p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
