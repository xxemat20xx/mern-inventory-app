import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors'
import { connectDB } from './lib/db.js';
import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/product.routes.js';
import salesRoutes from './routes/sales.routes.js';
import stockLogsRoutes from './routes/stockLogs.routes.js'

import dotenv from 'dotenv';

import path from 'path';

dotenv.config(); // Load environment variables from .env file

const app = express(); 
// cors config
app.use(cors({
  origin: 'http://localhost:5173', // frontend URL
  credentials: true,
}));

const PORT = process.env.PORT || 5001; 
const __dirname = path.resolve();

app.use(express.json()); 
app.use(cookieParser()); 

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/stockLogs', stockLogsRoutes);

// Serve static files from the React frontend app
if (process.env.NODE_ENV === 'production') {
  const frontendPath = path.join(__dirname, '../frontend/dist');

  app.use(express.static(frontendPath));

  // React Router fallback (Node 22 safe)
  app.use((req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port: ${PORT}`);
});
