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
                    from: 'images',
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
                $unwind: { path: "$images", preserveNullAndEmptyArrays: true }, // Mở gói imageInfo, nếu không có vẫn trả về null
            },
            {
                $unwind: { path: "$locations", preserveNullAndEmptyArrays: true }, // Mở gói detailInfo, nếu không có vẫn trả về null
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
                        _id: 1,
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
const update = async (detalId, startDay, endDay, maxTicket, minTicket, priceAdult, priceChildren, PromotionalPrice, status) => {
    try {
        const data = await DetailModule.findByIdAndUpdate(detalId,
            {
                startDay,
                endDay,
                maxTicket,
                minTicket,
                priceAdult,
                priceChildren,
                PromotionalPrice,
                status,
            },
            { new: true });
        console.log("========== detail đã update ==========", data);
        return data;
    } catch (error) {
        console.log("========== Lỗi update detail ==========", error);
        return false

    }

}
const remove = async (detalId) => {
    try {
        const detail = await DetailModule.find({ _id: detalId, status: 1 })
        console.log("======== detail", detail);
        if (detail.length > 0) {
            return { status: 0 }
        } else {
            const deletedetails = await DetailModule.findByIdAndDelete(detalId);
            console.log("========== detail đã xóa ==========", deletedetails);
            return { status: 1, data: deletedetails };
        }

    } catch (error) {
        console.log("========== Lỗi xóa detail ==========", error);
        return { status: -1 }

    }
}

const stopSale = async (id) => {console.log(id);

    try {
        const option = await DetailModule.findByIdAndUpdate({ _id: id },
            { status: 0 }
        )
        if (option) {
            return option
        } else {
            return false
        }
    } catch (error) {
        console.log(error);
        return false
    }
}

const updateMaxTicket = async (detailid, maxTicket) => {
    try {
        const data = await DetailModule.findByIdAndUpdate(
            detailid,
            { maxTicket: maxTicket }, 
            { new: true }  
        );
        console.log('data', data);
        
        if (!data) {
            throw new Error("Không tìm thấy tài liệu để cập nhật.");
        }
        return data;
    } catch (error) {
        console.log("========== Lỗi update maxTicket ==========", error);
        return false;
    }
};
const getAll = async () =>{
    try {
        const data = await DetailModule.find({ status: 1 })
        return data
    } catch (error) {
        console.log("========== L��i get all detail ==========", error);
        return false
    }
}


module.exports = { insert, getByTourId, update, remove, stopSale,updateMaxTicket, getAll }