const mongoose = require("mongoose");
// const Schema = mongoose.Schema;
// const ObjectId = Schema.ObjectId;
// const TourModule = require('../modules/TourModule')

const TourModule = require("../modules/TourModule");
const ImageModule = require("../modules/ImageModle");
const BookingModule = require("../modules/BookingModule")

const filter = async (tourName, destination, minPrice, maxPrice, startDate) => {
  console.log(destination, minPrice, maxPrice, startDate);
  const a = Number(minPrice)
  const b = Number(maxPrice)
  try {
    // Tạo điều kiện động cho $match
    let matchConditions = {};
    if (tourName) {
      // Biểu thức chính quy tìm kiếm tour với ít nhất một ký tự giống nhau
      const regexPattern = `.*${tourName}.*`; // Tìm kiếm với ít nhất một ký tự giống
      matchConditions["tourName"] = {
        $regex: new RegExp(regexPattern, "i"), // Tìm kiếm không phân biệt chữ hoa, thường
      };
    }

    if (destination) {
      // Biểu thức chính quy tìm kiếm địa chỉ với ít nhất một ký tự giống nhau
      const regexPattern = `.*${destination}.*`; // Tìm kiếm với ít nhất một ký tự giống
      matchConditions["locations.province"] = {
        $regex: new RegExp(regexPattern, "i"), // Tìm kiếm không phân biệt chữ hoa, thường
      };
    }

    if (minPrice != null || maxPrice != null) {
      matchConditions["details.priceAdult"] = {};
      if (minPrice != null) {
        matchConditions["details.priceAdult"].$gte = a;
      }
      if (b > a) {
        matchConditions["details.priceAdult"].$lte = b;
      }

    }

    if (startDate) {
      matchConditions["details.startDay"] = { $gte: new Date(startDate) }; // Tìm kiếm theo ngày khởi hành nếu có
    }

    const tours = await TourModule.aggregate([
      {
        $lookup: {
          from: "details", // Collection details
          localField: "_id",
          foreignField: "tourId",
          as: "details",
        },
      },
      {
        $lookup: {
          from: "locations", // Collection images
          localField: "_id",
          foreignField: "tourId",
          as: "locations",
        },
      },
      {
        $lookup: {
          from: "images", // Collection images
          localField: "_id",
          foreignField: "tourId",
          as: "images",
        },
      },
      {
        $unwind: "$details", // Đảm bảo mỗi tour chỉ có một chi tiết để dễ tìm kiếm
      },
      {
        $unwind: "$locations", // Đảm bảo mỗi tour chỉ có một chi tiết để dễ tìm kiếm
      },
      {
        $unwind: "$images", // Đảm bảo mỗi tour chỉ có một chi tiết để dễ tìm kiếm
      },
      {
        $match: matchConditions, // Áp dụng các điều kiện tìm kiếm linh hoạt
      },
      {
        $group: {
          _id: "$_id", // Nhóm theo ID tour
          tourName: { $first: "$tourName" },
          description: { $first: "$description" },
          status: { $first: "$status" },
          createAt: { $first: "$createAt" },
          locations: { $first: "$locations" },
          details: { $first: "$details" }, // Chỉ lấy một detail
          images: { $first: "$images" }, // Chỉ lấy một hình ảnh
        },
      },
      {
        $project: {
          _id: 1,
          tourName: 1,
          description: 1,
          status: 1,
          createAt: 1,
          locations: {
            departure: 1,
            destination: 1,
            province: 1
          },
          details: {
            priceAdult: 1,
            startDay: 1,
            maxTicket: 1,
            minTicket: 1,
            priceChildren: 1,
            PromotionalPrice: 1,
          },
          images: { _id: 1, linkImage: 1 },
        },
      },
    ]);

    if (!tours.length) {
      return { message: "No tours found" };
    }

    return tours;
  } catch (error) {
    console.error(error);
    return false;
  }
};

