import Analysis from "../models/Analysis.js";

export const getUserFeedback = async(req, res) => {

    try {

        const analyses = await Analysis.find({user: req.userId, feedback: {$ne: null}});
        
        console.log(analyses)
        return res.status(200).json({
            count: analyses.length,
            feedbacks: analyses.map(a => ({
                analysisId: a._id,
                inputText: a.inputText.slice(0, 200) + "...",
                prediction: a.prediction,
                confidence: a.confidence,
                feedback: a.feedback,
                analyzedAt: a.createdAt
            }))
        });

    } catch(error) {
        console.error(error);
        return res.status(500).json({message: "[SERVER-ERROR]: Could not fetch the users feedback reports"});
    }
}
