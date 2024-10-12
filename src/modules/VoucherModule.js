const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const VoucherSchema = new Schema({
    userId: { type: ObjectId, ref: 'User' },
    voucherTypeId: { type: ObjectId, ref: 'VoucherType' },
    discount: { type: Number, required: true },
    status: { type: String, required: true },
    startDay: { type: Date, required: true },
    endDay: { type: Date, required: true },
    description: { type: String, required: true },
    condition: { type: String, required: true },
});

module.exports = mongoose.model('Voucher', VoucherSchema)