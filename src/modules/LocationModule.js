const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const LocationSchema = new Schema({
    departure: { type: String, required: true },
    destination: { type: String, required: true },
    province:{ type: String, required: true },
    tourId: { type: ObjectId, ref: 'Tour' }
});

module.exports = mongoose.model('locations', LocationSchema)