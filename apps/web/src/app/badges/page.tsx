
"use client";
import { useRouter } from "next/navigation";
import { VeritasEmblem, VeritasVerifiedBadge, NewMemberBadge, Jobs50Badge, Jobs100Badge, FirstEscrowBadge, EscrowMasterBadge, YearVerifiedBadge, TopTrustScoreBadge } from "@/components/badges/VeritasBadges";
import { CheckCircle2, ArrowRight } from "lucide-react";

const BADGES=[
  {Comp:VeritasVerifiedBadge,name:"Veritas Verified",  desc:"Core verification — identity, skills, and escrow.",     pts:"+350 pts",props:{score:845}},
  {Comp:NewMemberBadge,      name:"New Member",         desc:"Awarded on joining and completing your profile.",       pts:"+50 pts", props:{}},
  {Comp:Jobs50Badge,         name:"50 Jobs",            desc:"Complete 50 jobs with 90%+ success rate.",              pts:"+100 pts",props:{}},
  {Comp:Jobs100Badge,        name:"100 Jobs",           desc:"Top 8% milestone — 100 completed jobs.",                pts:"+200 pts",props:{}},
  {Comp:FirstEscrowBadge,    name:"First Escrow",       desc:"First successfully completed escrow contract.",         pts:"+25 pts", props:{}},
  {Comp:EscrowMasterBadge,   name:"Escrow Master",      desc:"50+ escrow contracts with 98%+ release rate.",          pts:"+150 pts",props:{}},
  {Comp:YearVerifiedBadge,   name:"1 Year Verified",    desc:"Remain a verified member for one full year.",           pts:"+75 pts", props:{}},
  {Comp:TopTrustScoreBadge,  name:"Top Trust Score",    desc:"Trust Score in the global top 10%.",                    pts:"+200 pts",props:{}},
];

export default function BadgeShowcasePage(){
  const router=useRouter();
  return(
    <div style={{minHeight:"100vh",background:"#010812",color:"white"}}>
      <nav style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 28px",borderBottom:"1px solid rgba(26,107,255,0.1)",position:"sticky",top:0,background:"rgba(1,8,18,0.97)",backdropFilter:"blur(20px)",zIndex:50}}>
        <div style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer"}} onClick={()=>router.push("/")}>
          <VeritasEmblem size={34}/>
          <div><div style={{fontSize:"1rem",fontWeight:900}}>VERITAS</div><div style={{fontSize:"0.5rem",fontWeight:600,letterSpacing:"0.2em",color:"#00d4ff",textTransform:"uppercase"}}>Truth Becomes Trust</div></div>
        </div>
        <button onClick={()=>router.push("/onboarding")} style={{padding:"9px 18px",borderRadius:9,background:"linear-gradient(135deg,#1a6bff,#0050dd)",border:"none",color:"white",fontSize:"0.82rem",cursor:"pointer",fontWeight:700}}>Earn Your Badges</button>
      </nav>
      <div style={{maxWidth:1100,margin:"0 auto",padding:"48px 24px"}}>
        <div style={{textAlign:"center",marginBottom:48}}>
          <div style={{display:"flex",justifyContent:"center",marginBottom:16}}><VeritasVerifiedBadge score={845} size={180}/></div>
          <h1 style={{fontSize:"2.8rem",fontWeight:900,marginBottom:8}}>Portable Trust Badges</h1>
          <p style={{color:"rgba(255,255,255,0.45)",fontSize:"1rem",maxWidth:540,margin:"0 auto"}}>Every badge is a blockchain-verified credential that travels with you across any platform — forever.</p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,marginBottom:48}}>
          {BADGES.map((b,i)=>{
            const Comp=b.Comp as any;
            return(
              <div key={i} style={{background:"rgba(4,15,36,0.95)",border:"1px solid rgba(26,107,255,0.14)",borderRadius:18,padding:20,textAlign:"center"}}>
                <div style={{display:"flex",justifyContent:"center",marginBottom:10}}><Comp size={100} {...b.props}/></div>
                <div style={{fontWeight:800,fontSize:"0.9rem",marginBottom:4}}>{b.name}</div>
                <div style={{fontSize:"0.72rem",color:"rgba(255,255,255,0.45)",lineHeight:1.55,marginBottom:8}}>{b.desc}</div>
                <div style={{fontSize:"0.68rem",color:"#00e676",fontWeight:700}}>{b.pts}</div>
              </div>
            );
          })}
        </div>
        <div style={{background:"rgba(4,15,36,0.95)",border:"1px solid rgba(26,107,255,0.18)",borderRadius:20,padding:32,marginBottom:32}}>
          <h2 style={{fontSize:"1.8rem",fontWeight:900,textAlign:"center",marginBottom:24}}>How to Earn Badges</h2>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14}}>
            {[["1","Create Profile","Set up your Veritas profile with skills, rate, and bio."],["2","Get Verified","Complete identity verification — first badge unlocked."],["3","Complete Jobs","Every job builds your score and unlocks milestone badges."],["4","Grow Score","Higher Trust Score = more badges, permanently on-chain."]].map(([n,t,d])=>(
              <div key={n} style={{textAlign:"center"}}>
                <div style={{width:48,height:48,borderRadius:"50%",background:"rgba(26,107,255,0.12)",border:"2px solid rgba(26,107,255,0.3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.1rem",fontWeight:900,color:"#4da6ff",margin:"0 auto 12px"}}>{n}</div>
                <div style={{fontWeight:800,marginBottom:6,fontSize:"0.88rem"}}>{t}</div>
                <div style={{fontSize:"0.75rem",color:"rgba(255,255,255,0.45)",lineHeight:1.55}}>{d}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{textAlign:"center"}}>
          <button onClick={()=>router.push("/onboarding")} style={{display:"inline-flex",alignItems:"center",gap:8,padding:"14px 36px",background:"linear-gradient(135deg,#d4af37,#c9a227,#a07810)",borderRadius:10,border:"none",color:"#0a0800",fontWeight:800,fontSize:"1rem",cursor:"pointer"}}>
            Start Earning Badges <ArrowRight size={20}/>
          </button>
        </div>
      </div>
    </div>
  );
}
