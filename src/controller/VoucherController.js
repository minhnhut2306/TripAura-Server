const _Voucher = require('../modules/VoucherModule')

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


module.exports = { insert, getAll, getByUserId, receiveVoucher }