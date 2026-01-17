import express from 'express';
import {
    createProduct,
    updateProduct,
    deleteProduct,
    getProduct,
    getProducts
} from '../controller/product.controller.js';
import { protectedRoute, adminOnly } from '../middleware/auth.middleware.js';

const router = express.Router();

// admin protected routes
router.post("/create", protectedRoute, adminOnly, createProduct);
router.put("/update/:id", protectedRoute, adminOnly, updateProduct);
router.delete("/delete/:id",protectedRoute, adminOnly, deleteProduct);

// public routes
router.get("/get/:id", getProduct);
router.get("/get", getProducts);

export default router;