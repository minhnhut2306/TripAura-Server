const mongoose = require('mongoose');
const otpModel = require('../modules/OTPModle');
const UserModel = require('../modules/UserModle');
const validator = require('../validations/authen.validation');
const bcrypt = require('bcryptjs');
const { createResponse } = require('../helper/createResponse.helper');
const moment = require('moment');
const { sendEmail } = require('./emailService');
const saltRounds = 10;

const validateRegisterInput = (email, phone, password) => {
    if (!password || (!email && !phone)) {
        return createResponse(401, "Vui lòng điền đầy đủ thông tin. Phải có password và một trong email hoặc số điện thoại.", false);
    }
    if (email && !validator.isEmail(email)) return createResponse(401, "Email không hợp lệ.", false);
    if (phone && !validator.isPhone(phone)) return createResponse(401, "Số điện thoại không hợp lệ.", false);
    if (!validator.isValidPassword(password)) return createResponse(401, "Mật khẩu phải ít nhất 8 ký tự, bao gồm chữ, số và ký tự đặc biệt.", false);
    return null;
}
const validateLoginInput = (email, phone, password) => {
    if (!password) {
        return createResponse(401, "Vui lòng nhập mật khẩu.", false);
    }
    if (!email && !phone) {
        return createResponse(401, "Vui lòng nhập email hoặc số điện thoại.", false);
    }
    return null;
};

const register = async (email, phone, password) => {
    console.log("====== service========", email, phone, password);

    try {
        const validationResponse = validateRegisterInput(email, phone, password);
        if (validationResponse) return validationResponse;

        const existing = await UserModel.findOne({ $or: [{ email }, { phone }] });
        if (existing) return createResponse(401, "Email hoặc số điện thoại đã tồn tại.", false);
        await createAccount(email, phone, password);
        return createResponse(200, "Đăng ký thành công.", "success", true);
    } catch (error) {
        console.error('Lỗi đăng ký:', error.message);
        return createResponse(500, "Đã xảy ra lỗi trong quá trình đăng ký. Vui lòng thử lại sau.", 'error', false);
    }
}

const update = async (fullname, email, phone, gender, nationality, dateofbirth, userId, address) => {
    try {
        if (email && !validator.isEmail(email)) return createResponse(401, "Email không hợp lệ.", false);
        if (phone && !validator.isPhone(phone)) return createResponse(401, "Số điện thoại không hợp lệ.", false);
        const user = await UserModel.findByIdAndUpdate(
            { _id: userId },
            {
                fullname: fullname,
                email: email,
                phone: phone,
                gender: gender,
                nationality: nationality,
                dateofbirth: dateofbirth,
                address: address
            },
            { new: true }
        )
        if (user) {
            return createResponse(200, "Cập  nhật thành công", true, user);
        } else {
            return createResponse(500, "Lỗi update user", false);
        }
    } catch (error) {
        console.error('Lỗi đăng ký:', error.message);
        return createResponse(500, "Đã xảy ra lỗi trong quá trình đăng ký. Vui lòng thử lại sau.", false);
    }
}

const getUserById = async (userId) => {
    try {
        const user = await UserModel.findById(userId)
        if (!user) {
            throw new Error('User not found');
        }
        console.log(`User retrieved successfully: ${userId}`);
        return user;
    } catch (error) {
        throw new Error(`Error retrieving user: ${error.message}`);
    }
};

const login = async (email, phone, password) => {
    try {
        const validationResponse = validateLoginInput(email, phone, password);
        if (validationResponse) return validationResponse;

        const user = await UserModel.findOne({ $or: [{ email }, { phone }] });
        if (!user) return createResponse(401, "Tên đăng nhập hoặc số điện thoại không tồn tại.", false);

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return createResponse(401, "Mật khẩu không đúng.", false);

        return createResponse(200, "Đăng nhập thành công.", true, user);
    } catch (error) {
        console.error('Lỗi đăng nhập:', error.message);
        return createResponse(500, "Đã xảy ra lỗi trong quá trình đăng nhập. Vui lòng thử lại sau.", false);
    }
}


