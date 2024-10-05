const express = require('express');
const router = express.Router();
const moment = require('moment');
const authController = require('../src/controler/usercontroler');

// Đăng ký
router.post('/register', async (req, res) => {
    try {
        console.log('Request Body:', req.body);
        const {
            fullname, email, phone, password
        } = req.body;

        const response = await authController.registerController( email, phone, password);
        res.status(response.code || 500).json({
            message: response.msg,
            status: response.status,
            data: response.data
        });
    } catch (error) {
        console.error('Lỗi không mong muốn ở /register:', error.message);
        res.status(500).json({
            message: 'Đã xảy ra lỗi không mong muốn. Vui lòng thử lại sau.',
            status: false,
            data: null
        });
    }
});

// Đăng nhập
router.post('/login', async (req, res) => {
    try {
        const { email, phone, password } = req.body;
        const response = await authController.loginController(email, phone, password);

        res.status(response.code || 500).json({
            message: response.msg,
            status: response.status,
            data: response.data
        });
    } catch (error) {
        console.error('Lỗi không mong muốn ở /login:', error.message);
        res.status(500).json({
            message: 'Đã xảy ra lỗi không mong muốn. Vui lòng thử lại sau.',
            status: false,
            data: null
        });
    }

});
// quên mật khẩu

router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({
                message: 'Email không được để trống.',
                status: false,
                data: null
            });
        }
        const response = await authController.forgotPassword(email);
        res.status(response.code || 500).json({
            message: response.msg,
            status: response.status,
            data: response.data
        });
    } catch (error) {
        console.error('Lỗi không mong muốn ở /forgot-password:', error.message);
        res.status(500).json({
            message: 'Đã xảy ra lỗi không mong muốn. Vui lòng thử lại sau.',
            status: false,
            data: null
        });
    }
});

router.get('/verifyOtp', async (req, res) => {
    try {
        const { email, otp } = req.query;
        if (!email || !otp) {
            return res.status(400).json({
                message: 'Cả email và OTP đều không được để trống.',
                status: false,
                data: null
            });
        }

        const response = await authController.verifyOtp(email, otp);

        res.status(response.code || 500).json({
            message: response.msg,
            status: response.status,
            data: response.data
        });
    } catch (error) {
        console.error('Lỗi không mong muốn ở /verifyOtp:', error.message);
        res.status(500).json({
            message: 'Đã xảy ra lỗi không mong muốn. Vui lòng thử lại sau.',
            status: false,
            data: null
        });
    }

})

router.post('/reset-password', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                message: 'Email và mật khẩu đều không được để trống.',
                status: false,
                data: null
            });
        }

        const response = await authController.resetPassword(email, password);
        res.status(response.code || 500).json({
            message: response.msg,
            status: response.status,
            data: response.data
        });

    } catch (error) {
        console.error('Lỗi không mong muốn ở /reset-password:', error.message);
        res.status(500).json({
            message: 'Đã xảy ra lỗi không mong muốn. Vui lòng thử lại sau.',
            status: false,
            data: null
        });
    }
});


module.exports = router;
