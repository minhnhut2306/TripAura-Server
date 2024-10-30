const express = require('express');
const PayOS = require("@payos/node");
const router = express.Router();
const Payment = require('../src/modules/payosModule')
const payos = new PayOS('9643ef8f-e07f-4405-8248-211f9b59adb2', '607fff9d-d752-441e-b55c-4d712afbe0fa', '2094e0b06f2b8f9f1aa9b7155f2126f1ee0d2fa90d461c2dcf77abb4dd586418');

// Định nghĩa YOUR_DOMAIN ở đây
const YOUR_DOMAIN = 'http://localhost:3000';

// Router Code Snippet (with minor corrections)
router.post('/create-payment-link', async (req, res, next) => {
    const { amount, orderId, description } = req.body;

    console.log('Received request body:', req.body); // Ghi lại thông tin yêu cầu

    const order = {
        amount: amount,
        description: description || 'No description provided',
        orderId: orderId,
        returnUrl: 'http://localhost:3000/payment/success',
        cancelUrl: 'http://localhost:3000/payment/cancel',
    };

    try {
        const paymentLink = await payos.createPaymentLink(order);
        console.log('Payment link created:', paymentLink); // Ghi lại thông tin liên kết thanh toán

        res.status(201).json(paymentLink);
    } catch (error) {
        console.error('Error creating payment link:', error);
        res.status(500).json({ message: 'Failed to create payment link', error: error.message });
    }
});




module.exports = router;
