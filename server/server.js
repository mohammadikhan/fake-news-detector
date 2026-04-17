import express from "express"
import dotenv from "dotenv"
import { connectDB } from "./src/config/database.js"
import authRoutes from "./src/routes/authRoutes.js"
import userRoutes from "./src/routes/userRoutes.js";
import analysisRoutes from "./src/routes/analysisRoutes.js";
import feedbackRoutes from "./src/routes/feedbackRoutes.js";
import historyRoutes from "./src/routes/historyRoutes.js";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: process.env.CORS_ORIGIN || "http://localhost:5173", credentials: true }));

app.get("/", (req, res) => {
    res.send("[SUCCESS]: Server is ready!")
})

app.use("/api/auth", authRoutes)
app.use("/api/user", userRoutes);
app.use("/api/analysis", analysisRoutes)
app.use("/api/feedback", feedbackRoutes);
app.use("/api/history", historyRoutes);

app.listen(process.env.PORT || 5000, () => {
    connectDB();
    console.log("[SUCCESS]: Server is up and running at http://localhost:5000")
})

