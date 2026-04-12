import { ShieldAlert } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Typewriter from 'typewriter-effect';

const AuthLayout = ({children}) => {

    const navigate = useNavigate();

    return (
            <div className="min-h-screen flex" style={{background: "#1c1c1c"}}>
                
                {/* Left Panel */}
                <div className="hidden md:flex md:w-1/2 items-center justify-center p-12 relative" style={{background: "#eeebeb", borderRight: "4px double #eeebeb"}}>
                    <div className="max-w-md" style={{color: "#1c1c1c"}}>
                        {/* Add VeriNews Logo */}
                        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")} style={{fontFamily: "'Playfair Display', Georgia, serif"}}>
                            <ShieldAlert className="w-10 h-10" style={{color: "#8b0000"}}/>
                            <span style={{fontSize: "32px", fontWeight: 900, letterSpacing: "-0.02em", color: "#1c1c1c"}}>
                                    VeriNews AI
                            </span>
                        </div>

                     {/*Create Heading*/}
                    <h2 style={{fontFamily:"'Playfair Display', Georgia, serif", fontWeight: 900, fontSize: "30px", lineHeight: 1.1, marginBottom: "16px", marginTop: "16px", color: "#1c1c1c"}}>
                        Submit an Article <em style={{color: "#8b0000"}}>Get the Truth</em>
                    </h2>
                    <div style={{ letterSpacing: "0.1em", fontSize: "22px "}}>
                        <Typewriter
                            options={{
                            strings: ["Use VeriNews AI.", "Use It to Flag Misleading Information.", "To Obtain Truthfulness.", "Because You Deserve to Know the Truth."],
                            autoStart: true,
                            loop: true,
                            delay: 60,
                            deleteSpeed: 20
                        }}
                    />

                    {/* Label Features */}
                    <div style={{borderTop: "1px solid rgba(255, 255, 255, 0.15)", paddingTop: "45px"}}>
                        {[{label: "AI-Powered Analysis", description: "Model Processes Article"},
                          {label: "Confidence Scoring", description: "Transparent Score on Scale of 0-100"},
                          {label: "Explainable Results", description: "Optional Human-Readable Explanations"}
                        ].map(({label, description}) => (
                            <div key={label} className="flex items-start gap-3 mb-4">
                                <div className="flex-shrink-0 mt-1" style={{width: "8px", height: "8px", background: "#8b0000", marginTop: "5px"}}/>
                                <div>
                                    <p style={{fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: "13px", fontWeight: 700, color: "#1c1c1c"}}>{label}</p>
                                    <p style={{fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: "12px", color: "#4a4440"}}>{description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
        <div className="w-full md:w-1/2 flex items-center justify-center p-6">
            {children}
            test
        </div>
    </div>
    )
}

export default AuthLayout;
