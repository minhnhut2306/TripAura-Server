const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    amount: { type: Number, required: true },
    orderId: { type: String, required: true },
    description: { type: String, required: true },
    redirectUrl: { type: String, required: true },
    status: {
        type: Number,
        required: true,
        enum: [0, 1], 
        default: 1
    }
}, { timestamps: true });

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
