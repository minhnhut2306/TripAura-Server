const mongoose = require('mongoose');
const _Favourite = require('../modules/FavouriteModule')

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

const getAll = async (userId) => {
    try {
        const data = await _Favourite.find({ userId: userId })
        if (data) {
            return data
        } else {
            return false
        }
    } catch (error) {
        console.log("===== Lỗi getAll Favourite =====", error);
        return false

    }
}

module.exports = { insert, getAll }