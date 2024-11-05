var express = require('express');
var router = express.Router();
const locationController = require('../src/controller/LocationController');
const { createResponse } = require('../src/helper/createResponse.helper');

/**
 * @swagger
 * /location/api/add:
 *   post:
 *     summary: Thêm địa điểm mới cho tour
 *     description: Thêm một địa điểm mới với thông tin về điểm khởi hành, điểm đến và tour ID
 *     tags: [Location]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               departure:
 *                 type: string
 *                 example: "Hà Nội"
 *               destination:
 *                 type: string
 *                 example: "Đà Nẵng"
 *               tourId:
 *                 type: string
 *                 example: "60c72b2f9b1d4e7f5c9f6f8b"
 *     responses:
 *       200:
 *         description: Thêm địa điểm thành công
 *       400:
 *         description: Không được để trống thông tin
 *       500:
 *         description: Lỗi máy chủ khi thêm địa điểm
 */
/**
 * @swagger
 * /location/api/update/{id}:
 *   put:
 *     summary: Cập nhật thông tin địa điểm
 *     description: Cập nhật thông tin địa điểm bao gồm điểm khởi hành, điểm đến và tour ID theo ID địa điểm
 *     tags: [Location]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID của địa điểm cần cập nhật
 *         schema:
 *           type: string
 *           example: "60c72b2f9b1d4e7f5c9f6f8e"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               departure:
 *                 type: string
 *                 example: "Hà Nội"
 *               destination:
 *                 type: string
 *                 example: "Đà Nẵng"
 *               tourId:
 *                 type: string
 *                 example: "60c72b2f9b1d4e7f5c9f6f8b"
 *     responses:
 *       200:
 *         description: Cập nhật địa điểm thành công
 *       400:
 *         description: Thông tin không hợp lệ hoặc thiếu
 *       404:
 *         description: Không tìm thấy địa điểm cần cập nhật
 *       500:
 *         description: Lỗi máy chủ khi cập nhật địa điểm
 */

/**
 * @swagger
 * /location/api/delete/{id}:
 *   delete:
 *     summary: Xóa địa điểm
 *     description: Xóa một địa điểm dựa trên ID địa điểm
 *     tags: [Location]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID của địa điểm cần xóa
 *         schema:
 *           type: string
 *           example: "60c72b2f9b1d4e7f5c9f6f8e"
 *     responses:
 *       200:
 *         description: Xóa địa điểm thành công
 *       404:
 *         description: Không tìm thấy địa điểm để xóa
 *       500:
 *         description: Lỗi máy chủ khi xóa địa điểm
 */


router.post('/api/add', async function (req, res) {
    try {
        const { departure, destination, tourId } = req.body;
        if (departure == "" || destination == "" || tourId == "") {
            return res.json(createResponse(400, "Không được để trống.", "error"));
        } else {
            const data = await locationController.insert(departure, destination, tourId)
            if (data) {
                return res.json(createResponse(200, "Thêm địa điểm thành công.", "success", data));
            } else {
                return res.json(createResponse(500, "Lỗi khi thêm địa điểm.", "error"));
            }
        }
    } catch (error) {
        console.log("Lỗi insertLocation", error);
        return res.json(createResponse(500, "Lỗi máy chủ khi thêm địa điểm.", "error"));
    }
});

router.put('/api/update/:id', async function (req, res) {
    try {
        const { id } = req.params;
        const { departure, destination, tourId } = req.body;
        const data = await locationController.update(id, departure, destination, tourId);
        if (data) {
            return res.json(createResponse(200, "Cập nhật địa điểm thành công.", "success", data));
        } else {
            return res.json(createResponse(404, "Không tìm thấy địa điểm.", "error"));
        }

    } catch (error) {
        console.log("Lỗi updateLocation", error);
        return res.json(createResponse(500, "Lỗi máy chủ khi cập nhật địa điểm.", "error"));
    }
});

router.delete('/api/delete/:id', async function (req, res) {
    try {
        const { id } = req.params
        const data = await locationController.remove(id);
        if (data) {
            return res.json(createResponse(200, "Xóa địa điểm thành công.", "success"));
        } else {
            return res.json(createResponse(404, "Không tìm thấy điạ điểm.", "error"));
        }
    } catch (error) {
        console.log("Lỗi deleteLocation", error);
        return res.json(createResponse(500, "Lỗi máy chủ khi xóa địa điểm.", "error"));

    }
})

module.exports = router;