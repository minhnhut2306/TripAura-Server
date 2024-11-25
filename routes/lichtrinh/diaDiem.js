var express = require('express');
var router = express.Router();
var DiaDiemController = require('../../src/controller/DiaDiemController');
var { createResponse } = require('../../src/helper/createResponse.helper');


router.post('/api/add', async (req, res) => {
    try {
        const { name, images, time, price, TinhId } = req.body
        const diaDiem = await DiaDiemController.insert(name, images, time, price, TinhId)
        if (diaDiem) {
            return res.json(createResponse(200, "Add thành công", "success", diaDiem));
        } else {
            return res.json(createResponse(400, "Add thất bại", "failed"));
        }
    } catch (error) {
        console.log("===== lỗi add Đia điểm", error);

        return res.json(createResponse(500, "Lỗi server", "error"));
    }
})

module.exports = router;