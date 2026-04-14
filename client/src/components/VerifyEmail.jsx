import { useLocation, useNavigate } from "react-router-dom";
import AuthLayout from "./ui/AuthLayout";
import { useState } from "react";
import API from "../api/axios";

const VerifyEmail = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email || "";

    const [code, setCode] = useState("");
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("");
    const [resendLoading, setResendLoading] = useState(false);

    const handleFocus = (e) => {
        e.target.style.borderColor = "#8b0000";
        e.target.style.boxShadow = "0 0 0 2px rgba(139, 0, 0, 0.1)";
    }

    const handleBlur = (e) => {
        e.target.style.borderColor = "#1c1c1c";
        e.target.style.boxShadow = "none";
    }

    const handleSubmit = async(e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        
        try {
            await API.post("/auth/verify", {email, code});
            setSuccess("[SUCCESS]: E-Mail successfully verified! Redirecting to Login...");
            setTimeout(() => navigate("/login"), 1500);
        } catch (err) {
            setError(err.response?.data?.error || "[ERROR]: Verification failed. Please try again.");
        }
    }

    const handleResend = async() => {
        setError("");
        setSuccess("");
        setResendLoading(true);

        try {
            await API.post("/auth/resend_code", {email});
            setSuccess("[SUCCESS]: A new verification code has been sent to your E-Mail.");
        } catch (err) {
            setError(err.response?.data?.error || "[ERROR]: Failed to resend verification code. Please try again.") 
        } finally {
            setResendLoading()
        }
    }

    if (!email) {
        return (
            <AuthLayout>
                <div style={{width: "100%", maxWidth: "420px"}}>
                    <div style={{background: "#eeebeb", border: "2px solid #1c1c1c", padding: "36px 32px"}}>
                        <div style={{borderBottom: "3px double #1c1c1c", paddingBottom: "14px", marginBottom: "20px"}}>
                            <h2 style={{fontFamily: "'Playfair Display', Georgia, serif", textAlign: "center", fontWeight: 700, fontSize: "26px", color: "#000000", lineHeight: 1.1}}>
                                Verify your E-Mail
                            </h2>
                        </div>
                        <p style={{fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: "13px", color: "#000000", marginBottom: "20px"}}>
                            No E-Mail address found. You need to register or login to receive a verification code.
                        </p>
                        <p style={{fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: "12px", color: "#000000", textAlign: "center"}}>
                            <a href="/register" style={{color: "#8b0000", textDecoration: "underline"}}>Register</a>
                            <span style={{margin: "0 8px", color: "#ccc"}}>.</span>
                            <a href="/login" style={{color: "#8b0000", textDecoration: "underline"}}>Sign In</a>
                        </p>
                    </div>
                </div>
            </AuthLayout>
        )
    }

    return (
        <>
            <AuthLayout>
                <div style={{width: "100%", maxWidth: "420px"}}>
                    <div style={{background: "#eeebeb", border: "2px solid #1c1c1c", padding: "36px 32px"}}>

                        {/* Create Mobile Friendly Logo */}
                        <div className="md:hidden text-center mb-6">
                            <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 900, fontSize: "22px", color: "#1c1c1c" }}>
                                VeriNews AI 
                            </span>
                        </div>

                        {/* Create Header */}
                        <div style={{borderBottom: "3px double #1c1c1c", paddingBottom: "14px", marginBottom: "20px"}}>
                            <h2 style={{fontFamily: "'Playfair Display', Georgia, serif", textAlign: "center", fontWeight: 700, fontSize: "26px", color: "#000000", lineHeight: 1.1}}>
                                Verify your E-Mail
                            </h2>
                            <p style={{fontFamily: "'Libre Baskerville', Georgia, serif", textAlign: "center", fontSize: "15px", color: "#000000", marginTop: "10px"}}>
                                Enter the 6-digit verification code sent to <strong>{email}</strong>
                            </p>
                        </div>

                        {error && (
                            <div style={{
                                background: "rgba(139, 0, 0, 0.06)",
                                border: "1px solid #8b0000",
                                fontFamily: "'Libre Baskerville', Georgia, serif",
                                fontSize: "13px",
                                padding: "10px 14px",
                                marginBottom: "20px",
                            }}>
                                {error}
                            </div>
                        )}

                        {success && (
                            <div style={{background: "rgba(26,77,26,0.08)", border: "1px solid #1a4d1a", color: "#1a4d1a", fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: "13px", padding: "10px 14px", marginBottom: "20px"}}>
                                {success}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} style={{display: "flex", flexDirection: "column", gap: "16px"}}>
                            <div>
                                <label style={{display: "block", fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: "#000000", marginBottom: "6px"}}>
                                    Verification Code
                                </label>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={6}
                                    placeholder="E.g 124568"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                                    onFocus={handleFocus}
                                    onBlur={handleBlur}
                                    required
                                    style={{
                                        background: "#ffffff",
                                        border: "1px solid #1c1c1c",
                                        color: "#1c1c1c",
                                        fontFamily: "'Libre Baskerville', Georgia, serif",
                                        fontSize: "17px",
                                        outline: "none",
                                        width: "100%",
                                        padding: "10px 10px",
                                        letterSpacing: "0.3em",
                                        textAlign: "center"
                                    }}
                                />
                            </div>

                            <button type="submit" style={{
                                background: "#1c1c1c",
                                color: "#ffffff",
                                border: "1px solid #1c1c1c",
                                padding: "12px",
                                fontFamily: "'Libre Baskerville', Georgia, serif",
                                fontSize: "12px",
                                letterSpacing: "0.12em",
                                textTransform: "uppercase",
                                fontWeight: 700,
                                cursor: "pointer",
                                width: "100%",
                            }}>
                                Verify E-Mail
                            </button>
                        </form>

                        <div style={{textAlign: "center", marginTop: "20px"}}>
                            <p style={{fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: "12px", color: "#000000", marginBottom: "8px"}}>
                                Didn't receive a code?
                            </p>
                            <button
                                onClick={handleResend}
                                disabled={resendLoading}
                                style={{
                                    background: "transparent",
                                    border: "1px solid #1c1c1c",
                                    color: "#1c1c1c",
                                    fontFamily: "'Libre Baskerville', Georgia, serif",
                                    fontSize: "11px",
                                    letterSpacing: "0.1em",
                                    textTransform: "uppercase",
                                    padding: "8px 16px",
                                    cursor: resendLoading ? "not-allowed" : "pointer",
                                    opacity: resendLoading ? 0.6 : 1
                                }}
                            >
                                {resendLoading ? "Sending..." : "Resend Code"}
                            </button>
                        </div>

                        <p style={{fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: "12px", color: "#000000", textAlign: "center", marginTop: "24px"}}>
                            <a href="/login" style={{color: "#8b0000", textDecoration: "underline"}}>Back to Sign In</a>
                        </p>
                    </div>
                </div>
            </AuthLayout>
        </>
    )
}

export default VerifyEmail;
