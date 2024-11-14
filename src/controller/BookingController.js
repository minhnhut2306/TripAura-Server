const _Booking = require('../modules/BookingModule');
const { ObjectId } = require('mongodb');
const mongoose = require('mongoose'); 

const insert = async (detailId, userId, voucherId, numAdult, numChildren, priceAdult, priceChildren, createAt, status) => {
    console.log(detailId, userId, voucherId, numAdult, numChildren, priceAdult, priceChildren, createAt, status);

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
                    'tourInfo.tourName': 1,
                    'tourInfo.description': 1,
                    'tourImages.linkImage': 1,
                    'status': 1,
                    'createAt': 1,
                    'priceAdult': 1,        
                    'priceChildren': 1,
                    'numAdult': 1,
                    'numChildren': 1,
        
                }
            }
        ]);

        console.log("Aggregated data:", data);  // Kiểm tra dữ liệu trả về
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

module.exports = { insert, update, remove, bookingId, allBookings,allBookingsIduser };
