
"use client";
import { useState, useEffect } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import TopBar from "@/components/topbar/TopBar";
import { Activity, CheckCircle2, AlertTriangle, XCircle, Clock, RefreshCw, Shield, Zap } from "lucide-react";

const SERVICES = [
  {id:"api",        name:"Veritas API",            status:"operational", uptime:"99.98%", latency:"42ms",  region:"Global",   lastIncident:"43d ago"},
  {id:"escrow",     name:"Escrow & Payments",       status:"operational", uptime:"100%",   latency:"89ms",  region:"Global",   lastIncident:"Never"},
  {id:"ai",         name:"AI Match Engine",         status:"operational", uptime:"99.94%", latency:"210ms", region:"US/EU",    lastIncident:"12d ago"},
  {id:"blockchain", name:"Blockchain Layer",        status:"operational", uptime:"99.99%", latency:"1200ms",region:"Polygon",  lastIncident:"90d ago"},
  {id:"auth",       name:"Authentication",          status:"operational", uptime:"100%",   latency:"28ms",  region:"Global",   lastIncident:"Never"},
  {id:"cdn",        name:"CDN & Assets",            status:"operational", uptime:"100%",   latency:"15ms",  region:"Global",   lastIncident:"Never"},
  {id:"database",   name:"Database Cluster",        status:"degraded",    uptime:"99.87%", latency:"145ms", region:"US-East",  lastIncident:"2h ago"},
  {id:"email",      name:"Email Notifications",     status:"operational", uptime:"99.91%", latency:"—",     region:"Global",   lastIncident:"5d ago"},
];

const INCIDENTS = [
  {title:"Database query latency elevated",time:"2h ago",status:"investigating",severity:"minor",service:"Database Cluster",detail:"Elevated query times on read replicas in US-East. No data loss. Active investigation."},
  {title:"AI Match Engine degraded performance",time:"12d ago",status:"resolved",severity:"minor",service:"AI Match Engine",detail:"Resolved. Root cause: insufficient capacity during peak load. Additional capacity provisioned."},
  {title:"Scheduled Maintenance — Escrow upgrade",time:"22d ago",status:"completed",severity:"info",service:"Escrow & Payments",detail:"Successfully upgraded escrow smart contracts to v2.1. Zero downtime deployment."},
];

const S_META:Record<string,{color:string;bg:string;icon:React.ReactNode;label:string}> = {
  operational: {color:"#00e676",bg:"rgba(0,200,83,0.1)",  icon:<CheckCircle2 size={15}/>,label:"Operational"},
  degraded:    {color:"#f0c040",bg:"rgba(240,192,64,0.1)",icon:<AlertTriangle size={15}/>,label:"Degraded"},
  outage:      {color:"#ff5555",bg:"rgba(255,85,85,0.1)", icon:<XCircle size={15}/>,     label:"Outage"},
  maintenance: {color:"#4da6ff",bg:"rgba(26,107,255,0.1)",icon:<Clock size={15}/>,       label:"Maintenance"},
};

