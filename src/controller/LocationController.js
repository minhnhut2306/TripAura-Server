const _Location = require('../modules/LocationModule')

const insert = async (departure, destination, tourId) => {
    try {
        const data = new _Location({ departure, destination, tourId })
        await data.save()
        return data
    } catch (error) {
        console.log("Lỗi insert Location",error);
        return false;
        
    }
}

module.exports = {insert}