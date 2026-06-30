
"use client";
import { useState } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import TopBar from "@/components/topbar/TopBar";
import { VeritasEmblem } from "@/components/badges/VeritasBadges";
import { Briefcase, DollarSign, Users, Clock, TrendingUp, Plus, Shield, CheckCircle2, AlertTriangle, ChevronRight, Star, Zap } from "lucide-react";

const ACTIVE_JOBS = [
  { id:"JB-4501", title:"Full-Stack SaaS Dashboard", worker:"Alex Chen",   workerScore:99, budget:"$10,000", spent:"$4,500", milestone:"Milestone 3 of 4", status:"on-track",  due:"Jul 5" },
  { id:"JB-4503", title:"Q3 Content Strategy",       worker:"James Park",  workerScore:97, budget:"$2,800",  spent:"$0",     milestone:"Milestone 1 of 2", status:"pending",   due:"Jul 15" },
  { id:"JB-4506", title:"Product Demo Video",        worker:"Zoe Larsson", workerScore:90, budget:"$5,000",  spent:"$1,500", milestone:"Milestone 2 of 3", status:"at-risk",   due:"Jul 10" },
];

const RECENT_HIRES = [
  { name:"Alex Chen",    title:"Full-Stack Dev",   score:99, avatar:"AC", hired:"Jun 1",  jobs:2,  rating:5.0 },
  { name:"Maya Rodriguez",title:"UI/UX Designer",  score:98, avatar:"MR", hired:"Apr 15", jobs:1,  rating:5.0 },
  { name:"James Park",   title:"Content Writer",   score:97, avatar:"JP", hired:"Jun 8",  jobs:1,  rating:5.0 },
];

const STATUS_STYLE: Record<string,{color:string;bg:string;label:string}> = {
  "on-track": { color:"#00e676", bg:"rgba(0,200,83,0.08)",    label:"On Track"  },
  "pending":  { color:"#4da6ff", bg:"rgba(26,107,255,0.08)",  label:"Pending"   },
  "at-risk":  { color:"#ff5555", bg:"rgba(255,85,85,0.08)",   label:"At Risk"   },
};

