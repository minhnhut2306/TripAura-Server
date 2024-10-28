var express = require('express');
var router = express.Router();
const _Favourite = require('../modules/FavouriteModule')
const _Tour = require('../modules/TourModule')
const favouriteController = require('../src/controller/FavouriteController');
const detailController = require('../src/controller/detailController');
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
// router.post('/api/add', async function (req, res, next) {
//     const { userId, tourId } = req.body
//     try {
//         const data = await favouriteController.insert({ userId: userId, tourId: tourId })
//         if (data) {
//             return res.json(createResponse(200, "Thêm vào mục yêu thích thành công", "success", data));
//         } else {
//             return res.json(createResponse(500, "Thêm vào mục yêu thích thất bại", "error"));
//         }
//     } catch (error) {
//         console.log(error);
//         return res.json(createResponse(500, "Lỗi máy chủ khi thêm vào mục yêu thích.", "error"));
//     }
// });

router.post('/api/add', async function (req, res, next) {
    const { userId, tourId } = req.body;

    try {
        // Kiểm tra xem mục yêu thích đã tồn tại chưa
        const existingFavorite = await _Favourite.findOne({ userId, tourId });

        if (existingFavorite) {
            // Nếu đã có, tiến hành xóa
            await _Favourite.deleteOne({ userId, tourId });
             const detailTours = await detailController.getByTourId(tourId);
            return res.json(createResponse(200, "Đã xóa khỏi mục yêu thích", "success", { detailTours }));
        } else {
            // Nếu chưa có, tiến hành thêm
            const newFavorite = new _Favourite({ userId, tourId });
            await newFavorite.save();
             const detailTours = await detailController.getByTourId(tourId);
            return res.json(createResponse(200, "Thêm vào mục yêu thích thành công", "success", { tourId }));
        }
    } catch (error) {
        console.log(error);
        return res.json(createResponse(500, "Lỗi máy chủ khi thực hiện yêu cầu.", "error"));
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
        const data = await favouriteController.remove(tourId, userId)
        if (data == 1) {
            return res.json(createResponse(200, "Xóa yêu thích thành công", "success"));
        } else {
            return res.json(createResponse(404, "Lỗi xóa.", "error"));
        }
    } catch (error) {
        console.log("===== Lỗi get Favourite =====", error);
        return res.json(createResponse(500, "Lỗi máy chủ khi lấy danh sách yêu thích.", "error"));
    }
})

router.get('/api/getFavouriteByUser', async function (req, res) {
    try {
        const { userId } = req.query
        if (!userId) {
            return res.json(createResponse(401, "không có userId", "failed"));
        }
        const data = await favouriteController.getByUser(userId)
        if (!data) {
            return res.json(createResponse(200, "Không có dữ liệu", "failed"));
        }
        return res.json(createResponse(200, "Lấy danh sách favourite thành công", "success", data));
    } catch (error) {
        console.log(error);
        return res.json(createResponse(500, "Lỗi máy chủ.", "error"));
    }
})

router.get('/api/checkFavourite', async function (req, res) {
    try {
        const { userId, tourId } = req.query
        const data = await favouriteController.checkTour(userId, tourId)
        console.log("==================", data);
        if (data.length > 0) {

            return res.json(createResponse(200, "isFavorited ", "success", true));
        }
        return res.json(createResponse(400, "notFavorited ", "failed", false));
    } catch (error) {
        console.log(error);
        return res.json(createResponse(500, "Lỗi máy chủ.", "error"));
    }
})

module.exports = router;
