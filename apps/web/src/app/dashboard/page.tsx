
"use client";
import { useState } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import TopBar from "@/components/topbar/TopBar";
import { Briefcase, DollarSign, TrendingUp, Clock, ChevronRight, Shield, Bell } from "lucide-react";
import { VeritasVerifiedBadge, NewMemberBadge, YearVerifiedBadge, Jobs50Badge, FirstEscrowBadge, VeritasEmblem } from "@/components/badges/VeritasBadges";

const RECENT_JOBS = [
  {title:"SaaS Dashboard — TechVentures",amount:"$4,500",status:"Milestone 2 Released",time:"2h ago",statusColor:"#00e676"},
  {title:"Brand Identity — GreenLeaf",amount:"$1,800",status:"Awaiting Approval",time:"5h ago",statusColor:"#f0c040"},
  {title:"Content Q3 — FinEdge",amount:"$2,800",status:"In Progress",time:"1d ago",statusColor:"#4da6ff"},
];

const MATCHES = [
  {title:"React Native App Developer",client:"Bloom Health",budget:"$15–20K",match:99,urgent:true},
  {title:"Full-Stack SaaS — Next.js 15",client:"StartupX",budget:"$12K",match:97,urgent:false},
  {title:"ML Engineer — Churn Model",client:"SaaS Labs",budget:"$8K",match:95,urgent:false},
];

