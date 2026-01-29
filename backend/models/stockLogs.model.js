import mongoose from "mongoose";

const stockLogSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },

  change: {
    type: Number // +10 or -5
  },

  type: {
  type: String,
  enum: ['initial', 'sale', 'restock', 'adjustment', 'refund'],
  required: true
  },
  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },    

  note: String
}, { timestamps: true });

export default mongoose.model('StockLog', stockLogSchema);