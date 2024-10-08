var express = require('express');
var router = express.Router();

var tourController = require('../src/controller/TourController');
const { createResponse } = require('../src/helper/createResponse.helper');

router.post('/api/searchTour', async function (req, res) {
    try {
        const { destination, minPrice, maxPrice, startDate } = req.body;

        const tour = await tourController.filter(destination, minPrice, maxPrice, startDate)
        if (tour && tour.length > 0) {
            return res.json(createResponse(200, "Lấy tour thành công", "success", tour)); 
        } else {
            return res.json(createResponse(404, "Không tìm thấy tour", "error")); 
        }

    } catch (error) {
        console.log(error);
        return res.json(createResponse(500, "Lỗi máy chủ", "error"))
    }
})


router.post('/api/add', async function (req, res) {
    try {
        const { tourName, description, category } = req.body;

        if (!tourName || !description || !category) {
            return res.json(createResponse(400, "Không được để trống", "error"));
        }
        const tour = await tourController.insert(tourName, description, category);
        if (tour) {
            return res.json(createResponse(200, "Thêm tour thành công", "success", tour));
        } else {
            return res.json(createResponse(500, "Lỗi khi thêm tour", "error")); 
        }
    } catch (error) {
        console.log(error);
        return res.json(createResponse(500, "Lỗi máy chủ", "error"));
    }
})

router.post('/api/getByCategory', async function (req, res) {
    try {
        const { categoryId } = req.body;

        const tour = await tourController.getToursByCategory(categoryId)
        if (tour && tour.length > 0) {
            return res.json(createResponse(200, "Lấy tour theo danh mục thành công", "success", tour)); 
        } else {
            return res.json(createResponse(404, "Không có dữ liệu", "error")); 
        }

    } catch (error) {
        console.log(error);
        return res.json(createResponse(500, "Lỗi máy chủ.", "error"));
    }
})

module.exports = router;