import Analysis from "../models/Analysis.js";

export const getAnalysisFeedback = async(req, res) => {
     
    try {
        const { id } = req.params;

        const analysis = await Analysis.findById(id);

        if (!analysis) {
            return res.status(404).json({message: "[ERROR]: Analysis was not found"});
        }

        if (!analysis.feedback) {
            return res.status(200).json({message: "[NO-FEEDBACK]: This analyis has no feedback submitted for it", feedback: null});
        }

        return res.status(200).json({
            analysisId: id,
            modelPrediction: analysis.prediction,
            confidence: analysis.confidence,
            feedback: analysis.feedback
        });

    } catch {
        console.error(error);
        return res.status(500).json({message: "[SERVER-ERROR]: Could not get feedback for analysis"})
    }
}