import express from "express"
import { login, logout, registerUser, resendVerificationCode, verifyUser } from "../controllers/authController.js"
import checkBlacklist from "../middleware/checkBlacklist.js";
import attachAccessToken from "../middleware/attachAccessToken.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router()

router.post("/register", registerUser);
router.post("/verify", verifyUser);
router.post("/resend_code", resendVerificationCode);
router.post("/login", login);
router.post("/logout", attachAccessToken, verifyToken, checkBlacklist, logout);

export default router;
