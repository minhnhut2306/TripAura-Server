var express = require('express');
var router = express.Router();


var _Category = require('../modules/CategoryModule')

// Add Category
const insert = async (name, icon) => {
    try {
        const category = await _Category.findOne({ name: name })
        if (category) {
            return false
        } else {
            const data = new _Category({ name: name, icon: icon });
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

module.exports = { insert, getAll };