const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const DetailSchema = new Schema({
    startDay: { type: Date, required: true },
    endDay: { type: Date, required: true },
    maxTicket: { type: Number, required: true },
    minTicket: { type: Number, required: true },
    priceAdult: { type: Number, required: true },
    priceChildren: { type: Number, required: true },
    PromotionalPrice: { type: Number, required: true },
    status: { type: String, required: true },
    tourId: { type: ObjectId, ref: 'Tour' }


})

module.exports = mongoose.model('Detail', DetailSchema);