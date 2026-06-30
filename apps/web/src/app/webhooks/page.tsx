
"use client";
import { useState } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import TopBar from "@/components/topbar/TopBar";
import { Webhook, Plus, CheckCircle2, XCircle, Clock, Loader2, X, Trash2, RefreshCw, AlertTriangle, Zap } from "lucide-react";

const HOOKS = [
  {id:"W1",url:"https://api.myapp.com/webhooks/veritas",  events:["milestone.released","dispute.opened"],status:"active",lastFired:"2m ago",  success:284, failed:2},
  {id:"W2",url:"https://hooks.zapier.com/hooks/catch/abc", events:["job.matched","score.changed"],         status:"active",lastFired:"15m ago", success:412, failed:0},
  {id:"W3",url:"https://staging.myapp.com/wh",             events:["contract.signed"],                      status:"failing",lastFired:"2h ago",  success:18,  failed:24},
];

const EVENT_TYPES = ["milestone.released","milestone.disputed","dispute.opened","dispute.resolved","job.matched","job.applied","contract.signed","score.changed","badge.earned","payment.received"];

const RECENT_DELIVERIES = [
  {id:"D1",event:"milestone.released",url:"api.myapp.com",status:200,time:"2m ago"},
  {id:"D2",event:"job.matched",       url:"hooks.zapier.com",status:200,time:"15m ago"},
  {id:"D3",event:"contract.signed",   url:"staging.myapp.com",status:500,time:"2h ago"},
  {id:"D4",event:"score.changed",     url:"hooks.zapier.com",status:200,time:"3h ago"},
];

