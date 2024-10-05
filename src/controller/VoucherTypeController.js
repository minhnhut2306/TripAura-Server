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

module.exports = { insert }