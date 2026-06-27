
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { VeritasEmblem, VeritasVerifiedBadge, NewMemberBadge } from "@/components/badges/VeritasBadges";
import { CheckCircle2, ChevronRight, Plus, X, Loader2, Sparkles, Shield, Zap } from "lucide-react";

const STEPS = ["Welcome","Your Skills","Set Your Rate","Get Verified","Launch"];
const CATS  = [["💻","Development"],["🎨","Design"],["✍️","Writing"],["📈","Marketing"],["🎬","Video"],["🤝","Consulting"],["📊","Data"],["⚡","Web3"]];

export default function OnboardingWorkerPage() {
  const router = useRouter();
  const [step, setStep]       = useState(0);
  const [name, setName]       = useState("");
  const [cat, setCat]         = useState("");
  const [title, setTitle]     = useState("");
  const [bio, setBio]         = useState("");
  const [skills, setSkills]   = useState<string[]>([]);
  const [si, setSi]           = useState("");
  const [rate, setRate]       = useState("");
  const [avail, setAvail]     = useState("full-time");
  const [verified, setVerified] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [completing, setCompleting] = useState(false);

  function addSkill(){const s=si.trim();if(s&&!skills.includes(s)){setSkills(p=>[...p,s]);setSi("")}}
  function doVerify(){setVerifying(true);setTimeout(()=>{setVerifying(false);setVerified(true);},1800);}
  function finish(){setCompleting(true);setTimeout(()=>router.push("/dashboard"),1500);}

  const valid=[name.length>1,cat&&skills.length>0,rate.length>0,true,true];

  return (
    <div style={{minHeight:"100vh",background:"#010812",display:"flex",alignItems:"center",justifyContent:"center",padding:16,position:"relative"}}>
      <div style={{position:"absolute",inset:0,backgroundImage:"radial-gradient(circle,rgba(26,107,255,0.18) 1px,transparent 1px)",backgroundSize:"28px 28px",opacity:0.18}}/>
      <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse 60% 50% at 50% 40%,rgba(26,107,255,0.1) 0%,transparent 70%)"}}/>
      <div style={{position:"relative",zIndex:10,width:"100%",maxWidth:520}}>

        {/* Logo */}
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8,marginBottom:24}}>
          <VeritasEmblem size={60}/>
          <div style={{fontSize:"0.6rem",fontWeight:600,letterSpacing:"0.25em",color:"#00d4ff",textTransform:"uppercase"}}>Truth Becomes Trust</div>
        </div>

        {/* Stepper */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:4,marginBottom:22}}>
          {STEPS.map((s,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:4}}>
              <div style={{width:30,height:30,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.72rem",fontWeight:800,
                background:step>i?"#00c853":step===i?"#1a6bff":"rgba(26,107,255,0.08)",
                border:step>i||step===i?"none":"1px solid rgba(26,107,255,0.2)",
                color:step>i||step===i?"white":"rgba(255,255,255,0.3)"}}>
                {step>i?<CheckCircle2 size={13}/>:i+1}
              </div>
              {i<STEPS.length-1&&<div style={{width:20,height:1,background:step>i?"#1a6bff":"rgba(26,107,255,0.15)"}}/>}
            </div>
          ))}
        </div>

        {/* Card */}
        <div style={{background:"rgba(4,15,36,0.98)",border:"1.5px solid rgba(26,107,255,0.22)",borderRadius:24,padding:28,color:"white"}}>

          {step===0&&(
            <div style={{textAlign:"center"}}>
              <div style={{fontSize:"2.5rem",marginBottom:12}}>👋</div>
              <h2 style={{fontSize:"1.5rem",fontWeight:900,marginBottom:8}}>Welcome to Veritas</h2>
              <p style={{color:"rgba(255,255,255,0.5)",marginBottom:20,lineHeight:1.7,fontSize:"0.88rem"}}>Build your portable reputation, find great clients, and get paid securely. Let's set up your profile in 3 minutes.</p>
              <div style={{marginBottom:20}}>
                <label style={{fontSize:"0.68rem",fontWeight:700,color:"rgba(255,255,255,0.4)",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:6,display:"block"}}>Your Full Name</label>
                <input value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Alex Chen" style={{width:"100%",padding:"12px 16px",background:"rgba(6,18,41,0.8)",border:"1px solid rgba(26,107,255,0.2)",borderRadius:10,color:"white",fontSize:"0.92rem",outline:"none"}}/>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:20}}>
                {[["🛡️","Trust Score","Builds with every job"],["💰","Smart Escrow","Every payment protected"],["🏆","NFT Badge","Reputation lives on-chain"]].map(([ic,t,d],i)=>(
                  <div key={i} style={{padding:12,background:"rgba(26,107,255,0.06)",border:"1px solid rgba(26,107,255,0.14)",borderRadius:12,textAlign:"center"}}>
                    <div style={{fontSize:"1.4rem",marginBottom:5}}>{ic}</div>
                    <div style={{fontWeight:700,fontSize:"0.78rem",marginBottom:2}}>{t}</div>
                    <div style={{fontSize:"0.62rem",color:"rgba(255,255,255,0.38)",lineHeight:1.4}}>{d}</div>
                  </div>
                ))}
              </div>
              <button onClick={()=>setStep(1)} disabled={!name} style={{width:"100%",padding:"13px",background:"linear-gradient(135deg,#1a6bff,#0050dd)",border:"none",borderRadius:10,color:"white",fontWeight:800,fontSize:"0.95rem",cursor:"pointer",opacity:!name?0.4:1}}>Let's Go →</button>
            </div>
          )}

          {step===1&&(
            <div>
              <h2 style={{fontSize:"1.2rem",fontWeight:900,marginBottom:16}}>What do you do?</h2>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:7,marginBottom:14}}>
                {CATS.map(([ic,c])=>(
                  <button key={c} onClick={()=>setCat(c)} style={{padding:"10px 6px",background:cat===c?"rgba(26,107,255,0.15)":"rgba(26,107,255,0.04)",border:`1px solid ${cat===c?"rgba(26,107,255,0.45)":"rgba(26,107,255,0.1)"}`,borderRadius:10,cursor:"pointer",textAlign:"center"}}>
                    <div style={{fontSize:"1.2rem",marginBottom:3}}>{ic}</div>
                    <div style={{fontSize:"0.65rem",fontWeight:700,color:cat===c?"#4da6ff":"rgba(255,255,255,0.5)"}}>{c}</div>
                  </button>
                ))}
              </div>
              <div style={{marginBottom:10}}>
                <label style={{fontSize:"0.68rem",fontWeight:700,color:"rgba(255,255,255,0.4)",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:6,display:"block"}}>Professional Title</label>
                <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="e.g. Full-Stack React Developer" style={{width:"100%",padding:"11px 14px",background:"rgba(6,18,41,0.8)",border:"1px solid rgba(26,107,255,0.2)",borderRadius:9,color:"white",fontSize:"0.88rem",outline:"none",marginBottom:10}}/>
                <label style={{fontSize:"0.68rem",fontWeight:700,color:"rgba(255,255,255,0.4)",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:6,display:"block"}}>Add Your Top Skills</label>
                <div style={{display:"flex",gap:7,marginBottom:8}}>
                  <input value={si} onChange={e=>setSi(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addSkill()} placeholder="e.g. React, Figma, Python..." style={{flex:1,padding:"10px 13px",background:"rgba(6,18,41,0.8)",border:"1px solid rgba(26,107,255,0.2)",borderRadius:9,color:"white",fontSize:"0.85rem",outline:"none"}}/>
                  <button onClick={addSkill} style={{padding:"10px 14px",background:"rgba(26,107,255,0.12)",border:"1px solid rgba(26,107,255,0.25)",borderRadius:9,color:"#4da6ff",cursor:"pointer",fontWeight:700}}><Plus size={15}/></button>
                </div>
                <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                  {skills.map(s=><span key={s} style={{display:"flex",alignItems:"center",gap:5,padding:"5px 11px",background:"rgba(26,107,255,0.1)",border:"1px solid rgba(26,107,255,0.22)",borderRadius:7,fontSize:"0.76rem",color:"#4da6ff",fontWeight:600}}>{s}<button onClick={()=>setSkills(p=>p.filter(x=>x!==s))} style={{background:"none",border:"none",cursor:"pointer",color:"rgba(255,255,255,0.35)",padding:0,lineHeight:1}}><X size={11}/></button></span>)}
                </div>
              </div>
              <div style={{display:"flex",gap:10,marginTop:16}}>
                <button onClick={()=>setStep(0)} style={{flex:1,padding:"11px",borderRadius:10,border:"1px solid rgba(26,107,255,0.15)",background:"transparent",color:"rgba(255,255,255,0.5)",cursor:"pointer"}}>← Back</button>
                <button onClick={()=>setStep(2)} disabled={!cat||skills.length===0} style={{flex:2,padding:"11px",background:"linear-gradient(135deg,#1a6bff,#0050dd)",border:"none",borderRadius:10,color:"white",fontWeight:700,cursor:"pointer",opacity:!cat||skills.length===0?0.4:1}}>Continue →</button>
              </div>
            </div>
          )}

          {step===2&&(
            <div>
              <h2 style={{fontSize:"1.2rem",fontWeight:900,marginBottom:16}}>Set Your Rate</h2>
              <div style={{marginBottom:14}}>
                <label style={{fontSize:"0.68rem",fontWeight:700,color:"rgba(255,255,255,0.4)",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:6,display:"block"}}>Hourly Rate (USD)</label>
                <div style={{position:"relative"}}>
                  <span style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",color:"rgba(255,255,255,0.4)",fontWeight:700}}>$</span>
                  <input value={rate} onChange={e=>setRate(e.target.value)} type="number" placeholder="150" style={{width:"100%",padding:"12px 14px 12px 28px",background:"rgba(6,18,41,0.8)",border:"1px solid rgba(26,107,255,0.2)",borderRadius:9,color:"white",fontSize:"1.1rem",fontWeight:700,outline:"none"}}/>
                  <span style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",color:"rgba(255,255,255,0.35)",fontSize:"0.8rem"}}>/hr</span>
                </div>
                <div style={{fontSize:"0.68rem",color:"rgba(255,255,255,0.3)",marginTop:5}}>Market average for {cat}: $75–$150/hr · Top earners: $200+</div>
              </div>
              <div style={{marginBottom:14}}>
                <label style={{fontSize:"0.68rem",fontWeight:700,color:"rgba(255,255,255,0.4)",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:6,display:"block"}}>Availability</label>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:7}}>
                  {[["full-time","Full-time","40h/wk"],["part-time","Part-time","20h/wk"],["contract","Project","As needed"]].map(([v,l,d])=>(
                    <button key={v} onClick={()=>setAvail(v)} style={{padding:"10px 8px",background:avail===v?"rgba(26,107,255,0.14)":"rgba(26,107,255,0.04)",border:`1px solid ${avail===v?"rgba(26,107,255,0.4)":"rgba(26,107,255,0.1)"}`,borderRadius:9,cursor:"pointer",textAlign:"center"}}>
                      <div style={{fontWeight:700,fontSize:"0.8rem",color:avail===v?"#4da6ff":"rgba(255,255,255,0.6)",marginBottom:2}}>{l}</div>
                      <div style={{fontSize:"0.62rem",color:"rgba(255,255,255,0.35)"}}>{d}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div style={{marginBottom:14}}>
                <label style={{fontSize:"0.68rem",fontWeight:700,color:"rgba(255,255,255,0.4)",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:6,display:"block"}}>Short Bio</label>
                <textarea value={bio} onChange={e=>setBio(e.target.value)} rows={3} placeholder="A brief intro — your experience, specialties, and what makes you different..." style={{width:"100%",padding:"11px 14px",background:"rgba(6,18,41,0.8)",border:"1px solid rgba(26,107,255,0.2)",borderRadius:9,color:"white",fontSize:"0.85rem",outline:"none",resize:"none",lineHeight:1.5}}/>
              </div>
              <div style={{display:"flex",gap:10}}>
                <button onClick={()=>setStep(1)} style={{flex:1,padding:"11px",borderRadius:10,border:"1px solid rgba(26,107,255,0.15)",background:"transparent",color:"rgba(255,255,255,0.5)",cursor:"pointer"}}>← Back</button>
                <button onClick={()=>setStep(3)} disabled={!rate} style={{flex:2,padding:"11px",background:"linear-gradient(135deg,#1a6bff,#0050dd)",border:"none",borderRadius:10,color:"white",fontWeight:700,cursor:"pointer",opacity:!rate?0.4:1}}>Continue →</button>
              </div>
            </div>
          )}

          {step===3&&(
            <div style={{textAlign:"center"}}>
              {!verified?(
                <>
                  <div style={{fontSize:"2rem",marginBottom:12}}>🪪</div>
                  <h2 style={{fontSize:"1.2rem",fontWeight:900,marginBottom:8}}>Verify Your Identity</h2>
                  <p style={{color:"rgba(255,255,255,0.5)",marginBottom:20,fontSize:"0.85rem",lineHeight:1.65}}>Verified workers earn <strong style={{color:"#f0c040"}}>3x more</strong> and get priority in AI matching. Takes 60 seconds.</p>
                  <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:20,textAlign:"left"}}>
                    {[["✅","Email","Confirmed",true],["📱","Phone","Add for +10 pts",false],["🪪","Government ID","Add for +20 pts",false]].map(([ic,l,d,done],i)=>(
                      <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"11px 14px",background:done?"rgba(0,200,83,0.06)":"rgba(26,107,255,0.04)",border:`1px solid ${done?"rgba(0,200,83,0.2)":"rgba(26,107,255,0.12)"}`,borderRadius:10}}>
                        <span style={{fontSize:"1.1rem"}}>{ic}</span>
                        <div style={{flex:1}}><div style={{fontWeight:600,fontSize:"0.85rem",color:done?"#00e676":"white"}}>{l}</div><div style={{fontSize:"0.65rem",color:"rgba(255,255,255,0.38)"}}>{d}</div></div>
                        {done?<CheckCircle2 size={15} color="#00e676"/>:<ChevronRight size={15} color="rgba(255,255,255,0.2)"/>}
                      </div>
                    ))}
                  </div>
                  <button onClick={doVerify} disabled={verifying} style={{width:"100%",padding:"13px",background:"linear-gradient(135deg,#1a6bff,#0050dd)",border:"none",borderRadius:10,color:"white",fontWeight:800,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,marginBottom:10,fontSize:"0.92rem"}}>
                    {verifying?<><Loader2 size={16} style={{animation:"spin 1s linear infinite"}}/>Verifying...</>:<><Shield size={16}/>Verify Now (+30 Trust Score)</>}
                  </button>
                  <button onClick={()=>setStep(4)} style={{width:"100%",padding:"11px",borderRadius:10,border:"1px solid rgba(26,107,255,0.15)",background:"transparent",color:"rgba(255,255,255,0.4)",cursor:"pointer",fontSize:"0.82rem"}}>Skip for now</button>
                </>
              ):(
                <>
                  <div style={{display:"flex",justifyContent:"center",marginBottom:14}}><NewMemberBadge size={120}/></div>
                  <h2 style={{fontSize:"1.3rem",fontWeight:900,marginBottom:6,color:"#00e676"}}>Identity Verified! 🎉</h2>
                  <p style={{color:"rgba(255,255,255,0.5)",marginBottom:16,fontSize:"0.85rem"}}>+30 Trust Score points added. New Member badge earned.</p>
                  <button onClick={()=>setStep(4)} style={{width:"100%",padding:"13px",background:"linear-gradient(135deg,#1a6bff,#0050dd)",border:"none",borderRadius:10,color:"white",fontWeight:700,cursor:"pointer"}}>Almost Done →</button>
                </>
              )}
            </div>
          )}

          {step===4&&(
            <div style={{textAlign:"center"}}>
              <div style={{display:"flex",justifyContent:"center",marginBottom:14}}><VeritasVerifiedBadge score={verified?420:350} size={150}/></div>
              <h2 style={{fontSize:"1.5rem",fontWeight:900,marginBottom:6}}>You're Live, {name}! 🚀</h2>
              <p style={{color:"rgba(255,255,255,0.5)",marginBottom:20,fontSize:"0.87rem",lineHeight:1.65}}>Your profile is active. AI is already scanning for job matches based on your skills.</p>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:20}}>
                {[["Trust Score",verified?"420":"350","#00e676"],["AI Matches","14","#f0c040"],["Badges",verified?"2":"1","#4da6ff"]].map(([l,v,c],i)=>(
                  <div key={i} style={{padding:12,background:"rgba(26,107,255,0.08)",border:"1px solid rgba(26,107,255,0.18)",borderRadius:12}}>
                    <div style={{fontSize:"1.6rem",fontWeight:900,color:c,lineHeight:1,marginBottom:3}}>{v}</div>
                    <div style={{fontSize:"0.65rem",color:"rgba(255,255,255,0.4)"}}>{l}</div>
                  </div>
                ))}
              </div>
              <button onClick={finish} style={{width:"100%",padding:"14px",background:"linear-gradient(135deg,#d4af37,#c9a227,#a07810)",border:"none",borderRadius:10,color:"#0a0800",fontWeight:800,fontSize:"1rem",cursor:"pointer",boxShadow:"0 4px 20px rgba(201,162,39,0.35)",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                {completing?<><Loader2 size={18} style={{animation:"spin 1s linear infinite"}}/>Loading...</>:<><Sparkles size={18}/>Enter Veritas</>}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
