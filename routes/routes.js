const express = require('express');
const router = express.Router();

const indexRouter = require('./index');
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

// Định tuyến tất cả các router
router.use('/index', indexRouter);
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

module.exports = router;
