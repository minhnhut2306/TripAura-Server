const express = require("express");
const router = express.Router();
const moment = require("moment");
const passport = require("passport");
const authController = require("../src/controller/usercontroler");

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Đăng ký tài khoản
 *     description: Đăng ký tài khoản người dùng mới
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               phone:
 *                 type: string
 *                 example: "0123456789"
 *               password:
 *                 type: string
 *                 example: "your_password"
 *     responses:
 *       200:
 *         description: Đăng ký thành công
 *       500:
 *         description: Lỗi máy chủ
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Đăng nhập
 *     description: Đăng nhập tài khoản người dùng
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               phone:
 *                 type: string
 *                 example: "0123456789"
 *               password:
 *                 type: string
 *                 example: "your_password"
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 *       500:
 *         description: Lỗi máy chủ
 */

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Quên mật khẩu
 *     description: Quên mật khẩu người dùng
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: Gửi email khôi phục thành công
 *       400:
 *         description: Email không được để trống
 *       500:
 *         description: Lỗi máy chủ
 */

/**
 * @swagger
 * /auth/verifyOtp:
 *   get:
 *     summary: Xác minh OTP
 *     description: Xác minh mã OTP gửi đến email
 *     tags: [User]
 *     parameters:
 *       - in: query
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *           example: user@example.com
 *       - in: query
 *         name: otp
 *         required: true
 *         schema:
 *           type: string
 *           example: "123456"
 *     responses:
 *       200:
 *         description: Xác minh thành công
 *       400:
 *         description: Cả email và OTP đều không được để trống
 *       500:
 *         description: Lỗi máy chủ
 */

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Đặt lại mật khẩu
 *     description: Đặt lại mật khẩu người dùng
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: "new_password"
 *     responses:
 *       200:
 *         description: Đặt lại mật khẩu thành công
 *       400:
 *         description: Email và mật khẩu đều không được để trống
 *       500:
 *         description: Lỗi máy chủ
 */

router.post("/register", async (req, res) => {
  try {
    console.log("Request Body:", req.body);
    const { email, phone, password } = req.body;

    const response = await authController.registerController(
      email,
      phone,
      password
    );
    res.status(response.code || 500).json({
      message: response.msg,
      status: response.status,
      data: response.data,
    });
  } catch (error) {
    console.error("Lỗi không mong muốn ở /register:", error.message);
    res.status(500).json({
      message: "Đã xảy ra lỗi không mong muốn. Vui lòng thử lại sau.",
      status: false,
      data: null,
    });
  }
});

router.post("/api/updateUser", async (req, res) => {
  try {
    console.log("Request Body:", req.body);
    const {
      fullname,
      email,
      phone,
      gender,
      nationality,
      dateofbirth,
      userId,
      address,
    } = req.body;
    const response = await authController.updateUserController(
      fullname,
      email,
      phone,
      gender,
      nationality,
      dateofbirth,
      userId,
      address
    );
    res.status(response.code || 500).json({
      message: response.msg,
      status: response.status,
      data: response.data,
    });
  } catch (error) {
    console.error("Lỗi không mong muốn ở /register:", error.message);
    res.status(500).json({
      message: "Đã xảy ra lỗi không mong muốn. Vui lòng thử lại sau.",
      status: false,
      data: null,
    });
  }
});
router.get("/user/:id", async (req, res) => {
  const { id } = req.params;

  const response = await authController.getUserController(id);
  if (response.success) {
    return res.status(200).json(response);
  } else {
    return res.status(404).json(response);
  }
});
// Đăng nhập
router.post("/login", async (req, res) => {
  try {
    const { email, phone, password } = req.body;
    const response = await authController.loginController(
      email,
      phone,
      password
    );

    res.status(response.code || 500).json({
      message: response.msg,
      status: response.status,
      data: response.data,
    });
  } catch (error) {
    console.error("Lỗi không mong muốn ở /login:", error.message);
    res.status(500).json({
      message: "Đã xảy ra lỗi không mong muốn. Vui lòng thử lại sau.",
      status: false,
      data: null,
    });
  }
});
// quên mật khẩu
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        message: "Email không được để trống.",
        status: false,
        data: null,
      });
    }
    const response = await authController.forgotPassword(email);
    res.status(response.code || 500).json({
      message: response.msg,
      status: response.status,
      data: response.data,
    });
  } catch (error) {
    console.error("Lỗi không mong muốn ở /forgot-password:", error.message);
    res.status(500).json({
      message: "Đã xảy ra lỗi không mong muốn. Vui lòng thử lại sau.",
      status: false,
      data: null,
    });
  }
});

router.get("/verifyOtp", async (req, res) => {
  try {
    const { email, otp } = req.query;
    if (!email || !otp) {
      return res.status(400).json({
        message: "Cả email và OTP đều không được để trống.",
        status: false,
        data: null,
      });
    }
    const response = await authController.verifyOtp(email, otp);
    res.status(response.code || 500).json({
      message: response.msg,
      status: response.status,
      data: response.data,
    });
  } catch (error) {
    console.error("Lỗi không mong muốn ở /verifyOtp:", error.message);
    res.status(500).json({
      message: "Đã xảy ra lỗi không mong muốn. Vui lòng thử lại sau.",
      status: false,
      data: null,
    });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "Email và mật khẩu đều không được để trống.",
        status: false,
        data: null,
      });
    }
    const response = await authController.resetPassword(email, password);
    res.status(response.code || 500).json({
      message: response.msg,
      status: response.status,
      data: response.data,
    });
  } catch (error) {
    console.error("Lỗi không mong muốn ở /reset-password:", error.message);
    res.status(500).json({
      message: "Đã xảy ra lỗi không mong muốn. Vui lòng thử lại sau.",
      status: false,
      data: null,
    });
  }
});

router.post("/login/google", async (req, res) => {
  try {
      const userRequest = req.body; 
      const user = await authController.loginGoogle(userRequest);
      console.log(user)

      if (!user || user instanceof Error) {
          return res.status(400).json({ message: 'Login failed' }); 
      }

      res.status(200).json({
          message: 'Login successful',
          user
      });
      
  } catch (error) {
      console.log("Error during Google login request:", error);
      res.status(500).json({ message: 'Server error during login' });
  }
});
// router.get('/google', passport.authenticate('google', { scope: ['profile'], session: false }));
// router.get('/google/callback', (req, res, next) => {
//     console.log('callback')
//     passport.authenticate('google', (err, profile) => {
//         if (err) {
//             console.log(err)
//         }
//         req.user = profile
//         next()
//     })(req, res, next)
// },
//     (req, res) => {
//         console.log('123')
//         res.json({ 'message': 'data' })
//     }
// );

module.exports = router;
