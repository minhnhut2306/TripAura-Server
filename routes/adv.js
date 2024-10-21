var express = require('express');
var router = express.Router();
const advController = require('../src/controller/AdvController')
var { createResponse } = require('./../src/helper/createResponse.helper');

router.post('/api/add', async function (req, res) {
    try {
        const { image } = req.body
        const data = await advController.insert( image)
        if (data) {
            return res.json(createResponse(200, "Add thành công", "success", data));
        } else {
            res.json(createResponse(500, "Add thất bại", "error"))
        }
    } catch (error) {
        return res.json(createResponse(500, "Đã xảy ra lỗi máy chủ", "error"));
    }
})

router.get('/api/getAll', async function (req, res) {
    try {
        const data = await advController.getAll()
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