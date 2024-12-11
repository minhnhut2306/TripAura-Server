const mongoose = require('mongoose');
const _Coupon = require('../modules/CouponModule')

const insert = async (userId, voucherId) => {
    try {
        const data = new _Coupon({ userId: userId, voucherId: voucherId })
        await data.save()
        return data
    } catch (error) {
        console.log("======== lỗi insert couponController ===========", error);
        return false
    }
}

const getByUser = async (userId) => {
    try {
        const data = await _Coupon.find(
            { userId: new mongoose.Types.ObjectId(userId) }

        ).populate({
            path: 'voucherId',
            match: { status: '1' }, // Lấy các voucher có status là 'active'
            select: '_id discount status startDay endDay description condition' // Chỉ lấy các trường cần thiết
        })
        if (!data.length) {
            return false
        }
        return data
    } catch (error) {
        console.log("========= lỗi getByUser couponController ===========", error);

        return false
    }
}

const deleteCoupon = async (couponId) => {
    try {
        const coupon = await _Coupon.findByIdAndDelete({ _id: couponId })
        if (coupon) {
            console.log("coupon", coupon);
            return coupon
        } else {
            return false
        }
    } catch (error) {

    }
}
// deleteCoupon("670c8bf2158535a5b3be9b7c")


module.exports = { insert, getByUser, deleteCoupon }