
"use client";
import { useState } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import TopBar from "@/components/topbar/TopBar";
import { VeritasVerifiedBadge } from "@/components/badges/VeritasBadges";
import { ShieldCheck, CheckCircle2, Upload, Loader2, Zap, Lock, AlertCircle, Camera, Phone, Mail, CreditCard, Globe, Award } from "lucide-react";

const STEPS = [
  { id:"email",    icon:Mail,       label:"Email",              sub:"Verify your email address",           pts:50,  done:true,  required:true  },
  { id:"phone",    icon:Phone,      label:"Phone Number",       sub:"SMS verification — takes 30 seconds", pts:100, done:true,  required:true  },
  { id:"id",       icon:CreditCard, label:"Government ID",      sub:"Passport, driver's license, or ID",   pts:200, done:false, required:false },
  { id:"address",  icon:Globe,      label:"Address",            sub:"Utility bill or bank statement",       pts:100, done:false, required:false },
  { id:"biometric",icon:Camera,     label:"Face Verification",  sub:"Selfie match with your ID",           pts:150, done:false, required:false },
  { id:"skills",   icon:Award,      label:"Skills Assessment",  sub:"Pass a skill test for your category",  pts:200, done:false, required:false },
];

export default function VerifyV2Page() {
  const [steps, setSteps]       = useState(STEPS);
  const [expanded, setExpanded] = useState<string|null>("id");
  const [verifying, setVerifying] = useState<string|null>(null);

  const doneCount  = steps.filter(s=>s.done).length;
  const earnedPts  = steps.reduce((a,s)=>a+(s.done?s.pts:0), 0);
  const totalPts   = steps.reduce((a,s)=>a+s.pts, 0);
  const pct        = Math.round((doneCount/steps.length)*100);
  const trustScore = 350 + earnedPts;

  function verify(id:string) {
    setVerifying(id);
    setTimeout(()=>{
      setSteps(p=>p.map(s=>s.id===id?{...s,done:true}:s));
      setVerifying(null);
      setExpanded(null);
    }, 2000);
  }

  return (
    <div style={{display:"flex",minHeight:"100vh",background:"#010812"}}>
      <Sidebar/>
      <div style={{flex:1,display:"flex",flexDirection:"column"}}>
        <TopBar/>
        <main style={{flex:1,overflowY:"auto",padding:24,color:"white"}}>

          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:24}}>
            <ShieldCheck size={28} color="#1a6bff"/>
            <h1 style={{fontSize:"1.8rem",fontWeight:900,margin:0}}>Identity Verification</h1>
          </div>

          {/* Hero + Badge */}
          <div style={{display:"grid",gridTemplateColumns:"1fr auto",gap:20,marginBottom:20,alignItems:"start"}}>
            <div style={{background:"rgba(4,15,36,0.95)",border:"1px solid rgba(26,107,255,0.18)",borderRadius:18,padding:22}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
                <div>
                  <div style={{fontSize:"0.68rem",fontWeight:700,color:"rgba(255,255,255,0.4)",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:4}}>Verification Progress</div>
                  <div style={{fontSize:"2rem",fontWeight:900,color:"#00e676",lineHeight:1,marginBottom:2}}>{doneCount}/{steps.length}</div>
                  <div style={{fontSize:"0.75rem",color:"rgba(255,255,255,0.45)"}}>steps complete · +{earnedPts} Trust Score pts earned</div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontSize:"2rem",fontWeight:900,color:"#4da6ff"}}>{trustScore}</div>
                  <div style={{fontSize:"0.7rem",color:"rgba(255,255,255,0.38)"}}>Current Score</div>
                  <div style={{fontSize:"0.65rem",color:"#00e676",marginTop:2}}>+{totalPts-earnedPts} pts available</div>
                </div>
              </div>
              <div style={{height:8,background:"rgba(26,107,255,0.08)",borderRadius:4,overflow:"hidden",marginBottom:6}}>
                <div style={{width:`${pct}%`,height:"100%",background:"linear-gradient(90deg,#1a6bff,#00e676)",borderRadius:4,transition:"width 0.8s"}}/>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:"0.65rem",color:"rgba(255,255,255,0.3)"}}>
                <span>{pct}% complete</span>
                <span>{totalPts-earnedPts} pts remaining</span>
              </div>
            </div>
            <div style={{flexShrink:0}}>
              <VeritasVerifiedBadge score={trustScore} size={160}/>
            </div>
          </div>

          {/* Verification steps */}
          <div style={{maxWidth:680,display:"flex",flexDirection:"column",gap:10}}>
            {steps.map(s=>{
              const Icon = s.icon;
              const isExp = expanded===s.id;
              return(
                <div key={s.id} style={{background:"rgba(4,15,36,0.9)",border:`1px solid ${s.done?"rgba(0,200,83,0.2)":isExp?"rgba(26,107,255,0.35)":"rgba(26,107,255,0.12)"}`,borderRadius:14,overflow:"hidden",transition:"border-color 0.2s"}}>
                  <div onClick={()=>!s.done&&setExpanded(isExp?null:s.id)} style={{display:"flex",alignItems:"center",gap:14,padding:"16px 18px",cursor:s.done?"default":"pointer"}}>
                    <div style={{width:44,height:44,borderRadius:12,background:s.done?"rgba(0,200,83,0.1)":"rgba(26,107,255,0.08)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                      {s.done?<CheckCircle2 size={22} color="#00e676"/>:<Icon size={20} color={isExp?"#4da6ff":"rgba(255,255,255,0.4)"}/>}
                    </div>
                    <div style={{flex:1}}>
                      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:2}}>
                        <span style={{fontWeight:700,fontSize:"0.92rem",color:s.done?"#00e676":"white"}}>{s.label}</span>
                        {s.required&&!s.done&&<span style={{fontSize:"0.58rem",padding:"2px 6px",background:"rgba(26,107,255,0.1)",border:"1px solid rgba(26,107,255,0.2)",borderRadius:4,color:"#4da6ff",fontWeight:700}}>REQUIRED</span>}
                      </div>
                      <div style={{fontSize:"0.72rem",color:"rgba(255,255,255,0.4)"}}>{s.sub}</div>
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
                      <div style={{textAlign:"right"}}>
                        <div style={{fontSize:"0.88rem",fontWeight:800,color:s.done?"#00e676":"#4da6ff"}}>+{s.pts} pts</div>
                      </div>
                      {s.done?(
                        <span style={{fontSize:"0.65rem",padding:"3px 8px",background:"rgba(0,200,83,0.1)",border:"1px solid rgba(0,200,83,0.2)",borderRadius:5,color:"#00e676",fontWeight:700}}>Verified</span>
                      ):(
                        <span style={{fontSize:"0.65rem",color:"rgba(255,255,255,0.3)"}}>Pending</span>
                      )}
                    </div>
                  </div>

                  {isExp&&!s.done&&(
                    <div style={{padding:"0 18px 18px",borderTop:"1px solid rgba(26,107,255,0.08)"}}>
                      <div style={{padding:12,background:"rgba(240,192,64,0.05)",border:"1px solid rgba(240,192,64,0.15)",borderRadius:10,marginBottom:14,fontSize:"0.78rem",color:"rgba(255,255,255,0.55)",lineHeight:1.6,display:"flex",gap:8}}>
                        <AlertCircle size={14} color="#f0c040" style={{flexShrink:0,marginTop:2}}/><span>Your document is encrypted and processed securely. We never store raw ID images.</span>
                      </div>
                      <div style={{border:"2px dashed rgba(26,107,255,0.2)",borderRadius:12,padding:24,textAlign:"center",marginBottom:12,cursor:"pointer",transition:"border-color 0.2s"}}
                        onMouseEnter={e=>(e.currentTarget.style.borderColor="rgba(26,107,255,0.45)")}
                        onMouseLeave={e=>(e.currentTarget.style.borderColor="rgba(26,107,255,0.2)")}>
                        <Upload size={24} color="rgba(255,255,255,0.3)" style={{margin:"0 auto 8px"}}/>
                        <div style={{fontSize:"0.85rem",color:"rgba(255,255,255,0.5)"}}>Drop file or <span style={{color:"#4da6ff",cursor:"pointer"}}>browse</span></div>
                        <div style={{fontSize:"0.65rem",color:"rgba(255,255,255,0.3)",marginTop:4}}>JPG, PNG, PDF · Max 10MB</div>
                      </div>
                      <button onClick={()=>verify(s.id)} disabled={verifying===s.id} style={{width:"100%",padding:"12px",background:"linear-gradient(135deg,#1a6bff,#0050dd)",border:"none",borderRadius:10,color:"white",fontWeight:700,fontSize:"0.88rem",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,boxShadow:"0 3px 14px rgba(26,107,255,0.35)",opacity:verifying?0.7:1}}>
                        {verifying===s.id?<><Loader2 size={16} style={{animation:"spin 1s linear infinite"}}/>Verifying...</>:<><ShieldCheck size={16}/>Submit for Verification (+{s.pts} pts)</>}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}
