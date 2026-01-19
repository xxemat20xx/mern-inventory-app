import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";
import { ViewState } from "./types";

// layout
import Layout from "./components/Layout";

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
    user,
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

  // 🔒 Not logged in
  if (!isAuthenticated) {
    return <Login />;
  }

  const renderView = () => {
    if (currentView === ViewState.DASHBOARD) {
      return <Dashboard />;
    } else if (currentView === ViewState.INVENTORY) {
      return <Inventory />;
    } else if (currentView === ViewState.TERMINAL) {
      return <Terminal />;
    } else if (currentView === ViewState.ANALYTICS) {
      return user?.role === "admin" ? <Analytics /> : <Dashboard />;
    } else if (currentView === ViewState.STOCK_LOGS) {
      return user?.role === "admin" ? <StockLogs /> : <Dashboard />;
    } else if (currentView === ViewState.SALE_LOGS) {
      return user?.role === "admin" ? <SalesLogs /> : <Dashboard />;
    } else {
      return <Dashboard />;
    }
  };

  return (
    <Routes>
      <Route
        path="/dashboard"
        element={<Layout>{renderView()}</Layout>}
      />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default App;
