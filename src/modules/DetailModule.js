const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const DetailSchema = new Schema({
    startDay: { type: String, required: true },
    endDay: { type: String, required: true },
    maxTicket: { type: String, required: true },
    minTicket: { type: String, required: true },
    priceAdult: { type: String, required: true },
    priceChildren: { type: String, required: true },
    PromotionalPrice: { type: String, required: true },
    tourId: { type: ObjectId, ref: 'Tour' }


})

module.exports = mongoose.model('Detail', DetailSchema);