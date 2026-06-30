
"use client";
import { useState } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import TopBar from "@/components/topbar/TopBar";
import { Gift, Copy, CheckCheck, Users, DollarSign, TrendingUp, Share2, Star, ChevronRight, Zap } from "lucide-react";

const REFERRALS = [
  {name:"Jordan Lee",   joined:"Jun 10",status:"active", earned:142.50,tier:"Worker",  jobs:8},
  {name:"Priya Nair",   joined:"May 28",status:"active", earned:89.00, tier:"Worker",  jobs:5},
  {name:"Mike Okafor",  joined:"May 15",status:"pending",earned:0,     tier:"Client",  jobs:0},
  {name:"Tanya Brooks", joined:"Apr 30",status:"active", earned:220.75,tier:"Worker",  jobs:14},
  {name:"Carlos Rivera",joined:"Apr 12",status:"active", earned:167.20,tier:"Client",  jobs:0},
  {name:"Yuki Tanaka",  joined:"Mar 5", status:"active", earned:312.00,tier:"Worker",  jobs:22},
];

const TIERS=[
  {range:"1–5 referrals",pct:"10%",active:true, desc:"10% of their first 3 months of fees"},
  {range:"6–20 referrals",pct:"12%",active:false,desc:"12% commission + $50 cash bonus each"},
  {range:"21+ referrals",pct:"15%",active:false, desc:"15% commission + partner manager"},
];

