import mongoose from "mongoose";

const AnalysisSchema = new mongoose.Schema({

    user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        default: null
    },

    inputText: {
        type: String,
        required: true,
        minLength: 50
    },

    prediction: {
        type: String,
        enum: ["FAKE, REAL"],
        required: true
    },

    confidence: {
        type: Number,
        required: true,
        min: 0,
        max: 1
    },

    probabilities: {
        
        fake: {
            type: Number,
            required: true,
            min: 0,
            max: 1
        },

        real: {
            type: Number,
            required: true,
            min: 0,
            max: 1
        }

    },

    explainability: {
        
        topFakeIndicators: [{
            token: String,
            score: Number
        }],

        topRealIndicators: [{
            token: String,
            score: Number
        }],

        interpretation: String,
        default: null

    },

    metadata: {
        textLength: Number,
        processingTime: String,
        model: {
            type: String,
            default: 'RoBERTa-base'
        }
    },

}, { timestamps: true });

export default mongoose.model("Analysis", AnalysisSchema)