const findByName = async (name) => {
  try {
    // Tạo điều kiện tìm kiếm theo tên địa chỉ gần đúng
    let matchConditions = {};

    if (name) {
      // Biểu thức chính quy tìm kiếm địa chỉ với ít nhất một ký tự giống nhau
      const regexPattern = `.*${name}.*`; // Tìm kiếm với ít nhất một ký tự giống
      matchConditions.tourName = {
        $regex: new RegExp(regexPattern, "i"), // Tìm kiếm không phân biệt chữ hoa, thường
      };
    }

    // Tạo pipeline cho tìm kiếm
    const tours = await TourModule.aggregate([
      {
        $lookup: {
          from: "locations", // Collection locations
          localField: "_id",
          foreignField: "tourId",
          as: "locations",
        },
      },
      {
        $unwind: "$locations", // Đảm bảo mỗi tour chỉ có một địa điểm
      },
      {
        $match: matchConditions, // Áp dụng điều kiện tìm kiếm theo tên địa chỉ
      },
      {
        $lookup: {
          from: "images", // Collection images
          localField: "_id",
          foreignField: "tourId",
          as: "images",
        },
      },
      {
        $lookup: {
          from: "details", // Collection details
          localField: "_id",
          foreignField: "tourId",
          as: "details",
        },
      },
      {
        $unwind: "$details", // Đảm bảo mỗi tour chỉ có một chi tiết để dễ tìm kiếm
      },
      {
        $unwind: "$locations", // Đảm bảo mỗi tour chỉ có một chi tiết để dễ tìm kiếm
      },
      {
        $unwind: "$images", // Đảm bảo mỗi tour chỉ có một chi tiết để dễ tìm kiếm
      },
      {
        $group: {
          _id: "$_id", // Nhóm theo ID tour
          tourName: { $first: "$tourName" },
          description: { $first: "$description" },
          status: { $first: "$status" },
          createAt: { $first: "$createAt" },
          locations: { $first: "$locations" },
          details: { $first: "$details" }, // Chỉ lấy một detail
          images: { $first: "$images" }, // Chỉ lấy một hình ảnh
        },
      },
      {
        $project: {
          _id: 1,
          tourName: 1,
          description: 1,
          status: 1,
          createAt: 1,
          locations: {
            departure: 1,
            destination: 1,
            province: 1
          },
          details: {
            priceAdult: 1,
            startDay: 1,
            maxTicket: 1,
            minTicket: 1,
            priceChildren: 1,
            PromotionalPrice: 1,
          },
          images: { _id: 1, linkImage: 1 },
        },
      },
    ]);

    if (!tours.length) {
      return false;
    }
    // console.log(tours);

    return tours;
  } catch (error) {
    console.error("Lỗi khi tìm kiếm tour:", error);
    return false;
  }
}

// findByName("rừng")

const getToursByCategory = async (categoryId) => {
  try {
    const tours = await TourModule.aggregate([
      {
        $match: {
          category: new mongoose.Types.ObjectId(categoryId),
          status: "1",
        },
      },
      {
        $lookup: {
          from: "images",
          localField: "_id",
          foreignField: "tourId",
          as: "imageInfo",
        },
      },
      {
        $lookup: {
          from: "locations",
          localField: "_id",
          foreignField: "tourId",
          as: "locationInfo",
        },
      },
      {
        $lookup: {
          from: "details", // Tên collection Detail
          let: { tourId: "$_id" }, // Đặt tourId hiện tại trong Tour vào biến
          pipeline: [
            { $match: { $expr: { $eq: ["$tourId", "$$tourId"] } } }, // Lọc detail theo tourId
            { $limit: 1 }, // Chỉ lấy 1 detail
          ],
          as: "detailInfo", // Tên field chứa dữ liệu Detail sau khi nối
        },
      },
      {
        $unwind: "$category",
      },
      {
        $unwind: { path: "$detailInfo", preserveNullAndEmptyArrays: true }, // Mở gói detailInfo, nếu không có vẫn trả về null
      },
      {
        $unwind: { path: "$imageInfo", preserveNullAndEmptyArrays: true }, // Mở gói imageInfo, nếu không có vẫn trả về null
      },
      {
        $unwind: { path: "$locationInfo", preserveNullAndEmptyArrays: true }, // Mở gói locationInfo, nếu không có vẫn trả về null
      },
      {
        $project: {
          _id: 1, // Đảm bảo `_id` được bao gồm trong kết quả
          tourName: 1,
          description: 1,
          status: 1,
          createAt: 1,
          locationInfo: {
            departure: 1,
            destination: 1,
          },
          imageInfo: { linkImage: 1 },
          detailInfo: {
            priceAdult: 1,
            PromotionalPrice: 1,
          },
        },
      },
    ]);

    if (!tours.length) {
      return false;
    }

    return tours;
  } catch (error) {
    console.error(error);
    return false;
  }
};


