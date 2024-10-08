var express = require('express');
var router = express.Router();


var _Category = require('../modules/CategoryModule')

// Add Category
const insert = async (name, icon) => {
    try {
        const createAt = new Date();
        const category = await _Category.findOne({ name: name })
        if (category) {
            return false
        } else {
            const data = new _Category({ name: name, icon: icon, createAt: createAt });
            await data.save();
            return data;
        }
    } catch (error) {
        console.log(error)
        return false;
    }
}

// getAll Category
const getAll = async () => {
    try {
        const categories = await _Category.find();
        return categories;
    } catch (error) {
        console.log(error);
        return false;
    }
}

const getByDate = async (createAt) => {
    try {
        // Chuyển đổi ngày được truyền vào
        const startDate = new Date(createAt);
        // startDate.setHours(0, 0, 0, 0);  // Đảm bảo ngày bắt đầu từ 00:00:00

        // Tìm kiếm các danh mục có ngày tạo từ ngày chỉ định trở về sau
        const categories = await _Category.find({
            crateAt: {
                $gte: startDate  // Tìm các mục từ ngày 08-10-2024 trở đi
            }
        });

        console.log(categories, startDate);
        return categories;

    } catch (error) {
        console.log(error);
        return false;
    }
}
// getByDate('2024-10-09')


module.exports = { insert, getAll };