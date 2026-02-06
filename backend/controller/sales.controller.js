import Sale from '../models/sales.model.js';
import Product from '../models/product.model.js';
import StockLog from '../models/stockLogs.model.js';
import mongoose from "mongoose";

export const createSale = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { items, paymentMethod, cashierName } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Items array is required" });
    }

    let subtotal = 0;
    const saleItems = [];
    const receiptNo = `TRX-${Date.now()}`;
    const TAX_RATE = 0.12; //ph VAT

    for (const item of items) {
      const product = await Product.findById(item.productId).session(session);

      if (!product || product.quantity < item.quantity) {
        throw new Error(`Insufficient stock for ${product?.name}`);
      }

      product.quantity -= item.quantity;
      await product.save({ session });

      const itemSubtotal = item.quantity * product.price;
      subtotal += itemSubtotal;

      saleItems.push({
        productId: product._id,
        name: product.name,
        quantity: item.quantity,
        price: product.price,
        subtotal: itemSubtotal
      });

      await StockLog.create([{
        productId: product._id,
        type: "sale",
        change: -item.quantity,
        note: `Stock decrease by -${item.quantity} units`,
        performedBy: req.user.userId || null
      }], { session });
    }

    const tax = subtotal * TAX_RATE;
    const totalAmount = subtotal + tax;

    const sale = await Sale.create([{
      receiptNo,
      items: saleItems,
      paymentMethod,
      subtotal,
      tax,
      totalAmount,
      cashierName,
      cashierId: req.user.userId || null
    }], { session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json(sale[0]);

  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({ message: err.message });
  }
};

export const getStats = async (req, res) => {
  try {
    const sales = await Sale.find({ status: "completed" });

    let totalRevenue = 0;
    let totalSoldItem = 0;

    const dailyMap = {};

    for (const sale of sales) {
      totalRevenue += sale.totalAmount;

      const dateKey = sale.createdAt.toISOString().slice(0, 10);

      dailyMap[dateKey] =
        (dailyMap[dateKey] || 0) + sale.totalAmount;

      for (const item of sale.items) {
        totalSoldItem += item.quantity;
      }
    }

    const salesData = Object.entries(dailyMap).map(
      ([date, amount]) => ({
        date,
        amount
      })
    );

    const totalProfit = totalRevenue * 0.3; // example

    res.json({
      totalRevenue,
      totalSoldItem,
      totalProfit,
      salesData
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to load stats" });
  }
};

export const getSales = async (req, res) => {
  try {
    const sales = await Sale.find().populate("cashierId", "name");
    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: "Failed to load sales" });
  }
}