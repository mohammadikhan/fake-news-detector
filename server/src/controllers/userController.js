import User from "../models/User.js";

export const getUserProfile = async(req, res) => {

    try {
       const userId = req.user.id;
       
       const user = await User.findById(userId).select('-passwordHash');

       if (!user) {
        return res.status(404).json({message: "User not found"});
       }

       res.status(200).json({success: true, data: user, message: "[SUCCESS]: User profile was retrieved successfully"});
    
    } catch (error) {
        console.error("[ERROR]: Profile error ---> ", error);
        res.status(500).json({ message: "[ERROR]: Server Error occurred when retrieving user profile"});
    }
}
