const _LichTrinh = require('../modules/LichTrinhModule');
const _DiaDiem = require('../modules/DiaDiemModule');

const insert = async (departure, destination, endDay, name, person, startDay, userId) => {
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

        // Lấy danh sách địa điểm theo TinhId
        const locations = await _DiaDiem.find({ TinhId: destination });
        if (locations.length === 0) {
            throw new Error("Không tìm thấy địa điểm nào cho điểm đến được chỉ định.");
        }

        // Giữ trạng thái những địa điểm đã được chọn
        const usedDiaDiemIds = new Set();
        let diaDiemId = [];

        for (let i = 0; i <= soNgayDi; i++) {
            // Lấy số lượng địa điểm cho mỗi ngày (1 đến tối đa số địa điểm còn lại)
            const soDiemDen = Math.max(1, Math.floor(Math.random() * locations.length) + 1);

            // Lọc những địa điểm chưa được chọn
            const availableLocations = locations.filter(item => !usedDiaDiemIds.has(item._id.toString()));

            // Kiểm tra nếu không còn địa điểm khả dụng
            if (availableLocations.length === 0) {
                break;
            }

            // Sắp xếp ngẫu nhiên và chọn số lượng địa điểm
            const shuffled = availableLocations.sort(() => Math.random() - 0.5);
            const diaDiem = shuffled.slice(0, soDiemDen);

            // Lấy _id của các địa điểm đã chọn
            const dailyLocation = diaDiem.map(item => {
                usedDiaDiemIds.add(item._id.toString()); // Đánh dấu địa điểm đã sử dụng
                return item._id;
            });

            diaDiemId.push({
                day: i + 1,
                locations: dailyLocation,
            });
        }

        // Tạo mới lịch trình
        const lichTrinh = new _LichTrinh({
            departure,
            destination,
            endDay,
            locations: diaDiemId,
            name,
            person,
            startDay,
            userId,
        });

        await lichTrinh.save();
        return lichTrinh;
    } catch (error) {
        console.error("=========== Lỗi insert lịch trình:", {
            message: error.message,
            stack: error.stack,
            input: { departure, destination, endDay, startDay, name, person },
        });
        return false;
    }
};



const getAll = async () => {
    try {
        const lichTrinhs = await _LichTrinh.find()
            .populate('departure', 'name') // Lấy thông tin điểm khởi hành (nếu là một reference)
            .populate('destination', 'name') // Lấy thông tin điểm đến
            .populate({
                path: 'locations.locations', // Populate các địa điểm
                model: 'DiaDiem',
                select: 'name images time price ', // Lấy các trường cần thiết
                populate: {
                    path: 'TinhId', // Populate thông tin tỉnh của địa điểm
                    model: 'Tinh',
                    select: 'name',
                },
            });

        if (lichTrinhs) {
            return lichTrinhs;
        } else {
            return false;
        }
    } catch (error) {
        console.error("Lỗi khi lấy dữ liệu lịch trình:", error.message);
        return false;
    }
};

const getByLichTrinhId = async (lichTrinhId) => {
    try {
        const lichTrinh = await _LichTrinh.findById({ _id: lichTrinhId })
            .populate('departure', 'name') // Lấy thông tin điểm khởi hành (nếu là một reference)
            .populate('destination', 'name') // Lấy thông tin điểm đến
            .populate({
                path: 'locations.locations', // Populate các địa điểm
                model: 'DiaDiem',
                select: 'name images time price ', // Lấy các trường cần thiết
                populate: {
                    path: 'TinhId', // Populate thông tin tỉnh của địa điểm
                    model: 'Tinh',
                    select: 'name',
                },
            });
        // console.log(lichTrinh);

        if (lichTrinh) {
            return lichTrinh
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}

const getByUserId = async (userId) => {
    try {
        const lichTrinhs = await _LichTrinh.find()
            .populate('departure', 'name') // Lấy thông tin điểm khởi hành (nếu là một reference)
            .populate('destination', 'name') // Lấy thông tin điểm đến
            .populate({
                path: 'locations.locations', // Populate các địa điểm
                model: 'DiaDiem',
                select: 'name images time price ', // Lấy các trường cần thiết
                populate: {
                    path: 'TinhId', // Populate thông tin tỉnh của địa điểm
                    model: 'Tinh',
                    select: 'name',
                },
            });

        const lt = lichTrinhs.filter((item) => {
            return item.userId == userId
        })

        console.log(lt);

        if (lichTrinhs) {
            return lichTrinhs;
        } else {
            return false;
        }
    } catch (error) {
        console.error("Lỗi khi lấy dữ liệu lịch trình:", error.message);
        return false;
    }
};

// getByUserId('671f7cfecc67a0a901ce3d95')

// getByLichTrinhId('6748418e55130b3c8725fa7c')

const getDayById = async (lichTrinhId, dayId) => {
    try {
        // Tìm lịch trình theo ID
        const lichTrinh = await _LichTrinh.findById(lichTrinhId)
            .populate('departure', 'name') // Lấy thông tin điểm khởi hành
            .populate('destination', 'name') // Lấy thông tin điểm đến
            .populate({
                path: 'locations.locations',
                model: 'DiaDiem',
                select: 'name images time price TinhId', // Các trường cần lấy
                populate: {
                    path: 'TinhId',
                    model: 'Tinh',
                    select: 'name'
                }
            });

        if (!lichTrinh) {
            throw new Error("Không tìm thấy lịch trình.");
        }

        // Tìm thông tin chi tiết của ngày dựa vào ID
        const dayInfo = lichTrinh.locations.find(loc => loc._id.toString() === dayId);

        if (!dayInfo) {
            throw new Error("Không tìm thấy thông tin ngày với ID được cung cấp.");
        }

        return {
            lichTrinhId: lichTrinh._id,
            name: lichTrinh.name,
            person: lichTrinh.person,
            startDay: lichTrinh.startDay,
            endDay: lichTrinh.endDay,
            departure: lichTrinh.departure,
            destination: lichTrinh.destination,
            dayInfo
        };
    } catch (error) {
        console.error("Lỗi khi lấy thông tin theo ngày:", error.message);
        return false;
    }
};

// getDayById()

module.exports = { insert, getAll, getByLichTrinhId, getDayById, getByUserId };
