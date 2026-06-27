
"use client";
import { useState } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import TopBar from "@/components/topbar/TopBar";
import { Building2, Users, Briefcase, DollarSign, Plus, Shield, TrendingUp, Clock, CheckCircle2, AlertTriangle, ChevronRight, Mail, Settings, X, Loader2, Star } from "lucide-react";

const MEMBERS = [
  {id:"1",name:"Sarah Kim",   role:"Lead Developer",  email:"sarah@agency.io", score:940,status:"active",  jobs:3, earn:14200,joined:"Jan 2026"},
  {id:"2",name:"Marcus Webb", role:"UI Designer",      email:"marcus@agency.io",score:910,status:"active",  jobs:2, earn:9800, joined:"Feb 2026"},
  {id:"3",name:"Rina Patel",  role:"Copywriter",       email:"rina@agency.io",  score:880,status:"active",  jobs:4, earn:6700, joined:"Mar 2026"},
  {id:"4",name:"Tom Ellis",   role:"SEO Specialist",   email:"tom@agency.io",   score:850,status:"idle",    jobs:0, earn:4200, joined:"Apr 2026"},
  {id:"5",name:"Zoe Larsson", role:"Video Editor",     email:"zoe@agency.io",   score:900,status:"active",  jobs:1, earn:8900, joined:"Feb 2026"},
];

const CLIENTS = [
  {id:"1",name:"TechVentures Inc.",  contact:"Brian Walsh", projects:3,spent:48500,tier:"premium",since:"Nov 2025"},
  {id:"2",name:"GreenLeaf Studios",  contact:"Amy Chen",    projects:1,spent:12300,tier:"standard",since:"Jan 2026"},
  {id:"3",name:"FinEdge Capital",    contact:"David Price", projects:2,spent:31700,tier:"premium",since:"Dec 2025"},
];

const PROJECTS = [
  {id:"1",title:"E-commerce Rebuild",    client:"TechVentures",  team:["Sarah Kim","Marcus Webb"],budget:18000,spent:12400,due:"Jul 30",status:"on-track"},
  {id:"2",title:"Brand Identity Pack",   client:"GreenLeaf",     team:["Marcus Webb"],            budget:5500, spent:4200, due:"Jul 20",status:"at-risk"},
  {id:"3",title:"Q3 Content Strategy",   client:"FinEdge Capital",team:["Rina Patel","Tom Ellis"],budget:9800, spent:2100, due:"Aug 15",status:"on-track"},
];

type Tab = "Overview"|"Team"|"Clients"|"Projects";

