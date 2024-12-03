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
const getByTinh = async (tinhId) => {
    try {
        const diaDiems = await _DiaDiem.find({ TinhId: tinhId })
        if (diaDiems) {
            console.log('==== diaDiems', diaDiems);
            return diaDiems

        } else {
            return false
        }
    } catch (error) {
        console.log("=========== lỗi get diaDiem", error);
        return false
    }
}

// getByTinh("673ffa5e736f2f1bbfadb92b")

module.exports = { insert, getByTinh }