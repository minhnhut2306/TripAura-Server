var express = require('express');
var router = express.Router();
var { createResponse } = require('../src/helper/createResponse.helper');
var categoryController = require('../src/controller/CategoryController');

// API thêm danh mục

/**
 * @swagger
 * /category/api/add:
 *   post:
 *     summary: Thêm danh mục
 *     description: Thêm danh mục mới vào hệ thống
 *     tags: [Category]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Thể thao"
 *               icon:
 *                 type: string
 *                 example: "https://example.com/icon.png"
 *     responses:
 *       200:
 *         description: Thêm danh mục thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       409:
 *         description: Danh mục đã tồn tại
 *       500:
 *         description: Lỗi máy chủ
 */
/**
 * @swagger
 * /category/api/getCategory:
 *   get:
 *     summary: Lấy danh sách danh mục
 *     description: Lấy tất cả các danh mục từ hệ thống
 *     tags: [Category]
 *     responses:
 *       200:
 *         description: Lấy danh sách danh mục thành công
 *       500:
 *         description: Lỗi máy chủ
 */
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
