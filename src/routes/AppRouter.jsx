import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import RootLayout from '../layouts/RootLayout';

import LandingPage from '../pages/LandingPage';
import DashboardPage from '../pages/DashboardPage';
import MintPage from '../pages/MintPage';
import MarketplacePage from '../pages/MarketplacePage';
import PortfolioPage from '../pages/PortfolioPage';
import ExplorerPage from '../pages/ExplorerPage';
import BeginnerPage from '../pages/BeginnerPage';
import TransactionFlowPage from '../pages/TransactionFlowPage';
import FAQPage from '../pages/FAQPage';
import SuccessPage from '../pages/SuccessPage';

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
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/mint" element={<MintPage />} />
          <Route path="/marketplace" element={<MarketplacePage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/explorer" element={<ExplorerPage />} />
          <Route path="/beginner" element={<BeginnerPage />} />
          <Route path="/transaction-flow" element={<TransactionFlowPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/success" element={<SuccessPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
