const express = require('express');
const router = express.Router();
const { addCancelOrder } = require('./../src/controller/CancelOrderController');

router.post('/add-cancel-order', async (req, res) => {
    const { name, bankname, accountnumber, bookingId ,cancellationreason,email,phone} = req.body;
    try {
        const newCancelOrder = await addCancelOrder(name, bankname, accountnumber, bookingId,cancellationreason,email,phone);
        return res.status(201).json({
            message: 'Cancel order added successfully',
            cancelOrder: newCancelOrder
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
});



module.exports = router;
