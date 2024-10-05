// File: helper/createResponse.helper.js
function createResponse(code, msg, status, data = {}) {
    if (typeof code !== 'number' || isNaN(code)) {
        code = 500; 
    }
    return { code, msg, status, data };
}

module.exports = { createResponse };
// 200: Thành công.
// 400: Lỗi do dữ liệu đầu vào không hợp lệ hoặc thiếu.
// 404: Tài nguyên không tìm thấy.
// 409: Xung đột với trạng thái hiện tại của tài nguyên.
// 500: Lỗi máy chủ không rõ nguyên nhân