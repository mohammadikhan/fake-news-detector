import Analysis from "../models/Analysis.js";

export const getAnalysisFeedback = async(req, res) => {
     
    try {
        const { id } = req.params;

        const analysis = await Analysis.findById(id).select("prediction confidence feedback");

        if (!analysis || !analysis.feedback) {
            return res.status(404).json({message: "[ERROR]: No Feedback found"});
        }

        return res.status(200).json({
            id,
            modelPrediction: analysis.prediction,
            confidence: analysis.confidence,
            feedback: analysis.feedback
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({message: "[SERVER-ERROR]: Could not get feedback for analysis"})
    }
}
