import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, lazy, Suspense } from 'react';
import RootLayout from '../layouts/RootLayout';

const LandingPage = lazy(() => import('../pages/LandingPage'));
const DashboardPage = lazy(() => import('../pages/DashboardPage'));
const MintPage = lazy(() => import('../pages/MintPage'));
const MarketplacePage = lazy(() => import('../pages/MarketplacePage'));
const PortfolioPage = lazy(() => import('../pages/PortfolioPage'));
const ExplorerPage = lazy(() => import('../pages/ExplorerPage'));
const BeginnerPage = lazy(() => import('../pages/BeginnerPage'));
const TransactionFlowPage = lazy(() => import('../pages/TransactionFlowPage'));
const FAQPage = lazy(() => import('../pages/FAQPage'));
const SuccessPage = lazy(() => import('../pages/SuccessPage'));

// ScrollToTop component to ensure new pages start at the top
function ScrollToTop() {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<RootLayout />}>
          <Route path="/" element={<Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}><LandingPage /></Suspense>} />
          <Route path="/dashboard" element={<Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}><DashboardPage /></Suspense>} />
          <Route path="/mint" element={<Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}><MintPage /></Suspense>} />
          <Route path="/marketplace" element={<Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}><MarketplacePage /></Suspense>} />
          <Route path="/portfolio" element={<Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}><PortfolioPage /></Suspense>} />
          <Route path="/explorer" element={<Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}><ExplorerPage /></Suspense>} />
          <Route path="/beginner" element={<Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}><BeginnerPage /></Suspense>} />
          <Route path="/transaction-flow" element={<Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}><TransactionFlowPage /></Suspense>} />
          <Route path="/faq" element={<Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}><FAQPage /></Suspense>} />
          <Route path="/success" element={<Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}><SuccessPage /></Suspense>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
