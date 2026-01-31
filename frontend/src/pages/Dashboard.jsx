import React, { useMemo, useEffect,useState } from 'react';
import { Loading } from '../component/Loading'
import { 
  TrendingUp, 
  Users, 
  Package, 
  AlertTriangle, 
  PhilippinePeso,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

// state/store
import { useSaleStore } from '../store/useSaleStore';
import { useInventoryStore } from '../store/useInventoryStore';


const Dashboard = () => {
  const { fetchDashboardStats, stats, isLoading } = useSaleStore();
  const { products, getProducts } = useInventoryStore();
  const [progress, setProgress] = useState(0);
  
  const lowStockItem = useMemo(() => {
    return products?.length ? products.filter(p => p.quantity <= p.lowStockAlert).slice(0, 5) : [];
  }, [products]);

  const categoryData = useMemo(() => {
    const counts = {};
    if (products?.length) {
      products.forEach(p => {
        counts[p.category] = (counts[p.category] || 0) + 1;
      });
      return Object.entries(counts).map(([name, value]) => ({
        name,
        value
      }));
    }
    return []; 
  }, [products]);

  const COLORS = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];
    
    const cards = [
       { label: 'Total Profit', value: `₱${stats.totalProfit.toLocaleString()}`, icon: PhilippinePeso, color: 'text-indigo-600', bg: 'bg-indigo-100 dark:bg-indigo-900/30', trend: '+12.5%', isUp: true },
       { label: 'Total Orders', value: stats.totalSoldItem, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-100 dark:bg-emerald-900/30', trend: '+8.2%', isUp: true },
       { label: 'Total Revenue', value: `₱${stats.totalRevenue.toLocaleString()}`, icon: Package, color: 'text-amber-600', bg: 'bg-amber-100 dark:bg-amber-900/30', trend: '-2.4%', isUp: false },
       { label: 'Low Stock Alert', value: lowStockItem.length, icon: AlertTriangle, color: 'text-rose-600', bg: 'bg-rose-100 dark:bg-rose-900/30', trend: 'Critical', isUp: false },
    ];
  useEffect(() => {
    fetchDashboardStats()
    getProducts()
  
  },[fetchDashboardStats, getProducts]);
  
  // Loader helper
  useEffect(() => {
  let interval;

    if (isLoading) {
      interval = setInterval(() => {
        setProgress(prev => (prev < 90 ? prev + 5 : prev));
      }, 300);
    } else {
      // defer reset to avoid cascading render
      const timeout = setTimeout(() => {
        setProgress(0);
      }, 0);

      return () => clearTimeout(timeout);
    }

    return () => clearInterval(interval);
  }, [isLoading]);

  
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Top Cards */}
        {isLoading && (
          <Loading
            progress={progress}
            message="Loading dashboard..."
          />
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-xl ${card.bg}`}>
                        <card.icon className={card.color} size={24} />
                    </div>
                      <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${
                        card.isUp ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20' : 'bg-rose-50 text-rose-600 dark:bg-rose-900/20'
                      }`}>
                        {card.isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                        {card.trend}
                      </div>
                </div>
                <h3 className="text-slate-300 text-sm font-medium">{card.label}</h3>
                <p className="text-slate-300 text-2xl font-bold mt-1">{card.value}</p> 
            </div>
          ))}
        </div>
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Trend */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-bold text-lg text-slate-50">Revenue Trend</h3>
            <select className="dark:bg-slate-500 border-none text-xs font-semibold rounded-lg px-3 py-1.5 focus:ring-0">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.salesData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5}/>
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(val) => `₱${val}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#818cf8' }}
                />
                <Area type="monotone" dataKey="amount" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="font-bold text-lg mb-8 text-slate-50">Inventory Split</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical">
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} width={80} />
                <Tooltip cursor={{ fill: 'transparent' }} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
         {/* Bottom Lists */}
      <div className="w-full">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="font-bold text-lg mb-6 text-slate-50">Restock Needed</h3>
          <div className="space-y-4">
            {lowStockItem.length > 0 ? lowStockItem.map((p) => (
              <div key={p._id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 font-bold">
                    {p.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-slate-50">{p.name}</h4>
                    <p className="text-xs text-slate-500">Current Stock: <span className="font-bold text-rose-500">{p.quantity}</span></p>
                  </div>
                </div>
                <div className="px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-600 text-[10px] font-bold uppercase">
                  Below Min: {p.quantity}
                </div>
              </div>
            )) : (
              <p className="text-center text-slate-500 py-8">All items are sufficiently stocked.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard