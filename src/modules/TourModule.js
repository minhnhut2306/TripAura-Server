const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const TourSchema = new Schema({
    tourName: { type: String, required: true },
    description: { type: String, required: true },
    status:{type: String, required: true},
    createAt:{type: String, required: true},
    category:{ type: ObjectId, ref:'Category' }
    
})

module.exports = mongoose.model('Tour', TourSchema);