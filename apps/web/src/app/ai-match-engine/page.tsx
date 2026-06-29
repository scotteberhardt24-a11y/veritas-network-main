
"use client";
import { useState, useEffect } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import TopBar from "@/components/topbar/TopBar";
import { Sparkles, Zap, TrendingUp, Briefcase, Shield, Clock, DollarSign, CheckCircle2, Loader2, RefreshCw, ArrowRight, BarChart3 } from "lucide-react";

const SIGNALS = [
  {label:"Skill Match",       weight:30, score:97, desc:"Next.js, TypeScript, PostgreSQL align perfectly"},
  {label:"Trust Score",       weight:20, score:94, desc:"Your 845 score is above 90th percentile"},
  {label:"Past Performance",  weight:20, score:99, desc:"100% on-time rate over 94 completed jobs"},
  {label:"Rate Compatibility", weight:15, score:88, desc:"Your $150/hr is within client's $120–175 range"},
  {label:"Availability",      weight:10, score:100,desc:"You're currently available for new projects"},
  {label:"Location Factor",   weight:5,  score:72, desc:"Client prefers North American time zones"},
];

const JOBS = [
  {id:"JB-4510",title:"Senior Next.js Developer — SaaS Platform",client:"StartupX Labs",     budget:"$12,000",match:99,skills:["Next.js","TypeScript","Stripe"],urgent:true, deadline:"3d",proposals:4},
  {id:"JB-4509",title:"Full-Stack React + Node API Build",       client:"FinTech Ventures",  budget:"$18,000",match:97,skills:["React","Node.js","PostgreSQL"],urgent:false,deadline:"5d",proposals:7},
  {id:"JB-4508",title:"Next.js E-commerce + Headless CMS",       client:"RetailEdge",        budget:"$8,500", match:95,skills:["Next.js","Contentful","Stripe"],urgent:false,deadline:"7d",proposals:12},
  {id:"JB-4507",title:"React Native Mobile App — Phase 2",       client:"Bloom Health",      budget:"$15,000",match:93,skills:["React Native","Expo","Firebase"],urgent:true, deadline:"2d",proposals:3},
  {id:"JB-4506",title:"Backend API Microservices Architecture",   client:"CloudSync AI",      budget:"$22,000",match:91,skills:["Node.js","Docker","AWS","Redis"],urgent:false,deadline:"10d",proposals:9},
];

