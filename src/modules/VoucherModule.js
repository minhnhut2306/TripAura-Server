const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const VoucherSchema = new Schema({
    tourId: { type: ObjectId, ref: 'Tour' },
    voucherTypeId: { type: ObjectId, ref: 'VoucherType' },
    discount: { type: String, required: true },
    status: { type: String, required: true },
    startDay: { type: String, required: true },
    endDay: { type: String, required: true },
    decription: { type: String, required: true },
    condition: { type: String, required: true },
});

module.exports = mongoose.model('Voucher', VoucherSchema)