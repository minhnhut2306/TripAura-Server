const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const FavouriteSchema = new Schema({
    tourId: { type: ObjectId, ref: 'Tour' },
    userId: { type: ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Favourite', FavouriteSchema)