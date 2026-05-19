const ledgerRows = [
  { action: 'Gas Paid by UGF',    tx: '0x82...a9f2', amount: '-$4.12 USD',  time: '2s ago',  amountColor: 'text-secondary' },
  { action: 'Validator Reward',   tx: 'Node: ugf-relay-001', amount: '+$0.84 USD', time: '12s ago', amountColor: 'text-primary' },
  { action: 'Gas Paid by UGF',    tx: '0x4f...d3e1', amount: '-$2.88 USD',  time: '45s ago', amountColor: 'text-secondary' },
];

const relayers = [
  { id: 'ugf-relay-001', location: 'Singapore-A', capacity: 84, uptime: '99.98%' },
  { id: 'ugf-relay-002', location: 'London-C',    capacity: 62, uptime: '99.94%' },
  { id: 'ugf-relay-003', location: 'NYC-West',    capacity: 91, uptime: '99.99%' },
];

export default function ExplorerPage() {
  return (
    <div className="bg-background min-h-screen">
      <main className="pt-hero px-lg max-w-7xl mx-auto">

        {/* ── Hero ── */}
        <section className="flex flex-col lg:flex-row items-center gap-xl mb-section">
          <div className="flex-1 space-y-md">
            <div className="flex items-center gap-sm flex-wrap">
              <span className="flex items-center gap-xs bg-secondary-container text-on-secondary-container px-md py-xs rounded-full font-bold text-caption">
                <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" /> Network Live
              </span>
              <span className="bg-surface-container-high text-on-surface-variant px-md py-xs rounded-full font-bold text-caption">
                Latency: 14ms
              </span>
            </div>
            <h1 className="font-display-xl text-display-xl text-primary max-w-2xl leading-[0.85] tracking-[-0.02em]">
              Infrastructure Pulse
            </h1>
            <p className="text-on-surface-variant text-heading-lg font-heading-lg max-w-xl">
              Real-time transparency into the backbone of decentralized finance. Monitor nodes, verify savings, and track the flow of value.
            </p>
          </div>
          <div className="flex-1 w-full aspect-square bg-surface-container rounded-xl overflow-hidden relative shadow-sm flex items-center justify-center">
            <div className="grid grid-cols-3 gap-4 p-6 w-full h-full">
              {[...Array(9)].map((_, i) => (
                <div key={i} className={`rounded-xl flex items-center justify-center transition-all duration-1000 ${i === 4 ? 'bg-primary-container/30 scale-110' : 'bg-surface-container-high'}`}>
                  <span className={`material-symbols-outlined ${i === 4 ? 'text-primary text-[36px]' : 'text-on-surface-variant/30 text-[24px]'}`}>
                    {i === 4 ? 'hub' : i % 3 === 0 ? 'storage' : 'memory'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Metrics ── */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-md mb-xl">
          {[
            { label: 'Active Validators', value: '4,208', icon: 'trending_up', sub: '+12% this month', color: 'text-secondary' },
            { label: 'Network Latency',   value: '14ms',  icon: 'bolt',        sub: 'Optimized Route',  color: 'text-secondary' },
          ].map((m) => (
            <div key={m.label} className="bg-surface-container-low p-xl rounded-xl border border-outline-variant/30 flex flex-col gap-xs">
              <span className="text-on-surface-variant font-body-md">{m.label}</span>
              <span className="font-display-md text-display-md text-primary">{m.value}</span>
              <div className={`flex items-center gap-xs ${m.color} mt-xs`}>
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>{m.icon}</span>
                <span className="text-caption font-bold">{m.sub}</span>
              </div>
            </div>
          ))}
          <div className="bg-secondary-container p-xl rounded-xl flex flex-col gap-xs">
            <span className="text-on-secondary-container font-body-md font-bold">Global Health</span>
            <span className="font-display-md text-display-md text-on-secondary-container">99.9%</span>
            <div className="flex items-center gap-xs text-on-secondary-container mt-xs">
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>verified_user</span>
              <span className="text-caption font-bold">Zero Downtime Detected</span>
            </div>
          </div>
        </section>

        {/* ── Live Feed + Cost Savings ── */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-xl mb-section">
          {/* Ledger */}
          <div className="flex flex-col gap-md">
            <div className="flex justify-between items-end px-sm">
              <h2 className="font-heading-lg text-heading-lg text-primary">Operational Ledger</h2>
              <span className="text-caption text-on-surface-variant">Real-time Feed</span>
            </div>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-outline-variant/20">
              <div className="divide-y divide-outline-variant/10">
                {ledgerRows.map((row, i) => (
                  <div key={i} className="p-md flex justify-between items-center hover:bg-surface-container-low transition-colors">
                    <div className="flex items-center gap-md">
                      <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-on-primary-fixed">
                        <span className="material-symbols-outlined">payments</span>
                      </div>
                      <div>
                        <p className="font-bold text-on-surface">{row.action}</p>
                        <p className="text-caption text-on-surface-variant">{row.tx}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${row.amountColor}`}>{row.amount}</p>
                      <p className="text-caption text-on-surface-variant">{row.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full py-md text-center text-primary font-bold hover:bg-surface-container-high transition-colors">
                View All Activity
              </button>
            </div>
          </div>

          {/* Cost Savings */}
          <div className="bg-primary-container text-on-primary-container p-xl rounded-xl flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 p-xl opacity-20">
              <span className="material-symbols-outlined" style={{ fontSize: '160px' }}>monitoring</span>
            </div>
            <div className="relative z-10">
              <h2 className="font-heading-lg text-heading-lg mb-sm">Cost Savings Analytics</h2>
              <p className="opacity-80 max-w-xs mb-xl">Total infrastructure expenses absorbed by MintFlow's Universal Gas Fund.</p>
              <div className="space-y-xl">
                <div>
                  <span className="text-caption uppercase tracking-widest font-bold opacity-60">Total Gas Abstracted</span>
                  <p className="font-display-md text-display-md text-secondary-container">$1,284,902.42</p>
                </div>
                <div className="flex gap-xl">
                  <div><span className="text-caption font-bold opacity-60">Avg. Savings / Tx</span><p className="text-heading-lg font-heading-lg">$3.14</p></div>
                  <div><span className="text-caption font-bold opacity-60">Active Users Saved</span><p className="text-heading-lg font-heading-lg">142k</p></div>
                </div>
              </div>
            </div>
            <div className="mt-xl relative z-10">
              <button className="bg-secondary-container text-on-secondary-container px-lg py-sm rounded-full font-bold hover:brightness-95 transition-colors">
                Download Report
              </button>
            </div>
          </div>
        </section>

        {/* ── Global Grid Table ── */}
        <section className="mb-section">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-md mb-xl">
            <div>
              <h2 className="font-display-md text-display-md text-primary">Global Grid</h2>
              <p className="text-on-surface-variant text-heading-lg font-heading-lg">Active Relayer Operations</p>
            </div>
            <div className="flex items-center gap-sm bg-surface-container-high p-xs rounded-full">
              <button className="bg-white px-md py-xs rounded-full shadow-sm font-bold text-primary text-sm">Active</button>
              <button className="px-md py-xs rounded-full text-on-surface-variant hover:text-primary transition-colors text-sm">Maintenance</button>
              <button className="px-md py-xs rounded-full text-on-surface-variant hover:text-primary transition-colors text-sm">Idle</button>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-outline-variant/20 overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-surface-container-low text-on-surface-variant text-caption font-bold border-b border-outline-variant/10">
                  {['Relayer ID', 'Location', 'Capacity', 'Uptime', 'Status', ''].map((h) => (
                    <th key={h} className={`px-xl py-md ${h === '' ? 'text-right' : ''}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {relayers.map((r) => (
                  <tr key={r.id} className="hover:bg-surface-container-lowest transition-colors">
                    <td className="px-xl py-lg font-bold">{r.id}</td>
                    <td className="px-xl py-lg text-on-surface-variant">{r.location}</td>
                    <td className="px-xl py-lg">
                      <div className="w-full h-2 bg-surface-container-high rounded-full">
                        <div className="bg-secondary h-full rounded-full" style={{ width: `${r.capacity}%` }} />
                      </div>
                    </td>
                    <td className="px-xl py-lg font-bold">{r.uptime}</td>
                    <td className="px-xl py-lg">
                      <span className="px-md py-xs rounded-full bg-secondary-container text-on-secondary-container font-bold text-caption">Operational</span>
                    </td>
                    <td className="px-xl py-lg text-right">
                      <button className="text-primary font-bold hover:underline">Details</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
