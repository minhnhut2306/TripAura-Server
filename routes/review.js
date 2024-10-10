var express = require('express');
var router = express.Router();

const reviewController = require('../src/controller/ReviewController');
const { createResponse } = require('../src/helper/createResponse.helper');
/**
 * @swagger
 * /review/api/addReview:
 *   post:
 *     summary: Thêm đánh giá cho tour
 *     description: Thêm một đánh giá mới cho tour với thông tin người dùng, điểm đánh giá, bình luận và ngày đánh giá
 *     tags: [Review]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "60c72b2f9b1d4e7f5c9f6f8b"
 *               tourId:
 *                 type: string
 *                 example: "60c72b2f9b1d4e7f5c9f6f8c"
 *               rating:
 *                 type: number
 *                 example: 4
 *               comment:
 *                 type: string
 *                 example: "Tour rất tuyệt vời!"
 *               dayReview:
 *                 type: string
 *                 example: "2024-10-10"
 *     responses:
 *       200:
 *         description: Thêm review thành công
 *       500:
 *         description: Lỗi máy chủ khi thêm review
 */
/**
 * @swagger
 * /review/api/getByUserId:
 *   post:
 *     summary: Lấy danh sách đánh giá của người dùng
 *     description: Lấy danh sách đánh giá theo User ID
 *     tags: [Review]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "60c72b2f9b1d4e7f5c9f6f8b"
 *     responses:
 *       200:
 *         description: Lấy review thành công
 *       404:
 *         description: Không có review nào
 *       500:
 *         description: Lỗi máy chủ khi lấy review
 */
/**
 * @swagger
 * /review/api/getByTourId:
 *   post:
 *     summary: Lấy danh sách đánh giá cho tour
 *     description: Lấy danh sách đánh giá theo Tour ID
 *     tags: [Review]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tourId:
 *                 type: string
 *                 example: "60c72b2f9b1d4e7f5c9f6f8c"
 *     responses:
 *       200:
 *         description: Lấy review thành công
 *       404:
 *         description: Không có review nào
 *       500:
 *         description: Lỗi máy chủ khi lấy review
 */

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