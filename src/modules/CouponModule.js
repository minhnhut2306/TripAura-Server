const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const CouponSchema = new Schema({
    userId: { type: ObjectId, ref: 'User' },
    voucherId: { type: ObjectId, ref: 'Voucher' },
});

module.exports = mongoose.model('Coupon', CouponSchema)