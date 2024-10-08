const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const CategorySchema = new Schema({
    name: { type: String, required: true },
    icon: {type :String, required: true},
    createAt:{type :Date, required: true}
});

module.exports = mongoose.model('Category', CategorySchema)