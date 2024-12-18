const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cancelOrder = new Schema({
    name: { type: String, required: true },
    bankname: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    accountnumber: { type: String, required: true },
    cancellationreason: { type: String, required: true },
    createAt: { type: Date, required: true },
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
    status: { type: Number, default: 1 } 
});

module.exports = mongoose.model('CancelOrder', cancelOrder);
