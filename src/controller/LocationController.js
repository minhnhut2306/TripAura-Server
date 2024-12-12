const _Location = require('../modules/LocationModule')

const insert = async (departure, destination,province, tourId) => {
    try {
        const data = new _Location({ departure, destination,province, tourId })
        await data.save()
        return data
    } catch (error) {
        console.log("Lỗi insert Location", error);
        return false;

    }
}
const update = async (locationId, departure, destination, tourId) => {
    try {
        const data = await _Location.findByIdAndUpdate(locationId,
            { departure, destination, tourId }, {
            new: true
        }
        )
        return data;
    } catch (error) {
        console.log("Lỗi update Location", error);
        return false;
    }

}

const remove = async (locationId) => {
    try {
        await _Location.deleteOne({ locationId });
        return 1;
    } catch (error) {
        console.log(error);
    }

}

module.exports = { insert ,update,remove}