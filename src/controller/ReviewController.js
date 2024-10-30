const _Review = require('../modules/ReviewModule')

const insert = async (userId, tourId, rating, comment, dayReview,image,fullname ) => {

    try {
        const data = new _Review(userId, tourId, rating, comment, dayReview,image,fullname)
        await data.save()
        return data
    } catch (error) {
        console.log("====== Lỗi insert Review =====", error);
        return false
    }

}

const getByUserId = async (userId) => {
    try {
        const data = await _Review.find(userId)
        if (data) {
            return data
        } else {
            return false
        }
    } catch (error) {
        console.log("====== Lỗi getByUserId Review =====", error);
        return false
    }
}

const getByTourId = async (tourId) => {
    try {
        const data = await _Review.find(tourId)
        if (data) {
            return data
        } else {
            return false
        }
    } catch (error) {
        console.log("====== Lỗi getBytourId Review =====", error);
        return false
    }
}

module.exports = { insert, getByTourId, getByUserId }