var express = require('express');
var router = express.Router();
const locationController = require('../src/controller/LocationController');
const { createResponse } = require('../src/helper/createResponse.helper');

router.post('/api/insertLocation', async function (req, res) {
    try {
        const { departure, destination, tourId } = req.body;
        if (departure == "" || destination == "" || tourId == "") {
            return res.json(createResponse(400, "Không được để trống.", "error"));
        } else {
            const data = await locationController.insert(departure, destination, tourId)
            if (data) {
                return res.json(createResponse(200, "Thêm địa điểm thành công.", "success", data));
            } else {
                return res.json(createResponse(500, "Lỗi khi thêm địa điểm.", "error"));
            }
        }
    } catch (error) {
        console.log("Lỗi insertLocation", error);
        return res.json(createResponse(500, "Lỗi máy chủ khi thêm địa điểm.", "error"));
    }
})

module.exports = router;