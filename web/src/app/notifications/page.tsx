
"use client";
import { useState } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import TopBar from "@/components/topbar/TopBar";
import { VeritasEmblem } from "@/components/badges/VeritasBadges";
import { Bell, DollarSign, Briefcase, Shield, AlertTriangle, Award, Settings, X, CheckCheck, Trash2, Filter, Zap } from "lucide-react";

type NType = "payment"|"job"|"trust"|"dispute"|"badge"|"system";

interface Notif {
  id:string; type:NType; title:string; body:string;
  time:string; read:boolean; urgent?:boolean; action?:string;
}

const TYPE_CONFIG:Record<NType,{icon:React.ElementType;color:string;bg:string;label:string}> = {
  payment: { icon:DollarSign,  color:"#00e676", bg:"rgba(0,200,83,0.1)",    label:"Payments"   },
  job:     { icon:Briefcase,   color:"#f0c040", bg:"rgba(240,192,64,0.08)", label:"Jobs"        },
  trust:   { icon:Shield,      color:"#4da6ff", bg:"rgba(26,107,255,0.1)",  label:"Trust Score" },
  dispute: { icon:AlertTriangle,color:"#ff5555",bg:"rgba(255,85,85,0.08)",  label:"Disputes"    },
  badge:   { icon:Award,       color:"#c9a227", bg:"rgba(201,162,39,0.1)",  label:"Badges"      },
  system:  { icon:Settings,    color:"rgba(255,255,255,0.4)", bg:"rgba(255,255,255,0.04)", label:"System" },
};

const MOCK:Notif[] = [
  {id:"1",type:"payment",  title:"$4,500 Milestone Released",              body:"TechVentures Inc. approved Milestone 2. Funds are now in your Vault.",                            time:"2m ago",  read:false, action:"View Vault"},
  {id:"2",type:"dispute",  title:"Dispute Opened Against You",             body:"CloudSync AI opened a dispute on contract ESC-8654 for $2,000. Respond within 24h.",            time:"18m ago", read:false, urgent:true, action:"Respond Now"},
  {id:"3",type:"trust",    title:"Trust Score Increased: 837 → 845",       body:"5-star review from TechVentures added +8 points. You're now in the top 3% globally.",           time:"1h ago",  read:false, action:"View Score"},
  {id:"4",type:"badge",    title:"🏅 Badge Unlocked: 1 Year Verified",     body:"You've been a verified Veritas member for 1 year. Your badge has been added to your Passport.", time:"2h ago",  read:false, action:"View Badge"},
  {id:"5",type:"job",      title:"New AI Match: React Native Developer",   body:"Bloom Health posted a $15–20K job matching 99% of your skills. Only 2 proposals so far.",      time:"3h ago",  read:true,  action:"View Job"},
  {id:"6",type:"payment",  title:"Platform Fee Charged",                   body:"A 2% fee ($90) was deducted from your $4,500 milestone release. Net received: $4,410.",         time:"3h ago",  read:true},
  {id:"7",type:"trust",    title:"Skill Badge Earned: Next.js Verified",   body:"You passed the Next.js 15 skills assessment with 87%. +20 Trust Score points applied.",         time:"1d ago",  read:true,  action:"View Passport"},
  {id:"8",type:"job",      title:"Proposal Accepted by Bloom Health",      body:"Nadia Rose accepted your proposal for the Product Demo Video. Contract signing is next.",       time:"1d ago",  read:true,  action:"Sign Contract"},
  {id:"9",type:"system",   title:"Identity Verification Complete",         body:"Your government ID has been verified. Your KYC Verified badge is now active.",                  time:"2d ago",  read:true},
  {id:"10",type:"payment", title:"Bank Transfer Initiated",                body:"$8,000 withdrawal to Chase ••6789 initiated. Expected arrival: 1–2 business days.",              time:"2d ago",  read:true},
];

const PREFS = ["All","Payments","Jobs","Trust Score","Disputes","Badges","System"];

