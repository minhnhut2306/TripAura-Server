const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const moment = require('moment');

const BookingSchema = new Schema({
    detailId: { type: ObjectId, ref: 'Detail' },
    userId: { type: ObjectId, ref: 'User' },
    voucherId: { type: ObjectId, ref: 'Voucher' },
    numAdult: { type: Number, required: true },
    numchildren: { type: Number, required: true },
    priceAdult: { type: Number, required: true },
    priceChildren: { type: Number, required: true },
    createAt: { type: String, default: () => moment().format('YYYY-MM-DD') },
    status: { type: String, required: true },
});

module.exports = mongoose.model('Booking', BookingSchema)