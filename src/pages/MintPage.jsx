import StepperItem from '../components/ui/StepperItem';

export default function MintPage() {
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
            <h1 className="font-display-md text-display-md text-primary mb-sm">Minting in progress</h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Your transaction is being processed on the blockchain. We're handling the network fees for you.
            </p>
          </header>

          {/* Gasless Savings Card */}
          <div className="bg-secondary-container rounded-lg p-lg relative overflow-hidden mb-xl shadow-sm">
            <div className="relative z-10">
              <h3 className="font-heading-lg text-heading-lg text-on-secondary-container mb-xs">Gasless Savings</h3>
              <div className="flex items-end gap-xs">
                <span className="font-display-md text-display-md text-on-secondary-container">$0.00</span>
                <span className="font-body-md text-on-secondary-container opacity-60 mb-xs">Fees Applied</span>
              </div>
              <p className="font-body-md text-on-secondary-container mt-sm opacity-80 italic">
                vs. $45.21 estimated traditional market cost
              </p>
            </div>
            <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-[120px] text-on-secondary-container opacity-10">savings</span>
          </div>

          {/* Transaction Progress Stepper */}
          <div className="space-y-xl relative mb-xl">
            <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-outline-variant/30" />
            <div className="absolute left-[19px] top-4 w-0.5 bg-secondary-container transition-all duration-1000" style={{ height: '60%' }} />
            <StepperItem status="complete" title="Secure Wallet Linked"   subtitle="0x71C...8e92 successfully authorized." />
            <StepperItem status="active"   title="Gas abstracted"         subtitle="MintFlow Labs is covering costs via Relayer Network." />
            <StepperItem status="pending"  title="Finalizing On-Chain"    subtitle="Broadcasting unique identifier to Ethereum." />
          </div>

          {/* Infrastructure Routing */}
          <div className="bg-surface-container-low border border-outline-variant/20 rounded-xl p-md mb-xl">
            <div className="flex items-center justify-between mb-md px-1">
              <div className="flex items-center gap-xs">
                <div className="w-2.5 h-2.5 rounded-full bg-secondary-container animate-pulse" />
                <span className="font-caption uppercase tracking-widest text-primary font-bold">Infrastructure Routing</span>
              </div>
              <span className="font-caption text-on-surface-variant">Block: 18,429,101</span>
            </div>
            <div className="grid grid-cols-1 gap-base">
              {[
                { icon: 'alt_route', label: 'Relayer Network',       status: 'ACTIVE' },
                { icon: 'key',       label: 'Account Abstraction',   status: 'ACTIVE' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between p-sm rounded-lg bg-surface-container-highest/50">
                  <div className="flex items-center gap-sm">
                    <span className="material-symbols-outlined text-secondary">{item.icon}</span>
                    <span className="font-body-md text-body-md">{item.label}</span>
                  </div>
                  <span className="text-secondary font-bold font-caption">{item.status}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Disabled CTA */}
          <div className="mt-lg">
            <button
              disabled
              className="w-full py-md bg-outline-variant/30 text-outline rounded-full flex items-center justify-center gap-sm cursor-not-allowed"
            >
              <span className="material-symbols-outlined">lock</span>
              <span>Minting in Progress...</span>
            </button>
            <p className="text-center font-caption text-on-surface-variant mt-sm">
              Powered by the <span className="font-bold text-primary">Universal Gas Framework</span>. No ETH required.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
