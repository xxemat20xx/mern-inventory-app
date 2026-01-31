import { Routes, Route, Navigate } from "react-router-dom";
import {useAuthStore} from "./store/useAuthStore"
import { useEffect } from "react"

// components
import Navbar from "./component/Navbar";
import { Loading } from "./component/Loading";

// pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import Terminal from "./pages/Terminal";
import SalesLogs from "./pages/SalesLogs";
import StockLogs from "./pages/StockLogs";

const App = () => {
  const { user, isAuthenticated, checkAuth} = useAuthStore();
  
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if(!isAuthenticated) return <Login />
  if (!user) return <div>Loading...</div>;

  return (
    <Navbar>
      <Routes>
        {/* Admin routes */}
        {user?.role === "admin" && (
          <>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/stock" element={<StockLogs />} />
          </>
        )}

        {/* Shared routes */}
        <Route path="/terminal" element={<Terminal />} />
        <Route path="/sales" element={<SalesLogs />} />

        {/* Fallback */}
        <Route
          path="*"
          element={
            <Navigate
              to={user?.role === "admin" ? "/dashboard" : "/terminal"}
              replace
            />
          }
        />
      </Routes>
    </Navbar>
  );
}

export default App