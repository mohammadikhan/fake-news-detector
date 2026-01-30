import Analysis from "../models/Analysis.js";

export const submitFeedback = async(req, res) => {

    try {

        const { id, isCorrect, userPrediction, comment } = req.body;
        const userId = req.userId;

        const analysis = await Analysis.findById(id);

        if (!analysis) {
            return res.status(404).json({message: "[ERROR]: Analysis was not found"});
        }

        if (analysis.user?.toString() !== userId) {
            return res.status(403).json({message: "[ERROR]: User did not make this analysis"});
        }

        if (analysis.feedback) {
            return res.status(400).json({message: "[ERROR]: Feedback has already been submitted for this analysis. Multiple feedbacks cannot be done to the same analysis"});
        }

        analysis.feedback = {
            user: userId,
            isCorrect,
            userPrediction,
            comment
        }

        console.log(userId);
        await analysis.save();

        res.status(201).json({success: true, message: "[SUCCESS]: Feedback was submitted", feedback: analysis.feedback});
    
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "[ERROR]: Server Error"});
    }
};
