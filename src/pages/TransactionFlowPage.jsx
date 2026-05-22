import { useState, useEffect } from 'react';

export default function TransactionFlowPage() {
  const [activeLesson, setActiveLesson] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const lessons = [
    { title: '1. Initialization', desc: 'Understanding wallet connection and signature request.', metric: '0% Drop-off' },
    { title: '2. Gas Estimation', desc: 'UGF calculates optimal gas route across L2s.', metric: 'Sub-1s Latency' },
    { title: '3. Abstraction', desc: 'Sponsoring the transaction via Paymaster.', metric: '100% Sponsored' },
    { title: '4. Finality', desc: 'On-chain settlement and asset delivery.', metric: '100% Conversion' }
  ];

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            setIsPlaying(false);
            return 100;
          }
          const nextP = p + 1;
          setActiveLesson(Math.floor((nextP / 100) * 4) === 4 ? 3 : Math.floor((nextP / 100) * 4));
          return nextP;
        });
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleStartSimulation = () => {
    setProgress(0);
    setActiveLesson(0);
    setIsPlaying(true);
  };

  return (
    <div className="bg-background min-h-screen pt-[124px]">
      {/* ── Hero ── */}
      <header className="max-w-7xl mx-auto px-lg pb-xl flex flex-col items-center text-center">
        <div className="flex items-center gap-xs mb-md px-md py-xs bg-surface-container-low rounded-full">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary" />
          </span>
          <span className="font-caption text-caption text-secondary font-bold tracking-wider uppercase">
            Live Interactive Demo
          </span>
        </div>
        <h1 className="font-display-xl text-display-xl max-w-4xl text-primary mb-md leading-[0.85] tracking-[-0.02em]">
          Learn the invisible infrastructure
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
          Follow our study plan to understand real-time routing logic. Observe how gas-less transactions are mapped across multi-chain ecosystems, driving a guaranteed 100% conversion ratio.
        </p>
      </header>

      {/* ── Simulation Hub (Study Plan) ── */}
      <section className="max-w-7xl mx-auto px-lg mb-section">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-md bg-surface-container rounded-2xl overflow-hidden min-h-[600px] shadow-sm border border-outline-variant/20">
          
          {/* Left: Study Plan Panel */}
          <aside className="lg:col-span-4 bg-surface-container-lowest p-lg flex flex-col gap-lg border-r border-outline-variant/20 relative z-10">
            <div>
              <h3 className="font-heading-lg text-[24px] text-primary mb-xs">Study Plan</h3>
              <p className="font-caption text-caption text-on-surface-variant">Step-by-step transaction lifecycle.</p>
            </div>
            
            <div className="space-y-sm flex-1">
              {lessons.map((lesson, idx) => (
                <div 
                  key={idx} 
                  className={`p-md rounded-xl border transition-all duration-300 ${activeLesson === idx ? 'bg-secondary-container border-secondary-fixed/50 scale-[1.02] shadow-md' : 'bg-surface border-outline-variant/20 opacity-70'}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h4 className={`font-bold ${activeLesson === idx ? 'text-on-secondary-container' : 'text-on-surface'}`}>{lesson.title}</h4>
                    {activeLesson > idx && <span className="material-symbols-outlined text-secondary text-[18px]">check_circle</span>}
                  </div>
                  <p className="text-sm text-on-surface-variant mb-2">{lesson.desc}</p>
                  <div className="inline-flex items-center gap-1 bg-white/50 px-2 py-0.5 rounded text-[10px] font-bold text-primary">
                    <span className="material-symbols-outlined text-[12px]">analytics</span> {lesson.metric}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-auto pt-lg border-t border-outline-variant/10">
              <button
                onClick={handleStartSimulation}
                disabled={isPlaying}
                className={`w-full py-md rounded-full font-bold flex items-center justify-center gap-sm transition-all ${isPlaying ? 'bg-surface-variant text-on-surface-variant cursor-not-allowed' : 'bg-primary text-on-primary hover:opacity-90 shadow-md'}`}
              >
                <span className="material-symbols-outlined">{isPlaying ? 'sync' : 'play_arrow'}</span>
                {isPlaying ? 'Running Simulation...' : 'Start Learning Demo'}
              </button>
            </div>
          </aside>
          
          {/* Right: Visual Network Map & Metrics */}
          <main className="lg:col-span-8 relative flex items-center justify-center bg-surface-bright overflow-x-auto overflow-y-hidden p-md">
            {/* Top Metrics */}
            <div className="absolute top-md left-md right-md flex justify-between z-20">
               <div className="flex gap-xs">
                <div className="px-sm py-xs bg-white rounded-full text-[10px] font-bold text-primary flex items-center gap-xs shadow-sm border border-outline-variant/10">
                  <span className="material-symbols-outlined text-[14px]">sensors</span> 6.2s Total Latency
                </div>
                <div className="px-sm py-xs bg-white rounded-full text-[10px] font-bold text-primary flex items-center gap-xs shadow-sm border border-outline-variant/10">
                  <span className="material-symbols-outlined text-[14px]">memory</span> Gas Used: $0.00
                </div>
               </div>
               
               {/* 100% Conversion Badge */}
               <div className="px-md py-xs bg-secondary rounded-full text-xs font-black text-on-primary flex items-center gap-xs shadow-lg animate-pulse">
                  <span className="material-symbols-outlined text-[16px]">trending_up</span> 100% CONVERSION RATIO
               </div>
            </div>
            
            {/* Interactive Graph Canvas */}
            <div className="min-w-[600px] w-full h-full relative flex items-center justify-center">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-surface-variant/20 to-transparent" />
              
              <div className="relative z-10 w-full h-[400px] flex items-center justify-between px-[10%]">
                {/* User Node */}
                <div className={`relative flex flex-col items-center z-20 transition-transform duration-500 ${activeLesson >= 0 ? 'scale-110' : 'scale-100'}`}>
                  <div className={`w-20 h-20 rounded-2xl flex items-center justify-center bg-white shadow-lg border-2 ${activeLesson === 0 && isPlaying ? 'border-secondary shadow-secondary/20' : 'border-outline-variant/20'}`}>
                    <span className="material-symbols-outlined text-[32px] text-primary">person</span>
                  </div>
                  <p className="mt-2 font-bold text-sm text-on-surface">User App</p>
                </div>

                {/* Engine Node */}
                <div className={`relative flex flex-col items-center z-20 transition-transform duration-500 ${activeLesson >= 1 ? 'scale-110' : 'scale-100'}`}>
                  <div className={`w-28 h-28 rounded-full flex items-center justify-center bg-primary text-white shadow-xl border-4 ${activeLesson === 1 && isPlaying ? 'border-secondary shadow-secondary/40 animate-pulse' : 'border-primary-fixed'}`}>
                    <span className="material-symbols-outlined text-[48px]">hub</span>
                  </div>
                  <p className="mt-2 font-bold text-sm text-primary">MintFlow UGF</p>
                </div>

                {/* Blockchain Node */}
                <div className={`relative flex flex-col items-center z-20 transition-transform duration-500 ${activeLesson >= 3 ? 'scale-110' : 'scale-100'}`}>
                  <div className={`w-20 h-20 rounded-2xl flex items-center justify-center bg-white shadow-lg border-2 ${activeLesson === 3 && isPlaying ? 'border-secondary shadow-secondary/20' : 'border-outline-variant/20'}`}>
                    <span className="material-symbols-outlined text-[32px] text-primary">link</span>
                  </div>
                  <p className="mt-2 font-bold text-sm text-on-surface">Base Network</p>
                </div>

                {/* Connecting Lines */}
                <div className="absolute top-1/2 left-[15%] right-[15%] h-1 bg-outline-variant/20 -translate-y-1/2 z-0" />
                
                {/* Animated Data Packet */}
                {isPlaying && (
                  <div 
                    className="absolute top-1/2 w-4 h-4 rounded-full bg-secondary shadow-[0_0_15px_rgba(var(--secondary),0.8)] -translate-y-1/2 z-10"
                    style={{ left: `${15 + (progress * 0.7)}%`, transition: 'left 0.1s linear' }}
                  />
                )}
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-surface-variant">
              <div className="h-full bg-secondary transition-all duration-100 ease-linear" style={{ width: `${progress}%` }} />
            </div>
          </main>
        </div>
      </section>

      {/* ── UGF Engine 3D Deep Dive ── */}
      <section className="max-w-7xl mx-auto px-lg mb-section">
        <div className="bg-surface-container-high rounded-3xl overflow-hidden flex flex-col md:flex-row items-center border border-outline-variant/20 shadow-lg">
          <div className="md:w-1/2 p-xl flex flex-col justify-center">
            <div className="inline-flex items-center gap-xs mb-md px-md py-xs bg-primary/10 rounded-full w-fit">
              <span className="material-symbols-outlined text-primary text-[18px]">auto_awesome</span>
              <span className="font-caption text-caption text-primary font-bold tracking-widest uppercase">
                Architecture Deep Dive
              </span>
            </div>
            <h2 className="font-display-md text-display-md mb-md text-primary leading-tight">The engine behind the visibility.</h2>
            <p className="font-body-md text-body-md text-on-surface-variant mb-lg leading-relaxed">
              Our 3D visualizer demonstrates the active processor threads and performance metrics that power the Universal Gas Framework (UGF). It instantly calculates, subsidizes, and routes gas costs, ensuring a flawless experience.
            </p>
            <div className="grid grid-cols-2 gap-md">
              <div className="bg-white p-md rounded-xl border border-outline-variant/20 shadow-sm">
                <span className="material-symbols-outlined text-secondary text-[24px] mb-2">memory</span>
                <p className="font-bold text-on-surface">Thread Optimization</p>
                <p className="text-on-surface-variant text-[12px] mt-1">Multi-threaded concurrent routing.</p>
              </div>
              <div className="bg-white p-md rounded-xl border border-outline-variant/20 shadow-sm">
                <span className="material-symbols-outlined text-secondary text-[24px] mb-2">speed</span>
                <p className="font-bold text-on-surface">Peak Performance</p>
                <p className="text-on-surface-variant text-[12px] mt-1">Sustained high throughput.</p>
              </div>
            </div>
          </div>
          
          <div className="md:w-1/2 relative h-[500px] w-full bg-black flex items-center justify-center">
            {/* 3D Generated Engine Image */}
            <img 
              src="/images/demo_engine_3d_1779176799453.png" 
              alt="3D Processor Architecture" 
              className="w-full h-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-surface-container-high to-transparent w-1/3" />
          </div>
        </div>
      </section>
    </div>
  );
}
