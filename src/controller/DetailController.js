const mongoose = require('mongoose');
const DetailModule = require('../modules/DetailModule')
const TourModule = require('../modules/TourModule')

const insert = async (startDay, endDay, maxTicket, minTicket, priceAdult, priceChildren, PromotionalPrice, tourId) => {
    try {
        const detailTour = new DetailModule({
            startDay, endDay, maxTicket, minTicket, priceAdult, priceChildren, PromotionalPrice, status: 1, tourId
        });
        await detailTour.save();
        return detailTour;
    } catch (error) {
        console.log("loi insert", error);
    }
}

const getByTourId = async (tourId) => {
    try {
        const tour = await TourModule.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(tourId),
                    status: "1"
                }
            },
            {
                $lookup: {
                    from: 'images', // Collection Image
                    localField: '_id',
                    foreignField: 'tourId',
                    as: 'images'
                }
            },
            {
                $lookup: {
                    from: 'locations',
                    localField: '_id',
                    foreignField: 'tourId',
                    as: 'locations'
                }
            },
            {
                $lookup: {
                    from: 'details', // Collection Image
                    localField: '_id',
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
                $addFields: {
                    details: {
                        $sortArray: {
                            input: "$details",
                            sortBy: { startDay: 1 }, // Sắp xếp theo ngày tăng dần (gần nhất)
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 1,
                    tourName: 1,
                    description: 1,
                    status: 1,
                    createAt: 1,
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
                    images: { _id: 1, linkImage: 1 }
                }
            }
        ]);

        if (!tour.length) {
            return false;
        }
        return tour; // Trả về tour đầu tiên
    } catch (error) {
        console.error(error);
        return false;
    }
}

const updateDetailByDay = async () => {
    try {

        const today = new Date()
        const afterSevenDays = new Date()
        afterSevenDays.setDate(today.getDate() + 7)
        console.log(afterSevenDays);


        const data = await DetailModule.updateMany(
            { startDay: { $lte: afterSevenDays }, status: '1' },
            { status: 0 },
        )

        console.log("========== detail cần update ==========", data);

    } catch (error) {
        console.log("========== Lỗi update status detail ==========", error);
        return false
    }
}
// updateDetailByDay()

module.exports = { insert, getByTourId }