import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import {
  Package,
  LayoutDashboard,
  ShoppingCart,
  TrendingUp,
  Package2,
  PackageCheck,
  LogOut,
  Menu,
  ShieldCheck,
  UserIcon,
} from "lucide-react";

/* ---------------- CONFIG ---------------- */

const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/dashboard", adminOnly: true },
  { key: "inventory", label: "Inventory", icon: Package2, path: "/inventory", adminOnly: true },
  { key: "terminal", label: "Terminal", icon: ShoppingCart, path: "/terminal" },
  { key: "sales", label: "Purchase Logs", icon: TrendingUp, path: "/sales" },
  { key: "stock", label: "Stock Logs", icon: PackageCheck, path: "/stock", adminOnly: true },
];

/* ---------------- BUTTON ---------------- */

const NavButton = ({ item, onClick, isSidebarOpen, mobile }) => {
  const Icon = item.icon;
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex ${
        mobile ? "flex-col p-2" : "items-center gap-4 px-4 py-3"
      } rounded-lg text-slate-400 hover:bg-slate-800 transition-all`}
    >
      <Icon size={mobile ? 20 : 22} />
      {mobile ? (
        <span className="text-[10px] mt-1">{item.label}</span>
      ) : (
        isSidebarOpen && <span>{item.label}</span>
      )}
    </button>
  );
};

// ---------------- NAVBAR ----------------
const Navbar = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const isAdmin = user?.role === "admin";
  const items = NAV_ITEMS.filter((i) => isAdmin || !i.adminOnly);

  // Include logout only in mobile nav
  const mobileItems = [...items, { key: "logout", label: "Logout", icon: LogOut }];

  const handleNav = async (item) => {
    if (item.key === "logout") {
      await logout();
      navigate("/");
      return;
    }

    if (!item?.path) return;

    setActiveTab(item.key);
    navigate(item.path);
  };

  return (
    <div className="min-h-screen flex bg-slate-950 z-10">

      {/* ---------------- SIDEBAR (Desktop) ---------------- */}
      <aside className={`${isSidebarOpen ? "w-64" : "w-20"} hidden md:flex flex-col border-r bg-slate-900 transition-all no-print z-10`}>
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
            <Package className="text-white" size={24} />
          </div>
          {isSidebarOpen && (
            <span className="font-bold text-xl text-slate-50">
              Inventory App
            </span>
          )}
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {items.map((item) => (
            <NavButton
              key={item.key}
              item={item}
              isSidebarOpen={isSidebarOpen}
              onClick={() => handleNav(item)}
            />
          ))}
        </nav>

        {/* Desktop Logout Button */}
        <div className="p-4 space-y-2">
          <button
            type="button"
            onClick={handleNav.bind(null, { key: "logout" })}
            className="w-full flex items-center gap-4 px-4 py-3 text-rose-500 rounded-lg hover:bg-rose-900/20"
          >
            <LogOut />
            {isSidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* ---------------- MOBILE NAV ---------------- */}
      <div className="no-print md:hidden fixed bottom-0 inset-x-0 z-50 flex justify-around bg-slate-900 border-t">
        {mobileItems.map((item) => (
          <NavButton
            key={item.key}
            item={item}
            mobile
            onClick={() => handleNav(item)}
          />
        ))}
      </div>

      {/* ---------------- MAIN ---------------- */}
      <main className="flex-1 flex flex-col">
        <header className="no-print h-16 flex items-center justify-between px-6 border-b bg-slate-900">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setIsSidebarOpen((v) => !v)}
              className="hidden md:block"
            >
              <Menu size={22} className="text-slate-50" />
            </button>

            <h1 className="capitalize font-semibold text-slate-300">
              {activeTab}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm text-slate-50">{user?.email || "user@gmail.com"}</p>
              <p className="text-xs uppercase text-slate-300">{user?.role || "Staff"}</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center">
              {user?.role === "admin" ? <ShieldCheck /> : <UserIcon />}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">{children}</div>
      </main>
    </div>
  );
};


export default Navbar;
