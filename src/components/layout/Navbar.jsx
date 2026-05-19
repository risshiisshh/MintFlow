import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/' }, // Can link to an anchor later if needed
  { label: 'Demo', to: '/transaction-flow' },
  { label: 'Marketplace', to: '/marketplace' },
  { label: 'Mint NFT', to: '/mint' },
];

export default function Navbar({ onMenuToggle }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`fixed top-0 w-full z-40 px-4 transition-all duration-300 pointer-events-none ${isScrolled ? 'pt-2 pb-2' : 'pt-4 pb-2'}`}>
      <nav className={`mx-auto max-w-7xl backdrop-blur-md border border-outline-variant/30 shadow-card pointer-events-auto transition-all duration-300 rounded-full ${isScrolled ? 'bg-white/50' : 'bg-white/80'}`}>
        <div className={`flex justify-between items-center px-lg transition-all duration-300 ${isScrolled ? 'h-[60px] py-2' : 'h-[72px] py-xs'}`}>

          {/* Left: Hamburger + Logo */}
          <div className="flex items-center gap-sm">
            <button 
              onClick={onMenuToggle}
              className="p-2 text-on-surface-variant hover:text-primary transition-colors rounded-full hover:bg-surface-container"
            >
              <span className="material-symbols-outlined text-[24px]">menu</span>
            </button>
            
            <Link to="/" className="flex items-center gap-xs ml-xs">
              <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center">
                <span className="material-symbols-outlined fill text-secondary-container text-[18px]">token</span>
              </div>
              <span className="font-display-md text-[20px] font-black text-primary tracking-tight hidden sm:block">MintFlow</span>
            </Link>
          </div>

          {/* Center: Productivity Nav (desktop) */}
          <div className="hidden lg:flex items-center gap-2">
            {navLinks.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className={`px-4 py-2 text-sm font-bold transition-all rounded-full ${
                  isActive(item.to)
                    ? 'bg-surface-container-low text-primary'
                    : 'text-on-surface-variant hover:bg-surface-container-low hover:text-primary'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-sm">
            {/* Notification Dropdown */}
            <div className="relative">
              <button 
                onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }}
                className="p-2 text-on-surface-variant hover:text-primary transition-colors relative"
              >
                <span className="material-symbols-outlined text-[24px]">notifications</span>
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full" />
              </button>
              
              {showNotifications && (
                <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-xl shadow-modal border border-outline-variant/30 py-2 z-50">
                  <div className="px-4 py-2 border-b border-outline-variant/20">
                    <span className="font-bold text-sm text-on-surface">Notifications</span>
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    <div className="px-4 py-3 hover:bg-surface-container-low cursor-pointer transition-colors">
                      <p className="text-sm font-medium text-on-surface">Gasless Mint Successful</p>
                      <p className="text-xs text-on-surface-variant mt-0.5">Your Genesis Pass has been minted.</p>
                    </div>
                    <div className="px-4 py-3 hover:bg-surface-container-low cursor-pointer transition-colors">
                      <p className="text-sm font-medium text-on-surface">New Feature: Demo Mode</p>
                      <p className="text-xs text-on-surface-variant mt-0.5">Check out how our UGF engine works.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/mint"
              className="bg-secondary-container text-on-secondary-container px-md py-2 rounded-full font-bold text-sm hover:brightness-95 transition-all active:scale-95 shadow-sm whitespace-nowrap hidden sm:block"
            >
              Connect Wallet
            </Link>

            {/* Profile Dropdown */}
            <div className="relative ml-xs">
              <div 
                onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }}
                className="w-9 h-9 rounded-full bg-surface-container-high border border-outline-variant/30 flex items-center justify-center overflow-hidden cursor-pointer hover:border-primary transition-colors"
              >
                <span className="material-symbols-outlined text-on-surface-variant">account_circle</span>
              </div>

              {showProfile && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-modal border border-outline-variant/30 py-2 z-50">
                  <div className="px-4 py-3 border-b border-outline-variant/20">
                    <p className="font-bold text-sm text-on-surface">Alex Mercer</p>
                    <p className="text-xs text-on-surface-variant font-mono mt-0.5">0x71C...3E4b</p>
                  </div>
                  <div className="py-1">
                    <Link to="/portfolio" className="flex items-center gap-sm px-4 py-2 text-sm text-on-surface hover:bg-surface-container-low transition-colors">
                      <span className="material-symbols-outlined text-[18px]">account_box</span> My Profile
                    </Link>
                    <Link to="/dashboard" className="flex items-center gap-sm px-4 py-2 text-sm text-on-surface hover:bg-surface-container-low transition-colors">
                      <span className="material-symbols-outlined text-[18px]">dashboard</span> Dashboard
                    </Link>
                    <button className="w-full flex items-center gap-sm px-4 py-2 text-sm text-error hover:bg-surface-container-low transition-colors text-left mt-1 border-t border-outline-variant/10">
                      <span className="material-symbols-outlined text-[18px]">logout</span> Disconnect
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
