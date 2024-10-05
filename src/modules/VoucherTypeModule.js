const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const VoucherTypeSchema = new Schema({
    name: { type: String, required: true },
});

module.exports = mongoose.model('VoucherType', VoucherTypeSchema)