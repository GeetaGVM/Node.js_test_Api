const bcrypt = require('bcrypt');
const db = require('../dbconfig/db');
const { generateToken } = require('../middleware/auth');
const User = require('../dbconfig/user');
const messages = require('../utils/message');
const {sendEmailOTP} = require('../utils/email');
const commonFunctions = require('../utils/commonFuction')


// register user 
async function registerUser(req, res, next) {
  let { Name, Email,Country_code,Phone,Password, Login_type,Role } = req.body;

  try {
    const existingUser = await findExistingUser(Login_type, Email, Phone);
    if (existingUser) {
      return res.status(409).json({ message: messages.error.USER_ALREADY_REGISTERED });
    }

    var hashedPassword = "";
    if (Login_type === commonFunctions.LoginTypeEnum.EMAIL) {
      hashedPassword = await bcrypt.hash(Password, 10);
    }

    // Generate OTP
    const otp = commonFunctions.randomFourDigitCode();

    const newUser = {
      Name,
      Email,
      Country_code,
      Phone,
      Password: hashedPassword,
      Login_type,
      Otp: otp,
      Role
    };

    const user = await User.create(newUser);

    var AccessToken = "";
    if (Login_type === commonFunctions.LoginTypeEnum.EMAIL) {
      await sendEmailOTP(Email, otp,Name);

    } else if (Login_type === commonFunctions.LoginTypeEnum.PHONE) {
      var tempPhone = Country_code + Phone;
      await sendEmailOTP(Phone, `${otp}`,Name);
    }
  
    const tempAccessToken = generateToken({
      id: user.id 
    });
    AccessToken = tempAccessToken;
    user.AccessToken = tempAccessToken;
    await user.save();

    return res.status(200).json({ message: messages.success.USER_REGISTERED, AccessToken, user });
  } catch (error) {
    console.log(error);
    return next(error);
  }
}

async function findExistingUser(loginType, email, phone) {
  if (loginType === commonFunctions.LoginTypeEnum.EMAIL) {
    return await User.findOne({ where: { Email: email } });
  } else if (loginType === commonFunctions.LoginTypeEnum.PHONE) {
    return await User.findOne({ where: { Phone: phone } });
  }
  return null;
}


// login user with email and password
async function loginWithPassword(req, res, next) {
  let { Login_type, Email, Password } = req.body;
  try {
    let user;
    if (Login_type === commonFunctions.LoginTypeEnum.EMAIL) {
      
      user = await User.findOne({ where: { Email } });
      
    }

    if (!user) {
      return res.status(401).json({ message: messages.error.USER_NOT_FOUND_OR_REGISTER_FIRST });
    } 

    if (Login_type === commonFunctions.LoginTypeEnum.EMAIL) {
      const isPasswordMatch = await bcrypt.compare(Password, user.Password);
      if (!isPasswordMatch) {
        return res.status(401).json({ message: messages.error.INVALID_CREDENTIALS });
      }
    }

    const accessToken = generateToken({id: user.id });

    user.AccessToken = accessToken;
    await user.save();

    return res.status(200).json({ message: messages.success.LOGIN_SUCCESS, AccessToken: accessToken, User: user });

  } catch (error) {
    return next(error);
  }
}

async function requestLoginOTP(req, res, next) {
  try {
    const { Login_type, Phone } = req.body;

    let user;
    if (Login_type === commonFunctions.LoginTypeEnum.PHONE) {
      user = await User.findOne({ where: { Phone } });
    }

    if (!user) {
      return res.status(401).json({ message: messages.error.USER_NOT_FOUND });
    }

    const otp = commonFunctions.randomFourDigitCode();
    const expirationTime = new Date(Date.now() + commonFunctions.constants.OTP_EXPIRATION_SECONDS * 1000);

    if (Login_type === commonFunctions.LoginTypeEnum.PHONE) {
      await sendEmailOTP(Phone, `${otp}`);
    }

    user.Otp = otp;
    user.Is_otp_verified = false;
    user.Otp_expiration_time = expirationTime;
    await user.save();

    return res.status(200).json({ message:messages.success.OTP_SEND, ID: user.ID });
  } catch (error) {
    return next(error);
  }
}

async function loginWithOTP(req, res, next) {
  try {
    const { Login_type, Phone, OTP } = req.body;

    let user;
    if (Login_type === commonFunctions.LoginTypeEnum.PHONE) {
      user = await User.findOne({ where: { Phone } });
    }

    if (!user) {
      return res.status(401).json({ message: messages.error.USER_NOT_FOUND_OR_REGISTER_FIRST });
    }

    if (user.Otp !== OTP) {
      return res.status(400).json({ message: messages.error.OTP_MISMATCH });
    }

    if (new Date() > user.Otp_expiration_time) {
      return res.status(400).json({ message: messages.error.OTP_EXPIRED });
    }

    const accessToken = generateToken({id: user.id });
    user.Otp = "";
    user.Is_otp_verified = true;
    user.Otp_expiration_time = null;
    user.AccessToken = accessToken;
    await user.save();

    return res.status(200).json({ message: messages.success.LOGIN_SUCCESS, AccessToken: accessToken, User: user });
  } catch (error) {
    return next(error);
  }
}

// Resend OTP
async function resendOTP(req, res, next) {
  try {
    const { Login_type } = req.body;

    if (Login_type === commonFunctions.LoginTypeEnum.PHONE) {
      return await resendPhoneOTP(req, res);
    } else if (Login_type === commonFunctions.LoginTypeEnum.EMAIL) {
      return await resendEmailOTP(req, res);
    } else {
      return res.status(400).json({ message: messages.error.INVALID_REQUEST_TYPE });
    }
  } catch (error) {
    return next(error);
  }
}

