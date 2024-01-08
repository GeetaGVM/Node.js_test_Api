module.exports = {
    success: {
        USER_REGISTERED: 'User registered successfully!',
        LOGIN_SUCCESS: 'Logged in successfully!',
        PASSWORD_CHANGED: 'Password has been changed successfully!',
        LOGGED_OUT: 'Logged out successfully!',
        OTP_SEND: 'OTP sent successfully!',
        PRODUCT_CREATED: 'Product added successfully',
        PRODUCT_UPDATED:'Product updated successfully',
        PRODUCT_DELETED:'Product deleted successfully',
        PASSWORD_RESET_TOKEN:'Password reset token generated successfully',
        FORGOT_PASSWORD_OTP_VERIFIED: 'Forgot password OTP verified successfully!',
        OTP_VERIFIED: 'OTP Verified sucessfully'


    },
    error: {
        USER_ALREADY_REGISTERED: 'User is already registered.',
        USER_NOT_FOUND_OR_REGISTER_FIRST: "User not found or not registered. Please register first.",
        INVALID_CREDENTIALS: 'Invalid credentials.',
        INVALID_OLD_PASSWORD: 'Invalid old password.',
        UNAUTHORIZED: 'Unauthorized: You do not have permission to perform this action.',
        FORBIDDEN: 'You do not have permission to access this resource.',
        EMAIL_EXISTS: 'Email already exists.',
        AUTH_TOKEN_NOT_FOUND: 'Authentication token not found.',
        AUTH_FAILED: 'Authentication failed.',
        PRODUCT_NOT_FOUND:'Product not found',
        MISSING_REQUIRED_FIELDS: 'Field is missing',
        ACCESS_TOKEN_FAIL:'Error generating  reset token',
        EMAIL_MANDATORY:'Email is mandatory for password reset!',
        INTERNAL_SERVER_ERROR:'Internal Server Error!',
        REQUIRED_FIELDS_ERROR:'Email, password, and reset token are required for password reset!',
        INVALID_RESET_TOKEN: 'Invalid reset token',
        OTP_MISMATCH: 'Invalid OTP.',
        OTP_EXPIRED: 'OTP has expired.',
        INVALID_REQUEST_TYPE: 'Invalid request type.',
    }
};
