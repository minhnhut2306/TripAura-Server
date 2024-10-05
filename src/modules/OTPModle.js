const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const otpSchema = new mongoose.Schema({
    email: { type: String, required: true }, 
    otp: { type: String, required: true },
    expiry: { type: Date, required: true },
});

otpSchema.index({ expiry: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('OTP', otpSchema);

