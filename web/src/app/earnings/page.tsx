
"use client";
import { useState } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import TopBar from "@/components/topbar/TopBar";
import { VeritasEmblem } from "@/components/badges/VeritasBadges";
import { DollarSign, TrendingUp, Download, Calendar, ArrowUpRight, Clock, CheckCircle2, Lock } from "lucide-react";

const MONTHLY = [
  {month:"Jan",earnings:18400,jobs:12,fee:552},  {month:"Feb",earnings:22100,jobs:15,fee:663},
  {month:"Mar",earnings:31200,jobs:18,fee:936},  {month:"Apr",earnings:28900,jobs:14,fee:867},
  {month:"May",earnings:38700,jobs:21,fee:1161}, {month:"Jun",earnings:43200,jobs:24,fee:1296},
];

const TRANSACTIONS = [
  {id:"TXN-4821",desc:"Milestone 2 — TechVentures SaaS",amount:4500,fee:90,net:4410,date:"Jun 14",status:"released",type:"escrow"},
  {id:"TXN-4720",desc:"Milestone 1 — FinEdge Content",amount:2800,fee:56,net:2744,date:"Jun 8",status:"released",type:"escrow"},
  {id:"TXN-4655",desc:"Brand Identity Final — GreenLeaf",amount:1800,fee:36,net:1764,date:"May 28",status:"released",type:"escrow"},
  {id:"TXN-4590",desc:"Bank Transfer — Chase ••6789",amount:-8000,fee:0,net:-8000,date:"May 20",status:"deposited",type:"withdrawal"},
  {id:"TXN-4521",desc:"Bloom Health — App Milestone 3",amount:3200,fee:64,net:3136,date:"May 15",status:"released",type:"escrow"},
  {id:"TXN-4480",desc:"Escrow Hold — ESC-8821",amount:-5500,fee:0,net:-5500,date:"May 10",status:"held",type:"hold"},
];

