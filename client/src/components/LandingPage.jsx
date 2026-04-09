import { useNavigate } from "react-router-dom";
import AppNav from "./ui/AppNav";
import Typewriter from 'typewriter-effect';
import { ClipboardCheck, FileSearch2Icon, Loader, MessageSquareText, Newspaper, ShieldCheck } from "lucide-react";
import GitHubIcon from '@mui/icons-material/GitHub'; 
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import ComputerIcon from '@mui/icons-material/Computer';
import CountUp from 'react-countup';
import { useEffect, useState} from "react";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

const Info = () => {
    
    const navigate = useNavigate();
    const { user } = useAuth();

    return (
        <>
            <section className="max-w-5xl mx-auto px-6 pt-44 pb-16 text-center">
                <div style={{ letterSpacing: "0.1em", fontSize: "22px "}}>
                    <Typewriter
                        options={{
                        strings: ["Welcome to VeriNews AI.", "An Application to Flag Misleading Information.", "An Application Designed for Truthfulness.", "Because You Deserve to Know the Truth."],
                        autoStart: true,
                        loop: true,
                        delay: 60,
                        deleteSpeed: 20
                    }}
                />
                </div>

                <div style={{borderTop: "4px solid #1c1c1c", borderBottom: "1px solid #1c1c1c", paddingTop: "16px", paddingBottom: "16px", marginBottom: "16px", marginTop: "16px"}}>
                    <h1 style={{fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(42px, 7vw, 80px)", lineHeight: 1.05, color: "#1c1c1c", letterSpacing: "-0.01em"}}>
                        Are You Reading Facts
                        <br/>
                        <em style={{color: "#b31212"}}> Or Fiction?</em>
                    </h1>
                </div>

                <p style={{fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: "17px", lineHeight: 1.7, margin: "0 auto 28px"}}>
                   VeriNews AI allows users to check the validity of news articles using our fine-tuned AI model. The model can predict whether an article is real or fake, provide confidence scores,
                   and generate a human-readable explanation. The system also accepts user feedback in the cases where the model's predictions are incorrect.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4" style={{marginBottom: "30px"}}>
                    <button
                        onClick={() => navigate(user ? "/analyze" : "/register")}
                        className="flex items-center gap-2 px-8 py-3 font-semibold"
                        style={{background: "#1c1c1c", color: "#fefdfb", border: "2px solid #1c1c1c", cursor: "pointer", fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: "14px", letterSpacing: "0.08em", textTransform: "uppercase"}}
                    >  
                        <FileSearch2Icon className="w-4 h-4"/>
                        {user ? "Analyze Article" : "Start Analyzing for Free"}
                        
                    </button>

                    <a href="#how-it-works" className="flex items-center gap-2 px-8 py-3 font-semibold" style={{color: "#4a4440", border: "2px solid #4a4440", fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: "14px", letterSpacing: "0.08em", textTransform: "uppercase"}}>
                            How does it work?
                    </a>

                </div>
                
            </section>
        </>
       
    )
}

const Stats = () => {

    const [totalAnalyses, setTotalAnalyses] = useState(0);
    const [totalUsers, setTotalUsers] = useState(0);

    useEffect(() => {
        API.get("/analysis/stats").then(res => setTotalAnalyses(res.data.totalAnalyses)).catch(() => {})
    }, [])

    useEffect(() => {
        API.get("/user/stats").then(res => setTotalUsers(res.data.totalUsers)).catch(() => {})
    }, [])
    
    const statsInfo = [{value: 92, label: "Model Detection Accuracy", suffix: "%"}, 
                       {value: totalAnalyses, label: "Articles Analyzed", suffix: ""},
                       {value: totalUsers, label: "Users seeking the Truth", suffix: ""}
                     ];

    return (
         <section className="mx-6 md:mx-auto max-w-4xl mb-20" style={{ borderTop: "3px double #1c1c1c", borderBottom: "3px double #1c1c1c" }}>
            <div className="grid grid-cols-3 divide-x py-8 text-center" style={{ borderColor: "#1c1c1c" }}>
                {statsInfo.map(({value, label, suffix}) => (
                    <div key={label} className="px-6">
                    <p style={{fontFamily: "'Playfair Display', Georgia, seif", fontWeight: 900, fontSize: "40px", color: "#b31212", lineHeight: 1}}>
                        <CountUp end={value} duration={5} separator="," />
                        {suffix}
                    </p>
                    <p style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: "12px", letterSpacing: "0.1em", textTransform: "uppercase", color: "#4a4440", marginTop: "6px" }}>
                        {label}
                    </p>
                    </div>
                ))}
            </div>
        </section>
    )
   
};

