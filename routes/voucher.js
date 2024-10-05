var express = require('express');
var router = express.Router();
const voucherController = require('../src/controller/VoucherController');
const { createResponse } = require('../src/helper/createResponse.helper');

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