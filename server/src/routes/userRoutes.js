import express from "express";
import { getUserProfile } from "../controllers/userController.js";
import verifyToken from "../middleware/verifyToken.js";
import checkBlacklist from "../middleware/checkBlacklist.js";
import attachAccessToken from "../middleware/attachAccessToken.js";

const router = express.Router();

router.get("/profile", attachAccessToken, verifyToken, checkBlacklist, getUserProfile);

export default router;
