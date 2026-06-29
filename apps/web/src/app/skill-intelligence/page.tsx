
"use client";
import { useState } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import TopBar from "@/components/topbar/TopBar";
import { Brain, TrendingUp, TrendingDown, Minus, Zap, Target, Award, ArrowRight, Star, BarChart3, CheckCircle2, AlertCircle } from "lucide-react";

const MY_SKILLS = [
  {name:"Next.js",      level:99, market:98, demand:"high",   trend:"up",   jobs:1240, avgRate:165, verified:true,  growth:"+18%"},
  {name:"TypeScript",   level:96, market:95, demand:"high",   trend:"up",   jobs:2180, avgRate:155, verified:true,  growth:"+22%"},
  {name:"PostgreSQL",   level:91, market:88, demand:"high",   trend:"stable",jobs:980, avgRate:140, verified:true,  growth:"+8%"},
  {name:"React",        level:98, market:97, demand:"high",   trend:"stable",jobs:3400, avgRate:150, verified:true, growth:"+5%"},
  {name:"Node.js",      level:93, market:90, demand:"high",   trend:"up",   jobs:2100, avgRate:145, verified:true,  growth:"+12%"},
  {name:"Solidity",     level:84, market:92, demand:"medium", trend:"up",   jobs:340,  avgRate:220, verified:false, growth:"+45%"},
  {name:"Rust",         level:52, market:88, demand:"growing",trend:"up",   jobs:180,  avgRate:200, verified:false, growth:"+67%"},
  {name:"Python",       level:71, market:94, demand:"high",   trend:"up",   jobs:4200, avgRate:148, verified:false, growth:"+15%"},
];

const GAPS = [
  {skill:"Rust",       reason:"High demand, high pay, low supply of verified experts. Your Node.js background transfers well.",   effort:"3-4 months", payIncrease:"+$40/hr"},
  {skill:"Python/ML",  reason:"AI/ML jobs are fastest-growing category on platform. Bridges well to your PostgreSQL skillset.",   effort:"2-3 months", payIncrease:"+$30/hr"},
  {skill:"Go (Golang)",reason:"Backend microservices market is exploding. Your Node.js skills make Go adoption fast.",             effort:"1-2 months", payIncrease:"+$25/hr"},
];

const TRENDING = [
  {skill:"AI/LLM Integration",growth:"+180%",jobs:890, hot:true},
  {skill:"Rust",               growth:"+67%", jobs:180, hot:true},
  {skill:"Edge Computing",     growth:"+52%", jobs:340, hot:false},
  {skill:"Web Components",     growth:"+41%", jobs:560, hot:false},
  {skill:"Solidity/Web3",      growth:"+45%", jobs:340, hot:true},
];

function TrendIcon({t}:{t:string}) {
  if(t==="up")     return <TrendingUp size={14} color="#00e676"/>;
  if(t==="down")   return <TrendingDown size={14} color="#ff5555"/>;
  return <Minus size={14} color="rgba(255,255,255,0.3)"/>;
}

