import mongoose from "mongoose";

const ExplanationSchema = new mongoose.Schema({

    topFakeIndicators: [String],

    topRealIndicators: [String],

    interpretation: {
        type: String,
        required: true
    } 

}, {_id: false});

const FeedbackSchema = new mongoose.Schema({

    isCorrect: {
        type: Boolean,
        required: true,
    },

    userPrediction: {
        type: String,
        enum: ["FAKE", "REAL"],
        required: false,
    },

    comment: {
        type: String,
        maxLength: 500
    },

    reportedAt: {
        type: Date,
        default: Date.now()
    }
}, {_id: false });

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
        enum: ["FAKE", "REAL"],
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
        type: ExplanationSchema,
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

    feedback: {
        type: FeedbackSchema,
        default: null
    }

}, { timestamps: true });

export default mongoose.model("Analysis", AnalysisSchema)
