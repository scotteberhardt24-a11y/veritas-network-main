
"use client";
import { useState } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import TopBar from "@/components/topbar/TopBar";
import { VeritasVerifiedBadge, VeritasEmblem, ALL_BADGES, NewMemberBadge, YearVerifiedBadge, Jobs50Badge, FirstEscrowBadge } from "@/components/badges/VeritasBadges";
import { TrendingUp, Shield, Clock, Star, Award, ChevronRight, CheckCircle2, AlertCircle, Zap } from "lucide-react";

const HISTORY = [
  { date:"Jun 14", event:"5-star review received",     change:+8,  score:845, from:"TechVentures" },
  { date:"Jun 8",  event:"Milestone delivered on time", change:+5,  score:837, from:"Job JB-4501" },
  { date:"May 28", event:"Identity re-verified",        change:+12, score:832, from:"KYC Update" },
  { date:"May 20", event:"30-day activity streak",      change:+3,  score:820, from:"Platform" },
  { date:"May 15", event:"Job completed — 5 stars",     change:+10, score:817, from:"Bloom Health" },
  { date:"May 3",  event:"Response time improved",      change:+2,  score:807, from:"Auto" },
];

const FACTORS = [
  { label:"On-Time Delivery",    weight:25, score:98, icon:<Clock size={16}/>,    tip:"Deliver jobs before or on the agreed deadline." },
  { label:"Client Ratings",      weight:25, score:96, icon:<Star size={16}/>,     tip:"5-star ratings from verified clients carry the most weight." },
  { label:"Verification Level",  weight:20, score:90, icon:<Shield size={16}/>,   tip:"Complete ID, phone, and skills verification for maximum points." },
  { label:"Dispute History",     weight:15, score:100,icon:<Award size={16}/>,    tip:"Zero disputes keeps this at maximum. One dispute drops ~15 pts." },
  { label:"Platform Activity",   weight:10, score:88, icon:<TrendingUp size={16}/>,tip:"Log in and respond to messages daily. Streaks add bonus points." },
  { label:"Referral Quality",    weight:5,  score:72, icon:<Zap size={16}/>,      tip:"Refer workers who earn $500+ for maximum referral score." },
];

