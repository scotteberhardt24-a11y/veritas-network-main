
"use client";
import { useState } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import TopBar from "@/components/topbar/TopBar";
import { Zap, Play, Pause, Plus, Settings, CheckCircle2, Clock, DollarSign, MessageSquare, Shield, Bell, ArrowRight, Loader2, X, ToggleLeft, ToggleRight } from "lucide-react";

const AUTOMATIONS = [
  {id:"A1",name:"Auto-Reply to New Leads",     icon:"💬", cat:"Communication", active:true,  runs:284,  last:"5m ago",   desc:"Instantly reply to new job inquiries with a personalized intro message.",        trigger:"New message received",      action:"Send templated intro reply"},
  {id:"A2",name:"Trust Score Alert",           icon:"🛡️", cat:"Monitoring",    active:true,  runs:12,   last:"3d ago",   desc:"Get notified when your Trust Score changes by 5+ points in either direction.",   trigger:"Score changes ±5 pts",      action:"Push + email notification"},
  {id:"A3",name:"Invoice on Milestone Approval",icon:"💰",cat:"Finance",       active:true,  runs:47,   last:"2d ago",   desc:"Automatically draft an invoice when a client approves a milestone.",             trigger:"Milestone approved",        action:"Create draft invoice"},
  {id:"A4",name:"Weekly Performance Report",   icon:"📊", cat:"Analytics",     active:false, runs:8,    last:"1w ago",   desc:"Send yourself a weekly summary of earnings, jobs, and Trust Score changes.",     trigger:"Every Monday 9am",          action:"Email weekly summary"},
  {id:"A5",name:"New Job Match Alert",         icon:"⚡", cat:"Jobs",          active:true,  runs:156,  last:"1h ago",   desc:"Get notified when AI finds a job matching 95%+ to your profile.",               trigger:"AI match score ≥ 95%",      action:"Push + email with job link"},
  {id:"A6",name:"Escrow Release Reminder",     icon:"🔒", cat:"Finance",       active:false, runs:23,   last:"5d ago",   desc:"Remind client to release escrow 48h after you mark work complete.",             trigger:"48h after work submitted",  action:"Send client reminder email"},
];

const TEMPLATES = [
  {icon:"🤖",name:"AI Proposal Writer",  desc:"Auto-draft proposals for matched jobs"},
  {icon:"📅",name:"Calendar Sync",       desc:"Block time when you accept a contract"},
  {icon:"⭐",name:"Review Requester",    desc:"Ask for reviews 24h after job completion"},
  {icon:"🔄",name:"Contract Renewal",   desc:"Alert when contract renewal is approaching"},
];

