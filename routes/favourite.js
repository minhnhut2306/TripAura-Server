var express = require('express');
var router = express.Router();

const favouriteController = require('../src/controller/FavouriteController');
const { createResponse } = require('../src/helper/createResponse.helper');

router.post('/api/addFourite', async function (req, res, next) {
    const { userId, tourId } = req.body
    try {
        const data = await favouriteController.insert({ userId: userId, tourId: tourId })
        if (data) {
            res.json({ code: 1, message: "", })
            return res.json(createResponse(200, "Thêm vào mục yêu thích thành công", "success", data));
        } else {
            return res.json(createResponse(500, "Thêm vào mục yêu thích thất bại", "error"));
        }
    } catch (error) {
        console.log(error);
        return res.json(createResponse(500, "Lỗi máy chủ khi thêm vào mục yêu thích.", "error"));
    }
});
router.post('/api/getFavourite', async function (req, res) {
    const { userId } = req.body
    try {
        const data = await favouriteController.getAll(userId)
        if (data) {
            return res.json(createResponse(200, "Lấy danh sách yêu thích thành công", "success", data));
        } else {
            return res.json(createResponse(404, "Không có mục yêu thích nào.", "error"));
        }
    } catch (error) {
        console.log("===== Lỗi get Favourite =====", error);
        return res.json(createResponse(500, "Lỗi máy chủ khi lấy danh sách yêu thích.", "error"));
    }
})

module.exports = router;