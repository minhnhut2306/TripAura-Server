const _DiaDiem = require('../modules/DiaDiemModule')

const insert = async (name, images, time, price, TinhId) => {
    try {
        const diaDiem = new _DiaDiem({ name, images, time, price, TinhId })
        await diaDiem.save()
        return diaDiem
    } catch (error) {
        console.log("=========== lỗi insert diaDiem", error);
        return false
    }
}

module.exports = { insert }