const Features = () => {

    const features = [{icon: <FileSearch2Icon className="w-11 h-11" style={{color: "#b31212"}}/>,
                      title: "AI-Powered Analysis",
                      description: "Our fine-tuned AI model processes emotional patterns, lingusitic tones and specific details to flag misinformation you might miss."},
                      {icon: <ShieldCheck className="w-11 h-11" style={{color: "#b31212"}}/>,
                       title: "Confidence Scoring",
                       description: "Every Analysis receives a confdience score on a scale of 0-100 with the option to list the top contributing factors."},
                      {icon: <MessageSquareText className="w-11 h-11" style={{color: "#b31212"}}/>,
                       title: "Explainable Results",
                       description: "Analyses are not just limited to a prediction. Our platform allows users the choice to get a human-readable explanation for the model's reasoning."},
                    ];

    return (
    <section id="features" className="max-w-5xl mx-auto px-15 mb-14">
        <div className="text-center mb-10" style={{borderTop: "3px double #1c1c1c", marginTop: "4px", paddingTop: "4px", borderBottom: "1px solid #1c1c1c", paddingBottom: "8px"}}>
            <p style={{fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: "18px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#b31212"}}>Features</p>
            <h2 style={{fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, fontSize: "30px", color: "#1c1c1c", marginTop: "6px"}}>Everything Needed to Get the <em>Truth</em></h2>
        </div>

        <div className="grid grid-cols-3 divide-x py-8 text-center" style={{ borderColor: "#1c1c1c" }}>
            {features.map(({icon, title, description}, i) => (
                <div
                    key={title}
                    className="p-6"
                    style={{
                        border: "1px solid #1c1c1c",
                        borderLeft: i === 0 ? "1px solid #1c1c1c" : "none",
                        background: "#eeebeb"
                    }}
                >
                    <div className="flex justify-center mb-4">{icon}</div>
                        <h3 style={{fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, fontSize: "18px", color: "#1c1c1c", marginBottom: "8px"}}>{title}</h3>
                        <p style={{fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: "13px", lineHeight: 1.7, color: "#4a4440"}}>{description}</p>
                    </div>
            ))}
        </div>

    </section>
    )
}

const HowItWorks = () => {

    const instructions = [{icon: <Newspaper className="w-11 h-11" style={{color: "#b31212"}}/>, title: "1. Paste Article", description: "Copy and paste any news article, headline or block of text into the analyzer."},
                          {icon: <Loader className="w-11 h-11" style={{color: "#b31212"}}/>, title: "2. AI Processes It", description: "The model analyzes emotional language, tone, factual consistency, and more."},
                          {icon: <ClipboardCheck className="w-11 h-11" style={{color: "#b31212"}}/>, title: "3. Get Your Results", description: "Receive a confidence score, key flags, and a human-readable explanation."}
                        ]


    return (
        <section id="how-it-works" className="max-w-5xl mx-auto px-15 mb-24">
            <div className="text-center mb-10" style={{borderTop: "3px double #1c1c1c", marginTop: "4px", paddingTop: "4px", borderBottom: "1px solid #1c1c1c", paddingBottom: "8px"}}>
                <p style={{fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: "18px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#b31212"}}>How does it Work?</p>
                <h2 style={{fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, fontSize: "30px", color: "#1c1c1c", marginTop: "6px"}}>Three Steps to the <em>Truth</em></h2>
            </div>
            <div className="grid md:grid-cols-3 gap-0">
                {instructions.map(({icon, title, description}, i) => (
                    <div
                        key={title}
                        className="p-8 text-center"
                        style={{
                            border: "1px solid #1c1c1c",
                            borderLeft: i === 0 ? "1px solid #1c1c1c" : "none",
                            background: "#eeebeb"
                        }}
                    >
                
                        <div className="flex justify-center mb-4">{icon}</div>
                        <h3 style={{fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, fontSize: "18px", color: "#1c1c1c", marginBottom: "8px"}}>{title}</h3>
                        <p style={{fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: "13px", lineHeight: 1.7, color: "#4a4440"}}>{description}</p>
                    
                    </div>
                ))}
            </div>
        </section>
    )
}

const Footer = () => {

    return (
        <footer className="text-center py-6" style={{borderTop: "3px double #1c1c1c", fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: "12px", color:"#7a7570", letterSpacing: "0.05em"}}>
            &copy; {new Date().getFullYear()} VeriNews AI 
            <a href="https://github.com/mohammadikhan/fake-news-detector" style={{marginLeft: "20px"}}>
                <GitHubIcon/>
            </a>
            <a href="https://www.linkedin.com/in/mohammad-khan-888a691b8" style={{marginLeft: "20px"}}>
                <LinkedInIcon/>
            </a>
             <a href="https://www.instagram.com/mohammad_ikhan" style={{marginLeft: "20px"}}>
                <InstagramIcon/>
            </a>
            <a href="https://mohammad-portfolio-website.vercel.app" style={{marginLeft: "20px"}}>
                <ComputerIcon/>
            </a>
        </footer>
    )
}

const LandingPage = () => {

    return (
        <div className="min-h-screen" style={{background: "#fefdfb"}}>
            <AppNav/>
            <Info/>
            <Stats/>
            <Features/>
            <HowItWorks/>
            <Footer/>
        </div>
        
    )
}


export default LandingPage;
