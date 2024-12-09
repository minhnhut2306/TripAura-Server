var express = require('express');
var router = express.Router();
const bookingController = require('../src/controller/BookingController')
var { createResponse } = require('./../src/helper/createResponse.helper');
const User = require('../src/modules/UserModle')
const Detail = require('../src/modules/DetailModule')
const Tour = require('../src/modules/TourModule')
const Image = require('../src/modules/ImageModle')


/**
 * @swagger
 * /booking/api/addToCart:
 *   post:
 *     summary: Thêm vào giỏ hàng
 *     description: Thêm sản phẩm vào giỏ hàng
 *     tags: [Booking]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               detailId:
 *                 type: string  
 *                 example: "60c72b2f9b1d4e7f5c9f6f8b" 
 *               userId:
 *                 type: string  
 *                 example: "60c72b2f9b1d4e7f5c9f6f8c" 
 *               voucherId:
 *                 type: string 
 *                 example: "60c72b2f9b1d4e7f5c9f6f8d"
 *               numAdult:
 *                 type: number 
 *                 example: 2 
 *               numChildren:
 *                 type: number 
 *                 example: 1 
 *               priceAdult:
 *                 type: number 
 *                 example: 200000 
 *               priceChildren:
 *                 type: number 
 *                 example: 100000 
 *               createAt:
 *                 type: number 
 *                 example: 1634579200 
 *               status:
 *                 type: number 
 *                 example: 1 
 *     responses:
 *       200:
 *         description: Thêm vào giỏ hàng thành công
 *       500:
 *         description: Lỗi máy chủ
 */
/**
 * @swagger
 * /booking/api/update/{id}:
 *   put:
 *     summary: Cập nhật trạng thái đặt chỗ
 *     description: Cập nhật trạng thái của một đơn đặt chỗ
 *     tags: [Booking]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của đơn đặt chỗ
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: number
 *                 example: 1
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       500:
 *         description: Lỗi máy chủ
 */
/**
 * @swagger
 * /booking/api/delete/{id}:
 *   delete:
 *     summary: Xóa đặt chỗ
 *     description: Xóa một đơn đặt chỗ khỏi hệ thống
 *     tags: [Booking]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của đơn đặt chỗ cần xóa
 *     responses:
 *       200:
 *         description: Xóa thành công
 *       500:
 *         description: Lỗi máy chủ
 */

router.post('/api/addToCart', async function (req, res) {
    try {
        const { detailId, userId, voucherId, numAdult, numChildren, priceAdult, priceChildren, status, totalPrice } = req.body
        const createAt = new Date()
        const data = await bookingController.insert(detailId, userId, voucherId, numAdult, numChildren, priceAdult, priceChildren, createAt, status, totalPrice)
        if (data) {
            return res.json(createResponse(200, "Add thành công", "success", data));
        } else {
            res.json(createResponse(500, "Add thất bại", "error"))
        }
    } catch (error) {
        return res.json(createResponse(500, "Đã xảy ra lỗi máy chủ", "error"));
    }
});

router.get('/api/getbookingId/:id', async (req, res) => {
    const { id } = req.params;

    const booking = await bookingController.bookingId(id);
    console.log('Booking:', booking);

    if (booking) {
        return res.json(createResponse(200, "Lấy danh sách thành công", "success", booking));
    } else {
        return res.json(createResponse(500, "Lấy danh sách thất bại", "error", booking));
    }
});


router.get('/api/bookinguser/:id', async (req, res) => {
    try {
        const bookings = await bookingController.allBookingsIduser(req.params.id);

        if (bookings.length === 0) {
            return res.json(createResponse(500, "Lấy danh sách thất bại", "error", bookings));
        }

        return res.json(createResponse(200, "Lấy danh sách thành công", "success", bookings));
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

router.get('/api/allBookings', async (req, res) => {
    const bookings = await bookingController.allBookings();
    if (bookings) {
        res.status(200).json(bookings);
    } else {
        res.status(500).json({ message: "Error retrieving bookings" });
    }
});

router.put('/api/update/:id', async (req, res) => {
    try {
        const { id } = req.params;
        let { status } = req.body;
        if (status === "success") {
            status = 0;
        }
        if (status === "cancel") {
            status = 2;
        }
        const data = await bookingController.update(id, status);
        if (data) {
            return res.json(createResponse(200, "Cập nhật thành công", "success", data));
        } else {
            return res.json(createResponse(500, "Cập nhật thất bại", "error"));
        }
    } catch (error) {
        console.log(error);
        return res.json(createResponse(500, "Đã xảy ra lỗi máy chủ", "error"));
    }
});


router.delete('/api/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const data = await bookingController.remove(id)
        if (data) {
            return res.json(createResponse(200, "Xóa thành công", "success", data));
        } else {
            res.json(createResponse(500, "Xóa thất bại", "error"))
        }
    } catch (error) {
        console.log(error);
        return res.json(createResponse(500, "Đã xảy ra lỗi máy chủ", "error"));
    }
})

router.get('/api/getBookingByYear', async (req, res) => {
    try {
        const { year } = req.query
        const bookings = await bookingController.getByYear(year)
        if (bookings) {
            return res.json(createResponse(200, "get thành công", "success", bookings));
        } else {
            return res.json(createResponse(400, "không có dữ liệu", "failed"));
        }
    } catch (error) {
        console.log(error);
        return res.json(createResponse(500, "Lỗi server", "error"));
    }
})

module.exports = router;