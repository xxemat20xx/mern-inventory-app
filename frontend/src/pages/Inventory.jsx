import { useEffect, useState } from 'react';
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  Filter,
  X,
  AlertCircle,
  PackageCheck,
} from 'lucide-react';
import { Loading } from '../component/Loading';
import { useInventoryStore } from '../store/useInventoryStore';

const Inventory = () => {
  const {
    products = [],
    getProducts,
    deleteProduct,
    createProduct,
    updateProduct,
    isLoading,
  } = useInventoryStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(null);
  const [progress, setProgress] = useState(0);

  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    price: 0,
    description: '',
    cost: 0,
    quantity: 0,
    lowStockAlert: 5,
    barcode: '',
    category: 'General',
  });

  /* ---------------- Fetch products ---------------- */
  useEffect(() => {
    getProducts();
  }, [getProducts]);

  /* ---------------- Loader progress ---------------- */
  useEffect(() => {
    let interval;

    if (isLoading) {
      interval = setInterval(() => {
        setProgress((p) => (p < 90 ? p + 5 : p));
      }, 300);
    } else {
      // defer reset to next tick
      const timeout = setTimeout(() => {
        setProgress(0);
      }, 0);

      return () => clearTimeout(timeout);
    }

    return () => clearInterval(interval);
  }, [isLoading]);


  /* ---------------- Modal helpers ---------------- */
  const openModal = (product = null) => {
    if (product) {
      setIsEditing(product?._id || null);
      setFormData({
        name: product?.name ?? '',
        sku: product?.sku ?? '',
        price: product?.price ?? 0,
        description: product?.description ?? '',
        cost: product?.cost ?? 0,
        quantity: product?.quantity ?? 0,
        lowStockAlert: product?.lowStockAlert ?? 5,
        barcode: product?.barcode ?? '',
        category: product?.category ?? 'General',
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
        category: 'General',
      });
    }
    setIsModalOpen(true);
  };

  /* ---------------- Delete ---------------- */
  const handleDelete = async (id) => {
    if (typeof window !== 'undefined' && window.confirm('Delete this product?')) {
      await deleteProduct(id);
      await getProducts();
    }
  };

  /* ---------------- Submit ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      price: Number(formData.price) || 0,
      cost: Number(formData.cost) || 0,
      quantity: Number(formData.quantity) || 0,
      lowStockAlert: Number(formData.lowStockAlert) || 0,
      category: formData.category || 'General',
    };

    if (isEditing) {
      await updateProduct(isEditing, payload);
    } else {
      await createProduct(payload);
    }

    setIsModalOpen(false);
    await getProducts();
  };

  /* ---------------- Filter ---------------- */
  const filteredProduct = products.filter((p) => {
    const term = searchTerm.toLowerCase();
    return (
      p?.name?.toLowerCase().includes(term) ||
      p?.sku?.toLowerCase().includes(term) ||
      p?.category?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {isLoading && <Loading progress={progress} message="Fetching data..." />}

      {/* Header */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by SKU, Name or Category..."
            className="w-full pl-12 py-2.5 rounded-xl dark:bg-slate-900 text-white"
          />
        </div>

        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl"
        >
          <Plus size={18} /> Add Product
        </button>
      </div>

      {/* Table */}
      <div className="bg-slate-900 rounded-2xl overflow-hidden">
        <table className="w-full">
          <tbody>
            {filteredProduct.map((p) => (
              <tr key={p?._id}>
                <td className="px-6 py-4 text-white">{p?.name}</td>
                <td className="px-6 py-4 text-white">{p?.category}</td>
                <td className="px-6 py-4 text-white">{p?.quantity ?? 0}</td>
                <td className="px-6 py-4 text-white">
                  ₱{Number(p?.price || 0).toFixed(2)}
                </td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => openModal(p)}>
                    <Edit3 />
                  </button>
                  <button onClick={() => handleDelete(p?._id)}>
                    <Trash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-slate-900 p-6 rounded-2xl w-full max-w-2xl">
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Product name"
                className="w-full p-3 rounded-xl bg-slate-800 text-white"
              />

              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="bg-indigo-600 px-6 py-2 rounded-xl text-white">
                  {isEditing ? 'Update' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