export default function WebhooksPage() {
  const [hooks, setHooks]       = useState(HOOKS);
  const [showNew, setShowNew]   = useState(false);
  const [newUrl, setNewUrl]     = useState("");
  const [selectedEvents, setSel]= useState<string[]>([]);
  const [creating, setCreating] = useState(false);
  const [testing, setTesting]   = useState<string|null>(null);

  function toggleEvent(e:string){ setSel(p=>p.includes(e)?p.filter(x=>x!==e):[...p,e]); }
  function create(){
    if(!newUrl||selectedEvents.length===0) return;
    setCreating(true);
    setTimeout(()=>{
      setHooks(p=>[{id:"W"+Date.now(),url:newUrl,events:selectedEvents,status:"active",lastFired:"Never",success:0,failed:0},...p]);
      setCreating(false);setShowNew(false);setNewUrl("");setSel([]);
    },1000);
  }
  function testHook(id:string){ setTesting(id); setTimeout(()=>setTesting(null),1500); }
  function deleteHook(id:string){ if(confirm("Delete this webhook?")) setHooks(p=>p.filter(h=>h.id!==id)); }

  const totalSuccess = hooks.reduce((a,h)=>a+h.success,0);
  const totalFailed  = hooks.reduce((a,h)=>a+h.failed,0);

  return(
    <div style={{display:"flex",minHeight:"100vh",background:"#010812"}}>
      <Sidebar/>
      <div style={{flex:1,display:"flex",flexDirection:"column"}}>
        <TopBar/>
        <main style={{flex:1,overflowY:"auto",padding:24,color:"white"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24,flexWrap:"wrap",gap:12}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}><Webhook size={28} color="#a78bfa"/><h1 style={{fontSize:"1.8rem",fontWeight:900,margin:0}}>Webhooks</h1></div>
            <button onClick={()=>setShowNew(true)} style={{display:"flex",alignItems:"center",gap:7,padding:"11px 20px",background:"linear-gradient(135deg,#a78bfa,#7c3aed)",border:"none",borderRadius:10,color:"white",fontWeight:700,fontSize:"0.88rem",cursor:"pointer"}}><Plus size={17}/>Add Webhook</button>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:20}}>
            {[{l:"Active Webhooks",v:hooks.filter(h=>h.status==="active").length,c:"#a78bfa"},{l:"Successful",v:totalSuccess.toLocaleString(),c:"#00e676"},{l:"Failed",v:totalFailed,c:"#ff5555"},{l:"Success Rate",v:`${Math.round((totalSuccess/(totalSuccess+totalFailed))*100)}%`,c:"#4da6ff"}].map((s,i)=>(
              <div key={i} style={{background:"rgba(4,15,36,0.9)",border:"1px solid rgba(26,107,255,0.14)",borderRadius:14,padding:"18px 16px",textAlign:"center"}}><div style={{fontSize:"1.8rem",fontWeight:900,color:s.c,marginBottom:4}}>{s.v}</div><div style={{fontSize:"0.7rem",color:"rgba(255,255,255,0.4)"}}>{s.l}</div></div>
            ))}
          </div>

          <div style={{display:"grid",gridTemplateColumns:"1fr 320px",gap:20}}>
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              {hooks.map(h=>(
                <div key={h.id} style={{background:"rgba(4,15,36,0.9)",border:`1px solid ${h.status==="failing"?"rgba(255,85,85,0.25)":"rgba(26,107,255,0.14)"}`,borderRadius:16,padding:18}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12,marginBottom:10,flexWrap:"wrap"}}>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:4}}>
                        {h.status==="active"?<CheckCircle2 size={14} color="#00e676"/>:<XCircle size={14} color="#ff5555"/>}
                        <span style={{fontFamily:"monospace",fontSize:"0.82rem",color:"rgba(255,255,255,0.8)",overflow:"hidden",textOverflow:"ellipsis"}}>{h.url}</span>
                      </div>
                      <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                        {h.events.map(e=><span key={e} style={{fontSize:"0.62rem",padding:"2px 8px",background:"rgba(167,139,250,0.1)",border:"1px solid rgba(167,139,250,0.2)",borderRadius:5,color:"#a78bfa",fontWeight:600}}>{e}</span>)}
                      </div>
                    </div>
                    <div style={{display:"flex",gap:6,flexShrink:0}}>
                      <button onClick={()=>testHook(h.id)} disabled={testing===h.id} style={{padding:"6px 12px",background:"rgba(26,107,255,0.08)",border:"1px solid rgba(26,107,255,0.18)",borderRadius:7,color:"#4da6ff",fontSize:"0.7rem",fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",gap:4}}>
                        {testing===h.id?<Loader2 size={11} style={{animation:"spin 1s linear infinite"}}/>:<RefreshCw size={11}/>}{testing===h.id?"Testing...":"Test"}
                      </button>
                      <button onClick={()=>deleteHook(h.id)} style={{padding:"6px 9px",background:"rgba(255,85,85,0.07)",border:"1px solid rgba(255,85,85,0.18)",borderRadius:7,cursor:"pointer"}}><Trash2 size={12} color="rgba(255,85,85,0.7)"/></button>
                    </div>
                  </div>
                  <div style={{display:"flex",gap:14,fontSize:"0.7rem",color:"rgba(255,255,255,0.4)"}}>
                    <span>Last fired: {h.lastFired}</span>
                    <span style={{color:"#00e676"}}>✓ {h.success} success</span>
                    {h.failed>0&&<span style={{color:"#ff5555"}}>✗ {h.failed} failed</span>}
                  </div>
                </div>
              ))}
            </div>

            <div style={{background:"rgba(4,15,36,0.9)",border:"1px solid rgba(26,107,255,0.14)",borderRadius:16,padding:18}}>
              <div style={{fontWeight:800,marginBottom:12,fontSize:"0.88rem"}}>Recent Deliveries</div>
              {RECENT_DELIVERIES.map((d,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"9px 0",borderBottom:i<RECENT_DELIVERIES.length-1?"1px solid rgba(26,107,255,0.06)":"none"}}>
                  <span style={{fontSize:"0.65rem",padding:"2px 6px",borderRadius:4,fontWeight:700,background:d.status===200?"rgba(0,200,83,0.1)":"rgba(255,85,85,0.1)",color:d.status===200?"#00e676":"#ff5555"}}>{d.status}</span>
                  <div style={{flex:1}}><div style={{fontSize:"0.78rem",fontWeight:600}}>{d.event}</div><div style={{fontSize:"0.62rem",color:"rgba(255,255,255,0.35)"}}>{d.url} · {d.time}</div></div>
                </div>
              ))}
            </div>
          </div>

          {showNew&&(
            <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",backdropFilter:"blur(8px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:50,padding:16}}>
              <div style={{background:"rgba(4,15,36,0.99)",border:"1px solid rgba(167,139,250,0.25)",borderRadius:22,padding:28,width:"100%",maxWidth:460,color:"white"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}><div style={{fontWeight:900,fontSize:"1.1rem"}}>Add Webhook</div><button onClick={()=>setShowNew(false)} style={{background:"none",border:"none",color:"rgba(255,255,255,0.4)",cursor:"pointer"}}><X size={20}/></button></div>
                <div style={{marginBottom:14}}>
                  <label style={{fontSize:"0.68rem",fontWeight:700,color:"rgba(255,255,255,0.4)",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:5,display:"block"}}>Endpoint URL</label>
                  <input value={newUrl} onChange={e=>setNewUrl(e.target.value)} placeholder="https://yourapp.com/webhooks/veritas" style={{width:"100%",padding:"11px 14px",background:"rgba(6,18,41,0.8)",border:"1px solid rgba(167,139,250,0.18)",borderRadius:9,color:"white",fontSize:"0.85rem",outline:"none",fontFamily:"monospace"}}/>
                </div>
                <div style={{marginBottom:18}}>
                  <label style={{fontSize:"0.68rem",fontWeight:700,color:"rgba(255,255,255,0.4)",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:8,display:"block"}}>Events to Subscribe</label>
                  <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                    {EVENT_TYPES.map(e=>(
                      <button key={e} onClick={()=>toggleEvent(e)} style={{padding:"6px 11px",borderRadius:7,border:`1px solid ${selectedEvents.includes(e)?"rgba(167,139,250,0.4)":"rgba(26,107,255,0.14)"}`,background:selectedEvents.includes(e)?"rgba(167,139,250,0.12)":"rgba(26,107,255,0.04)",color:selectedEvents.includes(e)?"#a78bfa":"rgba(255,255,255,0.45)",fontSize:"0.7rem",fontWeight:600,cursor:"pointer"}}>{e}</button>
                    ))}
                  </div>
                </div>
                <div style={{display:"flex",gap:10}}>
                  <button onClick={()=>setShowNew(false)} style={{flex:1,padding:"12px",borderRadius:10,border:"1px solid rgba(26,107,255,0.15)",background:"transparent",color:"rgba(255,255,255,0.5)",cursor:"pointer"}}>Cancel</button>
                  <button onClick={create} disabled={!newUrl||selectedEvents.length===0||creating} style={{flex:2,padding:"12px",background:"linear-gradient(135deg,#a78bfa,#7c3aed)",border:"none",borderRadius:10,color:"white",fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:7,opacity:!newUrl||selectedEvents.length===0?0.4:1}}>
                    {creating?<Loader2 size={15} style={{animation:"spin 1s linear infinite"}}/>:<Zap size={15}/>}{creating?"Creating...":"Create Webhook"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
