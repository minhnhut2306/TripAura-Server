var express = require('express');
var router = express.Router();
const voucherController = require('../src/controller/VoucherController');
const { createResponse } = require('../src/helper/createResponse.helper');

/**
 * @swagger
 * /voucher/api/addVoucher:
 *   post:
 *     summary: Thêm voucher mới
 *     description: Thêm một voucher mới với thông tin chi tiết như ID người dùng, ID loại voucher, giảm giá, trạng thái, ngày bắt đầu, ngày kết thúc, mô tả và điều kiện
 *     tags: [Voucher]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "60c72b2f9b1d4e7f5c9f6f8d"
 *               voucherTypeId:
 *                 type: string
 *                 example: "60c72b2f9b1d4e7f5c9f6f8e"
 *               discount:
 *                 type: number
 *                 example: 20
 *               status:
 *                 type: string
 *                 example: "active"
 *               startDay:
 *                 type: string
 *                 format: date
 *                 example: "2024-10-01"
 *               endDay:
 *                 type: string
 *                 format: date
 *                 example: "2024-10-31"
 *               description:
 *                 type: string
 *                 example: "Giảm giá cho tour du lịch trong tháng 10"
 *               condition:
 *                 type: string
 *                 example: "Giảm giá áp dụng cho đơn hàng trên 1 triệu đồng"
 *     responses:
 *       200:
 *         description: Thêm voucher thành công
 *       500:
 *         description: Lỗi khi thêm voucher hoặc lỗi máy chủ
 */

router.post('/api/addVoucher', async function (req, res) {
    try {
        const { userId, voucherTypeId, discount, status, startDay, endDay, description, condition } = req.body
        const data = await voucherController.insert({
            userId,
            voucherTypeId,
            discount,
            status,
            startDay,
            endDay,
            description,  
            condition
        });
        if (data) {
            return res.json(createResponse(200, "Thêm voucher thành công", "success", data)); 
        } else {
            return res.json(createResponse(500, "Lỗi khi thêm voucher", "error")); 
        }
    } catch (error) {
        console.log(error);
        return res.json(createResponse(500, "Lỗi máy chủ", "error")); 
    }
})

module.exports = router;