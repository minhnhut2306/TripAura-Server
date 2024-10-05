var express = require('express');
var router = express.Router();

const reviewController = require('../src/controller/ReviewController');
const { createResponse } = require('../src/helper/createResponse.helper');

router.post('/api/addReview', async function (req, res) {
    try {
        const { userId, tourId, rating, comment, dayReview } = req.body
        const data = await reviewController.insert({ userId: userId, tourId: tourId, rating: rating, comment: comment, dayReview: dayReview })
        if (data) {
            return res.json(createResponse(200, "Thêm review thành công.", "success", data)); 
        } else {
            return res.json(createResponse(500, "Thêm review thất bại.", "error")); 
        }
    } catch (error) {
        console.log("===== Lỗi api addreview =====", error);
        return res.json(createResponse(500, "Lỗi máy chủ khi thêm review.", "error"))

    }
})

router.post('/api/getByUserId', async function (req, res) {
    try {
        const { userId } = req.body
        const data = await reviewController.getByUserId({ userId: userId })
        if (data) {
            return res.json(createResponse(200, "Lấy review thành công.", "success", data)); 
        } else {
            return res.json(createResponse(404, "Không có review nào.", "error")); 
        }
    } catch (error) {
        console.log("===== Lỗi api getByUserId Review =====", error);
        return res.json(createResponse(500, "Lỗi máy chủ khi lấy review.", "error"));
    }
})

router.post('/api/getByTourId', async function (req, res) {
    try {
        const { tourId } = req.body
        const data = await reviewController.getByTourId({ tourId: tourId })
        if (data) {
            return res.json(createResponse(200, "Lấy review thành công.", "success", data));
        } else {
            return res.json(createResponse(404, "Không có review nào.", "error")); 
        }
    } catch (error) {
        console.log("===== Lỗi api getByUserId Review =====", error);
        return res.json(createResponse(500, "Lỗi máy chủ khi lấy review.", "error"));

    }
})
module.exports = router;