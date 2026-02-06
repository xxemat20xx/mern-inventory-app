import { useEffect, useMemo, useState } from "react";
import { useSaleStore } from "../store/useSaleStore";
import { Printer, ChevronLeft, ChevronRight} from "lucide-react";
import { Loading } from "../component/Loading";

const ITEMS_PER_PAGE = 10;

const statusStyles = {
  completed: "border-green-500 text-green-400",
  cancelled: "border-red-500 text-red-400",
  pending: "border-orange-600 text-orange-400",
};

const Sales = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSale, setSelectedSale] = useState(null);

  const { fetchPurchaseLogs, sales = [], isLoading } = useSaleStore();

  /* ---------------- Fetch data ---------------- */
  useEffect(() => {
    fetchPurchaseLogs();
  }, [fetchPurchaseLogs]);

  /* ---------------- Filter ---------------- */
  const filteredData = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return sales.filter((sale) =>
      sale?.receiptNo?.toLowerCase().includes(term) ||
      sale?.cashierName?.toLowerCase().includes(term)
    );
  }, [sales, searchTerm]);
  console.log(sales)

  /* ---------------- Pagination ---------------- */
  const totalPages = Math.max(1, Math.ceil(filteredData.length / ITEMS_PER_PAGE));

  const paginatedSales = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredData.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredData, currentPage]);

  /* ---------------- Print ---------------- */
  const handlePrint = (sale) => {
    setSelectedSale(sale);

    if (typeof window !== "undefined") {
      setTimeout(() => {
        window.print();
      }, 100);
    }
  };

  return (
    <div className="min-h-screen w-full mx-auto bg-slate-950 pb-20">
      {isLoading && <Loading message="Loading sales..." />}

      {/* Header */}
      <header className="no-print mb-4">
        <h1 className="text-3xl font-bold text-white">Sales Logs</h1>
        <p className="text-slate-400">
          Manage and monitor your business transactions.
        </p>
      </header>

      {/* Search + Pagination */}
      <div className="no-print bg-slate-800 rounded-2xl p-4 mb-6 flex flex-col sm:flex-row gap-4 justify-between">
        <input
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          placeholder="Search by receipt or cashier..."
          className="bg-slate-900 text-white px-4 py-2 rounded-xl w-full sm:w-96"
        />

        <div className="text-slate-400 text-sm flex items-center gap-2">
          Page {currentPage} of {totalPages}
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="text-indigo-300 hover:text-indigo-600 transition-colors transform cursor-pointer"
          >
            <ChevronLeft size={22}/>
          </button>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="text-indigo-300 hover:text-indigo-600 transition-colors transform cursor-pointer"
          >
            <ChevronRight size={22}/>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="no-print bg-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
            <table className="min-w-[640px] w-full">
            <thead className="text-left">
              <tr className="bg-slate-900/50 border-b border-slate-700">
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Receipt No#</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Cashier</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Method</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-center">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody>
            {paginatedSales.length ? (
              paginatedSales.map((sale) => (
                <tr key={sale?._id} className="border-b border-slate-700">
                  <td className="px-6 py-4 text-white font-mono">
                    {sale?.receiptNo || "—"}
                  </td>
                  <td className="px-6 py-4 text-slate-300">
                    {sale?.cashierName || "—"}
                  </td>
                  <td className="px-6 py-4 text-white">
                    ₱{Number(sale?.totalAmount || 0).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 capitalize text-slate-400">
                    {sale?.paymentMethod || "—"}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-full border text-xs ${
                        statusStyles[sale?.status] ||
                        "border-slate-500 text-slate-400"
                      }`}
                    >
                      {sale?.status || "unknown"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handlePrint(sale)}>
                      <Printer className="text-white hover:text-green-500" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-20 text-center text-slate-500">
                  No transactions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
      </div>

      {/* ---------------- PRINT ---------------- */}
      {selectedSale && (
        <div className="print-only hidden font-mono text-[10pt] w-[80mm] mx-auto p-4">
          <h2 className="text-center font-bold mb-2">INVENTORY APP</h2>

          <p>ORDER: #{selectedSale?.receiptNo?.toUpperCase()}</p>
          <p>
            DATE:{" "}
            {selectedSale?.createdAt
              ? new Date(selectedSale.createdAt).toLocaleString()
              : "—"}
          </p>

          <div className="mt-4 space-y-1">
            {(selectedSale?.items || []).map((item, i) => (
              <div key={i} className="flex justify-between">
                <span>{item?.name}</span>
                <span>
                  ₱
                  {Number(
                    (item?.price || 0) * (item?.quantity || 0)
                  ).toFixed(2)}
                </span>               
              </div>
            ))}
          </div>


            <div className="flex justify-between">
              <span>TAX 12%</span>
              <span>
               ₱{Number(selectedSale?.tax || 0).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between flex-col">
              <div>-----------------------------------</div>
              <span className="text-right"><strong>TOTAL ₱{Number(selectedSale?.totalAmount || 0).toFixed(2)}</strong></span>
            </div>
          <p className="text-center mt-4">THANK YOU FOR SHOPPING!</p>
        </div>
      )}
    </div>
  );
};

export default Sales;
