
"use client";
import { useState } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import TopBar from "@/components/topbar/TopBar";
import { Zap, Briefcase, DollarSign, Shield, Star, TrendingUp, Award, Clock, Filter, Bell, CheckCircle2 } from "lucide-react";

const FEED = [
  {type:"job_match", time:"Just now", urgent:true,  data:{id:"JB-4508",title:"Senior React Developer",client:"StartupX",       budget:"$12,000", match:99}},
  {type:"payment",   time:"5m ago",  urgent:false, data:{amount:4500,from:"TechVentures Inc.",milestone:"Milestone 2 — Backend API"}},
  {type:"score_up",  time:"12m ago", urgent:false, data:{from:982,to:990,reason:"5-star review from TechVentures Inc."}},
  {type:"job_match", time:"1h ago",  urgent:false, data:{id:"JB-4507",title:"ML Engineer — Churn Model",client:"SaaS Growth Labs",budget:"$8,000", match:95}},
  {type:"badge",     time:"2h ago",  urgent:false, data:{badge:"🏅 30-Day Streak",desc:"Active 30 consecutive days. +20 Trust Score bonus applied."}},
  {type:"review",    time:"3h ago",  urgent:false, data:{author:"Brian Walsh",company:"TechVentures",rating:5,text:"Exceptional work, delivered a week early!"}},
  {type:"job_match", time:"4h ago",  urgent:false, data:{id:"JB-4506",title:"Video Editor — Product Demo",client:"CloudSync",   budget:"$5,000", match:92}},
  {type:"payment",   time:"1d ago",  urgent:false, data:{amount:9800,from:"FinEdge Capital",milestone:"Milestone 1 — Project Setup"}},
];

const TYPE_META:Record<string,{icon:React.ReactNode;color:string;bg:string;label:string}> = {
  job_match: {icon:<Briefcase size={18}/>,  color:"#f0c040",  bg:"rgba(240,192,64,0.1)",  label:"Job Match"},
  payment:   {icon:<DollarSign size={18}/>, color:"#00e676",  bg:"rgba(0,200,83,0.1)",    label:"Payment"},
  score_up:  {icon:<TrendingUp size={18}/>, color:"#4da6ff",  bg:"rgba(26,107,255,0.1)",  label:"Trust Score"},
  badge:     {icon:<Award size={18}/>,      color:"#f0c040",  bg:"rgba(240,192,64,0.08)", label:"Badge"},
  review:    {icon:<Star size={18}/>,       color:"#a78bfa",  bg:"rgba(167,139,250,0.1)", label:"Review"},
};

