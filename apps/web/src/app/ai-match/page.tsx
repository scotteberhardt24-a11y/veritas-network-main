
"use client";
import { useState, useEffect } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import TopBar from "@/components/topbar/TopBar";
import { VeritasVerifiedBadge } from "@/components/badges/VeritasBadges";
import { Sparkles, Zap, Brain, Shield, Star, Clock, DollarSign, CheckCircle2, Loader2, ArrowRight, TrendingUp, Users, BarChart3, X } from "lucide-react";

const SIGNALS = [
  {label:"Skill Match",        weight:30,color:"#4da6ff"},
  {label:"Trust Score",        weight:20,color:"#00e676"},
  {label:"Past Performance",   weight:20,color:"#00e676"},
  {label:"Rate Compatibility",  weight:15,color:"#f0c040"},
  {label:"Availability",       weight:10,color:"#a78bfa"},
  {label:"Location Factor",    weight:5, color:"#00d4ff"},
];

const WORKERS = [
  {id:"W1",name:"Alex Chen",     score:990,title:"Full-Stack Developer",  rate:150,match:99,skills:["Next.js","TypeScript","PostgreSQL"],jobs:247,rating:5.0,avatar:"AC",available:true, signals:[97,94,99,88,100,72]},
  {id:"W2",name:"Priya Sharma",  score:960,title:"Backend Engineer",      rate:140,match:97,skills:["Node.js","AWS","PostgreSQL"],       jobs:156,rating:4.9,avatar:"PS",available:true, signals:[95,92,97,91,100,65]},
  {id:"W3",name:"Marcus Johnson",score:910,title:"Full-Stack Developer",  rate:135,match:94,skills:["React","Node.js","MongoDB"],        jobs:198,rating:4.9,avatar:"MJ",available:true, signals:[93,89,94,95,100,78]},
];

type Step = "input"|"scanning"|"results"|"accepted";

