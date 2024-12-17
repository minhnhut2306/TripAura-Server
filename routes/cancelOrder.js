const express = require('express');
const router = express.Router();
const { addCancelOrder,getAll } = require('./../src/controller/CancelOrderController');

router.post('/add-cancel-order', async (req, res) => {
    const { name, bankname, accountnumber, bookingId ,cancellationreason,email,phone} = req.body;
    console.log('adding cancel order', name, bankname, accountnumber, bookingId, cancellationreason, email, phone);
    
    try {
        const newCancelOrder = await addCancelOrder(name, bankname, accountnumber, bookingId,cancellationreason,email,phone);
        console.log('Added canceled order', newCancelOrder);
        
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

router.get('/cancelOrder/getAll', async (req, res) => {
    try {
        const cancelOrderData = await getAll();
        
        if (cancelOrderData) {
            return res.status(200).json({
                success: true,
                data: cancelOrderData
            });
        } else {
            return res.status(404).json({
                success: false,
                message: 'No cancel orders found'
            });
        }
    } catch (error) {
        console.error('Error fetching latest cancel order:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Server error while fetching cancel order'
        });
    }
});

router.put('/cancelOrder/update/:CancelId', async (req, res) => {
    const { CancelId } = req.params; 
    const { status } = req.body;

    try {
        if (!status) {
            return res.status(400).json({ message: 'Trạng thái không được để trống' });
        }

        const updatedOrder = await updateStatus(CancelId, status);
        res.status(200).json({
            message: 'Cập nhật trạng thái thành công',
            data: updatedOrder
        });
    } catch (error) {
        console.error('Lỗi khi cập nhật trạng thái đơn hàng:', error.message);
        res.status(500).json({ message: 'Không thể cập nhật trạng thái đơn hàng', error: error.message });
    }
});


module.exports = router;
