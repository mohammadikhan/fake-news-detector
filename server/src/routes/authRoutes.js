import express from "express"
import { login, registerUser, resendVerificationCode, verifyUser } from "../controllers/authController.js"

const router = express.Router()

router.post("/register", registerUser);
router.post("/verify", verifyUser);
router.post("/resend_code", resendVerificationCode);
router.post("/login", login);

export default router;
