
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { VeritasEmblem } from "@/components/badges/VeritasBadges";
import { Shield, TrendingUp, Heart, Umbrella, DollarSign, CheckCircle2, Loader2, ArrowRight, Lock, Zap, Star, Clock } from "lucide-react";

const BENEFITS = [
  {
    id:"retirement",
    icon:"🏦",
    title:"Veritas Retirement Pool",
    subtitle:"Coming Q1 2027",
    status:"soon",
    color:"#f0c040",
    description:"1% of every platform fee goes into a community retirement pool. Distributed quarterly to active verified workers based on hours logged.",
    details:["Automatic enrollment for verified workers","Quarterly distributions","Pro-rated by active hours worked","Non-forfeitable after 1 year"],
    estimate:"Est. $18,000 in Q1 2027 distribution",
    waitlist:847,
  },
  {
    id:"insurance",
    icon:"🛡️",
    title:"Freelancer Health Insurance",
    subtitle:"Coming Q2 2027",
    status:"soon",
    color:"#4da6ff",
    description:"Group health insurance rates for independent workers. Partner network with Stride Health and Catch — access plans at employer-equivalent rates.",
    details:["Medical, dental, and vision plans","Pre-tax HSA contributions","Partner discounts for Veritas members","No minimum hours requirement"],
    estimate:"Plans starting at ~$180/mo for individuals",
    waitlist:1203,
  },
  {
    id:"income",
    icon:"☂️",
    title:"Income Protection Insurance",
    subtitle:"Coming Q2 2027",
    status:"soon",
    color:"#a78bfa",
    description:"Covers up to $500 if a verified client ghosts after work is delivered. AI reviews the case and pays out within 48 hours.",
    details:["$500 max per claim","48-hour AI-reviewed payout","Requires Trust Score 700+","Up to 3 claims per year"],
    estimate:"Free for Pro plan · $9/mo for Starter",
    waitlist:2104,
  },
  {
    id:"profitsharing",
    icon:"📈",
    title:"Platform Profit Sharing",
    subtitle:"Coming Q3 2027",
    status:"soon",
    color:"#00e676",
    description:"Top 10% of workers by Trust Score earn a quarterly profit share from platform revenue. The more you contribute, the more you earn.",
    details:["Top 10% by Trust Score qualifies","Paid quarterly in USDC","Based on jobs completed and score","Transparent on-chain distribution"],
    estimate:"Est. avg $800/yr for qualifying workers",
    waitlist:3291,
  },
  {
    id:"education",
    icon:"🎓",
    title:"Skill Development Fund",
    subtitle:"Coming Q4 2027",
    status:"soon",
    color:"#00d4ff",
    description:"$500/year education stipend for verified workers. Use it on Udemy, Coursera, certifications, or approved bootcamps.",
    details:["$500/year per verified worker","Approved platform list","Completion unlocks +25 Trust Score","No repayment required"],
    estimate:"$500 annual credit per worker",
    waitlist:1847,
  },
];

