import { useState } from "react";
import {useAuthStore} from "../store/useAuthStore";
import { ViewState } from "../types";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  FileBox,
  BarChart3,
  TrendingUp,
  X,
  LogOut,
  Menu,
  Sun,
  Moon
} from "lucide-react";
import { useNavigate } from "react-router-dom";


const SidebarItem = ({icon, label, active, onClick}) => {
  return (
    <button 
    onClick={onClick}
    className={`flex items-center width-full px-4 py-3 text-sm font-medium 
      rounded-lg mb-1 ` }
      style={{color: active ? 'white' : 'var(--text)', backgroundColor: active ? 'var(--primary)' : 'transparent'}}
      >
        <span className="mr-3" style={{color:'var(--text)'}}>{icon}</span>
        {label}
      </button>
  )
}
const Layout = ({ children, isDarkMode, toggleTheme }) => {
  const { logout, currentView, setCurrentView, user } = useAuthStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const isAdmin = user?.role === "admin";  
  
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
         {/* Mobile Overlay */}
          {isSidebarOpen && 
            <div 
             className="fixed inset-0 bg-black/50 z-20 lg:hidden"
             onClick={() => setIsSidebarOpen(false)}
            />
          }
      {/* Sidebar */}
        <aside
          className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-slate-200
          transform transition-transform duration-200 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0`}
          style={{ backgroundColor: 'var(--card)', color: 'var(--text)' }}
        >

        <div className="flex flex-col h-full">
          <div className="flex items-center justify-center h-16 border-b border-slate-200 px-6">
            <div className="flex items-center space-x-2 text-primary-600 font-bold text-xl">
               <span>Inventory App</span>
            </div>
            <button 
              className="ml-auto lg:hidden text-slate-500"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X size={20} />
            </button>
          </div>

          {/* NAV */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
             {isAdmin && (
               <>
                 <SidebarItem
                icon={<LayoutDashboard size={16} />}
                label="Dashboard"
                active={currentView === ViewState.DASHBOARD}
                onClick={() => {
                  setCurrentView(ViewState.DASHBOARD);
                  navigate("/dashboard");
                  setIsSidebarOpen(false);
                }}
              />
              
              <SidebarItem
              icon={<Package size={16} />}
              label="Inventory"
              active={currentView === ViewState.INVENTORY}
              onClick={() => {
                setCurrentView(ViewState.INVENTORY);
                navigate("/inventory");
                setIsSidebarOpen(false);
              }}
             />
            <SidebarItem
              icon={<BarChart3 size={16} />}
              label="Analytics"
              active={currentView === ViewState.ANALYTICS}
              onClick={() => {
                setCurrentView(ViewState.ANALYTICS);
                navigate("/analytics");
                setIsSidebarOpen(false);
              }}
             />
                           <SidebarItem
              icon={<FileBox size={16} />}
              label="Stock Logs"
              active={currentView === ViewState.STOCK_LOGS}
              onClick={() => {
                setCurrentView(ViewState.STOCK_LOGS);
                navigate("/stock-logs");
                setIsSidebarOpen(false);
              }}
             />
               </>
             )}

             <SidebarItem
              icon={<ShoppingCart size={16} />}
              label="Terminal"
              active={currentView === ViewState.TERMINAL}
              onClick={() => {
                setCurrentView(ViewState.TERMINAL);
                navigate("/terminal");
                setIsSidebarOpen(false);
              }}
              />
              <SidebarItem
              icon={<TrendingUp size={16} />}
              label="Sales Logs"
              active={currentView === ViewState.SALE_LOGS}
              onClick={() => {
                setCurrentView(ViewState.SALE_LOGS);
                navigate("/sales-logs");
                setIsSidebarOpen(false);
              }}
             />

          </nav>

          <div className="p-4 border-t border-slate-200">
            <div className="flex items-center justify-between mb-4 px-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600 text-xs">A</div>
                      <div>
                        <p className="text-[10px] font-black uppercase text-gray-400 leading-none">{user?.role.toUpperCase() || 'STAFF'}</p>
                        <p className="text-xs font-bold text-gray-700">{user?.email.split('@')[0] || 'User'}</p>
                      </div>
                    </div>
                    <button
                      onClick={toggleTheme}
                      className="p-2 rounded-lg
                      hover:bg-slate-100
                      text-slate-700 cursor-pointer"
                        style={{backgroundColor: 'var(--text)', color: 'var(--bg)'}}
                    >
                      {isDarkMode ? <Sun /> : <Moon />}
                    </button>
                    <button 
                      onClick={logout}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Logout"
                    >
                      <LogOut size={18} />
                    </button>

                  </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200">
          <div className="flex items-center font-bold text-slate-900">Inventory App</div>
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-slate-600">
            <Menu size={24} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 sm:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
export default Layout;