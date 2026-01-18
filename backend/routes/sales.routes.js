import express from 'express';
import { protectedRoute } from '../middleware/auth.middleware.js';
import { createSale } from '../controller/sales.controller.js';

const router = express.Router();

router.post("/createSale", protectedRoute, createSale);

export default router;