const getToursAll = async () => {
  try {

    const tours = await TourModule.aggregate([
      {
        $match: {
          status: "1",
        },
      },
      {
        $lookup: {
          from: "images",
          localField: "_id",
          foreignField: "tourId",
          as: "imageInfo",
        },
      },
      {
        $lookup: {
          from: "locations",
          localField: "_id",
          foreignField: "tourId",
          as: "locationInfo",
        },
      },
      {
        $lookup: {
          from: "details", // Tên collection Detail
          let: { tourId: "$_id" }, // Đặt tourId hiện tại trong Tour vào biến
          pipeline: [
            { $match: { $expr: { $eq: ["$tourId", "$$tourId"] } } }, // Lọc detail theo tourId
            { $limit: 1 }, // Chỉ lấy 1 detail
          ],
          as: "detailInfo", // Tên field chứa dữ liệu Detail sau khi nối
        },
      },
      {
        $unwind: "$category",
      },
      {
        $unwind: { path: "$detailInfo", preserveNullAndEmptyArrays: true }, // Mở gói detailInfo, nếu không có vẫn trả về null
      },
      {
        $unwind: { path: "$imageInfo", preserveNullAndEmptyArrays: true }, // Mở gói imageInfo, nếu không có vẫn trả về null
      },
      {
        $unwind: { path: "$locationInfo", preserveNullAndEmptyArrays: true }, // Mở gói detailInfo, nếu không có vẫn trả về null
      },
      {
        $project: {
          _id: 1, // Đảm bảo `_id` được bao gồm trong kết quả
          tourName: 1,
          description: 1,
          status: 1,
          createAt: 1,
          locationInfo: {
            departure: 1,
            destination: 1,
          },
          imageInfo: { linkImage: 1 },
          detailInfo: {
            priceAdult: 1,
            // startDay: 1,
            priceAdult: 1,
            PromotionalPrice: 1,
          },
        },
      },
    ]);

    if (!tours.length) {
      return false;
    }
    return tours;
  } catch (error) {
    console.error(error);
    return false;
  }
};

const getToursAllAdmin = async () => {
  try {
    const tours = await TourModule.aggregate([
      {
        $lookup: {
          from: "images",
          localField: "_id",
          foreignField: "tourId",
          as: "imageInfo",
        },
      },
      {
        $lookup: {
          from: "locations",
          localField: "_id",
          foreignField: "tourId",
          as: "locationInfo",
        },
      },
      {
        $lookup: {
          from: "details", // Tên collection Detail
          let: { tourId: "$_id" }, // Đặt tourId hiện tại trong Tour vào biến
          pipeline: [
            { $match: { $expr: { $eq: ["$tourId", "$$tourId"] } } }, // Lọc detail theo tourId
            { $limit: 1 }, // Chỉ lấy 1 detail
          ],
          as: "detailInfo", // Tên field chứa dữ liệu Detail sau khi nối
        },
      },
      {
        $unwind: "$category",
      },
      {
        $unwind: { path: "$detailInfo", preserveNullAndEmptyArrays: true }, // Mở gói detailInfo, nếu không có vẫn trả về null
      },
      {
        $unwind: { path: "$imageInfo", preserveNullAndEmptyArrays: true }, // Mở gói imageInfo, nếu không có vẫn trả về null
      },
      {
        $unwind: { path: "$locationInfo", preserveNullAndEmptyArrays: true }, // Mở gói detailInfo, nếu không có vẫn trả về null
      },
      {
        $project: {
          _id: 1, // Đảm bảo `_id` được bao gồm trong kết quả
          tourName: 1,
          description: 1,
          status: 1,
          createAt: 1,
          locationInfo: {
            departure: 1,
            destination: 1,
          },
          imageInfo: { linkImage: 1 },
          detailInfo: {
            priceAdult: 1,
            // startDay: 1,
            priceAdult: 1,
            PromotionalPrice: 1,
          },
        },
      },
    ]);

    if (!tours.length) {
      return false;
    }
    return tours;
  } catch (error) {
    console.error(error);
    return false;
  }
};

const insert = async (tourName, description, category) => {
  try {
    const createAt = new Date();
    const tour = new TourModule({
      tourName,
      description,
      status: 1,
      createAt,
      category,
    });
    await tour.save();
    return tour;
  } catch (error) {
    console.log(error);
  }
};

