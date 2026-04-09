import { ArrowBigRightIcon, CheckCircle2, FileX2Icon, MessageSquare, MessageSquareMore } from "lucide-react";
import API from "../api/axios";
import AppNav from "./ui/AppNav";
import { useState, useEffect } from "react";

const FeedbackHistory = () => {

    const [loading, setLoading] = useState(true);
    const [feedbacks, setFeedbacks] = useState([]);
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState("ALL");

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const [feedbackResponse, userResponse] = await Promise.all([
                    API.get("/feedback/my-reports"),
                    API.get("/user/profile"),
                ]);
                setFeedbacks(feedbackResponse.data.feedbacks || []);
                setUser(userResponse.data.data);
            } catch {
                setError("[ERROR]: Could not load feedback history");
            } finally {
                setLoading(false);
            }
        }
        
        fetchUserData()
    }, [])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: "#fefdfb" }}>
                <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: "italic", fontSize: "18px", color: "#4a4440"}}>Loading Feedback Edition…</p>
            </div>
        );
    }

    const numConfirmed = feedbacks.filter(f => f.feedback?.isCorrect === true).length;
    const numCorrected = feedbacks.filter(f => f.feedback?.isCorrect === false).length;

    const filterFeedbacks = feedbacks.filter(f => {
        if (filter === "CONFIRMED") return f.feedback?.isCorrect === true;
        if (filter === "CORRECTED") return f.feedback?.isCorrect === false;
        return true;
    })


     const Prediction = ({ prediction }) => {
        return (
            <span
                className="text-xs font-bold px-2.5 py-1 flex-shrink-0"
                style={prediction === "FAKE" ? {background: "transparent", border: "1px solid #8b0000", letterSpacing: "0.12em", textTransform: "uppercase", color: "#8b0000"}
                    : {background: "transparent", border: "1px solid #1a4d1a", letterSpacing: "0.12em", textTransform: "uppercase", color: "#1a4d1a"}
                }
            >
                {prediction}
            </span>
        );
    };

    const FilterTag = ({ label, active, onClick }) => (
        <button
            onClick={onClick}
            className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
            style={{
                background: active ? "rgba(19, 105, 10, 0.15)" : "rgba(255, 255, 255, 0.04)",
                border: active ? "1px solid rgba(14, 22, 114, 0.3)" : "1px solid rgba(255, 255, 255, 0.08)",
                color: active ? "#373840" : "#1f2f47",
            }}
        >
            {label}
        </button>
    );

    return (
        <div className="min-h-screen" style={{background: "#fefdfb"}}>
            <AppNav userName={user?.name} />

            <div className="max-w-5xl mx-auto px-6 pt-28 pb-20">
                <div className="mb-8">
                    <p style={{fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", color: "#8b0000"}}>Feedback</p>
                    <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 900, fontSize: "36px", color: "#1c1c1c", lineHeight: 1.1 }}>Feedback History</h1>
                    <div className="flex items-center gap-4 flex-wrap" style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: "13px", color: "#050505", marginTop: "6px" }}>
                        <span>{feedbacks.length} Total</span>
                        <span className="w-1 h-1 rounded-full bg-current"/>
                        <span style={{color: "#1a4d1a"}}>{numConfirmed} CONFIRMED</span>
                        <span className="w-1 h-1 rounded-full bg-current"/>
                        <span style={{color: "#8b0000"}}>{numCorrected} CORRECTED</span>

                    </div>
                </div>

                 {error && (
                    <div 
                        className="mb-6 p-4 rounded-xl text-sm flex items-center gap-2"
                        style={{background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171"}}
                    >
                        <AlertTriangle className="w-4 h-4 flex-shrink-0" /> {error}
                    
                    </div>
                )}

                {/* Add Filter tags */}
                <div className="flex items-center gap-2 mb-6">
                    {["ALL", "CONFIRMED", "CORRECTED"].map(f => (
                        <FilterTag key={f} label={f} active={filter === f} onClick={() => setFilter(f)}/>
                    ))}
                </div>

                {/* List all feedbacks submitted by user */}
                {filterFeedbacks.length === 0 ? (
                    <div style={{background: "#fefdfb", padding: "48px", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", textAlign: "center"}}>
                        <MessageSquare className="w-10 h-10" style={{color: "#7a7570"}}/>
                        <p style={{fontFamily: "'Libre Baskerville', Georgia, serif", fontStyle: "italic", fontSize: "14px", color: "#7a7570"}}>
                            {feedbacks.length === 0 ? "No feedback has been sumbitted yet." : "No results matched your search :("}
                        </p>
                        {feedbacks.length === 0 && (
                            <p style={{fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: "12px", color: "#7a7570"}}>
                                Once you perform an analysis and provide feedback, it will appear here.
                            </p>
                        )}
                    </div>
                ) : (
                    <div style={{display: "flex", flexDirection: "column", gap: "12px"}}>
                        {filterFeedbacks.map((f) => {
                            const isCorrect = f.feedback?.isCorrect;
                            const userPrediction = f.feedback?.userPrediction;
                            const comment = f.feedback?.comment;
                            const correctedTo = isCorrect === false ? userPrediction : null; 

                            return (
                                <div className="rounded-xl" key={f.analysisId} style={{background: "#eeebeb", border: `1px solid #1c1c1c`, padding: "20px 24px"}}>
                                    <div className="flex items-center gap-3 flex-wrap mb-3">
                                        <div className="flex items-center gap-2">
                                            <span style={{fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: "11px", color: "#000000"}}>
                                                Model Predicted
                                            </span>
                                            <Prediction prediction={f.prediction}/>
                                        </div>

                                        {correctedTo && (
                                            <>
                                                <ArrowBigRightIcon className="w-3.5 h-3.5 flex-shrink-0" style={{color: "#7a7570"}}/>
                                                <div className="flex items-center gap-2">
                                                    <span style={{fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: "11px", color: "#000000"}}>
                                                        Corrected To
                                                    </span>
                                                    <Prediction prediction={correctedTo}/>

                                                </div>
                                            </>
                                        )}

                                        <div className="ml-auto flex-shrink-0">
                                            {isCorrect ? (
                                                <span className="flex items-center gap-1.5" style={{fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#1a4d1a", border: `1px solid "#1a4d1a"`, padding: "3px 10px"}}>
                                                    <CheckCircle2 className="w-3 h-3"/> 
                                                    Confirmed
                                                </span>
                                            ): (
                                                <span className="flex items-center gap-1.5" style={{fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#8b0000", border: `1px solid "#8b0000"`, padding: "3px 10px"}}>
                                                    <FileX2Icon className="w-3 h-3"/>
                                                    Corrected
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Preview Article that was analyzed */}
                                    <p className="line-clamp-2 mb-3" style={{fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: "13px", lineHeight: 1.6, color: "#000000"}}>
                                        {f.inputText}
                                    </p>

                                    {/* Show Feedback Comment made by user*/}
                                    {comment && (
                                        <div className="flex items-start gap-2 mb-3" style={{background: "#fefdfb", border: `2px solid #000000`, padding: "10px 12px"}}>
                                            <MessageSquareMore className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{color: "#7a7570"}}/>
                                            <p style={{fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: "12px", lineHeight: 1.6, fontStyle: "italic", color: "#4a4440"}}>
                                                "{comment}"
                                            </p>
                                        </div>
                                    )}

                                    {/* Footer */}
                                    <div className="flex items-center gap-3 flex-wrap" style={{fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: "11px", color:"#8b0000", borderTop: `1px solid rgba(28, 28, 28, 0.1)`, paddingTop: "10px"}}>
                                        <span>{Math.round(f.confidence * 100)}% Model Confidence</span>
                                        <span className="ml-auto">
                                            {new Date(f.analyzedAt).toLocaleDateString("en-US", {year: "numeric", month: "long", day: "numeric"})}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {filterFeedbacks.length > 0 && filterFeedbacks.length !== feedbacks.length && (
                    <p style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: "12px", color: "#7a7570", textAlign: "center", marginTop: "20px", fontStyle: "italic"}}>
                        Showing {filterFeedbacks.length} of {feedbacks.length} feedback submissions
                    </p>
                )}
            </div>
        </div>
    )
}

export default FeedbackHistory;
