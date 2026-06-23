
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Shield } from "lucide-react";
import { VeritasEmblem, VeritasVerifiedBadge, NewMemberBadge } from "@/components/badges/VeritasBadges";

export default function WaitlistPage() {
  const router = useRouter();
  const [email,setEmail]     = useState("");
  const [role,setRole]       = useState<"worker"|"client"|"">("");
  const [submitting,setSub]  = useState(false);
  const [joined,setJoined]   = useState(false);
  const [position,setPos]    = useState(0);
  const [cd,setCd]           = useState({days:14,hours:7,mins:32,secs:18});

  useEffect(()=>{
    const t=setInterval(()=>setCd(c=>{
      let {days,hours,mins,secs}=c; secs--;
      if(secs<0){secs=59;mins--;} if(mins<0){mins=59;hours--;} if(hours<0){hours=23;days--;}
      return {days,hours,mins,secs};
    }),1000);
    return()=>clearInterval(t);
  },[]);

  function join(){
    if(!email||!role)return;
    setSub(true);
    setTimeout(()=>{setSub(false);setJoined(true);setPos(Math.floor(Math.random()*500)+100);},1200);
  }

  return (
    <div style={{minHeight:"100vh",background:"#010812",display:"flex",alignItems:"center",justifyContent:"center",padding:16,position:"relative"}}>
      {/* Background dot grid */}
      <div style={{position:"absolute",inset:0,backgroundImage:"radial-gradient(circle,rgba(26,107,255,0.2) 1px,transparent 1px)",backgroundSize:"26px 26px",opacity:0.2}}/>
      <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse 60% 60% at 50% 40%,rgba(26,107,255,0.1) 0%,transparent 70%)"}}/>

      <div style={{position:"relative",zIndex:10,width:"100%",maxWidth:460}}>
        {/* Logo */}
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8,marginBottom:28}}>
          <VeritasEmblem size={72}/>
          <div style={{fontSize:"0.62rem",fontWeight:600,letterSpacing:"0.25em",color:"#00d4ff",textTransform:"uppercase"}}>Truth Becomes Trust</div>
        </div>

        {!joined?(
          <div style={{background:"linear-gradient(135deg,rgba(4,15,36,0.98),rgba(6,18,41,0.95))",border:"1.5px solid rgba(240,192,64,0.25)",borderRadius:24,padding:28,color:"white"}}>
            {/* Countdown */}
            <div style={{textAlign:"center",marginBottom:24}}>
              <div style={{fontSize:"0.62rem",fontWeight:700,letterSpacing:"0.25em",color:"#00d4ff",textTransform:"uppercase",marginBottom:14}}>Launching In</div>
              <div style={{display:"flex",justifyContent:"center",gap:10}}>
                {[["days",cd.days],["hours",cd.hours],["mins",cd.mins],["secs",cd.secs]].map(([l,v])=>(
                  <div key={l} style={{textAlign:"center"}}>
                    <div style={{width:62,height:62,background:"rgba(26,107,255,0.1)",border:"1px solid rgba(26,107,255,0.2)",borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.8rem",fontWeight:900,color:"#f0c040"}}>{String(v).padStart(2,"0")}</div>
                    <div style={{fontSize:"0.58rem",color:"rgba(255,255,255,0.35)",marginTop:4,textTransform:"uppercase",letterSpacing:"0.1em"}}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
            <h2 style={{fontSize:"1.5rem",fontWeight:900,textAlign:"center",marginBottom:4}}>Join the Waitlist</h2>
            <p style={{fontSize:"0.82rem",color:"rgba(255,255,255,0.45)",textAlign:"center",marginBottom:20,lineHeight:1.6}}>Be first to access the most advanced Web3 gig marketplace. Early members get <strong style={{color:"#f0c040"}}>lifetime 1% platform fee</strong>.</p>
            <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:16}}>
              <input value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="your@email.com"
                style={{padding:"12px 16px",background:"rgba(6,18,41,0.8)",border:"1px solid rgba(26,107,255,0.2)",borderRadius:10,color:"white",fontSize:"0.9rem",outline:"none"}}/>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                {[{id:"worker",label:"👷 I'm a Freelancer"},{id:"client",label:"🏢 I'm a Client"}].map(r=>(
                  <button key={r.id} onClick={()=>setRole(r.id as any)} style={{padding:"12px",borderRadius:10,border:`1px solid ${role===r.id?"rgba(240,192,64,0.4)":"rgba(26,107,255,0.2)"}`,background:role===r.id?"rgba(240,192,64,0.1)":"rgba(26,107,255,0.06)",color:role===r.id?"#f0c040":"rgba(255,255,255,0.5)",fontSize:"0.82rem",fontWeight:600,cursor:"pointer"}}>
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={join} disabled={!email||!role||submitting} style={{width:"100%",padding:"14px",background:"linear-gradient(135deg,#1a6bff,#0050dd)",border:"none",borderRadius:10,color:"white",fontWeight:800,fontSize:"1rem",cursor:"pointer",boxShadow:"0 4px 20px rgba(26,107,255,0.4)",opacity:(!email||!role)?0.5:1}}>
              {submitting?"Reserving...":"⚡ Reserve My Spot"}
            </button>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginTop:16,paddingTop:14,borderTop:"1px solid rgba(26,107,255,0.1)"}}>
              {[["4,847","On waitlist"],["#1","Fastest payout"],["$0","To join"]].map(([v,l],i)=>(
                <div key={i} style={{textAlign:"center"}}><div style={{fontWeight:900,fontSize:"1rem",color:"#f0c040"}}>{v}</div><div style={{fontSize:"0.6rem",color:"rgba(255,255,255,0.35)",marginTop:2}}>{l}</div></div>
              ))}
            </div>
          </div>
        ):(
          <div style={{background:"linear-gradient(135deg,rgba(4,15,36,0.98),rgba(6,18,41,0.95))",border:"1.5px solid rgba(0,200,83,0.3)",borderRadius:24,padding:28,color:"white",textAlign:"center"}}>
            <div style={{display:"flex",justifyContent:"center",marginBottom:16}}><NewMemberBadge size={120}/></div>
            <h2 style={{fontSize:"1.6rem",fontWeight:900,marginBottom:6}}>You're In!</h2>
            <p style={{color:"rgba(255,255,255,0.5)",marginBottom:20,fontSize:"0.88rem"}}>You're <span style={{color:"#f0c040",fontWeight:800}}>#{position}</span> on the waitlist. Check your email shortly.</p>
            <div style={{display:"flex",flexDirection:"column",gap:8,textAlign:"left",marginBottom:16}}>
              {["Lifetime 1% platform fee (normally 3%)","Early access to all premium features","Founding member badge on your profile","Direct line to the founding team"].map((b,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:8,fontSize:"0.82rem",color:"rgba(255,255,255,0.7)"}}>
                  <CheckCircle2 size={14} color="#00e676" style={{flexShrink:0}}/>{b}
                </div>
              ))}
            </div>
            <button onClick={()=>router.push("/")} style={{padding:"11px 28px",background:"rgba(26,107,255,0.1)",border:"1px solid rgba(26,107,255,0.25)",borderRadius:10,color:"#4da6ff",fontSize:"0.85rem",fontWeight:600,cursor:"pointer"}}>Back to Home</button>
          </div>
        )}
      </div>
    </div>
  );
}
