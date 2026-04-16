import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import AuthLayout from "./ui/AuthLayout";
import { useAuth } from "../context/AuthContext";

const Login = () => {

    const [form, setForm] = useState({email: "", passwordHash: ""});
    const [error, setError] = useState("");
    const {setUser} = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => setForm({...form, [e.target.name]: e.target.value});
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await API.post("/auth/login", form);
            setUser(res.data.user);
            navigate("/");
        } catch (err) {
            const data = err.response?.data;
            if (data?.needsVerification) {
                navigate("/verify", { state: {email: form.email }});
                return;
            }

            setError(data?.error || "[ERROR]: Login Failed. Try again");
        }
    }

    const handleFocus = (e) => {
        e.target.style.borderColor = "#8b0000"; e.target.style.boxShadow = "0 0 0 2px rgba(139, 0, 0, 0.1)"
    }

    const handleBlur = (e) => {
        e.target.style.borderColor = "#1c1c1c"; e.target.style.boxShadow = "none";
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
                                Welcome Back!
                            </h2>
                            <p style={{fontFamily: "'Libre Baskerville', Georgia, serif", textAlign: "center", fontSize: "15px", color: "#000000", marginTop: "10px"}}>
                                Sign In
                            </p>
                        </div>

                        {error && (
                            <div style={{
                                background: "rgba(139, 0, 0, 0.06)",
                                border: "1px solid #8b0000",
                                fontFamily: "'Libre Baskerville', Georgia, serif",
                                fontSize: "14px",
                                padding: "10px 14px",
                                marginBottom: "20px",
                            }}>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} style={{display: "flex", flexDirection: "column", gap: "16px"}}>
                            <div>
                                <label style={{display: "block", fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: "13px", letterSpacing: "0.1em", textTransform: "uppercase", color: "#000000", marginBottom: "6px"}}>
                                    E-Mail
                                </label>

                                <input
                                    type="email"
                                    name="email"
                                    placeholder="your@email.com"
                                    value={form.email}
                                    onChange={handleChange}
                                    onFocus={handleFocus}
                                    onBlur={handleBlur}
                                    required
                                    style={{
                                        background: "#ffffff",
                                        border: "1px solid #1c1c1c",
                                        color: "#1c1c1c",
                                        fontFamily: "'Libre Baskerville', Georgia, serif",
                                        fontSize: "15px",
                                        outline: "none",
                                        width: "100%",
                                        padding: "10px 10px"
                                    }}
                                />
                            </div>
                            <div>
                                <label style={{display: "block", fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: "13px", letterSpacing: "0.1em", textTransform: "uppercase", color: "#000000", marginBottom: "6px"}}>
                                    Password
                                </label>
                                <input
                                    type="password"
                                    name="passwordHash"
                                    placeholder="••••••••"
                                    value={form.passwordHash}
                                    onChange={handleChange}
                                    onFocus={handleFocus}
                                    onBlur={handleBlur}
                                    required
                                    style={{
                                        background: "#ffffff",
                                        border: "1px solid #1c1c1c",
                                        color: "#1c1c1c",
                                        fontFamily: "'Libre Baskerville', Georgia, serif",
                                        fontSize: "15px",
                                        outline: "none",
                                        width: "100%",
                                        padding: "10px 10px"
                                    }}
                                />
                            </div>
                            {/* <div>
                                TODO: Forgot Password?
                            </div> */}

                            <button
                                type="submit"
                                style={{
                                    background: "#1c1c1c",
                                    color: "#ffffff",
                                    border: "1px solid #1c1c1c",
                                    padding: "12px",
                                    fontFamily: "'Libre Baskerville', Georgia, serif",
                                    fontSize: "14px",
                                    letterSpacing: "0.12em",
                                    textTransform: "uppercase",
                                    fontWeight: 700,
                                    cursor: "pointer",
                                    width: "100%",
                                }}
                            >
                                Sign In
                            </button>
                        </form>

                        <p style={{fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: "13px", color: "#000000", textAlign: "center", marginTop: "24px"}}>
                            Don't have an Account? <br/>
                              <a href="/register" style={{color: "#8b0000", textDecoration: "underline"}}>Register</a>
                        </p>
                    </div>
                </div>
            </AuthLayout>
        </>
    )
}

export default Login;
