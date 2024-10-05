var express = require('express');
var router = express.Router();

var detailController = require('../src/controller/DetailController');
const { createResponse } = require('../src/helper/createResponse.helper');

router.post('/api/add', async function (req, res) {
    try {
        const { startDay, endDay, maxTicket, minTicket, priceAdult, priceChildren, PromotionalPrice, tourId } = req.body;

        if (startDay == "" ||
            endDay == "" ||
            maxTicket == "" ||
            maxTicket == "" ||
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