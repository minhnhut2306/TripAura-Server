var express = require('express');
var router = express.Router();

var detailController = require('../src/controller/DetailController');
const { createResponse } = require('../src/helper/createResponse.helper');


/**
 * @swagger
 * /detail/api/add:
 *   post:
 *     summary: Thêm chi tiết tour
 *     description: Thêm thông tin chi tiết cho tour
 *     tags: [Detail]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               startDay:
 *                 type: string
 *                 example: "2024-01-01"
 *               endDay:
 *                 type: string
 *                 example: "2024-01-05"
 *               maxTicket:
 *                 type: number
 *                 example: 50
 *               minTicket:
 *                 type: number
 *                 example: 10
 *               priceAdult:
 *                 type: number
 *                 example: 2000000
 *               priceChildren:
 *                 type: number
 *                 example: 1000000
 *               PromotionalPrice:
 *                 type: number
 *                 example: 1500000
 *               tourId:
 *                 type: string
 *                 example: "60c72b2f9b1d4e7f5c9f6f8b"
 *     responses:
 *       200:
 *         description: Thêm chi tiết tour thành công
 *       400:
 *         description: Thiếu dữ liệu
 *       500:
 *         description: Lỗi máy chủ
 */
/**
 * @swagger
 * /detail/api/getByTourId:
 *   post:
 *     summary: Lấy thông tin chi tiết tour theo Tour ID
 *     description: Lấy thông tin chi tiết dựa trên ID của tour
 *     tags: [Detail]
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
 *         description: Lấy thông tin thành công
 *       500:
 *         description: Lỗi khi lấy dữ liệu
 */
router.post('/api/add', async function (req, res) {
    try {
        const { startDay, endDay, maxTicket, minTicket, priceAdult, priceChildren, PromotionalPrice, tourId } = req.body;

        if (startDay == "" ||
            endDay == "" ||
            maxTicket == "" ||
            minTicket == "" ||
            priceAdult == "" ||
            priceChildren == "" ||
            PromotionalPrice == "" ||
            tourId == "") {
            res.json("chưa dduur dữ liệu ")
        } else {
            const tour = await detailController
                .insert(startDay, endDay, maxTicket, minTicket, priceAdult, priceChildren, PromotionalPrice, tourId)
            if (tour) {
                res.json(tour)
            } else {
                return res.json(createResponse(500, "Lỗi Add", "error"));
            }
        }
    } catch (error) {
        console.log(error);
    }
})

router.post('/api/getByTourId', async function (req, res) {
    try {
        const { tourId } = req.body;

        const detailTours = await detailController.getByTourId(tourId)
        if (detailTours) {
            res.json(detailTours)
        } else {
            return res.json(createResponse(500, "Không có dữ liệu", "error"));
        }

    } catch (error) {
        console.log(error);
    }
})



module.exports = router;