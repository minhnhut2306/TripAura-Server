const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const ReviewSchema = new Schema({
    tourId: { type: ObjectId, ref: 'Tour' },
    userId: { type: ObjectId, ref: 'User' },
    rating: { type: String, required: true },
    comment: { type: String, required: true },
    dayReview: { type: String, required: true },
});

module.exports = mongoose.model('Review', ReviewSchema)