export default function AIMatchingV2Page() {
  const [step, setStep]         = useState<Step>("input");
  const [jobTitle, setJobTitle] = useState("");
  const [jobDesc, setJobDesc]   = useState("");
  const [budget, setBudget]     = useState("");
  const [scanProgress, setScan] = useState(0);
  const [scanMsg, setScanMsg]   = useState("");
  const [accepted, setAccepted] = useState<string|null>(null);
  const [showDetail, setDetail] = useState<typeof WORKERS[0]|null>(null);

  const SCAN_MSGS = [
    "Analyzing job requirements...",
    "Scanning 12,847 verified worker profiles...",
    "Running skill compatibility matrix...",
    "Checking availability and response rates...",
    "Analyzing pricing compatibility...",
    "Computing Trust Score weights...",
    "Running final ranking algorithm...",
    "Selecting top 3 matches...",
  ];

  function startScan() {
    if (!jobTitle || !jobDesc || !budget) return;
    setStep("scanning");
    setScan(0);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setScan(Math.min(i * 13, 99));
      setScanMsg(SCAN_MSGS[Math.min(i-1, SCAN_MSGS.length-1)]);
      if (i >= 8) { clearInterval(interval); setScan(100); setTimeout(() => setStep("results"), 400); }
    }, 350);
  }

  function accept(id:string) {
    setAccepted(id);
    setTimeout(() => setStep("accepted"), 800);
  }

  const acceptedWorker = WORKERS.find(w => w.id === accepted);

  return (
    <div style={{display:"flex",minHeight:"100vh",background:"#010812"}}>
      <Sidebar/>
      <div style={{flex:1,display:"flex",flexDirection:"column"}}>
        <TopBar/>
        <main style={{flex:1,overflowY:"auto",padding:24,color:"white"}}>

          {/* Header */}
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:8}}>
            <Brain size={28} color="#f0c040"/>
            <div>
              <h1 style={{fontSize:"1.8rem",fontWeight:900,margin:0}}>AI Match Engine</h1>
              <div style={{fontSize:"0.65rem",color:"#00d4ff",letterSpacing:"0.15em",textTransform:"uppercase"}}>No searching. No bidding. AI picks your 3 best matches.</div>
            </div>
          </div>

          {/* How it works strip */}
          <div style={{display:"flex",gap:8,marginBottom:24,overflowX:"auto",padding:"4px 0"}}>
            {[["1","Describe your job","Plain English — no forms"],["2","AI scans all workers","47 signals in seconds"],["3","Get 3 matches","Pre-vetted, available, priced right"],["4","Pick one","They start within 24h"]].map(([n,t,d],i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
                <div style={{padding:"8px 14px",background:"rgba(26,107,255,0.06)",border:"1px solid rgba(26,107,255,0.14)",borderRadius:10,display:"flex",alignItems:"center",gap:8,whiteSpace:"nowrap"}}>
                  <div style={{width:22,height:22,borderRadius:"50%",background:"rgba(26,107,255,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.72rem",fontWeight:800,color:"#4da6ff",flexShrink:0}}>{n}</div>
                  <div><div style={{fontWeight:700,fontSize:"0.78rem"}}>{t}</div><div style={{fontSize:"0.62rem",color:"rgba(255,255,255,0.38)"}}>{d}</div></div>
                </div>
                {i < 3 && <ArrowRight size={14} color="rgba(26,107,255,0.3)" style={{flexShrink:0}}/>}
              </div>
            ))}
          </div>

          {/* STEP: INPUT */}
          {step==="input"&&(
            <div style={{display:"grid",gridTemplateColumns:"1fr 340px",gap:20}}>
              <div style={{background:"rgba(4,15,36,0.95)",border:"1px solid rgba(26,107,255,0.2)",borderRadius:20,padding:26}}>
                <h2 style={{fontSize:"1.2rem",fontWeight:800,marginBottom:16,display:"flex",alignItems:"center",gap:8}}><Sparkles size={20} color="#f0c040"/>Describe Your Job</h2>
                <div style={{display:"flex",flexDirection:"column",gap:14}}>
                  <div>
                    <label style={{fontSize:"0.68rem",fontWeight:700,color:"rgba(255,255,255,0.4)",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:6,display:"block"}}>Job Title</label>
                    <input value={jobTitle} onChange={e=>setJobTitle(e.target.value)} placeholder="e.g. Build a SaaS dashboard with Stripe billing" style={{width:"100%",padding:"12px 14px",background:"rgba(6,18,41,0.8)",border:"1px solid rgba(26,107,255,0.2)",borderRadius:10,color:"white",fontSize:"0.92rem",outline:"none"}}/>
                  </div>
                  <div>
                    <label style={{fontSize:"0.68rem",fontWeight:700,color:"rgba(255,255,255,0.4)",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:6,display:"block"}}>Project Description</label>
                    <textarea value={jobDesc} onChange={e=>setJobDesc(e.target.value)} rows={5} placeholder="Describe what you need built, key features, tech stack preferences, timeline, and any specific requirements. The more detail you give, the better the AI matches." style={{width:"100%",padding:"12px 14px",background:"rgba(6,18,41,0.8)",border:"1px solid rgba(26,107,255,0.2)",borderRadius:10,color:"white",fontSize:"0.88rem",outline:"none",resize:"none",lineHeight:1.65}}/>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                    <div>
                      <label style={{fontSize:"0.68rem",fontWeight:700,color:"rgba(255,255,255,0.4)",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:6,display:"block"}}>Budget</label>
                      <select value={budget} onChange={e=>setBudget(e.target.value)} style={{width:"100%",padding:"12px 14px",background:"rgba(6,18,41,0.8)",border:"1px solid rgba(26,107,255,0.2)",borderRadius:10,color:budget?"white":"rgba(255,255,255,0.4)",fontSize:"0.88rem",outline:"none"}}>
                        <option value="">Select budget range</option>
                        {["Under $1,000","$1,000–$5,000","$5,000–$15,000","$15,000–$50,000","$50,000+"].map(b=><option key={b} value={b}>{b}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{fontSize:"0.68rem",fontWeight:700,color:"rgba(255,255,255,0.4)",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:6,display:"block"}}>Timeline</label>
                      <select style={{width:"100%",padding:"12px 14px",background:"rgba(6,18,41,0.8)",border:"1px solid rgba(26,107,255,0.2)",borderRadius:10,color:"rgba(255,255,255,0.7)",fontSize:"0.88rem",outline:"none"}}>
                        {["ASAP","1–2 weeks","1 month","2–3 months","Flexible"].map(t=><option key={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>
                  <button onClick={startScan} disabled={!jobTitle||!jobDesc||!budget} style={{width:"100%",padding:"14px",background:"linear-gradient(135deg,#d4af37,#c9a227,#a07810)",border:"none",borderRadius:11,color:"#0a0800",fontWeight:800,fontSize:"1rem",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:9,boxShadow:"0 4px 24px rgba(201,162,39,0.35)",opacity:!jobTitle||!jobDesc||!budget?0.4:1}}>
                    <Brain size={20}/>Find My 3 Best Matches
                  </button>
                </div>
              </div>

              {/* Right panel — how it works */}
              <div style={{display:"flex",flexDirection:"column",gap:12}}>
                <div style={{background:"rgba(4,15,36,0.9)",border:"1px solid rgba(26,107,255,0.14)",borderRadius:16,padding:18}}>
                  <div style={{fontWeight:800,marginBottom:12,fontSize:"0.88rem",display:"flex",alignItems:"center",gap:7}}><BarChart3 size={15} color="#4da6ff"/>47 Matching Signals</div>
                  {SIGNALS.map((s,i)=>(
                    <div key={i} style={{marginBottom:10}}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:4,fontSize:"0.75rem"}}>
                        <span style={{color:"rgba(255,255,255,0.6)"}}>{s.label}</span>
                        <span style={{color:s.color,fontWeight:700}}>{s.weight}% weight</span>
                      </div>
                      <div style={{height:4,background:"rgba(26,107,255,0.08)",borderRadius:2,overflow:"hidden"}}>
                        <div style={{width:`${s.weight*3}%`,height:"100%",background:s.color,borderRadius:2}}/>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{padding:14,background:"rgba(0,200,83,0.05)",border:"1px solid rgba(0,200,83,0.15)",borderRadius:12,fontSize:"0.78rem",color:"rgba(255,255,255,0.5)",lineHeight:1.65}}>
                  <strong style={{color:"#00e676"}}>Why only 3 matches?</strong><br/>
                  More choice = more paralysis. Our AI pre-qualifies every match so all 3 are right for your job. You just pick based on vibe.
                </div>
              </div>
            </div>
          )}

          {/* STEP: SCANNING */}
          {step==="scanning"&&(
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:400,gap:24}}>
              <div style={{position:"relative",width:160,height:160}}>
                <svg width={160} height={160} viewBox="0 0 160 160" style={{transform:"rotate(-90deg)"}}>
                  <circle cx={80} cy={80} r={68} fill="none" stroke="rgba(26,107,255,0.08)" strokeWidth={10}/>
                  <circle cx={80} cy={80} r={68} fill="none" stroke="url(#sg1)" strokeWidth={10}
                    strokeDasharray={2*Math.PI*68} strokeDashoffset={2*Math.PI*68*(1-scanProgress/100)}
                    strokeLinecap="round" style={{transition:"stroke-dashoffset 0.3s"}}/>
                  <defs><linearGradient id="sg1" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#f0c040"/><stop offset="100%" stopColor="#00e676"/></linearGradient></defs>
                </svg>
                <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
                  <Brain size={28} color="#f0c040"/>
                  <div style={{fontSize:"1.4rem",fontWeight:900,color:"#f0c040",marginTop:4}}>{scanProgress}%</div>
                </div>
              </div>
              <div style={{textAlign:"center"}}>
                <div style={{fontWeight:700,fontSize:"1.1rem",marginBottom:6}}>{scanMsg}</div>
                <div style={{fontSize:"0.78rem",color:"rgba(255,255,255,0.4)"}}>Scanning 12,847 verified profiles across 94 countries</div>
              </div>
              <div style={{display:"flex",gap:14,fontSize:"0.72rem",color:"rgba(255,255,255,0.35)"}}>
                {[["12,847","Profiles scanned"],["47","Signals analyzed"],["3","Matches selected"]].map(([v,l],i)=>(
                  <div key={i} style={{textAlign:"center",padding:"8px 14px",background:"rgba(26,107,255,0.05)",border:"1px solid rgba(26,107,255,0.1)",borderRadius:9}}>
                    <div style={{fontWeight:800,color:"#4da6ff",fontSize:"0.95rem"}}>{v}</div>
                    <div>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP: RESULTS */}
          {step==="results"&&(
            <div>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16,flexWrap:"wrap",gap:10}}>
                <div>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}><CheckCircle2 size={20} color="#00e676"/><span style={{fontWeight:800,fontSize:"1.1rem",color:"#00e676"}}>3 Perfect Matches Found</span></div>
                  <div style={{fontSize:"0.78rem",color:"rgba(255,255,255,0.4)"}}>For: "{jobTitle}" · Budget: {budget} · Analyzed in 2.8 seconds</div>
                </div>
                <button onClick={()=>setStep("input")} style={{padding:"8px 14px",background:"rgba(26,107,255,0.07)",border:"1px solid rgba(26,107,255,0.18)",borderRadius:8,color:"#4da6ff",fontSize:"0.78rem",fontWeight:600,cursor:"pointer"}}>← New Search</button>
              </div>

              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16,marginBottom:20}}>
                {WORKERS.map((w,rank)=>(
                  <div key={w.id} style={{background:"rgba(4,15,36,0.95)",border:`1.5px solid ${rank===0?"rgba(240,192,64,0.35)":"rgba(26,107,255,0.18)"}`,borderRadius:20,padding:22,position:"relative",boxShadow:rank===0?"0 0 30px rgba(240,192,64,0.08)":"none"}}>
                    {rank===0&&<div style={{position:"absolute",top:-10,left:"50%",transform:"translateX(-50%)",padding:"3px 12px",background:"linear-gradient(135deg,#f0c040,#c9a227)",borderRadius:10,fontSize:"0.62rem",fontWeight:900,color:"#0a0800",whiteSpace:"nowrap"}}>🏆 Best Match</div>}

                    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:10,marginBottom:16,paddingTop:rank===0?8:0}}>
                      <VeritasVerifiedBadge score={w.score} size={80}/>
                      <div style={{textAlign:"center"}}>
                        <div style={{fontWeight:900,fontSize:"1rem",marginBottom:2}}>{w.name}</div>
                        <div style={{fontSize:"0.72rem",color:"rgba(255,255,255,0.45)",marginBottom:4}}>{w.title}</div>
                        <div style={{display:"flex",justifyContent:"center",gap:4}}>
                          {w.skills.slice(0,2).map(s=><span key={s} style={{fontSize:"0.6rem",padding:"2px 7px",background:"rgba(26,107,255,0.08)",border:"1px solid rgba(26,107,255,0.18)",borderRadius:5,color:"rgba(255,255,255,0.6)"}}>{s}</span>)}
                        </div>
                      </div>
                    </div>

                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}}>
                      {[["AI Match",`${w.match}%`,"#f0c040"],["Trust Score",w.score,"#00e676"],["Rate",`$${w.rate}/hr`,"rgba(255,255,255,0.7)"],["Jobs Done",w.jobs,"rgba(255,255,255,0.7)"]].map(([l,v,c],i)=>(
                        <div key={i} style={{padding:"8px",background:"rgba(26,107,255,0.05)",border:"1px solid rgba(26,107,255,0.1)",borderRadius:8,textAlign:"center"}}>
                          <div style={{fontWeight:800,color:c,fontSize:"0.88rem",lineHeight:1,marginBottom:2}}>{v}</div>
                          <div style={{fontSize:"0.58rem",color:"rgba(255,255,255,0.35)"}}>{l}</div>
                        </div>
                      ))}
                    </div>

                    {/* Signal bars */}
                    <div style={{marginBottom:14}}>
                      {SIGNALS.slice(0,4).map((s,i)=>(
                        <div key={i} style={{display:"flex",alignItems:"center",gap:6,marginBottom:5}}>
                          <div style={{fontSize:"0.6rem",color:"rgba(255,255,255,0.4)",width:70,flexShrink:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{s.label}</div>
                          <div style={{flex:1,height:4,background:"rgba(26,107,255,0.08)",borderRadius:2,overflow:"hidden"}}>
                            <div style={{width:`${w.signals[i]}%`,height:"100%",background:s.color,borderRadius:2}}/>
                          </div>
                          <div style={{fontSize:"0.6rem",color:s.color,fontWeight:700,width:24,textAlign:"right"}}>{w.signals[i]}</div>
                        </div>
                      ))}
                    </div>

                    <div style={{display:"flex",gap:7}}>
                      <button onClick={()=>setDetail(w)} style={{flex:1,padding:"9px",background:"rgba(26,107,255,0.08)",border:"1px solid rgba(26,107,255,0.2)",borderRadius:9,color:"#4da6ff",fontSize:"0.75rem",fontWeight:600,cursor:"pointer"}}>View Profile</button>
                      <button onClick={()=>accept(w.id)} style={{flex:2,padding:"10px",background:rank===0?"linear-gradient(135deg,#d4af37,#c9a227,#a07810)":"linear-gradient(135deg,#1a6bff,#0050dd)",border:"none",borderRadius:9,color:rank===0?"#0a0800":"white",fontWeight:700,fontSize:"0.82rem",cursor:"pointer",boxShadow:rank===0?"0 3px 14px rgba(201,162,39,0.35)":"0 3px 14px rgba(26,107,255,0.35)"}}>
                        Hire {w.name.split(" ")[0]}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{padding:14,background:"rgba(26,107,255,0.04)",border:"1px solid rgba(26,107,255,0.12)",borderRadius:12,fontSize:"0.78rem",color:"rgba(255,255,255,0.45)",lineHeight:1.65,display:"flex",gap:10,alignItems:"flex-start"}}>
                <Sparkles size={14} color="#f0c040" style={{flexShrink:0,marginTop:2}}/>
                <span>All 3 workers are pre-vetted, currently available, and priced within your budget. Hiring one locks your project into Veritas smart contract escrow — payment only releases when you approve milestones.</span>
              </div>
            </div>
          )}

          {/* STEP: ACCEPTED */}
          {step==="accepted"&&acceptedWorker&&(
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:400,gap:20}}>
              <VeritasVerifiedBadge score={acceptedWorker.score} size={140}/>
              <div style={{textAlign:"center"}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,marginBottom:6}}><CheckCircle2 size={24} color="#00e676"/><span style={{fontSize:"1.5rem",fontWeight:900,color:"#00e676"}}>Match Confirmed!</span></div>
                <div style={{fontSize:"1rem",color:"rgba(255,255,255,0.7)",marginBottom:4}}>You've hired <strong>{acceptedWorker.name}</strong></div>
                <div style={{fontSize:"0.82rem",color:"rgba(255,255,255,0.45)",marginBottom:20}}>AI-generated contract is being prepared. Escrow will activate once both parties sign.</div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,width:"100%",maxWidth:500}}>
                {[["Next step","Contract signing","📋"],["Then","Fund escrow","🔒"],["Then","Work begins","🚀"]].map(([l,v,ic],i)=>(
                  <div key={i} style={{padding:"14px",background:"rgba(26,107,255,0.06)",border:"1px solid rgba(26,107,255,0.14)",borderRadius:12,textAlign:"center"}}>
                    <div style={{fontSize:"1.4rem",marginBottom:6}}>{ic}</div>
                    <div style={{fontSize:"0.65rem",color:"rgba(255,255,255,0.38)",marginBottom:3}}>{l}</div>
                    <div style={{fontWeight:700,fontSize:"0.82rem"}}>{v}</div>
                  </div>
                ))}
              </div>
              <button onClick={()=>setStep("input")} style={{padding:"12px 24px",background:"rgba(26,107,255,0.1)",border:"1px solid rgba(26,107,255,0.25)",borderRadius:10,color:"#4da6ff",fontWeight:600,cursor:"pointer",fontSize:"0.88rem"}}>Post Another Job</button>
            </div>
          )}

          {/* Worker detail modal */}
          {showDetail&&(
            <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",backdropFilter:"blur(8px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:50,padding:16}}>
              <div style={{background:"rgba(4,15,36,0.99)",border:"1px solid rgba(26,107,255,0.25)",borderRadius:22,padding:28,width:"100%",maxWidth:480,color:"white",maxHeight:"90vh",overflowY:"auto"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
                  <div style={{fontWeight:900,fontSize:"1.1rem"}}>{showDetail.name}</div>
                  <button onClick={()=>setDetail(null)} style={{background:"none",border:"none",color:"rgba(255,255,255,0.4)",cursor:"pointer"}}><X size={20}/></button>
                </div>
                <div style={{display:"flex",justifyContent:"center",marginBottom:16}}><VeritasVerifiedBadge score={showDetail.score} size={120}/></div>
                <div style={{fontWeight:700,textAlign:"center",marginBottom:4}}>{showDetail.title}</div>
                <div style={{fontSize:"0.75rem",color:"rgba(255,255,255,0.4)",textAlign:"center",marginBottom:16}}>${showDetail.rate}/hr · {showDetail.jobs} jobs completed · {showDetail.rating}★</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:16}}>
                  {SIGNALS.map((s,i)=>(
                    <div key={i} style={{padding:"10px",background:"rgba(26,107,255,0.05)",border:"1px solid rgba(26,107,255,0.1)",borderRadius:9}}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:4,fontSize:"0.7rem"}}>
                        <span style={{color:"rgba(255,255,255,0.5)"}}>{s.label}</span>
                        <span style={{color:s.color,fontWeight:700}}>{showDetail.signals[i]}/100</span>
                      </div>
                      <div style={{height:4,background:"rgba(26,107,255,0.08)",borderRadius:2,overflow:"hidden"}}>
                        <div style={{width:`${showDetail.signals[i]}%`,height:"100%",background:s.color,borderRadius:2}}/>
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={()=>{accept(showDetail.id);setDetail(null);}} style={{width:"100%",padding:"13px",background:"linear-gradient(135deg,#1a6bff,#0050dd)",border:"none",borderRadius:10,color:"white",fontWeight:700,fontSize:"0.92rem",cursor:"pointer",boxShadow:"0 4px 18px rgba(26,107,255,0.35)"}}>
                  Hire {showDetail.name.split(" ")[0]} →
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
