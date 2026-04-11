import Feedback from "./Feedback";

const AnalysisResult = ({result}) => {

    const isFake = (prediction) => prediction?.toUpperCase() === "FAKE";

    // Format AI explanation in a clean manner, including bolding key words
    const formatExplanation = (text) => 
        text.split("\n").map((line, lineIdx) => {
            if (line.trim() === "") {
                return <div key={lineIdx} style={{height: "8px"}}/>;
            }

        const words = line.split("**");
        
        return (
            <p key={lineIdx} style={{marginBottom: "4px", fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: "13px", lineHeight: 1.7, color: "#4a4440"}}>
                {words.map((word, i) =>
                    i % 2 === 1 ? <strong key={i} style={{color: "#1c1c1c", fontWeight: 700}}>{word}</strong> : word
                )}
            </p>
        
    )})
    

    const ConfidenceLabel = ({label, value, color}) => {

        return (
            <div>
                <div className="flex justify-between" style={{fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: "12px", color: "#000000", marginBottom: "6px"}}>
                    <span style={{textTransform: "uppercase", letterSpacing: "0.08em", fontSize: "11px"}}>{label}</span>
                    <span style={{color, fontWeight: 700}}>{(value * 100).toFixed(1)}%</span>
                </div>
                
                <div style={{height: "6px", background: "rgba(28, 28, 28, 0.1)"}}>
                    <div style={{height: "6px", width: `${(value * 100).toFixed(1)}%`, background: color, transition: "width 0.8s ease"}}/>
                </div>
            </div>
        )
        
    }

    const Indicators = ({word, verdict}) => {
        
        return (
            <span style={{
                fontFamily: "'Libre Baskerville', Georgia, serif",
                fontSize: "11px",
                fontWeight: 700,
                padding: "3px 8px",
                border: `1px solid ${verdict === "fake" ? "#8b0000" : "#1a4d1a"}`,
                color: verdict === "fake" ? "#8b0000": "#1a4d1a",
                background: "transparent",
                letterSpacing: "0.04em",
            }}>

                {word}

            </span>
        )
        
    }

    const ResultHeader = ({children}) => {
        
        return (
            <h3 style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontWeight: 700,
                fontSize: "15px",
                color: "#1c1c1c",
                borderBottom: "1px solid #1c1c1c",
                paddingBottom: "6px",
                marginBottom: "14px",
            }}>
                {children}
            </h3>
        )
    }

    const fake = isFake(result.prediction);
    const verdictColor = fake ? "#8b0000" : "#1a4d1a";

    return (
        <>
            <div style={{display: "flex", flexDirection: "column", gap: "16px"}}>

                {/* Create Verdict Label */}
                <div style={{
                    background: fake ? "#eeebeb" : "#eeebeb",
                    border: `2px solid ${verdictColor}`,
                    padding: "24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}>

                    <div>
                        <p style={{fontFamily: "'Libre Baskerville', Georgia, serif", fontWeight: 700, fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#000000", marginBottom: "4px"}}>
                            Verdict:
                        </p>
                        <p style={{fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 900, fontSize: "48px", color: verdictColor, lineHeight: 1, letterSpacing: "-0.02em"}}>
                            {result.prediction}
                        </p>
                    </div>
                    <div style={{textAlign: "right"}}>
                        <p style={{fontFamily: "'Libre Baskerville', Georgia, serif", fontWeight: 700, fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#000000", marginBottom: "4px"}}>
                            Confidence:
                        </p>
                        <p style={{fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 900, fontSize: "48px", color: verdictColor, lineHeight: 1, letterSpacing: "-0.02em"}}>
                            {(result.confidence * 100).toFixed(1)}%
                        </p>
                    </div>
                </div>

                {/* Create Probability Bars */}
                <div style={{ background: "#fefdfb", border: "1px solid #1c1c1c", padding: "24px" }}>
                    <ResultHeader>Probability Breakdown: </ResultHeader>
                    <div style={{display: "flex", flexDirection: "column", gap: "16px"}}>
                        <ConfidenceLabel label="Fake" value={result.probabilities.fake} color={"#8b0000"}/>
                        <ConfidenceLabel label="Real" value={result.probabilities.real} color={"#1a4d1a"}/>
                    </div>
                </div>

                {/* Create AI Explaination Section */}
                {result.explainability && (
                    <div style={{ background: "#fefdfb", border: "1px solid #1c1c1c", padding: "24px" }}>
                        <ResultHeader>AI Explanation: </ResultHeader>

                        {result.explainability.topFakeIndicators?.length > 0 && (
                            <div style={{marginBottom: "16px"}}>
                                <p style={{fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: "#8b0000", marginBottom: "8px"}}>
                                    Fake Indicators:
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {result.explainability.topFakeIndicators.map((word, i) => (
                                        <Indicators key={i} word={word} verdict="fake"/>
                                    ))}
                                </div>
                            </div>
                        )}

                        {result.explainability.topRealIndicators?.length > 0 && (
                            <div style={{marginBottom: "16px"}}>
                                <p style={{fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: "#1a4d1a", marginBottom: "8px"}}>
                                    Real Indicators:
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {result.explainability.topRealIndicators.map((word, i) => (
                                        <Indicators key={i} word={word} verdict="real"/>
                                    ))}
                                </div>
                            </div>
                        )}

                        {result.explainability.interpretation && (
                            <div style={{marginBottom: "16px"}}>
                                <p style={{fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: "#000000", marginBottom: "8px"}}>
                                    Explanation:
                                </p>
                                <div style={{background: "#eeebeb", border: "1px solid rgba(28, 28, 28, 0.15)", padding: "14px 16px"}}>
                                    {formatExplanation(result.explainability.interpretation)}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Display Metda such as processing time, number of words and model used */}
                {result.metadata && (
                    <div style={{background: "#eeebeb", border: "1px solid #1c1c1c", padding: "16px 24px"}}>
                        <div className="grid grid-cols-3 gap-4 text-center">
                            {[{label: "Word Count", value: `${result.metadata.textLength} words`}, {label: "Processing Time", value: `${result.metadata.processingTime}s`}, {label: "Model", value: result.metadata.model}
                            ].map(({label, value}) => (
                                <div key={label}>
                                    <p style={{fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", color: "#000000"}}>{label}</p>
                                    <p style={{fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: "13px", fontWeight: 800, color: "#000000", marginTop: "4px"}}>{value}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Give users option to submit feedback on completed analysis */}
                <Feedback analysisId={result._id} prediction={result.prediction}/>
            </div>
        </>
    );
};

export default AnalysisResult;
