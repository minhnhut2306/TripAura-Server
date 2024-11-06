const express = require('express');
const PayOS = require("@payos/node");
const router = express.Router();
const PayOsModel = require("../src/modules/payosModule");

const payos = new PayOS(
    '9643ef8f-e07f-4405-8248-211f9b59adb2',
    '607fff9d-d752-441e-b55c-4d712afbe0fa',
    '2094e0b06f2b8f9f1aa9b7155f2126f1ee0d2fa90d461c2dcf77abb4dd586418'
);

const YOUR_DOMAIN = 'https://trip-aura-server.vercel.app/';

router.post('/create-payment-link', async (req, res) => {
    const {amount, orderId, description } = req.body;
    const orderCode = Number(orderId);

    if (!orderId || isNaN(orderCode) || orderCode <= 0) {
        return res.status(400).json({ message: 'orderId must be a positive number.' });
    }
    const qrAmount = 5000;
    const order = {
        amount: qrAmount,
        description: description || 'No description provided',
        orderCode: orderCode,
        returnUrl: `${YOUR_DOMAIN}/payment/success?orderId=${orderCode}`,
        cancelUrl: `${YOUR_DOMAIN}/payment/cancel?orderId=${orderCode}`,
        redirectUrl: `${YOUR_DOMAIN}/payment/success?orderId=${orderCode}`, 
    };

    try {
        console.log('Order details:', order);
        const paymentLink = await payos.createPaymentLink(order);
        console.log('Payment link created:', paymentLink);

        if (paymentLink && typeof paymentLink === 'object' && paymentLink.checkoutUrl) {
            const payment = new PayOsModel({
                amount: amount,
                orderId: orderCode.toString(),
                description: description || 'No description provided',
                redirectUrl: order.redirectUrl,
                status: 1
            });
            await payment.save();
            res.status(201).json({ paymentLink: paymentLink.checkoutUrl });
        }
    } catch (error) {
        console.error('Error creating payment link:', error);
        res.status(500).json({ message: 'Failed to create payment link', error: error.message });
    }
});

router.get('/success', async (req, res) => {
    console.log('Received a request for /success');
    const { orderId } = req.query;

    if (!orderId) {
        console.error('No orderId provided');
        return res.status(400).send("orderId is required.");
    }

    try {
        console.log('Checking for payment with orderId:', orderId);
        const payment = await PayOsModel.findOne({ orderId: orderId });

        if (payment) {
            console.log('Payment found:', payment);
            payment.status = 1;
            await payment.save();
            console.log('Payment updated:', payment);
            res.status(200).send(`Thanh toán thành công với số tiền: ${payment.amount} VNĐ.`);
        } else {
            console.error('Payment not found for orderId:', orderId);
            res.status(404).send("Không tìm thấy đơn hàng.");
        }
    } catch (error) {
        console.error('Error updating payment status:', error);
        res.status(500).send("Có lỗi xảy ra khi cập nhật trạng thái thanh toán.");
    }
});

router.get('/cancel', async (req, res) => {
    console.log('Received cancel request:', req.query); 

    const { orderId } = req.query;

    if (!orderId) {
        console.error('No orderId provided');
        return res.status(400).send("orderId is required.");
    }

    try {
        const payment = await PayOsModel.findOne({ orderId: orderId });
        console.log('Payment found:', payment);

        if (payment) {
            payment.status = 0;
            await payment.save();
            console.log('Payment status updated to canceled:', payment);
            res.status(200).send("Thanh toán đã bị hủy.");
        } else {
            console.error('Payment not found for orderId:', orderId);
            res.status(404).send("Không tìm thấy đơn hàng.");
        }
    } catch (error) {
        console.error('Error updating payment status:', error);
        res.status(500).send("Có lỗi xảy ra khi cập nhật trạng thái thanh toán.");
    }
});

module.exports = router;
