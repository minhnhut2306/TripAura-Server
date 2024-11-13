const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    amount: { type: Number, required: true },
    orderId: { type: String, required: true },
    description: { type: String, required: true },
    redirectUrl: { type: String, required: true },
    status: {
        type: Number,
        required: true,
        enum: [0, 1, 2],
        default: 1
    },
    fullname: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
}, { timestamps: true });

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
