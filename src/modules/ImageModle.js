const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const ImageSchema = new Schema({
    linkImage: [{ type: String, required: true }],
    tourId: { type: ObjectId, ref: 'Tour' }
});

module.exports = mongoose.model('Image', ImageSchema)