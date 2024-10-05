var express = require('express');
var router = express.Router();
var { createResponse } = require('../src/helper/createResponse.helper');
var categoryController = require('../src/controller/CategoryController');

// API thêm danh mục
router.post('/api/add', async function (req, res) {
    try {
        const { name, icon } = req.body;

        if (!name || !icon) {
            return res.json(createResponse(400, "Tên và biểu tượng không được để trống", "error")); 
        }

        const category = await categoryController.insert(name, icon);
        if (category) {
            return res.json(createResponse(200, "Thêm danh mục thành công", "success", category)); 
        } else {
            return res.json(createResponse(409, "Danh mục đã tồn tại", "error")); 
        }
    } catch (error) {
        console.error(error);
         return res.json(createResponse(500, "Lỗi máy chủ khi thêm danh mục", "error"));
    }
});

// API lấy danh sách danh mục
router.get('/api/getCategory', async function (req, res) {
    try {
        const categories = await categoryController.getAll();
        return res.json(createResponse(200, "Lấy danh sách danh mục thành công", "success", categories));
    } catch (error) {
        console.error(error);
         return res.json(createResponse(500, "Lỗi máy chủ khi lấy danh mục.", "error"));
    }
});

module.exports = router;
