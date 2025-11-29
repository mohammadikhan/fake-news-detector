import jwt from "jsonwebtoken"

const generateTokens = (id) => {

    // Generate access token
    const accessToken = jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || "15m"
    });

    // Generate the refresh token
    const refreshToken = jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: process.env.JWT_REFRESH_EXPIRE || "7d"
    });

    return { accessToken, refreshToken };

};

export default generateTokens;
