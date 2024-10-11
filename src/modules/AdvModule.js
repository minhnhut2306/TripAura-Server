const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AdvSchema = new Schema({
    image: [{ type: String, required: true }],

});

module.exports = mongoose.model('Adv', AdvSchema)