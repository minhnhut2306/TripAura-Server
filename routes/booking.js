var express = require('express');
var router = express.Router();

const bookingController = require('../src/controller/BookingController')
var { createResponse } = require('./../src/helper/createResponse.helper');


router.post('/api/addToCart', async function (req, res) {
    try {
        const { detailId, userId, voucherId, numAdult, numchildren, priceAdult, priceChildren, createAt, status } = req.body
        const data = await bookingController.insert({ detailId: detailId, userId: userId, voucherId: voucherId, numAdult: numAdult, numchildren: numchildren, priceAdult: priceAdult, priceChildren: priceChildren, createAt: createAt, status: status })
        if (data) {
            return res.json(createResponse(400, "Add thành công", "success", data));
        } else {
            res.json(createResponse(500, "Add thất bại", "error"))
        }
    } catch (error) {
        return res.json(createResponse(500, "Đã xảy ra lỗi máy chủ", "error"));
    }
})

module.exports = router;