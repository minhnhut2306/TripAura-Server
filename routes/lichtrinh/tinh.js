var express = require('express');
var router = express.Router();
const TinhConttroller = require('../../src/controller/TinhController')
var { createResponse } = require('../../src/helper/createResponse.helper');

router.post('/api/add', async (req, res) => {
    try {
        const { name } = req.body
        const tinh = await TinhConttroller.insert(name)
        if (tinh) {
            return res.json(createResponse(200, "Add thành công", "success", tinh));
        } else {
            return res.json(createResponse(400, "Lỗi add", "failed"));
        }
    } catch (error) {
        console.log("===== lỗi add tinh", error);
        
        return res.json(createResponse(500, "lỗi server", "error"));
    }
})
module.exports = router;