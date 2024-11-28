const _LichTrinh = require('../modules/LichTrinhModule');
const _DiaDiem = require('../modules/DiaDiemModule');

const insert = async (departure, destination, endDay, name, person, startDay) => {


    try {
        startDay = new Date(startDay);
        endDay = new Date(endDay);

        if (isNaN(startDay) || isNaN(endDay)) {
            throw new Error("Ngày bắt đầu hoặc ngày kết thúc không hợp lệ.");
        }

        const soNgayDi = (endDay - startDay) / (1000 * 60 * 60 * 24);
        if (soNgayDi < 0) {
            throw new Error("Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu.");
        }

        const locations = await _DiaDiem.find();
        const arrDesstination = locations.filter(item => item.TinhId == destination);
        console.log("================ location", arrDesstination);

        if (arrDesstination.length === 0) {
            throw new Error("Không tìm thấy địa điểm nào cho điểm đến được chỉ định.");
        }

        let diaDiemId = [];
        for (let i = 0; i <= soNgayDi; i++) {
            const soDiemDen = Math.max(1, Math.min(Math.floor(Math.random() * 10), arrDesstination.length));
            const shuffled = [...arrDesstination].sort(() => 0.5 - Math.random());
            const diaDiem = shuffled.slice(0, soDiemDen);
            const dailyLocation = diaDiem.map(item => item.TinhId);
            diaDiemId.push({
                day: i + 1,
                locations: dailyLocation
            });
        }

        const lichTrinh = new _LichTrinh({
            departure,
            destination,
            endDay,
            locations: diaDiemId,
            name,
            person,
            startDay
        });

        await lichTrinh.save();
        return lichTrinh;
    } catch (error) {
        console.error("=========== Lỗi insert lịch trình:", {
            message: error.message,
            stack: error.stack,
            input: { departure, destination, endDay, startDay, name, person }
        });
        return false;
    }
};

const getAll = async () => {
    try {
        const lichTrinhs = await _LichTrinh.find()
        if (lichTrinhs) {
            return lichTrinhs
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}

module.exports = { insert };
