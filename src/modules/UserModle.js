const mongoose = require('mongoose');
const moment = require('moment');

const userSchema = new mongoose.Schema({
    fullname: { type: String, default: '' },
    phone: { type: String, default: '' },
    email: { type: String, default: '', sparse: true },
    avatar: { type: String, default: '' },
    gender: { type: String, default: '' },
    address: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address',
        default: null,  
    }],
    nationality: { type: String, default: '' },
    dateofbirth: { type: String, default: '' },
    created_at: { type: String, default: () => moment().format('YYYY-MM-DD') },
    providerId: { type: String, required: null },
    password: { type: String, default: '' },
    
});

module.exports = mongoose.model('User', userSchema);