export default function PlatformStatusPage() {
  const [lastUpdated,setLast] = useState("Just now");
  const [refreshing,setRef]   = useState(false);
  const [expanded,setExpanded]= useState<string|null>("investigating");

  const allOp = SERVICES.every(s=>s.status==="operational");
  const degraded = SERVICES.filter(s=>s.status==="degraded").length;

  function refresh(){ setRef(true); setTimeout(()=>{setRef(false);setLast("Just now");},1000); }

  return (
    <div style={{display:"flex",minHeight:"100vh",background:"#010812"}}>
      <Sidebar/>
      <div style={{flex:1,display:"flex",flexDirection:"column"}}>
        <TopBar/>
        <main style={{flex:1,overflowY:"auto",padding:24,color:"white"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24,flexWrap:"wrap",gap:12}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}><Activity size={28} color={allOp?"#00e676":"#f0c040"}/><h1 style={{fontSize:"1.8rem",fontWeight:900,margin:0}}>Platform Status</h1></div>
            <button onClick={refresh} disabled={refreshing} style={{display:"flex",alignItems:"center",gap:6,padding:"9px 16px",background:"rgba(26,107,255,0.08)",border:"1px solid rgba(26,107,255,0.2)",borderRadius:9,color:"#4da6ff",fontSize:"0.8rem",fontWeight:600,cursor:"pointer"}}>
              <RefreshCw size={14} style={refreshing?{animation:"spin 1s linear infinite"}:{}}/> Refresh · {lastUpdated}
            </button>
          </div>

          {/* Overall status banner */}
          <div style={{padding:"16px 20px",background:allOp?"rgba(0,200,83,0.07)":"rgba(240,192,64,0.07)",border:`1px solid ${allOp?"rgba(0,200,83,0.2)":"rgba(240,192,64,0.2)"}`,borderRadius:16,marginBottom:20,display:"flex",alignItems:"center",gap:12}}>
            {allOp?<CheckCircle2 size={22} color="#00e676"/>:<AlertTriangle size={22} color="#f0c040"/>}
            <div>
              <div style={{fontWeight:800,color:allOp?"#00e676":"#f0c040",fontSize:"1rem"}}>{allOp?"All Systems Operational":`${degraded} Service${degraded>1?"s":""} Degraded`}</div>
              <div style={{fontSize:"0.75rem",color:"rgba(255,255,255,0.45)",marginTop:2}}>{allOp?"All Veritas services are running normally.":"Minor degradation detected. Investigating."}</div>
            </div>
            <div style={{marginLeft:"auto",display:"flex",gap:16,fontSize:"0.75rem",color:"rgba(255,255,255,0.45)"}}>
              <div style={{textAlign:"center"}}><div style={{fontWeight:900,color:"#00e676",fontSize:"1.1rem"}}>99.97%</div><div>30d uptime</div></div>
              <div style={{textAlign:"center"}}><div style={{fontWeight:900,color:"#4da6ff",fontSize:"1.1rem"}}>42ms</div><div>avg latency</div></div>
            </div>
          </div>

          {/* 90-day uptime chart */}
          <div style={{background:"rgba(4,15,36,0.9)",border:"1px solid rgba(26,107,255,0.14)",borderRadius:16,padding:20,marginBottom:20}}>
            <div style={{fontWeight:800,marginBottom:12,display:"flex",alignItems:"center",gap:8}}><Zap size={16} color="#4da6ff"/>90-Day Uptime</div>
            <div style={{display:"flex",gap:2,height:28}}>
              {Array.from({length:90}).map((_,i)=>{
                const c = i===87?"#f0c040":i===77?"#f0c040":"#00e676";
                return <div key={i} style={{flex:1,background:c,borderRadius:2,opacity:0.7+(i/90)*0.3}}/>;
              })}
            </div>
            <div style={{display:"flex",justifyContent:"space-between",marginTop:6,fontSize:"0.65rem",color:"rgba(255,255,255,0.3)"}}>
              <span>90 days ago</span><span>Today</span>
            </div>
          </div>

          {/* Services */}
          <div style={{background:"rgba(4,15,36,0.9)",border:"1px solid rgba(26,107,255,0.14)",borderRadius:16,overflow:"hidden",marginBottom:20}}>
            <div style={{padding:"14px 18px",borderBottom:"1px solid rgba(26,107,255,0.1)",fontWeight:800,fontSize:"0.9rem",display:"flex",alignItems:"center",gap:8}}><Shield size={16} color="#4da6ff"/>Service Status</div>
            {SERVICES.map((s,i)=>{
              const m=S_META[s.status];
              return(
                <div key={s.id} style={{display:"flex",alignItems:"center",gap:14,padding:"13px 18px",borderBottom:i<SERVICES.length-1?"1px solid rgba(26,107,255,0.06)":"none"}}>
                  <div style={{color:m.color,flexShrink:0}}>{m.icon}</div>
                  <div style={{flex:1}}><div style={{fontWeight:600,fontSize:"0.88rem"}}>{s.name}</div><div style={{fontSize:"0.65rem",color:"rgba(255,255,255,0.38)"}}>{s.region}</div></div>
                  <div style={{display:"flex",gap:16,fontSize:"0.75rem",flexShrink:0}}>
                    <div style={{textAlign:"center"}}><div style={{fontWeight:700,color:"#00e676"}}>{s.uptime}</div><div style={{fontSize:"0.6rem",color:"rgba(255,255,255,0.35)"}}>uptime</div></div>
                    <div style={{textAlign:"center"}}><div style={{fontWeight:700,color:"rgba(255,255,255,0.6)"}}>{s.latency}</div><div style={{fontSize:"0.6rem",color:"rgba(255,255,255,0.35)"}}>latency</div></div>
                  </div>
                  <span style={{fontSize:"0.68rem",padding:"4px 10px",background:m.bg,border:`1px solid ${m.color}33`,borderRadius:7,color:m.color,fontWeight:700,flexShrink:0}}>{m.label}</span>
                </div>
              );
            })}
          </div>

          {/* Incidents */}
          <div style={{fontWeight:800,marginBottom:12,fontSize:"0.9rem"}}>Recent Incidents</div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {INCIDENTS.map((inc,i)=>(
              <div key={i} style={{background:"rgba(4,15,36,0.9)",border:`1px solid ${inc.status==="investigating"?"rgba(240,192,64,0.25)":inc.status==="resolved"?"rgba(0,200,83,0.15)":"rgba(26,107,255,0.15)"}`,borderRadius:14,overflow:"hidden"}}>
                <button onClick={()=>setExpanded(expanded===inc.status+i?null:inc.status+i)} style={{width:"100%",display:"flex",alignItems:"center",gap:12,padding:"14px 18px",background:"none",border:"none",color:"white",cursor:"pointer",textAlign:"left"}}>
                  <div style={{width:8,height:8,borderRadius:"50%",background:inc.status==="investigating"?"#f0c040":inc.status==="resolved"?"#00e676":"#4da6ff",flexShrink:0}}/>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:700,fontSize:"0.9rem"}}>{inc.title}</div>
                    <div style={{fontSize:"0.68rem",color:"rgba(255,255,255,0.4)"}}>{inc.service} · {inc.time}</div>
                  </div>
                  <span style={{fontSize:"0.65rem",padding:"3px 8px",borderRadius:5,fontWeight:700,background:inc.status==="investigating"?"rgba(240,192,64,0.12)":inc.status==="resolved"?"rgba(0,200,83,0.1)":"rgba(26,107,255,0.1)",color:inc.status==="investigating"?"#f0c040":inc.status==="resolved"?"#00e676":"#4da6ff",border:"none",flexShrink:0}}>{inc.status}</span>
                </button>
                {expanded===inc.status+i&&<div style={{padding:"0 18px 14px",fontSize:"0.82rem",color:"rgba(255,255,255,0.55)",lineHeight:1.65,borderTop:"1px solid rgba(26,107,255,0.08)"}}>{inc.detail}</div>}
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
