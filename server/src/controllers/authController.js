import User from "../models/User.js";
import bcrypt from "bcrypt"
import { sendVerificationEmail } from "../utils/sendMail.js";
import generateToken from "../utils/generateJWT.js";
import BlacklistToken from "../models/BlacklistToken.js";
import RefreshToken from "../models/RefreshToken.js";

export const registerUser = async(req, res) => {
    
    const {name, email, passwordHash} = req.body;

    const doesExist = await User.findOne({email});

    console.log(name)
    console.log(email)
    console.log(passwordHash)

    if (doesExist) {
        return res.status(400).json({error: "[ERROR]: This E-Mail is already registered to an account" })
    }

    const hashedPassword = await bcrypt.hash(passwordHash, 10);

    const veriCode = Math.floor(100000 + Math.random() * 90000).toString();

    const user = await User.create({
        name, 
        email, 
        passwordHash: hashedPassword, 
        isVerified: false, 
        verificationCode: veriCode, 
        verificationCodeExpiry: Date.now() + 15 * 60 * 1000,
    
    });

    await sendVerificationEmail(email, veriCode);

    res.json({message: "[SUCCESS]: Verification code was sent to the E-mail" })
};

export const verifyUser = async(req, res) => {

    const {email, code} = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        return res.status(400).json({error: "[ERROR]: User with the E-Mail does not exist" });
    }

    if (user.verificationCode !== code) {
        return res.status(400).json({error: "[ERROR]: Invalid Code" });
    }

    if (Date.now() > user.verificationCodeExpiry) {
        return res.status(400).json({error: "[ERROR]: Verification Code is expired" } );
    }

    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpiry = undefined;

    await user.save();

    res.json({message: "[SUCCESS]: E-Mail was successfully verified!" });
};

export const resendVerificationCode = async(req, res) => {

    const {email} = req.body;

    const user = await User.findOne({email});

    if (!user) {
        return res.status(400).json({error: "[ERROR]: User was not found" });
    }

    if (user.isVerified) {
        return res.status(400).json({error: "[ERROR]: User is already verified" });
    }

    const newVeriCode = Math.floor(100000 + Math.random() * 90000).toString();

    user.verificationCode = newVeriCode;
    user.verificationCodeExpiry = Date.now() + 15 * 60 * 1000;

    await user.save();

    await sendVerificationEmail(email, newVeriCode);

    return res.json({message: "[SUCCESS]: A new verification code has been sent to your E-Mail. Verify your account using the new code." })
};

export const login = async(req, res) => {
    
    const {email, passwordHash} = req.body;

    const user = await User.findOne({email});

    if (!user){
        return res.status(400).json({error: "[ERROR]: User with that E-Mail was not found"});
    }

    const matchPasswords = await bcrypt.compare(passwordHash, user.passwordHash);

    if (!matchPasswords){
        return res.status(400).json({error: "[ERROR]: Invalid Password. Please try again"});
    }

    res.json({
        token: generateToken(user._id),
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        },
    });
};

export const logout = async(req, res) => {
    
    res.status(200).json({
        success: true,
        data: {}
    });
};
