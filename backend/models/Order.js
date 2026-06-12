const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    chefId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [{
        foodItemId: { type: mongoose.Schema.Types.ObjectId, ref: 'FoodItem', required: true },
        quantity: { type: Number, required: true, default: 1 },
        price: { type: Number, required: true } // Price at time of order (locked from DB)
    }],
    totalPrice: { type: Number, required: true },
    deliveryAddress: { type: String, required: true },
    deliveryTime: { type: Date, required: true },
    paymentMethod: { type: String, enum: ['Cash', 'Card', 'UPI'], default: 'Cash' },
    amountPaid: { type: Number, required: true, default: 0 },
    status: { type: String, enum: ['Pending', 'Accepted', 'Rejected', 'Completed'], default: 'Pending' }
}, {
    timestamps: true
});

// Indexes for performance
orderSchema.index({ customerId: 1 });
orderSchema.index({ chefId: 1 });
orderSchema.index({ status: 1 });

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
