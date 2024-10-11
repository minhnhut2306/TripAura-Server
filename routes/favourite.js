var express = require('express');
var router = express.Router();

const favouriteController = require('../src/controller/FavouriteController');
const { createResponse } = require('../src/helper/createResponse.helper');

/**
 * @swagger
 * /favourite/api/add:
 *   post:
 *     summary: Thêm tour vào danh sách yêu thích
 *     description: Thêm tour vào danh sách yêu thích của người dùng
 *     tags: [Favourite]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "60c72b2f9b1d4e7f5c9f6f8b"
 *               tourId:
 *                 type: string
 *                 example: "60c72b2f9b1d4e7f5c9f6f8c"
 *     responses:
 *       200:
 *         description: Thêm vào mục yêu thích thành công
 *       500:
 *         description: Lỗi máy chủ
 */

/**
 * @swagger
 * /favourite/api/favourite:
 *   post:
 *     summary: Thêm hoặc xóa tour khỏi danh sách yêu thích
 *     description: Thêm tour vào danh sách yêu thích nếu chưa có, ngược lại xóa khỏi danh sách
 *     tags: [Favourite]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "60c72b2f9b1d4e7f5c9f6f8b"
 *               tourId:
 *                 type: string
 *                 example: "60c72b2f9b1d4e7f5c9f6f8c"
 *     responses:
 *       200:
 *         description: Thêm hoặc xóa thành công
 *       400:
 *         description: Lỗi yêu thích
 */
/**
 * @swagger
 * /favourite/api/deleteFavourite:
 *   post:
 *     summary: Xóa tour khỏi danh sách yêu thích
 *     description: Xóa tour khỏi danh sách yêu thích của người dùng
 *     tags: [Favourite]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tourId:
 *                 type: string
 *                 example: "60c72b2f9b1d4e7f5c9f6f8c"
 *     responses:
 *       200:
 *         description: Xóa thành công
 *       404:
 *         description: Không tìm thấy yêu thích để xóa
 */
/**
 * @swagger
 * /favourite/api/getFavouriteByUser:
 *   post:
 *     summary: Lấy danh sách yêu thích của người dùng
 *     description: Lấy danh sách tour yêu thích theo User ID
 *     tags: [Favourite]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "60c72b2f9b1d4e7f5c9f6f8b"
 *     responses:
 *       200:
 *         description: Lấy danh sách yêu thích thành công
 *       400:
 *         description: Không đủ dữ liệu
 *       500:
 *         description: Lỗi máy chủ
 */
router.post('/api/add', async function (req, res, next) {
    const { userId, tourId } = req.body
    try {
        const data = await favouriteController.insert({ userId: userId, tourId: tourId })
        if (data) {
            return res.json(createResponse(200, "Thêm vào mục yêu thích thành công", "success", data));
        } else {
            return res.json(createResponse(500, "Thêm vào mục yêu thích thất bại", "error"));
        }
    } catch (error) {
        console.log(error);
        return res.json(createResponse(500, "Lỗi máy chủ khi thêm vào mục yêu thích.", "error"));
    }
});


router.post('/api/favourite', async function (req, res) {
    const { userId, tourId } = req.body
    try {
        if (!userId || !tourId) {
            return res.json(createResponse(400, "Không đủ dữ liệu.", "false"));
        }
        const data = await favouriteController.favourite(userId, tourId)
        if (data == 1) {
            return res.json(createResponse(200, "Thêm thành công", "success"));
        } else if (data == 0) {
            return res.json(createResponse(200, "xóa thành công", "success"));
        }
        return res.json(createResponse(400, "Lỗi favourite", "false"));
    } catch (error) {
        console.log("===== Lỗi get Favourite =====", error);
        return res.json(createResponse(500, "Lỗi máy chủ khi lấy danh sách yêu thích.", "error"));
    }
})

router.post('/api/deleteFavourite', async function (req, res) {
    const { tourId, userId } = req.body
    try {
        const data = await favouriteController.remove({ tourId: tourId, userId: userId })
        if (data == 0) {
            return res.json(createResponse(200, "Xóa yêu thích thành công", "success"));
        } else {
            return res.json(createResponse(404, "Lỗi xóa.", "error"));
        }
    } catch (error) {
        console.log("===== Lỗi get Favourite =====", error);
        return res.json(createResponse(500, "Lỗi máy chủ khi lấy danh sách yêu thích.", "error"));
    }
})

router.post('/api/getFavouriteByUser', async function (req, res) {
    const { userId } = req.body
    try {
        if (!userId) {
            return res.json(createResponse(400, "Không đủ dữ liệu.", "false"));
        }
        const data = await favouriteController.getByUser(userId)
        if (data) {
            return res.json(createResponse(200, "Lấy danh sách yêu thích thành công", "success", data));
        }
        return res.json(createResponse(400, "Lỗi favourite", "false"));
    } catch (error) {
        console.log("===== Lỗi get Favourite =====", error);
        return res.json(createResponse(500, "Lỗi máy chủ khi lấy danh sách yêu thích.", "error"));
    }
})

module.exports = router;