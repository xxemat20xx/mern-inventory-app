import { useEffect, useMemo, useState } from "react"
import { useSaleStore } from "../store/useSaleStore"
import { Printer } from 'lucide-react';

const Sales = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSale, setSelectedSale] = useState(null);
  const { fetchPurchaseLogs, sales } = useSaleStore();

  const ITEMS_PER_PAGE = 8;
  const statusStyles = {
    completed: "border-green-500 text-green-400",
    cancelled: "border-red-500 text-red-400",
    pending: "border-orange-600 text-orange-400", // dark orange
  };

  // init data
  useEffect(() => {
    fetchPurchaseLogs();
  }, [fetchPurchaseLogs]);
  
  // ------------------- filter logic --------------
  const filteredData = useMemo(() => {
    return sales.filter(sale => 
      sale.receiptNo.toLowerCase().includes(searchTerm.toLocaleLowerCase()) ||
      sale.cashierName.toLowerCase().includes(searchTerm.toLocaleLowerCase()) 
    );
  },[sales, searchTerm]);

    // ------------------- pagination logic --------------
    const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
    const paginatedSales = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredData, currentPage]);
    

  // ------------------- print ------------------------
  const handlePrint = (sale) => {
    setSelectedSale(sale);

    // wait for state update before printing
    setTimeout(() => {
      window.print();
    }, 100);
  };

  return (
    <div className="w-full mx-auto px-4 py-8">
        {/* Header Section */}
        <header className="no-print mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Sales Logs</h1>
            <p className="text-slate-400">Manage and monitor your business transactions in real-time.</p>
          </div>           
        </header> 
        {/* Controls Bar */}
        <div className="no-print bg-slate-800 border border-slate-700 rounded-2xl p-4 mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-slate-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all sm:text-sm"
              placeholder="Search by receipt, cashier, method..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          
          <div className="no-print flex items-center gap-2 text-sm text-slate-400 font-medium">
            <span>Page {currentPage} of {totalPages || 1}</span>
            <div className="flex gap-1 ml-2">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-900 transition-colors"
              >
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-900 transition-colors"
              >
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        {/* Table Section */}
        <div className="no-print bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl shadow-black/40">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900/50 border-b border-slate-700">
                    <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Receipt Info</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Cashier</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Method</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-center">Status</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Date</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {paginatedSales.length > 0 ? paginatedSales.map((sale) => (
                    <tr key={sale._id} className="hover:bg-slate-700/30 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-white font-mono text-sm group-hover:text-indigo-400 transition-colors">{sale.receiptNo}</span>
                          <span className="text-xs text-slate-500 truncate w-32" title={sale._id}>{sale._id}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-slate-300 text-sm">{sale.cashierName}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-white font-semibold text-sm">₱{sale.totalAmount.toFixed(2)}</span>
                      </td>
                      <td className="px-6 py-4 capitalize">
                        <span className="text-slate-400 text-sm">{sale.paymentMethod}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`
                            inline-flex items-center gap-1
                            px-3 py-1
                            text-xs font-semibold capitalize
                            rounded-full border
                            ${statusStyles[sale.status] || "border-slate-500 text-slate-400"}
                          `}
                        >
                          {sale.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-slate-400 text-sm font-mono">
                          {new Date(sale.createdAt).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handlePrint(sale)}
                        className="text-slate-50 hover:text-green-500 cursor-pointer"
                      >
                        <Printer size={22} />
                      </button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-20 text-center">
                        <div className="flex flex-col items-center justify-center text-slate-500">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          <p className="text-lg">No transactions found</p>
                          <p className="text-sm">Try adjusting your search filters</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>                              
              </table>
            </div>
        </div>
        {selectedSale && (
        <div className="print-only hidden font-mono text-[10pt] w-[80mm] mx-auto p-4 border border-dashed border-slate-300">
            <div className="text-center mb-6">
              <h1 className="text-xl font-bold">INVENTORY APP</h1>
              <p>123 Digital Ave, Planet Namik</p>
              <p>TEL: (555) 123-4567</p>
              <div className="border-b border-black my-2"></div>
              <p>ORDER: #{selectedSale.receiptNo.toUpperCase()}</p>
              <p>DATE: {new Date(selectedSale.createdAt).toLocaleString()}</p>
              <p>CASHIER: {selectedSale?.cashierName || 'User'}</p>
            </div>

            <div className="space-y-1 mb-4">
              <div className="flex justify-between font-bold border-b border-black pb-1 mb-1">
                <span>ITEM</span>
                <span>TOTAL</span>
              </div>
              {selectedSale.items.map(item => (
                <div key={item.id} className="flex flex-col">
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
                <span>₱{(selectedSale.totalAmount / 1.1).toFixed(2)}</span>
              </div>
            <div className="flex justify-between">
              <span>TAX (10%):</span>
              <span>₱{(selectedSale.totalAmount - (selectedSale.totalAmount / 1.1)).toFixed(2)}</span>
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

export default Sales