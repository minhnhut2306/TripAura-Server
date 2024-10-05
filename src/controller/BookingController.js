const _Booking = require('../modules/BookingModule')

const insert = async (detailId, userId, voucherId, numAdult, numchildren, priceAdult, priceChildren, createAt, status) => {
    try {
        const data = new _Booking(detailId, userId, voucherId, numAdult, numchildren, priceAdult, priceChildren, createAt, status)
        await data.save()
        return data
    } catch (error) {
        console.log(error);

        return false
    }
}

module.exports = { insert }