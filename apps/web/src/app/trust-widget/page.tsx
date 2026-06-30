
"use client";
import { useState } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import TopBar from "@/components/topbar/TopBar";
import { VeritasVerifiedBadge, VeritasEmblem } from "@/components/badges/VeritasBadges";
import { Shield, TrendingUp, Award, Star, CheckCircle2, Clock, Zap, Copy, CheckCheck, Code2 } from "lucide-react";

const FACTORS = [
  {label:"On-Time Delivery",   score:98, weight:25, icon:"⏰"},
  {label:"Client Ratings",     score:96, weight:25, icon:"⭐"},
  {label:"Verification Level", score:90, weight:20, icon:"🪪"},
  {label:"Dispute History",    score:100,weight:15, icon:"⚖️"},
  {label:"Platform Activity",  score:88, weight:10, icon:"📊"},
  {label:"Referral Quality",   score:72, weight:5,  icon:"🎁"},
];

const HISTORY = [
  {date:"Jun 28",event:"5-star review — TechVentures",change:+8,score:845},
  {date:"Jun 14",event:"Milestone on time",            change:+5,score:837},
  {date:"May 28",event:"Identity re-verified",         change:+12,score:832},
  {date:"May 20",event:"30-day activity streak",       change:+3, score:820},
  {date:"May 15",event:"Job completed — 5★",           change:+10,score:817},
];

