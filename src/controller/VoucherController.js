const _Voucher = require('../modules/VoucherModule')

const insert = async (userId, voucherTypeId, discount, status, startDay, endDay, condition, description) => {
    try {
        const data = new _Voucher(userId, voucherTypeId, discount, status, startDay, endDay, description, condition)
        await data.save()
        return data
    } catch (error) {
        console.log("===lỗi===", error);
        return false
    }
}

module.exports = { insert }