import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="w-full bg-surface-container-low border-t border-outline-variant/30 mt-section">
      <div className="max-w-7xl mx-auto px-lg py-xl flex flex-col md:flex-row justify-between items-start gap-lg">
        {/* Brand */}
        <div className="space-y-sm">
          <div className="flex items-center gap-sm">
            <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center">
              <span className="material-symbols-outlined fill text-secondary-container text-[18px]">token</span>
            </div>
            <div className="font-display-md text-[20px] font-black text-primary">MintFlow</div>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-sm">
            Built for the gasless future. Removing friction from Web3 onboarding.
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-wrap gap-xl font-body-md text-body-md">
          <div className="flex flex-col gap-sm">
            <span className="font-bold text-on-surface">Product</span>
            <Link to="/" className="text-on-surface-variant hover:text-primary transition-colors">Features</Link>
            <Link to="/marketplace" className="text-on-surface-variant hover:text-primary transition-colors">Marketplace</Link>
            <Link to="/mint" className="text-on-surface-variant hover:text-primary transition-colors">Mint NFT</Link>
          </div>
          <div className="flex flex-col gap-sm">
            <span className="font-bold text-on-surface">Platform</span>
            <Link to="/dashboard" className="text-on-surface-variant hover:text-primary transition-colors">Dashboard</Link>
            <Link to="/explorer" className="text-on-surface-variant hover:text-primary transition-colors">Explorer</Link>
            <Link to="/portfolio" className="text-on-surface-variant hover:text-primary transition-colors">Portfolio</Link>
          </div>
          <div className="flex flex-col gap-sm">
            <span className="font-bold text-on-surface">Learn</span>
            <Link to="/beginner" className="text-on-surface-variant hover:text-primary transition-colors">Beginner Mode</Link>
            <Link to="/transaction-flow" className="text-on-surface-variant hover:text-primary transition-colors">Transaction Flow</Link>
            <Link to="/faq" className="text-on-surface-variant hover:text-primary transition-colors">FAQ</Link>
          </div>
          <div className="flex flex-col gap-sm">
            <span className="font-bold text-on-surface">Legal</span>
            <a href="#" className="text-on-surface-variant hover:text-primary transition-colors">Terms</a>
            <a href="#" className="text-on-surface-variant hover:text-primary transition-colors">Privacy</a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="px-lg py-md border-t border-outline-variant/30 max-w-7xl mx-auto">
        <p className="font-body-md text-body-md text-on-surface-variant text-center">
          © 2024 MintFlow. All rights reserved. Built for the gasless future.
        </p>
      </div>
    </footer>
  );
}
