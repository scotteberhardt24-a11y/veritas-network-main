
"use client";
import { useState } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import TopBar from "@/components/topbar/TopBar";
import { DollarSign, Download, Search, CheckCircle2, ArrowUpRight, Lock, TrendingUp, Filter } from "lucide-react";

const PAYMENTS = [
  {id:"TXN-5021",desc:"Milestone 3 — TechVentures SaaS",          amount:3000, fee:60,  net:2940, date:"Jun 28",type:"release",from:"TechVentures Inc.",chain:"Polygon",  status:"confirmed"},
  {id:"TXN-5018",desc:"Milestone 2 — TechVentures SaaS",          amount:2500, fee:50,  net:2450, date:"Jun 14",type:"release",from:"TechVentures Inc.",chain:"Polygon",  status:"confirmed"},
  {id:"TXN-5012",desc:"Milestone 1 — TechVentures SaaS",          amount:2000, fee:40,  net:1960, date:"Jun 1", type:"release",from:"TechVentures Inc.",chain:"Polygon",  status:"confirmed"},
  {id:"TXN-4998",desc:"Design System Final — GreenLeaf",           amount:1800, fee:36,  net:1764, date:"Jun 3", type:"release",from:"GreenLeaf Studios", chain:"Polygon",  status:"confirmed"},
  {id:"TXN-4980",desc:"Platform Fee — Pro Plan",                   amount:-49,  fee:0,   net:-49,  date:"Jun 1", type:"fee",    from:"Veritas Platform",  chain:"—",        status:"charged"},
  {id:"TXN-4971",desc:"Bank Transfer — Chase ••6789",              amount:-8000,fee:0,   net:-8000,date:"May 20",type:"withdrawal",from:"Vault",           chain:"—",        status:"deposited"},
  {id:"TXN-4960",desc:"Content Q3 Final — FinEdge Capital",        amount:2800, fee:56,  net:2744, date:"May 28",type:"release",from:"FinEdge Capital",   chain:"Ethereum", status:"confirmed"},
  {id:"TXN-4944",desc:"Brand Mark — GreenLeaf Studios",            amount:1800, fee:36,  net:1764, date:"May 22",type:"release",from:"GreenLeaf Studios", chain:"Polygon",  status:"confirmed"},
];

const TYPE_META:Record<string,{color:string;icon:string}> = {
  release:    {color:"#00e676",icon:"↓"},
  fee:        {color:"rgba(255,200,100,0.8)",icon:"%"},
  withdrawal: {color:"#f0c040",icon:"↑"},
};

