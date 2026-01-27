import axios from "axios"

const ML_BASE_URL = process.env.ML_SERVICE_URL || "http://127.0.0.1:8000";

export async function analyzeText({
    text,
    includeExplanation = false,

}) {

    try {
        const response = await axios.post(`${ML_BASE_URL}/analyze`, {
            text,
            includeExplanation,
        });

        return response.data
    
    } catch (error) {
        console.error("[ERROR]: ML Service Error: ", error.response?.data || error.message);
        throw new error("[ML-SERVICE-FAILED]: The ML Service failed");
    }
}