import express from 'express';
import { protectedRoute } from '../middleware/auth.middleware.js';
import { createSale, getStats } from '../controller/sales.controller.js';

const router = express.Router();

router.post("/createSale", protectedRoute, createSale);
router.get("/stats", protectedRoute, getStats);

export default router;