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
import { useAuthStore } from '../store/useAuthStore'
import { Loading } from '../component/Loading';

const Terminal = () => {
  const { products, getProducts, isLoading} = useInventoryStore();
  const { checkoutSale, fetchPurchaseLogs } = useSaleStore();
  const { user } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState([]); 
  const [isProcessing, setIsProcessing] = useState(false);
  const[lastSale, setLastSale] = useState(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const barcodeInputRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  useEffect(() => {
    getProducts();
    fetchPurchaseLogs();
  }, [getProducts, fetchPurchaseLogs]);


  const filteredProducts = Array.isArray(products) 
    ? products.filter((p) => 
        p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const addToCart = (product) => {
    if(product.quantity <= 0) return;
    setCart(prev => {
      const existingItem = prev.find(item => item.product._id === product._id);
      if(existingItem){ //if the cart quantity is greater than product qty return
        if(existingItem.quantity >= product.quantity) return prev; 
        
        return prev.map(item => 
          item.product._id === product._id
          ? { ...item, quantity: item.quantity + 1 }
          : item
        );
      }
      return [...prev, {product, quantity: 1}]
    })
   
  }
  const updateQty = (productId, delta) => {
    setCart(prev => prev.map((item) => {
      if(item._id === productId){
        const newQty = Math.max(1, item.quantity + delta);
        const original = products.find(p => p._id === productId);
        if (original && newQty > original.stock) return item;
        return { ...item, quantity: newQty };
      }
      return item;
    }))
  }
  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.product._id !== productId));
  };
  const handleCheckOut = async () => {
    if(cart.length === 0) return;
    setIsProcessing(true);
    try {
      const sale = await checkoutSale({
        cart, 
        paymentMethod: "cash",
        cashierName: user.email.split("@")[0] || "User"
      });
      await delay(1000); //delay 1 seconds

      setLastSale(sale);
      setCart([]);
      setIsProcessing(false);
      setShowReceipt(true);
      getProducts(); 
    } catch (error) {
      console.error(error)
    }
  }
  const printReceipt = () => {
    window.print();
  }
  
  const handleBarcodeSubmit = (e) => {
    e.preventDefault();
    const product = products.find(p => p.sku === searchTerm);
        if (product) {
      addToCart(product);
      setSearchTerm('');
    }
  }

  const subtotal = cart.reduce((sum, { product, quantity }) => sum + product.price * quantity, 0);
  const tax = +(subtotal * 0.1).toFixed(2);
  const total = +(subtotal + tax).toFixed(2);

  // Receipt computation
  const receiptSubtotal = lastSale?.items?.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0;
  const receiptTax = +(receiptSubtotal * 0.1).toFixed(2);
  const receiptTotal = +(receiptSubtotal + receiptTax).toFixed(2);



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

  return(
     <div className="h-full flex flex-col lg:flex-row gap-6 animate-in fade-in duration-500">
      {/* Loading Screen */}
        {isLoading && (
          <Loading
            progress={progress}
            message="Fetching data..."
          />
        )}      
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
             <div className="flex-1 overflow-y-auto p-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                     {filteredProducts.map((product) => {
                      return(
                        <button
                        key={product._id}
                        disabled={product.quantity <= 0}
                        onClick={() => addToCart(product)}
                        className={`group text-left p-4 rounded-2xl border transition-all ${
                          product.quantity <= 0 
                            ? 'opacity-50 cursor-not-allowed bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700' 
                            : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-500/5'
                        }`}
                        >
                      <div className="relative mb-3">
                        <div className={`aspect-square rounded-xl flex items-center justify-center text-2xl font-bold ${
                        product.quantity <= 0 ? 'bg-slate-200 text-slate-400' : 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                      }`}>
                           {product.name.charAt(0) + product.name.charAt(1)}
                        </div>
                        {product.quantity <= product.lowStockAlert && product.quantity > 0 && (
                          <div className="absolute top-1 right-1 w-3 h-3 bg-amber-500 rounded-full border-2 border-white dark:border-slate-900"></div>
                        )}
                      </div>
                      <h4 className='text-3xl text-slate-50'>{product.name}</h4>
                        <div className="flex items-center justify-between">
                          <span className="text-indigo-600 dark:text-indigo-400 font-bold text-sm">₱ {product.price.toFixed(2)}</span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${
                              product.quantity<= 0 ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                            }`}>
                              STK: {product.quantity} 
                            </span>                          
                        </div>   
                      </button>
                      )})}
                      {filteredProducts.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center py-20 text-slate-400">
                           <Search size={48} className="mb-4 opacity-20" />
                            <p>No products found matches your search.</p>
                         </div>
                      )}
                  </div>
             </div>
          </div>
      </div>
      {/* -------------------- CART ITEMS ------------------  */}
      <div className="w-full lg:w-96 flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm no-print">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
           <h3 className='text-bold text-xl text-slate-50'>Current Order</h3>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
             {cart.map((item) => (
              <div key={item.product?._id} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm truncate text-slate-50">{item.product?.name}</h4>
                      <p className="text-xs text-slate-500 mb-2">₱{item?.product?.price.toFixed(2)} each</p>

                      <div className="flex items-center gap-2">
                          <button 
                            onClick={() => updateQty(item.product.id, -1)}
                            className="w-7 h-7 flex items-center justify-center rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-500 hover:text-indigo-600 transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className='text-center font-bold text-sm mx-2 text-slate-50'>{item.quantity}</span>
                          <button 
                            onClick={() => updateQty(item.product.id, 1)}
                            className="w-7 h-7 flex items-center justify-center rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-500 hover:text-indigo-600 transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                      </div>
                  </div>
                  <div className="text-right">
                      <button 
                        onClick={() => removeFromCart(item.product?._id)}
                        className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
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
        {/* ------------------ subtotal ------------------- */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 space-y-2">
             <div className="flex justify-between text-sm text-slate-500">
                <span>Subtotal</span>
                <span>₱{subtotal.toFixed(2)}</span>
             </div>
              <div className="flex justify-between text-sm text-slate-500">
                <span>Tax (10%)</span>
                <span>₱{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xl font-bold pt-2">
                <span className='text-slate-50'>Total</span>
                <span className="text-slate-50">₱{total.toFixed(2)}</span>
              </div>
        {/* ------------------------ Checkout ------------------- */}
          <button 
            onClick={handleCheckOut}
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
      {/* -------------- Receipt Modal --------------------- */}
      {showReceipt && lastSale && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 no-print">
            <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in duration-300">
               <div className="p-6 text-center border-b border-slate-100 dark:border-slate-800">
                   <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-50">Sale Successful!</h3>
                    <p className="text-sm text-slate-300">Transaction ID: {lastSale.receiptNo.toUpperCase()}</p>
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
      )}
      {/* ------------- Printable Receipt Component ------------ */}
      {lastSale && (
        <div className="print-only hidden font-mono text-[10pt] w-[80mm] mx-auto p-4 border border-dashed border-slate-300">
            <div className="text-center mb-6">
              <h1 className="text-xl font-bold">INVENTORY APP</h1>
              <p>123 Digital Ave, Planet Namik</p>
              <p>TEL: (555) 123-4567</p>
              <div className="border-b border-black my-2"></div>
              <p>ORDER: #{lastSale.receiptNo.toUpperCase()}</p>
              <p>DATE: {new Date(lastSale.createdAt).toLocaleString()}</p>
              <p>CASHIER: {lastSale?.cashierName || 'User'}</p>
            </div>

            <div className="space-y-1 mb-4">
              <div className="flex justify-between font-bold border-b border-black pb-1 mb-1">
                <span>ITEM</span>
                <span>TOTAL</span>
              </div>
              {lastSale.items.map(item => (
                <div key={item._id} className="flex flex-col">
                  <div className="flex justify-between">
                    <span>{item.name}</span>
                    <span>₱{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                  <span className="text-[9pt]">{item.quantity} x ₱{item.price.toFixed(2)}</span>
                </div>
              ))}        
            </div>
            <div className="border-t border-black pt-2 space-y-1">
              <div className="flex justify-between">
                <span>SUBTOTAL:</span>
                <span>₱{(lastSale.totalAmount / 1.1).toFixed(2)}</span>
              </div>
            <div className="flex justify-between">
              <span>TAX (10%):</span>
              <span>₱{receiptTax}</span>
            </div>
            <div className="flex justify-between">
              <span>Total:</span>
              <span>₱{receiptTotal}</span>
            </div>
            </div>
            <div className="text-center mt-8 pt-4 border-t border-dashed border-black">
                <p>Payment: CASH</p>
                <p className="mt-4 font-bold">THANK YOU FOR SHOPPING!</p>
                <p className="text-[8pt] mt-2 italic">Visit us again</p>
            </div>
        </div>
      )}
    </div>
  )
}

export default Terminal