
"use client";
import { useState, useEffect } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import TopBar from "@/components/topbar/TopBar";
import { VeritasEmblem } from "@/components/badges/VeritasBadges";
import { Shield, Users, Briefcase, DollarSign, AlertTriangle, TrendingUp, Activity, CheckCircle2, Ban, Search, Eye, Loader2, Zap } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "https://veritas-trust-ledger-production.up.railway.app";

const USERS = [
  {id:"U001",name:"Alex Chen",    email:"alex@dev.io",  role:"worker",score:99,status:"active",  joined:"Jan 2025",earnings:184500,jobs:247,flag:false},
  {id:"U002",name:"Maya Rodriguez",email:"maya@d.co",   role:"worker",score:98,status:"active",  joined:"Feb 2025",earnings:142000,jobs:189,flag:false},
  {id:"U003",name:"Brian Walsh",  email:"brian@tv.com", role:"client",score:91,status:"active",  joined:"Nov 2024",earnings:0,     jobs:34, flag:false},
  {id:"U004",name:"Suspicious",   email:"scam@bad.io",  role:"worker",score:12,status:"flagged", joined:"Jun 2026",earnings:0,     jobs:0,  flag:true},
  {id:"U005",name:"James Park",   email:"jp@write.co",  role:"worker",score:97,status:"active",  joined:"Mar 2025",earnings:98700, jobs:312,flag:false},
  {id:"U006",name:"New User",     email:"new@user.io",  role:"worker",score:50,status:"pending", joined:"Jun 2026",earnings:0,     jobs:0,  flag:false},
];

const METRICS = [
  {label:"Platform Revenue MTD",value:"$48,200",  change:"+18%"},
  {label:"Avg Trust Score",     value:"78.4",     change:"+1.2"},
  {label:"Dispute Rate",        value:"0.8%",     change:"-0.1%"},
  {label:"Worker Retention",    value:"84.7%",    change:"+3.2%"},
  {label:"Avg Job Value",       value:"$3,240",   change:"+$180"},
  {label:"AI Match Rate",       value:"67.3%",    change:"+4.1%"},
  {label:"Escrow Release Rate", value:"98.1%",    change:"+0.3%"},
  {label:"New Registrations",   value:"1,247",    change:"+31%"},
];

