
const UserRole = {
    ADMIN: '0',
    USER: '1'
};

const LoginTypeEnum = {
    EMAIL: '0',
    PHONE: '1'
};

function randomFourDigitCode() {
    return Math.floor(1000 + Math.random() * 9000);
}


module.exports = {UserRole,LoginTypeEnum,randomFourDigitCode,constants: {
    OTP_EXPIRATION_SECONDS: 60,
}}