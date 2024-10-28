const mongoose = require('mongoose');
const _Favourite = require('../modules/FavouriteModule')
const _Tour = require('../modules/TourModule')
const _User = require('../modules/UserModle')
const detailController = require('./detailController');



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


// const insert = async (userId, tourId) => {
//     try {
//         const data = new _Favourite(userId, tourId)
//         await data.save()
//         return data
//     } catch (error) {
//         console.log("=====Lỗi insert Favourite=====", error);
//         return false
//     }
// }


// const remove = async (tourId, userId) => {
//     try {
//         await _Favourite.deleteOne({ tourId: tourId, userId: userId });
//         return 1;
//     }
//     catch (error) {
//         console.log(error);
//         return false
//     }
// }

const addFavorite = async (userId, tourId) => {
    const newFavorite = new _Favourite({ userId, tourId });
    await newFavorite.save();
    const detailTours = await detailController.getByTourId(tourId);
    return createResponse(200, "Thêm vào mục yêu thích thành công", "success", { tourId });
};

const removeFavorite = async (userId, tourId) => {
    await _Favourite.deleteOne({ userId, tourId });
    const detailTours = await detailController.getByTourId(tourId);
    return createResponse(200, "Đã xóa khỏi mục yêu thích", "success", { detailTours });
};

const toggleFavorite = async (userId, tourId) => {
    const existingFavorite = await _Favourite.findOne({ userId, tourId });
    if (existingFavorite) {
        return await removeFavorite(userId, tourId);
    } else {
        return await addFavorite(userId, tourId);
    }
};
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
                    as: 'tourImages'      // Tên kết quả sau khi join
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
                // Unwind tourInfo để dễ dàng truy cập các thuộc tính của tour
                $unwind: '$tourInfo'
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
                    images: '$tourImages.linkImage', // Chỉ lấy link hình ảnh
                    location: {
                        departure: 1,
                        destination: 1
                    },
                    details: {
                        priceAdult: 1,
                        startDay: 1,
                    }
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

module.exports = { addFavorite, removeFavorite,toggleFavorite, favourite, getByUser, checkTour }
