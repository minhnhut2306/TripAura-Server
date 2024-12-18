const _Tinh = require('../modules/TinhModule')

const insert = async (name) => {
    console.log(name);
    try {
        const tinh = new _Tinh({ name })
        await tinh.save()
        return tinh
    } catch (error) {
        console.log("=========== lỗi insert tinh", error);
        return false
    }
}

const getAll = async () => {
    try {
        const tinh = await _Tinh.find()
        if (tinh) {
            return tinh
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}

module.exports = { insert, getAll }


