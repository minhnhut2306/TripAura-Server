var express = require('express');
var router = express.Router();

const favouriteController = require('../src/controller/FavouriteController');
const { createResponse } = require('../src/helper/createResponse.helper');

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
    const { tourId } = req.body
    try {
        const data = await favouriteController.remove(tourId)
        if (data) {
            return res.json(createResponse(200, "Xóa yêu thích thành công", "success", data));
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