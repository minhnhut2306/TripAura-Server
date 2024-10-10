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
})

module.exports = router;