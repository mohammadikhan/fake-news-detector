import express from "express";
import { analyze } from "../controllers/analysisController.js";
import attachAccessToken from "../middleware/attachAccessToken.js";
import verifyToken from "../middleware/verifyToken.js";
import checkBlacklist from "../middleware/checkBlacklist.js";
import attachUser from "../middleware/attachUser.js";

const router = express.Router();

router.post("/text", attachAccessToken, verifyToken, checkBlacklist, attachUser, analyze);


export default router;
