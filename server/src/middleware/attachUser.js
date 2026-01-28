import User from "../models/User.js"

const attachUser = async(req, res, next) => {

    try {
        
        if (!req.userId){
            return next();
        }

        const user = await User.findById(req.userId).select("_id email");

        if (!user){
            return next();
        }

        req.user = user;
        next();
    
    } catch(err){
        console.error("[ERROR]: Attach User middleware failed: ", err);
        next();
    }
};

export default attachUser;
