import { User, Package, Clock, RefreshCw, FileText, Search, Filter, Download, ChevronRight} from 'lucide-react';
import { format } from 'date-fns'
import { useStockLogsStore } from "../store/useStockLogsStore"
import { useEffect, useState, useMemo } from "react"
const StockLogs = () => {
  const { fetchStockLogs, logs } = useStockLogsStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 8;

  
  useEffect(() => {
    fetchStockLogs();
  },[fetchStockLogs])
  
    // Filter logic
const filteredLogs = useMemo(() => {
      const query = searchQuery.toLowerCase();
      return logs.filter(log => 
        log.productId?.name?.toLowerCase().includes(query) ||
        log.performedBy?.email?.toLowerCase().includes(query) ||
        log.note?.toLowerCase().includes(query)
      );
    }, [logs, searchQuery]);


    // Pagination logic
  const totalPages = Math.ceil(filteredLogs.length / ITEMS_PER_PAGE);
  const paginatedLogs = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredLogs.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredLogs, currentPage]);

  return (
    <div className="flex flex-col overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm">
      {/* -------------------------SEARCH QUERY ---------------------------- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mx-4 my-4">
            <div className="relative w-full md:w-96 ">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="text" 
                placeholder="Search products, users, or changes..."
                className="w-full text-slate-50 bg-slate-950/50 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-slate-50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 text-slate-50 bg-slate-800/50 border border-slate-700 rounded-lg text-sm font-medium hover:bg-slate-700 transition-colors">
                <Filter size={16} />
                Filters
              </button>
              <button className="flex items-center gap-2 px-4 py-2 text-slate-50 bg-green-400/50 rounded-lg text-sm font-medium hover:bg-green-900 transition-colors">
                <Download size={16} />
                Export CSV
              </button>
            </div>
          </div>
          {/* ---------------------- TABLE ----------------------------------- */}
           <div className="no-print bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl shadow-black/40 mx-3">
          <table className="w-full text-left border-collapse">
          <thead className="bg-slate-800/80 border-b border-slate-700">
             <tr>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    <div className="flex items-center gap-2"><Package size={14} /> Product</div>
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    <div className="flex items-center gap-2"><FileText size={14} /> Change Description</div>
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    <div className="flex items-center gap-2"><User size={14} /> Performed By</div>
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    <div className="flex items-center gap-2"><Clock size={14} /> Created</div>
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    <div className="flex items-center gap-2"><RefreshCw size={14} /> Last Update</div>
                </th>
             </tr>
             
          </thead>
          <tbody className="divide-y divide-slate-800">
             {paginatedLogs.map((log) => (
              <tr key={log._id} className="hover:bg-slate-800/40 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-slate-100 font-medium group-hover:text-indigo-400 transition-colors">
                      {log.productId.name}
                    </span>
                    <span className="text-[10px] text-slate-500 mono">ID: {log.productId._id}</span>
                  </div>
                </td>   
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${
                      log.type === 'sale'
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        : log.type === 'initial'
                        ? 'bg-green-300/10 text-green-200 border border-green-500/20'
                        : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                    }`}
                  >
                    {log.note || 'No note included'}
                  </span>
                </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">
                    {log.performedBy.email.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-slate-300 text-sm">
                    {log.performedBy.email.split('@')[0]}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex flex-col text-xs">
                  <span className="text-slate-300">{format(new Date(log.createdAt), 'MMM dd, yyyy')}</span>
                  <span className="text-slate-500 mono">{format(new Date(log.createdAt), 'HH:mm:ss')}</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex flex-col text-xs">
                  <span className="text-slate-300">{format(new Date(log.updatedAt), 'MMM dd, yyyy')}</span>
                  <span className="text-slate-500 mono">{format(new Date(log.updatedAt), 'HH:mm:ss')}</span>
                </div>
              </td>                                                   
              </tr>
             ))}
          {paginatedLogs.length === 0 && (
            <tr>
              <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                No logs found matching your criteria.
              </td>
            </tr>
          )}
          </tbody>
         </table>           
        </div>
            {/* Pagination Controls */}
          <div className="no-print flex items-center justify-end gap-2 text-sm text-slate-400 font-medium my-2 mx-2">
            <span>Page {currentPage} of {totalPages || 1}</span>
            <div className="flex gap-3">
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
  )
}

export default StockLogs