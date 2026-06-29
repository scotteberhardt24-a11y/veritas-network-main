
"use client";
import { useState } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import TopBar from "@/components/topbar/TopBar";
import { Bell, Plus, X, Zap, Briefcase, CheckCircle2, Loader2, DollarSign, Shield, Clock, Trash2 } from "lucide-react";

const ALERTS = [
  {id:"1",name:"Senior Next.js Roles",  keywords:["Next.js","React","TypeScript"], minBudget:8000,  maxBudget:25000, frequency:"instant",  active:true,  hits:47,  lastHit:"2h ago"},
  {id:"2",name:"Web3 & Solidity",       keywords:["Solidity","Web3","Ethereum"],   minBudget:10000, maxBudget:50000, frequency:"instant",  active:true,  hits:12,  lastHit:"1d ago"},
  {id:"3",name:"SaaS Dashboard Builds", keywords:["SaaS","Dashboard","Stripe"],    minBudget:5000,  maxBudget:20000, frequency:"daily",    active:false, hits:89,  lastHit:"3d ago"},
  {id:"4",name:"Remote Full-Stack",     keywords:["Full-Stack","Remote","Node.js"],minBudget:6000,  maxBudget:18000, frequency:"instant",  active:true,  hits:134, lastHit:"4h ago"},
];

const RECENT_MATCHES = [
  {id:"JB-4510",title:"Senior React Developer",client:"StartupX",budget:"$12,000",match:99,alert:"Senior Next.js Roles",ago:"2h"},
  {id:"JB-4508",title:"Next.js SaaS Platform", client:"FinVault", budget:"$18,000",match:97,alert:"Senior Next.js Roles",ago:"5h"},
  {id:"JB-4502",title:"Smart Contract Audit",  client:"DeFi Labs",budget:"$15,000",match:94,alert:"Web3 & Solidity",    ago:"1d"},
];

