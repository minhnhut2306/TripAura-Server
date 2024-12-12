const _Review = require('../modules/ReviewModule')

const insert = async (userId, tourId, rating, comment, dayReview, image, fullname, avatar) => {

    try {
        const data = new _Review(userId, tourId, rating, comment, dayReview, image, fullname, avatar)
        await data.save()
        return data
    } catch (error) {
        console.log("====== Lỗi insert Review =====", error);
        return false
    }

}

const insertmau = async (userId, tourId, rating, comment, dayReview, image, fullname, avatar) => {

    try {
        const data = new _Review(userId, tourId, rating, comment, dayReview, image, fullname, avatar)
        await data.save()
        return data
    } catch (error) {
        console.log("====== Lỗi insert Review =====", error);
        return false
    }

}

const getByUserId = async (userId) => {
    console.log(userId);

    try {
        const data = await _Review.find({ userId: userId })
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

const getReviewsByUseridandTourId = async (filter) => {
    try {
        console.log('Inside getReviewsByUseridandTourId, filter:', filter); // Log filter here
        const validFilter = {};
        if (filter.userId) validFilter.userId = filter.userId;
        if (filter.tourId) validFilter.tourId = filter.tourId;
        const data = await _Review.find(validFilter);
        console.log('Fetched data:', data); // Log the data fetched from the database
        return data.length > 0 ? data : false;
    } catch (error) {
        console.log("====== Lỗi getReviews =====", error);
        return false;
    }
};


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

const update = async (reviewId, rating, comment, image) => {
    try {
        const data = await _Review.findByIdAndUpdate(reviewId, {
            rating, comment, image
        }, {
            new: true
        })
        return data;
    } catch (error) {
        console.log("====== Lỗi update Review =====", error);
        return false

    }

}
const remove = async (reviewId) => {
    try {
        const data = await _Review.findByIdAndDelete(reviewId);
        return data;
    } catch (error) {
        console.log("====== Lỗi remove Review =====", error);
        return false;

    }
}
module.exports = { insert, getByTourId, getByUserId, update, remove,insertmau,getReviewsByUseridandTourId}