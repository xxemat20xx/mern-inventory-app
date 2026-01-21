import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";

// VIEW STATE
import { ViewState } from "./types";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Terminal from "./pages/Terminal";
import SalesLogsPage from "./pages/SalesLogsPage";
import InventoryPage from "./pages/InventoryPage";
import StockLogsPage from "./pages/StockLogsPage";
import Analytics from "./pages/Analytics";

// Components
import { ProtectedRoutes } from "./components/ProtectedRoutes";
import Layout from "./components/Layout";

const App = () => {
  const { isAuthenticated, checkAuth, user } = useAuthStore();

  // 🌙 Dark Mode
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add("theme-dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("theme-dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  // 🔐 Auth check
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // 🔑 ROLE-BASED VIEW RENDERING
  const renderView = (view) => {
    // ADMIN → ALL ACCESS
    if (user?.role === "admin") {
      switch (view) {
        case ViewState.DASHBOARD:
          return <Dashboard />;
        case ViewState.INVENTORY:
          return <InventoryPage />;
        case ViewState.STOCK_LOGS:
          return <StockLogsPage />;
        case ViewState.ANALYTICS:
          return <Analytics />;
        case ViewState.TERMINAL:
          return <Terminal />;
        case ViewState.SALE_LOGS:
          return <SalesLogsPage />;
        default:
          return <Navigate to="/dashboard" replace />;
      }
    }

    // STAFF → LIMITED ACCESS
    if (user?.role === "staff") {
      if (view === ViewState.TERMINAL) return <Terminal />;
      if (view === ViewState.SALE_LOGS) return <SalesLogsPage />;

      return <Navigate to="/terminal" replace />;
    }

    return <Navigate to="/login" replace />;
  };

  // 🚫 Not authenticated
  if (!isAuthenticated) {
    return (
      <Login
        isDarkMode={isDarkMode}
        toggleTheme={() => setIsDarkMode(!isDarkMode)}
      />
    );
  }

  return (
    <Routes>
      <Route element={<ProtectedRoutes />}>
        <Route
          path="/dashboard"
          element={
            <Layout
              isDarkMode={isDarkMode}
              toggleTheme={() => setIsDarkMode(!isDarkMode)}
            >
              {renderView(ViewState.DASHBOARD)}
            </Layout>
          }
        />

        <Route
          path="/inventory"
          element={
            <Layout
              isDarkMode={isDarkMode}
              toggleTheme={() => setIsDarkMode(!isDarkMode)}
            >
              {renderView(ViewState.INVENTORY)}
            </Layout>
          }
        />

        <Route
          path="/stock-logs"
          element={
            <Layout
              isDarkMode={isDarkMode}
              toggleTheme={() => setIsDarkMode(!isDarkMode)}
            >
              {renderView(ViewState.STOCK_LOGS)}
            </Layout>
          }
        />

        <Route
          path="/analytics"
          element={
            <Layout
              isDarkMode={isDarkMode}
              toggleTheme={() => setIsDarkMode(!isDarkMode)}
            >
              {renderView(ViewState.ANALYTICS)}
            </Layout>
          }
        />

        <Route
          path="/terminal"
          element={
            <Layout
              isDarkMode={isDarkMode}
              toggleTheme={() => setIsDarkMode(!isDarkMode)}
            >
              {renderView(ViewState.TERMINAL)}
            </Layout>
          }
        />

        <Route
          path="/sales-logs"
          element={
            <Layout
              isDarkMode={isDarkMode}
              toggleTheme={() => setIsDarkMode(!isDarkMode)}
            >
              {renderView(ViewState.SALE_LOGS)}
            </Layout>
          }
        />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/terminal" replace />} />
    </Routes>
  );
};

export default App;
