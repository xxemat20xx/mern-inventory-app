import express from 'express';
import { protectedRoute } from '../middleware/auth.middleware.js';
import { adjustStock, getStockLogs } from '../controller/stockLogs.controller.js';
 
const router = express.Router();

router.patch("/adjustStock/:productId", protectedRoute, adjustStock);
router.get("/getStockLogs", protectedRoute, getStockLogs);


export default router;
