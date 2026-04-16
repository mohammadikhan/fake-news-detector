import { useState } from "react";
import API from "../api/axios";

const Feedback = ({analysisId, prediction}) => {

    const [isCorrect, setIsCorrect] = useState(null);
    const [comment, setComment] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const submitFeedback = async(correct) => {
        setLoading(true);
        setError(null);

        try {
            await API.post("/feedback", { analysisId, isCorrect: correct, comment: comment || null}, {withCredentials: true});
            setSubmitted(true);
        } catch (err) {
            setError(err.response?.data?.message || "[ERROR]: Failed to submit Feedback");
        } finally {
            setLoading(false);
        }
    }

    if (submitted) {
        return (
            <div style={{background: "#eeebeb", border: "1px solid #1c1c1c", padding: "24px"}}>
                <div className="flex items-center gap-2" style={{fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: "13px", color: "#1a4d1a"}}>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 1314 4L19 7"/>
                    </svg>
                    <p >Thank you for your submission! Your feedback helps to improve our model!</p>
                </div>
            </div>
        )
    }

    const correctLabel = prediction === "FAKE" ? "REAL" : "FAKE";
    
    return (
        <>
            <div style={{background: "#eeebeb", border: "1px solid #1c1c1c", padding: "24px"}}>
                <h3 style={{fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, fontSize: "15px", color: "#1c1c1c", borderBottom: "1px solid #1c1c1c", paddingBottom: "8px", marginBottom: "16px"}}>
                    Was The Model's Prediction Correct?
                </h3>

                {isCorrect === null && (
                    <div className="flex gap-3">
                        <button
                            onClick={() => setIsCorrect(true)}
                            disabled={loading}
                            style={{
                                flex: 1,
                                padding: "10px",
                                background: "rgba(26, 77, 26, 0.06)",
                                border: "1px solid #1a4d1a",
                                color: "#1a4d1a",
                                fontFamily: "'Libre Baskerville', Georgia, serif",
                                fontSize: "12px",
                                letterSpacing: "0.08em",
                                textTransform: "uppercase",
                                fontWeight: 700,
                                cursor: "pointer"
                            }}
                        >
                            Yes
                        </button>
                        <button
                            onClick={() => setIsCorrect(false)}
                            disabled={loading}
                            style={{
                                flex: 1,
                                padding: "10px",
                                background: "rgba(139, 0, 0, 0.06)",
                                border: "1px solid #8b0000",
                                color: "#8b0000",
                                fontFamily: "'Libre Baskerville', Georgia, serif",
                                fontSize: "12px",
                                letterSpacing: "0.08em",
                                textTransform: "uppercase",
                                fontWeight: 700,
                                cursor: "pointer"
                            }}
                        >
                            No
                        </button>
                    </div>
                )}

                {isCorrect !== null && (
                    <div style={{display: "flex", flexDirection: "column", gap: "16px"}}>
                        <p style={{fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: "13px", color: "#4a4440"}}>
                            {isCorrect ? <>Confirming prediction as <strong style={{ color: "#000000"}}>{prediction}</strong></>
                            : <>Correcting prediction as <strong style={{ color: "#000000"}}>{correctLabel}</strong></>}
                        </p>

                        <textarea
                            rows={3}
                            placeholder="Add optional comment..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            style={{
                                width: "100%",
                                padding: "10px 14px",
                                background: "#ffffff",
                                border: "1px solid #1c1c1c",
                                color: "#1c1c1c",
                                fontFamily: "'Libre Baskerville', Georgia, serif",
                                fontSize: "13px",
                                lineHeight: 1.6,
                                resize: "vertical",
                                outline: "none",
                                marginTop: "10px"
                            }}
                            onFocus={(e) => {e.target.style.borderColor = "#1c1c1c"}}
                            onBlur={(e) => {e.target.style.borderColor = "#1c1c1c"}}
                        />

                        <button
                            disabled={loading}
                            onClick={() => submitFeedback(isCorrect)}
                            style={{
                                width: "100%",
                                padding: "12px",
                                background: "#1c1c1c",
                                color: "#ffffff",
                                border: "1px solid #1c1c1c",
                                fontFamily: "'Libre Baskerville', Georgia, serif",
                                fontSize: "12px",
                                letterSpacing: "0.12em",
                                textTransform: "uppercase",
                                fontWeight: 700,
                                cursor: loading ? "not-allowed" : "pointer",
                                opacity: loading ? 0.6 : 1,
                            }}
                        >
                            {loading ? "Submitting..." : "Submit Feedback"}
                        </button>
                    </div>
                )}

                {error && (
                    <p style={{fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: "13px", color: "#8b0000", marginTop: "12px"}}>{error}</p>
                )}
            </div>
        
        </>
    )
}

export default Feedback;