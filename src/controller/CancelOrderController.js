const cancelOrder = require('./../modules/cancelOrder')

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
            createAt
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
        const data = await cancelOrder.find()
        console.log("===== data", data);

        if (data.length > 0) {
            return data

        } else {
            return false
        }

    } catch (error) {
        console.log(error);
        return false
    }
}

// getAll()     

module.exports = { addCancelOrder };