export default function SkillIntelligencePage() {
  const [view, setView] = useState<"my"|"market">("my");
  const [selected, setSelected] = useState(MY_SKILLS[0]);

  const gap = MY_SKILLS.filter(s=>s.market-s.level>10);

  return (
    <div style={{display:"flex",minHeight:"100vh",background:"#010812"}}>
      <Sidebar/>
      <div style={{flex:1,display:"flex",flexDirection:"column"}}>
        <TopBar/>
        <main style={{flex:1,overflowY:"auto",padding:24,color:"white"}}>

          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:24}}>
            <Brain size={28} color="#a78bfa"/>
            <h1 style={{fontSize:"1.8rem",fontWeight:900,margin:0}}>Skill Intelligence</h1>
          </div>

          {/* Overview cards */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:20}}>
            {[
              {label:"Verified Skills",  value:MY_SKILLS.filter(s=>s.verified).length, color:"#00e676"},
              {label:"Skill Gaps",       value:gap.length,                               color:"#f0c040"},
              {label:"Avg Market Rate",  value:"$162/hr",                                color:"#4da6ff"},
              {label:"Your Avg Rate",    value:"$150/hr",                                color:"#00d4ff"},
            ].map((s,i)=>(
              <div key={i} style={{background:"rgba(4,15,36,0.9)",border:"1px solid rgba(26,107,255,0.14)",borderRadius:14,padding:"18px 16px",textAlign:"center"}}>
                <div style={{fontSize:"2rem",fontWeight:900,color:s.color,marginBottom:4}}>{s.value}</div>
                <div style={{fontSize:"0.72rem",color:"rgba(255,255,255,0.4)"}}>{s.label}</div>
              </div>
            ))}
          </div>

          <div style={{display:"grid",gridTemplateColumns:"1fr 280px",gap:16}}>
            {/* Skill table */}
            <div style={{display:"flex",flexDirection:"column",gap:14}}>
              {/* Tabs */}
              <div style={{display:"flex",gap:2,borderBottom:"1px solid rgba(26,107,255,0.1)"}}>
                {[["my","My Skills"],["market","Market Demand"]].map(([v,l])=>(
                  <button key={v} onClick={()=>setView(v as any)} style={{padding:"9px 16px",fontSize:"0.85rem",fontWeight:600,border:"none",background:"transparent",cursor:"pointer",color:view===v?"#4da6ff":"rgba(255,255,255,0.4)",borderBottom:view===v?"2px solid #1a6bff":"2px solid transparent",marginBottom:-1}}>{l}</button>
                ))}
              </div>

              {MY_SKILLS.map(s=>(
                <div key={s.name} onClick={()=>setSelected(s)} style={{display:"flex",alignItems:"center",gap:14,padding:"14px 16px",background:"rgba(4,15,36,0.9)",border:`1px solid ${selected.name===s.name?"rgba(26,107,255,0.4)":"rgba(26,107,255,0.1)"}`,borderRadius:12,cursor:"pointer",transition:"border-color 0.15s"}}>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                      <span style={{fontWeight:700,fontSize:"0.9rem"}}>{s.name}</span>
                      {s.verified&&<CheckCircle2 size={13} color="#00e676"/>}
                      <TrendIcon t={s.trend}/>
                      <span style={{fontSize:"0.62rem",color:s.demand==="high"?"#00e676":s.demand==="growing"?"#f0c040":"rgba(255,255,255,0.4)",fontWeight:700,marginLeft:"auto"}}>{s.demand.toUpperCase()}</span>
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
                      <div>
                        <div style={{fontSize:"0.6rem",color:"rgba(255,255,255,0.35)",marginBottom:3}}>YOUR LEVEL</div>
                        <div style={{height:5,background:"rgba(26,107,255,0.08)",borderRadius:3,overflow:"hidden"}}>
                          <div style={{width:`${s.level}%`,height:"100%",background:"#1a6bff",borderRadius:3}}/>
                        </div>
                        <div style={{fontSize:"0.65rem",color:"#4da6ff",marginTop:2,fontWeight:700}}>{s.level}/100</div>
                      </div>
                      <div>
                        <div style={{fontSize:"0.6rem",color:"rgba(255,255,255,0.35)",marginBottom:3}}>MARKET NEED</div>
                        <div style={{height:5,background:"rgba(26,107,255,0.08)",borderRadius:3,overflow:"hidden"}}>
                          <div style={{width:`${s.market}%`,height:"100%",background:"#f0c040",borderRadius:3}}/>
                        </div>
                        <div style={{fontSize:"0.65rem",color:"#f0c040",marginTop:2,fontWeight:700}}>{s.market}/100</div>
                      </div>
                    </div>
                  </div>
                  <div style={{textAlign:"right",flexShrink:0}}>
                    <div style={{fontWeight:800,color:"#00e676",fontSize:"0.9rem"}}>${s.avgRate}/hr</div>
                    <div style={{fontSize:"0.62rem",color:"rgba(255,255,255,0.3)"}}>avg market</div>
                    <div style={{fontSize:"0.65rem",color:s.growth.startsWith("+")?s.growth.includes("4")||s.growth.includes("5")||s.growth.includes("6")?"#f0c040":"#00e676":"#ff5555",fontWeight:700,marginTop:3}}>{s.growth}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right panel */}
            <div style={{display:"flex",flexDirection:"column",gap:14}}>
              {/* Selected skill detail */}
              <div style={{background:"rgba(4,15,36,0.95)",border:"1px solid rgba(26,107,255,0.2)",borderRadius:16,padding:18}}>
                <div style={{fontWeight:800,fontSize:"0.95rem",marginBottom:12,display:"flex",alignItems:"center",gap:7}}><BarChart3 size={16} color="#4da6ff"/>{selected.name}</div>
                {[["Your Level",selected.level+"/100","#1a6bff"],["Market Need",selected.market+"/100","#f0c040"],["Avg Rate","$"+selected.avgRate+"/hr","#00e676"],["Open Jobs",selected.jobs.toLocaleString(),"#00d4ff"],["Growth",selected.growth,"#a78bfa"]].map(([l,v,c],i)=>(
                  <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid rgba(26,107,255,0.06)",fontSize:"0.82rem"}}>
                    <span style={{color:"rgba(255,255,255,0.45)"}}>{l}</span>
                    <span style={{fontWeight:700,color:c}}>{v}</span>
                  </div>
                ))}
                {!selected.verified&&(
                  <button style={{width:"100%",marginTop:12,padding:"10px",background:"rgba(0,200,83,0.1)",border:"1px solid rgba(0,200,83,0.25)",borderRadius:9,color:"#00e676",fontSize:"0.8rem",fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
                    <Award size={14}/> Get Verified →
                  </button>
                )}
              </div>

              {/* Skill gaps */}
              <div style={{background:"rgba(4,15,36,0.9)",border:"1px solid rgba(240,192,64,0.15)",borderRadius:16,padding:18}}>
                <div style={{fontWeight:800,marginBottom:12,fontSize:"0.88rem",display:"flex",alignItems:"center",gap:6}}><Target size={15} color="#f0c040"/>Top Skill Gaps</div>
                {GAPS.map((g,i)=>(
                  <div key={i} style={{padding:"10px 0",borderBottom:i<GAPS.length-1?"1px solid rgba(26,107,255,0.07)":"none"}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                      <span style={{fontWeight:700,fontSize:"0.85rem"}}>{g.skill}</span>
                      <span style={{fontSize:"0.72rem",color:"#00e676",fontWeight:700}}>{g.payIncrease}</span>
                    </div>
                    <div style={{fontSize:"0.7rem",color:"rgba(255,255,255,0.4)",lineHeight:1.5,marginBottom:4}}>{g.reason}</div>
                    <div style={{fontSize:"0.65rem",color:"#4da6ff",fontWeight:600}}>Est. {g.effort} to proficiency</div>
                  </div>
                ))}
              </div>

              {/* Trending */}
              <div style={{background:"rgba(4,15,36,0.9)",border:"1px solid rgba(26,107,255,0.14)",borderRadius:16,padding:18}}>
                <div style={{fontWeight:800,marginBottom:10,fontSize:"0.88rem",display:"flex",alignItems:"center",gap:6}}><TrendingUp size={15} color="#00e676"/>Trending Skills</div>
                {TRENDING.map((t,i)=>(
                  <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 0",borderBottom:i<TRENDING.length-1?"1px solid rgba(26,107,255,0.06)":"none"}}>
                    <span style={{fontSize:"0.8rem",color:"rgba(255,255,255,0.7)",display:"flex",alignItems:"center",gap:6}}>
                      {t.hot&&<span style={{fontSize:"0.6rem",padding:"1px 5px",background:"rgba(255,100,0,0.15)",border:"1px solid rgba(255,100,0,0.3)",borderRadius:4,color:"#ff6600",fontWeight:700}}>HOT</span>}
                      {t.skill}
                    </span>
                    <span style={{fontSize:"0.75rem",color:"#00e676",fontWeight:700}}>{t.growth}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
