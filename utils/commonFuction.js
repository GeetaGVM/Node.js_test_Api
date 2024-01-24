
const UserRole = {
    ADMIN: 'admin',
    USER: 'user'
};

const LoginTypeEnum = {
    EMAIL: 'email',
    PHONE: 'phone'
};


function randomFourDigitCode() {
    return Math.floor(1000 + Math.random() * 9000);
}

const calculateTotalPrice = (price, quantity) => {
    return price * quantity;
  };
  

module.exports = {UserRole,LoginTypeEnum,randomFourDigitCode,calculateTotalPrice,constants: {
    OTP_EXPIRATION_SECONDS: 60,
}}