import mongoose from 'mongoose';

const saleSchema = new mongoose.Schema({
    receiptNo: {
        type: String,
        unique: true,
    },
    items: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        subtotal: { type: Number, required: true }
    }],
    totalAmount: { type: Number, required: true },
    paymentMethod: {
        type: String,
        enum: ['cash', 'gcash'],
        default: 'cash'
    },
    cashierId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status:{
        type: String,
        enum: ['completed', 'refunded'],
        default: 'completed'
    }
},
{ timestamps: true });

export default mongoose.model('Sale', saleSchema);