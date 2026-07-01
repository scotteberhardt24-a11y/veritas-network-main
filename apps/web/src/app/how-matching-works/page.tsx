
"use client";
import { useRouter } from "next/navigation";
import { VeritasEmblem } from "@/components/badges/VeritasBadges";
import { Sparkles, Shield, TrendingUp, Zap, BarChart3, ArrowRight, CheckCircle2 } from "lucide-react";

const SIGNALS=[
  {label:"Skill Match",       weight:30,score:97,desc:"Your verified skills align with job requirements",       color:"#4da6ff"},
  {label:"Trust Score",       weight:20,score:94,desc:"Your 845 score is above the 90th percentile",            color:"#00e676"},
  {label:"Past Performance",  weight:20,score:99,desc:"100% on-time delivery over 94 completed jobs",           color:"#00e676"},
  {label:"Rate Compatibility",weight:15,score:88,desc:"Your rate fits within the client's stated budget",       color:"#f0c040"},
  {label:"Availability",      weight:10,score:100,desc:"You are currently available for new projects",          color:"#00e676"},
  {label:"Location Factor",   weight:5, score:72,desc:"Client prefers your time zone overlap",                  color:"#a78bfa"},
];

export default function JobMatchExplainerPage(){
  const router=useRouter();
  const overall=Math.round(SIGNALS.reduce((a,s)=>a+(s.score*s.weight/100),0));

  return(
    <div style={{minHeight:"100vh",background:"#010812",color:"white"}}>
      <nav style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 28px",borderBottom:"1px solid rgba(26,107,255,0.1)",position:"sticky",top:0,background:"rgba(1,8,18,0.97)",backdropFilter:"blur(20px)",zIndex:50}}>
        <div style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer"}} onClick={()=>router.push("/")}>
          <VeritasEmblem size={34}/>
          <div><div style={{fontSize:"1rem",fontWeight:900}}>VERITAS</div><div style={{fontSize:"0.5rem",fontWeight:600,letterSpacing:"0.2em",color:"#00d4ff",textTransform:"uppercase"}}>Truth Becomes Trust</div></div>
        </div>
        <button onClick={()=>router.push("/onboarding")} style={{padding:"9px 18px",borderRadius:9,background:"linear-gradient(135deg,#1a6bff,#0050dd)",border:"none",color:"white",fontSize:"0.82rem",cursor:"pointer",fontWeight:700}}>Get Matched</button>
      </nav>
      <div style={{maxWidth:960,margin:"0 auto",padding:"60px 24px"}}>
        <div style={{textAlign:"center",marginBottom:48}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:8,padding:"7px 16px",background:"rgba(240,192,64,0.08)",border:"1px solid rgba(240,192,64,0.2)",borderRadius:30,fontSize:"0.75rem",color:"#f0c040",fontWeight:600,marginBottom:18}}><Sparkles size={13}/>AI Match Engine</div>
          <h1 style={{fontSize:"2.8rem",fontWeight:900,marginBottom:12}}>How Veritas Matches You to Jobs</h1>
          <p style={{color:"rgba(255,255,255,0.45)",fontSize:"1rem",maxWidth:580,margin:"0 auto",lineHeight:1.7}}>47 signals analyzed in real-time. The result: a transparent match score that tells you exactly why you're a fit.</p>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"300px 1fr",gap:24,marginBottom:48,alignItems:"start"}}>
          <div style={{background:"rgba(4,15,36,0.95)",border:"1px solid rgba(240,192,64,0.22)",borderRadius:20,padding:24,textAlign:"center"}}>
            <svg width={180} height={180} viewBox="0 0 180 180" style={{margin:"0 auto 12px",display:"block"}}>
              <circle cx={90} cy={90} r={76} fill="none" stroke="rgba(26,107,255,0.08)" strokeWidth={14}/>
              <circle cx={90} cy={90} r={76} fill="none" stroke="url(#mg1)" strokeWidth={14} strokeDasharray={2*Math.PI*76} strokeDashoffset={2*Math.PI*76*(1-overall/100)} strokeLinecap="round" transform="rotate(-90 90 90)"/>
              <defs><linearGradient id="mg1" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#f0c040"/><stop offset="100%" stopColor="#00e676"/></linearGradient></defs>
              <text x="90" y="85" textAnchor="middle" fontSize="36" fontWeight="900" fill="#f0c040">{overall}</text>
              <text x="90" y="105" textAnchor="middle" fontSize="13" fontWeight="700" fill="rgba(255,255,255,0.5)">Match Score</text>
            </svg>
            <div style={{fontSize:"0.82rem",color:"rgba(255,255,255,0.5)",lineHeight:1.6}}>You're in the <span style={{color:"#f0c040",fontWeight:700}}>top 6%</span> of candidates for this job type</div>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            {SIGNALS.map((s,i)=>(
              <div key={i} style={{background:"rgba(4,15,36,0.9)",border:"1px solid rgba(26,107,255,0.12)",borderRadius:14,padding:"14px 18px"}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                  <div>
                    <span style={{fontWeight:700,fontSize:"0.9rem"}}>{s.label}</span>
                    <span style={{fontSize:"0.65rem",color:"rgba(255,255,255,0.35)",marginLeft:8}}>({s.weight}% weight)</span>
                  </div>
                  <span style={{fontWeight:900,color:s.score>=90?"#00e676":s.score>=75?"#f0c040":"#ff5555",fontSize:"0.9rem"}}>{s.score}/100</span>
                </div>
                <div style={{height:6,background:"rgba(26,107,255,0.08)",borderRadius:3,overflow:"hidden",marginBottom:5}}>
                  <div style={{width:`${s.score}%`,height:"100%",background:s.color,borderRadius:3}}/>
                </div>
                <div style={{fontSize:"0.72rem",color:"rgba(255,255,255,0.45)"}}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{background:"rgba(4,15,36,0.95)",border:"1px solid rgba(26,107,255,0.18)",borderRadius:20,padding:32,marginBottom:32}}>
          <h2 style={{fontSize:"1.6rem",fontWeight:900,textAlign:"center",marginBottom:24}}>Why This Beats Keyword Matching</h2>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16}}>
            {[{ic:"🤖",t:"AI-Powered",d:"Real ML models trained on 50,000+ successful matches — not just keyword search."},{ic:"🔗",t:"Blockchain-Verified",d:"Every signal is backed by on-chain data that can't be faked or gamed."},{ic:"📈",t:"Self-Improving",d:"Every match outcome feeds back into the model. It gets smarter with every job."}].map((c,i)=>(
              <div key={i} style={{textAlign:"center",padding:18,background:"rgba(26,107,255,0.04)",border:"1px solid rgba(26,107,255,0.1)",borderRadius:14}}>
                <div style={{fontSize:"2rem",marginBottom:10}}>{c.ic}</div>
                <div style={{fontWeight:800,marginBottom:6}}>{c.t}</div>
                <div style={{fontSize:"0.8rem",color:"rgba(255,255,255,0.5)",lineHeight:1.6}}>{c.d}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{textAlign:"center"}}>
          <button onClick={()=>router.push("/onboarding")} style={{display:"inline-flex",alignItems:"center",gap:8,padding:"14px 36px",background:"linear-gradient(135deg,#d4af37,#c9a227,#a07810)",borderRadius:10,border:"none",color:"#0a0800",fontWeight:800,fontSize:"1rem",cursor:"pointer"}}>
            Start Getting Matched <ArrowRight size={20}/>
          </button>
        </div>
      </div>
    </div>
  );
}
