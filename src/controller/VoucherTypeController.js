const async = require('hbs/lib/async')
const _VoucherType = require('../modules/VoucherTypeModule')

const insert = async (name) => {
    try {
        const data = new _VoucherType(name)
        await data.save()
        return data
    } catch (error) {
        console.log("===== Lỗi insert VoucherType");
        return false
    }
}

const getAll = async () => {
    try {
        const data = _VoucherType.find()
        if (!data) {
            return []
        }
        return data
    } catch (error) {
        console.log("====== lỗi getAll VoucherTypeController =====", error);
        return false
    }
}
const update = async (voucherTypeId, name) => {
    try {
        const data = await _VoucherType.findByIdAndUpdate(voucherTypeId,
            { name: name },
            { new: true })
        return data
    } catch (error) {
        console.log("===== Lỗi update VoucherType");
        return false
    }
}

const remove = async (voucherTypeId) => {
    try {
        const data = await _VoucherType.findByIdAndDelete(voucherTypeId)
        return data
    } catch (error) {
        console.log("===== Lỗi remove VoucherType");
        return false
    }
}

module.exports = { insert, getAll,update,remove }