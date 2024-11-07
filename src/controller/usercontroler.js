const passport = require("passport");
const {
  register,
  login,
  forgotpasswordService,
  verifyOtpService,
  resetpasswordService,
  update,
  getUserById,
} = require("../service/userservice");
const { createResponse } = require("../helper/createResponse.helper");
const bcrypt = require("bcryptjs");
const UserModle = require("../modules/UserModle");

const saltRounds = 10;

// Controller đăng ký
exports.registerController = async (email, phone, password) => {
  try {
    const response = await register(email, phone, password);
    return response;
  } catch (error) {
    console.error("Lỗi trong registerController:", error.message);
    return createResponse(500, "Lỗi trong quá trình xử lý đăng ký.", false);
  }
};
exports.updateUserController = async (
  fullname,
  email,
  phone,
  gender,
  dateofbirth,
  userId,
  address,
  avatar
) => {
  try {
    if (!userId) {
      return createResponse(400, "userId là bắt buộc.", false);
    }
    const response = await update(
      fullname,
      email,
      phone,
      gender,
      dateofbirth,
      userId,
      address,
      avatar
    );


    if (!response.data) {
      return createResponse(404, "Người dùng không tìm thấy.", false);
    }
    console.log("Response from updateUserController:", response);
    return response;
  } catch (error) {
    console.error("Lỗi trong updateUserController:", error.message);
    return createResponse(500, "Lỗi trong quá trình xử lý cập nhật người dùng.", false);
  }
};



exports.getUserController = async (userId) => {
  try {
    const user = await getUserById(userId);
    return {
      success: true,
      data: user,
    };
  } catch (error) {
    console.error("Lỗi khi lấy người dùng:", error);
    return {
      success: false,
      message: error.message || "Đã xảy ra lỗi không mong muốn",
    };
  }
};
// Controller đăng nhập
exports.loginController = async (email, phone, password) => {
  try {
    const response = await login(email, phone, password);
    return response;
  } catch (error) {
    console.error("Lỗi trong loginController:", error.message);
    return createResponse(500, "Lỗi trong quá trình đăng nhập.", false);
  }
};

// Controller quên mật khẩu
exports.forgotPassword = async (email) => {
  try {
    const response = await forgotpasswordService(email);
    return response;
  } catch (error) {
    console.error("Lỗi trong forgotPassword:", error.message);
    return createResponse(500, "Lỗi trong quá trình gửi mã OTP.", false);
  }
};

// Controller xác thực OTP
exports.verifyOtp = async (email, otp) => {
  try {
    const response = await verifyOtpService(email, otp);
    return response;
  } catch (error) {
    console.error("Lỗi trong verifyOtp:", error.message);
    return createResponse(500, "Lỗi trong quá trình xác thực OTP.", false);
  }
};

// Controller đặt lại mật khẩu
exports.resetPassword = async (email, newPassword) => {
  try {
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    const response = await resetpasswordService(email, hashedPassword);
    return response;
  } catch (error) {
    console.error("Lỗi trong resetPassword:", error.message);
    return createResponse(500, "Lỗi trong quá trình đặt lại mật khẩu.", false);
  }
};

exports.loginGoogle = async (userRequest) => {
  try {
    const { uid } = userRequest;

    if (!uid) return null;

    let user = await UserModle.findOne({ providerId: uid })
    if (!user) {
      user = await createUser(userRequest);
    }

    return user;

  } catch (error) {
    console.log("Error during Google login:", error);
    return error;
  }
};

async function createUser(userRequest) {
  const {
    uid,
    email,
    displayName: fullname,
    photoURL: avatar
  } = userRequest;

  try {
    const user = await UserModle.create({
      providerId: uid,
      email,
      fullname,
      avatar
    });
    return user;

  } catch (err) {
    console.log("Error creating user:", err);
    return err;
  }
}


// 
exports.getAllUser = async () => {
  try {
    const users = await UserModle.find()
    if (users.length > 0) {
      console.log("==== User", users);
      return users
    } else {
      return false
    }
  } catch (error) {
    console.log("==== lỗi getAllUser", error);
    return false
  }
}




