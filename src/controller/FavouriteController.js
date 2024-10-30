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
        console.log(`Đang tìm tour yêu thích của userId: ${userId}`);
        const data = await _Favourite.aggregate([
            {

                $match: { userId: new mongoose.Types.ObjectId(userId) }
            },
            {

                $lookup: {
                    from: 'tours', // Tên collection của Tour
                    localField: 'tourId', // Trường trong Favourite để join
                    foreignField: '_id',  // Trường trong Tour để join
                    as: 'tourInfo'        // Tên kết quả sau khi join
                }
            },
            {
                $lookup: {
                    from: 'images',       // Tên collection của Image
                    localField: 'tourId', // Trường trong Tour để join
                    foreignField: 'tourId', // Trường trong Image để join
                    as: 'images'      // Tên kết quả sau khi join
                }
            },
            {
                $lookup: {
                    from: 'locations',       // Tên collection của Image
                    localField: 'tourId', // Trường trong Tour để join
                    foreignField: 'tourId', // Trường trong Image để join
                    as: 'locations'      // Tên kết quả sau khi join
                }
            },
            {
                $lookup: {
                    from: "details", // Tên collection Detail
                    let: { tourId: "$tourId" }, // Đặt tourId hiện tại trong Tour vào biến
                    pipeline: [
                        { $match: { $expr: { $eq: ["$tourId", "$$tourId"] } } }, // Lọc detail theo tourId
                        { $limit: 1 }, // Chỉ lấy 1 detail
                    ],
                    as: "details", // Tên field chứa dữ liệu Detail sau khi nối
                },
            },
            {
                $lookup: {
                    from: 'reviews',
                    localField: 'tourId',
                    foreignField: 'tourId',
                    as: 'reviews'
                }
            },
            {
                // Unwind tourInfo để dễ dàng truy cập các thuộc tính của tour
                $unwind: '$tourInfo'
            },
            {
                $unwind: "$details", // Đảm bảo mỗi tour chỉ có một chi tiết để dễ tìm kiếm
            },
            {
                $unwind: "$locations", // Đảm bảo mỗi tour chỉ có một chi tiết để dễ tìm kiếm
            },
            {
                $unwind: "$images", // Đảm bảo mỗi tour chỉ có một chi tiết để dễ tìm kiếm
            },
            {
                $project: {
                    _id: 0, // Không lấy _id từ Favourite
                    tourId: '$tourInfo._id',
                    tourName: '$tourInfo.tourName',
                    description: '$tourInfo.description',
                    status: '$tourInfo.status',
                    createAt: '$tourInfo.createAt',
                    popularity: '$tourInfo.popularity',
                    images: '$images.linkImage', // Chỉ lấy link hình ảnh
                    locations: {
                        departure: 1,
                        destination: 1
                    },
                    details: {
                        priceAdult: 1,
                        startDay: 1,
                    },
                    totalReviews: { $size: "$reviews" } // Đếm số lượng reviews
                }
            }
        ])
        if (!data.length) {
            console.log("k co gì");

            return false
        }

        return data
    } catch (error) {
        console.error(error);
        return false;
    }
}

const checkTour = async (userId, tourId) => {
    try {
        const data = await _Favourite.find({ userId: userId, tourId: tourId })
        if (!data || data.length < 0) {
            console.log(data);

            return false
        }
        console.log(data);
        return data
    } catch (error) {
        console.log("=============== lỗi checkTour ==========", error);
        return false
    }
}
// const userId = "670603408e6c85a630295708"
// const tourId = "6704a23326be2256863506df"
// checkTour(userId, tourId)

module.exports = { insert, remove, favourite, getByUser, checkTour }