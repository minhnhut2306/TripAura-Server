const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const LichTrinhSchema = new Schema({
    name: { type: String, required: true },
    person: { type: Number, required: true },
    startDay: { type: Date, required: true },
    endDay: { type: Date, required: true },
    departure: { type: String, required: true },
    destination: { type: ObjectId, ref: 'Tinh' },
    userId: { type: ObjectId, ref: 'User' },
    locations: [
        {
            day: { type: Number, required: true },
            locations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'DiaDiem' }]
        },

    ],
})

module.exports = mongoose.model('LichTrinh', LichTrinhSchema);