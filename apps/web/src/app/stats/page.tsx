
"use client";
import { useRouter } from "next/navigation";
import { VeritasEmblem } from "@/components/badges/VeritasBadges";
import { TrendingUp, Users, DollarSign, Shield, Globe, Zap, Star, Award } from "lucide-react";

const STATS=[
  {icon:<Users size={26}/>,     label:"Verified Professionals",value:"12,847", growth:"+31% MoM",color:"#4da6ff"},
  {icon:<DollarSign size={26}/>,label:"Total Paid Out",        value:"$42.1M", growth:"+18% MoM",color:"#00e676"},
  {icon:<Shield size={26}/>,    label:"Dispute Resolution",    value:"99.2%",  growth:"from 98.8%",color:"#00e676"},
  {icon:<Globe size={26}/>,     label:"Countries",             value:"94",     growth:"6 new this month",color:"#00d4ff"},
  {icon:<Zap size={26}/>,       label:"AI Match Acceptance",   value:"94%",    growth:"from 88%",color:"#f0c040"},
  {icon:<Star size={26}/>,      label:"Avg Trust Score",       value:"78.4",   growth:"+1.2 pts",color:"#f0c040"},
  {icon:<Award size={26}/>,     label:"Badges Issued",         value:"48,291", growth:"+2,847 this month",color:"#a78bfa"},
  {icon:<TrendingUp size={26}/>,label:"Monthly Active Workers",value:"8,421",  growth:"+22% MoM",color:"#00e676"},
];

const MILESTONES=[
  {year:"2024 Q1",event:"Veritas Network launches — 100 founding members"},
  {year:"2024 Q2",event:"First $1M in escrow processed — zero disputes"},
  {year:"2024 Q3",event:"AI match engine reaches 90%+ acceptance rate"},
  {year:"2024 Q4",event:"NFT Trust Passports launched on Polygon mainnet"},
  {year:"2025 Q1",event:"10,000 verified professionals milestone"},
  {year:"2025 Q2",event:"$10M total paid out — 99%+ on-time delivery"},
  {year:"2026 Q1",event:"$42M total paid out — expanding to 94 countries"},
];

export default function PlatformStatsPage(){
  const router=useRouter();
  return(
    <div style={{minHeight:"100vh",background:"#010812",color:"white"}}>
      <nav style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 28px",borderBottom:"1px solid rgba(26,107,255,0.1)",position:"sticky",top:0,background:"rgba(1,8,18,0.97)",backdropFilter:"blur(20px)",zIndex:50}}>
        <div style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer"}} onClick={()=>router.push("/")}>
          <VeritasEmblem size={34}/>
          <div><div style={{fontSize:"1rem",fontWeight:900,letterSpacing:"0.08em"}}>VERITAS</div><div style={{fontSize:"0.5rem",fontWeight:600,letterSpacing:"0.2em",color:"#00d4ff",textTransform:"uppercase"}}>Truth Becomes Trust</div></div>
        </div>
        <button onClick={()=>router.push("/onboarding")} style={{padding:"9px 18px",borderRadius:9,background:"linear-gradient(135deg,#1a6bff,#0050dd)",border:"none",color:"white",fontSize:"0.82rem",cursor:"pointer",fontWeight:700}}>Join Free</button>
      </nav>
      <div style={{maxWidth:1100,margin:"0 auto",padding:"48px 24px"}}>
        <div style={{textAlign:"center",marginBottom:48}}>
          <h1 style={{fontSize:"2.8rem",fontWeight:900,marginBottom:8}}>By the Numbers</h1>
          <p style={{color:"rgba(255,255,255,0.45)",fontSize:"1rem"}}>Real-time data from the world's most trusted gig marketplace</p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,marginBottom:48}}>
          {STATS.map((s,i)=>(
            <div key={i} style={{background:"rgba(4,15,36,0.95)",border:"1px solid rgba(26,107,255,0.14)",borderRadius:18,padding:22,textAlign:"center"}}>
              <div style={{color:s.color,display:"flex",justifyContent:"center",marginBottom:12}}>{s.icon}</div>
              <div style={{fontSize:"2.2rem",fontWeight:900,color:s.color,lineHeight:1,marginBottom:6}}>{s.value}</div>
              <div style={{fontSize:"0.82rem",color:"rgba(255,255,255,0.55)",marginBottom:6}}>{s.label}</div>
              <div style={{fontSize:"0.68rem",color:"#00e676",fontWeight:600}}>{s.growth}</div>
            </div>
          ))}
        </div>
        <div style={{marginBottom:48}}>
          <h2 style={{fontSize:"1.8rem",fontWeight:900,textAlign:"center",marginBottom:28}}>Platform Milestones</h2>
          <div style={{position:"relative",maxWidth:700,margin:"0 auto"}}>
            <div style={{position:"absolute",left:100,top:0,bottom:0,width:2,background:"linear-gradient(180deg,#1a6bff,rgba(26,107,255,0.1))"}}/>
            {MILESTONES.map((m,i)=>(
              <div key={i} style={{display:"flex",gap:20,marginBottom:20,alignItems:"flex-start"}}>
                <div style={{width:80,textAlign:"right",fontSize:"0.7rem",fontWeight:700,color:"#4da6ff",paddingTop:4,flexShrink:0}}>{m.year}</div>
                <div style={{width:16,height:16,borderRadius:"50%",background:"#1a6bff",border:"3px solid #010812",flexShrink:0,marginTop:2,position:"relative",zIndex:1}}/>
                <div style={{flex:1,padding:"10px 16px",background:"rgba(26,107,255,0.05)",border:"1px solid rgba(26,107,255,0.12)",borderRadius:10,fontSize:"0.85rem",color:"rgba(255,255,255,0.7)"}}>{m.event}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{textAlign:"center",background:"rgba(4,15,36,0.95)",border:"1px solid rgba(201,162,39,0.2)",borderRadius:24,padding:"44px 28px"}}>
          <div style={{display:"flex",justifyContent:"center",marginBottom:14}}><VeritasEmblem size={52}/></div>
          <h2 style={{fontSize:"2rem",fontWeight:900,marginBottom:8}}>Join 12,847 Verified Professionals</h2>
          <p style={{color:"rgba(255,255,255,0.45)",marginBottom:24,fontSize:"0.95rem"}}>One badge. Any job. Everywhere.</p>
          <button onClick={()=>router.push("/onboarding")} style={{padding:"13px 36px",background:"linear-gradient(135deg,#d4af37,#c9a227,#a07810)",borderRadius:10,border:"none",color:"#0a0800",fontWeight:800,fontSize:"1rem",cursor:"pointer"}}>Get Verified Free</button>
        </div>
      </div>
    </div>
  );
}
