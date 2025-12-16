import BlacklistToken from "../models/BlacklistToken.js";

const checkBlacklist = async(req, res, next) => {

    // Get the Access Token from the request object
    const accessToken = req.accessToken;

    if (!accessToken) {
        return res.status(401).json({ message: '[ERROR]: Access token was not provided by the server middleware'});
    }

    try {
        const blacklisted = await BlacklistToken.findOne({accessToken});

        // Token is blacklisted
        if (blacklisted) {
            return res.status(401).json({message: "[ERROR]: Your session has expired. Please login again."});
        }

        next();
    
    } catch (error) {
        console.error("[ERROR]: There was an error in checking blacklist: ", error);
        res.status(500).json({message: "[ERROR]: Server error during token validation."});
    }

};

export default checkBlacklist;
