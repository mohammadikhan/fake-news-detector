import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {

    // Get the Access Token from the request object
    const accessToken = req.accessToken;

    if (!accessToken) {
        return res.status(401).json({message: "[ERROR]: Access token is missing. Could not authorize."});
    }

    // Verify the access token's signature and expiration
    jwt.verify(accessToken, process.env.JWT_SECRET, (err, decoded) => {

        if (err) {
            // Token is invalid
            return res.status(401).json({message: "[ERROR]: Access Token is invalid or has expired."});
        }

        // Attach decoded user ID to the request 
        req.userId = decoded.id;

        // Go to the next middleware (checkBlacklist)
        next();
    })
};

export default verifyToken;
