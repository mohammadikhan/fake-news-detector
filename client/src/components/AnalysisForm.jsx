import { useState } from "react";
import AppNav from "./ui/AppNav";
import { FileText, Lightbulb } from "lucide-react";
import AnalysisResult from "./AnalysisResult";
import API from "../api/axios";

const AnalysisForm = () => {

    const [text, setText] = useState("");
    const [includeAIExplanation, setIncludeAIExplanation] = useState(true);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const handleAnalyze = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResult(null);
        
        try {
            const res = await API.post("/analysis/text", { text, includeExplanation: includeAIExplanation }, { withCredentials: true });
            setResult(res.data);
        } catch (err) {
            setError(err.response?.data?.message || "[ERROR]: Analysis Failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
    const canSubmit = !loading && wordCount >= 250;

    return (
        <>
            <div className="min-h-screen" style={{ background: "#fefdfb"}}>
                <AppNav/>
                
                <div className="max-w-7xl mx-auto px-6 pt-32 pb-20">
                    <div className="text-center mb-10" style={{borderBottom: "3px double #1c1c1c", paddingBottom: "20px"}}>
                        <p style={{fontFamily: "'Libre Baskerville', Georgia, serif", fontStyle: "initial" ,fontSize: "13px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#000000", marginBottom: "8px"}}>
                            VeriNews Analyzer
                        </p>
                        <h1 style={{fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, fontSize: "clamp(28px, 4vw, 44px)", color: "#1c1c1c", lineHeight: 1.1}}>
                            Submit an Article, Get the <em style={{color: "#8b0000"}}>Truth</em>
                        </h1>
                        <p style={{fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: "14px", color: "#000000", marginTop: "8px"}}>
                            {result ? "Analysis results will appear to the right." : "Minimum 250 words. Analysis results will appear to the right."}
                        </p>
                        <p style={{fontSize: "14px", color: "#000000"}}>NOTE: Performing an Analysis can take up to 5 minutes. Please be patient.</p>
                    </div>

                    <div className={`grid gap-8 items-start ${result ? "grid-cols-1 lg:grid-cols-2" : "max-w-2xl mx-auto"}`}>
                        <div style={{background: "#fefdfb", border: "1px solid #1c1c1c", padding: "32px"}}>
                            <form onSubmit={handleAnalyze} style={{display: "flex", flexDirection: "column", gap: "20px"}}>
                                
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="flex items-center gap-2" style={{fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: "13px", letterSpacing: "0.1em", textTransform: "uppercase", color: "#4a4440"}}>
                                            <FileText className="w-5 h-5"/>
                                            Article Content
                                        </label>
                                        <span style={{fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: "13px", color: wordCount >= 250 ? "#1c1c1c" : "#7a7570"}}>
                                            {wordCount} words {wordCount < 250 && `(${250 - wordCount} more needed)`}
                                        </span>
                                    </div>
                                    <textarea
                                        value={text}
                                        onChange={(e) => setText(e.target.value)}
                                        placeholder="Paste a News Article here..."
                                        rows={10}
                                        required
                                        style={{
                                            width: "100%",
                                            padding: "12px 14px",
                                            background: "#fefdfb",
                                            border: "1px solid #1c1c1c",
                                            color: "#1c1c1c",
                                            fontFamily: "'Libre Baskerville', Georgia, serif",
                                            fontSize: "15px",
                                            lineHeight: 1.7,
                                            resize: "vertical",
                                            outline: "none",
                                        }}
                                        onFocus={(e) => {e.target.style.borderColor = "#8b0000"}}
                                        onBlur={(e) => {e.target.style.borderColor = "#1c1c1c"}}
                                    />
                                </div>
                                {/* Add Optional AI Explainability Toggle */}
                                <label className="flex items-center gap-3 cursor-pointer select-none">
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            className="sr-only"
                                            checked={includeAIExplanation}
                                            onChange={(e) => setIncludeAIExplanation(e.target.checked)}
                                        />
                                        <div style={{
                                            width: "40px",
                                            height: "22px",
                                            background: includeAIExplanation ? "#1c1c1c" : "rgba(28,28,28,0.15)",
                                            border: "1px solid #1c1c1c",
                                            position: "relative"
                                        }}>
                                            <div style={{
                                                position: "absolute",
                                                top: "2px",
                                                left: includeAIExplanation ? "20px" : "2px",
                                                width: "16px", height: "16px",
                                                background: "#ffffff",
                                                transition: "left 0.15s",
                                            }}/>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Lightbulb className="w-4 h-4" style={{color: includeAIExplanation ? "#1c1c1c" : "#7a7570"}}/>
                                        <span style={{fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: "14px", color: includeAIExplanation ? "#000000" : "#7a7570"}}>
                                            Include AI Explanation
                                        </span>
                                    </div>
                                </label>
                                {error && (
                                    <div style={{background: "rgba(139,0,0,0.06)", border: "1px solid #8b0000", color: "#8b0000", fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: "14px", padding: "10px 14px"}}>
                                        {error}
                                    </div>
                                )}
                                <button type="submit" disabled={!canSubmit}
                                    style={{
                                        background: canSubmit ? "#1c1c1c" : "rgba(28,28,28,0.12)",
                                        color: canSubmit ? "#ffffff" : "#7a7570",
                                        border: `1px solid ${canSubmit ? "#1c1c1c" : "rgba(28,28,28,0.2)"}`,
                                        padding: "14px",
                                        fontFamily: "'Libre Baskerville', Georgia, serif",
                                        fontSize: "14px",
                                        letterSpacing: "0.12em",
                                        textTransform: "uppercase",
                                        fontWeight: 700,
                                        cursor: canSubmit ? "pointer" : "not-allowed",
                                        width: "100%",
                                    }}
                                >
                                    {loading ? (
                                        <span>Analyzing...</span>
                                    ) : (
                                        "Analyze Article"
                                    )}
                                </button>
                            </form>
                        </div>

                        {/* Display Results to the Right */}
                        {result && (
                            <div className="lg:sticky lg:top-28">
                                <AnalysisResult result={result}/>
                            </div>
                        )}
                    </div>
                </div>
            </div> 
        </>
    )
}

export default AnalysisForm;
