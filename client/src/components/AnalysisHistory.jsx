import { useEffect, useState } from "react";
import AppNav from "./ui/AppNav.jsx";
import { useNavigate } from "react-router-dom";
import { CheckCircle, FileText, Minus, Search } from "lucide-react";
import API from "../api/axios.js";

const AnalysisHistory = () => {

    const navigate = useNavigate();

    const [analyses, setAnalyses] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("ALL");

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const [historyResponse, userResponse] = await Promise.all([
                    API.get("/history"),
                    API.get("/user/profile"),
                ]);

                setAnalyses(historyResponse.data.analyses || []);
                setUser(userResponse.data.data);
            } catch {
                setError("[ERROR]: Failed to load analysis history.");
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();

    }, []);

    console.log(user);

    const filterAnalyses = analyses.filter(a => {
        const matchesPrediction = filter === "ALL" || a.prediction === filter;
        const matchesSearch = a.inputText.toLowerCase().includes(search.toLowerCase());
        return matchesPrediction && matchesSearch;
    });

    const fakeCount = analyses.filter(a => a.prediction === "FAKE").length;
    const realCount = analyses.filter(a => a.prediction === "REAL").length;
    const withFeedback = analyses.filter(a => a.feedback).length;

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

    const Feedback = ({ feedback }) => {
        if (!feedback) return (
            <span className="text-xs flex items-center gap-1" style={{color: "#161718" }}>
                <Minus className="w-3 h-3"/> No Feedback Provided
            </span>
        );

        return feedback.isCorrect ? 
            <span className="text-xs flex items-center gap-1" style={{ color: "#1a4d1a"}}><CheckCircle className="w-3 h-3"/>Confirmed</span>
            : <span className="text-xs flex items-center gap-1" style={{color: "#8b0000"}}><CheckCircle className="w-3 h-3"/>Corrected</span>
    }

    const Confidence = ({ confidence }) => {
        const percetnage = Math.round(confidence * 100);
        const color = percetnage >= 80? "#1a4d1a" : percetnage >= 60 ? "#436e20" : "#b13737";

        return (
            <div className="flex items-center gap-2 flex-shrink-0">
                <div className="w-16 h-1.5 rounded-full" style={{background: "rgba(255, 255, 255, 0.06" }}>
                    <div className="h-1.5 rounded-full" style={{width: `${percetnage}%`, background: color}}/>
                </div>
                <span className="text-xs tabular-nums" style={{color}}>{percetnage}%</span>

            </div>
        )
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: "#fefdfb" }}>
                <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: "italic", fontSize: "18px", color: "#4a4440"}}>Loading Analysis Edition…</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen" style={{background: "#fefdfb"}}>
            <AppNav userName={user?.name}/>

            <div className="max-w-5xl mx-auto px-6 pt-28 pb-20">
                <div className="mb-8">
                    <p style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", color: "#8b0000"}}>Analyses</p>
                    <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 900, fontSize: "36px", color: "#1c1c1c", lineHeight: 1.1 }}>Analysis History</h1>
                    <div className="flex items-center gap-4 flex-wrap" style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: "13px", color: "#050505", marginTop: "6px" }}>
                        <span>{analyses.length} Total</span>
                        <span className="w-1 h-1 rounded-full bg-curent"/>
                        <span style={{color: "#8b0000"}}>{fakeCount} FAKE</span>
                        <span className="w-1 h-1 rounded-full bg-current"/>
                        <span style={{color: "#1a4d1a"}}>{realCount} REAL</span>
                        <span className="w-1 h-1 rounded-full bg-current"/>
                        <span>{withFeedback} with Feedback</span>
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

                {/* Create Search Bar */}
                <div className="flex items-center gap-3 mb-5 flex-wrap">
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl flex-1 min-w-48"
                         style={{background: "rgba(255,255,255,0.04)", border: "2px solid #7a7171" }}>
                        <Search className="w4 h-4 flex-shrink-0" style={{color: "#475569"}}/>
                        <input 
                            type="text"
                            placeholder="Search analyses..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="bg-transparent outline-none text-sm w-full"
                            style={{color: "#4f5153", caretColor: "#030417"}}
                        />
                    </div>

                    {/* Add Filter tags */}
                    <div className="flex items-center gap-2">
                        {["ALL", "FAKE", "REAL"].map(f => (
                            <FilterTag key={f} label={f} active={filter === f} onClick={() => setFilter(f)}/>
                        ))}
                    </div>
                </div>

                {/* List all of the users analyses */}
                {filterAnalyses.length === 0 ? (
                    <div className="rounded-3xl p-12 flex flex-col items-center gap-3 text-center" style={{background: "#fefdfb", border: "1px solid rgba(0, 212, 255, 0.12)", backdropFilter: "blur(10px)"}}>

                        <FileText className="w-10 h-10" style={{color: "#334155"}}/>
                        <p className="text-sm font-medium" style={{color: "#0c0c0d"}}>
                            {analyses.length === 0 ? "No Analyses yet." : "No results matched your search :("}
                        </p>
                        {analyses.length === 0 && (
                            <button 
                                className="mt-2 text-sm font-semibold px-4 py-2 rounded-lg text-white hover:opacity-90"
                                onClick={() => navigate("/analyze")}
                                style={{background: "#1c1c1c"}}
                            >
                                Analyze your first article!
                            </button>
                        )}

                    </div>

                ) : (
                    <div className="space-y-3">
                        {filterAnalyses.map((a) => (
                            <div
                                key={a.analysisId}
                                className="rounded-2xl px-5 py-5 flex flex-col gap-3"
                                style={{background: "#eeebeb", border: "1px solid #1c1c1c", backdropFilter: "blur(10px)"}}
                            >
                                <div className="flex items-start gap-3">
                                    <Prediction prediction={a.prediction}/>
                                    <p className="text-sm leading-snug flex-1 min-w-0" style={{color: "#1d1e1f"}}>
                                        {a.inputText}
                                    </p>
                                </div>

                            {/* Bottom */}
                            <div className="flex items-center gap-4 flex-wrap">
                                <Confidence confidence={a.confidence}/>
                                <Feedback feedback={a.feedback}/>
                                <span className="text-xs ml-auto flex-shrink-0" style={{color: "#334155"}}>
                                    {new Date(a.analyzedAt).toLocaleDateString("en-US", {
                                        year: "numeric", month: "short", day: "numeric"
                                    })}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
                
            </div>

        </div>
    )
}

export default AnalysisHistory;
