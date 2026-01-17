import express from 'express';
import cookieParser from 'cookie-parser';
import { connectDB } from './lib/db.js';
import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/product.routes.js';

import dotenv from 'dotenv';


dotenv.config(); // Load environment variables from .env file

const PORT = process.env.PORT || 5001; 

const app = express(); 
app.use(express.json()); 
app.use(cookieParser()); 

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);


app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port: ${PORT}`);
});
