const mongoose = require("mongoose");
// const Schema = mongoose.Schema;
// const ObjectId = Schema.ObjectId;
// const TourModule = require('../modules/TourModule')

const TourModule = require("../modules/TourModule");
const ImageModule = require("../modules/ImageModle");

const filter = async (destination, minPrice, maxPrice, startDate) => {
  console.log(destination, minPrice, maxPrice, startDate);
  const a = Number(minPrice)
  const b = Number(maxPrice)
  try {
    // Tạo điều kiện động cho $match
    let matchConditions = {};

    if (destination) {
      // Biểu thức chính quy tìm kiếm địa chỉ với ít nhất một ký tự giống nhau
      const regexPattern = `.*${destination}.*`; // Tìm kiếm với ít nhất một ký tự giống
      matchConditions["locations.destination"] = {
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
    const tour = await TourModule.findByIdAndDelete({ _id: tourId })
    return tour
  } catch (error) {
    console.log("====lỗi deletetour", error);
    return false
  }
}

deleteTour("67297d740124911dd5ea90a0")

module.exports = {
  insert,
  getToursByCategory,
  filter,
  getToursAll,
  getPopularTour,
  findByName,
  deleteTour
};
