var express = require('express');
var router = express.Router();
const voucherController = require('../src/controller/VoucherController');
const { createResponse } = require('../src/helper/createResponse.helper');

/**
 * @swagger
 * /voucher/api/add:
 *   post:
 *     summary: Thêm voucher mới
 *     description: Thêm một voucher mới với thông tin chi tiết như ID người dùng, ID loại voucher, giảm giá, trạng thái, ngày bắt đầu, ngày kết thúc, mô tả và điều kiện.
 *     tags: [Voucher]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "60c72b2f9b1d4e7f5c9f6f8d"
 *               voucherTypeId:
 *                 type: string
 *                 example: "60c72b2f9b1d4e7f5c9f6f8e"
 *               discount:
 *                 type: number
 *                 example: 20
 *               status:
 *                 type: string
 *                 example: "active"
 *               startDay:
 *                 type: string
 *                 format: date
 *                 example: "2024-10-01"
 *               endDay:
 *                 type: string
 *                 format: date
 *                 example: "2024-10-31"
 *               description:
 *                 type: string
 *                 example: "Giảm giá cho tour du lịch trong tháng 10"
 *               condition:
 *                 type: string
 *                 example: "Giảm giá áp dụng cho đơn hàng trên 1 triệu đồng"
 *     responses:
 *       200:
 *         description: Thêm voucher thành công
 *       500:
 *         description: Lỗi khi thêm voucher hoặc lỗi máy chủ
 */

/**
 * @swagger
 * /voucher/api/getAll:
 *   get:
 *     summary: Lấy danh sách tất cả voucher
 *     description: Lấy danh sách tất cả các voucher trong hệ thống.
 *     tags: [Voucher]
 *     responses:
 *       200:
 *         description: Lấy danh sách voucher thành công
 *       500:
 *         description: Lỗi khi lấy danh sách voucher
 */

/**
 * @swagger
 * /voucher/api/getVoucher:
 *   get:
 *     summary: Lấy danh sách voucher theo ID người dùng
 *     description: Lấy danh sách voucher dựa trên ID người dùng.
 *     tags: [Voucher]
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         description: ID của người dùng
 *         schema:
 *           type: string
 *           example: "60c72b2f9b1d4e7f5c9f6f8d"
 *     responses:
 *       200:
 *         description: Lấy danh sách voucher thành công
 *       500:
 *         description: Lỗi khi lấy danh sách voucher
 */

/**
 * @swagger
 * /voucher/api/update/{id}:
 *   put:
 *     summary: Cập nhật voucher
 *     description: Cập nhật thông tin voucher dựa trên ID voucher.
 *     tags: [Voucher]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của voucher cần cập nhật
 *         schema:
 *           type: string
 *           example: "60c72b2f9b1d4e7f5c9f6f8d"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               voucherTypeId:
 *                 type: string
 *                 example: "60c72b2f9b1d4e7f5c9f6f8e"
 *               discount:
 *                 type: number
 *                 example: 20
 *               startDay:
 *                 type: string
 *                 format: date
 *                 example: "2024-10-01"
 *               endDay:
 *                 type: string
 *                 format: date
 *                 example: "2024-10-31"
 *               description:
 *                 type: string
 *                 example: "Giảm giá cho tour du lịch trong tháng 10"
 *               condition:
 *                 type: string
 *                 example: "Giảm giá áp dụng cho đơn hàng trên 1 triệu đồng"
 *     responses:
 *       200:
 *         description: Cập nhật voucher thành công
 *       500:
 *         description: Lỗi khi cập nhật voucher
 */

/**
 * @swagger
 * /voucher/api/delete/{id}:
 *   delete:
 *     summary: Xóa voucher
 *     description: Xóa voucher theo ID.
 *     tags: [Voucher]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của voucher cần xóa
 *         schema:
 *           type: string
 *           example: "60c72b2f9b1d4e7f5c9f6f8d"
 *     responses:
 *       200:
 *         description: Xóa voucher thành công
 *       500:
 *         description: Lỗi khi xóa voucher
 */

router.post('/api/add', async function (req, res) {
    try {
        const { voucherTypeId, discount, startDay, endDay, description, condition } = req.body
        console.log("========= body ========", voucherTypeId, discount, startDay, endDay, description, condition);


        if (!voucherTypeId || !discount || !startDay || !endDay || !description || !condition) {
            return res.json(createResponse(500, "Vui lòng nhập đầy đủ thông tin.", "failed"));
        }
        const data = await voucherController.insert(
            voucherTypeId,
            discount,
            startDay,
            endDay,
            description,
            condition
        );
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
router.get('/api/getAll', async function (req, res) {
    try {
        const data = await voucherController.getAll()
        if (data) {
            return res.json(createResponse(200, "Lấy danh sách voucher thành công", "success", data));
        } else {
            return res.json(createResponse(500, "Lỗi khi Lấy danh sách voucher", "error"));
        }
    } catch (error) {
        console.log(error);
        return res.json(createResponse(500, "Lỗi máy chủ", "error"));
    }
})

router.get('/api/getVoucher', async (req, res) => {
    try {
        const { userId } = req.query
        const data = await voucherController.getVoucher(userId)
        if (!data) {
            return res.json(createResponse(500, "Lỗi khi Lấy danh sách voucher", "error"));
        }
        return res.json(createResponse(200, "Lấy danh sách voucher thành công", "success", data));
    } catch (error) {
        console.log(error);
        return res.json(createResponse(500, "Lỗi máy chủ", "error"));
    }
});

router.put('/api/update/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { voucherTypeId, discount, startDay, endDay, description, condition } = req.body;
        const data = await voucherController.update(id, voucherTypeId, discount, startDay, endDay, description, condition);
        if (data) {
            return res.json(createResponse(200, "Cập nhật voucher thành công", "success", data));
        } else {
            return res.json(createResponse(500, "Lỗi khi cập nhật voucher", "error"));
        }

    } catch (error) {
        console.log(error);
        return res.json(createResponse(500, "Lỗi máy chủ", "error"));

    }
}
)

router.delete('/api/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const data = await voucherController.deleteVoucher(id);
        if (data) {
            return res.json(createResponse(200, "Xóa voucher thành công", "success", data));
        } else {
            return res.json(createResponse(500, "Lỗi khi xóa voucher", "error"));
        }
    } catch (error) {
        console.log(error);
        return res.json(createResponse(500, "Lỗi máy chủ", "error"));
    }
});

module.exports = router;