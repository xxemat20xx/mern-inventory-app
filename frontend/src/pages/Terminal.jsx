import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Scan, 
  Trash2, 
  Plus, 
  Minus, 
  CreditCard, 
  Printer, 
  CheckCircle2, 
  X,
  Keyboard,
  ShoppingCart
} from 'lucide-react';
import { useInventoryStore } from '../store/useInventoryStore';
import { useSaleStore } from '../store/useSaleStore';

const Terminal = () => {
  const { products, getProducts } = useInventoryStore();
  const { checkoutSale } = useSaleStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState([]); // {product, quantity}
  const [isProcessing, setIsProcessing] = useState(false);
  const[lastSale, setLastSale] = useState(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const barcodeInputRef = useRef(null);

  useEffect(() => {
    getProducts();
  }, [getProducts]);

  const filteredProducts = products.filter((p) => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );
const addToCart = (product) => {
  if (product.quantity <= 0) return;

  setCart(prev => {
    const existingItem = prev.find(
      item => item.product._id === product._id
    );

    if (existingItem) {
      if (existingItem.quantity >= product.quantity) return prev;

      return prev.map(item =>
        item.product._id === product._id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    }

    return [...prev, { product, quantity: 1 }];
  });
};

const updateQuantity = (productId, delta) => {
  setCart(prev =>
    prev.map(item => {
      if (item.product._id !== productId) return item;

      const product = products.find(p => p._id === productId);
      if (!product) return item;

      const nextQty = Math.max(1, item.quantity + delta);
      if (nextQty > product.quantity) return item;

      return { ...item, quantity: nextQty };
    })
  );
};

const removeFromCart = (productId) => {
  setCart(prev =>
    prev.filter(item => item.product._id !== productId)
  );
};

const handleCheckout = async () => {
  if (!cart.length) return;

  setIsProcessing(true);

  setTimeout(async () => {
    try {
      await checkoutSale({ cart, paymentMethod: "cash" });

      const saleForReceipt = {
        id: Date.now().toString(),
        date: new Date(),
        total,
        cashierName: "Cashier",
        items: cart.map(({ product, quantity }) => ({
          id: product._id,
          name: product.name,
          price: product.price,
          quantity
        }))
      };

      setLastSale(saleForReceipt);
      setShowReceipt(true);
      setCart([]);
      getProducts();
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  }, 1500); // <--- setTimeout added here
};


const printReceipt = () => {
  window.print();
}
const handleBarcodeSubmit = (e) => {
  e.preventDefault();
  if (!searchTerm.trim()) return;

  const product = products.find(p => p.sku === searchTerm);
  if (product) addToCart(product);

  setSearchTerm("");
};
const subtotal = cart.reduce(
  (sum, { product, quantity }) => sum + product.price * quantity,
  0
);

const tax = subtotal * 0.1;
const total = subtotal + tax;

  return (
    <div className="h-full flex flex-col lg:flex-row gap-6 animate-in fade-in duration-500">
         {/* Product Selection */}
         <div className="flex-1 flex flex-col min-h-0 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm no-print">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800">
              <form onSubmit={handleBarcodeSubmit} className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input
                  ref={barcodeInputRef}
                  type="text"
                  placeholder="Search product or scan barcode..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 text-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-indigo-500"
                  />
                 <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => barcodeInputRef.current?.focus()}
                      className="p-1.5 text-slate-50 bg-slate-200 dark:bg-slate-700 rounded-md"
                    >
                     <Keyboard size={16} />  
                    </button>     
                     <Scan size={20} className="text-slate-50" />            
                 </div>
              </form>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filteredProducts.map((p) => (
              <button
                key={p._id}
                disabled={p.quantity <= 0}
                onClick={() => addToCart(p)}
                className={`group text-left p-4 rounded-2xl border transition-all ${
                  p.quantity <= 0 
                    ? 'opacity-50 cursor-not-allowed bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700' 
                    : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-500/5'
                }`}
              >
                <div className="relative mb-3">
                  <div className={`aspect-square rounded-xl flex items-center justify-center text-2xl font-bold ${
                    p.quantity <= 0 ? 'bg-slate-200 text-slate-400' : 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                  }`}>
                    {p.name.charAt(0)}
                  </div>
                  {p.quantity <= p.lowStockAlert && p.quantity > 0 && (
                    <div className="absolute top-1 right-1 w-3 h-3 bg-amber-500 rounded-full border-2 border-white dark:border-slate-900"></div>
                  )}
                </div>
                <h4 className="font-bold text-sm truncate mb-1">{p.name}</h4>
                <div className="flex items-center justify-between">
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold text-sm">${p.price.toFixed(2)}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${
                    p.quantity<= 0 ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}>
                    STK: {p.quantity}
                  </span>
                </div>
              </button>
            ))}
          </div>
                    {filteredProducts.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center py-20 text-slate-400">
              <Search size={48} className="mb-4 opacity-20" />
              <p>No products found matches your search.</p>
            </div>
          )}
        </div>
         </div>
          
          {/* CART ITEMS */}
          <div className="w-full lg:w-96 flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm no-print">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-bold">Current Order</h3>
              <span className="bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded-full">{cart.length} Items</span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {cart.map(({ product, quantity }) => (
                <div key={product._id} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm truncate">{product.name}</h4>
                    <p className="text-xs text-slate-500 mb-2">
                      ${product.price.toFixed(2)} each
                    </p>

                    <div className="flex items-center gap-2">
                      <button onClick={() => updateQuantity(product._id, -1)}>
                        <Minus size={14} />
                      </button>

                      <span className="w-8 text-center font-bold text-sm">{quantity}</span>

                      <button onClick={() => updateQuantity(product._id, 1)}>
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <button onClick={() => removeFromCart(product._id)}>
                      <Trash2 size={16} />
                    </button>

                    <p className="font-bold text-sm mt-2">
                      ${(product.price * quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}

              {cart.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center py-20 text-slate-400">
                  <ShoppingCart size={48} className="mb-4 opacity-10" />
                  <p className="text-sm font-medium">Cart is empty</p>
                </div>
              )}
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex justify-between text-sm text-slate-500">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-500">
                <span>Tax (10%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xl font-bold pt-2">
                <span>Total</span>
                <span className="text-indigo-600 dark:text-indigo-400">${total.toFixed(2)}</span>
              </div>
              
              <button 
                onClick={handleCheckout}
                disabled={cart.length === 0 || isProcessing}
                className="w-full mt-4 py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-200 dark:shadow-none"
              >
                {isProcessing ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <CreditCard size={20} />
                    Checkout (Cash Only)
                  </>
                )}
              </button>
            </div>
          </div>
         {/* Receipt Dialog Overlay */}
      {/* {showReceipt && lastSale && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 no-print">
          <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in duration-300">
            <div className="p-6 text-center border-b border-slate-100 dark:border-slate-800">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-xl font-bold">Sale Successful!</h3>
              <p className="text-sm text-slate-500">Transaction ID: {lastSale.id.slice(-6).toUpperCase()}</p>
            </div>

            <div className="p-6 space-y-4">
              <button 
                onClick={printReceipt}
                className="w-full py-3 bg-slate-900 dark:bg-slate-100 dark:text-slate-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all"
              >
                <Printer size={20} />
                Print Receipt
              </button>
              <button 
                onClick={() => setShowReceipt(false)}
                className="w-full py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )} */}

    </div>
  )
}

export default Terminal