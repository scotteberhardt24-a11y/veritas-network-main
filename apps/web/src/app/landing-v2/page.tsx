
"use client";
import { useRouter } from "next/navigation";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { VeritasEmblem, VeritasVerifiedBadge, NewMemberBadge, Jobs50Badge, YearVerifiedBadge, FirstEscrowBadge } from "@/components/badges/VeritasBadges";

export default function LandingV2Page() {
  const router = useRouter();
  return (
    <div style={{minHeight:"100vh",background:"#010812",color:"white"}}>
      {/* Nav */}
      <nav style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 28px",borderBottom:"1px solid rgba(26,107,255,0.1)",position:"sticky",top:0,background:"rgba(1,8,18,0.97)",backdropFilter:"blur(20px)",zIndex:50}}>
        <div style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer"}} onClick={()=>router.push("/")}>
          <VeritasEmblem size={36}/>
          <div><div style={{fontSize:"1.05rem",fontWeight:900,letterSpacing:"0.08em"}}>VERITAS</div><div style={{fontSize:"0.5rem",fontWeight:600,letterSpacing:"0.2em",color:"#00d4ff",textTransform:"uppercase"}}>Truth Becomes Trust</div></div>
        </div>
        <div style={{display:"flex",gap:8}}>
          <button onClick={()=>router.push("/auth")} style={{padding:"9px 18px",borderRadius:9,border:"1px solid rgba(26,107,255,0.2)",background:"rgba(26,107,255,0.06)",color:"#4da6ff",fontSize:"0.82rem",cursor:"pointer",fontWeight:600}}>Sign In</button>
          <button onClick={()=>router.push("/onboarding")} style={{padding:"9px 18px",borderRadius:9,background:"linear-gradient(135deg,#1a6bff,#0050dd)",border:"none",color:"white",fontSize:"0.82rem",cursor:"pointer",fontWeight:700,boxShadow:"0 4px 16px rgba(26,107,255,0.4)"}}>Get Started</button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{maxWidth:1200,margin:"0 auto",padding:"64px 28px",textAlign:"center",position:"relative"}}>
        <div style={{position:"absolute",inset:0,backgroundImage:"radial-gradient(circle,rgba(26,107,255,0.2) 1px,transparent 1px)",backgroundSize:"28px 28px",opacity:0.18}}/>
        <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse 60% 50% at 50% 40%,rgba(26,107,255,0.1) 0%,transparent 70%)"}}/>
        <div style={{position:"relative",zIndex:10}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:8,padding:"7px 18px",background:"rgba(26,107,255,0.08)",border:"1px solid rgba(26,107,255,0.2)",borderRadius:30,fontSize:"0.72rem",color:"#4da6ff",fontWeight:700,marginBottom:24,letterSpacing:"0.06em"}}>
            ⚡ The Web3 Upwork Killer is here
          </div>
          <h1 style={{fontSize:"clamp(2.5rem,5vw,4.5rem)",fontWeight:900,lineHeight:1.05,marginBottom:16}}>
            Freelancing Built on<br/><span style={{background:"linear-gradient(135deg,#1a6bff,#00d4ff)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Trust. Verified.</span>
          </h1>
          <p style={{fontSize:"1.1rem",color:"rgba(255,255,255,0.5)",marginBottom:28,maxWidth:560,margin:"0 auto 28px",lineHeight:1.7}}>
            The world's first blockchain-verified gig marketplace. AI matching, smart escrow, and a portable Trust Score that never disappears.
          </p>
          <div style={{display:"flex",justifyContent:"center",gap:12,flexWrap:"wrap",marginBottom:40}}>
            <button onClick={()=>router.push("/onboarding")} style={{display:"flex",alignItems:"center",gap:8,padding:"14px 32px",background:"linear-gradient(135deg,#1a6bff,#0050dd)",border:"none",borderRadius:10,color:"white",fontWeight:800,fontSize:"1.05rem",cursor:"pointer",boxShadow:"0 4px 24px rgba(26,107,255,0.45)"}}>
              Get Your Badge <ArrowRight size={20}/>
            </button>
            <button onClick={()=>router.push("/jobs")} style={{padding:"13px 26px",background:"rgba(26,107,255,0.08)",border:"1px solid rgba(26,107,255,0.3)",borderRadius:10,color:"#4da6ff",fontWeight:600,fontSize:"0.98rem",cursor:"pointer"}}>Browse Jobs</button>
          </div>

          {/* Badge showcase */}
          <div style={{display:"flex",justifyContent:"center",flexWrap:"wrap",gap:24,marginBottom:48}}>
            <VeritasVerifiedBadge score={845} size={180}/>
            {[NewMemberBadge,Jobs50Badge,YearVerifiedBadge,FirstEscrowBadge].map((Comp,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center"}}><Comp size={110}/></div>
            ))}
          </div>

          {/* Stats */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,maxWidth:800,margin:"0 auto"}}>
            {[["12,847","Verified Professionals"],["$42M+","Paid Securely"],["99.2%","Dispute Resolution"],["845","Avg Trust Score"]].map(([v,l],i)=>(
              <div key={i} style={{background:"rgba(4,15,36,0.9)",border:"1px solid rgba(26,107,255,0.15)",borderRadius:14,padding:"16px 10px",textAlign:"center"}}>
                <div style={{fontSize:"1.8rem",fontWeight:900,background:"linear-gradient(135deg,#f0c040,#c9a227)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{v}</div>
                <div style={{fontSize:"0.68rem",color:"rgba(255,255,255,0.4)",marginTop:4}}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{maxWidth:1100,margin:"0 auto",padding:"40px 28px"}}>
        <h2 style={{fontSize:"2rem",fontWeight:900,textAlign:"center",marginBottom:8}}>Why Veritas Wins</h2>
        <p style={{textAlign:"center",color:"rgba(255,255,255,0.45)",marginBottom:28,fontSize:"0.95rem"}}>Every feature built to solve real problems Upwork and Fiverr never could.</p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16}}>
          {[
            {ic:"🛡️",t:"Trust-First Escrow",d:"Every payment held in blockchain-verified smart contracts. Funds release only when milestones are approved."},
            {ic:"⚡",t:"AI-Powered Matching",d:"94% acceptance rate. Our AI analyzes 47 signals to match jobs to the right workers instantly."},
            {ic:"🏆",t:"Portable Trust Score",d:"Your score lives on-chain. It travels with you across platforms forever — no more starting from zero."},
            {ic:"🌐",t:"Web3 Native",d:"NFT credentials, DAO governance, crypto payments, and cross-chain escrow. Built for the future."},
            {ic:"⚖️",t:"Zero Disputes",d:"AI arbitration resolves 99.2% of disputes in 48 hours. No more months of uncertainty."},
            {ic:"📊",t:"Real-Time Analytics",d:"Live dashboards showing earnings, trust score trajectory, and market positioning."},
          ].map((f,i)=>(
            <div key={i} style={{background:"linear-gradient(135deg,rgba(4,15,36,0.95),rgba(6,18,41,0.9))",border:"1px solid rgba(26,107,255,0.12)",borderRadius:16,padding:22,transition:"border-color 0.2s"}}>
              <div style={{fontSize:"1.8rem",marginBottom:10}}>{f.ic}</div>
              <div style={{fontWeight:800,marginBottom:6,fontSize:"1rem"}}>{f.t}</div>
              <div style={{fontSize:"0.82rem",color:"rgba(255,255,255,0.5)",lineHeight:1.6}}>{f.d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section style={{maxWidth:800,margin:"0 auto",padding:"32px 28px 56px"}}>
        <div style={{background:"linear-gradient(135deg,rgba(4,15,36,0.98),rgba(10,8,2,0.95))",border:"1px solid rgba(201,162,39,0.2)",borderRadius:24,padding:"48px 28px",textAlign:"center"}}>
          <div style={{display:"flex",justifyContent:"center",marginBottom:16}}><VeritasEmblem size={60}/></div>
          <h2 style={{fontSize:"2rem",fontWeight:900,marginBottom:8}}>Join the Trust Revolution</h2>
          <p style={{color:"rgba(255,255,255,0.45)",marginBottom:24}}>12,000+ professionals already building their on-chain reputation.</p>
          <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
            <button onClick={()=>router.push("/onboarding")} style={{padding:"14px 36px",background:"linear-gradient(135deg,#d4af37,#c9a227,#a07810)",borderRadius:10,border:"none",color:"#0a0800",fontWeight:800,fontSize:"1rem",cursor:"pointer",boxShadow:"0 4px 24px rgba(201,162,39,0.35)"}}>Get Verified Free →</button>
            <button onClick={()=>router.push("/pricing")} style={{padding:"13px 26px",background:"rgba(26,107,255,0.08)",border:"1px solid rgba(26,107,255,0.3)",borderRadius:10,color:"#4da6ff",fontWeight:600,cursor:"pointer"}}>See Pricing</button>
          </div>
          <div style={{display:"flex",justifyContent:"center",gap:20,marginTop:16,fontSize:"0.72rem",color:"rgba(255,255,255,0.3)"}}>
            {["No credit card required","Free forever plan","Cancel anytime"].map((t,i)=>(
              <span key={i} style={{display:"flex",alignItems:"center",gap:4}}><CheckCircle2 size={11} color="#00e676"/>{t}</span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
