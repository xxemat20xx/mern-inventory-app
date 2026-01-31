import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    sku: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    description: { type: String, default: "" },
    cost: { type: Number, required: true }, // sensitive field
    quantity: { type: Number, required: true },
    lowStockAlert: { type: Number, default: 10 },
    category: { type: String }
}, 
{ timestamps: true });

export default mongoose.model("Product", productSchema);