export default function ClientDashboardPage() {
  const totalSpent   = ACTIVE_JOBS.reduce((a,j)=>a+parseInt(j.spent.replace(/\D/g,"")||"0"),0);
  const totalBudget  = ACTIVE_JOBS.reduce((a,j)=>a+parseInt(j.budget.replace(/\D/g,"")||"0"),0);
  const atRiskCount  = ACTIVE_JOBS.filter(j=>j.status==="at-risk").length;

  return (
    <div style={{display:"flex",minHeight:"100vh",background:"#010812"}}>
      <Sidebar/>
      <div style={{flex:1,display:"flex",flexDirection:"column"}}>
        <TopBar/>
        <main style={{flex:1,overflowY:"auto",padding:24,color:"white"}}>

          {/* Welcome */}
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24,flexWrap:"wrap",gap:12}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <VeritasEmblem size={44}/>
              <div>
                <h1 style={{fontSize:"1.7rem",fontWeight:900,margin:0}}>Client Dashboard</h1>
                <div style={{fontSize:"0.68rem",color:"rgba(255,255,255,0.4)",marginTop:2}}>Manage your projects and talent</div>
              </div>
            </div>
            <button style={{display:"flex",alignItems:"center",gap:7,padding:"12px 22px",background:"linear-gradient(135deg,#1a6bff,#0050dd)",border:"none",borderRadius:10,color:"white",fontWeight:700,fontSize:"0.9rem",cursor:"pointer",boxShadow:"0 4px 18px rgba(26,107,255,0.4)"}}>
              <Plus size={17}/> Post New Job
            </button>
          </div>

          {/* KPIs */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:20}}>
            {[
              { icon:<Briefcase size={20}/>, label:"Active Jobs",    value:ACTIVE_JOBS.length,        sub:"3 in progress",        color:"#4da6ff" },
              { icon:<DollarSign size={20}/>,label:"Total Spent",    value:`$${totalSpent.toLocaleString()}`, sub:`of $${totalBudget.toLocaleString()} budgeted`, color:"#00e676" },
              { icon:<Users size={20}/>,     label:"Hired Workers",  value:RECENT_HIRES.length,       sub:"All verified",         color:"#f0c040" },
              { icon:<AlertTriangle size={20}/>,label:"At Risk",     value:atRiskCount,               sub:"Needs attention",      color:"#ff5555" },
            ].map((s,i)=>(
              <div key={i} style={{background:"linear-gradient(135deg,rgba(4,15,36,0.96),rgba(6,18,41,0.94))",border:"1px solid rgba(26,107,255,0.14)",borderRadius:14,padding:"18px 16px"}}>
                <div style={{color:s.color,marginBottom:8}}>{s.icon}</div>
                <div style={{fontSize:"1.7rem",fontWeight:900,color:s.color,lineHeight:1,marginBottom:4}}>{s.value}</div>
                <div style={{fontSize:"0.7rem",color:"rgba(255,255,255,0.4)"}}>{s.label}</div>
                <div style={{fontSize:"0.62rem",color:"rgba(255,255,255,0.28)",marginTop:2}}>{s.sub}</div>
              </div>
            ))}
          </div>

          {/* At-risk alert */}
          {atRiskCount>0&&(
            <div style={{display:"flex",alignItems:"center",gap:10,padding:"12px 16px",background:"rgba(255,85,85,0.06)",border:"1px solid rgba(255,85,85,0.2)",borderRadius:12,marginBottom:16}}>
              <AlertTriangle size={18} color="#ff5555"/>
              <span style={{fontWeight:700,color:"#ff5555"}}>{atRiskCount} project{atRiskCount>1?"s":""} need attention</span>
              <span style={{color:"rgba(255,255,255,0.5)",fontSize:"0.85rem"}}>— deadline approaching with budget nearly exhausted</span>
            </div>
          )}

          <div style={{display:"grid",gridTemplateColumns:"1fr 320px",gap:20}}>
            {/* Active Jobs */}
            <div>
              <div style={{fontWeight:800,marginBottom:14,fontSize:"0.95rem"}}>Active Projects</div>
              <div style={{display:"flex",flexDirection:"column",gap:12}}>
                {ACTIVE_JOBS.map(job=>{
                  const ss = STATUS_STYLE[job.status];
                  const spentNum = parseInt(job.spent.replace(/\D/g,"")||"0");
                  const budgNum  = parseInt(job.budget.replace(/\D/g,"")||"0");
                  const pct      = budgNum ? Math.round((spentNum/budgNum)*100) : 0;
                  return(
                    <div key={job.id} style={{background:"rgba(4,15,36,0.9)",border:"1px solid rgba(26,107,255,0.14)",borderRadius:16,padding:18}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
                        <div>
                          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3}}>
                            <span style={{fontWeight:800,fontSize:"1rem"}}>{job.title}</span>
                            <span style={{fontSize:"0.62rem",padding:"3px 8px",background:ss.bg,borderRadius:6,color:ss.color,fontWeight:700}}>{ss.label}</span>
                          </div>
                          <div style={{fontSize:"0.75rem",color:"rgba(255,255,255,0.45)"}}>
                            {job.id} · Due {job.due} · {job.milestone}
                          </div>
                        </div>
                        <div style={{textAlign:"right",flexShrink:0}}>
                          <div style={{fontWeight:900,color:"#00e676"}}>{job.budget}</div>
                          <div style={{fontSize:"0.68rem",color:"rgba(255,255,255,0.35)"}}>budget</div>
                        </div>
                      </div>
                      {/* Worker */}
                      <div style={{display:"flex",alignItems:"center",gap:8,padding:"10px 12px",background:"rgba(26,107,255,0.05)",border:"1px solid rgba(26,107,255,0.1)",borderRadius:10,marginBottom:12}}>
                        <div style={{width:30,height:30,borderRadius:8,background:"linear-gradient(135deg,#1a3a6b,#0d1f3d)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.9rem",fontWeight:700}}>{job.worker[0]}</div>
                        <div style={{flex:1}}>
                          <div style={{fontWeight:700,fontSize:"0.85rem",display:"flex",alignItems:"center",gap:5}}>{job.worker}<Shield size={11} color="#1a6bff"/></div>
                          <div style={{fontSize:"0.65rem",color:"rgba(255,255,255,0.38)"}}>Trust Score {job.workerScore}</div>
                        </div>
                        <div style={{display:"flex",gap:6}}>
                          <button style={{padding:"5px 10px",background:"rgba(26,107,255,0.1)",border:"1px solid rgba(26,107,255,0.2)",borderRadius:7,color:"#4da6ff",fontSize:"0.7rem",fontWeight:600,cursor:"pointer"}}>Message</button>
                          <button style={{padding:"5px 10px",background:"rgba(26,107,255,0.1)",border:"1px solid rgba(26,107,255,0.2)",borderRadius:7,color:"#4da6ff",fontSize:"0.7rem",fontWeight:600,cursor:"pointer"}}>Review</button>
                        </div>
                      </div>
                      {/* Budget bar */}
                      <div>
                        <div style={{display:"flex",justifyContent:"space-between",fontSize:"0.68rem",marginBottom:4}}>
                          <span style={{color:"rgba(255,255,255,0.38)"}}>Budget used</span>
                          <span style={{color:pct>=80?"#ff5555":"rgba(255,255,255,0.6)",fontWeight:600}}>{job.spent} / {job.budget} ({pct}%)</span>
                        </div>
                        <div style={{height:5,background:"rgba(26,107,255,0.1)",borderRadius:3,overflow:"hidden"}}>
                          <div style={{width:`${pct}%`,height:"100%",background:pct>=80?"#ff5555":pct>=60?"#f0c040":"#1a6bff",borderRadius:3,transition:"width 0.8s"}}/>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right panel */}
            <div style={{display:"flex",flexDirection:"column",gap:14}}>
              {/* Quick actions */}
              <div style={{background:"rgba(4,15,36,0.9)",border:"1px solid rgba(26,107,255,0.14)",borderRadius:16,padding:18}}>
                <div style={{fontWeight:800,marginBottom:12,fontSize:"0.88rem"}}>Quick Actions</div>
                {[
                  {ic:"⚡",label:"Post a New Job",         color:"#1a6bff"},
                  {ic:"🔍",label:"Find Verified Talent",   color:"#4da6ff"},
                  {ic:"💬",label:"Message Workers",        color:"#00d4ff"},
                  {ic:"📊",label:"View All Analytics",     color:"#f0c040"},
                  {ic:"💰",label:"Escrow & Payments",      color:"#00e676"},
                ].map((a,i)=>(
                  <button key={i} style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:"10px 12px",background:"rgba(26,107,255,0.04)",border:"1px solid rgba(26,107,255,0.1)",borderRadius:9,marginBottom:6,color:"rgba(255,255,255,0.7)",fontSize:"0.82rem",fontWeight:600,cursor:"pointer",transition:"all 0.15s",textAlign:"left"}}>
                    <span style={{fontSize:"1rem"}}>{a.ic}</span>{a.label}<ChevronRight size={13} style={{marginLeft:"auto",color:"rgba(255,255,255,0.25)"}}/>
                  </button>
                ))}
              </div>

              {/* Trusted workers */}
              <div style={{background:"rgba(4,15,36,0.9)",border:"1px solid rgba(26,107,255,0.14)",borderRadius:16,padding:18}}>
                <div style={{fontWeight:800,marginBottom:12,fontSize:"0.88rem"}}>Trusted Workers</div>
                {RECENT_HIRES.map((w,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:10,paddingBottom:10,marginBottom:10,borderBottom:i<RECENT_HIRES.length-1?"1px solid rgba(26,107,255,0.07)":"none"}}>
                    <div style={{width:36,height:36,borderRadius:10,background:"linear-gradient(135deg,#1a3a6b,#0d1f3d)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700}}>{w.avatar}</div>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:700,fontSize:"0.85rem",display:"flex",alignItems:"center",gap:4}}>{w.name}<Shield size={11} color="#1a6bff"/></div>
                      <div style={{fontSize:"0.65rem",color:"rgba(255,255,255,0.38)"}}>{w.title} · {w.jobs} job{w.jobs>1?"s":""}</div>
                    </div>
                    <div style={{textAlign:"center"}}>
                      <div style={{fontWeight:800,color:"#00e676",fontSize:"0.82rem"}}>{w.score}</div>
                      <div style={{display:"flex",gap:1}}>{Array.from({length:Math.round(w.rating)}).map((_,j)=><Star key={j} size={8} color="#f0c040" fill="#f0c040"/>)}</div>
                    </div>
                  </div>
                ))}
                <button style={{width:"100%",padding:"9px",background:"rgba(26,107,255,0.06)",border:"1px solid rgba(26,107,255,0.15)",borderRadius:9,color:"#4da6ff",fontSize:"0.78rem",fontWeight:600,cursor:"pointer"}}>Find More Talent →</button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