export default function PaymentHistoryPage() {
  const [search,setSearch] = useState("");
  const [type,setType]     = useState("all");
  const [period,setPeriod] = useState("3mo");

  const filtered = PAYMENTS.filter(p=>{
    const q=search.toLowerCase();
    return (type==="all"||p.type===type) && (!q||p.desc.toLowerCase().includes(q)||p.from.toLowerCase().includes(q));
  });

  const totalIn  = PAYMENTS.filter(p=>p.amount>0).reduce((a,p)=>a+p.amount,0);
  const totalFees= PAYMENTS.filter(p=>p.type==="fee"||p.fee>0).reduce((a,p)=>a+Math.abs(p.type==="fee"?p.amount:p.fee),0);
  const totalOut = PAYMENTS.filter(p=>p.type==="withdrawal").reduce((a,p)=>a+Math.abs(p.amount),0);
  const net      = totalIn-totalFees-totalOut;

  return (
    <div style={{display:"flex",minHeight:"100vh",background:"#010812"}}>
      <Sidebar/>
      <div style={{flex:1,display:"flex",flexDirection:"column"}}>
        <TopBar/>
        <main style={{flex:1,overflowY:"auto",padding:24,color:"white"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24,flexWrap:"wrap",gap:12}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}><DollarSign size={28} color="#00e676"/><h1 style={{fontSize:"1.8rem",fontWeight:900,margin:0}}>Payment History</h1></div>
            <div style={{display:"flex",gap:8}}>
              {["1mo","3mo","6mo","All"].map(p=><button key={p} onClick={()=>setPeriod(p)} style={{padding:"7px 13px",borderRadius:8,border:`1px solid ${period===p?"rgba(26,107,255,0.4)":"rgba(26,107,255,0.12)"}`,background:period===p?"rgba(26,107,255,0.12)":"transparent",color:period===p?"#4da6ff":"rgba(255,255,255,0.4)",fontSize:"0.78rem",fontWeight:600,cursor:"pointer"}}>{p}</button>)}
              <button style={{display:"flex",alignItems:"center",gap:5,padding:"7px 13px",borderRadius:8,border:"1px solid rgba(26,107,255,0.15)",background:"rgba(26,107,255,0.06)",color:"#4da6ff",fontSize:"0.78rem",fontWeight:600,cursor:"pointer"}}><Download size={13}/>Export</button>
            </div>
          </div>

          {/* KPIs */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:20}}>
            {[{l:"Total Received",v:`$${totalIn.toLocaleString()}`,c:"#00e676",i:<ArrowUpRight size={18}/>},{l:"Fees Paid",v:`$${totalFees.toLocaleString()}`,c:"#f0c040",i:<DollarSign size={18}/>},{l:"Withdrawn",v:`$${totalOut.toLocaleString()}`,c:"#4da6ff",i:<Lock size={18}/>},{l:"Net Earned",v:`$${(totalIn-totalFees).toLocaleString()}`,c:"#00e676",i:<TrendingUp size={18}/>}].map((s,i)=>(
              <div key={i} style={{background:"rgba(4,15,36,0.9)",border:"1px solid rgba(26,107,255,0.14)",borderRadius:14,padding:"18px 16px"}}>
                <div style={{color:s.c,marginBottom:8}}>{s.i}</div>
                <div style={{fontSize:"1.7rem",fontWeight:900,color:s.c,lineHeight:1,marginBottom:3}}>{s.v}</div>
                <div style={{fontSize:"0.7rem",color:"rgba(255,255,255,0.4)"}}>{s.l}</div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div style={{display:"flex",gap:10,marginBottom:14,flexWrap:"wrap"}}>
            <div style={{position:"relative",flex:1,maxWidth:320}}>
              <Search size={14} style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:"rgba(255,255,255,0.3)"}}/>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search transactions..." style={{width:"100%",padding:"10px 12px 10px 34px",background:"rgba(6,18,41,0.8)",border:"1px solid rgba(26,107,255,0.18)",borderRadius:9,color:"white",fontSize:"0.85rem",outline:"none"}}/>
            </div>
            {["all","release","withdrawal","fee"].map(t=><button key={t} onClick={()=>setType(t)} style={{padding:"9px 14px",borderRadius:9,border:`1px solid ${type===t?"rgba(26,107,255,0.4)":"rgba(26,107,255,0.12)"}`,background:type===t?"rgba(26,107,255,0.12)":"transparent",color:type===t?"#4da6ff":"rgba(255,255,255,0.4)",fontSize:"0.78rem",fontWeight:600,cursor:"pointer",textTransform:"capitalize"}}>{t}</button>)}
          </div>

          {/* Table */}
          <div style={{background:"rgba(4,15,36,0.9)",border:"1px solid rgba(26,107,255,0.14)",borderRadius:16,overflow:"hidden"}}>
            <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr 80px",padding:"10px 18px",fontSize:"0.62rem",fontWeight:700,color:"rgba(255,255,255,0.35)",textTransform:"uppercase",letterSpacing:"0.08em",borderBottom:"1px solid rgba(26,107,255,0.1)"}}>
              <div>Transaction</div><div>Amount</div><div>Fee</div><div>Net</div><div>Status</div>
            </div>
            {filtered.map((tx,i)=>{
              const m=TYPE_META[tx.type];
              return(
                <div key={i} style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr 80px",padding:"13px 18px",borderBottom:"1px solid rgba(26,107,255,0.06)",alignItems:"center"}}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <div style={{width:34,height:34,borderRadius:9,background:`rgba(${tx.amount>0?"0,200,83":"255,200,100"},0.1)`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,color:m.color,flexShrink:0}}>{m.icon}</div>
                    <div>
                      <div style={{fontWeight:600,fontSize:"0.85rem",marginBottom:1}}>{tx.desc}</div>
                      <div style={{fontSize:"0.65rem",color:"rgba(255,255,255,0.38)"}}>{tx.id} · {tx.from} · {tx.date}</div>
                    </div>
                  </div>
                  <div style={{fontWeight:800,color:tx.amount>0?"#00e676":"rgba(255,200,100,0.8)",fontSize:"0.9rem"}}>{tx.amount>0?"+":""}${Math.abs(tx.amount).toLocaleString()}</div>
                  <div style={{fontSize:"0.82rem",color:"rgba(255,255,255,0.45)"}}>{tx.fee>0?`-$${tx.fee}`:"—"}</div>
                  <div style={{fontWeight:700,color:"#00e676",fontSize:"0.9rem"}}>{tx.net>0?"+":""}${Math.abs(tx.net).toLocaleString()}</div>
                  <div><span style={{fontSize:"0.62rem",padding:"3px 8px",borderRadius:5,fontWeight:700,background:tx.status==="confirmed"?"rgba(0,200,83,0.1)":"rgba(240,192,64,0.1)",color:tx.status==="confirmed"?"#00e676":"#f0c040",border:`1px solid ${tx.status==="confirmed"?"rgba(0,200,83,0.2)":"rgba(240,192,64,0.2)"}`}}>{tx.status}</span></div>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}
