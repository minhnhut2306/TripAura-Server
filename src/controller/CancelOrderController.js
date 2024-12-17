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



module.exports = { addCancelOrder, getAll };
