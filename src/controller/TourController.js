const mongoose = require('mongoose');
// const Schema = mongoose.Schema;
// const ObjectId = Schema.ObjectId;
// const TourModule = require('../modules/TourModule')

const TourModule = require('../modules/TourModule')
const ImageModule = require('../modules/ImageModle')

const filter = async (destination, minPrice, maxPrice, startDate) => {
    console.log(destination, minPrice, maxPrice, startDate);
    try {
        // Tạo điều kiện động cho $match
        let matchConditions = {};

        if (destination) {
            matchConditions['locations.destination'] = { $regex: new RegExp(destination, 'i') }; // Tìm kiếm theo location nếu có
        }

        if (minPrice && maxPrice) {
            matchConditions['details.priceAdult'] = { $gte: minPrice, $lte: maxPrice }; // Tìm theo khoảng giá nếu có
        }

        if (startDate) {
            matchConditions['details.startDay'] = { $gte: new Date(startDate) }; // Tìm kiếm theo ngày khởi hành nếu có
        }

        const tours = await TourModule.aggregate([
            {
                $lookup: {
                    from: 'details', // Collection details
                    localField: '_id',
                    foreignField: 'tourId',
                    as: 'details'
                }
            },
            {
                $unwind: '$details' // Đảm bảo mỗi tour chỉ có một chi tiết để dễ tìm kiếm
            },
            {
                $match: matchConditions // Áp dụng các điều kiện tìm kiếm linh hoạt
            },
            {
                $lookup: {
                    from: 'images', // Collection images
                    localField: '_id',
                    foreignField: 'tourId',
                    as: 'images'
                }
            },
            {
                $lookup: {
                    from: 'locations', // Collection images
                    localField: '_id',
                    foreignField: 'tourId',
                    as: 'locations'
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
                        maxTicket: 1,
                        minTicket: 1,
                        priceChildren: 1,
                        PromotionalPrice: 1
                    },
                    images: { _id: 1, linkImage: 1 }
                }
            }
        ]);

        if (!tours.length) {
            return { message: 'No tours found' };
        }

        return tours;
    } catch (error) {
        console.error(error);
        return false;
    }
}



// Hàm lấy danh sách tour theo categoryId và liên kết hình ảnh
const getToursByCategory = async (categoryId) => {
    try {
        const tours = await TourModule.aggregate([
            {
                $match: {
                    category: new mongoose.Types.ObjectId(categoryId),
                    status: "1"
                }
            },
            {
                $lookup: {
                    from: 'images',
                    localField: '_id',
                    foreignField: 'tourId',
                    as: 'imageInfo'
                }
            },
            {
                $lookup: {
                    from: 'locations',
                    localField: '_id',
                    foreignField: 'tourId',
                    as: 'locationInfo'
                }
            },
            {
                $lookup: {
                    from: 'details', // Tên collection Detail
                    let: { tourId: '$_id' }, // Đặt tourId hiện tại trong Tour vào biến
                    pipeline: [
                        { $match: { $expr: { $eq: ['$tourId', '$$tourId'] } } }, // Lọc detail theo tourId
                        { $limit: 1 } // Chỉ lấy 1 detail
                    ],
                    as: 'detailInfo' // Tên field chứa dữ liệu Detail sau khi nối
                }
            },
            {
                $unwind: '$category'
            },
            {
                $unwind: { path: '$detailInfo', preserveNullAndEmptyArrays: true } // Mở gói detailInfo, nếu không có vẫn trả về null
            },
            {
                $unwind: { path: '$imageInfo', preserveNullAndEmptyArrays: true } // Mở gói imageInfo, nếu không có vẫn trả về null
            },
            {
                $unwind: { path: '$locationInfo', preserveNullAndEmptyArrays: true } // Mở gói detailInfo, nếu không có vẫn trả về null
            },
            {
                $project: {
                    _id: 1,  // Đảm bảo `_id` được bao gồm trong kết quả
                    tourName: 1,
                    description: 1,
                    status: 1,
                    createAt: 1,
                    locationInfo: {
                        departure: 1,
                        destination: 1
                    },
                    imageInfo: { linkImage: 1 },
                    detailInfo: {
                        priceAdult: 1,
                        // startDay: 1,
                        priceAdult: 1,
                        PromotionalPrice: 1
                    }
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

const getToursAll = async () => {
    try {
        const tours = await TourModule.aggregate([
            {
                $match: {
                    status: "1"
                }
            },
            {
                $lookup: {
                    from: 'images',
                    localField: '_id',
                    foreignField: 'tourId',
                    as: 'imageInfo'
                }
            },
            {
                $lookup: {
                    from: 'locations',
                    localField: '_id',
                    foreignField: 'tourId',
                    as: 'locationInfo'
                }
            },
            {
                $lookup: {
                    from: 'details', // Tên collection Detail
                    let: { tourId: '$_id' }, // Đặt tourId hiện tại trong Tour vào biến
                    pipeline: [
                        { $match: { $expr: { $eq: ['$tourId', '$$tourId'] } } }, // Lọc detail theo tourId
                        { $limit: 1 } // Chỉ lấy 1 detail
                    ],
                    as: 'detailInfo' // Tên field chứa dữ liệu Detail sau khi nối
                }
            },
            {
                $unwind: '$category'
            },
            {
                $unwind: { path: '$detailInfo', preserveNullAndEmptyArrays: true } // Mở gói detailInfo, nếu không có vẫn trả về null
            },
            {
                $unwind: { path: '$imageInfo', preserveNullAndEmptyArrays: true } // Mở gói imageInfo, nếu không có vẫn trả về null
            },
            {
                $unwind: { path: '$locationInfo', preserveNullAndEmptyArrays: true } // Mở gói detailInfo, nếu không có vẫn trả về null
            },
            {
                $project: {
                    _id: 1,  // Đảm bảo `_id` được bao gồm trong kết quả
                    tourName: 1,
                    description: 1,
                    status: 1,
                    createAt: 1,
                    locationInfo: {
                        departure: 1,
                        destination: 1
                    },
                    imageInfo: { linkImage: 1 },
                    detailInfo: {
                        priceAdult: 1,
                        // startDay: 1,
                        priceAdult: 1,
                        PromotionalPrice: 1
                    }
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




const insert = async (tourName, description, category) => {
    try {
        const createAt = new Date();
        const tour = new TourModule({ tourName, description, status: 1, createAt, category });
        await tour.save();
        return tour;
    }
    catch (error) {
        console.log(error);
    }
}

module.exports = { insert, getToursByCategory, filter, getToursAll }