async function resendPhoneOTP(req, res) {
  const { Phone } = req.body;
  const code = commonFunctions.randomFourDigitCode();
  const user = await User.findOne({ where: { Phone } });

  if (!user) {
    return res.status(400).json({ message: messages.error.USER_NOT_FOUND });
  }

  user.Otp = code;
  user.Is_verified = false;
  await user.save();

  await sendEmailOTP(Phone, `${code}`);

  return res.status(200).json({ message: messages.success.OTP_SEND, ID: user.ID });
}

async function resendEmailOTP(req, res) {
  const { Email } = req.body;
  const code = commonFunctions.randomFourDigitCode();
  const user = await User.findOne({ where: { Email } });

  if (!user) {
    return res.status(400).json({ message: messages.error.USER_NOT_FOUND });
  }

  user.Otp = code;
  user.Is_verified = false;
  await user.save();

  await sendEmailOTP(Email, code);

  return res.status(200).json({ message: messages.success.OTP_SEND, ID: user.ID });
}

// Verify sent OTP using User ID
async function verifyOTP(req, res, next) {
  const { ID, Otp } = req.body;

  try {
    // Check if user exists
    const user = await User.findByPk(ID);
    if (!user) {
      return res.status(404).json({ message: messages.error.USER_NOT_FOUND });
    }

    // Check if OTP is valid
    if (user.Otp !== Otp) {
      return res.status(400).json({ message: messages.error.OTP_MISMATCH });
    }

    // Update user record with consent given
    user.Is_verified = true;
    await user.save();

    return res.status(200).json({ message: messages.success.OTP_VERIFIED, user: user });
  } catch (error) {
    return next(error);
  }
}

// Verify forget password OTP
async function verifyForgotPasswordOTP(req, res, next) {
  try {
    const { Login_type, Phone, Email, Otp } = req.body;
    let user;
    if (Login_type == commonFunctions.LoginTypeEnum.PHONE) {

      user = await User.findOne({ where: { Phone } });
      if (!user) {
        return res.status(400).json({ message: messages.error.USER_NOT_FOUND });
      }

    } else if (Login_type == commonFunctions.LoginTypeEnum.EMAIL) {

      user = await User.findOne({ where: { Email } });
      if (!user) {
        return res.status(400).json({ message: messages.error.USER_NOT_FOUND });
      }
    }

    // Check if OTP is valid
    if (user.Otp !== Otp) {
      return res.status(400).json({ message: messages.error.OTP_MISMATCH });
    }

    // Generate access token
    const accessToken = generateToken({id: user.id });
    user.AccessToken = accessToken;
    // Update user record with consent given
    user.Is_verified = true;
    await user.save();

    return res.status(200).json({ message: messages.success.FORGOT_PASSWORD_OTP_VERIFIED, accessToken });
  } catch (error) {
    return next(error);
  }
}


// get all user with pagination
const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit, search = '' } = req.query;

    const offset = (page - 1) * (limit ? parseInt(limit, 10) : 0);

    const options = {
      attributes: { exclude: ['Created_at', 'Created_by','Updated_at','Updated_by'] },
      offset,
      limit: limit ? parseInt(limit, 10) : null,
    };

    if (search) {
      options.where = {
        [Op.or]: [
          { Name: { [Op.like]: `%${search}%` } },
          { Email: { [Op.like]: `%${search}%` } },
        ],
      };
    }

    const { count, rows: users } = await User.findAndCountAll(options);
    const totalPages = limit ? Math.ceil(count / parseInt(limit, 10)) : 1;
    const currentPage = parseInt(page, 10);

    return res.status(200).json({ users, totalPages, currentPage, totalRecords: count });
  } catch (error) {
    return next(error);
  }
}


async function forgotPassword(req, res, next) {
  try {

    const { NewPassword } = req.body;
    var hashedPassword = await bcrypt.hash(NewPassword, 10);
    // Remove user's access token from database
    const user = await User.findOne({ where: { ID: req.user.ID } });
    user.Password = hashedPassword;
    user.AccessToken = "";
    await user.save();

    return res.status(200).json({ message: messages.success.PASSWORD_CHANGED });
  } catch (error) {
    return next(error);
  }
}

// reset password
async function resetPassword(req, res, next) {
  try {
    const { OldPassword, NewPassword } = req.body;

    // Remove user's access token from database
    const user = await User.findOne({ where: { ID: req.user.ID } });
    if (!user) {
      return res.status(400).json({ message: messages.error.USER_NOT_FOUND });
    }

    var isMatch = await bcrypt.compare(OldPassword, user.Password);
    if (!isMatch) {
      return res.status(400).json({ message: messages.error.INVALID_OLD_PASSWORD });
    }

    var hashedPassword = await bcrypt.hash(NewPassword, 10);
    user.Password = hashedPassword;
    user.AccessToken = "";
    await user.save();

    return res.status(200).json({ message: messages.success.PASSWORD_CHANGED });
  } catch (error) {
    return next(error);
  }
}


// logout 
async function logout(req, res, next) {
    try {
      const user = await User.findOne({ where: { ID: req.user.ID } });
      user.AccessToken = "";
      await user.save();
      return res.status(200).json({ message: messages.success.LOGGED_OUT });
    } catch (error) {
      return next(error);
    }
  }

  

module.exports = { registerUser, loginWithPassword ,requestLoginOTP,loginWithOTP,resendOTP,verifyForgotPasswordOTP,
  verifyOTP,getAllUsers,forgotPassword,resetPassword,logout};
