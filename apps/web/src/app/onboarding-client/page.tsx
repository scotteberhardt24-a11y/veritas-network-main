
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { VeritasEmblem, VeritasVerifiedBadge } from "@/components/badges/VeritasBadges";
import { CheckCircle2, ChevronRight, Loader2, Search, Shield, DollarSign, Star, Sparkles } from "lucide-react";

const STEPS = ["Welcome","What You Need","Budget & Timeline","Verification","Find Talent"];

export default function ClientOnboardingPage() {
  const router    = useRouter();
  const [step, setStep]         = useState(0);
  const [need, setNeed]         = useState("");
  const [category, setCategory] = useState("");
  const [budget, setBudget]     = useState("");
  const [timeline, setTimeline] = useState("");
  const [completing, setCompleting] = useState(false);
  const [matches, setMatches]   = useState<any[]>([]);

  const CATS = [
    {id:"dev",  icon:"💻", label:"Development"},
    {id:"design",icon:"🎨", label:"Design"},
    {id:"write",icon:"✍️", label:"Writing"},
    {id:"mktg", icon:"📈", label:"Marketing"},
    {id:"video",icon:"🎬", label:"Video"},
    {id:"consult",icon:"🤝",label:"Consulting"},
  ];

  const BUDGETS = ["Under $1,000","$1,000–$5,000","$5,000–$20,000","$20,000–$50,000","$50,000+"];
  const TIMES   = ["ASAP (< 1 week)","1–4 weeks","1–3 months","3–6 months","Ongoing"];

  function findMatches() {
    setCompleting(true);
    setTimeout(() => {
      setMatches([
        { name:"Alex Chen",    score:99, rate:"$150/hr", jobs:247, match:99, avatar:"AC", verified:true },
        { name:"Priya Sharma", score:96, rate:"$140/hr", jobs:156, match:97, avatar:"PS", verified:true },
        { name:"Marcus Webb",  score:91, rate:"$95/hr",  jobs:89,  match:94, avatar:"MW", verified:true },
      ]);
      setCompleting(false);
      setStep(4);
    }, 1800);
  }

  return (
    <div style={{minHeight:"100vh",background:"#010812",display:"flex",alignItems:"center",justifyContent:"center",padding:20,position:"relative"}}>
      <div style={{position:"absolute",inset:0,backgroundImage:"radial-gradient(circle,rgba(26,107,255,0.18) 1px,transparent 1px)",backgroundSize:"28px 28px",opacity:0.18}}/>

      <div style={{position:"relative",zIndex:10,width:"100%",maxWidth:580}}>
        {/* Logo */}
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8,marginBottom:28}}>
          <VeritasEmblem size={60}/>
          <div style={{fontSize:"0.6rem",fontWeight:600,letterSpacing:"0.25em",color:"#00d4ff",textTransform:"uppercase"}}>Truth Becomes Trust</div>
        </div>

        {/* Stepper */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6,marginBottom:24}}>
          {STEPS.map((s,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:6}}>
              <div style={{
                width:32,height:32,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",
                fontSize:"0.75rem",fontWeight:800,
                background:step>i?"#00c853":step===i?"#1a6bff":"rgba(26,107,255,0.1)",
                border:step>i?"none":step===i?"none":"1px solid rgba(26,107,255,0.2)",
                color:step>i||step===i?"white":"rgba(255,255,255,0.3)",
              }}>
                {step>i?<CheckCircle2 size={14}/>:i+1}
              </div>
              {i<STEPS.length-1&&<div style={{width:24,height:1,background:step>i?"#1a6bff":"rgba(26,107,255,0.15)"}}/>}
            </div>
          ))}
        </div>

        {/* Card */}
        <div style={{background:"linear-gradient(135deg,rgba(4,15,36,0.98),rgba(6,18,41,0.96))",border:"1.5px solid rgba(26,107,255,0.2)",borderRadius:24,padding:28,color:"white"}}>

          {/* STEP 0: Welcome */}
          {step===0&&(
            <div style={{textAlign:"center"}}>
              <div style={{fontSize:"2.5rem",marginBottom:12}}>🏢</div>
              <h2 style={{fontSize:"1.6rem",fontWeight:900,marginBottom:8}}>Hire with Confidence</h2>
              <p style={{color:"rgba(255,255,255,0.5)",marginBottom:24,lineHeight:1.7,fontSize:"0.9rem"}}>
                Every worker on Veritas is identity-verified, skill-tested, and protected by blockchain escrow. You only pay when you're satisfied.
              </p>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:24}}>
                {[["🛡️","Verified Workers","All identity & skills confirmed"],["🔒","Secure Escrow","Pay only on milestone approval"],["⚡","AI Matched","94% proposal acceptance rate"]].map(([ic,t,d],i)=>(
                  <div key={i} style={{padding:14,background:"rgba(26,107,255,0.06)",border:"1px solid rgba(26,107,255,0.15)",borderRadius:12,textAlign:"center"}}>
                    <div style={{fontSize:"1.5rem",marginBottom:6}}>{ic}</div>
                    <div style={{fontWeight:700,fontSize:"0.8rem",marginBottom:3}}>{t}</div>
                    <div style={{fontSize:"0.65rem",color:"rgba(255,255,255,0.4)",lineHeight:1.4}}>{d}</div>
                  </div>
                ))}
              </div>
              <button onClick={()=>setStep(1)} style={{width:"100%",padding:"14px",background:"linear-gradient(135deg,#1a6bff,#0050dd)",border:"none",borderRadius:10,color:"white",fontWeight:800,fontSize:"1rem",cursor:"pointer",boxShadow:"0 4px 20px rgba(26,107,255,0.4)"}}>
                Find Verified Talent →
              </button>
            </div>
          )}

          {/* STEP 1: What you need */}
          {step===1&&(
            <div>
              <h2 style={{fontSize:"1.3rem",fontWeight:900,marginBottom:6}}>What do you need done?</h2>
              <p style={{color:"rgba(255,255,255,0.45)",fontSize:"0.82rem",marginBottom:20}}>Our AI will match you with verified professionals.</p>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:16}}>
                {CATS.map(c=>(
                  <button key={c.id} onClick={()=>setCategory(c.id)} style={{padding:"14px 8px",background:category===c.id?"rgba(26,107,255,0.15)":"rgba(26,107,255,0.04)",border:`1px solid ${category===c.id?"rgba(26,107,255,0.5)":"rgba(26,107,255,0.12)"}`,borderRadius:10,cursor:"pointer",textAlign:"center"}}>
                    <div style={{fontSize:"1.5rem",marginBottom:4}}>{c.icon}</div>
                    <div style={{fontSize:"0.75rem",fontWeight:700,color:category===c.id?"#4da6ff":"rgba(255,255,255,0.6)"}}>{c.label}</div>
                  </button>
                ))}
              </div>
              <div style={{marginBottom:16}}>
                <label style={{fontSize:"0.72rem",fontWeight:700,color:"rgba(255,255,255,0.45)",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:8,display:"block"}}>Describe what you need</label>
                <textarea value={need} onChange={e=>setNeed(e.target.value)} rows={3} placeholder="e.g. I need a Next.js developer to build a SaaS dashboard with Stripe billing and user auth..." style={{width:"100%",padding:"12px 16px",background:"rgba(6,18,41,0.8)",border:"1px solid rgba(26,107,255,0.2)",borderRadius:10,color:"white",fontSize:"0.88rem",outline:"none",resize:"none",lineHeight:1.5}}/>
              </div>
              <div style={{display:"flex",gap:10}}>
                <button onClick={()=>setStep(0)} style={{flex:1,padding:"12px",borderRadius:10,border:"1px solid rgba(26,107,255,0.15)",background:"transparent",color:"rgba(255,255,255,0.5)",cursor:"pointer"}}>← Back</button>
                <button onClick={()=>setStep(2)} disabled={!category||!need} style={{flex:2,padding:"12px",background:"linear-gradient(135deg,#1a6bff,#0050dd)",border:"none",borderRadius:10,color:"white",fontWeight:700,cursor:"pointer",opacity:!category||!need?0.4:1}}>Continue →</button>
              </div>
            </div>
          )}

          {/* STEP 2: Budget & Timeline */}
          {step===2&&(
            <div>
              <h2 style={{fontSize:"1.3rem",fontWeight:900,marginBottom:6}}>Budget & Timeline</h2>
              <p style={{color:"rgba(255,255,255,0.45)",fontSize:"0.82rem",marginBottom:20}}>Set expectations to get the best matches.</p>
              <div style={{marginBottom:16}}>
                <label style={{fontSize:"0.72rem",fontWeight:700,color:"rgba(255,255,255,0.45)",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:8,display:"block"}}>Budget Range</label>
                <div style={{display:"flex",flexDirection:"column",gap:6}}>
                  {BUDGETS.map(b=>(
                    <button key={b} onClick={()=>setBudget(b)} style={{padding:"11px 16px",textAlign:"left",background:budget===b?"rgba(26,107,255,0.12)":"rgba(26,107,255,0.04)",border:`1px solid ${budget===b?"rgba(26,107,255,0.4)":"rgba(26,107,255,0.12)"}`,borderRadius:9,color:budget===b?"#4da6ff":"rgba(255,255,255,0.6)",fontWeight:budget===b?700:500,fontSize:"0.85rem",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                      {b}{budget===b&&<CheckCircle2 size={15} color="#00e676"/>}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{marginBottom:16}}>
                <label style={{fontSize:"0.72rem",fontWeight:700,color:"rgba(255,255,255,0.45)",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:8,display:"block"}}>Timeline</label>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
                  {TIMES.map(t=>(
                    <button key={t} onClick={()=>setTimeline(t)} style={{padding:"10px 12px",textAlign:"left",background:timeline===t?"rgba(26,107,255,0.12)":"rgba(26,107,255,0.04)",border:`1px solid ${timeline===t?"rgba(26,107,255,0.4)":"rgba(26,107,255,0.12)"}`,borderRadius:9,color:timeline===t?"#4da6ff":"rgba(255,255,255,0.6)",fontWeight:600,fontSize:"0.78rem",cursor:"pointer"}}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{display:"flex",gap:10}}>
                <button onClick={()=>setStep(1)} style={{flex:1,padding:"12px",borderRadius:10,border:"1px solid rgba(26,107,255,0.15)",background:"transparent",color:"rgba(255,255,255,0.5)",cursor:"pointer"}}>← Back</button>
                <button onClick={()=>setStep(3)} disabled={!budget||!timeline} style={{flex:2,padding:"12px",background:"linear-gradient(135deg,#1a6bff,#0050dd)",border:"none",borderRadius:10,color:"white",fontWeight:700,cursor:"pointer",opacity:!budget||!timeline?0.4:1}}>Continue →</button>
              </div>
            </div>
          )}

          {/* STEP 3: Verification */}
          {step===3&&(
            <div style={{textAlign:"center"}}>
              <div style={{display:"flex",justifyContent:"center",marginBottom:20}}><VeritasVerifiedBadge score={0} size={130}/></div>
              <h2 style={{fontSize:"1.3rem",fontWeight:900,marginBottom:8}}>Quick Account Setup</h2>
              <p style={{color:"rgba(255,255,255,0.45)",fontSize:"0.85rem",marginBottom:20,lineHeight:1.6}}>Verified clients get priority responses from top-rated workers. Takes 60 seconds.</p>
              <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:20}}>
                {[["✅","Email Verified","Your identity email is confirmed",true],["📱","Add Phone Number","SMS verification for account security",false],["🏢","Company Name (optional)","Increases proposal response rate by 40%",false]].map(([ic,t,d,done],i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",background:done?"rgba(0,200,83,0.06)":"rgba(26,107,255,0.05)",border:`1px solid ${done?"rgba(0,200,83,0.2)":"rgba(26,107,255,0.12)"}`,borderRadius:10,textAlign:"left"}}>
                    <span style={{fontSize:"1.2rem",flexShrink:0}}>{ic}</span>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:700,fontSize:"0.85rem",color:done?"#00e676":"white"}}>{t}</div>
                      <div style={{fontSize:"0.68rem",color:"rgba(255,255,255,0.4)"}}>{d}</div>
                    </div>
                    {done?<CheckCircle2 size={16} color="#00e676"/>:<ChevronRight size={16} color="rgba(255,255,255,0.2)"/>}
                  </div>
                ))}
              </div>
              <div style={{display:"flex",gap:10}}>
                <button onClick={()=>setStep(2)} style={{flex:1,padding:"12px",borderRadius:10,border:"1px solid rgba(26,107,255,0.15)",background:"transparent",color:"rgba(255,255,255,0.5)",cursor:"pointer"}}>← Back</button>
                <button onClick={findMatches} style={{flex:2,padding:"12px",background:"linear-gradient(135deg,#1a6bff,#0050dd)",border:"none",borderRadius:10,color:"white",fontWeight:800,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                  {completing?<><Loader2 size={16} style={{animation:"spin 1s linear infinite"}}/>Finding Matches...</>:<><Sparkles size={16}/>Find Verified Talent</>}
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Matches */}
          {step===4&&(
            <div>
              <h2 style={{fontSize:"1.3rem",fontWeight:900,marginBottom:4}}>Your Top Matches</h2>
              <p style={{color:"rgba(255,255,255,0.45)",fontSize:"0.82rem",marginBottom:20}}>AI-selected from {(Math.random()*500+200|0).toLocaleString()} verified professionals</p>
              <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:20}}>
                {matches.map((m,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:14,padding:"14px 16px",background:"rgba(26,107,255,0.06)",border:"1px solid rgba(26,107,255,0.15)",borderRadius:12}}>
                    <div style={{width:44,height:44,borderRadius:12,background:"linear-gradient(135deg,#1a3a6b,#0d1f3d)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:"1rem",flexShrink:0}}>{m.avatar}</div>
                    <div style={{flex:1}}>
                      <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2}}>
                        <span style={{fontWeight:800}}>{m.name}</span>
                        {m.verified&&<Shield size={12} color="#1a6bff"/>}
                      </div>
                      <div style={{fontSize:"0.72rem",color:"rgba(255,255,255,0.45)"}}>{m.rate} · {m.jobs} jobs · Trust Score {m.score}</div>
                    </div>
                    <div style={{textAlign:"center",flexShrink:0}}>
                      <div style={{fontSize:"1.3rem",fontWeight:900,color:"#f0c040",lineHeight:1}}>{m.match}%</div>
                      <div style={{fontSize:"0.58rem",color:"rgba(255,255,255,0.35)"}}>match</div>
                    </div>
                    <button style={{padding:"8px 14px",background:"linear-gradient(135deg,#1a6bff,#0050dd)",border:"none",borderRadius:8,color:"white",fontWeight:700,fontSize:"0.75rem",cursor:"pointer",flexShrink:0,boxShadow:"0 2px 10px rgba(26,107,255,0.35)"}}>Invite</button>
                  </div>
                ))}
              </div>
              <button onClick={()=>router.push("/jobs/post")} style={{width:"100%",padding:"13px",background:"linear-gradient(135deg,#d4af37,#c9a227,#a07810)",border:"none",borderRadius:10,color:"#0a0800",fontWeight:800,fontSize:"0.95rem",cursor:"pointer",boxShadow:"0 4px 16px rgba(201,162,39,0.3)"}}>
                Post Your Job & Get Proposals →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
