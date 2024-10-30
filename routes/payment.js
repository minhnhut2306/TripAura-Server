const express = require('express');
const PayOS = require("@payos/node");
const router = express.Router();

const payos = new PayOS(
    '9643ef8f-e07f-4405-8248-211f9b59adb2', 
    '607fff9d-d752-441e-b55c-4d712afbe0fa', 
    '2094e0b06f2b8f9f1aa9b7155f2126f1ee0d2fa90d461c2dcf77abb4dd586418'
);

const YOUR_DOMAIN = 'http://localhost:3000';

router.post('/create-payment-link', async (req, res) => {
    const { amount, orderId, description } = req.body;

    console.log('Received request body:', req.body); 

    if (!amount || typeof amount !== 'number' || amount <= 0) {
        return res.status(400).json({ message: 'amount must be a positive number.' });
    }

    const orderCode = Number(orderId); 
    if (!orderId || isNaN(orderCode) || orderCode <= 0) {
        return res.status(400).json({ message: 'orderId must be a positive number.' });
    }

    const order = {
        amount: amount,
        description: description || 'No description provided',
        orderCode: orderCode,
        returnUrl: `${YOUR_DOMAIN}/payment/success`,
        cancelUrl: `${YOUR_DOMAIN}/payment/cancel`,
    };

    try {
        const paymentLink = await payos.createPaymentLink(order);
        console.log('Payment link created:', paymentLink); 
        res.status(201).json(paymentLink);
    } catch (error) {
        console.error('Error creating payment link:', error);
        res.status(500).json({ message: 'Failed to create payment link', error: error.message });
    }
});

module.exports = router;
