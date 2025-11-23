import express from "express"
import { registerUser, verifyUser } from "../controllers/authController.js"

const router = express.Router()

router.post("/register", registerUser);
router.post("/verify", verifyUser);

export default router;