export default function DashboardPage() {
  const [score] = useState(845);
  return (
    <div style={{display:"flex",minHeight:"100vh",background:"#010812"}}>
      <Sidebar/>
      <div style={{flex:1,display:"flex",flexDirection:"column"}}>
        <TopBar/>
        <main style={{flex:1,padding:"24px",overflowY:"auto",color:"white"}}>

          {/* Welcome */}
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24,flexWrap:"wrap",gap:12}}>
            <div style={{display:"flex",alignItems:"center",gap:14}}>
              <VeritasEmblem size={48}/>
              <div>
                <h1 style={{fontSize:"1.6rem",fontWeight:900,margin:0}}>Welcome back, Scott</h1>
                <div style={{fontSize:"0.72rem",color:"rgba(255,255,255,0.45)",marginTop:2}}>Tuesday, Jun 17, 2026 · Seattle, WA</div>
              </div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{display:"inline-flex",alignItems:"center",gap:6,padding:"7px 14px",background:"rgba(26,107,255,0.1)",border:"1px solid rgba(26,107,255,0.25)",borderRadius:10,fontSize:"0.78rem",color:"#4da6ff",fontWeight:700}}>
                <Shield size={13}/> VERITAS VERIFIED
              </div>
              <button style={{width:36,height:36,borderRadius:9,background:"rgba(26,107,255,0.08)",border:"1px solid rgba(26,107,255,0.15)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",position:"relative"}}>
                <Bell size={16} color="rgba(255,255,255,0.5)"/>
                <span style={{position:"absolute",top:7,right:7,width:7,height:7,borderRadius:"50%",background:"#ff3333",border:"1.5px solid #010812"}}/>
              </button>
            </div>
          </div>

          {/* KPI Stats */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:20}}>
            {[
              {icon:<TrendingUp size={20}/>,label:"Trust Score",value:"845",sub:"Excellent",vc:"#00e676",bg:"rgba(0,200,83,0.08)",bc:"rgba(0,200,83,0.2)"},
              {icon:<DollarSign size={20}/>,label:"Month Earnings",value:"$43,200",sub:"+18% vs last",vc:"#00e676",bg:"rgba(26,107,255,0.06)",bc:"rgba(26,107,255,0.15)"},
              {icon:<Briefcase size={20}/>,label:"Active Jobs",value:"3",sub:"2 milestones due",vc:"#f0c040",bg:"rgba(26,107,255,0.06)",bc:"rgba(26,107,255,0.15)"},
              {icon:<Clock size={20}/>,label:"Response Rate",value:"99%",sub:"< 2h avg",vc:"#4da6ff",bg:"rgba(26,107,255,0.06)",bc:"rgba(26,107,255,0.15)"},
            ].map((s,i)=>(
              <div key={i} style={{background:`linear-gradient(135deg,rgba(4,15,36,0.95),rgba(6,18,41,0.9))`,border:`1px solid ${s.bc}`,borderRadius:14,padding:"18px 16px"}}>
                <div style={{color:"#4da6ff",marginBottom:10}}>{s.icon}</div>
                <div style={{fontSize:"1.8rem",fontWeight:900,color:s.vc,lineHeight:1,marginBottom:4}}>{s.value}</div>
                <div style={{fontSize:"0.72rem",color:"rgba(255,255,255,0.45)"}}>{s.label}</div>
                <div style={{fontSize:"0.65rem",color:s.vc,marginTop:3,fontWeight:600}}>{s.sub}</div>
              </div>
            ))}
          </div>

          <div style={{display:"grid",gridTemplateColumns:"1fr 320px",gap:20,marginBottom:20}}>
            {/* Left: Job Matches + Recent */}
            <div style={{display:"flex",flexDirection:"column",gap:16}}>

              {/* AI Job Matches */}
              <div style={{background:"linear-gradient(135deg,rgba(4,15,36,0.95),rgba(6,18,41,0.9))",border:"1px solid rgba(26,107,255,0.15)",borderRadius:14,padding:18}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                  <span style={{fontWeight:800,fontSize:"0.95rem"}}>⚡ Top AI Matches</span>
                  <button style={{fontSize:"0.72rem",color:"#4da6ff",background:"none",border:"none",cursor:"pointer"}}>View All →</button>
                </div>
                {MATCHES.map((m,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 14px",background:"rgba(26,107,255,0.05)",border:"1px solid rgba(26,107,255,0.1)",borderRadius:10,marginBottom:8,cursor:"pointer"}}>
                    <div style={{flex:1}}>
                      <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:3}}>
                        {m.urgent&&<span style={{fontSize:"0.58rem",padding:"2px 6px",background:"rgba(240,192,64,0.2)",border:"1px solid rgba(240,192,64,0.35)",borderRadius:4,color:"#f0c040",fontWeight:800}}>⚡ URGENT</span>}
                        <span style={{fontWeight:700,fontSize:"0.88rem"}}>{m.title}</span>
                      </div>
                      <div style={{fontSize:"0.72rem",color:"rgba(255,255,255,0.45)"}}>{m.client} · {m.budget}</div>
                    </div>
                    <div style={{textAlign:"center",flexShrink:0,marginLeft:12}}>
                      <div style={{fontSize:"1.4rem",fontWeight:900,color:"#f0c040",lineHeight:1}}>{m.match}%</div>
                      <div style={{fontSize:"0.58rem",color:"rgba(255,255,255,0.35)"}}>match</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Recent Activity */}
              <div style={{background:"linear-gradient(135deg,rgba(4,15,36,0.95),rgba(6,18,41,0.9))",border:"1px solid rgba(26,107,255,0.15)",borderRadius:14,padding:18}}>
                <div style={{fontWeight:800,marginBottom:14,fontSize:"0.95rem"}}>Recent Activity</div>
                {RECENT_JOBS.map((j,i)=>(
                  <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"11px 0",borderBottom:"1px solid rgba(26,107,255,0.07)"}}>
                    <div>
                      <div style={{fontWeight:600,fontSize:"0.85rem",marginBottom:2}}>{j.title}</div>
                      <div style={{fontSize:"0.7rem",color:"rgba(255,255,255,0.35)"}}>{j.time}</div>
                    </div>
                    <div style={{textAlign:"right"}}>
                      <div style={{fontWeight:800,color:"#00e676",fontSize:"0.9rem"}}>{j.amount}</div>
                      <div style={{fontSize:"0.65rem",color:j.statusColor,fontWeight:600}}>{j.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Trust Score Badge */}
            <div style={{display:"flex",flexDirection:"column",gap:14}}>
              <div style={{background:"linear-gradient(135deg,rgba(4,15,36,0.98),rgba(6,18,41,0.95))",border:"1px solid rgba(26,107,255,0.2)",borderRadius:16,padding:20,textAlign:"center"}}>
                <div style={{fontSize:"0.65rem",fontWeight:700,color:"rgba(255,255,255,0.4)",letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:12}}>Your Trust Score</div>
                <div style={{display:"flex",justifyContent:"center",marginBottom:10}}>
                  <VeritasVerifiedBadge score={score} size={160}/>
                </div>
                <div style={{fontSize:"0.75rem",color:"rgba(255,255,255,0.45)",lineHeight:1.6}}>
                  You're in the <span style={{color:"#00e676",fontWeight:700}}>top 3%</span> of all verified workers on the platform.
                </div>
              </div>

              {/* Quick Badges */}
              <div style={{background:"linear-gradient(135deg,rgba(4,15,36,0.95),rgba(6,18,41,0.9))",border:"1px solid rgba(26,107,255,0.15)",borderRadius:14,padding:16}}>
                <div style={{fontWeight:800,marginBottom:12,fontSize:"0.85rem"}}>Your Badges</div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
                  {[NewMemberBadge,YearVerifiedBadge,Jobs50Badge,FirstEscrowBadge].map((Comp,i)=>(
                    <div key={i} style={{display:"flex",justifyContent:"center"}}>
                      <Comp size={72}/>
                    </div>
                  ))}
                </div>
                <button style={{width:"100%",marginTop:12,padding:"9px",background:"rgba(26,107,255,0.08)",border:"1px solid rgba(26,107,255,0.2)",borderRadius:8,color:"#4da6ff",fontSize:"0.75rem",fontWeight:600,cursor:"pointer"}}>
                  View All Badges →
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
