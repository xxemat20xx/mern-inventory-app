import {  useState } from "react"
import { useAuthStore } from "../store/useAuthStore"
import { useNavigate } from "react-router-dom"

import Dashboard from "../pages/Dashboard"
//icons
import { Package,
    LayoutDashboard,
    ShoppingCart,
    ChartColumn,
    TrendingUp,
    Package2,
    PackageCheck,
    Sun,
    Moon,
    LogOut,
    Menu,
    ShieldCheck,
    UserIcon
    
 } from "lucide-react"
const Navbar = ({children}) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [activeTab, setActiveTab] = useState("dashboard");
    const {user, logout} = useAuthStore();

    const isAdmin = user?.role === "admin"

    const navigate = useNavigate();

    const handleLogout = async() => {
        await logout();
    }
  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
        {/* sidebar */}
        <aside
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } no-print hidden md:flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all duration-300 ease-in-out z-30`}
        >
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <Package className="text-white" size={24} />
          </div>
          {isSidebarOpen && (
            <span className="font-bold text-xl tracking-tight">
              SwiftStock
            </span>
          )}
        </div>
        <nav className="flex-1 px-4 py-4 space-y-2">
            {isAdmin && 
             (
                <>
                 <button 
                 onClick={() => {
                    setActiveTab("dashboard")
                    navigate("/dashboard")
                 }}
                 className="w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-80">
                <LayoutDashboard size={22} className="text-slate-500 dark:text-slate-400"/>
                {isSidebarOpen && <span>Dashboard</span>}

            </button>

             <button 
             onClick={() => {
                setActiveTab("inventory")
                navigate("/inventory")
              }}
             className="w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-80">
                <Package2 size={22} className="text-slate-500 dark:text-slate-400"/>
                {isSidebarOpen && <span>Inventory</span>}
            </button>

             <button 
                onClick={() => {
                    setActiveTab("terminal")
                    navigate("/terminal")
                }}
             className="w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-80">
                <ShoppingCart size={22} className="text-slate-500 dark:text-slate-400"/>
                {isSidebarOpen && <span>Terminal</span>}
            </button>

             <button 
                onClick={() => {
                    setActiveTab("analytics")
                    navigate("/analytics")
                }}
             className="w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-80">
                <ChartColumn size={22} className="text-slate-500 dark:text-slate-400"/>
                {isSidebarOpen && <span>Analytics</span>}
            </button>

             <button 
                onClick={() => {
                    setActiveTab("sales")
                    navigate("/sales")
                }}
             className="w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-80">
                <TrendingUp size={22} className="text-slate-500 dark:text-slate-400"/>
                {isSidebarOpen && <span>Sales Logs</span>}
            </button>
            
             <button 
                onClick={() => {
                    setActiveTab("stock")
                    navigate("/stock")
                }}
             className="w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-80">
                <PackageCheck size={22} className="text-slate-500 dark:text-slate-400"/>
                {isSidebarOpen && <span>Stock Logs</span>}
            </button>
                </>
             )}
           {/* staff view */}
           {!isAdmin && (
            <>
             <button 
                onClick={() => {
                    setActiveTab("terminal")
                    navigate("/terminal")
                }}
             className="w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-80">
                <ShoppingCart size={22} className="text-slate-500 dark:text-slate-400"/>
                {isSidebarOpen && <span>Terminal</span>}
            </button>
             <button 
                onClick={() => {
                    setActiveTab("sales")
                    navigate("/sales")
                }}
             className="w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-80">
                <TrendingUp size={22} className="text-slate-500 dark:text-slate-400"/>
                {isSidebarOpen && <span>Sales Logs</span>}
            </button>
            </>
           )}
        </nav>

        {/* Sidenav Footer */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
                <button
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                >
                    {isDarkMode ? <Sun size={22} /> : <Moon size={22} />}
                    {isSidebarOpen && (
                    <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
                    )}
                </button>
            <button
                onClick={handleLogout}
                className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all"
            >
                <LogOut size={22} />
                {isSidebarOpen && <span>Logout</span>}
            </button>
          </div>
        </aside>
        {/* Mobile view */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-around z-40 px-2 no-print">
            {isAdmin && 
            (
                <>
                 <button className="flex flex-col items-center justify-center p-2 rounded-lg transition-all
                text-slate-500 dark:text-slate-400">
                    <LayoutDashboard size={20}/>
                    <span className="text-[10px] mt-1">Dashboard</span>
                </button>
                
                 <button className="flex flex-col items-center justify-center p-2 rounded-lg transition-all
                text-slate-500 dark:text-slate-400">
                    <Package2 size={20}/>
                    <span className="text-[10px] mt-1">Inventory</span>
                </button>

                <button className="flex flex-col items-center justify-center p-2 rounded-lg transition-all
                text-slate-500 dark:text-slate-400">
                    <ShoppingCart size={20}/>
                    <span className="text-[10px] mt-1">Terminal</span>
                </button>

                <button className="flex flex-col items-center justify-center p-2 rounded-lg transition-all
                text-slate-500 dark:text-slate-400">
                    <ChartColumn size={20}/>
                    <span className="text-[10px] mt-1">Analytics</span>
                </button>               
                
                <button className="flex flex-col items-center justify-center p-2 rounded-lg transition-all
                text-slate-500 dark:text-slate-400">
                    <TrendingUp size={20}/>
                    <span className="text-[10px] mt-1">Sales Logs</span>
                </button>  

                <button className="flex flex-col items-center justify-center p-2 rounded-lg transition-all
                text-slate-500 dark:text-slate-400">
                    <PackageCheck size={20}/>
                    <span className="text-[10px] mt-1">Stock Logs</span>
                </button>                 
                </>
            )
            }
            {!isAdmin && (
                <>
                <button className="flex flex-col items-center justify-center p-2 rounded-lg transition-all
                text-slate-500 dark:text-slate-400">
                    <ShoppingCart size={20}/>
                    <span className="text-[10px] mt-1">Terminal</span>
                </button>

                <button className="flex flex-col items-center justify-center p-2 rounded-lg transition-all
                text-slate-500 dark:text-slate-400">
                    <TrendingUp size={20}/>
                    <span className="text-[10px] mt-1">Sales Logs</span>
                </button>  
                </>
            )}
        </div>
        {/* main content */}
        <main className="flex-1 flex flex-col min-w-0 max-h-screen overflow-hidden">
        <header className="no-print h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md flex items-center justify-between px-4 md:px-8 z-20">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="hidden md:flex p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 transition-colors"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-lg font-semibold capitalize">{activeTab}</h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end mr-2">
              <span className="text-sm font-medium text-white">{user.email}</span>
              <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                {user.role}
              </span>
            </div>
            <div className="w-9 h-9 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-500">
               {user.role === 'ADMIN' ? (
                <ShieldCheck size={20} />
              ) : (
                <UserIcon size={20} />
              )}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
           {children}
        </div>
      </main>
    </div>
  )
}

export default Navbar