export default function CredentialCard({ icon, title, issuer, trustScore, verificationRate, holders, networkStatus = 'Optimal' }) {
  return (
    <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-lg hover:border-secondary transition-all group">
      <div className="flex items-start justify-between mb-lg">
        <div className="flex items-center gap-md">
          <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container">
            <span className="material-symbols-outlined">{icon}</span>
          </div>
          <div>
            <h4 className="font-heading-lg text-heading-lg text-primary">{title}</h4>
            <p className="font-caption text-caption text-on-surface-variant">{issuer}</p>
          </div>
        </div>
        <div className="bg-secondary/10 text-secondary px-sm py-xs rounded-full font-bold text-xs whitespace-nowrap">
          {trustScore} TRUST
        </div>
      </div>
      <div className="grid grid-cols-2 gap-md mb-lg">
        <div className="bg-surface p-sm rounded-lg">
          <span className="font-caption text-caption text-on-surface-variant block mb-xs">Verification Rate</span>
          <span className="font-bold text-primary">{verificationRate}</span>
        </div>
        <div className="bg-surface p-sm rounded-lg">
          <span className="font-caption text-caption text-on-surface-variant block mb-xs">Active Holders</span>
          <span className="font-bold text-primary">{holders}</span>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-on-surface-variant font-caption text-caption">
          Network Status: <span className="text-secondary font-bold">{networkStatus}</span>
        </span>
        <button className="bg-primary text-on-primary px-lg py-xs rounded-full font-bold text-sm group-hover:bg-secondary group-hover:text-on-secondary transition-colors">
          View Ledger
        </button>
      </div>
    </div>
  );
}
