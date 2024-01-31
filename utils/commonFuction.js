
const UserRole = {
    ADMIN: 'admin',
    USER: 'user'
};

const LoginTypeEnum = {
    EMAIL: 'email',
    PHONE: 'phone'
};

const sliderNames = {
    slider1: 'SIZE UP YOUR ROOM',
    slider2: 'DISCOVER CLIMATE SOLUTIONS FOR YOUR BUSINESS',
    slider3: 'EXCLUSIVE PRODUCT',
};


function randomFourDigitCode() {
    return Math.floor(1000 + Math.random() * 9000);
}

const calculateTotalPrice = (price, quantity) => {
    return price * quantity;
  };
  

module.exports = {UserRole,LoginTypeEnum,sliderNames,randomFourDigitCode,calculateTotalPrice,constants: {
    OTP_EXPIRATION_SECONDS: 60,
}}