export default function AIMatchEnginePage() {
  const [loading, setLoading]   = useState(false);
  const [lastRun, setLastRun]   = useState("2 minutes ago");
  const [applying, setApplying] = useState<string|null>(null);
  const [applied, setApplied]   = useState<string[]>([]);

  const overallScore = Math.round(SIGNALS.reduce((a,s)=>a+(s.score*s.weight/100),0));

  function refresh(){
    setLoading(true);
    setTimeout(()=>{ setLoading(false); setLastRun("just now"); },1400);
  }

  function apply(id:string){
    setApplying(id);
    setTimeout(()=>{ setApplying(null); setApplied(p=>[...p,id]); },1200);
  }

  return (
    <div style={{display:"flex",minHeight:"100vh",background:"#010812"}}>
      <Sidebar/>
      <div style={{flex:1,display:"flex",flexDirection:"column"}}>
        <TopBar/>
        <main style={{flex:1,overflowY:"auto",padding:24,color:"white"}}>

          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24,flexWrap:"wrap",gap:12}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <Sparkles size={28} color="#f0c040"/>
              <div>
                <h1 style={{fontSize:"1.8rem",fontWeight:900,margin:0}}>AI Match Engine</h1>
                <div style={{fontSize:"0.65rem",color:"#00d4ff",letterSpacing:"0.15em",textTransform:"uppercase",marginTop:2}}>Last scanned {lastRun} · 47 signals analyzed</div>
              </div>
            </div>
            <button onClick={refresh} disabled={loading} style={{display:"flex",alignItems:"center",gap:7,padding:"11px 20px",background:"rgba(26,107,255,0.08)",border:"1px solid rgba(26,107,255,0.25)",borderRadius:10,color:"#4da6ff",fontWeight:600,fontSize:"0.88rem",cursor:"pointer"}}>
              {loading?<Loader2 size={16} style={{animation:"spin 1s linear infinite"}}/>:<RefreshCw size={16}/>} Rescan
            </button>
          </div>

          {/* Match Score Overview */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 2fr",gap:16,marginBottom:20}}>
            {/* Score ring */}
            <div style={{background:"rgba(4,15,36,0.95)",border:"1px solid rgba(26,107,255,0.18)",borderRadius:18,padding:24,textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:10}}>
              <svg width={160} height={160} viewBox="0 0 160 160">
                <circle cx={80} cy={80} r={68} fill="none" stroke="rgba(26,107,255,0.08)" strokeWidth={12}/>
                <circle cx={80} cy={80} r={68} fill="none" stroke="url(#mg1)" strokeWidth={12}
                  strokeDasharray={2*Math.PI*68} strokeDashoffset={2*Math.PI*68*(1-overallScore/100)}
                  strokeLinecap="round" transform="rotate(-90 80 80)"/>
                <defs>
                  <linearGradient id="mg1" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#f0c040"/>
                    <stop offset="100%" stopColor="#00e676"/>
                  </linearGradient>
                </defs>
                <text x="80" y="75" textAnchor="middle" fontSize="32" fontWeight="900" fill="#f0c040">{overallScore}</text>
                <text x="80" y="94" textAnchor="middle" fontSize="12" fontWeight="700" fill="rgba(255,255,255,0.5)">Match Score</text>
                <text x="80" y="110" textAnchor="middle" fontSize="10" fill="rgba(255,255,255,0.3)">out of 100</text>
              </svg>
              <div style={{fontSize:"0.82rem",color:"rgba(255,255,255,0.5)",textAlign:"center",lineHeight:1.6}}>
                You're in the <span style={{color:"#f0c040",fontWeight:700}}>top 6%</span> of candidates for your matched job types
              </div>
            </div>

            {/* Signal breakdown */}
            <div style={{background:"rgba(4,15,36,0.9)",border:"1px solid rgba(26,107,255,0.14)",borderRadius:18,padding:22}}>
              <div style={{fontWeight:800,marginBottom:16,fontSize:"0.95rem",display:"flex",alignItems:"center",gap:8}}>
                <BarChart3 size={18} color="#4da6ff"/> Match Signal Breakdown
              </div>
              {SIGNALS.map((s,i)=>(
                <div key={i} style={{marginBottom:12}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <span style={{fontWeight:700,fontSize:"0.85rem"}}>{s.label}</span>
                      <span style={{fontSize:"0.62rem",color:"rgba(255,255,255,0.3)"}}>({s.weight}% weight)</span>
                    </div>
                    <span style={{fontWeight:900,color:s.score>=90?"#00e676":s.score>=75?"#f0c040":"#ff5555",fontSize:"0.88rem"}}>{s.score}/100</span>
                  </div>
                  <div style={{height:5,background:"rgba(26,107,255,0.08)",borderRadius:3,overflow:"hidden",marginBottom:3}}>
                    <div style={{width:`${s.score}%`,height:"100%",borderRadius:3,transition:"width 0.8s",
                      background:s.score>=90?"#00e676":s.score>=75?"#f0c040":"#ff5555"}}/>
                  </div>
                  <div style={{fontSize:"0.67rem",color:"rgba(255,255,255,0.35)"}}>{s.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Matched Jobs */}
          <div style={{fontWeight:800,marginBottom:14,fontSize:"0.95rem",display:"flex",alignItems:"center",gap:8}}>
            <Zap size={18} color="#f0c040"/> Top {JOBS.length} AI Matches
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {JOBS.map(job=>(
              <div key={job.id} style={{background:"rgba(4,15,36,0.9)",border:`1px solid ${job.urgent?"rgba(240,192,64,0.22)":"rgba(26,107,255,0.12)"}`,borderRadius:16,padding:18,display:"flex",alignItems:"center",gap:14,flexWrap:"wrap"}}>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4,flexWrap:"wrap"}}>
                    <span style={{fontWeight:800,fontSize:"0.95rem"}}>{job.title}</span>
                    {job.urgent&&<span style={{fontSize:"0.6rem",padding:"2px 7px",background:"rgba(240,192,64,0.15)",border:"1px solid rgba(240,192,64,0.3)",borderRadius:5,color:"#f0c040",fontWeight:800}}>⚡ URGENT</span>}
                  </div>
                  <div style={{fontSize:"0.75rem",color:"rgba(255,255,255,0.45)",marginBottom:7}}>{job.client} · {job.budget} · Closes in {job.deadline} · {job.proposals} proposals</div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                    {job.skills.map(s=><span key={s} style={{fontSize:"0.65rem",padding:"2px 9px",background:"rgba(26,107,255,0.07)",border:"1px solid rgba(26,107,255,0.15)",borderRadius:5,color:"rgba(255,255,255,0.6)",fontWeight:600}}>{s}</span>)}
                  </div>
                </div>
                <div style={{textAlign:"center",flexShrink:0}}>
                  <div style={{fontSize:"2rem",fontWeight:900,color:"#f0c040",lineHeight:1}}>{job.match}%</div>
                  <div style={{fontSize:"0.6rem",color:"rgba(255,255,255,0.35)"}}>AI Match</div>
                </div>
                {applied.includes(job.id)?(
                  <div style={{display:"flex",alignItems:"center",gap:5,padding:"10px 18px",background:"rgba(0,200,83,0.1)",border:"1px solid rgba(0,200,83,0.2)",borderRadius:9,color:"#00e676",fontWeight:700,fontSize:"0.82rem",flexShrink:0}}>
                    <CheckCircle2 size={14}/> Applied
                  </div>
                ):(
                  <button onClick={()=>apply(job.id)} disabled={applying===job.id} style={{padding:"10px 18px",background:"linear-gradient(135deg,#1a6bff,#0050dd)",border:"none",borderRadius:9,color:"white",fontWeight:700,fontSize:"0.82rem",cursor:"pointer",flexShrink:0,boxShadow:"0 2px 12px rgba(26,107,255,0.35)",display:"flex",alignItems:"center",gap:6,opacity:applying?0.7:1}}>
                    {applying===job.id?<Loader2 size={14} style={{animation:"spin 1s linear infinite"}}/>:<ArrowRight size={14}/>}
                    {applying===job.id?"Applying...":"Quick Apply"}
                  </button>
                )}
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