export default function ComingSoonPage() {
  const router = useRouter();
  const [waitlists, setWaitlists] = useState<Record<string,boolean>>({});
  const [joining, setJoining]     = useState<string|null>(null);
  const [email, setEmail]         = useState("");
  const [showEmail, setShowEmail] = useState<string|null>(null);

  function join(id:string){
    if(!email) {setShowEmail(id);return;}
    setJoining(id);
    setTimeout(()=>{
      setWaitlists(p=>({...p,[id]:true}));
      setJoining(null);
      setShowEmail(null);
      setEmail("");
    },1000);
  }

  return (
    <div style={{minHeight:"100vh",background:"#010812",color:"white"}}>
      <nav style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 28px",borderBottom:"1px solid rgba(26,107,255,0.1)",position:"sticky",top:0,background:"rgba(1,8,18,0.97)",backdropFilter:"blur(20px)",zIndex:50}}>
        <div style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer"}} onClick={()=>router.push("/")}>
          <VeritasEmblem size={34}/>
          <div><div style={{fontSize:"1rem",fontWeight:900,letterSpacing:"0.08em"}}>VERITAS</div><div style={{fontSize:"0.5rem",fontWeight:600,letterSpacing:"0.2em",color:"#00d4ff",textTransform:"uppercase"}}>Truth Becomes Trust</div></div>
        </div>
        <button onClick={()=>router.push("/dashboard")} style={{padding:"9px 18px",borderRadius:9,background:"linear-gradient(135deg,#1a6bff,#0050dd)",border:"none",color:"white",fontSize:"0.82rem",cursor:"pointer",fontWeight:700}}>Go to Dashboard</button>
      </nav>

      <div style={{maxWidth:1100,margin:"0 auto",padding:"56px 24px"}}>
        {/* Header */}
        <div style={{textAlign:"center",marginBottom:56}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:8,padding:"7px 16px",background:"rgba(240,192,64,0.08)",border:"1px solid rgba(240,192,64,0.2)",borderRadius:30,fontSize:"0.75rem",color:"#f0c040",fontWeight:600,marginBottom:18}}>
            ⭐ Worker Benefits Program — The future of freelancing
          </div>
          <h1 style={{fontSize:"3rem",fontWeight:900,lineHeight:1.15,marginBottom:12}}>
            Freelancing Should Come<br/>With <span style={{background:"linear-gradient(135deg,#f0c040,#c9a227)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Real Benefits</span>
          </h1>
          <p style={{color:"rgba(255,255,255,0.45)",fontSize:"1rem",maxWidth:620,margin:"0 auto",lineHeight:1.75}}>
            We're building the first gig platform that treats workers like professionals — with retirement plans, health insurance, income protection, and profit sharing. Join the waitlist to get early access.
          </p>
        </div>

        {/* Stats */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16,marginBottom:48}}>
          {[["9,292","Workers on waitlists","#f0c040"],["$18K","Est. Q1 2027 retirement distribution","#00e676"],["5","Benefit programs launching in 2027","#4da6ff"]].map(([v,l,c],i)=>(
            <div key={i} style={{background:"rgba(4,15,36,0.9)",border:"1px solid rgba(26,107,255,0.14)",borderRadius:16,padding:22,textAlign:"center"}}>
              <div style={{fontSize:"2.4rem",fontWeight:900,color:c,lineHeight:1,marginBottom:6}}>{v}</div>
              <div style={{fontSize:"0.82rem",color:"rgba(255,255,255,0.5)"}}>{l}</div>
            </div>
          ))}
        </div>

        {/* Benefit cards */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,marginBottom:48}}>
          {BENEFITS.map(b=>(
            <div key={b.id} style={{background:"rgba(4,15,36,0.95)",border:`1px solid ${b.color}22`,borderRadius:20,padding:24,position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",top:0,right:0,width:120,height:120,background:`radial-gradient(ellipse,${b.color}12,transparent)`,borderRadius:"50%"}}/>
              <div style={{position:"relative",zIndex:1}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
                  <div style={{fontSize:"2.2rem"}}>{b.icon}</div>
                  <span style={{fontSize:"0.65rem",padding:"4px 10px",background:`${b.color}18`,border:`1px solid ${b.color}44`,borderRadius:20,color:b.color,fontWeight:700}}>{b.subtitle}</span>
                </div>
                <h3 style={{fontSize:"1.15rem",fontWeight:900,marginBottom:6}}>{b.title}</h3>
                <p style={{fontSize:"0.82rem",color:"rgba(255,255,255,0.55)",lineHeight:1.7,marginBottom:12}}>{b.description}</p>
                <div style={{display:"flex",flexDirection:"column",gap:5,marginBottom:14}}>
                  {b.details.map((d,i)=>(
                    <div key={i} style={{display:"flex",alignItems:"center",gap:7,fontSize:"0.78rem",color:"rgba(255,255,255,0.6)"}}>
                      <CheckCircle2 size={13} color={b.color} style={{flexShrink:0}}/>{d}
                    </div>
                  ))}
                </div>
                <div style={{padding:"8px 12px",background:`${b.color}08`,border:`1px solid ${b.color}22`,borderRadius:8,fontSize:"0.72rem",color:b.color,fontWeight:600,marginBottom:14}}>{b.estimate}</div>

                {showEmail===b.id&&!waitlists[b.id]&&(
                  <div style={{display:"flex",gap:7,marginBottom:10}}>
                    <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="your@email.com" style={{flex:1,padding:"9px 12px",background:"rgba(6,18,41,0.8)",border:"1px solid rgba(26,107,255,0.2)",borderRadius:8,color:"white",fontSize:"0.82rem",outline:"none"}}/>
                  </div>
                )}

                {waitlists[b.id]?(
                  <div style={{display:"flex",alignItems:"center",gap:7,padding:"11px 14px",background:"rgba(0,200,83,0.08)",border:"1px solid rgba(0,200,83,0.2)",borderRadius:9,color:"#00e676",fontWeight:700,fontSize:"0.82rem"}}>
                    <CheckCircle2 size={15}/>You're on the waitlist! We'll email you when this launches.
                  </div>
                ):(
                  <button onClick={()=>join(b.id)} disabled={joining===b.id} style={{width:"100%",padding:"11px",background:`${b.color}18`,border:`1px solid ${b.color}44`,borderRadius:9,color:b.color,fontWeight:700,fontSize:"0.82rem",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:7,transition:"all 0.2s"}}>
                    {joining===b.id?<><Loader2 size={14} style={{animation:"spin 1s linear infinite"}}/>Joining...</>:<><Zap size={14}/>Join Waitlist ({b.waitlist.toLocaleString()} ahead)</>}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* How it's funded */}
        <div style={{background:"rgba(4,15,36,0.95)",border:"1px solid rgba(26,107,255,0.18)",borderRadius:20,padding:32,textAlign:"center"}}>
          <h2 style={{fontSize:"1.8rem",fontWeight:900,marginBottom:8}}>How It's Funded</h2>
          <p style={{color:"rgba(255,255,255,0.45)",marginBottom:24,fontSize:"0.92rem",maxWidth:580,margin:"0 auto 24px"}}>No extra fees. No gimmicks. The Veritas platform fee pays for worker benefits — aligned incentives all the way down.</p>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,maxWidth:700,margin:"0 auto"}}>
            {[["2%","Platform fee on every job","rgba(255,255,255,0.6)"],["1%","Goes to retirement pool","#f0c040"],["1%","Operations + product","rgba(255,255,255,0.6)"]].map(([v,l,c],i)=>(
              <div key={i} style={{padding:16,background:"rgba(26,107,255,0.05)",border:"1px solid rgba(26,107,255,0.12)",borderRadius:14,textAlign:"center"}}>
                <div style={{fontSize:"2rem",fontWeight:900,color:c,marginBottom:6}}>{v}</div>
                <div style={{fontSize:"0.78rem",color:"rgba(255,255,255,0.5)",lineHeight:1.5}}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
