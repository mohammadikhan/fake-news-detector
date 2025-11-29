import BlacklistToken from "../models/BlacklistToken.js";

const checkBlacklist = async(req, res, next) => {

    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(" ")[1];

        // Check to see if the access token is blacklisted
        const blacklisted = await BlacklistToken.findOne({token});

        if (blacklisted) {
            return res.status(401).json({ success: false, message: "[ERROR]: Your session has expired. Please login again."})
        }
    }

    next();
};

export default checkBlacklist;
