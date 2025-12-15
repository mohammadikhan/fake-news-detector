import jwt from 'jsonwebtoken';
import RefreshToken from '../models/RefreshToken.js';
import generateTokens from '../utils/generateJWT.js';

const attachAccessToken = async(req, res, next) => {

    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({message: "[ERROR]: Session Token not found. Authentication is required"});
    }

    try {

        const tokenInDB = await RefreshToken.findOne({ token: refreshToken });

        if (!tokenInDB) {
            return res.status(401).json({ message: "[ERROR]: Token is invalid or the session token has been revoked."});
        }

        const { accessToken } = generateTokens(tokenDocument.userId);

        req.accessToken = accessToken;

        next();

    } catch (error) {
        console.error("[ERROR]: Error in generating/attaching Access Token: ", error);
        return res.status(500).json({ message: "[SERVER-ERROR]: Server error during session refresh"});
    }
}

export default attachAccessToken;