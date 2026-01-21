import { useEffect } from "react";
import { DollarSign, ShoppingCart, TrendingUp } from "lucide-react";
import StatCard from "../components/StatCard";
import { useSaleStore } from "../store/useSaleStore";

// rechart
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  Cell,
  PieChart,
  Pie,
  Legend
} from 'recharts';

const Dashboard = () => {
  const {
    stats,
    isLoading,
    error,
    fetchDashboardStats
  } = useSaleStore();

  useEffect(() => {
    fetchDashboardStats();
  }, [fetchDashboardStats]);

  if (isLoading) return <div>Loading dashboard...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
        <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Operational Overview</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Revenue" value={`$${stats.totalRevenue.toFixed(2)}`} subtitle="Reflected real-time" icon={<DollarSign size={20} />} color="bg-emerald-600" />
        <StatCard title="Items Sold" value={stats.totalItemsSold} subtitle="Inventory throughput" icon={<ShoppingCart size={20} />} color="bg-blue-600" />
        <StatCard title="Total Profit" value={`$${stats.totalProfit.toFixed(2)}`} subtitle={`Est. Margin: ${((stats.totalProfit / stats.totalRevenue) * 100 || 0).toFixed(0)}%`} icon={<TrendingUp size={20} />} color="bg-indigo-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-80">
          <h3 className="font-bold text-gray-800 mb-4">Sales Activity</h3>
          <ResponsiveContainer width="100%" height="90%">
            <AreaChart data={stats.salesOverTime}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="time" hide />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="revenue" stroke="#4f46e5" fill="#e0e7ff" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 overflow-y-auto max-h-80">
          <h3 className="font-bold text-gray-800 mb-4">Restock Alerts</h3>
          {/* <div className="space-y-3">
            {lowStockProducts.length === 0 ? <p className="text-gray-400 text-sm italic text-center py-8">Stock levels healthy.</p> : 
              lowStockProducts.map(p => (
                <div key={p.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100">
                  <div className="flex items-center space-x-3">
                    <img src={p.image} className="w-10 h-10 rounded object-cover" />
                    <div><p className="text-sm font-bold">{p.name}</p><p className="text-xs text-gray-500">SKU: {p.sku}</p></div>
                  </div>
                  <span className="text-sm font-black text-red-600">{p.stock} units</span>
                </div>
              ))
            }
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
