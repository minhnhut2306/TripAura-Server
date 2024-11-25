const express = require('express');
const router = express.Router();

const index = require('./index');
const categoryRouter = require('./category');
const tourRouter = require('./tour');
const imageRouter = require('./image');
const detailRouter = require('./detail');
const locationRouter = require('./location');
const favouriteRouter = require('./favourite');
const reviewRouter = require('./review');
const bookingRouter = require('./booking');
const voucherRouter = require('./voucher');
const voucherTypeRouter = require('./voucherType');
const auth = require('./auth');
const advRouter = require('./adv');
const couponRouter = require('./coupon')
const payment = require('./payment');
const tinhRouter = require('./lichtrinh/tinh')
const diaDiemRouter = require('./lichtrinh/diaDiem')
const lichTrinhRouter = require('./lichtrinh/lichTrinh')

// Định tuyến tất cả các router
router.get('/', index);
router.use('/category', categoryRouter);
router.use('/tour', tourRouter);
router.use('/image', imageRouter);
router.use('/detail', detailRouter);
router.use('/location', locationRouter);
router.use('/favourite', favouriteRouter);
router.use('/review', reviewRouter);
router.use('/booking', bookingRouter);
router.use('/voucher', voucherRouter);
router.use('/voucherType', voucherTypeRouter);
router.use('/auth', auth);
router.use('/adv', advRouter);
router.use('/coupon', couponRouter);
router.use('/payment', payment);
router.use('/tinh', tinhRouter);
router.use('/diaDiem', diaDiemRouter);
router.use('/lichTrinh', lichTrinhRouter);

module.exports = router;
