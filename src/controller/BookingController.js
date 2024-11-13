const _Booking = require('../modules/BookingModule');
const { ObjectId } = require('mongodb');

const insert = async (detailId, userId, voucherId, numAdult, numChildren, priceAdult, priceChildren, createAt, status,fullname,email,phone,descriptiontour,tourName,linkImage) => {
    console.log(detailId, userId, voucherId, numAdult, numChildren, priceAdult, priceChildren, createAt, status, fullname, email, phone,descriptiontour,tourName,linkImage);

    try {
        const data = new _Booking({
            detailId,
            userId,
            voucherId: voucherId || null,
            numAdult,
            numChildren,
            priceAdult,
            priceChildren,
            createAt,
            status,
            fullname,
            phone,
            email,
            descriptiontour,
            tourName,
            linkImage,
            
        });

        await data.save();
        return data;
    } catch (error) {
        console.log("=============booking", error);
        return false;
    }
}

const bookingId = async (bookingId) => {
    try {
        const data = await _Booking.findById(bookingId)
        return data;
    } catch (error) {
        console.log("=============booking findById error", error);
        return false;
    }
}
const allBookings = async () => {
    try {
        const data = await _Booking.find();
        return data;
    } catch (error) {
        console.log("=============booking find error", error);
        return false;
    }
}
const allBookingsIduser = async (userId) => {
    try {
        const data = await _Booking.find({ userId: userId });
        return data;
    } catch (error) {
        console.log("=============booking findById error", error);
        return false;
    }
};


const update = async (bookingid, status) => {
    try {
        const data = await _Booking.findByIdAndUpdate(bookingid,
            {
                status
            },
        )
        return data;
    } catch (error) {
        console.log("=============booking update error", error);
        return false;

    }
}

const remove = async (bookingid) => {
    try {
        const data = await _Booking.findByIdAndDelete(bookingid);
        return data;
    } catch (error) {
        console.log("=============booking remove error", error);
        return false;
    }
}

module.exports = { insert, update, remove, bookingId, allBookings,allBookingsIduser };
