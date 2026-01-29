import Product from "../models/product.model.js";
import StockLog from '../models/stockLogs.model.js';

// =========== CRUD OPERATIONS =========== //
// Create Product
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      sku,
      price,
      description,
      cost,
      quantity = 0,
      lowStockAlert,
      barcode,
      category
    } = req.body;

    const parsedQuantity = Number(quantity) || 0;

    const newProduct = new Product({
      name,
      sku,
      price,
      description,
      cost,
      quantity: parsedQuantity,
      lowStockAlert,
      barcode,
      category
    });

    await newProduct.save();

    if (parsedQuantity > 0) {
      await StockLog.create({
        productId: newProduct._id,
        type: "initial",
        change: parsedQuantity,
        note: "Initial stock on product creation",
        performedBy: req.user?.userId ?? null
      });
    }

    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Update Product
export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check quantity change
        if (updates.quantity !== undefined && updates.quantity !== product.quantity) {
            const diff = updates.quantity - product.quantity;

            await StockLog.create({
                productId: product._id,
                type: diff > 0 ? "restock" : "adjustment",
                change: diff,
                note: "Manual update via product edit",
                performedBy: req.user?.userId || null
            });
        }

        Object.assign(product, updates);
        await product.save();

        res.status(200).json({
            message: 'Product updated successfully',
            product
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Delete Product
export const deleteProduct = async ( req, res ) => {
    try {
        const { id } = req.params;
        const deletedProduct = await Product.findByIdAndDelete(id);
        if(!deletedProduct){
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

// Get Single Product
export const getProduct = async ( req, res ) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        if(!product){
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
// Get All Products
export const getProducts = async ( req, res ) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}