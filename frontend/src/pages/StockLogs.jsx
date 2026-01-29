import { useStockLogsStore } from "../store/useStockLogsStore"
import { useEffect } from "react"
const StockLogs = () => {
  const { fetchStockLogs, logs } = useStockLogsStore();
  useEffect(() => {
    fetchStockLogs();
  },[fetchStockLogs])
  console.log(logs)

  return (
    <div>StockLogs</div>
  )
}

export default StockLogs