const createAccount = async (email, phone, password) => {
    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const user = new UserModel({
            fullname: '',
            email: email || '',
            phone,
            password: hashedPassword,
            avatar: '',
            gender: '',
            address: "",
            dateofbirth: '',
            nationality: '',
            providerId: '',
            created_at: moment().format('YYYY-MM-DD')
        });

        await user.save();
        console.log('Đăng ký thành công!', user);
    } catch (error) {
        console.error('Đăng ký thất bại:', error.message);
        throw new Error(`Lỗi khi tạo tài khoản: ${error.message}`);
    }
}

//đổi mật khẩu
//tạo otp 4 chữ số
const generateOtp = () => Math.floor(1000 + Math.random() * 9000);

const forgotpasswordService = async (email) => {
    try {
        const existingOtp = await otpModel.findOne({ email, expiry: { $gte: moment().toDate() } });
        console.log('Existing OTP:', existingOtp);
        if (existingOtp) {
            const timeDifference = moment().diff(moment(existingOtp.createdAt), 'minutes');
            if (timeDifference < 1) {
                return createResponse(400, "Bạn phải đợi 1 phút trước khi gửi lại mã OTP.", false);
            }
            await sendEmail(email, 'TripAura', `Nhập mã OTP ${existingOtp.otp} để xác nhận đổi mật khẩu.`);
            return createResponse(200, "Mã OTP vẫn còn hiệu lực, đã gửi lại mã OTP tới email của bạn.", true);
        }
        // Nếu OTP không tồn tại hoặc đã hết hạn, tạo mã mới
        const otp = generateOtp();
        const expiry = moment().add(5, 'minutes').toDate();
        const newOtp = await otpModel.create({
            email,
            otp,
            expiry
        });
        console.log('New OTP Created:', newOtp);

        await sendEmail(email, 'TripAura', `Nhập mã OTP ${otp} để xác nhận đổi mật khẩu.`);
        return createResponse(200, "Mã OTP mới đã được gửi đến email của bạn. Vui lòng nhập mã OTP để đổi mật khẩu.", true);

    } catch (error) {
        console.error('Lỗi đặt lại mật khẩu:', error.message);
        return createResponse(500, "Đã xảy ra lỗi trong quá trình đặt lại mật khẩu. Vui lòng thử lại sau.", false);
    }
};



// xác nhận otp
const verifyOtpService = async (email, otp) => {
    try {
        console.log('Verifying OTP:', { email, otp });
        // Tìm OTP hợp lệ với email và kiểm tra thời gian hết hạn
        const otpDoc = await otpModel.findOne({
            email,
            otp,
            expiry: { $gte: moment().toDate() }
        });
        console.log('OTP Document:', otpDoc);
        if (!otpDoc) {
            return createResponse(401, "Mã OTP không hợp lệ hoặc đã hết hạn.", false);
        }
        // Xóa OTP đã sử dụng
        console.log('Deleting OTP:', otpDoc._id);
        await otpModel.deleteOne({ _id: otpDoc._id });
        return createResponse(200, "Mã OTP đã được xác nhận.", true);
    } catch (error) {
        console.error('Lỗi xác nhận mã OTP:', error.message);
        return createResponse(500, "Đã xảy ra lỗi trong quá trình xác nhận mã OTP. Vui lòng thử lại sau.", false);
    }
};


// đổi mật khẩu
const resetpasswordService = async (email, hashedPassword) => {
    try {
        const user = await UserModel.findOne({ email });
        if (!user) return createResponse(401, "Email không tồn tại.", false);

        await UserModel.updateOne({ email }, { password: hashedPassword });

        return createResponse(200, "Đổi mật khẩu thành công.", true);

    } catch (error) {
        console.error('Lỗi đổi mật khẩu:', error.message);
        return createResponse(500, "Đã xảy ra lỗi trong quá trình đổi mật khẩu. Vui lòng thử lại sau.", false);
    }
};

module.exports = { register, login, forgotpasswordService, verifyOtpService, resetpasswordService, update, getUserById };
