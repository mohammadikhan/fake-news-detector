import User from "../models/User.js";
import bcrypt from "bcrypt"
import { sendVerificationEmail } from "../utils/sendMail.js";
import generateTokens from "../utils/generateJWT.js";
import BlacklistToken from "../models/BlacklistToken.js";
import RefreshToken from "../models/RefreshToken.js";
import jwt from "jsonwebtoken";

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

    const { accessToken, refreshToken } = generateTokens(user._id.toString());

    const maxAge = 30 * 24 * 60 * 60 * 1000;

    try {
        await RefreshToken.create({
            token: refreshToken,
            userId: user._id
        })

    } catch (dbError) {
        console.error("[ERROR]: Failed to save Refresh Token: ", dbError);
        return res.status(500).json({success: false, error: "[ERROR]: Session was not established"})
    }

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV == 'production',
        sameSite: 'strict',
        maxAge: maxAge,
    });

    res.json({
        accessToken: accessToken,
        // refreshToken: refreshToken,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        },
    });
};

export const logout = async(req, res) => {

    try {
        const authHeader = req.headers.authorization;
        const refreshToken = req.cookies.refreshToken;
        let decoded = null;

        // Here we blacklist the access token (from the header)
        if (authHeader) {
            const accessToken = authHeader.split(" ")[1];

            // Decoding access token to get user ID and exiry time
            decoded = jwt.decode(accessToken);

            // Blacklist only if the token is valid
            if (decoded) {
                await BlacklistToken.create({
                    token: accessToken,
                    userId: decoded.id,
                    expiresAt: new Date(decoded.exp * 1000)
                });
            }
        }

        // Revoking the refresh token
        if (refreshToken && decoded) {

            const deleteToken = await RefreshToken.deleteOne({
                token: refreshToken,
                userId: decoded.id
            });

            if (deleteToken.deletedCount === 0) {
                 console.log(`[WARNING]: Revocation failed for user ${decoded.id}. Token not found.`);
            }

        }

        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        })

        res.status(200).json({
            success: true,
            message: "[SUCCESS]: User was successfully logged out",
            data: {}
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: "[ERROR]: Server Error"})
    }
};
