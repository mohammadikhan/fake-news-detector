
import Analysis from "../models/Analysis.js";

export const getAnalysisHistory = async(req, res) => {
    
    try {

        const allAnalyses = await Analysis.find({user: req.userId}).sort({createdAt: -1});
        
        if (!allAnalyses) {
            return res.status(404).json({message: "[ERROR]: Could not find analysis history for this user"});
        }

        return res.status(200).json({message: "[SUCCESS]: Retrieved analysis history for user",
            count: allAnalyses.length,
            analyses: allAnalyses.map(a => ({
                analysisId: a.id,
                inputText: a.inputText.slice(0, 200) + "...",
                prediction: a.prediction,
                confidence: a.confidence,
                feedback: a.feedback,
                analyzedAt: a.createdAt
            }))
        });
    
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: "[SERVER-ERROR]: Could not retrieve analysis history for user"});
    }

}