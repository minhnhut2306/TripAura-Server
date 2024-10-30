const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const moment = require('moment');

const BookingSchema = new Schema({
    detailId: { type: ObjectId, ref: 'Detail', required: true },
    userId: { type: ObjectId, ref: 'User', required: true },
    voucherId: { type: ObjectId, ref: 'Voucher' },
    numAdult: { type: Number, required: true, min: 1 },
    numchildren: { type: Number, required: true },
    priceAdult: { type: Number, required: true },
    priceChildren: { type: Number, required: true },
    createAt: { type: Date, required: true },
    status: { type: String, required: true },
});

module.exports = mongoose.model('Booking', BookingSchema)