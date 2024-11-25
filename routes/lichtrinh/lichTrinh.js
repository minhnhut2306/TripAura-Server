var express = require('express');
var router = express.Router();
var LichTrinhController = require('../../src/controller/LichTrinhController');
var { createResponse } = require('../../src/helper/createResponse.helper');

router.post('/api/add', async (req, res) => {
    try {
        const { departure, destination, endDay, name, person, startDay } = req.body;
        const lichTrinh = await LichTrinhController.insert(departure, destination, endDay, name, person, startDay)
        if (lichTrinh) {
            return res.json(createResponse(200, "Add thành công", "success", lichTrinh));
        } else {
            return res.json(createResponse(400, "Add thất bại", "failed"));
        }
    } catch (error) {
        return res.json(createResponse(500, "Lỗi server", "error"));
    }
})

module.exports = router;