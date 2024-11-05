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

const update = async (imageid, image) => {
    try {
        const adv = await _Adv.findByIdAndUpdate(imageid,
            { image }, { new: true });
        return adv;

    } catch (error) {
        console.log("==== lôxi update adv ======");
        return false;

    }
}

const deleteAdv = async (imageid) => {
    try {
        const deleteadv = await _Adv.findByIdAndDelete(imageid);
        return deleteadv;
    } catch (error) {
        console.log("==== lỗi delete adv ======");
        return false;
        
    }
}

module.exports = { insert, getAll, update,deleteAdv}