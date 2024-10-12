const mongoose = require('mongoose');
const _Favourite = require('../modules/FavouriteModule')
const _Tour = require('../modules/TourModule')
const _User = require('../modules/UserModle')



const favourite = async (userId, tourId) => {
    try {
        let a = false
        const tour = await _Favourite.find({ userId: userId })
        tour.forEach((value, key) => {
            if (value.tourId == tourId) {
                a = true
                return -1
            }
        });
        if (a) {
            await _Favourite.deleteOne({ tourId: tourId, userId: userId })
            return 0; // 0- xóa thành công
        } else {
            const data = new _Favourite({ userId: userId, tourId: tourId })
            await data.save()
            return 1;
        }

    } catch (error) {
        console.log("=====Lỗi Favourite=====", error);
        return false
    }
}

// favourite("670603408e6c85a630295708", "6704a28526be2256863506e1")







const insert = async (userId, tourId) => {
    try {
        const data = new _Favourite(userId, tourId)
        await data.save()
        return data
    } catch (error) {
        console.log("=====Lỗi insert Favourite=====", error);
        return false
    }
}

const getAll = async (userId) => {
    try {
        const data = await _Favourite.find({ userId: userId })
        if (data) {
            return data
        } else {
            return false
        }
    } catch (error) {
        console.log("===== Lỗi getAll Favourite =====", error);
        return false

    }
}

const remove = async (tourId, userId) => {
    try {
        await _Favourite.deleteOne({ tourId: tourId, userId: userId });
        return 1;
    }
    catch (error) {
        console.log(error);
        return false
    }
}

const getByUser = async (userId) => {
    try {
        const tours = await _Favourite.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(userId),
                }
            },
            {
                $lookup: {
                    from: 'tours', // Collection Image
                    localField: 'tourId',
                    foreignField: '_id',
                    as: 'tour'
                }
            },
            {
                $lookup: {
                    from: 'images', // Collection Image
                    localField: 'tourId',
                    foreignField: 'tourId',
                    as: 'images'
                }
            },
            {
                $lookup: {
                    from: 'locations',
                    localField: 'tourId',
                    foreignField: 'tourId',
                    as: 'locations'
                }
            },
            {
                $lookup: {
                    from: 'details',
                    localField: 'tourId',
                    foreignField: 'tourId',
                    as: 'details'
                }
            },
            {
                // Lọc các detail có status là 1
                $addFields: {
                    details: {
                        $filter: {
                            input: "$details",
                            as: "detail",
                            cond: { $eq: ["$$detail.status", "1"] } // Điều kiện: status = 1
                        }
                    }
                }
            },
            {
                $project: {
                    tour: {
                        _id: 1,
                        tourName: 1,
                        description: 1,
                        status: 1,
                        createAt: 1,
                    },
                    locations: {
                        departure: 1,
                        destination: 1
                    },
                    details: {
                        priceAdult: 1,
                        startDay: 1,
                        endDay: 1,
                        maxTicket: 1,
                        minTicket: 1,
                        priceAdult: 1,
                        priceChildren: 1,
                        PromotionalPrice: 1
                    },
                    images: { linkImage: 1 }
                }
            }

        ]);

        if (!tours.length) {
            return false;
        }

        return tours;
    } catch (error) {
        console.error(error);
        return false;
    }
}

module.exports = { insert, getAll, getByUser, remove, favourite }