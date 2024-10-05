const passport = require('passport');
const { register, login, forgotpasswordService, verifyOtpService, resetpasswordService } = require('../service/userservice');
const { createResponse } = require('../helper/createResponse.helper');
const bcrypt = require('bcrypt');
const saltRounds = 10; 

// Controller đăng ký
exports.registerController = async (email, phone, password) => {
    try {
        const response = await register(email, phone, password);
        return response;
    } catch (error) {
        console.error('Lỗi trong registerController:', error.message);
        return createResponse(500, 'Lỗi trong quá trình xử lý đăng ký.', false);
    }
};

// Controller đăng nhập
exports.loginController = async (email, phone, password) => {
    try {
        const response = await login(email, phone, password);
        return response;
    } catch (error) {
        console.error('Lỗi trong loginController:', error.message);
        return createResponse(500, 'Lỗi trong quá trình đăng nhập.', false);
    }
};

// Controller quên mật khẩu
exports.forgotPassword = async (email) => {
    try {
        const response = await forgotpasswordService(email);
        return response;
    } catch (error) {
        console.error('Lỗi trong forgotPassword:', error.message);
        return createResponse(500, 'Lỗi trong quá trình gửi mã OTP.', false);
    }
};

// Controller xác thực OTP
exports.verifyOtp = async (email, otp) => {
    try {
        const response = await verifyOtpService(email, otp);
        return response;
    } catch (error) {
        console.error('Lỗi trong verifyOtp:', error.message);
        return createResponse(500, 'Lỗi trong quá trình xác thực OTP.', false);
    }
};

// Controller đặt lại mật khẩu
exports.resetPassword = async (email, newPassword) => {
    try {
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
        const response = await resetpasswordService(email, hashedPassword);
        return response;
    } catch (error) {
        console.error('Lỗi trong resetPassword:', error.message);
        return createResponse(500, 'Lỗi trong quá trình đặt lại mật khẩu.', false);
    }
};
