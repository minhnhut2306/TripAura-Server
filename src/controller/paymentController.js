// const express = require('express');
// const PayOS = require("@payos/node");
// const router = express.Router();
// const Payment = require('../src/modules/payosModule')
// const payos = new PayOS('9643ef8f-e07f-4405-8248-211f9b59adb2', '607fff9d-d752-441e-b55c-4d712afbe0fa', '2094e0b06f2b8f9f1aa9b7155f2126f1ee0d2fa90d461c2dcf77abb4dd586418');

// // Định nghĩa YOUR_DOMAIN ở đây
// const YOUR_DOMAIN = 'http://localhost:3000';

// router.post('/create-payment-link', async (req, res, next) => {
//     const { amount, orderId, description } = req.body;
//     const descriptionText = description.length <= 25 ? description : description.slice(0, 25);

//     const order = {
//         amount: amount,
//         description: descriptionText || 'No description provided',
//         orderCode: orderCode,
//         returnUrl: 'http://localhost:3000/payment/success',
//         cancelUrl: 'http://localhost:3000/payment/cancel',
//     };

//     console.log('orderCode:', order.orderCode);
//     console.log('returnUrl:', order.returnUrl);
//     console.log('cancelUrl:', order.cancelUrl);

//     console.log('order', order);

//     try {
//         const paymentLink = await payos.createPaymentLink(order);
//         const payment = new Payment({
//             amount: order.amount,
//             orderId: order.orderCode,
//             description: order.description,
//             redirectUrl: paymentLink.checkoutUrl, // Thêm redirectUrl ở đây
//         });
//         await payment.save();
//         console.log('paymentLink', paymentLink);
//         res.redirect(303, paymentLink.checkoutUrl);
//     } catch (error) {
//         next(error); // Xử lý lỗi nếu có
//     }
// });


// module.exports = router;
