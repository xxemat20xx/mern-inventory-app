// import { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Filter, 
  X,
  AlertCircle,
  PackageCheck
} from 'lucide-react';
import { Loading } from '../component/Loading';
import { useInventoryStore } from '../store/useInventoryStore';
import { useEffect, useState } from 'react';

const Inventory = () => {
  const { products, getProducts, deleteProduct, createProduct, updateProduct, isLoading } = useInventoryStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(null);
  const [progress, setProgress] = useState(0);
  const [formData, setFormData] = useState({
     name: '',
     sku: '',
     price: 0,
     description:'',
     cost: 0,
     quantity: 0,
     lowStockAlert: 0,
     barcode:'',
     category:'General'
  });
  
  useEffect(() => {
    getProducts();
  }, [getProducts]);

const openModal = (product = null) => {
  if (product) {
    setIsEditing(product._id);
    setFormData({
      name: product.name ?? '',
      sku: product.sku ?? '',
      price: product.price ?? 0,
      description: product.description ?? '',
      cost: product.cost ?? 0,
      quantity: product.quantity ?? 0,
      lowStockAlert: product.lowStockAlert ?? 5,
      barcode: product.barcode ?? '',
      category: product.category ?? 'General', // ✅ KEY FIX
    });
  } else {
    setIsEditing(null);
    setFormData({
      name: '',
      sku: '',
      price: 0,
      description: '',
      cost: 0,
      quantity: 0,
      lowStockAlert: 5,
      barcode: '',
      category: 'General', // ✅
    });
  }
  setIsModalOpen(true);
};

  const handleDelete = async(id) => {
    if(confirm("Are you sure u want to delete this product?")){
      await deleteProduct(id);
      getProducts();
    }
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      category: formData.category || 'General'
    }
      if(isEditing){
        await updateProduct(isEditing, payload);
       }else{
        await createProduct(payload);
       }
       setIsModalOpen(false);
       getProducts();
  }
  const filteredProduct = products.filter(p => {
    const term = searchTerm.toLowerCase();

    return (
      p.name?.toLowerCase().includes(term) ||
      p.sku?.toLowerCase().includes(term) ||
      p.category?.toLowerCase().includes(term)
    );
  });

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
     <div className="space-y-6 animate-in fade-in duration-500">
      {/* Loading Screen */}
        {isLoading && (
          <Loading
            progress={progress}
            message="Fetching data..."
          />
        )}
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={20} />
          <input
            type="text"
            placeholder="Search by SKU, Name or Category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="dark:bg-slate-900 text-slate-50 w-full pl-12 pr-4 py-2.5 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border rounded-xl text-sm font-medium">
            <Filter size={18} /> Filter
          </button>
          <button
            onClick={openModal}
            className="text-slate-50 flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-sm font-bold"
          >
            <Plus size={18} /> Add Product
          </button>
        </div>
      </div>
      {/* Table */}
      <div className="bg-slate-900 border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
           <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-900">
                <th className="px-6 py-4 text-xs font-bold uppercase text-slate-50">Product</th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-slate-50">Category</th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-slate-50">Stock</th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-slate-50">Cost / Price</th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-slate-50">Status</th>
                <th className="px-6 py-4 text-right text-xs font-bold uppercase text-slate-50">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredProduct.map((p) => (
                <tr key={p._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 font-bold">
                        {p.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-slate-50">{p.name}</div>
                        <div className="text-xs text-slate-400 font-mono tracking-tighter">#{p.sku}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-600 dark:text-slate-400">{p.category}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-slate-50">{p.quantity}</div>
                    <div className="text-[10px] text-slate-50">Min: {p.lowStockAlert}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-500 font-medium">Cost: ₱{p.cost.toFixed(2)}</div>
                    <div className="text-sm font-bold text-indigo-600 dark:text-indigo-400">₱{p.price.toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-4">
                    {p.quantity <= 0 ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-600 text-[10px] font-bold uppercase tracking-wider">
                        <AlertCircle size={10} /> Out of Stock
                      </span>
                    ) : p.quantity <= p.lowStockAlert ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 text-[10px] font-bold uppercase tracking-wider">
                        <AlertCircle size={10} /> Low Stock
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 text-[10px] font-bold uppercase tracking-wider">
                        <PackageCheck size={10} /> Healthy
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => openModal(p)}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-all"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(p._id)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
           </table>
        </div>
      </div>
        {/* -------------------------- MODAL -------------------- */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
              <div className="dark:bg-slate-900 rounded-2xl w-full max-w-2xl p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-slate-50">
                    {isEditing ? 'Edit Product' : 'Add Product'}
                  </h2>
                  <button onClick={() => setIsModalOpen(false)}
                    className='text-slate-50'>
                    <X />
                  </button>
                </div>   
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-50 ">SKU / Barcode</label>
                    <input 
                      required
                      type="text" 
                      value={formData.sku}
                      onChange={(e) => setFormData({...formData, sku: e.target.value})}
                      className="text-slate-50 w-full px-4 py-3 rounded-xl dark:bg-slate-800 border-none focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-50">Product Name</label>
                    <input 
                      required
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="text-slate-50 w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Category</label>
                    <select 
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="text-slate-50 w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-indigo-500 outline-none"
                    >
                      <option>General</option>
                      <option>Beverages</option>
                      <option>Bakery</option>
                      <option>Electronics</option>
                      <option>Home</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Cost Price</label>
                      <input 
                        required
                        type="number" 
                        step="0.01"
                        value={formData.cost}
                        onChange={(e) => setFormData({...formData, cost: parseFloat(e.target.value)})}
                        className="text-slate-50 w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Sale Price</label>
                      <input 
                        required
                        type="number" 
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                        className="text-slate-50 w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Min Alert</label>
                      <input 
                        required
                        type="number" 
                        value={formData.lowStockAlert}
                        onChange={(e) => setFormData({...formData, lowStockAlert: parseInt(e.target.value)})}
                        className="text-slate-50 w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Quantity</label>
                      <input 
                        required
                        type="number" 
                        value={formData.quantity}
                        onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value)})}
                        className="text-slate-50 w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-slate-100 dark:border-slate-800">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 rounded-xl font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 dark:shadow-none transition-all"
                >
                  {isEditing ? 'Update Product' : 'Save Product'}
                </button>
              </div>
            </form>
              </div>
          </div>
        )}
    </div>
  )
}

export default Inventory;