var express = require('express');
var router = express.Router();
const bookingController = require('../src/controller/BookingController')
var { createResponse } = require('./../src/helper/createResponse.helper');


/**
 * @swagger
 * /booking/api/addToCart:
 *   post:
 *     summary: Thêm vào giỏ hàng
 *     description: Thêm sản phẩm vào giỏ hàng
 *     tags: [Booking]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               detailId:
 *                 type: string  
 *                 example: "60c72b2f9b1d4e7f5c9f6f8b" 
 *               userId:
 *                 type: string  
 *                 example: "60c72b2f9b1d4e7f5c9f6f8c" 
 *               voucherId:
 *                 type: string 
 *                 example: "60c72b2f9b1d4e7f5c9f6f8d"
 *               numAdult:
 *                 type: number 
 *                 example: 2 
 *               numchildren:
 *                 type: number 
 *                 example: 1 
 *               priceAdult:
 *                 type: number 
 *                 example: 200000 
 *               priceChildren:
 *                 type: number 
 *                 example: 100000 
 *               createAt:
 *                 type: number 
 *                 example: 1634579200 
 *               status:
 *                 type: number 
 *                 example: 1 
 *     responses:
 *       200:
 *         description: Thêm vào giỏ hàng thành công
 *       500:
 *         description: Lỗi máy chủ
 */


router.post('/api/addToCart', async function (req, res) {
    try {
        const { detailId, userId, voucherId, numAdult, numchildren, priceAdult, priceChildren } = req.body
        const createAt = new Date()
        const data = await bookingController.insert(detailId, userId, voucherId, numAdult, numchildren, priceAdult, priceChildren, createAt, 1)
        if (data) {
            return res.json(createResponse(200, "Add thành công", "success", data));
        } else {
            res.json(createResponse(500, "Add thất bại", "error"))
        }
    } catch (error) {
        return res.json(createResponse(500, "Đã xảy ra lỗi máy chủ", "error"));
    }
})

module.exports = router;