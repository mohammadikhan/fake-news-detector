import express from "express";
import { analyze } from "../controllers/analysisController.js";

const router = express.Router();

router.post("/text", analyze);

export default router;
