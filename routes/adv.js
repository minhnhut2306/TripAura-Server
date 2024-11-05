var express = require('express');
var router = express.Router();
const advController = require('../src/controller/AdvController');
var { createResponse } = require('./../src/helper/createResponse.helper');

/**
 * @swagger
 * /adv/api/add:
 *   post:
 *     summary: Thêm danh mục
 *     description: Thêm danh mục mới vào hệ thống
 *     tags: [Adv]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 example: "http://image1.jpg"
 *                 description: "Đường dẫn đến ảnh của danh mục"
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
router.post('/api/add', async function (req, res) {
    try {
        const { image } = req.body;
        const data = await advController.insert(image);
        if (data) {
            return res.json(createResponse(200, "Add thành công", "success", data));
        } else {
            res.json(createResponse(500, "Add thất bại", "error"));
        }
    } catch (error) {
        return res.json(createResponse(500, "Đã xảy ra lỗi máy chủ", "error"));
    }
});

/**
 * @swagger
 * /adv/api/getAll:
 *   get:
 *     summary: Lấy tất cả danh mục
 *     description: Lấy danh sách tất cả các danh mục quảng cáo
 *     tags: [Adv]
 *     responses:
 *       200:
 *         description: Lấy danh mục thành công
 *       500:
 *         description: Lỗi máy chủ
 */
router.get('/api/getAll', async function (req, res) {
    try {
        const data = await advController.getAll();
        if (data) {
            return res.json(createResponse(200, "Lấy danh sách thành công", "success", data));
        } else {
            res.json(createResponse(500, "Lấy danh sách thất bại", "error"));
        }
    } catch (error) {
        return res.json(createResponse(500, "Đã xảy ra lỗi máy chủ", "error"));
    }
});

/**
 * @swagger
 * /adv/api/update/{id}:
 *   put:
 *     summary: Sửa danh mục
 *     description: Sửa thông tin danh mục dựa trên ID
 *     tags: [Adv]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của danh mục cần sửa
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 example: "http://image1.jpg"
 *                 description: "Đường dẫn đến ảnh mới của danh mục"
 *     responses:
 *       200:
 *         description: Sửa danh mục thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       404:
 *         description: Danh mục không tồn tại
 *       500:
 *         description: Lỗi máy chủ
 */
router.put('/api/update/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { image } = req.body;
        const data = await advController.update(id, image);
        if (data) {
            return res.json(createResponse(200, "Sửa thành công", "success", data));
        } else {
            res.json(createResponse(500, "Sửa thất bại", "error"));
        }
    } catch (error) {
        return res.json(createResponse(500, "Đã xảy ra lỗi máy chủ", "error"));
    }
});

/**
 * @swagger
 * /adv/api/delete/{id}:
 *   delete:
 *     summary: Xóa danh mục
 *     description: Xóa danh mục dựa trên ID
 *     tags: [Adv]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của danh mục cần xóa
 *     responses:
 *       200:
 *         description: Xóa danh mục thành công
 *       404:
 *         description: Danh mục không tồn tại
 *       500:
 *         description: Lỗi máy chủ
 */
router.delete('/api/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const data = await advController.deleteAdv(id);
        if (data) {
            return res.json(createResponse(200, "Xóa thành công", "success", data));
        } else {
            res.json(createResponse(500, "Xóa thất bại", "error"));
        }
    } catch (error) {
        return res.json(createResponse(500, "Đã xảy ra lỗi máy chủ", "error"));
    }
});

module.exports = router;
