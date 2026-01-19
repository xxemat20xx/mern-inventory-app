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
  Menu
} from "lucide-react";


const SidebarItem = ({icon, label, active, onClick}) => {
  return (
    <button 
    onClick={onClick}
    className={`flex items-center width-full px-4 py-3 text-sm font-medium 
      rounded-lg mb-1 
      ${active
        ? "bg-gray-200 text-gray-900"
        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
      }`
    }
      >
        <span className="mr-3">{icon}</span>
        {label}
      </button>
  )
}
const Layout = ({ children }) => {
  const { user, logout, currentView, setCurrentView } = useAuthStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // const isAdmin = user?.role === "admin";

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
        className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-slate-200 transform transition-transform duration-200 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}      
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
             <SidebarItem
              icon={<LayoutDashboard size={16} />}
              label="Dashboard"
              active={currentView === ViewState.DASHBOARD}
              onClick={() => setCurrentView(ViewState.DASHBOARD)}
             />
              <SidebarItem
              icon={<Package size={16} />}
              label="Inventory"
              active={currentView === ViewState.INVENTORY}
              onClick={() => setCurrentView(ViewState.INVENTORY)}
             />
             <SidebarItem
              icon={<ShoppingCart size={16} />}
              label="Terminal"
              active={currentView === ViewState.TERMINAL}
              onClick={() => setCurrentView(ViewState.TERMINAL)}
              />
             <SidebarItem
              icon={<BarChart3 size={16} />}
              label="Analytics"
              active={currentView === ViewState.ANALYTICS}
              onClick={() => setCurrentView(ViewState.ANALYTICS)}
             />
              <SidebarItem
              icon={<TrendingUp size={16} />}
              label="Sales Logs"
              active={currentView === ViewState.SALE_LOGS}
              onClick={() => setCurrentView(ViewState.SALE_LOGS)}
             />
              <SidebarItem
              icon={<FileBox size={16} />}
              label="Stock Logs"
              active={currentView === ViewState.STOCK_LOGS}
              onClick={() => setCurrentView(ViewState.STOCK_LOGS)}
             />
          
          </nav>

          <div className="p-4 border-t border-slate-200">
            <div className="flex items-center mb-4 px-2">
               <div className="ml-3 overflow-hidden">
                <p className="text-sm font-medium text-slate-900 truncate">{user?.name}</p>
                <p className="text-xs text-slate-500 truncate capitalize">{user?.role}</p>
              </div>
            <button 
              onClick={logout}
              className="flex items-center w-full px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
            >
              <LogOut size={18} className="mr-2" />
              Sign Out
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