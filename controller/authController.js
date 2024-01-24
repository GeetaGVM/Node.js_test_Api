const bcrypt = require('bcrypt');
const db = require('../dbconfig/db');
const { generateToken } = require('../middleware/auth');
const User = require('../dbconfig/User');
const messages = require('../utils/message');
const {sendEmailOTP} = require('../utils/email');
const commonFunctions = require('../utils/commonFuction')


// register user 
const registerUser = async (req, res, next) => {
  const { Name, Email, Country_code, Phone, Password, Login_type, Role } = req.body;

  try {
    const existingUser = await findExistingUser(Login_type, Email, Phone);
    if (existingUser) {
      return res.status(409).json({ message: messages.error.USER_ALREADY_REGISTERED });
    }

    let hashedPassword = "";
    if (Login_type === commonFunctions.LoginTypeEnum.EMAIL) {
      hashedPassword = await bcrypt.hash(Password, 10);
    }

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

    let AccessToken = "";
    if (Login_type === commonFunctions.LoginTypeEnum.EMAIL) {
      await sendEmailOTP(Email, otp, Name);
    } else if (Login_type === commonFunctions.LoginTypeEnum.PHONE) {
      const tempPhone = Country_code + Phone;
      await sendEmailOTP(Phone, `${otp}`, Name);
    }

    const tempAccessToken = generateToken({ id: user.id });
    AccessToken = tempAccessToken;
    user.AccessToken = tempAccessToken;
    await user.save();

    return res.status(200).json({ message: messages.success.USER_REGISTERED, AccessToken, user });
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

// Find existing user
const findExistingUser = async (loginType, email, phone) => {
  if (loginType === commonFunctions.LoginTypeEnum.EMAIL) {
    return User.findOne({ where: { Email: email } });
  } else if (loginType === commonFunctions.LoginTypeEnum.PHONE) {
    return User.findOne({ where: { Phone: phone } });
  }
  return null;
};



// login user with email and password
const loginWithPassword = async (req, res, next) => {
  const { Login_type, Email, Password } = req.body;

  try {
    let user = null;

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

    const accessToken = generateToken({ id: user.id });

    user.AccessToken = accessToken;
    await user.save();

    return res.status(200).json({
      message: messages.success.LOGIN_SUCCESS,
      AccessToken: accessToken,
      User: user
    });

  } catch (error) {
    return next(error);
  }
};

const requestLoginOTP = async (req, res, next) => {
  const { Login_type, Phone } = req.body;

  try {
    let user = null;

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

    return res.status(200).json({ message: messages.success.OTP_SEND, ID: user.ID });

  } catch (error) {
    return next(error);
  }
};



const loginWithOTP = async (req, res, next) => {
  try {
    const { Login_type, Phone, OTP } = req.body;

    let user = null;

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

    const accessToken = generateToken({ id: user.id });
    
    user.Otp = "";
    user.Is_otp_verified = true;
    user.Otp_expiration_time = null;
    user.AccessToken = accessToken;

    await user.save();

    return res.status(200).json({
      message: messages.success.LOGIN_SUCCESS,
      AccessToken: accessToken,
      User: user
    });

  } catch (error) {
    return next(error);
  }
};



// Resend OTP
const resendOTP = async (req, res, next) => {
  const { Login_type } = req.body;

  try {
    let result;

    if (Login_type === commonFunctions.LoginTypeEnum.PHONE) {
      result = await resendPhoneOTP(req, res);
    } else if (Login_type === commonFunctions.LoginTypeEnum.EMAIL) {
      result = await resendEmailOTP(req, res);
    } else {
      return res.status(400).json({ message: messages.error.INVALID_REQUEST_TYPE });
    }

    return result; 

  } catch (error) {
    return next(error);
  }
};


const resendPhoneOTP = async (req, res) => {
  const { Phone } = req.body;

  try {
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

  } catch (error) {
    return next(error);
  }
};



const resendEmailOTP = async (req, res) => {
  const { Email } = req.body;

  try {
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

  } catch (error) {
    // Handle any errors that occur during the execution of the function
    return res.status(500).json({ message: messages.error.INTERNAL_SERVER_ERROR });
  }
};



// Verify sent OTP using User ID
const verifyOTP = async (req, res, next) => {
  const { ID, Otp } = req.body;

  try {
    // Find user by ID
    const user = await User.findByPk(ID);

    if (!user) {
      return res.status(404).json({ message: messages.error.USER_NOT_FOUND });
    }

    // Verify OTP
    if (user.Otp !== Otp) {
      return res.status(400).json({ message: messages.error.OTP_MISMATCH });
    }

    // Update user's verification status
    user.Is_verified = true;
    await user.save();

    return res.status(200).json({ message: messages.success.OTP_VERIFIED, user: user });

  } catch (error) {
    return next(error);
  }
};


// Verify forget password OTP
const verifyForgotPasswordOTP = async (req, res, next) => {
  try {
    const { Login_type, Phone, Email, Otp } = req.body;
    let user;

    if (Login_type === commonFunctions.LoginTypeEnum.PHONE) {
      user = await User.findOne({ where: { Phone } });
    } else if (Login_type === commonFunctions.LoginTypeEnum.EMAIL) {
      user = await User.findOne({ where: { Email } });
    }

    // Check if user exists
    if (!user) {
      return res.status(400).json({ message: messages.error.USER_NOT_FOUND });
    }

    // Verify OTP
    if (user.Otp !== Otp) {
      return res.status(400).json({ message: messages.error.OTP_MISMATCH });
    }

    const accessToken = generateToken({ id: user.id });
    
    // Update user record with the generated access token and verification status
    user.AccessToken = accessToken;
    user.Is_verified = true;
    await user.save();

    return res.status(200).json({ message: messages.success.FORGOT_PASSWORD_OTP_VERIFIED, accessToken });

  } catch (error) {
    return next(error);
  }
};



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



const forgotPassword = async (req, res, next) => {
  try {
    const { NewPassword } = req.body;

    // Hash the new password using bcrypt
    const hashedPassword = await bcrypt.hash(NewPassword, 10);

    // Fetch the user by ID from the database
    const user = await User.findOne({ where: { ID: req.user.ID } });

    // Update user's password and remove access token
    user.Password = hashedPassword;
    user.AccessToken = "";
    await user.save();

    // Return success message
    return res.status(200).json({ message: messages.success.PASSWORD_CHANGED });

  } catch (error) {
    return next(error);
  }
};



// reset password
const resetPassword = async (req, res, next) => {
  try {
    const { OldPassword, NewPassword } = req.body;

    // Find the user by ID from the database
    const user = await User.findOne({ where: { ID: req.user.ID } });

    // Check if the user exists
    if (!user) {
      return res.status(400).json({ message: messages.error.USER_NOT_FOUND });
    }

    // Verify if the old password matches the stored hashed password
    const isMatch = await bcrypt.compare(OldPassword, user.Password);
    if (!isMatch) {
      return res.status(400).json({ message: messages.error.INVALID_OLD_PASSWORD });
    }

    // Hash the new password and update user details
    const hashedPassword = await bcrypt.hash(NewPassword, 10);
    user.Password = hashedPassword;
    user.AccessToken = "";

    // Save the updated user details in the database
    await user.save();

    // Return success message
    return res.status(200).json({ message: messages.success.PASSWORD_CHANGED });

  } catch (error) {
    return next(error);
  }
};



// logout 
const logout = async (req, res, next) => {
  try {
    // Find the user by ID from the database
    const user = await User.findOne({ where: { ID: req.user.ID } });

    // Update the user's access token to an empty string to invalidate the session
    user.AccessToken = "";
    await user.save();

    // Return success message
    return res.status(200).json({ message: messages.success.LOGGED_OUT });

  } catch (error) {
    return next(error);
  }
};

//for admin - user report 
const getUserReport = async (req, res, next) => {
  try {
      const { page = 1, pageSize = 10, searchTerm, startDate, endDate } = req.body;

      const offset = (page - 1) * pageSize;
      const limit = parseInt(pageSize);

      const whereConditions = {};
      if (searchTerm) {
          whereConditions[Op.or] = [
              { 'Name': { [Op.like]: `%${searchTerm}%` } },
              { 'Email': { [Op.like]: `%${searchTerm}%` } },
          ];
      }
      if (startDate && endDate) {
          whereConditions.createdAt = {
              [Op.between]: [new Date(startDate), new Date(endDate)],
          };
      }

      const users = await User.findAndCountAll({
        attributes: {
          exclude: [
            'Password',
            'AccessToken',
            'Otp_expiration_time',
            'Is_otp_verified',
            'Created_at',
            'Updated_at',
            'Otp',
          ],
        },
          where: whereConditions,
          offset: offset,
          limit: limit,
      });

      const totalPages = Math.ceil(users.count / limit);

      res.status(200).json({
          users: users.rows,
          TotalUser: users.count,
          pagination: {
              page: parseInt(page),
              pageSize: limit,
              totalPages: totalPages,
          },
      });
  } catch (error) {
      return next(error);
  }
};
  
module.exports = { registerUser, loginWithPassword ,requestLoginOTP,loginWithOTP,resendOTP,verifyForgotPasswordOTP,
  verifyOTP,getAllUsers,forgotPassword,resetPassword,logout,getUserReport };