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
    enum: ['sale', 'restock', 'adjustment', 'refund']
  },

  note:{
    type: String
  },
  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },    

  note: String
}, { timestamps: true });

export default mongoose.model('StockLog', stockLogSchema);