import express from "express";
import attachAccessToken from "../middleware/attachAccessToken.js";
import verifyToken from "../middleware/verifyToken.js";
import checkBlacklist from "../middleware/checkBlacklist.js";
import { getAnalysisFeedback } from "../controllers/getAnalysisFeedback.js";
import { submitFeedback } from "../controllers/feedbackController.js";
import { getUserFeedback } from "../controllers/getUserFeedback.js";

const router = express.Router();

router.post("/", attachAccessToken, verifyToken, checkBlacklist, submitFeedback);
router.get("/my-reports", attachAccessToken, verifyToken, checkBlacklist, getUserFeedback);
router.get("/:id", attachAccessToken, verifyToken, checkBlacklist, getAnalysisFeedback);

export default router;
