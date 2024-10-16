const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const moment = require('moment');

const ReviewSchema = new Schema({
    tourId: { type: ObjectId, ref: 'Tour' },
    userId: { type: ObjectId, ref: 'User' },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    dayReview: { type: Date, required: false }
});

module.exports = mongoose.model('Review', ReviewSchema)