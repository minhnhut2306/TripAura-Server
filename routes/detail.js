var express = require('express');
var router = express.Router();

var detailController = require('../src/controller/DetailController');
const { createResponse } = require('../src/helper/createResponse.helper');


/**
 * @swagger
 * /detail/api/add:
 *   post:
 *     summary: Thêm chi tiết tour
 *     description: Thêm thông tin chi tiết cho tour
 *     tags: [Detail]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               startDay:
 *                 type: string
 *                 example: "2024-01-01"
 *               endDay:
 *                 type: string
 *                 example: "2024-01-05"
 *               maxTicket:
 *                 type: number
 *                 example: 50
 *               minTicket:
 *                 type: number
 *                 example: 10
 *               priceAdult:
 *                 type: number
 *                 example: 2000000
 *               priceChildren:
 *                 type: number
 *                 example: 1000000
 *               PromotionalPrice:
 *                 type: number
 *                 example: 1500000
 *               tourId:
 *                 type: string
 *                 example: "60c72b2f9b1d4e7f5c9f6f8b"
 *     responses:
 *       200:
 *         description: Thêm chi tiết tour thành công
 *       400:
 *         description: Thiếu dữ liệu
 *       500:
 *         description: Lỗi máy chủ
 */
/**
 * @swagger
 * /detail/api/getByTourId:
 *   post:
 *     summary: Lấy thông tin chi tiết tour theo Tour ID
 *     description: Lấy thông tin chi tiết dựa trên ID của tour
 *     tags: [Detail]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tourId:
 *                 type: string
 *                 example: "60c72b2f9b1d4e7f5c9f6f8b"
 *     responses:
 *       200:
 *         description: Lấy thông tin thành công
 *       500:
 *         description: Lỗi khi lấy dữ liệu
 */

/**
 * @swagger
 * /detail/api/update/{id}:
 *   put:
 *     summary: Cập nhật thông tin chi tiết tour
 *     description: Cập nhật các thông tin chi tiết cho tour dựa trên ID
 *     tags: [Detail]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID của chi tiết tour cần cập nhật
 *         schema:
 *           type: string
 *           example: "60c72b2f9b1d4e7f5c9f6f8b"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               startDay:
 *                 type: string
 *                 example: "2024-01-01"
 *               endDay:
 *                 type: string
 *                 example: "2024-01-05"
 *               maxTicket:
 *                 type: number
 *                 example: 50
 *               minTicket:
 *                 type: number
 *                 example: 10
 *               priceAdult:
 *                 type: number
 *                 example: 2000000
 *               priceChildren:
 *                 type: number
 *                 example: 1000000
 *               PromotionalPrice:
 *                 type: number
 *                 example: 1500000
 *               status:
 *                 type: string
 *                 example: "active"
 *               tourId:
 *                 type: string
 *                 example: "60c72b2f9b1d4e7f5c9f6f8b"
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       404:
 *         description: Không tìm thấy chi tiết tour
 *       500:
 *         description: Lỗi máy chủ
 */

/**
 * @swagger
 * /detail/api/delete/{id}:
 *   delete:
 *     summary: Xóa thông tin chi tiết tour
 *     description: Xóa thông tin chi tiết cho tour dựa trên ID
 *     tags: [Detail]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID của chi tiết tour cần xóa
 *         schema:
 *           type: string
 *           example: "60c72b2f9b1d4e7f5c9f6f8b"
 *     responses:
 *       200:
 *         description: Xóa thành công
 *       404:
 *         description: Không tìm thấy chi tiết tour để xóa
 *       500:
 *         description: Lỗi máy chủ
 */