export default function AgencyV2Page() {
  const [tab, setTab]           = useState<Tab>("Overview");
  const [showInvite, setInvite] = useState(false);
  const [invEmail, setInvEmail] = useState("");
  const [inviting, setInviting] = useState(false);
  const [invSent, setInvSent]   = useState(false);

  const totalEarn = MEMBERS.reduce((a,m)=>a+m.earn,0);
  const active    = MEMBERS.filter(m=>m.status==="active").length;

  function invite(){
    if(!invEmail) return;
    setInviting(true);
    setTimeout(()=>{setInviting(false);setInvSent(true);setTimeout(()=>{setInvSent(false);setInvite(false);setInvEmail("");},1500);},1000);
  }

  const TABS:Tab[] = ["Overview","Team","Clients","Projects"];

  return (
    <div style={{display:"flex",minHeight:"100vh",background:"#010812"}}>
      <Sidebar/>
      <div style={{flex:1,display:"flex",flexDirection:"column"}}>
        <TopBar/>
        <main style={{flex:1,overflowY:"auto",padding:24,color:"white"}}>

          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24,flexWrap:"wrap",gap:12}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <Building2 size={28} color="#f0c040"/>
              <h1 style={{fontSize:"1.8rem",fontWeight:900,margin:0}}>Agency Hub</h1>
            </div>
            <button onClick={()=>setInvite(true)} style={{display:"flex",alignItems:"center",gap:7,padding:"11px 20px",background:"linear-gradient(135deg,#1a6bff,#0050dd)",border:"none",borderRadius:10,color:"white",fontWeight:700,fontSize:"0.88rem",cursor:"pointer",boxShadow:"0 3px 14px rgba(26,107,255,0.35)"}}>
              <Plus size={17}/> Invite Member
            </button>
          </div>

          {/* Tabs */}
          <div style={{display:"flex",gap:2,marginBottom:20,borderBottom:"1px solid rgba(26,107,255,0.1)"}}>
            {TABS.map(t=><button key={t} onClick={()=>setTab(t)} style={{padding:"10px 18px",fontSize:"0.85rem",fontWeight:600,border:"none",background:"transparent",cursor:"pointer",color:tab===t?"#4da6ff":"rgba(255,255,255,0.4)",borderBottom:tab===t?"2px solid #1a6bff":"2px solid transparent",marginBottom:-1}}>{t}</button>)}
          </div>

          {tab==="Overview"&&(
            <div style={{display:"flex",flexDirection:"column",gap:16}}>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14}}>
                {[{icon:<Users size={20}/>,label:"Active Members",value:`${active}/${MEMBERS.length}`,color:"#4da6ff"},{icon:<Briefcase size={20}/>,label:"Projects",value:PROJECTS.length,color:"#f0c040"},{icon:<DollarSign size={20}/>,label:"Month Earnings",value:`$${totalEarn.toLocaleString()}`,color:"#00e676"},{icon:<AlertTriangle size={20}/>,label:"At Risk",value:PROJECTS.filter(p=>p.status==="at-risk").length,color:"#ff5555"}].map((s,i)=>(
                  <div key={i} style={{background:"rgba(4,15,36,0.9)",border:"1px solid rgba(26,107,255,0.14)",borderRadius:14,padding:"18px 16px"}}>
                    <div style={{color:s.color,marginBottom:8}}>{s.icon}</div>
                    <div style={{fontSize:"1.7rem",fontWeight:900,color:s.color,lineHeight:1,marginBottom:3}}>{s.value}</div>
                    <div style={{fontSize:"0.7rem",color:"rgba(255,255,255,0.4)"}}>{s.label}</div>
                  </div>
                ))}
              </div>
              <div style={{background:"rgba(4,15,36,0.9)",border:"1px solid rgba(26,107,255,0.14)",borderRadius:16,padding:18}}>
                <div style={{fontWeight:800,marginBottom:12}}>Team Performance</div>
                {MEMBERS.slice(0,4).map((m,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:i<3?"1px solid rgba(26,107,255,0.06)":"none"}}>
                    <div style={{width:36,height:36,borderRadius:10,background:"linear-gradient(135deg,#1a3a6b,#0d1f3d)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:"0.88rem"}}>{m.name[0]}</div>
                    <div style={{flex:1}}><div style={{fontWeight:600,fontSize:"0.87rem"}}>{m.name}</div><div style={{fontSize:"0.67rem",color:"rgba(255,255,255,0.38)"}}>{m.role} · {m.jobs} active jobs</div></div>
                    <div style={{width:7,height:7,borderRadius:"50%",background:m.status==="active"?"#00e676":"rgba(255,255,255,0.2)",flexShrink:0}}/>
                    <div style={{fontWeight:800,color:"#00e676",fontSize:"0.88rem",minWidth:60,textAlign:"right"}}>${m.earn.toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab==="Team"&&(
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {MEMBERS.map(m=>(
                <div key={m.id} style={{display:"flex",alignItems:"center",gap:14,padding:"16px 18px",background:"rgba(4,15,36,0.9)",border:"1px solid rgba(26,107,255,0.12)",borderRadius:14,flexWrap:"wrap",gap:12}}>
                  <div style={{position:"relative",flexShrink:0}}>
                    <div style={{width:46,height:46,borderRadius:12,background:"linear-gradient(135deg,#1a3a6b,#0d1f3d)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:"1rem"}}>{m.name[0]}</div>
                    <div style={{position:"absolute",bottom:-2,right:-2,width:12,height:12,borderRadius:"50%",background:m.status==="active"?"#00e676":"rgba(255,255,255,0.2)",border:"2px solid #010812"}}/>
                  </div>
                  <div style={{flex:1,minWidth:200}}>
                    <div style={{fontWeight:800,display:"flex",alignItems:"center",gap:6}}>{m.name}<Shield size={12} color="#1a6bff"/></div>
                    <div style={{fontSize:"0.72rem",color:"rgba(255,255,255,0.45)"}}>{m.role} · {m.email}</div>
                  </div>
                  <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
                    {[["Score",m.score,"#00e676"],["Jobs",m.jobs,"rgba(255,255,255,0.7)"],["Earned","$"+m.earn.toLocaleString(),"#00e676"]].map(([l,v,c],i)=>(
                      <div key={i} style={{textAlign:"center"}}>
                        <div style={{fontWeight:800,color:c,fontSize:"0.9rem"}}>{v}</div>
                        <div style={{fontSize:"0.6rem",color:"rgba(255,255,255,0.35)"}}>{l}</div>
                      </div>
                    ))}
                    <button style={{padding:"6px 12px",background:"rgba(26,107,255,0.07)",border:"1px solid rgba(26,107,255,0.15)",borderRadius:8,cursor:"pointer"}}><Settings size={13} color="rgba(255,255,255,0.4)"/></button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab==="Clients"&&(
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {CLIENTS.map(c=>(
                <div key={c.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:14,padding:"16px 18px",background:"rgba(4,15,36,0.9)",border:"1px solid rgba(26,107,255,0.12)",borderRadius:14,flexWrap:"wrap"}}>
                  <div style={{display:"flex",alignItems:"center",gap:12}}>
                    <div style={{width:44,height:44,borderRadius:12,background:"rgba(26,107,255,0.08)",border:"1px solid rgba(26,107,255,0.15)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,color:"#f0c040",fontSize:"1.2rem"}}>{c.name[0]}</div>
                    <div>
                      <div style={{fontWeight:800,display:"flex",alignItems:"center",gap:6}}>{c.name}{c.tier==="premium"&&<Star size={12} color="#f0c040" fill="#f0c040"/>}</div>
                      <div style={{fontSize:"0.7rem",color:"rgba(255,255,255,0.4)"}}>Contact: {c.contact} · Since {c.since}</div>
                    </div>
                  </div>
                  <div style={{display:"flex",gap:16,alignItems:"center"}}>
                    <div style={{textAlign:"center"}}><div style={{fontWeight:800}}>{c.projects}</div><div style={{fontSize:"0.62rem",color:"rgba(255,255,255,0.35)"}}>Projects</div></div>
                    <div style={{textAlign:"center"}}><div style={{fontWeight:800,color:"#00e676"}}>${c.spent.toLocaleString()}</div><div style={{fontSize:"0.62rem",color:"rgba(255,255,255,0.35)"}}>Spent</div></div>
                    <button style={{padding:"7px 13px",background:"rgba(26,107,255,0.07)",border:"1px solid rgba(26,107,255,0.15)",borderRadius:8,color:"#4da6ff",fontSize:"0.75rem",fontWeight:600,cursor:"pointer"}}>Portal</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab==="Projects"&&(
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              {PROJECTS.map(p=>{
                const pct=Math.round((p.spent/p.budget)*100);
                return(
                  <div key={p.id} style={{background:"rgba(4,15,36,0.9)",border:`1px solid ${p.status==="at-risk"?"rgba(255,85,85,0.2)":"rgba(26,107,255,0.12)"}`,borderRadius:14,padding:18}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
                      <div>
                        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3}}>
                          <span style={{fontWeight:800,fontSize:"0.95rem"}}>{p.title}</span>
                          <span style={{fontSize:"0.62rem",padding:"2px 7px",borderRadius:5,fontWeight:700,background:p.status==="on-track"?"rgba(0,200,83,0.1)":"rgba(255,85,85,0.1)",color:p.status==="on-track"?"#00e676":"#ff5555",border:`1px solid ${p.status==="on-track"?"rgba(0,200,83,0.2)":"rgba(255,85,85,0.2)"}`}}>{p.status==="on-track"?"✓ On Track":"⚠ At Risk"}</span>
                        </div>
                        <div style={{fontSize:"0.72rem",color:"rgba(255,255,255,0.4)"}}>{p.client} · Due {p.due}</div>
                      </div>
                    </div>
                    <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:10}}>
                      {p.team.map(t=><span key={t} style={{fontSize:"0.68rem",padding:"3px 9px",background:"rgba(26,107,255,0.07)",border:"1px solid rgba(26,107,255,0.14)",borderRadius:5,color:"rgba(255,255,255,0.6)"}}>{t}</span>)}
                    </div>
                    <div>
                      <div style={{display:"flex",justifyContent:"space-between",fontSize:"0.7rem",marginBottom:4}}>
                        <span style={{color:"rgba(255,255,255,0.4)"}}>Budget</span>
                        <span style={{color:pct>=80?"#ff5555":"rgba(255,255,255,0.6)",fontWeight:600}}>${p.spent.toLocaleString()} / ${p.budget.toLocaleString()} ({pct}%)</span>
                      </div>
                      <div style={{height:5,background:"rgba(26,107,255,0.08)",borderRadius:3,overflow:"hidden"}}>
                        <div style={{width:`${Math.min(pct,100)}%`,height:"100%",background:pct>=80?"#ff5555":pct>=60?"#f0c040":"#1a6bff",borderRadius:3}}/>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {showInvite&&(
            <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",backdropFilter:"blur(8px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:50,padding:16}}>
              <div style={{background:"rgba(4,15,36,0.99)",border:"1px solid rgba(26,107,255,0.25)",borderRadius:22,padding:28,width:"100%",maxWidth:420,color:"white"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                  <div style={{fontWeight:900,fontSize:"1.05rem"}}>Invite Team Member</div>
                  <button onClick={()=>setInvite(false)} style={{background:"none",border:"none",color:"rgba(255,255,255,0.4)",cursor:"pointer"}}><X size={20}/></button>
                </div>
                {invSent?(
                  <div style={{textAlign:"center",padding:"24px 0"}}>
                    <CheckCircle2 size={44} color="#00e676" style={{margin:"0 auto 12px"}}/>
                    <div style={{fontWeight:800}}>Invite Sent!</div>
                  </div>
                ):(
                  <>
                    <div style={{marginBottom:14}}>
                      <label style={{fontSize:"0.68rem",fontWeight:700,color:"rgba(255,255,255,0.4)",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:5,display:"block"}}>Email Address</label>
                      <input value={invEmail} onChange={e=>setInvEmail(e.target.value)} type="email" placeholder="team@yoursite.com" style={{width:"100%",padding:"11px 14px",background:"rgba(6,18,41,0.8)",border:"1px solid rgba(26,107,255,0.18)",borderRadius:9,color:"white",fontSize:"0.88rem",outline:"none"}}/>
                    </div>
                    <div style={{marginBottom:16}}>
                      <label style={{fontSize:"0.68rem",fontWeight:700,color:"rgba(255,255,255,0.4)",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:5,display:"block"}}>Role</label>
                      <select style={{width:"100%",padding:"11px 14px",background:"rgba(6,18,41,0.8)",border:"1px solid rgba(26,107,255,0.18)",borderRadius:9,color:"white",fontSize:"0.88rem",outline:"none"}}>
                        {["Developer","Designer","Writer","Marketing","Video","Consultant","Manager"].map(r=><option key={r}>{r}</option>)}
                      </select>
                    </div>
                    <div style={{display:"flex",gap:10}}>
                      <button onClick={()=>setInvite(false)} style={{flex:1,padding:"12px",borderRadius:10,border:"1px solid rgba(26,107,255,0.15)",background:"transparent",color:"rgba(255,255,255,0.5)",cursor:"pointer"}}>Cancel</button>
                      <button onClick={invite} disabled={!invEmail||inviting} style={{flex:2,padding:"12px",background:"linear-gradient(135deg,#1a6bff,#0050dd)",border:"none",borderRadius:10,color:"white",fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:7,opacity:!invEmail?0.4:1}}>
                        {inviting?<Loader2 size={15} style={{animation:"spin 1s linear infinite"}}/>:<Mail size={15}/>}{inviting?"Sending...":"Send Invite"}
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
