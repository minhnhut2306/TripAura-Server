var express = require('express');
var router = express.Router();
const reviewController = require('../src/controller/ReviewController');
const { createResponse } = require('../src/helper/createResponse.helper');
const Booking = require('../src/modules/BookingModule');
const Detail = require('../src/modules/DetailModule');
const moment = require('moment');
const User = require('../src/modules/UserModle')
/**
 * @swagger
 * /review/api/addReview:
 *   post:
 *     summary: Thêm đánh giá cho tour
 *     description: Thêm một đánh giá mới cho tour với thông tin người dùng, điểm đánh giá, bình luận và ngày đánh giá.
 *     tags: [Review]
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
 *               rating:
 *                 type: number
 *                 example: 4
 *               comment:
 *                 type: string
 *                 example: "Tour rất tuyệt vời!"
 *               dayReview:
 *                 type: string
 *                 example: "2024-10-10"
 *     responses:
 *       200:
 *         description: Thêm review thành công
 *       400:
 *         description: Lỗi khi thêm review
 *       500:
 *         description: Lỗi máy chủ khi thêm review
 */

/**
 * @swagger
 * /review/api/getByUserId:
 *   post:
 *     summary: Lấy danh sách đánh giá của người dùng
 *     description: Lấy danh sách đánh giá theo User ID.
 *     tags: [Review]
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
 *         description: Lấy review thành công
 *       404:
 *         description: Không có review nào
 *       500:
 *         description: Lỗi máy chủ khi lấy review
 */

/**
 * @swagger
 * /review/api/getByTourId:
 *   post:
 *     summary: Lấy danh sách đánh giá cho tour
 *     description: Lấy danh sách đánh giá theo Tour ID.
 *     tags: [Review]
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
 *         description: Lấy review thành công
 *       404:
 *         description: Không có review nào
 *       500:
 *         description: Lỗi máy chủ khi lấy review
 */

/**
 * @swagger
 * /review/api/update/{id}:
 *   put:
 *     summary: Cập nhật đánh giá
 *     description: Cập nhật thông tin đánh giá cho một đánh giá cụ thể theo ID.
 *     tags: [Review]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của đánh giá cần cập nhật
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
 *               rating:
 *                 type: number
 *                 example: 5
 *               comment:
 *                 type: string
 *                 example: "Đánh giá đã được cập nhật!"
 *               image:
 *                 type: string
 *                 example: "https://example.com/image.jpg"
 *     responses:
 *       200:
 *         description: Cập nhật review thành công
 *       404:
 *         description: Không tìm thấy review
 *       500:
 *         description: Lỗi máy chủ khi cập nhật review
 */

/**
 * @swagger
 * /review/api/delete/{id}:
 *   delete:
 *     summary: Xóa đánh giá
 *     description: Xóa một đánh giá theo ID.
 *     tags: [Review]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của đánh giá cần xóa
 *         schema:
 *           type: string
 *           example: "60c72b2f9b1d4e7f5c9f6f8d"
 *     responses:
 *       200:
 *         description: Xóa review thành công
 *       404:
 *         description: Không tìm thấy review
 *       500:
 *         description: Lỗi máy chủ khi xóa review
 */

router.post('/api/addReview', async function (req, res) {
    try {
        const formatday = moment().toDate()
        const { userId, tourId, rating, comment, dayReview, image } = req.body;

        console.log("Request body: ", req.body);
        const booking = await Booking.findOne({ userId });

        console.log("Booking : ", booking);
        if (!booking) {
            return res.json(createResponse(400, "Bạn chưa có đặt tour này.", "error"));
        }

        console.log("User ID from request: ", userId);
        const user = await User.findOne({ _id: userId });

        console.log("User Id: ", user);

        const fullname = user.fullname;
        const avatar = user.avatar;
        console.log('avatar: ', avatar);
        console.log('fullname: ', fullname);


        const detail = await Detail.findOne({ tourId });
        if (!detail) {
            return res.json(createResponse(400, "K có thông tin tour này.", "error"));
        }

        const finalDayReview = dayReview || formatday;

        console.log("Day review: ", finalDayReview);


        const review = await reviewController.insert({ userId, tourId, rating, comment, dayReview: formatday, image, fullname, avatar });
        return res.json(createResponse(200, "Thêm review thành công.", "success", review));

    } catch (error) {
        console.log("===== Lỗi api addReview =====", error);
        return res.json(createResponse(500, "Lỗi máy chủ khi thêm review.", "error"));
    }
});

