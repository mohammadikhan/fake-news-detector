import jwt from 'jsonwebtoken';
import RefreshToken from '../models/RefreshToken.js';
import generateTokens from '../utils/generateJWT.js';

const attachAccessToken = async(req, res, next) => {

    try {

        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({success: false, message: "[ERROR]: Session Token not found. Authentication is required"});
        }

        const tokenInDB = await RefreshToken.findOne({ token: refreshToken });

        if (!tokenInDB) {
            return res.status(401).json({sucess: false, message: "[ERROR]: Token is invalid or the session token has been revoked."});
        }

        const { accessToken } = generateTokens(tokenInDB.userId.toString());

        req.accessToken = accessToken;
        req.userId = tokenInDB.userId.toString();

        next();

    } catch(error) {
        console.error("[ERROR]: Error in generating/attaching Access Token: ", error);
        return res.status(500).json({ message: "[SERVER-ERROR]: Server error during session refresh"});
    }
}

export default attachAccessToken;
