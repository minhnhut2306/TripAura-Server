var express = require('express');
var router = express.Router();

const vouchetController = require('../src/controller/VoucherTypeController');
const { createResponse } = require('../src/helper/createResponse.helper');

/**
 * @swagger
 * /voucherType/api/addVoucherType:
 *   post:
 *     summary: Thêm loại voucher mới
 *     tags: [VoucherType]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Giảm giá cho tour"
 *     responses:
 *       200:
 *         description: Thành công
 *       500:
 *         description: Lỗi máy chủ
 */



router.post('/api/addVoucherType', async function (req, res) {
    try {
        const { name } = req.body
        const data = await vouchetController.insert({ name: name })
        if (data) {
            return res.json(createResponse(200, "Thêm loại voucher thành công", "success", data)); 
        } else {
            return res.json(createResponse(500, "Lỗi khi thêm loại voucher", "error"));
        }
    } catch (error) {
        console.log("===== lỗi api addVoucherType ======", error);
        return res.json(createResponse(500, "Lỗi máy chủ", "error"));
    }
})

module.exports = router;