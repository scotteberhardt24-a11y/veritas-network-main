
"use client";
import { useState } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import TopBar from "@/components/topbar/TopBar";
import { VeritasEmblem } from "@/components/badges/VeritasBadges";
import { BarChart3, TrendingUp, DollarSign, Briefcase, Star, Calendar, Download, Zap, Users } from "lucide-react";

const MONTHLY = [
  {m:"Jan",earn:18400,jobs:12,score:89,proposals:34,acceptance:35},
  {m:"Feb",earn:22100,jobs:15,score:90,proposals:41,acceptance:37},
  {m:"Mar",earn:31200,jobs:18,score:91,proposals:52,acceptance:35},
  {m:"Apr",earn:28900,jobs:14,score:92,proposals:48,acceptance:29},
  {m:"May",earn:38700,jobs:21,score:93,proposals:61,acceptance:34},
  {m:"Jun",earn:43200,jobs:24,score:94,proposals:67,acceptance:36},
];

const CATS = [
  {cat:"Development",pct:62,amount:113244,jobs:58},
  {cat:"Design",     pct:21,amount:38325, jobs:24},
  {cat:"Consulting", pct:11,amount:20081, jobs:9 },
  {cat:"Writing",    pct:6, amount:10950, jobs:7 },
];

export default function AnalyticsV2Page() {
  const [period, setPeriod] = useState("6mo");
  const [metric, setMetric] = useState("earnings");
  const maxEarn = Math.max(...MONTHLY.map(m=>m.earn));

  const total = MONTHLY.reduce((a,m)=>a+m.earn,0);
  const avgAcceptance = Math.round(MONTHLY.reduce((a,m)=>a+m.acceptance,0)/MONTHLY.length);

  return (
    <div style={{display:"flex",minHeight:"100vh",background:"#010812"}}>
      <Sidebar/>
      <div style={{flex:1,display:"flex",flexDirection:"column"}}>
        <TopBar/>
        <main style={{flex:1,overflowY:"auto",padding:24,color:"white"}}>

          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24,flexWrap:"wrap",gap:12}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <BarChart3 size={28} color="#1a6bff"/>
              <h1 style={{fontSize:"1.8rem",fontWeight:900,margin:0}}>Analytics</h1>
            </div>
            <div style={{display:"flex",gap:8}}>
              {["3mo","6mo","1yr","All"].map(p=>(
                <button key={p} onClick={()=>setPeriod(p)} style={{padding:"7px 13px",borderRadius:8,border:`1px solid ${period===p?"rgba(26,107,255,0.4)":"rgba(26,107,255,0.12)"}`,background:period===p?"rgba(26,107,255,0.12)":"transparent",color:period===p?"#4da6ff":"rgba(255,255,255,0.4)",fontSize:"0.78rem",fontWeight:600,cursor:"pointer"}}>{p}</button>
              ))}
              <button style={{padding:"7px 13px",borderRadius:8,border:"1px solid rgba(26,107,255,0.15)",background:"rgba(26,107,255,0.06)",color:"#4da6ff",fontSize:"0.78rem",fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",gap:5}}><Download size={13}/>Export</button>
            </div>
          </div>

          {/* KPIs */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:20}}>
            {[
              {icon:<DollarSign size={20}/>,label:"Total Earnings",   value:`$${total.toLocaleString()}`,      sub:"+18% vs prior period",color:"#00e676"},
              {icon:<Briefcase size={20}/>, label:"Jobs Completed",   value:MONTHLY.reduce((a,m)=>a+m.jobs,0),sub:"+4 per month avg",   color:"#f0c040"},
              {icon:<Star size={20}/>,      label:"Avg Trust Score",  value:MONTHLY[MONTHLY.length-1].score,  sub:"+5 points this period",color:"#4da6ff"},
              {icon:<Zap size={20}/>,       label:"Proposal Accept%", value:avgAcceptance+"%",                sub:"Industry avg: 22%",   color:"#00d4ff"},
            ].map((s,i)=>(
              <div key={i} style={{background:"rgba(4,15,36,0.9)",border:"1px solid rgba(26,107,255,0.14)",borderRadius:14,padding:"18px 16px"}}>
                <div style={{color:s.color,marginBottom:8}}>{s.icon}</div>
                <div style={{fontSize:"1.7rem",fontWeight:900,color:s.color,lineHeight:1,marginBottom:3}}>{s.value}</div>
                <div style={{fontSize:"0.7rem",color:"rgba(255,255,255,0.4)"}}>{s.label}</div>
                <div style={{fontSize:"0.62rem",color:"#00e676",marginTop:3,fontWeight:600}}>{s.sub}</div>
              </div>
            ))}
          </div>

          {/* Chart */}
          <div style={{background:"rgba(4,15,36,0.9)",border:"1px solid rgba(26,107,255,0.14)",borderRadius:16,padding:22,marginBottom:16}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
              <div style={{fontWeight:800}}>Monthly Overview</div>
              <div style={{display:"flex",gap:6}}>
                {[["earnings","Earnings"],["jobs","Jobs"],["acceptance","Accept%"]].map(([k,l])=>(
                  <button key={k} onClick={()=>setMetric(k)} style={{padding:"5px 11px",borderRadius:7,border:`1px solid ${metric===k?"rgba(26,107,255,0.4)":"rgba(26,107,255,0.1)"}`,background:metric===k?"rgba(26,107,255,0.12)":"transparent",color:metric===k?"#4da6ff":"rgba(255,255,255,0.4)",fontSize:"0.72rem",fontWeight:600,cursor:"pointer"}}>{l}</button>
                ))}
              </div>
            </div>
            <div style={{display:"flex",alignItems:"flex-end",gap:10,height:140,paddingBottom:4}}>
              {MONTHLY.map((m,i)=>{
                const val   = metric==="earnings"?m.earn:metric==="jobs"?m.jobs*10:m.acceptance*3;
                const maxV  = metric==="earnings"?maxEarn:metric==="jobs"?240:108;
                const label = metric==="earnings"?`$${(m.earn/1000).toFixed(0)}K`:metric==="jobs"?m.jobs:m.acceptance+"%";
                return(
                  <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:5}}>
                    <div style={{fontSize:"0.65rem",fontWeight:700,color:"#00e676"}}>{label}</div>
                    <div style={{width:"100%",background:"linear-gradient(180deg,#1a6bff,rgba(26,107,255,0.4))",borderRadius:"5px 5px 0 0",transition:"height 0.6s",height:`${Math.round((val/maxV)*110)}px`,minHeight:6}}/>
                    <div style={{fontSize:"0.65rem",color:"rgba(255,255,255,0.4)"}}>{m.m}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Monthly table */}
          <div style={{background:"rgba(4,15,36,0.9)",border:"1px solid rgba(26,107,255,0.14)",borderRadius:16,overflow:"hidden",marginBottom:16}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1.5fr 1fr 1fr 1fr",padding:"10px 18px",fontSize:"0.62rem",fontWeight:700,color:"rgba(255,255,255,0.35)",textTransform:"uppercase",letterSpacing:"0.08em",borderBottom:"1px solid rgba(26,107,255,0.1)"}}>
              <div>Month</div><div>Earnings</div><div>Jobs</div><div>Trust Score</div><div>Accept%</div>
            </div>
            {[...MONTHLY].reverse().map((m,i)=>(
              <div key={i} style={{display:"grid",gridTemplateColumns:"1fr 1.5fr 1fr 1fr 1fr",padding:"12px 18px",borderBottom:"1px solid rgba(26,107,255,0.05)",alignItems:"center"}}>
                <div style={{display:"flex",alignItems:"center",gap:6,fontSize:"0.85rem"}}><Calendar size={13} color="rgba(255,255,255,0.3)"/> {m.m} 2026</div>
                <div style={{fontWeight:800,color:"#00e676"}}>${m.earn.toLocaleString()}</div>
                <div style={{fontSize:"0.85rem"}}>{m.jobs}</div>
                <div style={{fontWeight:800,color:"#4da6ff"}}>{m.score}</div>
                <div style={{fontSize:"0.85rem",color:"#00d4ff"}}>{m.acceptance}%</div>
              </div>
            ))}
          </div>

          {/* Category breakdown */}
          <div style={{background:"rgba(4,15,36,0.9)",border:"1px solid rgba(26,107,255,0.14)",borderRadius:16,padding:22}}>
            <div style={{fontWeight:800,marginBottom:16}}>Earnings by Category</div>
            {CATS.map((c,i)=>(
              <div key={i} style={{marginBottom:14}}>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:"0.82rem",marginBottom:5}}>
                  <span style={{color:"rgba(255,255,255,0.7)",fontWeight:600}}>{c.cat}</span>
                  <span style={{fontWeight:800}}>${c.amount.toLocaleString()} <span style={{color:"rgba(255,255,255,0.35)",fontWeight:400}}>({c.pct}% · {c.jobs} jobs)</span></span>
                </div>
                <div style={{height:7,background:"rgba(26,107,255,0.08)",borderRadius:4,overflow:"hidden"}}>
                  <div style={{width:`${c.pct}%`,height:"100%",background:"linear-gradient(90deg,#1a6bff,#00d4ff)",borderRadius:4,transition:"width 0.8s"}}/>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
