
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { VeritasEmblem } from "@/components/badges/VeritasBadges";
import { Lock, Unlock, CheckCircle2, AlertCircle, DollarSign, Shield, ArrowRight, Loader2 } from "lucide-react";

type StepStatus = "pending"|"active"|"done"|"dispute";

export default function EscrowSimulatorPage(){
  const router=useRouter();
  const [step,setStep]=useState(0);
  const [loading,setLoading]=useState(false);
  const [disputed,setDisputed]=useState(false);

  const totalValue=10000;
  const platformFee=totalValue*0.02;
  const workerReceives=totalValue-platformFee;

  const FLOW=[
    {title:"Client Posts Job",          desc:"Client creates job listing. Budget: $10,000 fixed price.",             icon:"📋",who:"client"},
    {title:"Worker Applies & Match",     desc:"AI match engine scores you 97%. You submit a proposal.",              icon:"⚡",who:"worker"},
    {title:"Contract Signed",           desc:"Both parties sign the AI-generated contract on Veritas.",             icon:"✍️",who:"both"},
    {title:"Escrow Funded",             desc:"Client deposits $10,000 into Veritas smart contract escrow.",         icon:"🔒",who:"client"},
    {title:"Work Completed",            desc:"You deliver Milestone 1. Mark it complete on the platform.",          icon:"✅",who:"worker"},
    {title:"Client Reviews & Approves", desc:"Client reviews deliverables and clicks Approve.",                     icon:"👍",who:"client"},
    {title:"Escrow Released",           desc:"$9,800 released to your wallet. $200 platform fee (2%) deducted.",    icon:"💰",who:"system"},
    {title:"Reviews & Score Update",    desc:"Client leaves 5-star review. Your Trust Score increases by 3 points.",icon:"⭐",who:"system"},
  ];

  function advance(){
    if(step>=FLOW.length-1)return;
    setLoading(true);
    setTimeout(()=>{setLoading(false);setStep(s=>s+1);},700);
  }

  return(
    <div style={{minHeight:"100vh",background:"#010812",color:"white"}}>
      <nav style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 28px",borderBottom:"1px solid rgba(26,107,255,0.1)",position:"sticky",top:0,background:"rgba(1,8,18,0.97)",backdropFilter:"blur(20px)",zIndex:50}}>
        <div style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer"}} onClick={()=>router.push("/")}>
          <VeritasEmblem size={34}/>
          <div><div style={{fontSize:"1rem",fontWeight:900}}>VERITAS</div><div style={{fontSize:"0.5rem",fontWeight:600,letterSpacing:"0.2em",color:"#00d4ff",textTransform:"uppercase"}}>Truth Becomes Trust</div></div>
        </div>
        <button onClick={()=>router.push("/onboarding")} style={{padding:"9px 18px",borderRadius:9,background:"linear-gradient(135deg,#1a6bff,#0050dd)",border:"none",color:"white",fontSize:"0.82rem",cursor:"pointer",fontWeight:700}}>Get Started</button>
      </nav>

      <div style={{maxWidth:860,margin:"0 auto",padding:"48px 24px"}}>
        <div style={{textAlign:"center",marginBottom:40}}>
          <h1 style={{fontSize:"2.5rem",fontWeight:900,marginBottom:8}}>How Veritas Escrow Works</h1>
          <p style={{color:"rgba(255,255,255,0.45)",fontSize:"0.95rem"}}>Step through a real $10,000 contract — see exactly how every dollar is protected.</p>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 320px",gap:24}}>
          <div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {FLOW.map((f,i)=>(
                <div key={i} style={{display:"flex",gap:14,padding:"14px 16px",background:i===step?"rgba(26,107,255,0.1)":i<step?"rgba(0,200,83,0.05)":"rgba(26,107,255,0.02)",border:`1px solid ${i===step?"rgba(26,107,255,0.4)":i<step?"rgba(0,200,83,0.2)":"rgba(26,107,255,0.08)"}`,borderRadius:14,transition:"all 0.3s",opacity:i>step?0.4:1}}>
                  <div style={{fontSize:"1.4rem",flexShrink:0,marginTop:2}}>{i<step?"✅":f.icon}</div>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:700,fontSize:"0.9rem",marginBottom:3,color:i===step?"white":i<step?"#00e676":"rgba(255,255,255,0.6)"}}>{f.title}</div>
                    <div style={{fontSize:"0.78rem",color:"rgba(255,255,255,0.45)",lineHeight:1.5}}>{f.desc}</div>
                    <div style={{fontSize:"0.62rem",color:f.who==="client"?"#4da6ff":f.who==="worker"?"#f0c040":f.who==="both"?"#a78bfa":"rgba(255,255,255,0.3)",fontWeight:600,marginTop:4,textTransform:"uppercase",letterSpacing:"0.08em"}}>{f.who==="both"?"Both parties":f.who==="system"?"System":f.who==="client"?"Client action":"Your action"}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{display:"flex",gap:10,marginTop:16}}>
              {step<FLOW.length-1?(
                <button onClick={advance} disabled={loading} style={{flex:2,padding:"13px",background:"linear-gradient(135deg,#1a6bff,#0050dd)",border:"none",borderRadius:10,color:"white",fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                  {loading?<Loader2 size={16} style={{animation:"spin 1s linear infinite"}}/>:<ArrowRight size={16}/>}{loading?"Processing...":"Next Step"}
                </button>
              ):(
                <button onClick={()=>{setStep(0);setDisputed(false);}} style={{flex:2,padding:"13px",background:"rgba(26,107,255,0.1)",border:"1px solid rgba(26,107,255,0.25)",borderRadius:10,color:"#4da6ff",fontWeight:700,cursor:"pointer"}}>Replay Simulation</button>
              )}
              <button onClick={()=>setStep(0)} style={{flex:1,padding:"13px",borderRadius:10,border:"1px solid rgba(26,107,255,0.15)",background:"transparent",color:"rgba(255,255,255,0.45)",cursor:"pointer"}}>Reset</button>
            </div>
          </div>

          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <div style={{background:"rgba(4,15,36,0.95)",border:"1px solid rgba(26,107,255,0.2)",borderRadius:16,padding:18}}>
              <div style={{fontWeight:800,marginBottom:12,fontSize:"0.88rem",display:"flex",alignItems:"center",gap:7}}><DollarSign size={16} color="#f0c040"/>Contract Summary</div>
              {[["Contract Value","$"+totalValue.toLocaleString(),"white"],["Platform Fee (2%)","$"+platformFee,"rgba(255,200,100,0.8)"],["You Receive","$"+workerReceives.toLocaleString(),"#00e676"]].map(([l,v,c],i)=>(
                <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"9px 0",borderBottom:i<2?"1px solid rgba(26,107,255,0.07)":"none",fontSize:"0.85rem"}}>
                  <span style={{color:"rgba(255,255,255,0.5)"}}>{l}</span>
                  <span style={{fontWeight:800,color:c}}>{v}</span>
                </div>
              ))}
            </div>

            <div style={{background:"rgba(4,15,36,0.9)",border:"1px solid rgba(26,107,255,0.14)",borderRadius:16,padding:18}}>
              <div style={{fontWeight:800,marginBottom:10,fontSize:"0.88rem",display:"flex",alignItems:"center",gap:7}}><Shield size={16} color="#4da6ff"/>Progress</div>
              <div style={{height:6,background:"rgba(26,107,255,0.08)",borderRadius:3,overflow:"hidden",marginBottom:8}}>
                <div style={{width:`${(step/( FLOW.length-1))*100}%`,height:"100%",background:"linear-gradient(90deg,#1a6bff,#00e676)",borderRadius:3,transition:"width 0.4s"}}/>
              </div>
              <div style={{fontSize:"0.75rem",color:"rgba(255,255,255,0.4)",textAlign:"center"}}>Step {step+1} of {FLOW.length}</div>
            </div>

            {step>=3&&step<6&&(
              <div style={{padding:14,background:"rgba(26,107,255,0.07)",border:"1px solid rgba(26,107,255,0.2)",borderRadius:14,display:"flex",gap:10,alignItems:"flex-start"}}>
                <Lock size={16} color="#4da6ff" style={{flexShrink:0,marginTop:2}}/>
                <div style={{fontSize:"0.78rem",color:"rgba(255,255,255,0.6)",lineHeight:1.6}}><strong style={{color:"#4da6ff"}}>$10,000 locked in escrow.</strong> Neither party can access funds until milestones are approved.</div>
              </div>
            )}
            {step>=6&&(
              <div style={{padding:14,background:"rgba(0,200,83,0.07)",border:"1px solid rgba(0,200,83,0.2)",borderRadius:14,display:"flex",gap:10,alignItems:"flex-start"}}>
                <CheckCircle2 size={16} color="#00e676" style={{flexShrink:0,marginTop:2}}/>
                <div style={{fontSize:"0.78rem",color:"rgba(255,255,255,0.6)",lineHeight:1.6}}><strong style={{color:"#00e676"}}>$9,800 released!</strong> On-chain transaction confirmed. Funds in your wallet within minutes.</div>
              </div>
            )}

            <button onClick={()=>router.push("/onboarding")} style={{padding:"13px",background:"linear-gradient(135deg,#d4af37,#c9a227,#a07810)",border:"none",borderRadius:12,color:"#0a0800",fontWeight:800,cursor:"pointer",fontSize:"0.9rem"}}>Start Your First Contract →</button>
          </div>
        </div>
      </div>
    </div>
  );
}
