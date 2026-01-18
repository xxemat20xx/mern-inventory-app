import { useEffect } from "react";
import { ViewState } from "./types";
import { useAuthStore } from "./store/useAuthStore";

// pages
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/InventoryPage";
import Terminal from "./pages/Terminal";
import Analytics from "./pages/Analytics";
import StockLogs from "./pages/StockLogsPage";
import SalesLogs from "./pages/SalesLogsPage";
import Login from "./pages/Login";

const App = () => {
  const {
    isAuthenticated,
    isCheckingAuth,
    currentView,
    checkAuth
  } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // ⏳ Checking auth
  if (isCheckingAuth) {
    return <div>Checking authentication...</div>;
  }

  // 🔐 Not logged in
  if (!isAuthenticated) {
    return <Login />;
  }

  // 🧭 View rendering using if-else
  if (currentView === ViewState.DASHBOARD) {
    return <Dashboard />;
  }

  if (currentView === ViewState.INVENTORY) {
    return <Inventory />;
  }

  if (currentView === ViewState.TERMINAL) {
    return <Terminal />;
  }

  if (currentView === ViewState.ANALYTICS) {
    return <Analytics />;
  }

  if (currentView === ViewState.STOCK_LOGS) {
    return <StockLogs />;
  }

  if (currentView === ViewState.SALE_LOGS) {
    return <SalesLogs />;
  }

  // Fallback (safety)
  return <Dashboard />;
};

export default App;
