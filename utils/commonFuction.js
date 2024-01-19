
const UserRole = {
    ADMIN: '0',
    USER: '1'
};

const LoginTypeEnum = {
    EMAIL: '0',
    PHONE: '1'
};

const OrderStatus = {
    PLACED: '0',
    PENDING: '1',
    DELIVERED: '2',
};

function randomFourDigitCode() {
    return Math.floor(1000 + Math.random() * 9000);
}

const calculateTotalPrice = (price, quantity) => {
    return price * quantity;
  };
  

module.exports = {UserRole,LoginTypeEnum,randomFourDigitCode,OrderStatus,calculateTotalPrice,constants: {
    OTP_EXPIRATION_SECONDS: 60,
}}