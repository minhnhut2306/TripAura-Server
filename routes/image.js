var express = require('express');
var router = express.Router();

var imageController = require('../src/controller/ImageController');
const { createResponse } = require('../src/helper/createResponse.helper');

router.post('/api/add', async function (req, res) {
    try {
        const { linkImage, tourId } = req.body;

        if (!linkImage || !tourId) {
            return res.json(createResponse(400, "Link ảnh và tourId không được để trống.", "error"));
        } else {
            const tour = await imageController.insert(linkImage, tourId);

            if (tour) {
                return res.json(createResponse(200, "Thêm ảnh thành công.", "success", tour));

            } else {
                return res.json(createResponse(500, "Lỗi máy chủ khi thêm ảnh.", "error"));
            }
        }
    } catch (error) {
        console.log(error);
        res.json({ code: -1, message: "Lỗi sever" })
    }
})

router.post('/api/getByTourId', async function (req, res) {
    try {
        const { tourId } = req.body;

        if (tourId == "") {
            return res.json(createResponse(400, "tourId không được để trống.", "error"));
        } else {
            const tour = await imageController.getById(tourId)
            if (tour) {
                return res.json(createResponse(200, "Lấy danh sách ảnh thành công.", "success", tour));
            } else {
                return res.json(createResponse(404, "Không có dữ liệu ảnh cho tourId này.", "error"));
            }
        }
    } catch (error) {
        console.log(error);
        return res.json(createResponse(500, "Lỗi máy chủ khi lấy danh sách ảnh.", "error"));
    }
})

module.exports = router;