export default function JobAlertsPage() {
  const [alerts, setAlerts]     = useState(ALERTS);
  const [showNew, setShowNew]   = useState(false);
  const [newName, setNewName]   = useState("");
  const [newKw, setNewKw]       = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [minBudget, setMinB]    = useState("");
  const [freq, setFreq]         = useState("instant");
  const [saving, setSaving]     = useState(false);
  const [saved, setSaved]       = useState(false);

  function addKw(){ const k=newKw.trim(); if(k&&!keywords.includes(k)){setKeywords(p=>[...p,k]);setNewKw("");} }
  function toggle(id:string){ setAlerts(p=>p.map(a=>a.id===id?{...a,active:!a.active}:a)); }
  function remove(id:string){ setAlerts(p=>p.filter(a=>a.id!==id)); }
  function save(){
    if(!newName||keywords.length===0) return;
    setSaving(true);
    setTimeout(()=>{
      setAlerts(p=>[{id:Date.now().toString(),name:newName,keywords,minBudget:parseInt(minBudget)||0,maxBudget:100000,frequency:freq,active:true,hits:0,lastHit:"never"},...p]);
      setSaving(false);setSaved(true);setTimeout(()=>{setSaved(false);setShowNew(false);setNewName("");setKeywords([]);setMinB("");},1200);
    },900);
  }

  const totalActive = alerts.filter(a=>a.active).length;
  const totalHits   = alerts.reduce((s,a)=>s+a.hits,0);

  return (
    <div style={{display:"flex",minHeight:"100vh",background:"#010812"}}>
      <Sidebar/>
      <div style={{flex:1,display:"flex",flexDirection:"column"}}>
        <TopBar/>
        <main style={{flex:1,overflowY:"auto",padding:24,color:"white"}}>

          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24,flexWrap:"wrap",gap:12}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <Bell size={28} color="#f0c040"/>
              <h1 style={{fontSize:"1.8rem",fontWeight:900,margin:0}}>Job Alerts</h1>
            </div>
            <button onClick={()=>setShowNew(true)} style={{display:"flex",alignItems:"center",gap:7,padding:"11px 20px",background:"linear-gradient(135deg,#1a6bff,#0050dd)",border:"none",borderRadius:10,color:"white",fontWeight:700,fontSize:"0.88rem",cursor:"pointer",boxShadow:"0 3px 14px rgba(26,107,255,0.35)"}}>
              <Plus size={17}/> New Alert
            </button>
          </div>

          {/* Stats */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:20}}>
            {[{label:"Active Alerts",value:totalActive,color:"#4da6ff"},{label:"Total Matches",value:totalHits,color:"#f0c040"},{label:"Avg Response",value:"< 2h",color:"#00e676"}].map((s,i)=>(
              <div key={i} style={{background:"rgba(4,15,36,0.9)",border:"1px solid rgba(26,107,255,0.14)",borderRadius:14,padding:"18px 16px",textAlign:"center"}}>
                <div style={{fontSize:"2rem",fontWeight:900,color:s.color,marginBottom:4}}>{s.value}</div>
                <div style={{fontSize:"0.72rem",color:"rgba(255,255,255,0.4)"}}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Alert cards */}
          <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:24}}>
            {alerts.map(a=>(
              <div key={a.id} style={{background:"rgba(4,15,36,0.9)",border:`1px solid ${a.active?"rgba(26,107,255,0.2)":"rgba(26,107,255,0.08)"}`,borderRadius:14,padding:"16px 18px",display:"flex",alignItems:"center",gap:14,flexWrap:"wrap",opacity:a.active?1:0.6}}>
                <div style={{width:40,height:40,borderRadius:11,background:a.active?"rgba(26,107,255,0.12)":"rgba(255,255,255,0.04)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <Bell size={18} color={a.active?"#4da6ff":"rgba(255,255,255,0.3)"}/>
                </div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:700,fontSize:"0.92rem",marginBottom:5}}>{a.name}</div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:5}}>
                    {a.keywords.map(k=><span key={k} style={{fontSize:"0.65rem",padding:"2px 8px",background:"rgba(26,107,255,0.07)",border:"1px solid rgba(26,107,255,0.14)",borderRadius:5,color:"rgba(255,255,255,0.6)"}}>{k}</span>)}
                  </div>
                  <div style={{fontSize:"0.68rem",color:"rgba(255,255,255,0.35)",display:"flex",gap:12}}>
                    <span>Min: ${a.minBudget.toLocaleString()}</span>
                    <span>Frequency: {a.frequency}</span>
                    <span>Last match: {a.lastHit}</span>
                  </div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
                  <div style={{textAlign:"center"}}>
                    <div style={{fontWeight:800,color:"#f0c040",fontSize:"1rem"}}>{a.hits}</div>
                    <div style={{fontSize:"0.6rem",color:"rgba(255,255,255,0.3)"}}>matches</div>
                  </div>
                  <div onClick={()=>toggle(a.id)} style={{width:40,height:22,borderRadius:11,background:a.active?"#1a6bff":"rgba(255,255,255,0.1)",position:"relative",cursor:"pointer",transition:"background 0.2s"}}>
                    <span style={{position:"absolute",top:3,width:16,height:16,borderRadius:"50%",background:"white",transition:"left 0.2s",left:a.active?21:3}}/>
                  </div>
                  <button onClick={()=>remove(a.id)} style={{padding:7,background:"none",border:"none",cursor:"pointer",color:"rgba(255,100,100,0.5)"}}><Trash2 size={14}/></button>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Matches */}
          <div style={{fontWeight:800,marginBottom:12,fontSize:"0.9rem",display:"flex",alignItems:"center",gap:8}}>
            <Zap size={15} color="#f0c040"/> Recent Matches
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {RECENT_MATCHES.map(m=>(
              <div key={m.id} style={{display:"flex",alignItems:"center",gap:14,padding:"14px 18px",background:"rgba(4,15,36,0.8)",border:"1px solid rgba(26,107,255,0.1)",borderRadius:12}}>
                <div style={{flex:1}}>
                  <div style={{fontWeight:700,fontSize:"0.9rem",marginBottom:2}}>{m.title}</div>
                  <div style={{fontSize:"0.7rem",color:"rgba(255,255,255,0.4)"}}>{m.client} · {m.budget} · via "{m.alert}" alert · {m.ago} ago</div>
                </div>
                <div style={{fontSize:"1.4rem",fontWeight:900,color:"#f0c040",flexShrink:0}}>{m.match}%</div>
                <button style={{padding:"8px 14px",background:"linear-gradient(135deg,#1a6bff,#0050dd)",border:"none",borderRadius:9,color:"white",fontWeight:700,fontSize:"0.75rem",cursor:"pointer",flexShrink:0,boxShadow:"0 2px 10px rgba(26,107,255,0.3)"}}>Apply</button>
              </div>
            ))}
          </div>

          {showNew&&(
            <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",backdropFilter:"blur(8px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:50,padding:16}}>
              <div style={{background:"rgba(4,15,36,0.99)",border:"1px solid rgba(26,107,255,0.25)",borderRadius:22,padding:28,width:"100%",maxWidth:460,color:"white"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
                  <div style={{fontWeight:900,fontSize:"1.1rem"}}>New Job Alert</div>
                  <button onClick={()=>setShowNew(false)} style={{background:"none",border:"none",color:"rgba(255,255,255,0.4)",cursor:"pointer"}}><X size={20}/></button>
                </div>
                {saved?(
                  <div style={{textAlign:"center",padding:"28px 0"}}>
                    <CheckCircle2 size={44} color="#00e676" style={{margin:"0 auto 12px"}}/>
                    <div style={{fontWeight:800}}>Alert Created!</div>
                  </div>
                ):(
                  <>
                    <div style={{display:"flex",flexDirection:"column",gap:11,marginBottom:18}}>
                      <div>
                        <label style={{fontSize:"0.68rem",fontWeight:700,color:"rgba(255,255,255,0.4)",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:5,display:"block"}}>Alert Name</label>
                        <input value={newName} onChange={e=>setNewName(e.target.value)} placeholder="e.g. Senior React Developer Roles" style={{width:"100%",padding:"11px 14px",background:"rgba(6,18,41,0.8)",border:"1px solid rgba(26,107,255,0.18)",borderRadius:9,color:"white",fontSize:"0.88rem",outline:"none"}}/>
                      </div>
                      <div>
                        <label style={{fontSize:"0.68rem",fontWeight:700,color:"rgba(255,255,255,0.4)",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:5,display:"block"}}>Keywords</label>
                        <div style={{display:"flex",gap:7,marginBottom:7}}>
                          <input value={newKw} onChange={e=>setNewKw(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addKw()} placeholder="e.g. React, TypeScript..." style={{flex:1,padding:"10px 13px",background:"rgba(6,18,41,0.8)",border:"1px solid rgba(26,107,255,0.18)",borderRadius:9,color:"white",fontSize:"0.85rem",outline:"none"}}/>
                          <button onClick={addKw} style={{padding:"10px 14px",background:"rgba(26,107,255,0.12)",border:"1px solid rgba(26,107,255,0.25)",borderRadius:9,color:"#4da6ff",cursor:"pointer",fontWeight:700}}><Plus size={15}/></button>
                        </div>
                        <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                          {keywords.map(k=><span key={k} style={{display:"flex",alignItems:"center",gap:5,padding:"4px 10px",background:"rgba(26,107,255,0.1)",border:"1px solid rgba(26,107,255,0.22)",borderRadius:7,fontSize:"0.76rem",color:"#4da6ff",fontWeight:600}}>{k}<button onClick={()=>setKeywords(p=>p.filter(x=>x!==k))} style={{background:"none",border:"none",cursor:"pointer",color:"rgba(255,255,255,0.35)",padding:0}}><X size={10}/></button></span>)}
                        </div>
                      </div>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                        <div>
                          <label style={{fontSize:"0.68rem",fontWeight:700,color:"rgba(255,255,255,0.4)",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:5,display:"block"}}>Min Budget ($)</label>
                          <input value={minBudget} onChange={e=>setMinB(e.target.value)} type="number" placeholder="5000" style={{width:"100%",padding:"10px 13px",background:"rgba(6,18,41,0.8)",border:"1px solid rgba(26,107,255,0.18)",borderRadius:9,color:"white",fontSize:"0.85rem",outline:"none"}}/>
                        </div>
                        <div>
                          <label style={{fontSize:"0.68rem",fontWeight:700,color:"rgba(255,255,255,0.4)",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:5,display:"block"}}>Frequency</label>
                          <select value={freq} onChange={e=>setFreq(e.target.value)} style={{width:"100%",padding:"10px 13px",background:"rgba(6,18,41,0.8)",border:"1px solid rgba(26,107,255,0.18)",borderRadius:9,color:"white",fontSize:"0.85rem",outline:"none"}}>
                            <option value="instant">Instant</option>
                            <option value="hourly">Hourly digest</option>
                            <option value="daily">Daily digest</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div style={{display:"flex",gap:10}}>
                      <button onClick={()=>setShowNew(false)} style={{flex:1,padding:"12px",borderRadius:10,border:"1px solid rgba(26,107,255,0.15)",background:"transparent",color:"rgba(255,255,255,0.5)",cursor:"pointer"}}>Cancel</button>
                      <button onClick={save} disabled={!newName||keywords.length===0||saving} style={{flex:2,padding:"12px",background:"linear-gradient(135deg,#1a6bff,#0050dd)",border:"none",borderRadius:10,color:"white",fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:7,opacity:!newName||keywords.length===0?0.4:1}}>
                        {saving?<Loader2 size={15} style={{animation:"spin 1s linear infinite"}}/>:<Bell size={15}/>}{saving?"Saving...":"Create Alert"}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
