import { useState, useEffect, useRef } from 'react';
import Accordion from '../components/ui/Accordion';

const categories = [
  { icon: 'rocket_launch', title: 'Getting Started',  desc: 'Basic concepts and onboarding.' },
  { icon: 'shield',        title: 'Wallet Safety',    desc: 'Security practices and non-custodial care.' },
  { icon: 'local_gas_station', title: 'Gas Fees',     desc: 'How our abstraction layer covers your costs.' },
  { icon: 'token',         title: 'Minting',          desc: 'Creating and managing your credentials.' },
  { icon: 'build',         title: 'Troubleshooting',  desc: 'Fixes for common errors and network issues.' },
  { icon: 'lock',          title: 'Security',         desc: 'Audits, zero-knowledge proofs, and privacy.' },
];

const faqs = [
  { q: "Do I need ETH or MATIC to use MintFlow?", a: "No. MintFlow utilizes a Universal Gas Framework (UGF) that automatically abstracts and covers all network gas fees. You do not need to fund your wallet with any native blockchain tokens to mint or interact with credentials." },
  { q: "Is MintFlow non-custodial?", a: "Yes. MintFlow never has access to your private keys. All credentials are minted directly to your connected wallet address (e.g., via MetaMask or a social login embedded wallet). You maintain 100% ownership and control over your digital assets." },
  { q: "Which blockchains does MintFlow support?", a: "Currently, MintFlow primarily operates on Base and Arbitrum to ensure near-instant finality and low underlying costs for our UGF. We are actively expanding support to other EVM-compatible L2s." },
  { q: "What happens if a transaction fails?", a: "In the rare event of a network-level failure, our relayer network will automatically attempt to re-broadcast the transaction up to 3 times. If it still fails, the UI will revert to a safe state, and you will not lose any funds." },
  { q: "Are the NFT credentials public?", a: "Yes, by design, the credentials are public on the blockchain ledger so they can be verified by third-party employers, DAOs, or platforms. However, they only point to your wallet address, preserving your pseudonymous identity unless you choose to link it to your real name." },
];

