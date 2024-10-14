const express = require('express');
const router = express.Router();
const couponController = require('../src/controller/CouponController')
const { createResponse } = require('../src/helper/createResponse.helper');

router.post('/api/add', async (req, res) => {
    try {
        const { userId, voucherId } = req.body
        if (!userId || !voucherId) {
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