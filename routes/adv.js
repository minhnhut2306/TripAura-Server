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
router.put('/api/update/:id', async (req, res) => {
    try {
        const { id } = req.params
        const { image } = req.body
        const data = await advController.update(id, image)
        if (data) {
            return res.json(createResponse(200, "Sửa thành công", "success", data));
        } else {
            res.json(createResponse(500, "Sửa thất bại", "error"))
        }
    } catch (error) {
        return res.json(createResponse(500, "Đã xảy ra lỗi máy chủ", "error"));
    }
})

router.delete('/api/delete/:id', async (req, res) => {
    try {
        
        const { id } = req.params;
        const data = await advController.deleteAdv(id)
        if (data) {
            return res.json(createResponse(200, "Xóa thành công", "success", data));
        } else {
            res.json(createResponse(500, "Xóa thất bại", "error"))
        }
    } catch (error) {
        
    }
})
module.exports = router;