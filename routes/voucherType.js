var express = require('express');
var router = express.Router();

const vouchetController = require('../src/controller/VoucherTypeController');
const { createResponse } = require('../src/helper/createResponse.helper');

/**
 * @swagger
 * /voucher/api/addVoucherType:
 *   post:
 *     summary: Thêm loại voucher mới
 *     description: Thêm một loại voucher mới với tên loại voucher.
 *     tags: [VoucherType]
 *     requestBody:
 *       required: true
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
 *         description: Thêm loại voucher thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: number
 *                   example: 200
 *                 msg:
 *                   type: string
 *                   example: "Thêm loại voucher thành công"
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "60c72b2f9b1d4e7f5c9f6f8f"
 *                     name:
 *                       type: string
 *                       example: "Giảm giá cho tour"
 *       500:
 *         description: Lỗi khi thêm loại voucher hoặc lỗi máy chủ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: number
 *                   example: 500
 *                 msg:
 *                   type: string
 *                   example: "Lỗi máy chủ"
 *                 status:
 *                   type: string
 *                   example: "error"
 */

/**
 * @swagger
 * /voucher/api/getAll:
 *   get:
 *     summary: Lấy danh sách tất cả loại voucher
 *     description: Lấy danh sách tất cả các loại voucher trong hệ thống.
 *     tags: [VoucherType]
 *     responses:
 *       200:
 *         description: Lấy danh sách loại voucher thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: number
 *                   example: 200
 *                 msg:
 *                   type: string
 *                   example: "Lấy danh sách loại voucher thành công"
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "60c72b2f9b1d4e7f5c9f6f8f"
 *                       name:
 *                         type: string
 *                         example: "Giảm giá cho tour"
 *       500:
 *         description: Lỗi khi lấy danh sách loại voucher
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: number
 *                   example: 500
 *                 msg:
 *                   type: string
 *                   example: "Lỗi máy chủ"
 *                 status:
 *                   type: string
 *                   example: "error"
 */

/**
 * @swagger
 * /voucher/api/update/{id}:
 *   put:
 *     summary: Cập nhật loại voucher
 *     description: Cập nhật thông tin loại voucher dựa trên ID loại voucher.
 *     tags: [VoucherType]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của loại voucher cần cập nhật
 *         schema:
 *           type: string
 *           example: "60c72b2f9b1d4e7f5c9f6f8f"
 *     requestBody:
 *       required: true
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
 *         description: Cập nhật loại voucher thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: number
 *                   example: 200
 *                 msg:
 *                   type: string
 *                   example: "Cập nhật loại voucher thành công"
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "60c72b2f9b1d4e7f5c9f6f8f"
 *                     name:
 *                       type: string
 *                       example: "Giảm giá cho tour"
 *       500:
 *         description: Lỗi khi cập nhật loại voucher
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: number
 *                   example: 500
 *                 msg:
 *                   type: string
 *                   example: "Lỗi máy chủ"
 *                 status:
 *                   type: string
 *                   example: "error"
 */

/**
 * @swagger
 * /voucher/api/delete/{id}:
 *   delete:
 *     summary: Xóa loại voucher
 *     description: Xóa loại voucher theo ID.
 *     tags: [VoucherType]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của loại voucher cần xóa
 *         schema:
 *           type: string
 *           example: "60c72b2f9b1d4e7f5c9f6f8f"
 *     responses:
 *       200:
 *         description: Xóa loại voucher thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: number
 *                   example: 200
 *                 msg:
 *                   type: string
 *                   example: "Xóa loại voucher thành công"
 *                 status:
 *                   type: string
 *                   example: "success"
 *       500:
 *         description: Lỗi khi xóa loại voucher
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: number
 *                   example: 500
 *                 msg:
 *                   type: string
 *                   example: "Lỗi máy chủ"
 *                 status:
 *                   type: string
 *                   example: "error"
 */



router.post('/api/add', async function (req, res) {
    try {
        const { name } = req.body
        if (!name) {
            return res.json(createResponse(500, "Vui lòng nhập đầy đủ thông tin.", "failed"));
        }
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

router.get('/api/getAll', async function (req, res) {
    try {

        const data = await vouchetController.getAll()
        if (data) {
            return res.json(createResponse(200, "Lấy danh sách loại voucher thành công", "success", data));
        } else {
            return res.json(createResponse(200, "Không tìm thấy dữ liệu", "success"));
        }
    } catch (error) {
        console.log("===== lỗi api addVoucherType ======", error);
        return res.json(createResponse(500, "Lỗi máy chủ", "error"));
    }
})

router.put("/api/update/:id", async function (req, res) {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const data = await vouchetController.update(id, name);
        if (data) {
            return res.json(createResponse(200, "Cập nhật loại voucher thành công", "success", data));
        } else {
            return res.json(createResponse(500, "Lỗi khi cập nhật loại voucher", "error"));
        }
        
    } catch (error) {
        console.log("===== lỗi api updateVoucherType ======", error);
        return res.json(createResponse(500, "Lỗi máy chủ", "error"));

    }
});

router.delete("/api/delete/:id", async function (req, res) {
    try {
        const { id } = req.params;
        const data = await vouchetController.delete(id);
        if (data) {
            return res.json(createResponse(200, "Xóa loại voucher thành công", "success", data));
        } else {
            return res.json(createResponse(500, "Lỗi khi xóa loại voucher", "error"));
        }
    } catch (error) {
        console.log("===== lỗi api deleteVoucherType ======", error);
        return res.json(createResponse(500, "Lỗi máy chủ", "error"));
    }
 
})

module.exports = router;