export default function TrustScoreWidgetPage() {
  const [copied,setCopied] = useState(false);
  const [tab,setTab]       = useState("breakdown");
  const score = 845;
  const r=68, circ=2*Math.PI*r, pct=score/1000, offset=circ-pct*circ;
  const overall = Math.round(FACTORS.reduce((a,f)=>a+(f.score*f.weight/100),0));

  const EMBED=`<!-- Veritas Trust Score Widget -->
<div id="veritas-score" data-user="scotteberhardt"></div>
<script src="https://veritas.network/widget.js"></script>`;

  function copy(){navigator.clipboard.writeText(EMBED);setCopied(true);setTimeout(()=>setCopied(false),2000);}

  return (
    <div style={{display:"flex",minHeight:"100vh",background:"#010812"}}>
      <Sidebar/>
      <div style={{flex:1,display:"flex",flexDirection:"column"}}>
        <TopBar/>
        <main style={{flex:1,overflowY:"auto",padding:24,color:"white"}}>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:24}}>
            <Shield size={28} color="#1a6bff"/>
            <h1 style={{fontSize:"1.8rem",fontWeight:900,margin:0}}>Trust Score</h1>
          </div>

          {/* Score ring + badge */}
          <div style={{display:"grid",gridTemplateColumns:"1fr auto",gap:20,marginBottom:20,alignItems:"start"}}>
            <div style={{background:"rgba(4,15,36,0.95)",border:"1px solid rgba(26,107,255,0.2)",borderRadius:18,padding:24}}>
              <div style={{display:"flex",alignItems:"center",gap:24,flexWrap:"wrap"}}>
                <div style={{flexShrink:0}}>
                  <svg width={170} height={170} viewBox="0 0 170 170">
                    <circle cx={85} cy={85} r={r} fill="none" stroke="rgba(26,107,255,0.08)" strokeWidth={10}/>
                    <circle cx={85} cy={85} r={r} fill="none" stroke="url(#sg)" strokeWidth={10} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" transform="rotate(-90 85 85)"/>
                    <defs><linearGradient id="sg" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#1a6bff"/><stop offset="100%" stopColor="#00e676"/></linearGradient></defs>
                    <text x="85" y="80" textAnchor="middle" fontSize="32" fontWeight="900" fill="#00e676">{score}</text>
                    <text x="85" y="97" textAnchor="middle" fontSize="11" fontWeight="700" fill="rgba(0,230,118,0.7)">EXCELLENT</text>
                    <text x="85" y="112" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.3)">of 1000</text>
                  </svg>
                </div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:900,fontSize:"1.1rem",marginBottom:4,display:"flex",alignItems:"center",gap:7}}>Scott Eberhardt <div style={{fontSize:"0.62rem",padding:"3px 9px 3px 7px",background:"rgba(26,107,255,0.1)",border:"1px solid rgba(26,107,255,0.25)",borderRadius:14,color:"#4da6ff",fontWeight:800,display:"inline-flex",alignItems:"center",gap:4}}><Shield size={9}/>VERIFIED</div></div>
                  <div style={{color:"rgba(255,255,255,0.45)",fontSize:"0.8rem",marginBottom:14}}>Top 3% of all verified workers globally</div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:14}}>
                    {[["#127","Global Rank","#f0c040"],["Top 3%","Percentile","#00e676"],["↑ +28","This Month","#4da6ff"]].map(([v,l,c],i)=>(
                      <div key={i} style={{textAlign:"center",padding:"9px",background:"rgba(26,107,255,0.06)",border:"1px solid rgba(26,107,255,0.12)",borderRadius:9}}><div style={{fontSize:"1rem",fontWeight:900,color:c,lineHeight:1}}>{v}</div><div style={{fontSize:"0.6rem",color:"rgba(255,255,255,0.35)",marginTop:3}}>{l}</div></div>
                    ))}
                  </div>
                  <div style={{padding:"10px 14px",background:"rgba(240,192,64,0.07)",border:"1px solid rgba(240,192,64,0.18)",borderRadius:10,fontSize:"0.78rem",color:"rgba(255,255,255,0.6)"}}>
                    ⚡ <strong style={{color:"white"}}>155 more points</strong> to reach <strong style={{color:"#f0c040"}}>Elite 1000</strong> status.
                    <div style={{marginTop:6,height:4,background:"rgba(26,107,255,0.08)",borderRadius:2,overflow:"hidden"}}><div style={{width:`${(score/1000)*100}%`,height:"100%",background:"linear-gradient(90deg,#1a6bff,#f0c040)",borderRadius:2}}/></div>
                  </div>
                </div>
              </div>
            </div>
            <VeritasVerifiedBadge score={score} size={155}/>
          </div>

          {/* Tabs */}
          <div style={{display:"flex",gap:2,marginBottom:16,borderBottom:"1px solid rgba(26,107,255,0.1)"}}>
            {[["breakdown","Breakdown"],["history","History"],["embed","Embed Widget"]].map(([t,l])=>(
              <button key={t} onClick={()=>setTab(t)} style={{padding:"10px 18px",fontSize:"0.85rem",fontWeight:600,border:"none",background:"transparent",cursor:"pointer",color:tab===t?"#4da6ff":"rgba(255,255,255,0.4)",borderBottom:tab===t?"2px solid #1a6bff":"2px solid transparent",marginBottom:-1}}>{l}</button>
            ))}
          </div>

          {tab==="breakdown"&&(
            <div style={{maxWidth:640,display:"flex",flexDirection:"column",gap:10}}>
              {FACTORS.map((f,i)=>(
                <div key={i} style={{background:"rgba(4,15,36,0.85)",border:"1px solid rgba(26,107,255,0.1)",borderRadius:13,padding:"15px 18px"}}>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                    <div style={{display:"flex",alignItems:"center",gap:8}}><span>{f.icon}</span><span style={{fontWeight:700,fontSize:"0.9rem"}}>{f.label}</span><span style={{fontSize:"0.62rem",color:"rgba(255,255,255,0.3)"}}>({f.weight}% weight)</span></div>
                    <span style={{fontWeight:900,fontSize:"0.92rem",color:f.score>=95?"#00e676":f.score>=80?"#f0c040":"#ff5555"}}>{f.score}/100</span>
                  </div>
                  <div style={{height:5,background:"rgba(26,107,255,0.08)",borderRadius:3,overflow:"hidden"}}>
                    <div style={{width:`${f.score}%`,height:"100%",background:f.score>=95?"#00e676":f.score>=80?"#1a6bff":"#f0c040",borderRadius:3}}/>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab==="history"&&(
            <div style={{maxWidth:560,background:"rgba(4,15,36,0.85)",border:"1px solid rgba(26,107,255,0.12)",borderRadius:16,overflow:"hidden"}}>
              {HISTORY.map((h,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"13px 18px",borderBottom:"1px solid rgba(26,107,255,0.06)"}}>
                  <div style={{width:36,height:36,borderRadius:9,background:"rgba(0,200,83,0.1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1rem",flexShrink:0}}>{h.change>10?"🏆":"⭐"}</div>
                  <div style={{flex:1}}><div style={{fontWeight:600,fontSize:"0.87rem"}}>{h.event}</div><div style={{fontSize:"0.65rem",color:"rgba(255,255,255,0.35)"}}>{h.date}</div></div>
                  <div style={{textAlign:"right"}}><div style={{fontWeight:900,color:"#00e676",fontSize:"0.9rem"}}>+{h.change} pts</div><div style={{fontSize:"0.65rem",color:"rgba(255,255,255,0.38)"}}>Score: {h.score}</div></div>
                </div>
              ))}
            </div>
          )}

          {tab==="embed"&&(
            <div style={{maxWidth:560}}>
              <div style={{background:"rgba(4,15,36,0.85)",border:"1px solid rgba(26,107,255,0.14)",borderRadius:16,padding:20,marginBottom:14}}>
                <div style={{fontWeight:700,marginBottom:10,display:"flex",alignItems:"center",gap:7}}><Code2 size={15} color="#4da6ff"/>Embed Code</div>
                <div style={{background:"rgba(2,8,20,0.9)",border:"1px solid rgba(26,107,255,0.1)",borderRadius:10,padding:14,marginBottom:10}}>
                  <pre style={{fontFamily:"monospace",fontSize:"0.75rem",color:"rgba(255,255,255,0.7)",lineHeight:1.7,margin:0}}>{EMBED}</pre>
                </div>
                <button onClick={copy} style={{display:"flex",alignItems:"center",gap:6,padding:"9px 16px",background:copied?"rgba(0,200,83,0.12)":"rgba(26,107,255,0.1)",border:`1px solid ${copied?"rgba(0,200,83,0.25)":"rgba(26,107,255,0.22)"}`,borderRadius:9,color:copied?"#00e676":"#4da6ff",fontSize:"0.82rem",fontWeight:700,cursor:"pointer"}}>
                  {copied?<CheckCheck size={14}/>:<Copy size={14}/>}{copied?"Copied!":"Copy Embed Code"}
                </button>
              </div>
              <div style={{padding:14,background:"rgba(26,107,255,0.04)",border:"1px solid rgba(26,107,255,0.12)",borderRadius:12,fontSize:"0.78rem",color:"rgba(255,255,255,0.5)",lineHeight:1.65}}>
                The embed widget automatically updates with your live Trust Score and verified badges. Supports light/dark themes and 3 size variants.
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
