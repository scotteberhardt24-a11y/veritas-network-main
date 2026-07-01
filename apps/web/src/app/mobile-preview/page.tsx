
"use client";
import { useRouter } from "next/navigation";
import { VeritasEmblem, VeritasVerifiedBadge } from "@/components/badges/VeritasBadges";
import { Shield, Zap, Bell, Star, DollarSign, ArrowRight, CheckCircle2 } from "lucide-react";

export default function MobilePreviewPage(){
  const router=useRouter();
  return(
    <div style={{minHeight:"100vh",background:"#010812",color:"white"}}>
      <nav style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 28px",borderBottom:"1px solid rgba(26,107,255,0.1)",position:"sticky",top:0,background:"rgba(1,8,18,0.97)",backdropFilter:"blur(20px)",zIndex:50}}>
        <div style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer"}} onClick={()=>router.push("/")}>
          <VeritasEmblem size={34}/>
          <div><div style={{fontSize:"1rem",fontWeight:900}}>VERITAS</div><div style={{fontSize:"0.5rem",fontWeight:600,letterSpacing:"0.2em",color:"#00d4ff",textTransform:"uppercase"}}>Truth Becomes Trust</div></div>
        </div>
        <button onClick={()=>router.push("/onboarding")} style={{padding:"9px 18px",borderRadius:9,background:"linear-gradient(135deg,#1a6bff,#0050dd)",border:"none",color:"white",fontSize:"0.82rem",cursor:"pointer",fontWeight:700}}>Get Started</button>
      </nav>
      <div style={{maxWidth:1100,margin:"0 auto",padding:"60px 24px"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:60,alignItems:"center"}}>
          <div>
            <div style={{display:"inline-flex",alignItems:"center",gap:8,padding:"7px 16px",background:"rgba(26,107,255,0.08)",border:"1px solid rgba(26,107,255,0.2)",borderRadius:30,fontSize:"0.75rem",color:"#4da6ff",fontWeight:600,marginBottom:20}}>📱 Mobile App — Coming Soon</div>
            <h1 style={{fontSize:"3rem",fontWeight:900,lineHeight:1.15,marginBottom:16}}>Your Trust Score in Your Pocket</h1>
            <p style={{color:"rgba(255,255,255,0.5)",fontSize:"1rem",lineHeight:1.75,marginBottom:28}}>Get instant job match alerts, approve milestones on the go, and track your Trust Score in real time — all from your iPhone or Android.</p>
            <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:32}}>
              {[["⚡","Instant job match alerts — apply in one tap"],["💰","Approve milestones and release escrow from anywhere"],["🛡️","Biometric login with Face ID and Touch ID"],["📊","Live Trust Score and badge progress tracking"]].map(([ic,t],i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"12px 16px",background:"rgba(26,107,255,0.05)",border:"1px solid rgba(26,107,255,0.12)",borderRadius:10}}>
                  <span style={{fontSize:"1.2rem"}}>{ic}</span>
                  <span style={{fontSize:"0.88rem",color:"rgba(255,255,255,0.7)"}}>{t}</span>
                </div>
              ))}
            </div>
            <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
              <button style={{display:"flex",alignItems:"center",gap:10,padding:"13px 22px",background:"white",borderRadius:12,border:"none",cursor:"pointer"}}>
                <span style={{fontSize:"1.4rem"}}>🍎</span>
                <div style={{textAlign:"left"}}><div style={{fontSize:"0.6rem",color:"rgba(0,0,0,0.5)"}}>Download on the</div><div style={{fontSize:"0.95rem",fontWeight:800,color:"black"}}>App Store</div></div>
              </button>
              <button style={{display:"flex",alignItems:"center",gap:10,padding:"13px 22px",background:"white",borderRadius:12,border:"none",cursor:"pointer"}}>
                <span style={{fontSize:"1.4rem"}}>🤖</span>
                <div style={{textAlign:"left"}}><div style={{fontSize:"0.6rem",color:"rgba(0,0,0,0.5)"}}>Get it on</div><div style={{fontSize:"0.95rem",fontWeight:800,color:"black"}}>Google Play</div></div>
              </button>
            </div>
          </div>
          <div style={{display:"flex",justifyContent:"center"}}>
            <div style={{width:260,background:"rgba(4,15,36,0.98)",borderRadius:36,border:"8px solid rgba(26,107,255,0.3)",padding:16,boxShadow:"0 30px 80px rgba(0,0,0,0.5)"}}>
              <div style={{height:6,width:60,background:"rgba(255,255,255,0.2)",borderRadius:3,margin:"0 auto 16px"}}/>
              <div style={{display:"flex",justifyContent:"center",marginBottom:14}}><VeritasVerifiedBadge score={845} size={100}/></div>
              <div style={{fontWeight:900,fontSize:"1rem",textAlign:"center",marginBottom:2}}>Scott Eberhardt</div>
              <div style={{fontSize:"0.7rem",color:"rgba(255,255,255,0.45)",textAlign:"center",marginBottom:14}}>Full-Stack Developer</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}}>
                {[["Trust Score","845","#00e676"],["Jobs Done","94","#4da6ff"],["Rating","5.0★","#f0c040"],["Earnings","$182K","#00e676"]].map(([l,v,c],i)=>(
                  <div key={i} style={{padding:"8px",background:"rgba(26,107,255,0.08)",borderRadius:8,textAlign:"center"}}>
                    <div style={{fontWeight:800,color:c,fontSize:"0.95rem",lineHeight:1}}>{v}</div>
                    <div style={{fontSize:"0.55rem",color:"rgba(255,255,255,0.4)",marginTop:2}}>{l}</div>
                  </div>
                ))}
              </div>
              <div style={{padding:"10px 12px",background:"rgba(0,200,83,0.1)",border:"1px solid rgba(0,200,83,0.2)",borderRadius:10,display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                <Bell size={14} color="#00e676"/>
                <div style={{flex:1}}>
                  <div style={{fontSize:"0.7rem",fontWeight:700,color:"#00e676"}}>New Job Match</div>
                  <div style={{fontSize:"0.62rem",color:"rgba(255,255,255,0.5)"}}>99% match — $12,000</div>
                </div>
              </div>
              <button style={{width:"100%",padding:"10px",background:"linear-gradient(135deg,#1a6bff,#0050dd)",border:"none",borderRadius:9,color:"white",fontWeight:700,fontSize:"0.8rem",cursor:"pointer"}}>Apply Now</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
