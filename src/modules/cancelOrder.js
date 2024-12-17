const mongoose = require("mongoose"); 
const Schema = mongoose.Schema; 

const cancelOrder = new Schema({
    name: { type: String, required: true },
    bankname: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: Number, required: true },
    accountnumber: { type: String, required: true },
    cancellationreason: { type: String, required: true },
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }
});

module.exports = mongoose.model('cancelOrder', cancelOrder);
