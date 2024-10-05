const validator = require('validator');

module.exports = {
    isValidEmailorPhone: (input) => {
        return module.exports.isEmail(input) || validator.isMobilePhone(input, 'any');
    },
    isValidPassword: (input) => {
        if (input.length < 8) return false;
        const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
        return specialCharRegex.test(input);
    },
    isPhone: (phone) => {
        return validator.isMobilePhone(phone, 'any');
    },
    isEmail: (username) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(username);
    }
};
