const cancelOrder = require('./../modules/cancelOrder')

const addCancelOrder = async (name, bankname, accountnumber, bookingId, cancellationreason, email, phone) => {
    try {
        if (!name || !bankname || !accountnumber || !bookingId || !cancellationreason || !email || !phone) {
            throw new Error('Missing required fields');
        }


        const newCancelOrder = new cancelOrder({
            name,
            bankname,
            accountnumber,
            bookingId,
            cancellationreason,
            email,
            phone
        });


        await newCancelOrder.save();

        return newCancelOrder;
    } catch (error) {
        
        console.error('Error saving cancel order:', error.message);
        throw new Error('Failed to save cancel order');
    }
};

module.exports = { addCancelOrder };
