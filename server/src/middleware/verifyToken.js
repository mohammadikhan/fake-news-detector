import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {

    // Extract the token from the 'Bearer <token>'
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')){
        // The header is missing or not formatted correctly
        return res.status(401).json({message: "[ERROR]: Authentication missing or it was not formatted correctly"});

    }

    const token = authHeader.split(" ")[1];

    // verifying the token
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {

        if (err) {
            // Token is invalid
            return res.status(403).json({message: "[ERROR]: Token is invalid or has expired"});
        }

        // Attach the user info to the request (the user object in this case is the decoded payload)
        // Proceed to the next middleware
        req.user = user;
        next();
    });
};

export default verifyToken;
