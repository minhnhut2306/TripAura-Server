const cancelOrder = require('./../modules/cancelOrder');

const addCancelOrder = async (name, bankname, accountnumber, bookingId, cancellationreason, email, phone) => {
    try {
        if (!name || !bankname || !accountnumber || !bookingId || !cancellationreason || !email || !phone) {
            throw new Error('Missing required fields');
        }
        const createAt = new Date();
        console.log("====== day", createAt);
        const newCancelOrder = new cancelOrder({
            name,
            bankname,
            accountnumber,
            bookingId,
            cancellationreason,
            email,
            phone,
            createAt,
        });

        await newCancelOrder.save();

        return newCancelOrder;
    } catch (error) {
        console.error('Error saving cancel order:', error.message);
        throw new Error('Failed to save cancel order');
    }
};

const getAll = async () => {
    try {
        const data = await cancelOrder.find().sort({ createAt: -1 });

        if (data.length > 0) {
            console.log("===== All cancel orders:", data);
            return data;
        } else {
            console.log("===== No cancel orders found");
            return null;
        }
    } catch (error) {
        console.error("Error fetching cancel orders:", error.message);
        return null;
    }
};

const updateStatus = async (CancelId, status) => {
    try {
        if (!CancelId || !status) {
            throw new Error('Booking ID và status không hợp lệ');
        }
        const cancelOrderToUpdate = await cancelOrder.findOne({ _id: CancelId });

        if (!cancelOrderToUpdate) {
            throw new Error('Không tìm thấy đơn hàng với Booking ID này');
        }
        cancelOrderToUpdate.status = status;
        await cancelOrderToUpdate.save();

        console.log('Cập nhật trạng thái thành công:', cancelOrderToUpdate);

        return cancelOrderToUpdate;
    } catch (error) {
        console.error('Lỗi khi cập nhật trạng thái đơn hàng:', error.message);
        throw new Error('Không thể cập nhật trạng thái đơn hàng');
    }
};


module.exports = { addCancelOrder, getAll, updateStatus };