export default function FAQPage() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi! I am the MintFlow Assistant. How can I help you today?' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMsg = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    
    // Add user msg
    setMessages(prev => [...prev, { sender: 'user', text: chatInput }]);
    setChatInput('');
    
    // Automated bot reply
    setTimeout(() => {
      setMessages(prev => [...prev, { sender: 'bot', text: 'Let me look into that for you...' }]);
      
      setTimeout(() => {
        setMessages(prev => [...prev, { sender: 'bot', text: 'I found an article that might help: "Understanding the UGF and Gas Abstraction". Would you like me to send the link?' }]);
      }, 1500);
    }, 1000);
  };

  return (
    <div className="bg-background min-h-screen pt-[124px] relative">
      {/* ── Hero ── */}
      <section className="relative w-full max-w-7xl mx-auto px-lg mb-section pt-xl pb-section bg-surface-container rounded-2xl overflow-hidden shadow-sm border border-outline-variant/10">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-secondary-container via-transparent to-transparent" />
        
        <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto">
          <span className="font-caption text-caption text-primary font-bold uppercase tracking-widest mb-sm bg-surface-container-high px-3 py-1 rounded-full border border-outline-variant/30">
            Support Center
          </span>
          <h1 className="font-display-md text-[42px] text-primary mb-md font-black">
            How can we help you today?
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant mb-xl">
            Find answers to common questions about MintFlow's gasless infrastructure, security practices, and digital credential management.
          </p>
          
          <div className="w-full max-w-2xl relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
            <input
              type="text"
              placeholder="Search for articles, guides, or troubleshooting steps..."
              className="w-full pl-12 pr-4 py-4 rounded-full bg-white border border-outline-variant/30 focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none text-on-surface transition-all shadow-sm"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-secondary-container text-on-secondary-container px-lg py-2 rounded-full font-bold hover:brightness-95 transition-colors">
              Search
            </button>
          </div>
        </div>
      </section>

      {/* ── Categories Grid ── */}
      <section className="max-w-7xl mx-auto px-lg mb-section">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
          {categories.map((cat) => (
            <div key={cat.title} className="glass-card p-lg rounded-xl flex items-start gap-md hover:-translate-y-1 hover:shadow-md transition-all cursor-pointer border border-outline-variant/10 bg-white">
              <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center flex-shrink-0 text-primary">
                <span className="material-symbols-outlined text-[24px]">{cat.icon}</span>
              </div>
              <div>
                <h3 className="font-heading-lg text-[20px] text-primary mb-xs">{cat.title}</h3>
                <p className="font-body-md text-on-surface-variant text-sm">{cat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ Accordion ── */}
      <section className="max-w-4xl mx-auto px-lg mb-section">
        <div className="text-center mb-xl">
          <h2 className="font-display-md text-[36px] text-primary mb-sm">Frequently Asked Questions</h2>
          <p className="font-body-md text-on-surface-variant">
            Everything you need to know about the MintFlow protocol and ecosystem.
          </p>
        </div>
        
        <div className="space-y-sm">
          {faqs.map((faq, i) => (
            <Accordion key={i} question={faq.q} answer={faq.a} defaultOpen={i === 0} />
          ))}
        </div>
      </section>
      
      {/* ── Contact Support Box ── */}
      <section className="max-w-3xl mx-auto px-lg mb-section">
        <div className="bg-surface-container-low p-xl rounded-2xl border border-outline-variant/30 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative z-10">
            <h3 className="font-display-md text-[28px] text-primary mb-xs">Contact Support</h3>
            <p className="font-body-md text-on-surface-variant mb-lg">Still have questions? Send us a message and our engineering team will get back to you.</p>
            
            <form className="space-y-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                <div className="flex flex-col gap-xs">
                  <label className="text-xs font-bold text-on-surface-variant">Full Name</label>
                  <input type="text" className="w-full bg-white border border-outline-variant/30 rounded-lg p-sm focus:border-secondary outline-none transition-colors" placeholder="Alex Mercer" />
                </div>
                <div className="flex flex-col gap-xs">
                  <label className="text-xs font-bold text-on-surface-variant">Email Address</label>
                  <input type="email" className="w-full bg-white border border-outline-variant/30 rounded-lg p-sm focus:border-secondary outline-none transition-colors" placeholder="alex@example.com" />
                </div>
              </div>
              <div className="flex flex-col gap-xs">
                <label className="text-xs font-bold text-on-surface-variant">Message</label>
                <textarea rows="4" className="w-full bg-white border border-outline-variant/30 rounded-lg p-sm focus:border-secondary outline-none transition-colors resize-none" placeholder="Describe how we can help you..." />
              </div>
              <button type="button" className="bg-primary text-on-primary px-xl py-sm rounded-full font-bold hover:bg-primary/90 transition-colors shadow-md w-full md:w-auto">
                Submit Request
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ── Chatbot Widget ── */}
      <div className="fixed bottom-6 right-6 z-50">
        {/* Chat Window */}
        <div className={`absolute bottom-16 right-0 w-80 bg-white rounded-2xl shadow-2xl border border-outline-variant/30 overflow-hidden transition-all duration-300 origin-bottom-right ${isChatOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}>
          <div className="bg-primary p-md flex items-center justify-between text-on-primary">
            <div className="flex items-center gap-sm">
              <span className="material-symbols-outlined">smart_toy</span>
              <span className="font-bold">MintFlow Assistant</span>
            </div>
            <button onClick={() => setIsChatOpen(false)} className="hover:opacity-70 transition-opacity">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          
          <div className="h-72 p-md bg-surface-container-lowest overflow-y-auto flex flex-col gap-sm custom-scrollbar">
            {messages.map((msg, i) => (
              <div key={i} className={`max-w-[80%] rounded-xl p-3 text-sm ${msg.sender === 'user' ? 'bg-secondary-container text-on-secondary-container self-end rounded-br-none' : 'bg-surface-container text-on-surface self-start rounded-bl-none'}`}>
                {msg.text}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          
          <form onSubmit={handleSendMsg} className="p-sm bg-white border-t border-outline-variant/20 flex gap-xs">
            <input 
              type="text" 
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-surface-container-low border-none rounded-full px-sm py-2 text-sm outline-none focus:ring-1 focus:ring-secondary/50"
            />
            <button type="submit" className="w-9 h-9 rounded-full bg-secondary text-on-primary flex items-center justify-center hover:opacity-90 transition-opacity">
              <span className="material-symbols-outlined text-[18px]">send</span>
            </button>
          </form>
        </div>

        {/* Floating Button */}
        <button 
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="w-14 h-14 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
        >
          <span className="material-symbols-outlined text-[28px]">{isChatOpen ? 'keyboard_arrow_down' : 'chat'}</span>
        </button>
      </div>

    </div>
  );
}
