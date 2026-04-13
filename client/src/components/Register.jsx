import AuthLayout from "./ui/AuthLayout";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

const Register = () => {

    const [form, setForm] = useState({name: "", email: "", password: "", confirmPassword: ""});
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => setForm({...form, [e.target.name]: e.target.value});

    const handleSubmit = async(e) => {
        e.preventDefault();
        setError("");
        
        if (form.password !== form.confirmPassword) {
            setError("[ERROR]: Passwords do not match.");
            return;
        }

        try {
            await API.post("/auth/register", {
                name: form.name,
                email: form.email,
                passwordHash: form.password
            });

            navigate("/verify", { state: {email: form.email }});        

        } catch (err) {
            setError(err.response?.data?.error || "[ERROR]: Registration unsuccessful. Please Try Again.");
        }
    }

    const handleFocus = (e) => {
        e.target.style.borderColor = "#8b0000";
        e.target.style.boxShadow = "0 0 0 2px rgba(139, 0, 0, 0.1)";
    }

    const handleBlur = (e) => {
        e.target.style.borderColor = "#1c1c1c";
        e.target.style.boxShadow = "none";
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
                                Create an Account
                            </h2>
                            <p style={{fontFamily: "'Libre Baskerville', Georgia, serif", textAlign: "center", fontSize: "15px", color: "#000000", marginTop: "10px"}}>
                                Fill in the fields below
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

                        <form onSubmit={handleSubmit} style={{display: "flex", flexDirection: "column", gap: "16px"}}>
                            {[{label: "Full Name", name: "name", type: "text", placeholder: "Your Name"},
                              {label: "E-Mail", name: "email", type: "email", placeholder: "your@email.com"},
                              {label: "Password", name: "password", type: "password", placeholder: "••••••••"},
                              {label: "Confirm Password", name: "confirmPassword", type: "password", placeholder: "••••••••"}
                            ].map(({label, name, type, placeholder}) => (
                                <div key={name}>
                                    <label style={{display: "block", fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: "#000000", marginBottom: "6px"}}>
                                        {label}
                                    </label>
                                    <input
                                        type={type}
                                        name={name}
                                        placeholder={placeholder}
                                        value={form[name]}
                                        onChange={handleChange}
                                        onFocus={handleFocus}
                                        onBlur={handleBlur}
                                        required
                                        style={{
                                            background: "#ffffff",
                                            border: "1px solid #1c1c1c",
                                            color: "#1c1c1c",
                                            fontFamily: "'Libre Baskerville', Georgia, serif",
                                            fontSize: "14px",
                                            outline: "none",
                                            width: "100%",
                                            padding: "10px 10px"
                                        }}
                                    />
                                </div>
                            ))}

                            <button
                                type="submit"
                                style={{
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
                                }}
                            >
                                Create Account
                            </button>
                        </form>

                        <p style={{fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: "12px", color: "#000000", textAlign: "center", marginTop: "24px"}}>
                            Already Registered? <br/>
                            <a href="/login" style={{color: "#8b0000", textDecoration: "underline"}}>Sign In</a>
                        </p>
                    </div>
                </div>
            </AuthLayout>
        </>
    )
}

export default Register;
