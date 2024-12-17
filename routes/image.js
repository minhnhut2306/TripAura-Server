var express = require('express');
var router = express.Router();

var imageController = require('../src/controller/ImageController');
const { createResponse } = require('../src/helper/createResponse.helper');

/**
 * @swagger
 * /image/api/add:
 *   post:
 *     summary: Thêm ảnh mới cho tour
 *     description: Thêm một hoặc nhiều ảnh liên kết với tour theo tour ID
 *     tags: [Image]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               linkImage:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "https://example.com/image.jpg"
 *               tourId:
 *                 type: string
 *                 example: "60c72b2f9b1d4e7f5c9f6f8b"
 *     responses:
 *       200:
 *         description: Thêm ảnh thành công
 *       400:
 *         description: Link ảnh và tourId không được để trống
 *       500:
 *         description: Lỗi máy chủ khi thêm ảnh
 */

/**
 * @swagger
 * /image/api/getByTourId:
 *   post:
 *     summary: Lấy danh sách ảnh theo tour ID
 *     description: Lấy danh sách ảnh liên kết với tour theo tour ID
 *     tags: [Image]
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
 *         description: Lấy danh sách ảnh thành công
 *       400:
 *         description: tourId không được để trống
 *       404:
 *         description: Không có dữ liệu ảnh cho tourId này
 *       500:
 *         description: Lỗi máy chủ khi lấy danh sách ảnh
 */

/**
 * @swagger
 * /image/api/update/{id}:
 *   put:
 *     summary: Cập nhật thông tin ảnh
 *     description: Cập nhật thông tin của một ảnh liên kết với tour theo ID ảnh
 *     tags: [Image]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID của ảnh cần cập nhật
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
 *               linkImage:
 *                 type: string
 *                 example: "https://example.com/new-image.jpg"
 *               tourId:
 *                 type: string
 *                 example: "60c72b2f9b1d4e7f5c9f6f8b"
 *     responses:
 *       200:
 *         description: Cập nhật thông tin ảnh thành công
 *       400:
 *         description: Thông tin không hợp lệ hoặc thiếu
 *       500:
 *         description: Lỗi máy chủ khi cập nhật thông tin ảnh
 */

/**
 * @swagger
 * /image/api/delete/{id}:
 *   delete:
 *     summary: Xóa ảnh
 *     description: Xóa một ảnh liên kết với tour theo ID ảnh
 *     tags: [Image]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID của ảnh cần xóa
 *         schema:
 *           type: string
 *           example: "60c72b2f9b1d4e7f5c9f6f8d"
 *     responses:
 *       200:
 *         description: Xóa ảnh thành công
 *       404:
 *         description: Không tìm thấy ảnh để xóa
 *       500:
 *         description: Lỗi máy chủ khi xóa ảnh
 */

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
        return res.json(createResponse(500, "Lỗi máy chủ ", "error"));
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
});

router.put('/api/update/:id', async function (req, res) {
    try {
        const { id } = req.params;
        const { linkImage, tourId } = req.body;
        const data = await imageController.update(id, linkImage, tourId);
        if (data) {
            return res.json(createResponse(200, "Cập nhật thành công", "success"));
        } else {
            return res.json(createResponse(500, "Cập nhật thông tin thất bại", "error"));
        }
    } catch (error) {
        console.log(error);
        return res.json(createResponse(500, "Lỗi máy chủ khi cập nhật thông tin ảnh.", "error"));

    }
});

router.delete('/api/delete/:id', async function (req, res) {
    try {
        const { id } = req.params;
        const data = await imageController.delete(id);
        if (data) {
            return res.json(createResponse(200, "Xóa thành công", "success"));
        } else {
            return res.json(createResponse(500, "Xóa thông tin ảnh thất bại", "error"));
        }
    } catch (error) {
        console.log(error);
        return res.json(createResponse(500, "Lỗi máy chủ khi xóa thông tin ảnh.", "error"));
    }
})

router.post('/api/uploadImageCloudinary', async (req, res) => {
    
    try {
        const { image } = req.body
        const loadImage = await imageController.uploadFile(image)
        if (loadImage) {
            return res.json(createResponse(200, "Thêm thành công", "success", loadImage));
        } else {
            return res.json(createResponse(500, "Lỗi", "failed"));
        }
    } catch (error) {
        console.log(error);
        return res.json(createResponse(500, "Lỗi server", "error"));

    }
})

module.exports = router;