const mongoose = require('mongoose');
const _Voucher = require('../modules/VoucherModule');
const VoucherModule = require('../modules/VoucherModule');

const insert = async (voucherTypeId, discount, startDay, endDay, description, condition) => {
    try {
        console.log("============ insert========", voucherTypeId, discount, startDay, endDay, description, condition);

        const data = new _Voucher({
            voucherTypeI: voucherTypeId,
            discount: discount,
            status: 1,
            startDay: startDay,
            endDay: endDay,
            description: description,
            condition: condition
        })
        await data.save()
        return data
    } catch (error) {
        console.log("===lỗi===", error);
        return false
    }
}

const getAll = async () => {
    try {
        const data = await _Voucher.find()
        if (!data) {
            return []
        }
        return data
    } catch (error) {
        console.log("====== lỗi getAll VoucherController =======", error);
        return false

    }
}

const getByUserId = async (userId) => {
    try {
        const data = await _Voucher.find({ userId: userId })
        if (!data) {
            return []
        }
        return data
    } catch (error) {
        console.log("====== lỗi getAll VoucherController =======", error);
        return false

    }
}

const receiveVoucher = async (userId, voucherId) => {
    try {
        const data = await _Voucher.findByIdAndUpdate(
            { _id: voucherId },
            { userId: userId },
            { new: true }
        )
        if (!data) {
            return false
        }
        return data
    } catch (error) {
        console.log("======= lỗi receiveVoucher VoucherController");
        return false

    }
}

const getVoucher = async (userId) => {

    const userIdToCheck = new mongoose.Types.ObjectId(userId);
    try {
        const vouchers = await _Voucher.aggregate([
            // Bước 1: Kết nối bảng Coupon và Voucher
            {
                $lookup: {
                    from: 'coupons', // Tên collection của Coupon
                    localField: '_id', // Trường của Voucher
                    foreignField: 'voucherId', // Trường của Coupon tham chiếu tới Voucher
                    as: 'coupons', // Đặt kết quả vào trường 'coupons'
                }
            },
            // Bước 2: Thêm trường userId vào voucher nếu có trong Coupon
            {
                $addFields: {
                    receive: {
                        $cond: {
                            if: {
                                $and: [
                                    { $gt: [{ $size: '$coupons' }, 0] }, // Kiểm tra nếu có ít nhất 1 coupon
                                    { $eq: [{ $arrayElemAt: ['$coupons.userId', 0] }, userIdToCheck] } // Kiểm tra userId
                                ]
                            },
                            then: 1, // Nếu thỏa mãn điều kiện, thêm receive = 1
                            else: 0 // Nếu không, giữ receive là 0 (hoặc có thể không thêm trường này)
                        }
                    }
                }
            },
            // Bước 3: Loại bỏ trường 'coupons' không cần thiết khỏi kết quả cuối cùng
            {
                $project: {
                    coupons: 0 // Không trả về coupons
                }
            }
        ]);

        return vouchers;
    } catch (error) {
        console.error("Error fetching vouchers with userId:", error);
        throw error;

    }
}

const update = async (voucherId, voucherTypeId, discount, startDay, endDay, description, condition) => {
    try {
        const data = VoucherModule.findByIdAndUpdate(voucherId, {
            voucherTypeId, discount, startDay, endDay, description, condition
        },
            { new: true }
        )
        return data;
    } catch (error) {
        console.log("====== lỗi update VoucherController =======", error);
        return false

    }

}

const deleteVoucher = async (voucherId) => {
    try {
        const data = await _Voucher.findByIdAndDelete(voucherId)
        if (!data) {
            return false
        }
        return true
    } catch (error) {
        console.log("====== lỗi delete VoucherController =======", error);
        return false
    }
}

module.exports = { insert, getAll, getByUserId, receiveVoucher, getVoucher, update, deleteVoucher }