export default function TrustScorePage() {
  const [tab, setTab] = useState("breakdown");
  const score = 845;

  const r = 70; const circ = 2 * Math.PI * r;
  const pct = score / 1000;
  const offset = circ - pct * circ;

  return (
    <div style={{display:"flex",minHeight:"100vh",background:"#010812"}}>
      <Sidebar/>
      <div style={{flex:1,display:"flex",flexDirection:"column"}}>
        <TopBar/>
        <main style={{flex:1,overflowY:"auto",padding:24,color:"white"}}>

          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:24}}>
            <VeritasEmblem size={40}/>
            <h1 style={{fontSize:"1.8rem",fontWeight:900,margin:0}}>Trust Score</h1>
          </div>

          {/* Hero score card */}
          <div style={{background:"linear-gradient(135deg,rgba(4,15,36,0.98),rgba(6,18,41,0.96))",border:"1px solid rgba(26,107,255,0.2)",borderRadius:20,padding:28,marginBottom:20,display:"flex",flexWrap:"wrap",gap:28,alignItems:"center"}}>
            {/* SVG ring */}
            <div style={{position:"relative",flexShrink:0}}>
              <svg width={170} height={170} viewBox="0 0 170 170">
                <circle cx={85} cy={85} r={r} fill="none" stroke="rgba(26,107,255,0.1)" strokeWidth={10}/>
                <circle cx={85} cy={85} r={r} fill="none" stroke="url(#scoreGrad)" strokeWidth={10}
                  strokeDasharray={circ} strokeDashoffset={offset}
                  strokeLinecap="round" transform="rotate(-90 85 85)"/>
                <defs>
                  <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#1a6bff"/><stop offset="100%" stopColor="#00e676"/>
                  </linearGradient>
                </defs>
                <text x="85" y="80" textAnchor="middle" fontSize="32" fontWeight="900" fill="#00e676">{score}</text>
                <text x="85" y="99" textAnchor="middle" fontSize="11" fontWeight="700" fill="rgba(0,230,118,0.7)">EXCELLENT</text>
                <text x="85" y="114" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.3)">of 1000</text>
              </svg>
            </div>

            <div style={{flex:1}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                <span style={{fontSize:"1.1rem",fontWeight:900}}>Scott Eberhardt</span>
                <div style={{fontSize:"0.62rem",padding:"3px 10px",background:"rgba(26,107,255,0.1)",border:"1px solid rgba(26,107,255,0.25)",borderRadius:20,color:"#4da6ff",fontWeight:800,letterSpacing:"0.06em"}}>VERITAS VERIFIED</div>
              </div>
              <div style={{color:"rgba(255,255,255,0.45)",fontSize:"0.82rem",marginBottom:16}}>Top 3% of all verified workers globally</div>

              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:16}}>
                {[["#127","Global Rank","text-yellow-400"],["Top 3%","Percentile","#00e676"],["↑ +28","This Month","#4da6ff"]].map(([v,l,c],i)=>(
                  <div key={i} style={{textAlign:"center",padding:"10px",background:"rgba(26,107,255,0.06)",border:"1px solid rgba(26,107,255,0.12)",borderRadius:10}}>
                    <div style={{fontSize:"1.1rem",fontWeight:900,color:c,lineHeight:1}}>{v}</div>
                    <div style={{fontSize:"0.62rem",color:"rgba(255,255,255,0.38)",marginTop:3}}>{l}</div>
                  </div>
                ))}
              </div>

              {/* Next milestone */}
              <div style={{padding:"10px 14px",background:"rgba(240,192,64,0.08)",border:"1px solid rgba(240,192,64,0.2)",borderRadius:10}}>
                <div style={{fontSize:"0.68rem",fontWeight:700,color:"#f0c040",marginBottom:4,letterSpacing:"0.06em"}}>⚡ NEXT MILESTONE</div>
                <div style={{fontSize:"0.85rem",color:"rgba(255,255,255,0.7)"}}>
                  <strong style={{color:"white"}}>155 more points</strong> to reach <strong style={{color:"#f0c040"}}>Elite 1000</strong> status and unlock exclusive benefits.
                </div>
                <div style={{marginTop:8,height:4,background:"rgba(26,107,255,0.1)",borderRadius:2,overflow:"hidden"}}>
                  <div style={{width:`${(score/1000)*100}%`,height:"100%",background:"linear-gradient(90deg,#1a6bff,#00e676)",borderRadius:2}}/>
                </div>
              </div>
            </div>

            {/* Main badge */}
            <div style={{flexShrink:0}}>
              <VeritasVerifiedBadge score={score} size={160}/>
            </div>
          </div>

          {/* Tabs */}
          <div style={{display:"flex",gap:2,marginBottom:20,borderBottom:"1px solid rgba(26,107,255,0.1)"}}>
            {[["breakdown","📊 Breakdown"],["history","📈 History"],["tips","💡 Improve"],["badges","🏅 Badges"]].map(([t,l])=>(
              <button key={t} onClick={()=>setTab(t)} style={{padding:"10px 18px",fontSize:"0.85rem",fontWeight:600,border:"none",background:"transparent",cursor:"pointer",color:tab===t?"#4da6ff":"rgba(255,255,255,0.4)",borderBottom:tab===t?"2px solid #1a6bff":"2px solid transparent",marginBottom:-1}}>{l}</button>
            ))}
          </div>

          {/* BREAKDOWN */}
          {tab==="breakdown"&&(
            <div style={{maxWidth:660,display:"flex",flexDirection:"column",gap:12}}>
              {FACTORS.map((f,i)=>{
                const contrib = Math.round(f.weight * f.score / 100);
                return(
                  <div key={i} style={{background:"rgba(4,15,36,0.8)",border:"1px solid rgba(26,107,255,0.12)",borderRadius:14,padding:"16px 20px"}}>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        <span style={{color:"#4da6ff"}}>{f.icon}</span>
                        <span style={{fontWeight:700,fontSize:"0.92rem"}}>{f.label}</span>
                        <span style={{fontSize:"0.62rem",color:"rgba(255,255,255,0.35)"}}>({f.weight}% weight)</span>
                      </div>
                      <div style={{textAlign:"right"}}>
                        <span style={{fontWeight:900,fontSize:"1rem",color:"#00e676"}}>{f.score}/100</span>
                        <span style={{fontSize:"0.65rem",color:"rgba(255,255,255,0.35)",marginLeft:6}}>+{contrib} pts</span>
                      </div>
                    </div>
                    <div style={{height:6,background:"rgba(26,107,255,0.1)",borderRadius:3,overflow:"hidden",marginBottom:8}}>
                      <div style={{width:`${f.score}%`,height:"100%",background:f.score>=95?"#00e676":f.score>=80?"#1a6bff":"#f0c040",borderRadius:3,transition:"width 0.8s ease"}}/>
                    </div>
                    <div style={{fontSize:"0.72rem",color:"rgba(255,255,255,0.38)"}}>{f.tip}</div>
                  </div>
                );
              })}
            </div>
          )}

          {/* HISTORY */}
          {tab==="history"&&(
            <div style={{maxWidth:580,background:"rgba(4,15,36,0.8)",border:"1px solid rgba(26,107,255,0.12)",borderRadius:16,overflow:"hidden"}}>
              {HISTORY.map((h,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:14,padding:"14px 20px",borderBottom:"1px solid rgba(26,107,255,0.07)"}}>
                  <div style={{width:40,height:40,borderRadius:10,background:"rgba(0,200,83,0.1)",border:"1px solid rgba(0,200,83,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.1rem",flexShrink:0}}>
                    {h.change>10?"🏆":h.change>5?"⭐":"✅"}
                  </div>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:600,fontSize:"0.88rem",marginBottom:2}}>{h.event}</div>
                    <div style={{fontSize:"0.68rem",color:"rgba(255,255,255,0.38)"}}>{h.from} · {h.date}</div>
                  </div>
                  <div style={{textAlign:"right",flexShrink:0}}>
                    <div style={{fontWeight:900,color:"#00e676",fontSize:"0.95rem"}}>+{h.change} pts</div>
                    <div style={{fontSize:"0.68rem",color:"rgba(255,255,255,0.38)"}}>Score: {h.score}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TIPS */}
          {tab==="tips"&&(
            <div style={{maxWidth:640,display:"flex",flexDirection:"column",gap:10}}>
              {[
                {pts:"+50",title:"Complete skills assessment",desc:"Take the verified skills test for your top skill. Adds 50 points and a skill badge.",urgent:true,cta:"Take Test"},
                {pts:"+25",title:"Request client reviews",desc:"You have 3 recent jobs with no review. Send a review request to each client.",urgent:true,cta:"Send Requests"},
                {pts:"+15",title:"Improve response time",desc:"Your avg response time is 6h. Drop below 2h for a consistent score boost.",urgent:false,cta:"See Tips"},
                {pts:"+12",title:"Add a portfolio project",desc:"Profiles with 3+ portfolio items get 40% more proposals viewed.",urgent:false,cta:"Add Project"},
                {pts:"+10",title:"Maintain your streak",desc:"You're on a 14-day streak. Hit 30 days for the streak badge and bonus points.",urgent:false,cta:"View Streak"},
              ].map((tip,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:14,padding:"16px 18px",background:tip.urgent?"rgba(240,192,64,0.06)":"rgba(4,15,36,0.8)",border:`1px solid ${tip.urgent?"rgba(240,192,64,0.2)":"rgba(26,107,255,0.1)"}`,borderRadius:14}}>
                  <div style={{width:44,height:44,borderRadius:10,background:tip.urgent?"rgba(240,192,64,0.12)":"rgba(26,107,255,0.08)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <span style={{fontSize:"1rem",fontWeight:900,color:tip.urgent?"#f0c040":"#00e676"}}>{tip.pts}</span>
                  </div>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:700,fontSize:"0.9rem",marginBottom:3,display:"flex",alignItems:"center",gap:6}}>
                      {tip.title}{tip.urgent&&<span style={{fontSize:"0.58rem",padding:"2px 6px",background:"rgba(240,192,64,0.15)",border:"1px solid rgba(240,192,64,0.3)",borderRadius:4,color:"#f0c040",fontWeight:800}}>QUICK WIN</span>}
                    </div>
                    <div style={{fontSize:"0.78rem",color:"rgba(255,255,255,0.45)",lineHeight:1.5}}>{tip.desc}</div>
                  </div>
                  <button style={{padding:"8px 14px",background:"rgba(26,107,255,0.1)",border:"1px solid rgba(26,107,255,0.22)",borderRadius:8,color:"#4da6ff",fontSize:"0.75rem",fontWeight:700,cursor:"pointer",flexShrink:0}}>{tip.cta}</button>
                </div>
              ))}
            </div>
          )}

          {/* BADGES */}
          {tab==="badges"&&(
            <div style={{display:"flex",flexWrap:"wrap",gap:16}}>
              {[NewMemberBadge,YearVerifiedBadge,Jobs50Badge,FirstEscrowBadge].map((Comp,i)=>(
                <div key={i} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6}}>
                  <Comp size={110}/>
                  <div style={{fontSize:"0.62rem",color:"rgba(255,255,255,0.6)",textAlign:"center",maxWidth:100,fontWeight:600}}>
                    {["New Member","1 Year Verified","50 Jobs Done","First Escrow"][i]}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
