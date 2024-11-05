const express = require('express');
const PayOS = require("@payos/node");
const router = express.Router();

/**
 * @swagger
 * /payment/api/create-payment-link:
 *   post:
 *     summary: Tạo liên kết thanh toán
 *     description: Tạo một liên kết thanh toán cho đơn hàng với số tiền và thông tin mô tả.
 *     tags: [Payment]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 100000
 *                 description: "Số tiền cần thanh toán (đơn vị: đồng)." # Chú ý có dấu cách sau dấu hai chấm
 *               orderId:
 *                 type: number
 *                 example: 12345
 *                 description: "ID của đơn hàng (phải là số dương)."
 *               description:
 *                 type: string
 *                 example: "Thanh toán cho tour du lịch."
 *                 description: "Mô tả về đơn hàng (tùy chọn)."
 *     responses:
 *       201:
 *         description: Liên kết thanh toán được tạo thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 paymentLink:
 *                   type: string
 *                   example: "https://payos.vn/payment-link"
 *       400:
 *         description: Dữ liệu đầu vào không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "amount must be a positive number."
 *       500:
 *         description: Lỗi máy chủ khi tạo liên kết thanh toán
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Failed to create payment link"
 *                 error:
 *                   type: string
 *                   example: "Chi tiết lỗi ở đây"
 */


const payos = new PayOS(
    '9643ef8f-e07f-4405-8248-211f9b59adb2', 
    '607fff9d-d752-441e-b55c-4d712afbe0fa', 
    '2094e0b06f2b8f9f1aa9b7155f2126f1ee0d2fa90d461c2dcf77abb4dd586418'
);

const YOUR_DOMAIN = 'https://trip-aura-server.vercel.app';

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