export default function FeedV2Page() {
  const [filter, setFilter] = useState("all");

  const filtered = filter==="all" ? FEED : FEED.filter(f=>f.type===filter||f.type===filter+"_match");

  return (
    <div style={{display:"flex",minHeight:"100vh",background:"#010812"}}>
      <Sidebar/>
      <div style={{flex:1,display:"flex",flexDirection:"column"}}>
        <TopBar/>
        <main style={{flex:1,overflowY:"auto",padding:24,color:"white"}}>

          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
            <Zap size={28} color="#f0c040"/>
            <h1 style={{fontSize:"1.8rem",fontWeight:900,margin:0}}>Activity Feed</h1>
            <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:5,padding:"5px 12px",background:"rgba(0,200,83,0.08)",border:"1px solid rgba(0,200,83,0.2)",borderRadius:8}}>
              <div style={{width:6,height:6,borderRadius:"50%",background:"#00e676",animation:"pulse 1.5s infinite"}}/>
              <span style={{fontSize:"0.72rem",color:"#00e676",fontWeight:700}}>LIVE</span>
            </div>
          </div>

          {/* Filter chips */}
          <div style={{display:"flex",gap:7,marginBottom:18,flexWrap:"wrap"}}>
            {[["all","All"],["job","Jobs"],["payment","Payments"],["score_up","Score"],["badge","Badges"],["review","Reviews"]].map(([v,l])=>(
              <button key={v} onClick={()=>setFilter(v)} style={{padding:"6px 14px",borderRadius:20,border:`1px solid ${filter===v?"rgba(240,192,64,0.4)":"rgba(26,107,255,0.12)"}`,background:filter===v?"rgba(240,192,64,0.1)":"transparent",color:filter===v?"#f0c040":"rgba(255,255,255,0.45)",fontSize:"0.75rem",fontWeight:600,cursor:"pointer"}}>{l}</button>
            ))}
          </div>

          <div style={{maxWidth:680,display:"flex",flexDirection:"column",gap:10}}>
            {filtered.map((item,i)=>{
              const meta = TYPE_META[item.type]||TYPE_META.job_match;
              const d    = item.data as any;
              return(
                <div key={i} style={{
                  background:"rgba(4,15,36,0.9)",
                  border:`1px solid ${item.urgent?"rgba(240,192,64,0.25)":"rgba(26,107,255,0.1)"}`,
                  borderRadius:14,padding:"15px 17px",
                  boxShadow:item.urgent?"0 0 20px rgba(240,192,64,0.06)":"none",
                }}>
                  <div style={{display:"flex",alignItems:"flex-start",gap:12}}>
                    <div style={{width:42,height:42,borderRadius:12,background:meta.bg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,color:meta.color}}>{meta.icon}</div>
                    <div style={{flex:1,minWidth:0}}>
                      {/* Content per type */}
                      {item.type==="job_match"&&(
                        <>
                          <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:4,flexWrap:"wrap"}}>
                            <span style={{fontSize:"0.68rem",color:meta.color,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.07em"}}>New Job Match</span>
                            {item.urgent&&<span style={{fontSize:"0.58rem",padding:"2px 6px",background:"rgba(240,192,64,0.15)",border:"1px solid rgba(240,192,64,0.3)",borderRadius:4,color:"#f0c040",fontWeight:800}}>⚡ URGENT</span>}
                          </div>
                          <div style={{fontWeight:700,fontSize:"0.92rem",marginBottom:3}}>{d.title}</div>
                          <div style={{fontSize:"0.75rem",color:"rgba(255,255,255,0.5)",marginBottom:8}}>{d.client} · {d.budget}</div>
                          <button style={{padding:"7px 14px",background:"rgba(240,192,64,0.12)",border:"1px solid rgba(240,192,64,0.28)",borderRadius:8,color:"#f0c040",fontSize:"0.75rem",fontWeight:700,cursor:"pointer"}}>View Job →</button>
                        </>
                      )}
                      {item.type==="payment"&&(
                        <>
                          <div style={{fontSize:"0.68rem",color:meta.color,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:4}}>Payment Released</div>
                          <div style={{fontSize:"1.4rem",fontWeight:900,color:"#00e676",lineHeight:1,marginBottom:3}}>${d.amount.toLocaleString()}</div>
                          <div style={{fontSize:"0.75rem",color:"rgba(255,255,255,0.5)"}}>{d.from} · {d.milestone}</div>
                        </>
                      )}
                      {item.type==="score_up"&&(
                        <>
                          <div style={{fontSize:"0.68rem",color:meta.color,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:4}}>Trust Score Increased</div>
                          <div style={{fontWeight:800,fontSize:"0.95rem",marginBottom:3}}>{d.from} <span style={{color:"rgba(255,255,255,0.3)"}}>→</span> <span style={{color:"#00e676"}}>{d.to}</span></div>
                          <div style={{fontSize:"0.75rem",color:"rgba(255,255,255,0.5)"}}>{d.reason}</div>
                        </>
                      )}
                      {item.type==="badge"&&(
                        <>
                          <div style={{fontSize:"0.68rem",color:meta.color,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:4}}>Badge Earned</div>
                          <div style={{fontWeight:800,fontSize:"0.92rem",marginBottom:3}}>{d.badge}</div>
                          <div style={{fontSize:"0.75rem",color:"rgba(255,255,255,0.5)"}}>{d.desc}</div>
                        </>
                      )}
                      {item.type==="review"&&(
                        <>
                          <div style={{fontSize:"0.68rem",color:meta.color,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:4}}>New Review</div>
                          <div style={{display:"flex",gap:1,marginBottom:4}}>{Array.from({length:d.rating}).map((_,k)=><Star key={k} size={13} color="#f0c040" fill="#f0c040"/>)}</div>
                          <div style={{fontSize:"0.83rem",color:"rgba(255,255,255,0.65)",fontStyle:"italic",marginBottom:3}}>"{d.text}"</div>
                          <div style={{fontSize:"0.7rem",color:"rgba(255,255,255,0.38)"}}>{d.author}, {d.company}</div>
                        </>
                      )}
                    </div>
                    <div style={{flexShrink:0,fontSize:"0.65rem",color:"rgba(255,255,255,0.3)",whiteSpace:"nowrap"}}>{item.time}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}
