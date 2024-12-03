var express = require('express');
var router = express.Router();
var LichTrinhController = require('../../src/controller/LichTrinhController');
var { createResponse } = require('../../src/helper/createResponse.helper');

router.post('/api/add', async (req, res) => {
    try {
        const { departure, destination, endDay, name, person, startDay, userId } = req.body;
        const lichTrinh = await LichTrinhController.insert(departure, destination, endDay, name, person, startDay, userId)
        if (lichTrinh) {
            return res.json(createResponse(200, "Add thành công", "success", lichTrinh));
        } else {
            return res.json(createResponse(400, "Add thất bại", "failed"));
        }
    } catch (error) {
        return res.json(createResponse(500, "Lỗi server", "error"));

    }
})

router.get('/api/getAll', async (req, res) => {
    try {
        const lichTrinhs = await LichTrinhController.getAll()
        if (lichTrinhs) {
            return res.json(createResponse(200, "get thành công", "success", lichTrinhs));
        } else {
            return res.json(createResponse(400, "get thất bại", "failed"));
        }
    } catch (error) {
        console.log("====", error);
        return res.json(createResponse(500, "Lỗi server", "error"));
    }
})

router.get('/api/getByLichTrinhId', async (req, res) => {
    try {
        const { lichTrinhId } = req.query
        const lichTrinh = await LichTrinhController.getByLichTrinhId(lichTrinhId)
        if (lichTrinh) {
            return res.json(createResponse(200, "get thành công", "success", lichTrinh));
        } else {
            return res.json(createResponse(400, "get thất bại", "failed"));
        }
    } catch (error) {
        console.log("====", error);
        return res.json(createResponse(500, "Lỗi server", "error"));
    }
})

router.get('/api/getByUserId', async (req, res) => {
    try {
        const { userId } = req.query
        const lichtrinhs = await LichTrinhController.getByUserId(userId)
        if (lichtrinhs) {
            return res.json(createResponse(200, "get thành công", "success", lichtrinhs));
        } else {
            return res.json(createResponse(400, "get thất bại", "failed"));
        }
    } catch (error) {
        console.log("====", error);
        return res.json(createResponse(500, "Lỗi server", "error"));
    }
})

router.get('/api/getByDate', async (req, res) => {
    try {
        const { lichTrinhId, dayId } = req.query
        const lichTrinh = await LichTrinhController.getDayById(lichTrinhId, dayId)
        if (lichTrinh) {
            return res.json(createResponse(200, "get thành công", "success", lichTrinh));
        } else {
            return res.json(createResponse(400, "get thất bại", "failed"));
        }
    } catch (error) {
        console.log("====", error);
        return res.json(createResponse(500, "Lỗi server", "error"));
    }
})
router.put('/api/deleteDiaDiem', async (req, res) => {
    try {
        const { lichTrinhId, dayId, diaDiemId } = req.body
        if (lichTrinhId == '' || dayId == '' || diaDiemId == '') {
            return res.json(createResponse(400, "thiếu data", "error"));
        }
        const lichTrinh = await LichTrinhController.deleteDiaDiem(lichTrinhId, dayId, diaDiemId)
        if (lichTrinh) {
            return res.json(createResponse(200, "delete thành công", "success", lichTrinh));
        } else {
            return res.json(createResponse(400, "delete thất bại", "failed"));
        }
    } catch (error) {
        console.log("====", error);
        return res.json(createResponse(500, "Lỗi server", "error"));
    }
})

router.put('/api/addDiaDiem', async (req, res) => {
    try {
        const { lichTrinhId, dayId, diaDiemId } = req.body
        if (lichTrinhId == '' || dayId == '' || diaDiemId == '') {
            return res.json(createResponse(400, "thiếu data", "error"));
        }
        const lichTrinh = await LichTrinhController.insertDiaDiem(lichTrinhId, dayId, diaDiemId)
        if (lichTrinh) {
            return res.json(createResponse(200, "add thành công", "success", lichTrinh));
        } else {
            return res.json(createResponse(400, "add thất bại", "failed"));
        }
    } catch (error) {
        console.log("====", error);
        return res.json(createResponse(500, "Lỗi server", "error"));
    }
})

module.exports = router;