router.post('/api/add', async function (req, res) {
    try {
        const { userId, tourId, rating, comment, dayReview, image } = req.body;
        const formatday = dayReview ? moment(dayReview).toDate() : moment().toDate();

        const user = await User.findOne({ _id: userId });
        if (!user) {
            return res.json(createResponse(404, "Không tìm thấy người dùng.", "error"));
        }

        const fullname = user.fullname;
        const avatar = user.avatar;
        
        const review = await reviewController.insertmau({
            userId, tourId, rating, comment, dayReview: formatday, image, fullname, avatar
        });

        return res.json(createResponse(200, "Thêm review thành công.", "success", review));
    } catch (error) {
        console.log("===== Lỗi api addReview =====", error);
        return res.json(createResponse(500, "Lỗi máy chủ khi thêm review.", "error"));
    }
});


router.post('/api/getByUserId', async function (req, res) {
    try {
        const { userId } = req.body;
        const data = await reviewController.getByUserId({ userId });

        if (data && data.length > 0) {
            return res.json(createResponse(200, "Lấy review thành công.", "success", data));
        } else {
            return res.json(createResponse(404, "Không có review nào.", "error"));
        }
    } catch (error) {
        console.log("===== Lỗi api getByUserId Review =====", error);
        return res.json(createResponse(500, "Lỗi máy chủ khi lấy review.", "error"));
    }
});

router.post('/api/getByTourId', async function (req, res) {
    try {
        const { tourId } = req.body;
        const data = await reviewController.getByTourId({ tourId });

        if (data && data.length > 0) {
            return res.json(createResponse(200, "Lấy review thành công.", "success", data));
        } else {
            return res.json(createResponse(404, "Không có review nào.", "error"));
        }
    } catch (error) {
        console.log("===== Lỗi api getByTourId Review =====", error);
        return res.json(createResponse(500, "Lỗi máy chủ khi lấy review.", "error"));
    }
});
router.get('/getreviewbytouridandbyuserid', async (req, res) => {
    console.log('Route /getreviewbytouridandbyuserid called');
    try {
        const { userId, tourId } = req.query;
        console.log('get review by tour', tourId);  // This log should show in the console

        const filter = {};

        if (userId) filter.userId = userId;
        if (tourId) filter.tourId = tourId;

        const reviews = await reviewController.getReviewsByUseridandTourId(filter);

        if (reviews) {
            res.status(200).json({ success: true, data: reviews });
        } else {
            res.status(404).json({ success: false, message: "No reviews found" });
        }
    } catch (error) {
        console.error("Error in /getreviewbytouridandbyuserid route:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

router.put('/api/update/:id', async function (req, res) {
    try {
        const { id } = req.params;
        const { rating, comment, image } = req.body;
        const review = await reviewController.update({ id, rating, comment, image });
        if (review) {
            return res.json(createResponse(200, "Cập nhật review thành công.", "success", review));
        } else {
            return res.json(createResponse(404, "Không tìm thấy review.", "error"));
        }
    } catch (error) {
        console.log("===== Lỗi api update Review =====", error);
        return res.json(createResponse(500, "Lỗi máy chủ khi cập nhật review.", "error"));

    }

})
router.delete('/api/delete/:id', async function (req, res) {
    try {
        const { id } = req.params;
        const deletereview = await reviewController.remove({ id });
        if (deletereview) {
            return res.json(createResponse(200, "Xóa review thành công.", "success", deletereview));
        } else {
            return res.json(createResponse(404, "Không tìm thấy review.", "error"));
        }
    } catch (error) {
        console.log("===== Lỗi api delete Review =====", error);
        return res.json(createResponse(500, "Lỗi máy chủ khi xóa review.", "error"));
    }

})

module.exports = router;
