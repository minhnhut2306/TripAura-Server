var express = require('express');
var router = express.Router();

var tourController = require('../src/controller/TourController');
const { createResponse } = require('../src/helper/createResponse.helper');
const TourModule = require('../src/modules/TourModule');
/**
 * @swagger
 * /tour/api/searchTour:
 *   post:
 *     summary: Tìm kiếm tour theo tiêu chí
 *     description: Tìm kiếm danh sách tour dựa trên điểm đến, giá tối thiểu, giá tối đa và ngày bắt đầu
 *     tags: [Tour]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               destination:
 *                 type: string
 *                 example: "Hà Nội"
 *               minPrice:
 *                 type: number
 *                 example: 1000000
 *               maxPrice:
 *                 type: number
 *                 example: 5000000
 *               startDate:
 *                 type: string
 *                 format: date
 *                 example: "2024-10-15"
 *     responses:
 *       200:
 *         description: Lấy tour thành công
 *       404:
 *         description: Không tìm thấy tour
 *       500:
 *         description: Lỗi máy chủ
 */
/**
 * @swagger
 * /tour/api/add:
 *   post:
 *     summary: Thêm tour mới
 *     description: Thêm một tour mới với tên, mô tả và danh mục
 *     tags: [Tour]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tourName:
 *                 type: string
 *                 example: "Tour du lịch Hà Nội"
 *               description:
 *                 type: string
 *                 example: "Khám phá vẻ đẹp của Hà Nội với nhiều điểm đến hấp dẫn."
 *               category:
 *                 type: string
 *                 example: "60c72b2f9b1d4e7f5c9f6f8d"
 *     responses:
 *       200:
 *         description: Thêm tour thành công
 *       400:
 *         description: Không được để trống
 *       500:
 *         description: Lỗi khi thêm tour
 */
/**
 * @swagger
 * /tour/api/getByCategory:
 *   post:
 *     summary: Lấy danh sách tour theo danh mục
 *     description: Lấy danh sách tour dựa trên ID danh mục
 *     tags: [Tour]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               categoryId:
 *                 type: string
 *                 example: "60c72b2f9b1d4e7f5c9f6f8d"
 *     responses:
 *       200:
 *         description: Lấy tour theo danh mục thành công
 *       404:
 *         description: Không có dữ liệu
 *       500:
 *         description: Lỗi máy chủ
 */
/**
 * @swagger
 * /tour/api/getAll:
 *   post:
 *     summary: Lấy danh sách 
 *     description: Lấy danh sách 
 *     tags: [Tour]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *     responses:
 *       200:
 *         description: Lấy tour theo danh mục thành công
 *       404:
 *         description: Không có dữ liệu
 *       500:
 *         description: Lỗi máy chủ
 */
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

router.get('/api/getAll', async function (req, res) {
    try {
        const tours = await tourController.getToursAll()
        if (tours && tours.length > 0) {
            return res.json(createResponse(200, "Lấy tour theo danh mục thành công", "success", tours));
        } else {
            return res.json(createResponse(404, "Không có dữ liệu", "error"));
        }

    } catch (error) {
        console.log(error);
        return res.json(createResponse(500, "Lỗi máy chủ.", "error"));
    }
})

router.get('/popular-tours', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    try {
        const popularTours = await tourController.getPopularTour(page, limit);
        res.status(200).json(popularTours);
    } catch (error) {
        console.error('Error fetching popular tours:', error);
        res.status(500).json({ message: 'Failed to get popular tours.' });
    }
});


module.exports = router;