export default function AdminV2Page() {
  const [tab, setTab]       = useState("overview");
  const [users, setUsers]   = useState(USERS);
  const [search, setSearch] = useState("");
  const [banning, setBanning] = useState<string|null>(null);

  function ban(id:string) {
    setBanning(id);
    setTimeout(()=>{ setUsers(p=>p.map(u=>u.id===id?{...u,status:"banned"}:u)); setBanning(null); },1000);
  }

  const filtered = users.filter(u=>!search||u.name.toLowerCase().includes(search.toLowerCase())||u.email.toLowerCase().includes(search.toLowerCase()));
  const TABS = ["overview","users","disputes","platform"];

  const EVENTS = [
    {type:"🟢",msg:"New Elite member: Alex Chen reached Trust Score 990",time:"2m ago"},
    {type:"💰",msg:"Large escrow activated: $18,000 — Bloom Health",time:"15m ago"},
    {type:"🚨",msg:"Dispute escalated: DSP-1021 — requires manual review",time:"42m ago"},
    {type:"👤",msg:"Registration spike: +47 users in the last hour",time:"1h ago"},
    {type:"🤖",msg:"AI match engine updated — acceptance rate now 94.2%",time:"3h ago"},
    {type:"⚡",msg:"Platform fee revenue hit monthly record: $48,200",time:"5h ago"},
  ];

  return (
    <div style={{display:"flex",minHeight:"100vh",background:"#010812"}}>
      <Sidebar/>
      <div style={{flex:1,display:"flex",flexDirection:"column"}}>
        <TopBar/>
        <main style={{flex:1,overflowY:"auto",padding:24,color:"white"}}>

          {/* Header */}
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24,flexWrap:"wrap",gap:12}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <VeritasEmblem size={44}/>
              <div>
                <h1 style={{fontSize:"1.8rem",fontWeight:900,margin:0}}>Admin Panel</h1>
                <div style={{fontSize:"0.65rem",color:"rgba(255,255,255,0.35)",marginTop:2}}>Veritas Network Control Center</div>
              </div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:8,padding:"7px 14px",background:"rgba(255,50,50,0.08)",border:"1px solid rgba(255,50,50,0.2)",borderRadius:10}}>
              <div style={{width:7,height:7,borderRadius:"50%",background:"#ff3333",animation:"pulse 2s infinite"}}/>
              <span style={{fontSize:"0.75rem",color:"#ff6666",fontWeight:700,letterSpacing:"0.08em"}}>ADMIN ACCESS</span>
            </div>
          </div>

          {/* Tabs */}
          <div style={{display:"flex",gap:2,marginBottom:20,borderBottom:"1px solid rgba(26,107,255,0.1)"}}>
            {TABS.map(t=>(
              <button key={t} onClick={()=>setTab(t)} style={{padding:"10px 18px",fontSize:"0.85rem",fontWeight:600,border:"none",background:"transparent",cursor:"pointer",color:tab===t?"#4da6ff":"rgba(255,255,255,0.4)",borderBottom:tab===t?"2px solid #1a6bff":"2px solid transparent",marginBottom:-1,textTransform:"capitalize"}}>{t}</button>
            ))}
          </div>

          {/* OVERVIEW */}
          {tab==="overview"&&(
            <div style={{display:"flex",flexDirection:"column",gap:16}}>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14}}>
                {[
                  {icon:<Users size={20}/>,      label:"Total Users",     value:"12,847",sub:"+124 today",  color:"#4da6ff"},
                  {icon:<Briefcase size={20}/>,  label:"Active Jobs",     value:"2,341", sub:"+89 today",   color:"#f0c040"},
                  {icon:<DollarSign size={20}/>, label:"Escrow Held",     value:"$1.2M", sub:"Across 891",  color:"#00e676"},
                  {icon:<AlertTriangle size={20}/>,label:"Open Disputes", value:"14",    sub:"2 urgent",    color:"#ff5555"},
                ].map((s,i)=>{
                  const Icon=s.icon;
                  return(
                    <div key={i} style={{background:"rgba(4,15,36,0.9)",border:"1px solid rgba(26,107,255,0.14)",borderRadius:14,padding:"18px 16px"}}>
                      <div style={{color:s.color,marginBottom:8}}>{s.icon}</div>
                      <div style={{fontSize:"1.8rem",fontWeight:900,color:s.color,lineHeight:1,marginBottom:3}}>{s.value}</div>
                      <div style={{fontSize:"0.7rem",color:"rgba(255,255,255,0.4)"}}>{s.label}</div>
                      <div style={{fontSize:"0.62rem",color:"#00e676",marginTop:3,fontWeight:600}}>{s.sub}</div>
                    </div>
                  );
                })}
              </div>

              <div style={{background:"rgba(4,15,36,0.9)",border:"1px solid rgba(26,107,255,0.14)",borderRadius:16,padding:20}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
                  <Activity size={16} color="#1a6bff"/>
                  <span style={{fontWeight:800,fontSize:"0.9rem"}}>Live Platform Events</span>
                  <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:5,fontSize:"0.65rem",color:"#00e676"}}>
                    <div style={{width:6,height:6,borderRadius:"50%",background:"#00e676",animation:"pulse 1.5s infinite"}}/>LIVE
                  </div>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:2}}>
                  {EVENTS.map((e,i)=>(
                    <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 12px",borderRadius:9,background:i===0?"rgba(26,107,255,0.06)":"transparent"}}>
                      <span style={{fontSize:"0.9rem"}}>{e.type}</span>
                      <span style={{fontSize:"0.82rem",color:"rgba(255,255,255,0.65)",flex:1}}>{e.msg}</span>
                      <span style={{fontSize:"0.65rem",color:"rgba(255,255,255,0.3)",flexShrink:0,whiteSpace:"nowrap"}}>{e.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* USERS */}
          {tab==="users"&&(
            <div>
              <div style={{marginBottom:14,maxWidth:360,position:"relative"}}>
                <Search size={14} style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:"rgba(255,255,255,0.3)"}}/>
                <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search users..." style={{width:"100%",padding:"10px 12px 10px 36px",background:"rgba(6,18,41,0.8)",border:"1px solid rgba(26,107,255,0.18)",borderRadius:9,color:"white",fontSize:"0.85rem",outline:"none"}}/>
              </div>
              <div style={{background:"rgba(4,15,36,0.9)",border:"1px solid rgba(26,107,255,0.12)",borderRadius:16,overflow:"hidden"}}>
                <div style={{display:"grid",gridTemplateColumns:"2fr 2fr 1fr 1fr 1.5fr 1fr",padding:"10px 18px",fontSize:"0.62rem",fontWeight:700,color:"rgba(255,255,255,0.35)",textTransform:"uppercase",letterSpacing:"0.08em",borderBottom:"1px solid rgba(26,107,255,0.1)"}}>
                  <div>User</div><div>Email</div><div>Score</div><div>Role</div><div>Status</div><div>Actions</div>
                </div>
                {filtered.map(u=>(
                  <div key={u.id} style={{display:"grid",gridTemplateColumns:"2fr 2fr 1fr 1fr 1.5fr 1fr",padding:"12px 18px",borderBottom:"1px solid rgba(26,107,255,0.06)",alignItems:"center"}}>
                    <div style={{fontWeight:600,fontSize:"0.85rem"}}>{u.name}</div>
                    <div style={{fontSize:"0.75rem",color:"rgba(255,255,255,0.45)"}}>{u.email}</div>
                    <div style={{fontWeight:800,color:"#00e676",fontSize:"0.9rem"}}>{u.score}</div>
                    <div><span style={{fontSize:"0.65rem",padding:"3px 8px",background:"rgba(26,107,255,0.08)",border:"1px solid rgba(26,107,255,0.15)",borderRadius:5,color:"#4da6ff",textTransform:"capitalize"}}>{u.role}</span></div>
                    <div><span style={{fontSize:"0.65rem",padding:"3px 8px",borderRadius:5,fontWeight:700,
                      background:u.status==="active"?"rgba(0,200,83,0.1)":u.status==="flagged"?"rgba(255,85,85,0.1)":u.status==="banned"?"rgba(100,0,0,0.2)":"rgba(26,107,255,0.08)",
                      color:u.status==="active"?"#00e676":u.status==="flagged"?"#ff5555":u.status==="banned"?"#ff3333":"#4da6ff",
                      border:`1px solid ${u.status==="active"?"rgba(0,200,83,0.2)":u.status==="flagged"?"rgba(255,85,85,0.25)":"rgba(26,107,255,0.15)"}`,
                      textTransform:"capitalize"}}>{u.status}</span></div>
                    <div style={{display:"flex",gap:5}}>
                      <button style={{padding:"5px 8px",background:"rgba(26,107,255,0.08)",border:"1px solid rgba(26,107,255,0.18)",borderRadius:6,cursor:"pointer"}}><Eye size={12} color="#4da6ff"/></button>
                      {u.status!=="banned"&&u.status!=="active"&&(
                        <button onClick={()=>ban(u.id)} disabled={banning===u.id} style={{padding:"5px 8px",background:"rgba(255,85,85,0.08)",border:"1px solid rgba(255,85,85,0.2)",borderRadius:6,cursor:"pointer"}}>
                          {banning===u.id?<Loader2 size={12} color="#ff5555" style={{animation:"spin 1s linear infinite"}}/>:<Ban size={12} color="#ff5555"/>}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PLATFORM METRICS */}
          {tab==="platform"&&(
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14}}>
              {METRICS.map((m,i)=>(
                <div key={i} style={{background:"rgba(4,15,36,0.9)",border:"1px solid rgba(26,107,255,0.14)",borderRadius:14,padding:"18px 16px"}}>
                  <div style={{fontSize:"0.65rem",fontWeight:700,color:"rgba(255,255,255,0.38)",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:8}}>{m.label}</div>
                  <div style={{fontSize:"1.5rem",fontWeight:900,marginBottom:4}}>{m.value}</div>
                  <div style={{fontSize:"0.72rem",color:"#00e676",fontWeight:600}}>{m.change}</div>
                </div>
              ))}
            </div>
          )}

          {tab==="disputes"&&(
            <div style={{maxWidth:700,display:"flex",flexDirection:"column",gap:10}}>
              {[
                {id:"DSP-1021",parties:"CloudSync AI vs Zoe L.",amount:2000,status:"open",    opened:"Jun 28"},
                {id:"DSP-1019",parties:"RetailBoost vs Tom E.", amount:800, status:"resolved",opened:"Jun 20"},
                {id:"DSP-1015",parties:"FinEdge vs Rina P.",    amount:1500,status:"open",    opened:"Jun 15"},
              ].map((d,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 18px",background:"rgba(4,15,36,0.9)",border:`1px solid ${d.status==="open"?"rgba(255,85,85,0.2)":"rgba(0,200,83,0.15)"}`,borderRadius:14,gap:12}}>
                  <div style={{display:"flex",alignItems:"center",gap:12}}>
                    <div style={{width:36,height:36,borderRadius:10,background:d.status==="open"?"rgba(255,85,85,0.1)":"rgba(0,200,83,0.1)",display:"flex",alignItems:"center",justifyContent:"center"}}>
                      {d.status==="open"?<AlertTriangle size={17} color="#ff5555"/>:<CheckCircle2 size={17} color="#00e676"/>}
                    </div>
                    <div>
                      <div style={{fontWeight:700,fontSize:"0.9rem"}}>{d.id} — {d.parties}</div>
                      <div style={{fontSize:"0.7rem",color:"rgba(255,255,255,0.4)"}}>Opened {d.opened} · Disputed: <span style={{color:"#ff5555",fontWeight:700}}>${d.amount.toLocaleString()}</span></div>
                    </div>
                  </div>
                  <div style={{display:"flex",gap:8,alignItems:"center"}}>
                    <span style={{fontSize:"0.7rem",padding:"4px 10px",borderRadius:7,fontWeight:700,background:d.status==="open"?"rgba(255,85,85,0.1)":"rgba(0,200,83,0.1)",color:d.status==="open"?"#ff5555":"#00e676",border:`1px solid ${d.status==="open"?"rgba(255,85,85,0.25)":"rgba(0,200,83,0.2)"}`}}>{d.status}</span>
                    {d.status==="open"&&<button style={{padding:"6px 12px",background:"rgba(240,192,64,0.12)",border:"1px solid rgba(240,192,64,0.25)",borderRadius:8,color:"#f0c040",fontSize:"0.75rem",fontWeight:700,cursor:"pointer"}}>Review</button>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
