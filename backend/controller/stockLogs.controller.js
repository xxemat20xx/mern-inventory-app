import Product from '../models/product.model.js';
import StockLog from '../models/stockLogs.model.js';

export const adjustStock = async (req, res) => {
    try {
        const { amount, note } = req.body;
        const product = await Product.findById(req.params.productId);
        if(!product){
            return res.status(404).json({ message: "Product not found" });
        }
        product.quantity += amount;
        await product.save();

        const log = await StockLog.create({
            productId: product._id,
            type: amount > 0 ? "restock" : "adjustment",
            change: amount,
            note: note || "",
            performedBy: req.user?.userId || null
        });
        res.status(200).json({ message: "Stock adjusted successfully", product, log });
    } catch (error) {
        res.status(500).json({ message: "Error adjusting stock", error });
        console.error("Error in adjustStock:", error);
    }
}
export const getStockLogs = async (req, res) => {
    try {
        const logs = await StockLog.find()
        .populate('productId', 'name sku')
        .populate('performedBy', 'name email')
        .sort({ createdAt: -1 });
        res.status(200).json(logs);
    } catch (error) {
        res.status(500).json({ message: "Error fetching stock logs", error });
        console.error("Error in getStockLogs:", error);
    }
}