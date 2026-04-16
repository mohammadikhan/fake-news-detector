import { useNavigate, useLocation } from "react-router-dom";
import API from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { ShieldAlert, History, MessageSquareMore, FileSearch, LogOut } from "lucide-react";

const AppNav = () => {

    const navigate = useNavigate();
    const { pathname } = useLocation();
    const { user, setUser } = useAuth();

    const handleLogout = async () => {
        try {
            await API.post("/auth/logout");
            setUser(null);
            navigate("/");
        } catch {
            setUser(null);
            navigate("/");
        }
    };

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 z-50" style={{background: "#fefdfb", borderBottom: `3px double #1c1c1c`}}>
                <div
                    className="flex items-center justify-between px-8 py-1"
                    style={{borderBottom: `1px solid #1c1c1c`, fontSize: "13px", fontFamily: "'Libre Baskerville', Georgia, serif", color: "#4a4440"}}
                >
                    <span>Latest Edition</span>
                    <span style={{letterSpacing: "0.1em" }}>THE TRUTHFUL TIMES</span>
                    <span>{new Date().toLocaleDateString("en-US", {weekday: "long", year: "numeric", month: "long", day: "numeric"})}</span>
                </div>

                {/* Main Naviagation Row */}
                <div className="flex items-center justify-between px-8 py-3">
                    {/* Create VeriNews Logo */}
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")} style={{fontFamily: "'Playfair Display', Georgia, serif"}}>
                        <ShieldAlert className="w-7 h-7" style={{color: "#8b0000"}}/>
                        <span style={{fontSize: "22px", fontWeight: 900, letterSpacing: "-0.02em", color: "#1c1c1c"}}>
                            VeriNews AI
                        </span>
                    </div>

                    {/* Create Navigation Links */}
                    <div className="hidden md:flex items-center gap-8" style={{fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: "14px", letterSpacing: "0.05em", textTransform: "uppercase"}}>
                        {user ? (
                            <>
                                {[
                                  {label: "Analysis History", path: "/history", icon: History},
                                  {label: "Feedback History", path: "/feedback-history", icon: MessageSquareMore},
                                  {label: "Analyze", path: "/analyze", icon: FileSearch},
                                ].map(({label, path, icon: Icon}) => (
                                    <button
                                        key={path}
                                        onClick={() => navigate(path)}
                                        title={label}
                                        style={{background: "transparent", border: "none", borderBottom: pathname === path ? `2px solid #1c1c1c` : "2px solid transparent", color: pathname === path ? "#1c1c1c" : "#7a7570", cursor: "pointer", padding: "4px 2px", display: "flex", alignItems: "center"}}
                                    >
                                        <Icon style={{width: "16px", height: "16px"}}/>

                                    </button>
                                ))}
                            </>
                        ) : (
                            <>
                            {/* Display Instrcuction Navigation Links when User is not logged in */}
                            {["Features", "How It Works"].map((item) => (
                                <a key={item} href={`/#${item.toLowerCase().replace(/\s+/g, "-")}`} style={{color: "#4a4440", textDecoration: "none"}} 
                                onMouseEnter={e => e.target.style.color = "#1c1c1c"} onMouseLeave={e => e.target.style.color = "#4a4440"}>
                                    {item}
                                </a>
                            ))}
                            </>
                        )}
                    </div>
                    {/* Right Side of Navigation Link */}
                    <div className="flex items-center gap-3" style={{fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: "14px"}}>
                        {user ? (
                            <>
                                <span style={{color: "#7a7570"}}>{user.name?.split(" ")[0]}</span>
                                <button onClick={handleLogout} className="flex items-center gap-1.5 px-3 py-1.5" style={{background: "transparent", color: "#7a7570", border: "1px solid #7a7570", cursor: "pointer", fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: "13px"}}>
                                    <LogOut className="w-3.5 h-3.5"/>
                                     Sign Out

                                </button>
                            </>
                        ) : (
                            <>
                            <button onClick={() => navigate("/login")}
                                style={{
                                    background: "transparent",
                                    color: "#4a4440",
                                    border: "none",
                                    cursor: "pointer",
                                    fontFamily: "'Libre Baskerville', Georgia, serif",
                                    letterSpacing: "0.05em",
                                    textTransform: "uppercase",
                                }}
                            >
                                Sign In
                            </button>
                            <button onClick={() => navigate("/register")} style={{background: "#1c1c1c", color: "#fefdfb", border: "1px solid #1c1c1c", cursor: "pointer", fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: "13px", letterSpacing: "0.05em", textTransform: "uppercase", padding: "6px 16px"}}>
                                Get Started
                            </button>
                        </>
                    )}

                </div>

            </div>
        </nav>
        </>
    );

}

export default AppNav;