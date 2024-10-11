const _Adv = require('../modules/AdvModule')

const insert = async (image) => {
    try {
        const adv = new _Adv({ image: image })
        await adv.save()
        return adv;
    } catch (error) {
        console.log("==== lỗi add adv ======");
        return false;
    }
}

const getAll = async () => {
    try {
        const advs = await _Adv.find()
        if (advs) {
            return advs;
        } else {
            return false
        }
    } catch (error) {
        console.log("==== lỗi get adv ======");
        return false;

    }
}

module.exports = { insert, getAll }