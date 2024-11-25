const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const TinhSchema = new Schema({
    name: { type: String, required: true },
});

module.exports = mongoose.model('Tinh', TinhSchema)