import Product from "../models/product.model.js";

// =========== CRUD OPERATIONS =========== //
// Create Product
export const createProduct = async ( req, res ) => {
    try {
        const {
            name,
            sku,
            price,
            description,
            cost,
            quantity,
            lowStockAlert,
            barcode,
            category
        } = req.body;
        
        //create new product
        const newProduct = new Product({
            name,
            sku,
            price,
            description,
            cost,
            quantity,
            lowStockAlert,
            barcode,
            category
        })
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log(error);
    }
}

// Update Product
export const updateProduct = async ( req, res ) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const updatedProduct = await Product.findByIdAndUpdate(id, updates, { new: true });
        if(!updatedProduct){
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product updated successfully', updatedProduct });
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log(error);
    }
}

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