export default function EarningsPage() {
  const [period, setPeriod] = useState("6mo");
  const max = Math.max(...MONTHLY.map(m=>m.earnings));
  const total = MONTHLY.reduce((a,m)=>a+m.earnings,0);
  const totalFees = MONTHLY.reduce((a,m)=>a+m.fee,0);
  const totalNet = total - totalFees;

  return (
    <div style={{display:"flex",minHeight:"100vh",background:"#010812"}}>
      <Sidebar/>
      <div style={{flex:1,display:"flex",flexDirection:"column"}}>
        <TopBar/>
        <main style={{flex:1,overflowY:"auto",padding:24,color:"white"}}>

          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24,flexWrap:"wrap",gap:12}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <DollarSign size={28} color="#00e676"/>
              <h1 style={{fontSize:"1.8rem",fontWeight:900,margin:0}}>Earnings</h1>
            </div>
            <div style={{display:"flex",gap:8}}>
              {["3mo","6mo","1yr","All"].map(p=>(
                <button key={p} onClick={()=>setPeriod(p)} style={{padding:"7px 14px",borderRadius:8,border:`1px solid ${period===p?"rgba(26,107,255,0.4)":"rgba(26,107,255,0.12)"}`,background:period===p?"rgba(26,107,255,0.12)":"transparent",color:period===p?"#4da6ff":"rgba(255,255,255,0.4)",fontSize:"0.78rem",fontWeight:600,cursor:"pointer"}}>{p}</button>
              ))}
              <button style={{padding:"7px 14px",borderRadius:8,border:"1px solid rgba(26,107,255,0.15)",background:"rgba(26,107,255,0.06)",color:"#4da6ff",fontSize:"0.78rem",fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",gap:5}}>
                <Download size={13}/> Export
              </button>
            </div>
          </div>

          {/* KPI row */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:20}}>
            {[
              {label:"Gross Earnings", value:`$${total.toLocaleString()}`, sub:"Last 6 months", color:"#00e676", icon:<TrendingUp size={18}/>},
              {label:"Platform Fees",  value:`$${totalFees.toLocaleString()}`, sub:"2% avg rate", color:"#f0c040", icon:<DollarSign size={18}/>},
              {label:"Net Earnings",   value:`$${totalNet.toLocaleString()}`, sub:"After all fees", color:"#00e676", icon:<ArrowUpRight size={18}/>},
              {label:"Held in Escrow", value:"$5,500", sub:"ESC-8821 active", color:"#4da6ff", icon:<Lock size={18}/>},
            ].map((s,i)=>(
              <div key={i} style={{background:"linear-gradient(135deg,rgba(4,15,36,0.96),rgba(6,18,41,0.94))",border:"1px solid rgba(26,107,255,0.14)",borderRadius:14,padding:"18px 16px"}}>
                <div style={{color:s.color,marginBottom:8}}>{s.icon}</div>
                <div style={{fontSize:"1.7rem",fontWeight:900,color:s.color,lineHeight:1,marginBottom:4}}>{s.value}</div>
                <div style={{fontSize:"0.7rem",color:"rgba(255,255,255,0.4)"}}>{s.label}</div>
                <div style={{fontSize:"0.62rem",color:"rgba(255,255,255,0.28)",marginTop:2}}>{s.sub}</div>
              </div>
            ))}
          </div>

          {/* Bar chart */}
          <div style={{background:"rgba(4,15,36,0.9)",border:"1px solid rgba(26,107,255,0.14)",borderRadius:16,padding:22,marginBottom:20}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
              <span style={{fontWeight:800}}>Monthly Earnings</span>
              <span style={{fontSize:"0.72rem",color:"rgba(255,255,255,0.35)"}}>Jan–Jun 2026</span>
            </div>
            <div style={{display:"flex",alignItems:"flex-end",gap:12,height:140}}>
              {MONTHLY.map((m,i)=>(
                <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:6}}>
                  <div style={{fontSize:"0.68rem",fontWeight:700,color:"#00e676"}}>
                    ${(m.earnings/1000).toFixed(0)}K
                  </div>
                  <div style={{
                    width:"100%",
                    height:`${(m.earnings/max)*110}px`,
                    background:`linear-gradient(180deg,#00e676,rgba(26,107,255,0.8))`,
                    borderRadius:"6px 6px 0 0",
                    minHeight:8,
                    position:"relative",
                    cursor:"pointer",
                  }}/>
                  <div style={{fontSize:"0.65rem",color:"rgba(255,255,255,0.4)"}}>{m.month}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Transactions */}
          <div style={{background:"rgba(4,15,36,0.9)",border:"1px solid rgba(26,107,255,0.14)",borderRadius:16,overflow:"hidden"}}>
            <div style={{padding:"16px 20px",borderBottom:"1px solid rgba(26,107,255,0.1)",fontWeight:800}}>Transaction History</div>
            {TRANSACTIONS.map((tx,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 20px",borderBottom:"1px solid rgba(26,107,255,0.06)",gap:12}}>
                <div style={{display:"flex",alignItems:"center",gap:12,flex:1}}>
                  <div style={{width:36,height:36,borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1rem",flexShrink:0,
                    background:tx.type==="escrow"?"rgba(0,200,83,0.1)":tx.type==="withdrawal"?"rgba(240,192,64,0.08)":"rgba(26,107,255,0.08)"}}>
                    {tx.type==="escrow"?"🔒":tx.type==="withdrawal"?"↑":"⏸️"}
                  </div>
                  <div>
                    <div style={{fontWeight:600,fontSize:"0.88rem",marginBottom:2}}>{tx.desc}</div>
                    <div style={{fontSize:"0.68rem",color:"rgba(255,255,255,0.38)"}}>{tx.id} · {tx.date}</div>
                  </div>
                </div>
                <div style={{textAlign:"right",flexShrink:0}}>
                  <div style={{fontWeight:800,fontSize:"0.92rem",color:tx.amount>0?"#00e676":tx.type==="hold"?"#4da6ff":"rgba(255,200,100,0.8)"}}>
                    {tx.amount>0?"+":""}{tx.amount<0&&tx.type!=="hold"?"-":""}{tx.type==="hold"?"🔒 ":""}${Math.abs(tx.amount).toLocaleString()}
                  </div>
                  {tx.fee>0&&<div style={{fontSize:"0.62rem",color:"rgba(255,255,255,0.3)"}}>Fee: -${tx.fee}</div>}
                  <div style={{fontSize:"0.62rem",color:tx.status==="released"?"#00e676":tx.status==="deposited"?"#f0c040":"#4da6ff",display:"flex",alignItems:"center",gap:3,justifyContent:"flex-end",marginTop:2}}>
                    {tx.status==="released"&&<CheckCircle2 size={10}/>}
                    {tx.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
