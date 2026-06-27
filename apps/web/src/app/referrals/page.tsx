
"use client";
import { useState } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import TopBar from "@/components/topbar/TopBar";
import { VeritasEmblem } from "@/components/badges/VeritasBadges";
import { Gift, Copy, CheckCheck, Users, DollarSign, TrendingUp, Share2, Star, Zap, ChevronRight } from "lucide-react";

const REFERRALS = [
  {name:"Jordan Lee",   joined:"Jun 10", status:"active",  earned:142.50, tier:"Worker", jobs:8  },
  {name:"Priya Nair",   joined:"May 28", status:"active",  earned:89.00,  tier:"Worker", jobs:5  },
  {name:"Mike Okafor",  joined:"May 15", status:"pending", earned:0,      tier:"Client", jobs:0  },
  {name:"Tanya Brooks", joined:"Apr 30", status:"active",  earned:220.75, tier:"Worker", jobs:14 },
  {name:"Carlos Rivera",joined:"Apr 12", status:"active",  earned:167.20, tier:"Client", jobs:0  },
  {name:"Yuki Tanaka",  joined:"Mar 5",  status:"active",  earned:312.00, tier:"Worker", jobs:22 },
];

const TIERS = [
  {range:"1–5 referrals",  pct:"10%", bonus:"",          active:true,  desc:"10% of their first 3 months of platform fees"},
  {range:"6–20 referrals", pct:"12%", bonus:"+$50 each", active:false, desc:"12% commission + $50 cash bonus per referral"},
  {range:"21+ referrals",  pct:"15%", bonus:"Partner",   active:false, desc:"15% commission + dedicated partner manager"},
];

