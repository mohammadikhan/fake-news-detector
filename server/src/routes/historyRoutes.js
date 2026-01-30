import express from "express";
import attachAccessToken from "../middleware/attachAccessToken.js";
import verifyToken from "../middleware/verifyToken.js";
import checkBlacklist from "../middleware/checkBlacklist.js";

import { getAnalysisHistory } from "../controllers/getAnalysisHistory.js";

const router = express.Router();

router.get("/", attachAccessToken, verifyToken, checkBlacklist, getAnalysisHistory);

export default router;