export default function NotificationsV2Page() {
  const [notifs, setNotifs]     = useState<Notif[]>(MOCK);
  const [filter, setFilter]     = useState("All");
  const [urgentOnly, setUrgent] = useState(false);
  const [emailOn, setEmailOn]   = useState(true);
  const [pushOn, setPushOn]     = useState(true);
  const [showPrefs, setShowPrefs] = useState(false);

  const unread  = notifs.filter(n=>!n.read).length;
  const urgent  = notifs.filter(n=>n.urgent&&!n.read).length;

  const filtered = notifs.filter(n=>{
    const matchFilter = filter==="All" || TYPE_CONFIG[n.type].label===filter;
    const matchUrgent = !urgentOnly || n.urgent;
    return matchFilter && matchUrgent;
  });

  function markAll()  { setNotifs(p=>p.map(n=>({...n,read:true}))); }
  function markRead(id:string) { setNotifs(p=>p.map(n=>n.id===id?{...n,read:true}:n)); }
  function remove(id:string)   { setNotifs(p=>p.filter(n=>n.id!==id)); }
  function clearAll()          { setNotifs([]); }

  return (
    <div style={{display:"flex",minHeight:"100vh",background:"#010812"}}>
      <Sidebar/>
      <div style={{flex:1,display:"flex",flexDirection:"column"}}>
        <TopBar/>
        <main style={{flex:1,overflowY:"auto",padding:24,color:"white"}}>

          {/* Header */}
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20,flexWrap:"wrap",gap:12}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <Bell size={28} color="#1a6bff"/>
              <h1 style={{fontSize:"1.8rem",fontWeight:900,margin:0}}>Notifications</h1>
              {unread>0&&<span style={{background:"#ff3333",color:"white",fontSize:"0.72rem",fontWeight:800,padding:"3px 9px",borderRadius:20}}>{unread}</span>}
            </div>
            <div style={{display:"flex",gap:8}}>
              {unread>0&&<button onClick={markAll} style={{display:"flex",alignItems:"center",gap:6,padding:"8px 14px",background:"rgba(26,107,255,0.08)",border:"1px solid rgba(26,107,255,0.2)",borderRadius:8,color:"#4da6ff",fontSize:"0.78rem",fontWeight:600,cursor:"pointer"}}><CheckCheck size={14}/>Mark All Read</button>}
              <button onClick={()=>setShowPrefs(!showPrefs)} style={{display:"flex",alignItems:"center",gap:6,padding:"8px 14px",background:showPrefs?"rgba(26,107,255,0.15)":"rgba(26,107,255,0.06)",border:"1px solid rgba(26,107,255,0.2)",borderRadius:8,color:"#4da6ff",fontSize:"0.78rem",fontWeight:600,cursor:"pointer"}}><Settings size={14}/>Preferences</button>
            </div>
          </div>

          {/* Urgent banner */}
          {urgent>0&&(
            <div style={{display:"flex",alignItems:"center",gap:10,padding:"12px 16px",background:"rgba(255,85,85,0.07)",border:"1px solid rgba(255,85,85,0.2)",borderRadius:12,marginBottom:16}}>
              <AlertTriangle size={18} color="#ff5555"/>
              <span style={{fontWeight:700,color:"#ff5555"}}>{urgent} urgent notification{urgent>1?"s":""}</span>
              <span style={{color:"rgba(255,255,255,0.5)",fontSize:"0.85rem"}}>requiring immediate attention</span>
              <button onClick={()=>setUrgent(!urgentOnly)} style={{marginLeft:"auto",padding:"5px 12px",background:"rgba(255,85,85,0.15)",border:"1px solid rgba(255,85,85,0.3)",borderRadius:6,color:"#ff5555",fontSize:"0.72rem",fontWeight:700,cursor:"pointer"}}>
                {urgentOnly?"Show All":"View Urgent"}
              </button>
            </div>
          )}

          <div style={{display:"flex",gap:20}}>
            {/* Main list */}
            <div style={{flex:1}}>
              {/* Filter chips */}
              <div style={{display:"flex",gap:7,flexWrap:"wrap",marginBottom:14}}>
                {PREFS.map(p=>(
                  <button key={p} onClick={()=>setFilter(p)} style={{padding:"6px 14px",borderRadius:20,border:`1px solid ${filter===p?"rgba(26,107,255,0.45)":"rgba(26,107,255,0.12)"}`,background:filter===p?"rgba(26,107,255,0.12)":"transparent",color:filter===p?"#4da6ff":"rgba(255,255,255,0.45)",fontSize:"0.74rem",fontWeight:600,cursor:"pointer"}}>
                    {p}
                  </button>
                ))}
              </div>

              {filtered.length===0?(
                <div style={{textAlign:"center",padding:"60px 20px",background:"rgba(4,15,36,0.6)",border:"1px solid rgba(26,107,255,0.1)",borderRadius:16}}>
                  <Bell size={40} color="rgba(255,255,255,0.15)" style={{margin:"0 auto 12px"}}/>
                  <div style={{fontSize:"1.1rem",fontWeight:700,marginBottom:4}}>All caught up!</div>
                  <div style={{color:"rgba(255,255,255,0.35)",fontSize:"0.85rem"}}>No notifications to show</div>
                </div>
              ):(
                <div style={{display:"flex",flexDirection:"column",gap:6}}>
                  {filtered.map(n=>{
                    const cfg = TYPE_CONFIG[n.type];
                    const Icon = cfg.icon;
                    return(
                      <div key={n.id} onClick={()=>markRead(n.id)} style={{
                        display:"flex",alignItems:"flex-start",gap:12,padding:"14px 16px",
                        background:n.urgent?"rgba(255,85,85,0.05)":!n.read?"rgba(26,107,255,0.05)":"rgba(4,15,36,0.7)",
                        border:`1px solid ${n.urgent?"rgba(255,85,85,0.2)":!n.read?"rgba(26,107,255,0.2)":"rgba(26,107,255,0.08)"}`,
                        borderRadius:14,cursor:"pointer",transition:"all 0.15s",
                      }}>
                        {/* Icon */}
                        <div style={{width:38,height:38,borderRadius:10,background:cfg.bg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:2}}>
                          <Icon size={17} color={cfg.color}/>
                        </div>
                        {/* Content */}
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:3,flexWrap:"wrap"}}>
                            <span style={{fontWeight:700,fontSize:"0.9rem"}}>{n.title}</span>
                            {!n.read&&<span style={{width:7,height:7,borderRadius:"50%",background:"#1a6bff",flexShrink:0}}/>}
                            {n.urgent&&<span style={{fontSize:"0.58rem",padding:"2px 6px",background:"rgba(255,85,85,0.15)",border:"1px solid rgba(255,85,85,0.3)",borderRadius:4,color:"#ff5555",fontWeight:800}}>URGENT</span>}
                          </div>
                          <div style={{fontSize:"0.8rem",color:"rgba(255,255,255,0.55)",lineHeight:1.55,marginBottom:6}}>{n.body}</div>
                          <div style={{display:"flex",alignItems:"center",gap:10}}>
                            <span style={{fontSize:"0.68rem",color:"rgba(255,255,255,0.3)"}}>{n.time}</span>
                            {n.action&&<button style={{fontSize:"0.72rem",color:"#4da6ff",background:"none",border:"none",cursor:"pointer",fontWeight:600,padding:0}}>{n.action} →</button>}
                          </div>
                        </div>
                        {/* Delete */}
                        <button onClick={e=>{e.stopPropagation();remove(n.id);}} style={{padding:6,background:"none",border:"none",cursor:"pointer",color:"rgba(255,255,255,0.2)",flexShrink:0,borderRadius:6,transition:"all 0.15s"}}
                          onMouseEnter={e=>(e.currentTarget.style.color="#ff5555")}
                          onMouseLeave={e=>(e.currentTarget.style.color="rgba(255,255,255,0.2)")}>
                          <X size={14}/>
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Preferences panel */}
            {showPrefs&&(
              <div style={{width:260,flexShrink:0}}>
                <div style={{background:"rgba(4,15,36,0.95)",border:"1px solid rgba(26,107,255,0.18)",borderRadius:16,padding:18,position:"sticky",top:20}}>
                  <div style={{fontWeight:800,marginBottom:16,fontSize:"0.9rem",display:"flex",alignItems:"center",gap:6}}>
                    <Settings size={15} color="#4da6ff"/>Preferences
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:12,marginBottom:16}}>
                    {[
                      {label:"Email Notifications", desc:"Daily digest + urgent", val:emailOn, set:()=>setEmailOn(!emailOn)},
                      {label:"Push Notifications",  desc:"Browser & mobile",      val:pushOn,  set:()=>setPushOn(!pushOn)},
                      {label:"Urgent Only Mode",    desc:"Suppress non-urgent",   val:urgentOnly, set:()=>setUrgent(!urgentOnly)},
                    ].map((p,i)=>(
                      <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:8}}>
                        <div>
                          <div style={{fontSize:"0.82rem",fontWeight:600}}>{p.label}</div>
                          <div style={{fontSize:"0.65rem",color:"rgba(255,255,255,0.38)"}}>{p.desc}</div>
                        </div>
                        <div onClick={p.set} style={{width:40,height:22,borderRadius:11,background:p.val?"#1a6bff":"rgba(255,255,255,0.1)",position:"relative",cursor:"pointer",flexShrink:0,transition:"background 0.2s"}}>
                          <span style={{position:"absolute",top:3,width:16,height:16,borderRadius:"50%",background:"white",transition:"left 0.2s",left:p.val?21:3}}/>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{borderTop:"1px solid rgba(26,107,255,0.1)",paddingTop:14}}>
                    <div style={{fontSize:"0.72rem",fontWeight:700,color:"rgba(255,255,255,0.38)",marginBottom:8,textTransform:"uppercase",letterSpacing:"0.08em"}}>Notify me about</div>
                    {Object.entries(TYPE_CONFIG).map(([type,cfg])=>{
                      const Icon=cfg.icon;
                      return(
                        <label key={type} style={{display:"flex",alignItems:"center",gap:8,padding:"5px 0",cursor:"pointer",fontSize:"0.8rem",color:"rgba(255,255,255,0.65)"}}>
                          <input type="checkbox" defaultChecked style={{accentColor:"#1a6bff"}}/>
                          <Icon size={13} color={cfg.color}/>
                          {cfg.label}
                        </label>
                      );
                    })}
                  </div>
                  {notifs.length>0&&(
                    <button onClick={clearAll} style={{width:"100%",marginTop:14,padding:"9px",background:"rgba(255,85,85,0.07)",border:"1px solid rgba(255,85,85,0.18)",borderRadius:9,color:"#ff5555",fontSize:"0.75rem",fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
                      <Trash2 size={13}/>Clear All
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
