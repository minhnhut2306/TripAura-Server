const express = require('express');
const router = express.Router();
const couponController = require('../src/controller/CouponController')
const { createResponse } = require('../src/helper/createResponse.helper');


/**
 * @swagger
 * /coupon/api/add:
 *   post:
 *     summary: Nhận voucher
 *     description: Người dùng nhận voucher bằng cách cung cấp ID người dùng và ID voucher
 *     tags: [Coupon]
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
 *               voucherId:
 *                 type: string
 *                 example: "60c72b2f9b1d4e7f5c9f6f8c"
 *     responses:
 *       200:
 *         description: Nhận vouchers thành công
 *       500:
 *         description: Lỗi máy chủ khi nhận vouchers
 */

/**
 * @swagger
 * /coupon/api/getByUserId:
 *   get:
 *     summary: Lấy danh sách voucher theo userId
 *     description: Lấy danh sách voucher mà người dùng đã nhận
 *     tags: [Coupon]
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           example: "60c72b2f9b1d4e7f5c9f6f8b"
 *     responses:
 *       200:
 *         description: Lấy danh sách vouchers thành công
 *       500:
 *         description: Lỗi máy chủ khi lấy danh sách vouchers
 */
router.post('/api/add', async (req, res) => {
    try {
        const { userId, voucherId } = req.body
        if (userId == "" || voucherId == "") {
            return res.json(createResponse(500, "Vui lòng điền đầy đủ thông tin", "error"));
        }
        const data = await couponController.insert(userId, voucherId)
        if (!data) {
            return res.json(createResponse(500, "Nhận voucher thất bại", "error"));
        }
        return res.json(createResponse(200, "Nhận vouchers thành công", "success", data));
    } catch (error) {
        console.log(error);
        return res.json(createResponse(500, "Lỗi máy chủ khi khi nhận vouchers.", "error"));
    }
})

router.get('/api/getByUserId', async (req, res) => {
    try {
        const { userId } = req.query
        const data = await couponController.getByUser(userId)
        if (!data) {
            return res.json(createResponse(500, "Không tìm thấy vouchers", "failed"));
        }
        return res.json(createResponse(200, "Lấy danh sách vouchers thành công", "success", data));
    } catch (error) {
        console.log(error);
        return res.json(createResponse(500, "Lỗi máy chủ khi khi lấy danh sách vouchers.", "error"));
    }
})

module.exports = router;