export default function ReferralsV2Page() {
  const [copied, setCopied] = useState(false);
  const refLink = "https://veritas.network/join?ref=SCOTT-V9X2K";
  const total   = REFERRALS.reduce((a,r)=>a+r.earned,0);
  const active  = REFERRALS.filter(r=>r.status==="active").length;

  function copy(){ navigator.clipboard.writeText(refLink); setCopied(true); setTimeout(()=>setCopied(false),2000); }

  return (
    <div style={{display:"flex",minHeight:"100vh",background:"#010812"}}>
      <Sidebar/>
      <div style={{flex:1,display:"flex",flexDirection:"column"}}>
        <TopBar/>
        <main style={{flex:1,overflowY:"auto",padding:24,color:"white"}}>

          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:24}}>
            <Gift size={28} color="#f0c040"/>
            <h1 style={{fontSize:"1.8rem",fontWeight:900,margin:0}}>Referral Program</h1>
          </div>

          {/* Stats */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:20}}>
            {[
              {icon:<Users size={20}/>,     label:"Total Referrals", value:REFERRALS.length, color:"#4da6ff"},
              {icon:<Zap size={20}/>,       label:"Active",          value:active,           color:"#00e676"},
              {icon:<DollarSign size={20}/>,label:"Total Earned",    value:`$${total.toFixed(2)}`, color:"#f0c040"},
              {icon:<TrendingUp size={20}/>,label:"This Month",      value:"$182.50",        color:"#00d4ff"},
            ].map((s,i)=>{
              const Icon=s.icon;
              return(
                <div key={i} style={{background:"rgba(4,15,36,0.9)",border:"1px solid rgba(26,107,255,0.14)",borderRadius:14,padding:"18px 16px"}}>
                  <div style={{color:s.color,marginBottom:8}}>{s.icon}</div>
                  <div style={{fontSize:"1.7rem",fontWeight:900,color:s.color,lineHeight:1,marginBottom:3}}>{s.value}</div>
                  <div style={{fontSize:"0.7rem",color:"rgba(255,255,255,0.4)"}}>{s.label}</div>
                </div>
              );
            })}
          </div>

          {/* Referral link */}
          <div style={{background:"rgba(4,15,36,0.9)",border:"1px solid rgba(26,107,255,0.18)",borderRadius:16,padding:22,marginBottom:20}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
              <Share2 size={18} color="#f0c040"/>
              <span style={{fontWeight:800,fontSize:"0.95rem"}}>Your Referral Link</span>
            </div>
            <div style={{display:"flex",gap:10,marginBottom:14}}>
              <div style={{flex:1,display:"flex",alignItems:"center",background:"rgba(6,18,41,0.8)",border:"1px solid rgba(26,107,255,0.18)",borderRadius:10,padding:"11px 16px"}}>
                <span style={{fontSize:"0.85rem",fontFamily:"monospace",color:"rgba(255,255,255,0.6)",flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{refLink}</span>
              </div>
              <button onClick={copy} style={{display:"flex",alignItems:"center",gap:7,padding:"11px 20px",background:copied?"rgba(0,200,83,0.15)":"linear-gradient(135deg,#1a6bff,#0050dd)",border:copied?"1px solid rgba(0,200,83,0.3)":"none",borderRadius:10,color:"white",fontWeight:700,fontSize:"0.85rem",cursor:"pointer",flexShrink:0,transition:"all 0.2s",boxShadow:copied?"none":"0 3px 14px rgba(26,107,255,0.35)"}}>
                {copied?<CheckCheck size={15}/>:<Copy size={15}/>}{copied?"Copied!":"Copy"}
              </button>
            </div>
            <div style={{display:"flex",gap:9,flexWrap:"wrap"}}>
              {[["𝕏","Share on X","rgba(0,0,0,0.6)"],["in","LinkedIn","rgba(0,100,200,0.3)"],["✉️","Email","rgba(26,107,255,0.12)"],["📱","WhatsApp","rgba(0,200,83,0.12)"]].map(([ic,l,bg],i)=>(
                <button key={i} style={{display:"flex",alignItems:"center",gap:6,padding:"8px 14px",background:bg,border:"1px solid rgba(255,255,255,0.08)",borderRadius:9,color:"rgba(255,255,255,0.7)",fontSize:"0.78rem",fontWeight:600,cursor:"pointer"}}>
                  <span>{ic}</span>{l}
                </button>
              ))}
            </div>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"1fr 280px",gap:20}}>
            {/* Referral list */}
            <div>
              <div style={{fontWeight:800,marginBottom:12,fontSize:"0.9rem"}}>Your Referrals</div>
              <div style={{background:"rgba(4,15,36,0.9)",border:"1px solid rgba(26,107,255,0.12)",borderRadius:16,overflow:"hidden"}}>
                {REFERRALS.map((r,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"13px 18px",borderBottom:i<REFERRALS.length-1?"1px solid rgba(26,107,255,0.07)":"none"}}>
                    <div style={{display:"flex",alignItems:"center",gap:12}}>
                      <div style={{width:38,height:38,borderRadius:10,background:"linear-gradient(135deg,#1a3a6b,#0d1f3d)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:"0.88rem"}}>{r.name[0]}</div>
                      <div>
                        <div style={{fontWeight:700,fontSize:"0.88rem",marginBottom:1}}>{r.name}</div>
                        <div style={{fontSize:"0.68rem",color:"rgba(255,255,255,0.38)"}}>Joined {r.joined} · {r.tier}{r.jobs>0?` · ${r.jobs} jobs`:""}</div>
                      </div>
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:12}}>
                      <span style={{fontSize:"0.65rem",padding:"3px 8px",borderRadius:5,fontWeight:700,
                        background:r.status==="active"?"rgba(0,200,83,0.1)":"rgba(255,255,255,0.05)",
                        border:`1px solid ${r.status==="active"?"rgba(0,200,83,0.2)":"rgba(255,255,255,0.1)"}`,
                        color:r.status==="active"?"#00e676":"rgba(255,255,255,0.4)"}}>{r.status}</span>
                      <div style={{textAlign:"right"}}>
                        <div style={{fontWeight:800,color:"#00e676",fontSize:"0.9rem"}}>${r.earned.toFixed(2)}</div>
                        <div style={{fontSize:"0.62rem",color:"rgba(255,255,255,0.3)"}}>earned</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tier panel */}
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              <div style={{fontWeight:800,marginBottom:0,fontSize:"0.9rem"}}>Commission Tiers</div>
              {TIERS.map((t,i)=>(
                <div key={i} style={{background:"rgba(4,15,36,0.9)",border:`1px solid ${t.active?"rgba(240,192,64,0.35)":"rgba(26,107,255,0.12)"}`,borderRadius:14,padding:16}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                    <span style={{fontSize:"0.8rem",color:"rgba(255,255,255,0.65)",fontWeight:600}}>{t.range}</span>
                    <span style={{fontSize:"1.3rem",fontWeight:900,color:t.active?"#f0c040":"rgba(255,255,255,0.35)"}}>{t.pct}</span>
                  </div>
                  <div style={{fontSize:"0.72rem",color:"rgba(255,255,255,0.4)",lineHeight:1.5,marginBottom:t.active?8:0}}>{t.desc}</div>
                  {t.active&&<div style={{fontSize:"0.65rem",color:"#f0c040",fontWeight:700,display:"flex",alignItems:"center",gap:4}}><Star size={10} fill="currentColor"/>Current Tier</div>}
                  {t.bonus&&<div style={{fontSize:"0.65rem",color:"#00e676",fontWeight:700,marginTop:4}}>+ {t.bonus}</div>}
                </div>
              ))}
              <div style={{padding:12,background:"rgba(26,107,255,0.04)",border:"1px solid rgba(26,107,255,0.1)",borderRadius:12,fontSize:"0.72rem",color:"rgba(255,255,255,0.4)",lineHeight:1.65}}>
                Commissions paid monthly. Min payout $25. Referred users must complete one paid job to qualify.
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