export default function ReferralDashboardPage() {
  const [copied,setCopied] = useState(false);
  const link = "https://veritas.network/join?ref=SCOTT-V9X2K";
  const total = REFERRALS.reduce((a,r)=>a+r.earned,0);
  const active = REFERRALS.filter(r=>r.status==="active").length;

  function copy(){navigator.clipboard.writeText(link);setCopied(true);setTimeout(()=>setCopied(false),2000);}

  return (
    <div style={{display:"flex",minHeight:"100vh",background:"#010812"}}>
      <Sidebar/>
      <div style={{flex:1,display:"flex",flexDirection:"column"}}>
        <TopBar/>
        <main style={{flex:1,overflowY:"auto",padding:24,color:"white"}}>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:24}}>
            <Gift size={28} color="#f0c040"/>
            <h1 style={{fontSize:"1.8rem",fontWeight:900,margin:0}}>Referral Dashboard</h1>
          </div>

          {/* Stats */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:20}}>
            {[{l:"Referrals",v:REFERRALS.length,c:"#4da6ff"},{l:"Active",v:active,c:"#00e676"},{l:"Total Earned",v:`$${total.toFixed(2)}`,c:"#f0c040"},{l:"This Month",v:"$182.50",c:"#00d4ff"}].map((s,i)=>(
              <div key={i} style={{background:"rgba(4,15,36,0.9)",border:"1px solid rgba(26,107,255,0.14)",borderRadius:14,padding:"18px 16px",textAlign:"center"}}>
                <div style={{fontSize:"1.8rem",fontWeight:900,color:s.c,marginBottom:4}}>{s.v}</div>
                <div style={{fontSize:"0.7rem",color:"rgba(255,255,255,0.4)"}}>{s.l}</div>
              </div>
            ))}
          </div>

          {/* Referral link */}
          <div style={{background:"rgba(4,15,36,0.9)",border:"1px solid rgba(26,107,255,0.18)",borderRadius:16,padding:20,marginBottom:20}}>
            <div style={{fontWeight:800,marginBottom:12,display:"flex",alignItems:"center",gap:8}}><Share2 size={16} color="#f0c040"/>Your Referral Link</div>
            <div style={{display:"flex",gap:10,marginBottom:14}}>
              <div style={{flex:1,padding:"10px 14px",background:"rgba(6,18,41,0.8)",border:"1px solid rgba(26,107,255,0.18)",borderRadius:9,fontFamily:"monospace",fontSize:"0.8rem",color:"rgba(255,255,255,0.6)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{link}</div>
              <button onClick={copy} style={{display:"flex",alignItems:"center",gap:6,padding:"10px 18px",background:copied?"rgba(0,200,83,0.12)":"linear-gradient(135deg,#1a6bff,#0050dd)",border:copied?"1px solid rgba(0,200,83,0.3)":"none",borderRadius:9,color:"white",fontWeight:700,fontSize:"0.82rem",cursor:"pointer",flexShrink:0}}>
                {copied?<CheckCheck size={14}/>:<Copy size={14}/>}{copied?"Copied!":"Copy"}
              </button>
            </div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {[["𝕏","X"],["in","LinkedIn"],["✉️","Email"],["📱","WhatsApp"]].map(([ic,l],i)=>(
                <button key={i} style={{display:"flex",alignItems:"center",gap:5,padding:"7px 12px",background:"rgba(26,107,255,0.07)",border:"1px solid rgba(26,107,255,0.15)",borderRadius:8,color:"rgba(255,255,255,0.65)",fontSize:"0.75rem",fontWeight:600,cursor:"pointer"}}>{ic} {l}</button>
              ))}
            </div>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"1fr 260px",gap:18}}>
            {/* Referral list */}
            <div>
              <div style={{fontWeight:800,marginBottom:12,fontSize:"0.9rem"}}>Your Referrals</div>
              <div style={{background:"rgba(4,15,36,0.9)",border:"1px solid rgba(26,107,255,0.12)",borderRadius:16,overflow:"hidden"}}>
                {REFERRALS.map((r,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"13px 18px",borderBottom:i<REFERRALS.length-1?"1px solid rgba(26,107,255,0.07)":"none"}}>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <div style={{width:36,height:36,borderRadius:9,background:"linear-gradient(135deg,#1a3a6b,#0d1f3d)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:"0.85rem"}}>{r.name[0]}</div>
                      <div>
                        <div style={{fontWeight:700,fontSize:"0.87rem"}}>{r.name}</div>
                        <div style={{fontSize:"0.65rem",color:"rgba(255,255,255,0.38)"}}>{r.tier} · {r.jobs>0?`${r.jobs} jobs · `:""}{r.joined}</div>
                      </div>
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:12}}>
                      <span style={{fontSize:"0.63rem",padding:"3px 7px",background:r.status==="active"?"rgba(0,200,83,0.1)":"rgba(26,107,255,0.08)",border:`1px solid ${r.status==="active"?"rgba(0,200,83,0.2)":"rgba(26,107,255,0.14)"}`,borderRadius:5,color:r.status==="active"?"#00e676":"#4da6ff",fontWeight:700}}>{r.status}</span>
                      <div style={{fontWeight:800,color:"#00e676",fontSize:"0.9rem",minWidth:60,textAlign:"right"}}>${r.earned.toFixed(2)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tiers */}
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <div style={{fontWeight:800,fontSize:"0.9rem",marginBottom:2}}>Commission Tiers</div>
              {TIERS.map((t,i)=>(
                <div key={i} style={{background:"rgba(4,15,36,0.9)",border:`1px solid ${t.active?"rgba(240,192,64,0.3)":"rgba(26,107,255,0.12)"}`,borderRadius:12,padding:14}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontSize:"0.8rem",color:"rgba(255,255,255,0.65)",fontWeight:600}}>{t.range}</span><span style={{fontSize:"1.2rem",fontWeight:900,color:t.active?"#f0c040":"rgba(255,255,255,0.35)"}}>{t.pct}</span></div>
                  <div style={{fontSize:"0.7rem",color:"rgba(255,255,255,0.4)",lineHeight:1.5}}>{t.desc}</div>
                  {t.active&&<div style={{fontSize:"0.65rem",color:"#f0c040",fontWeight:700,marginTop:6,display:"flex",alignItems:"center",gap:4}}><Star size={10} fill="currentColor"/>Current Tier</div>}
                </div>
              ))}
              <div style={{padding:11,background:"rgba(26,107,255,0.04)",border:"1px solid rgba(26,107,255,0.1)",borderRadius:10,fontSize:"0.7rem",color:"rgba(255,255,255,0.4)",lineHeight:1.6}}>Commissions paid monthly. Min payout $25. Referred users must complete 1 paid job.</div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
