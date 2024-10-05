const config = require('./../../config');
const nodemailer = require('nodemailer');

// Cấu hình transporter cho nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: config.email_user,
        pass: config.email_pass,
    },
});

// Hàm gửi email
const sendEmail = async (to, subject, text) => {
    const mailOptions = {
        from: 'lekimtuyen065@gmail.com',
        to,
        subject,
        text,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email đã được gửi tới ${to}`);
    } catch (error) {
        console.error('Lỗi khi gửi email:', error.message);
        throw new Error('Không thể gửi email. Vui lòng thử lại.');
    }
};

module.exports = { sendEmail };
