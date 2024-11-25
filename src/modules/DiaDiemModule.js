const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const DiaDiemSchema = new Schema({
    name: { type: String, required: true },
    images: [{ type: String, required: true }],
    time: { type: String, required: true },
    price: { type: Number, required: true },
    TinhId: { type: ObjectId, ref: 'Tinh' },
});

module.exports = mongoose.model('DiaDiem', DiaDiemSchema)