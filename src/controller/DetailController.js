const DetailModule = require('../modules/DetailModule')

const insert = async (startDay, endDay, maxTicket, minTicket, priceAdult, priceChildren, PromotionalPrice, tourId) => {
    try {
        const detailTour = new DetailModule({
            startDay, endDay, maxTicket, minTicket, priceAdult, priceChildren, PromotionalPrice, tourId
        });
        await detailTour.save();
        return detailTour;
    } catch (error) {
        console.log("loi insert", error);
    }
}

const getByTourId = async (tourId) => {
    try {
        const detailTours = DetailModule.find({tourId:tourId})

        if (detailTours) {
            return detailTours
        } else {
            console.log("loi getByTourId");
            return
        }
    } catch (error) {
        console.log("loigetByTourId", error);
        
    }
}

module.exports = { insert, getByTourId }