router.post('/api/add', async function (req, res) {
    try {
        const { startDay, endDay, maxTicket, minTicket, priceAdult, priceChildren, PromotionalPrice, tourId } = req.body;

        if (startDay == "" ||
            endDay == "" ||
            maxTicket == "" ||
            minTicket == "" ||
            priceAdult == "" ||
            priceChildren == "" ||
            PromotionalPrice == "" ||
            tourId == "") {
            res.json("chưa dduur dữ liệu ")
        } else {
            const option = await detailController
                .insert(startDay, endDay, maxTicket, minTicket, priceAdult, priceChildren, PromotionalPrice, tourId)
            if (option) {
                return res.json(createResponse(200, "Thêm dữ liệu thành công", "success", option))
            } else {
                return res.json(createResponse(500, "Lỗi Add", "error"));
            }
        }
    } catch (error) {
        console.log(error);
    }
})

router.post('/api/getByTourId', async function (req, res) {
    try {
        const { tourId } = req.body;

        const detailTours = await detailController.getByTourId(tourId)
        if (detailTours) {
            return res.json(createResponse(200, "Lấy dữ liệu thành công", "success", detailTours))
        } else {
            return res.json(createResponse(500, "Không có dữ liệu", "error"));
        }

    } catch (error) {
        console.log(error);
    }
})

router.put('/api/update/:id', async function (req, res) {
    try {
        const { id } = req.params;
        const { startDay, endDay, maxTicket, minTicket, priceAdult, priceChildren, PromotionalPrice, status } = req.body;
        const data = await detailController.update(id, startDay, endDay, maxTicket, minTicket, priceAdult, priceChildren, PromotionalPrice, status)

        if (data) {
            return res.json(createResponse(200, "Cập nhật thành công", "success"));
        } else {
            return res.json(createResponse(500, "Cập nhật thông tin thất bại", "error"));
        }
    } catch (error) {
        console.log(error);
        return res.json(createResponse(500, "Đã xảy ra lỗi máy chủ", "error"));
    }
});

router.delete('/api/delete/:id', async function (req, res) {
    try {
        const { id } = req.params;
        const data = await detailController.remove(id)
        if (data.status == 1) {
            return res.json(createResponse(200, "Xóa thành công", "success"));
        }
        if (data.status == 0) {
            return res.json(createResponse(500, "Không thể xóa Option này, Obtion hiện đang được bán. Hãy dừng việc bán trước khi xóa", "failed"));
        }
    } catch (error) {
        console.log(error);
        return res.json(createResponse(500, "Đã xảy ra lỗi máy chủ", "error"));

    }
})

router.put('/api/stopSale', async (req, res) => {
    try {
        const { id } = req.body
        const data = await detailController.stopSale(id)

        if (data) {
            return res.json(createResponse(200, "Dừng bán thành công", "success"));
        } else {
            return res.json(createResponse(500, "lỗi Dừng bán", "faile"));
        }
    } catch (error) {
        console.log(error);

        return res.json(createResponse(500, "lỗi Server", "error"));

    }
})

router.put('/api/updateTicket/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { maxTicket } = req.body;

        const data = await detailController.updateMaxTicket(id, maxTicket);
        console.log('updated', data);
        if (data) {
            return res.json(createResponse(200, "Cập nhật thành công", "success", data));
        } else {
            return res.json(createResponse(500, "Cập nhật thông tin thất bại", "error"));
        }
    } catch (error) {
        console.log(error);
        return res.json(createResponse(500, "Lỗi hệ thống", "error"));
    }
});
router.get('/api/getAll', async (req, res) => {
    try {
        const data = await detailController.getAll();
        if (data) {
            return res.json(createResponse(200, "Lấy dữ liệu thành công", "success", data));
        } else {
            return res.json(createResponse(500, "Không tìm thấy dữ liệu", "error"));
        }
    } catch (error) {
        console.log(error);
        return res.json(createResponse(500, "L��i máy chủ", "error"));
    }
})

router.get('/api/getDetail', async (req, res) => {
    try {
        const { detailId } = req.query
        const detail = await detailController.getByDetailId(detailId)
        if (detail) {
            return res.json(createResponse(200, "get thành công", "success", detail));
        } else {
            return res.json(createResponse(400, "get Thất bại", "failed"));
        }
    } catch (error) {
        console.log(error);
        return res.json(createResponse(500, "Lỗi thất bại", "error"));
    }
})

module.exports = router;