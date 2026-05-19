import { Link, useLocation } from 'react-router-dom';

const menuGroups = {
  Platform: [
    { label: 'Dashboard', to: '/dashboard', icon: 'space_dashboard' },
    { label: 'Explorer', to: '/explorer', icon: 'explore' },
    { label: 'My NFTs', to: '/portfolio', icon: 'collections_bookmark' },
    { label: 'Transaction Flow', to: '/transaction-flow', icon: 'account_tree' },
  ],
  Learn: [
    { label: 'Beginner Mode', to: '/beginner', icon: 'school' },
    { label: 'Gasless Tx', to: '/beginner', icon: 'local_gas_station' },
    { label: 'Web3 Basics', to: '/beginner', icon: 'menu_book' },
    { label: 'Credentials', to: '/beginner', icon: 'workspace_premium' },
  ],
  Resources: [
    { label: 'FAQ', to: '/faq', icon: 'help' },
    { label: 'Support', to: '/faq', icon: 'support_agent' },
    { label: 'Docs', to: '/faq', icon: 'description' },
  ],
};

export default function SideMenu({ isOpen, onClose }) {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-background/80 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <aside 
        className={`fixed top-0 left-0 h-full w-[300px] bg-white border-r border-outline-variant/30 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-md border-b border-outline-variant/20">
          <div className="flex items-center gap-xs">
            <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center">
              <span className="material-symbols-outlined fill text-secondary-container text-[18px]">token</span>
            </div>
            <span className="font-display-md text-[20px] font-black text-primary tracking-tight">MintFlow</span>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-surface-container transition-colors text-on-surface-variant">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto py-md custom-scrollbar">
          {Object.entries(menuGroups).map(([groupName, items]) => (
            <div key={groupName} className="mb-md px-md">
              <h3 className="text-[10px] font-bold text-outline uppercase tracking-widest mb-sm pl-sm">{groupName}</h3>
              <ul className="space-y-1">
                {items.map((item) => (
                  <li key={item.label}>
                    <Link
                      to={item.to}
                      onClick={onClose}
                      className={`flex items-center gap-sm px-sm py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive(item.to) 
                          ? 'bg-surface-container-low text-primary font-bold' 
                          : 'text-on-surface hover:bg-surface-container hover:text-primary'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[20px] opacity-70">{item.icon}</span>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer (Settings & Plan) */}
        <div className="p-md border-t border-outline-variant/20 bg-surface-container-lowest">
          <div className="mb-sm">
            <button className="w-full flex items-center gap-sm px-sm py-2 rounded-lg text-sm font-medium text-on-surface hover:bg-surface-container transition-colors">
              <span className="material-symbols-outlined text-[20px]">settings</span>
              Settings
            </button>
            <button className="w-full flex items-center gap-sm px-sm py-2 rounded-lg text-sm font-medium text-on-surface hover:bg-surface-container transition-colors">
              <span className="material-symbols-outlined text-[20px]">manage_accounts</span>
              Profile Settings
            </button>
          </div>
          
          {/* Static User Plan UI */}
          <div className="bg-surface-container rounded-xl p-sm border border-outline-variant/30 mt-sm">
            <div className="flex justify-between items-center mb-xs">
              <span className="text-xs font-bold text-on-surface">Pro Plan</span>
              <span className="text-[10px] font-bold text-secondary bg-secondary-container px-1.5 py-0.5 rounded-full">Active</span>
            </div>
            <p className="text-[10px] text-on-surface-variant mb-sm">Gas subsidies used this month</p>
            
            {/* Mock Graph */}
            <div className="h-10 flex items-end gap-1 mb-xs">
              {[40, 70, 45, 90, 60, 85, 50].map((h, i) => (
                <div key={i} className="flex-1 bg-secondary-container rounded-t-sm" style={{ height: `${h}%` }}>
                  <div className="w-full bg-primary/40 h-full rounded-t-sm" />
                </div>
              ))}
            </div>
            
            <div className="flex justify-between text-[10px] font-medium text-on-surface-variant">
              <span>0</span>
              <span>1000 Tx</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