export default function AutomationHubPage() {
  const [autos, setAutos]     = useState(AUTOMATIONS);
  const [showNew, setShowNew] = useState(false);
  const [newName, setNewName] = useState("");
  const [saving, setSaving]   = useState(false);

  function toggle(id:string){ setAutos(p=>p.map(a=>a.id===id?{...a,active:!a.active}:a)); }

  function save(){
    if(!newName) return;
    setSaving(true);
    setTimeout(()=>{setSaving(false);setShowNew(false);setNewName("");},900);
  }

  const activeCount = autos.filter(a=>a.active).length;
  const totalRuns   = autos.reduce((sum,a)=>sum+a.runs,0);

  return (
    <div style={{display:"flex",minHeight:"100vh",background:"#010812"}}>
      <Sidebar/>
      <div style={{flex:1,display:"flex",flexDirection:"column"}}>
        <TopBar/>
        <main style={{flex:1,overflowY:"auto",padding:24,color:"white"}}>

          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24,flexWrap:"wrap",gap:12}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <Zap size={28} color="#a78bfa"/>
              <h1 style={{fontSize:"1.8rem",fontWeight:900,margin:0}}>Automation Hub</h1>
            </div>
            <button onClick={()=>setShowNew(true)} style={{display:"flex",alignItems:"center",gap:7,padding:"11px 20px",background:"linear-gradient(135deg,#a78bfa,#7c3aed)",border:"none",borderRadius:10,color:"white",fontWeight:700,fontSize:"0.88rem",cursor:"pointer",boxShadow:"0 3px 14px rgba(167,139,250,0.35)"}}>
              <Plus size={17}/> New Automation
            </button>
          </div>

          {/* Stats */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:20}}>
            {[
              {label:"Active Automations", value:activeCount, color:"#a78bfa"},
              {label:"Total Runs",         value:totalRuns,   color:"#00e676"},
              {label:"Hours Saved",        value:"~47h",      color:"#f0c040"},
            ].map((s,i)=>(
              <div key={i} style={{background:"rgba(4,15,36,0.9)",border:"1px solid rgba(167,139,250,0.15)",borderRadius:14,padding:"18px 16px",textAlign:"center"}}>
                <div style={{fontSize:"2rem",fontWeight:900,color:s.color,marginBottom:4}}>{s.value}</div>
                <div style={{fontSize:"0.72rem",color:"rgba(255,255,255,0.4)"}}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Automation list */}
          <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:20}}>
            {autos.map(a=>(
              <div key={a.id} style={{background:"rgba(4,15,36,0.9)",border:`1px solid ${a.active?"rgba(167,139,250,0.2)":"rgba(26,107,255,0.1)"}`,borderRadius:14,padding:"16px 18px",display:"flex",alignItems:"center",gap:14,flexWrap:"wrap"}}>
                <span style={{fontSize:"1.5rem",flexShrink:0}}>{a.icon}</span>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3,flexWrap:"wrap"}}>
                    <span style={{fontWeight:700,fontSize:"0.92rem"}}>{a.name}</span>
                    <span style={{fontSize:"0.62rem",padding:"2px 7px",background:"rgba(26,107,255,0.07)",border:"1px solid rgba(26,107,255,0.14)",borderRadius:5,color:"rgba(255,255,255,0.5)"}}>{a.cat}</span>
                  </div>
                  <div style={{fontSize:"0.77rem",color:"rgba(255,255,255,0.5)",marginBottom:5,lineHeight:1.5}}>{a.desc}</div>
                  <div style={{display:"flex",gap:12,fontSize:"0.65rem",color:"rgba(255,255,255,0.35)"}}>
                    <span>⚡ Trigger: {a.trigger}</span>
                    <span>→ {a.action}</span>
                  </div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:12,flexShrink:0}}>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontWeight:700,color:"#4da6ff",fontSize:"0.88rem"}}>{a.runs} runs</div>
                    <div style={{fontSize:"0.62rem",color:"rgba(255,255,255,0.3)"}}>Last: {a.last}</div>
                  </div>
                  <div onClick={()=>toggle(a.id)} style={{cursor:"pointer"}}>
                    {a.active?
                      <div style={{width:44,height:24,borderRadius:12,background:"#a78bfa",position:"relative",transition:"background 0.2s"}}>
                        <span style={{position:"absolute",top:3,right:3,width:18,height:18,borderRadius:"50%",background:"white"}}/>
                      </div>:
                      <div style={{width:44,height:24,borderRadius:12,background:"rgba(255,255,255,0.1)",position:"relative"}}>
                        <span style={{position:"absolute",top:3,left:3,width:18,height:18,borderRadius:"50%",background:"rgba(255,255,255,0.4)"}}/>
                      </div>
                    }
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Templates */}
          <div style={{fontWeight:800,marginBottom:12,fontSize:"0.9rem",display:"flex",alignItems:"center",gap:8}}>
            <Zap size={15} color="#a78bfa"/> Quick Templates
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}}>
            {TEMPLATES.map((t,i)=>(
              <div key={i} style={{background:"rgba(4,15,36,0.8)",border:"1px solid rgba(167,139,250,0.12)",borderRadius:12,padding:14,cursor:"pointer",transition:"border-color 0.15s"}}
                onMouseEnter={e=>(e.currentTarget.style.borderColor="rgba(167,139,250,0.3)")}
                onMouseLeave={e=>(e.currentTarget.style.borderColor="rgba(167,139,250,0.12)")}>
                <div style={{fontSize:"1.6rem",marginBottom:7}}>{t.icon}</div>
                <div style={{fontWeight:700,fontSize:"0.83rem",marginBottom:4}}>{t.name}</div>
                <div style={{fontSize:"0.7rem",color:"rgba(255,255,255,0.4)",lineHeight:1.5,marginBottom:10}}>{t.desc}</div>
                <button style={{fontSize:"0.72rem",color:"#a78bfa",background:"none",border:"none",cursor:"pointer",fontWeight:600,display:"flex",alignItems:"center",gap:4}}>Use Template<ArrowRight size={12}/></button>
              </div>
            ))}
          </div>

          {/* Create modal */}
          {showNew&&(
            <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",backdropFilter:"blur(8px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:50,padding:16}}>
              <div style={{background:"rgba(4,15,36,0.99)",border:"1px solid rgba(167,139,250,0.25)",borderRadius:22,padding:28,width:"100%",maxWidth:460,color:"white"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
                  <div style={{fontWeight:900,fontSize:"1.1rem"}}>New Automation</div>
                  <button onClick={()=>setShowNew(false)} style={{background:"none",border:"none",color:"rgba(255,255,255,0.4)",cursor:"pointer"}}><X size={20}/></button>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:11,marginBottom:18}}>
                  <div>
                    <label style={{fontSize:"0.68rem",fontWeight:700,color:"rgba(255,255,255,0.4)",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:5,display:"block"}}>Automation Name</label>
                    <input value={newName} onChange={e=>setNewName(e.target.value)} placeholder="e.g. Follow up on pending proposals" style={{width:"100%",padding:"11px 14px",background:"rgba(6,18,41,0.8)",border:"1px solid rgba(167,139,250,0.2)",borderRadius:9,color:"white",fontSize:"0.88rem",outline:"none"}}/>
                  </div>
                  {[{l:"Trigger Event",opts:["New message received","Milestone approved","Job match ≥ 90%","Score changes","Weekly schedule","Daily schedule"]},{l:"Action",opts:["Send email notification","Send push notification","Create draft invoice","Post in activity feed","Webhook to URL"]}].map((f,i)=>(
                    <div key={i}>
                      <label style={{fontSize:"0.68rem",fontWeight:700,color:"rgba(255,255,255,0.4)",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:5,display:"block"}}>{f.l}</label>
                      <select style={{width:"100%",padding:"11px 14px",background:"rgba(6,18,41,0.8)",border:"1px solid rgba(167,139,250,0.18)",borderRadius:9,color:"white",fontSize:"0.88rem",outline:"none"}}>
                        {f.opts.map(o=><option key={o}>{o}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
                <div style={{display:"flex",gap:10}}>
                  <button onClick={()=>setShowNew(false)} style={{flex:1,padding:"12px",borderRadius:10,border:"1px solid rgba(167,139,250,0.15)",background:"transparent",color:"rgba(255,255,255,0.5)",cursor:"pointer"}}>Cancel</button>
                  <button onClick={save} disabled={!newName||saving} style={{flex:2,padding:"12px",background:"linear-gradient(135deg,#a78bfa,#7c3aed)",border:"none",borderRadius:10,color:"white",fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:7,opacity:!newName?0.4:1}}>
                    {saving?<Loader2 size={15} style={{animation:"spin 1s linear infinite"}}/>:<Zap size={15}/>}{saving?"Saving...":"Create Automation"}
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
