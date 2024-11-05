const _Booking = require('../modules/BookingModule');

const insert = async (detailId, userId, voucherId, numAdult, numchildren, priceAdult, priceChildren, createAt, status) => {
    console.log(detailId, userId, voucherId, numAdult, numchildren, priceAdult, priceChildren, createAt, status);

    try {
        const data = new _Booking({
            detailId,
            userId,
            voucherId: voucherId || null,
            numAdult,
            numchildren,
            priceAdult,
            priceChildren,
            createAt,
            status
        });

        await data.save();
        return data;
    } catch (error) {
        console.log("=============booking", error);
        return false;
    }
}

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

module.exports = { insert, update, remove };