const getPopularTour = async (page = 1, limit = 10) => {
  try {
    const query = [
      { $sort: { popularity: -1 } },
      { $skip: (page - 1) * limit },
      {
        $lookup: {
          from: "images",
          localField: "_id",
          foreignField: "tourId",
          as: "images",
        },
      },
      {
        $lookup: {
          from: "locations",
          localField: "_id",
          foreignField: "tourId",
          as: "locations",
        },
      },
      {
        $lookup: {
          from: "details",
          localField: "_id",
          foreignField: "tourId",
          as: "details",
        },
      },
      {
        $project: {
          tourID: "$_id",
          tourName: 1,
          destination: { $arrayElemAt: ["$locations.destination", 0] },
          image: { $arrayElemAt: ["$images.linkImage", 0] },
        },
      },
    ];

    return await TourModule.aggregate(query);
  } catch (err) {
    console.error("Error getting popular tours with details:", err);
    throw err;
  }
};

const deleteTour = async (tourId) => {
  try {
    // Tìm tour dựa trên tourId
    const tour = await TourModule.findOne({ _id: tourId });

    if (!tour) {
      // Nếu không tìm thấy tour, trả về thông báo lỗi
      console.log("Tour không tồn tại");
      return false;
    }
    // Kiểm tra trạng thái của tour
    if (tour.status === "1") {
      console.log("Tour đang hoạt động, không thể xóa");
      return false;

    } else {
      const result = await tour.deleteOne();

      if (result.deletedCount > 0) {
        // Nếu xóa thành công, trả về true
        console.log("Xóa tour thành công");
        return true;
      } else {
        // Nếu không xóa được, trả về false
        console.log("Không thể xóa tour");
        return false;
      }
    }

    // Thực hiện xóa tour


  } catch (error) {
    // Xử lý lỗi nếu có
    console.log("Lỗi khi xóa tour:", error);
    return false;
  }
};

// deleteTour('675cfc25247496ef8ee15c5f')
const update = async (tourId, description, status) => {
  try {
    const tour = await TourModule.findOne({ _id: tourId });
    if (!tour) {
      console.log("Không tìm thấy tour");
      return false;
    }

    const sanitizedDescription = description.trim(); // Loại bỏ khoảng trắng thừa
    // console.log("Giá trị description cũ:", tour.description);
    // console.log("Giá trị description mới:", sanitizedDescription);

    // Kiểm tra nếu giá trị thực sự thay đổi
    if (tour.description === sanitizedDescription) {
      console.log("Giá trị description không thay đổi");
      return false; // Không cần cập nhật nếu không có sự thay đổi
    }

    if (tour.status === "1") {
      console.log("Tour đang bán, không thể cập nhật");
      return false;
    }

    const result = await tour.updateOne(
      { $set: { description: sanitizedDescription, status: status } }
    );

    console.log("Matched Count:", result.matchedCount);
    console.log("Modified Count:", result.modifiedCount);

    if (result.modifiedCount > 0) {
      console.log("Cập nhật thành công");
      const updatedTour = await TourModule.findOne({ _id: tourId });
      console.log("Giá trị description mới:", updatedTour.description);
      return updatedTour;
    } else {
      console.log("Không có thay đổi nào được thực hiện");
      return false;
    }
  } catch (error) {
    console.log("Lỗi khi cập nhật description:", error);
    return false;
  }
};

// update('675cfd24247496ef8ee15c61', 'a b b d');

const getByTourId = async (tourId) => {
  try {
    const tour = await TourModule.findOne({ _id: tourId })
    if (tour) {
      return tour
    } else {
      return false
    }
  } catch (error) {
    console.log(error);
    return false
  }
}

const findBookingsByTourId = async (tourId) => {
  try {
    const bookings = await BookingModule.aggregate([
      // Join với Detail
      {
        $lookup: {
          from: 'details',
          localField: 'detailId',
          foreignField: '_id',
          as: 'detailInfo'
        }
      },
      { $unwind: '$detailInfo' }, // Làm phẳng mảng detailInfo

      // Lọc theo tourId trong Detail
      {
        $match: {
          'detailInfo.tourId': new mongoose.Types.ObjectId(tourId)
        }
      },

      // Join với Tour nếu cần lấy thêm thông tin
      {
        $lookup: {
          from: 'tours',
          localField: 'detailInfo.tourId',
          foreignField: '_id',
          as: 'tourInfo'
        }
      },
      { $unwind: '$tourInfo' } // Làm phẳng tourInfo

    ]);

    console.log('Bookings with Tour ID:', tourId, bookings);
    return bookings;
  } catch (error) {
    console.error('Error finding bookings by tourId:', error);
    throw error;
  }
};
// findBookingsByTourId("6760f91d46e4546e9af3dcb3")

module.exports = {
  update,
  insert,
  getToursByCategory,
  filter,
  getToursAll,
  getPopularTour,
  findByName,
  deleteTour,
  getToursAllAdmin,
  getByTourId,
  findBookingsByTourId
};
