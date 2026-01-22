import { Routes, Route, Router, Navigate} from "react-router-dom"
import {useAuthStore} from "./store/useAuthStore"
import { useEffect } from "react"

// components
import Navbar from "./component/Navbar";

// pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import Terminal from "./pages/Terminal";
import Analytics from "./pages/Analytics";
import Sales from "./pages/Sales";
import StockLogs from "./pages/StockLogs";

const App = () => {
  const { user, isAuthenticated, checkAuth} = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if(!isAuthenticated) return <Login />


  return (
    <Navbar>
      <Routes>
        {/* Admin routes */}
        {user.role === "admin" && (
          <>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/stock" element={<StockLogs />} />
          </>
        )}

        {/* Shared routes */}
        <Route path="/terminal" element={<Terminal />} />
        <Route path="/sales" element={<Sales />} />

        {/* Fallback */}
        <Route
          path="*"
          element={
            <Navigate
              to={user.role === "admin" ? "/dashboard" : "/terminal"}
              replace
            />
          }
        />
      </Routes>
    </Navbar>
  );
}

export default App