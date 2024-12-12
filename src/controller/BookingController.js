const _Booking = require('../modules/BookingModule');
const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const cron = require('node-cron');
const moment = require('moment');

const insert = async (detailId, userId, voucherId, numAdult, numChildren, priceAdult, priceChildren, createAt, status, totalPrice) => {
    try {
        const expireAt = moment(createAt).add(10, 'minutes').toDate();

        const data = new _Booking({
            detailId,
            userId,
            voucherId: voucherId || null,
            numAdult,
            numChildren,
            priceAdult,
            priceChildren,
            createAt,
            expireAt,
            status,
            totalPrice
        });

        await data.save();
        return data;
    } catch (error) {
        console.log("=============booking", error);
        return false;
    }
};

cron.schedule('* * * * *', async () => {
    const now = moment().toDate();

    const bookingsToCancel = await _Booking.find({
        status: 1,
        expireAt: { $lte: now },
    });

    bookingsToCancel.forEach(async (booking) => {
        booking.status = 2;
        await booking.save();
        console.log(`Booking ${booking._id} đã bị hủy vì quá thời gian thanh toán.`);
    });
});


const bookingId = async (bookingId) => {
    try {

        if (!ObjectId.isValid(bookingId)) {
            throw new Error("Invalid bookingId format");
        }

        const data = await _Booking.aggregate([
            {
                $match: {
                    _id: new ObjectId(bookingId),
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'userInfo'
                }
            },
            { $unwind: '$userInfo' },
            {
                $lookup: {
                    from: 'details',
                    localField: 'detailId',
                    foreignField: '_id',
                    as: 'detailInfo'
                }
            },
            { $unwind: '$detailInfo' },
            {
                $lookup: {
                    from: 'tours',
                    localField: 'detailInfo.tourId',
                    foreignField: '_id',
                    as: 'tourInfo'
                }
            },
            { $unwind: '$tourInfo' },
            {
                $lookup: {
                    from: 'images',
                    localField: 'tourInfo._id',
                    foreignField: 'tourId',
                    as: 'tourImages'
                }
            },
            {
                $project: {
                    'userInfo._id': 1,
                    'userInfo.fullname': 1,
                    'userInfo.email': 1,
                    'userInfo.phone': 1,
                    'status': 1,
                    'createAt': 1,
                    'priceAdult': 1,
                    'priceChildren': 1,
                    "totalPrice": 1,
                    'numAdult': 1,
                    'numChildren': 1,
                    'detailInfo.tourId': 1,
                    'detailInfo.endDay': 1,
                    'detailInfo.maxTicket': 1,
                    'tourInfo.tourName': 1,
                    'tourInfo.description': 1,
                    'tourImages.linkImage': 1,
                    'detailId': 1,
                }
            }
        ]);

        return data.length > 0 ? data[0] : null;
    } catch (error) {
        console.error("=============booking findById error", error.stack);
        return false;
    }
};

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
        const userIdObject = new mongoose.Types.ObjectId(userId);
        const data = await _Booking.aggregate([
            {
                $match: {
                    userId: userIdObject
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'userInfo'
                }
            },
            { $unwind: '$userInfo' },
            {
                $lookup: {
                    from: 'details',
                    localField: 'detailId',
                    foreignField: '_id',
                    as: 'detailInfo'
                }
            },
            { $unwind: '$detailInfo' },
            {
                $lookup: {
                    from: 'tours',
                    localField: 'detailInfo.tourId',
                    foreignField: '_id',
                    as: 'tourInfo'
                }
            },
            { $unwind: '$tourInfo' },
            {
                $lookup: {
                    from: 'images',
                    localField: 'tourInfo._id',
                    foreignField: 'tourId',
                    as: 'tourImages'
                }
            },
            {
                $project: {
                    'userInfo.fullname': 1,
                    'userInfo.email': 1,
                    'userInfo.phone': 1,
                    'detailInfo.tourId': 1,
                    'detailInfo.endDay': 1,
                    'tourInfo.tourName': 1,
                    'tourInfo.description': 1,
                    'tourImages.linkImage': 1,
                    'status': 1,
                    'createAt': 1,
                    'priceAdult': 1,
                    'priceChildren': 1,
                    'numAdult': 1,
                    'numChildren': 1,
                    'totalPrice': 1
                }
            },

            {
                $sort: {
                    createAt: -1
                }
            }
        ]);

        console.log("Aggregated data:", data);
        return data;
    } catch (error) {
        console.log("Error in aggregation:", error);
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

const getByYear = async (year) => {
    try {
        year = parseInt(year)
        console.log(year);

        const bookings = await (await _Booking.find({ status: 0 }))
            .filter((item) => new Date(item.createAt).getFullYear() === year
            )

        if (bookings) {
            return bookings
        } else {
            return false
        }

    } catch (error) {
        console.log(error);
        return false
    }
}

// getByYear("2024")

module.exports = { insert, update, remove, bookingId, allBookings, allBookingsIduser, getByYear };
