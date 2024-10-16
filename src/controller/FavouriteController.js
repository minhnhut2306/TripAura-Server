const mongoose = require('mongoose');
const _Favourite = require('../modules/FavouriteModule')
const _Tour = require('../modules/TourModule')
const _User = require('../modules/UserModle')



const favourite = async (userId, tourId) => {
    try {
        let a = false
        const tour = await _Favourite.find({ userId: userId })
        tour.forEach((value, key) => {
            if (value.tourId == tourId) {
                a = true
                return -1
            }
        });
        if (a) {
            await _Favourite.deleteOne({ tourId: tourId, userId: userId })
            return 0; // 0- xóa thành công
        } else {
            const data = new _Favourite({ userId: userId, tourId: tourId })
            await data.save()
            return 1;
        }

    } catch (error) {
        console.log("=====Lỗi Favourite=====", error);
        return false
    }
}

// favourite("670603408e6c85a630295708", "6704a28526be2256863506e1")


const insert = async (userId, tourId) => {
    try {
        const data = new _Favourite(userId, tourId)
        await data.save()
        return data
    } catch (error) {
        console.log("=====Lỗi insert Favourite=====", error);
        return false
    }
}


const remove = async (tourId, userId) => {
    try {
        await _Favourite.deleteOne({ tourId: tourId, userId: userId });
        return 1;
    }
    catch (error) {
        console.log(error);
        return false
    }
}


module.exports = { insert, remove, favourite }