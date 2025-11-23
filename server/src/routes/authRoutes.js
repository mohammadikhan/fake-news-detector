import express from "express"
import { registerUser, resendVerificationCode, verifyUser } from "../controllers/authController.js"

const router = express.Router()

router.post("/register", registerUser);
router.post("/verify", verifyUser);
router.post("/resend_code", resendVerificationCode);

export default router;
