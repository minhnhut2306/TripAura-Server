
const mongoose = require('mongoose');
const config = require('../../config');

mongoose.connect(config.uri) 
  .then(() => console.log("Đã kết nối đến MongoDB tại!" ,config.uri))
  .catch((err) => console.log("Không thể kết nối đến server MongoDB. Lỗi:", err));
