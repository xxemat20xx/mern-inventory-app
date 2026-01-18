import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors'
import { connectDB } from './lib/db.js';
import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/product.routes.js';
import salesRoutes from './routes/sales.routes.js';
import stockLogsRoutes from './routes/stockLogs.routes.js'

import dotenv from 'dotenv';


dotenv.config(); // Load environment variables from .env file

const PORT = process.env.PORT || 5001; 

const app = express(); 
app.use(express.json()); 
app.use(cookieParser()); 

//cors config
app.use(cors({
  origin: 'http://localhost:5173', // frontend URL
  credentials: true,
}));

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/stockLogs', stockLogsRoutes);

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port: ${PORT}`);
});
