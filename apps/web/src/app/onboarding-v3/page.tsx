
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { VeritasEmblem, VeritasVerifiedBadge, NewMemberBadge } from "@/components/badges/VeritasBadges";
import { CheckCircle2, Plus, X, Loader2, Sparkles, Shield, ArrowRight } from "lucide-react";

const STEPS=["Welcome","Your Work","Rate & Hours","Verify","Done"];
const CATS=[["💻","Development"],["🎨","Design"],["✍️","Writing"],["📈","Marketing"],["🎬","Video"],["🤝","Consulting"],["📊","Data"],["⚡","Web3"]];

export default function OnboardingV3Page(){
  const router=useRouter();
  const [step,setStep]=useState(0);
  const [name,setName]=useState("");
  const [cat,setCat]=useState("");
  const [title,setTitle]=useState("");
  const [skills,setSkills]=useState<string[]>([]);
  const [si,setSi]=useState("");
  const [rate,setRate]=useState("");
  const [hours,setHours]=useState("full-time");
  const [verified,setVer]=useState(false);
  const [verifying,setVerifying]=useState(false);
  const [finishing,setFin]=useState(false);

  function addSkill(){const s=si.trim();if(s&&!skills.includes(s)){setSkills(p=>[...p,s]);setSi("");}}
  function verify(){setVerifying(true);setTimeout(()=>{setVerifying(false);setVer(true);},1600);}
  function finish(){setFin(true);setTimeout(()=>router.push("/dashboard"),1500);}

  const progress=(step/4)*100;
  const card={background:"rgba(4,15,36,0.98)",border:"1.5px solid rgba(26,107,255,0.22)",borderRadius:24,padding:28,color:"white"};

  return(
    <div style={{minHeight:"100vh",background:"#010812",display:"flex",alignItems:"center",justifyContent:"center",padding:16,position:"relative"}}>
      <div style={{position:"absolute",inset:0,backgroundImage:"radial-gradient(circle,rgba(26,107,255,0.18) 1px,transparent 1px)",backgroundSize:"28px 28px",opacity:0.18}}/>
      <div style={{position:"relative",zIndex:10,width:"100%",maxWidth:520}}>
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8,marginBottom:24}}>
          <VeritasEmblem size={60}/>
          <div style={{fontSize:"0.6rem",fontWeight:600,letterSpacing:"0.25em",color:"#00d4ff",textTransform:"uppercase"}}>Truth Becomes Trust</div>
        </div>
        <div style={{height:3,background:"rgba(26,107,255,0.1)",borderRadius:2,overflow:"hidden",marginBottom:20}}>
          <div style={{width:`${progress}%`,height:"100%",background:"linear-gradient(90deg,#1a6bff,#00e676)",borderRadius:2,transition:"width 0.5s"}}/>
        </div>
        <div style={{display:"flex",justifyContent:"center",gap:4,marginBottom:20}}>
          {STEPS.map((s,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:4}}>
              <div style={{width:28,height:28,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.7rem",fontWeight:800,background:step>i?"#00c853":step===i?"#1a6bff":"rgba(26,107,255,0.08)",color:step>i||step===i?"white":"rgba(255,255,255,0.3)"}}>
                {step>i?<CheckCircle2 size={13}/>:i+1}
              </div>
              {i<STEPS.length-1&&<div style={{width:16,height:1,background:step>i?"#1a6bff":"rgba(26,107,255,0.15)"}}/>}
            </div>
          ))}
        </div>

        {step===0&&(
          <div style={card}>
            <div style={{textAlign:"center",marginBottom:20}}>
              <div style={{fontSize:"2.2rem",marginBottom:10}}>👋</div>
              <h2 style={{fontSize:"1.5rem",fontWeight:900,marginBottom:8}}>Welcome to Veritas</h2>
              <p style={{color:"rgba(255,255,255,0.5)",lineHeight:1.7,fontSize:"0.88rem",marginBottom:20}}>Build your portable reputation, find great clients, and get paid securely. Setup takes 3 minutes.</p>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:20}}>
              {[["🛡️","Trust Score","Builds with every job"],["💰","Smart Escrow","Every payment protected"],["🏆","NFT Badge","On-chain forever"]].map(([ic,t,d],i)=>(
                <div key={i} style={{padding:12,background:"rgba(26,107,255,0.06)",border:"1px solid rgba(26,107,255,0.14)",borderRadius:12,textAlign:"center"}}>
                  <div style={{fontSize:"1.4rem",marginBottom:5}}>{ic}</div>
                  <div style={{fontWeight:700,fontSize:"0.78rem",marginBottom:2}}>{t}</div>
                  <div style={{fontSize:"0.62rem",color:"rgba(255,255,255,0.38)",lineHeight:1.4}}>{d}</div>
                </div>
              ))}
            </div>
            <div style={{marginBottom:16}}>
              <label style={{fontSize:"0.68rem",fontWeight:700,color:"rgba(255,255,255,0.4)",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:6,display:"block"}}>Your Full Name</label>
              <input value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Alex Chen" style={{width:"100%",padding:"12px 16px",background:"rgba(6,18,41,0.8)",border:"1px solid rgba(26,107,255,0.2)",borderRadius:10,color:"white",fontSize:"0.92rem",outline:"none"}}/>
            </div>
            <button onClick={()=>setStep(1)} disabled={!name} style={{width:"100%",padding:"13px",background:"linear-gradient(135deg,#1a6bff,#0050dd)",border:"none",borderRadius:10,color:"white",fontWeight:800,fontSize:"0.95rem",cursor:"pointer",opacity:!name?0.4:1}}>
              Let's Go <ArrowRight size={16} style={{display:"inline",marginLeft:6}}/>
            </button>
          </div>
        )}

        {step===1&&(
          <div style={card}>
            <h2 style={{fontSize:"1.2rem",fontWeight:900,marginBottom:16}}>What do you do, {name.split(" ")[0]}?</h2>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:7,marginBottom:14}}>
              {CATS.map(([ic,c])=>(
                <button key={String(c)} onClick={()=>setCat(String(c))} style={{padding:"10px 6px",background:cat===c?"rgba(26,107,255,0.15)":"rgba(26,107,255,0.04)",border:`1px solid ${cat===c?"rgba(26,107,255,0.45)":"rgba(26,107,255,0.1)"}`,borderRadius:10,cursor:"pointer",textAlign:"center"}}>
                  <div style={{fontSize:"1.2rem",marginBottom:3}}>{ic}</div>
                  <div style={{fontSize:"0.64rem",fontWeight:700,color:cat===c?"#4da6ff":"rgba(255,255,255,0.5)"}}>{c}</div>
                </button>
              ))}
            </div>
            <div style={{marginBottom:12}}>
              <label style={{fontSize:"0.68rem",fontWeight:700,color:"rgba(255,255,255,0.4)",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:6,display:"block"}}>Professional Title</label>
              <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="e.g. Full-Stack React Developer" style={{width:"100%",padding:"11px 14px",background:"rgba(6,18,41,0.8)",border:"1px solid rgba(26,107,255,0.2)",borderRadius:9,color:"white",fontSize:"0.88rem",outline:"none",marginBottom:10}}/>
              <label style={{fontSize:"0.68rem",fontWeight:700,color:"rgba(255,255,255,0.4)",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:6,display:"block"}}>Top Skills</label>
              <div style={{display:"flex",gap:7,marginBottom:8}}>
                <input value={si} onChange={e=>setSi(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addSkill()} placeholder="Add skill + Enter" style={{flex:1,padding:"10px 13px",background:"rgba(6,18,41,0.8)",border:"1px solid rgba(26,107,255,0.2)",borderRadius:9,color:"white",fontSize:"0.85rem",outline:"none"}}/>
                <button onClick={addSkill} style={{padding:"10px 14px",background:"rgba(26,107,255,0.12)",border:"1px solid rgba(26,107,255,0.25)",borderRadius:9,color:"#4da6ff",cursor:"pointer",fontWeight:700}}><Plus size={15}/></button>
              </div>
              <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                {skills.map(s=><span key={s} style={{display:"flex",alignItems:"center",gap:5,padding:"5px 11px",background:"rgba(26,107,255,0.1)",border:"1px solid rgba(26,107,255,0.22)",borderRadius:7,fontSize:"0.76rem",color:"#4da6ff",fontWeight:600}}>{s}<button onClick={()=>setSkills(p=>p.filter(x=>x!==s))} style={{background:"none",border:"none",cursor:"pointer",color:"rgba(255,255,255,0.35)",padding:0}}><X size={11}/></button></span>)}
              </div>
            </div>
            <div style={{display:"flex",gap:10}}>
              <button onClick={()=>setStep(0)} style={{flex:1,padding:"11px",borderRadius:10,border:"1px solid rgba(26,107,255,0.15)",background:"transparent",color:"rgba(255,255,255,0.5)",cursor:"pointer"}}>Back</button>
              <button onClick={()=>setStep(2)} disabled={!cat||skills.length===0} style={{flex:2,padding:"12px",background:"linear-gradient(135deg,#1a6bff,#0050dd)",border:"none",borderRadius:10,color:"white",fontWeight:700,cursor:"pointer",opacity:!cat||skills.length===0?0.4:1}}>Continue</button>
            </div>
          </div>
        )}

        {step===2&&(
          <div style={card}>
            <h2 style={{fontSize:"1.2rem",fontWeight:900,marginBottom:16}}>Rate & Availability</h2>
            <div style={{marginBottom:14}}>
              <label style={{fontSize:"0.68rem",fontWeight:700,color:"rgba(255,255,255,0.4)",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:6,display:"block"}}>Hourly Rate (USD)</label>
              <input value={rate} onChange={e=>setRate(e.target.value)} type="number" placeholder="150" style={{width:"100%",padding:"13px 16px",background:"rgba(6,18,41,0.8)",border:"1px solid rgba(26,107,255,0.2)",borderRadius:9,color:"white",fontSize:"1.1rem",fontWeight:700,outline:"none"}}/>
              <div style={{fontSize:"0.68rem",color:"rgba(255,255,255,0.3)",marginTop:5}}>Market avg for {cat||"your category"}: $75-$165/hr</div>
            </div>
            <div style={{marginBottom:16}}>
              <label style={{fontSize:"0.68rem",fontWeight:700,color:"rgba(255,255,255,0.4)",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:7,display:"block"}}>Availability</label>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:7}}>
                {[["full-time","Full-time","40h/wk"],["part-time","Part-time","20h/wk"],["project","Projects","As needed"]].map(([v,l,d])=>(
                  <button key={v} onClick={()=>setHours(v)} style={{padding:"10px 8px",background:hours===v?"rgba(26,107,255,0.14)":"rgba(26,107,255,0.04)",border:`1px solid ${hours===v?"rgba(26,107,255,0.4)":"rgba(26,107,255,0.1)"}`,borderRadius:9,cursor:"pointer",textAlign:"center"}}>
                    <div style={{fontWeight:700,fontSize:"0.8rem",color:hours===v?"#4da6ff":"rgba(255,255,255,0.6)",marginBottom:2}}>{l}</div>
                    <div style={{fontSize:"0.62rem",color:"rgba(255,255,255,0.35)"}}>{d}</div>
                  </button>
                ))}
              </div>
            </div>
            <div style={{display:"flex",gap:10}}>
              <button onClick={()=>setStep(1)} style={{flex:1,padding:"11px",borderRadius:10,border:"1px solid rgba(26,107,255,0.15)",background:"transparent",color:"rgba(255,255,255,0.5)",cursor:"pointer"}}>Back</button>
              <button onClick={()=>setStep(3)} disabled={!rate} style={{flex:2,padding:"12px",background:"linear-gradient(135deg,#1a6bff,#0050dd)",border:"none",borderRadius:10,color:"white",fontWeight:700,cursor:"pointer",opacity:!rate?0.4:1}}>Continue</button>
            </div>
          </div>
        )}

        {step===3&&(
          <div style={{...card,textAlign:"center"}}>
            {!verified?(
              <>
                <div style={{display:"flex",justifyContent:"center",marginBottom:14}}><VeritasVerifiedBadge score={350} size={130}/></div>
                <h2 style={{fontSize:"1.2rem",fontWeight:900,marginBottom:8}}>Verify Your Identity</h2>
                <p style={{color:"rgba(255,255,255,0.5)",marginBottom:20,fontSize:"0.85rem",lineHeight:1.65}}>Verified workers earn <strong style={{color:"#f0c040"}}>3x more</strong> and get priority AI matching.</p>
                <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:20,textAlign:"left"}}>
                  {[["✅","Email","Confirmed",true],["📱","Phone","Add for +10 pts",false],["🪪","Government ID","Add for +20 pts",false]].map(([ic,l,d,done],i)=>(
                    <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"11px 14px",background:done?"rgba(0,200,83,0.06)":"rgba(26,107,255,0.04)",border:`1px solid ${done?"rgba(0,200,83,0.2)":"rgba(26,107,255,0.12)"}`,borderRadius:10}}>
                      <span style={{fontSize:"1.1rem"}}>{ic}</span>
                      <div style={{flex:1}}><div style={{fontWeight:600,fontSize:"0.85rem",color:done?"#00e676":"white"}}>{l}</div><div style={{fontSize:"0.65rem",color:"rgba(255,255,255,0.38)"}}>{d}</div></div>
                      {done&&<CheckCircle2 size={15} color="#00e676"/>}
                    </div>
                  ))}
                </div>
                <div style={{display:"flex",gap:10}}>
                  <button onClick={()=>setStep(2)} style={{flex:1,padding:"11px",borderRadius:10,border:"1px solid rgba(26,107,255,0.15)",background:"transparent",color:"rgba(255,255,255,0.5)",cursor:"pointer"}}>Back</button>
                  <button onClick={verify} disabled={verifying} style={{flex:2,padding:"12px",background:"linear-gradient(135deg,#1a6bff,#0050dd)",border:"none",borderRadius:10,color:"white",fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                    {verifying?<><Loader2 size={16} style={{animation:"spin 1s linear infinite"}}/>Verifying...</>:<><Shield size={16}/>Verify Now</>}
                  </button>
                </div>
              </>
            ):(
              <>
                <div style={{display:"flex",justifyContent:"center",marginBottom:14}}><NewMemberBadge size={120}/></div>
                <h2 style={{fontSize:"1.3rem",fontWeight:900,marginBottom:6,color:"#00e676"}}>Verified!</h2>
                <p style={{color:"rgba(255,255,255,0.5)",marginBottom:16,fontSize:"0.85rem"}}>New Member badge earned. +30 Trust Score.</p>
                <button onClick={()=>setStep(4)} style={{width:"100%",padding:"12px",background:"linear-gradient(135deg,#1a6bff,#0050dd)",border:"none",borderRadius:10,color:"white",fontWeight:700,cursor:"pointer"}}>Almost Done</button>
              </>
            )}
          </div>
        )}

        {step===4&&(
          <div style={{...card,textAlign:"center"}}>
            <div style={{display:"flex",justifyContent:"center",marginBottom:14}}><VeritasVerifiedBadge score={verified?420:350} size={150}/></div>
            <h2 style={{fontSize:"1.5rem",fontWeight:900,marginBottom:6}}>You're Live, {name.split(" ")[0]}!</h2>
            <p style={{color:"rgba(255,255,255,0.5)",marginBottom:20,fontSize:"0.87rem",lineHeight:1.65}}>Your profile is active. AI is scanning for job matches now.</p>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:20}}>
              {[["Trust Score",verified?"420":"350","#00e676"],["AI Matches","14","#f0c040"],["Badges",verified?"2":"1","#4da6ff"]].map(([l,v,c],i)=>(
                <div key={i} style={{padding:12,background:"rgba(26,107,255,0.08)",border:"1px solid rgba(26,107,255,0.18)",borderRadius:12}}>
                  <div style={{fontSize:"1.6rem",fontWeight:900,color:c,lineHeight:1,marginBottom:3}}>{v}</div>
                  <div style={{fontSize:"0.65rem",color:"rgba(255,255,255,0.4)"}}>{l}</div>
                </div>
              ))}
            </div>
            <button onClick={finish} style={{width:"100%",padding:"14px",background:"linear-gradient(135deg,#d4af37,#c9a227,#a07810)",border:"none",borderRadius:10,color:"#0a0800",fontWeight:800,fontSize:"0.95rem",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
              {finishing?<><Loader2 size={18} style={{animation:"spin 1s linear infinite"}}/>Entering...</>:<><Sparkles size={18}/>Enter Veritas</>}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
