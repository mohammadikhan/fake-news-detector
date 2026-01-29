import express from "express";
import { analyze } from "../controllers/analysisController.js";
import attachAccessToken from "../middleware/attachAccessToken.js";
import verifyToken from "../middleware/verifyToken.js";
import checkBlacklist from "../middleware/checkBlacklist.js";
import attachUser from "../middleware/attachUser.js";
import { getAnalysisFeedback } from "../controllers/getAnalysisFeedback.js";
import { submitFeedback } from "../controllers/feedbackController.js";

const router = express.Router();

router.post("/text", attachAccessToken, verifyToken, checkBlacklist, attachUser, analyze);
router.post("/:id/feedback", attachAccessToken, verifyToken, checkBlacklist, submitFeedback);
router.get("/:id/feedback", attachAccessToken, verifyToken, checkBlacklist, getAnalysisFeedback);

export default router;
