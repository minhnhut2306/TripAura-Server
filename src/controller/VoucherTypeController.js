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

module.exports = { insert, getAll }