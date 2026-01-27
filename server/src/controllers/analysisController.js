import Analysis from "../models/Analysis.js";
import { analyzeText } from "../../services/mlService.js";

export const analyze = async(req, res) => {

    try {
        const { text, includeExplanation } = req.body;

        if (!text || text.length < 50) {
            return res.status(400).json({error: "[ERROR]: Provided text is too short to analyze"})
        }

        const startTime = performance.now();
        
        const mlResult = await analyzeText({
            text,
            includeExplanation
        });

        const endTime = performance.now()

        const processingTime = (endTime - startTime) / 1000;

        const analysis = new Analysis({
            user: req.user?._id || null,
            inputText: text,
            prediction: mlResult.prediction,
            confidence: mlResult.confidence,
            probabilities: mlResult.probabilities,
            explainability: includeExplanation ? {
                topFakeIndicators: mlResult.explainability.topFakeIndicators,
                topRealIndicators: mlResult.explainability.topRealIndicators,
                interpretation: mlResult.explainability.interpretation
            } : null,
            metadata: {
                textLength: text.length,
                processingTime: processingTime.toString(),
                model: "RoBERTa-base"
            }
        });
        
        await analysis.save();

        res.status(200).json(analysis);
    
    } catch (err) {
        console.log(err);
        res.status(500).json({error: "[ERROR]: Analysis could not be performed"});
    }

};