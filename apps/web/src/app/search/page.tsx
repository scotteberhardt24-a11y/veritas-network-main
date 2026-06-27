
"use client";
import { useState } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import TopBar from "@/components/topbar/TopBar";
import { Search, Shield, Star, Briefcase, Users, DollarSign, Clock, Zap, ArrowRight } from "lucide-react";

const ALL = [
  {type:"worker",name:"Alex Chen",    username:"alexchen.dev",score:990,title:"Full-Stack Developer",  rate:"$150/hr",skills:["Next.js","TypeScript","PostgreSQL"],rating:5.0,jobs:247,available:true, verified:true},
  {type:"worker",name:"Maya Rodriguez",username:"maya.designs",score:980,title:"UI/UX Designer",       rate:"$120/hr",skills:["Figma","Design Systems","Tailwind"],  rating:5.0,jobs:189,available:true, verified:true},
  {type:"job",   title:"React Native App Developer",         client:"Bloom Health",   budget:"$15–20K",cat:"Development",match:99,posted:"3h ago",urgent:true},
  {type:"worker",name:"Priya Sharma",  username:"priyadev",   score:960,title:"Backend Engineer",       rate:"$140/hr",skills:["Node.js","AWS","Docker"],              rating:4.9,jobs:156,available:true, verified:true},
  {type:"job",   title:"Brand Identity & Design System",     client:"GreenLeaf",     budget:"$3.5–5K", cat:"Design",    match:94,posted:"5h ago",urgent:false},
  {type:"worker",name:"James Park",    username:"jpark.writes",score:970,title:"Content Strategist",    rate:"$80/hr", skills:["SEO","Finance","Long-form"],            rating:5.0,jobs:312,available:false,verified:true},
  {type:"job",   title:"ML Model — Churn Prediction",        client:"SaaS Labs",     budget:"$6–9K",   cat:"Data",      match:95,posted:"4h ago",urgent:false},
  {type:"worker",name:"Rahul Mehta",   username:"rahulmehta", score:930,title:"Blockchain Developer",   rate:"$180/hr",skills:["Solidity","Web3.js","Hardhat"],         rating:5.0,jobs:94, available:true, verified:true},
];

const TRENDING = ["Next.js","React Native","Solidity","Figma","PostgreSQL","Machine Learning","Go","Rust"];
const RECENT   = ["Full-Stack Developer","UI Designer","Content Writer"];

export default function SearchV2Page() {
  const [q, setQ]           = useState("");
  const [tab, setTab]       = useState<"all"|"workers"|"jobs">("all");
  const [searched, setSearched] = useState(false);

  const results = ALL.filter(r=>{
    const matchTab = tab==="all"||(tab==="workers"&&r.type==="worker")||(tab==="jobs"&&r.type==="job");
    const mq = q.toLowerCase();
    const matchQ = !q||("name" in r?r.name+" "+r.title:r.title+" "+(r.client||"")).toLowerCase().includes(mq)||("skills" in r?r.skills.some(s=>s.toLowerCase().includes(mq)):false);
    return matchTab&&matchQ;
  });

  return (
    <div style={{display:"flex",minHeight:"100vh",background:"#010812"}}>
      <Sidebar/>
      <div style={{flex:1,display:"flex",flexDirection:"column"}}>
        <TopBar/>
        <main style={{flex:1,overflowY:"auto",color:"white"}}>

          {/* Search hero */}
          <div style={{background:"linear-gradient(135deg,rgba(2,13,31,0.99),rgba(4,18,42,0.98))",borderBottom:"1px solid rgba(26,107,255,0.1)",padding:"36px 32px",position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",inset:0,backgroundImage:"radial-gradient(circle,rgba(26,107,255,0.15) 1px,transparent 1px)",backgroundSize:"26px 26px",opacity:0.15}}/>
            <div style={{position:"relative",zIndex:10,maxWidth:700,margin:"0 auto",textAlign:"center"}}>
              <h1 style={{fontSize:"1.8rem",fontWeight:900,marginBottom:6}}>Find Anything on Veritas</h1>
              <p style={{color:"rgba(255,255,255,0.45)",fontSize:"0.88rem",marginBottom:20}}>Search verified workers, open jobs, clients, and more</p>
              <form onSubmit={e=>{e.preventDefault();setSearched(true);}} style={{position:"relative"}}>
                <Search size={18} style={{position:"absolute",left:18,top:"50%",transform:"translateY(-50%)",color:"rgba(255,255,255,0.4)"}}/>
                <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search workers, skills, job titles, clients..." style={{width:"100%",padding:"16px 120px 16px 50px",background:"rgba(6,18,41,0.9)",border:"1px solid rgba(26,107,255,0.25)",borderRadius:14,color:"white",fontSize:"1rem",outline:"none",boxShadow:"0 4px 24px rgba(0,0,0,0.4)"}}/>
                <button type="submit" style={{position:"absolute",right:8,top:"50%",transform:"translateY(-50%)",padding:"10px 20px",background:"linear-gradient(135deg,#1a6bff,#0050dd)",border:"none",borderRadius:10,color:"white",fontWeight:700,fontSize:"0.88rem",cursor:"pointer"}}>Search</button>
              </form>
              {!searched&&(
                <div style={{marginTop:16}}>
                  <div style={{fontSize:"0.7rem",color:"rgba(255,255,255,0.35)",marginBottom:8,textTransform:"uppercase",letterSpacing:"0.08em"}}>Trending Searches</div>
                  <div style={{display:"flex",flexWrap:"wrap",justifyContent:"center",gap:6}}>
                    {TRENDING.map(t=><button key={t} onClick={()=>{setQ(t);setSearched(true);}} style={{padding:"5px 12px",borderRadius:20,border:"1px solid rgba(26,107,255,0.18)",background:"rgba(26,107,255,0.06)",color:"rgba(255,255,255,0.6)",fontSize:"0.75rem",cursor:"pointer",fontWeight:500}}>#{t}</button>)}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Results */}
          <div style={{maxWidth:860,margin:"0 auto",padding:"20px 24px"}}>
            {searched?(
              <>
                {/* Tab filter */}
                <div style={{display:"flex",gap:8,marginBottom:16}}>
                  {(["all","workers","jobs"] as const).map(t=>(
                    <button key={t} onClick={()=>setTab(t)} style={{padding:"8px 18px",borderRadius:10,border:`1px solid ${tab===t?"rgba(26,107,255,0.4)":"rgba(26,107,255,0.12)"}`,background:tab===t?"rgba(26,107,255,0.12)":"transparent",color:tab===t?"#4da6ff":"rgba(255,255,255,0.45)",fontSize:"0.82rem",fontWeight:600,cursor:"pointer",textTransform:"capitalize"}}>{t}</button>
                  ))}
                  <span style={{marginLeft:"auto",alignSelf:"center",fontSize:"0.78rem",color:"rgba(255,255,255,0.35)"}}>{results.length} results for "{q||"all"}"</span>
                </div>

                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  {results.map((r,i)=>(
                    r.type==="worker"?(
                      <div key={i} style={{display:"flex",alignItems:"center",gap:14,padding:"16px 18px",background:"rgba(4,15,36,0.9)",border:"1px solid rgba(26,107,255,0.12)",borderRadius:14,cursor:"pointer",transition:"border-color 0.15s"}}>
                        <div style={{width:50,height:50,borderRadius:13,background:"linear-gradient(135deg,#1a3a6b,#0d1f3d)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:"1.1rem",flexShrink:0}}>{r.name[0]}</div>
                        <div style={{flex:1}}>
                          <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:3}}>
                            <span style={{fontWeight:800,fontSize:"0.95rem"}}>{r.name}</span>
                            {r.verified&&<Shield size={13} color="#1a6bff"/>}
                            <span style={{display:"flex",alignItems:"center",gap:3,fontSize:"0.62rem",color:"rgba(255,255,255,0.3)",background:"rgba(26,107,255,0.06)",padding:"2px 6px",borderRadius:5}}><Users size={9}/>Worker</span>
                          </div>
                          <div style={{fontSize:"0.78rem",color:"rgba(255,255,255,0.5)",marginBottom:5}}>{r.title} · {r.rate}</div>
                          <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                            {r.skills.slice(0,3).map(s=><span key={s} style={{fontSize:"0.65rem",padding:"2px 8px",background:"rgba(26,107,255,0.07)",border:"1px solid rgba(26,107,255,0.14)",borderRadius:5,color:"rgba(255,255,255,0.55)"}}>{s}</span>)}
                          </div>
                        </div>
                        <div style={{textAlign:"right",flexShrink:0}}>
                          <div style={{fontSize:"1.3rem",fontWeight:900,color:"#00e676",lineHeight:1}}>{r.score}</div>
                          <div style={{fontSize:"0.6rem",color:"rgba(255,255,255,0.35)"}}>Trust Score</div>
                          <div style={{fontSize:"0.65rem",color:r.available?"#00e676":"rgba(255,255,255,0.3)",marginTop:3,fontWeight:600}}>{r.available?"Available":"Busy"}</div>
                        </div>
                        <button style={{padding:"9px 16px",background:"linear-gradient(135deg,#1a6bff,#0050dd)",border:"none",borderRadius:9,color:"white",fontWeight:700,fontSize:"0.78rem",cursor:"pointer",boxShadow:"0 2px 10px rgba(26,107,255,0.3)",flexShrink:0}}>View</button>
                      </div>
                    ):(
                      <div key={i} style={{display:"flex",alignItems:"center",gap:14,padding:"16px 18px",background:"rgba(4,15,36,0.9)",border:`1px solid ${r.urgent?"rgba(240,192,64,0.2)":"rgba(26,107,255,0.12)"}`,borderRadius:14,cursor:"pointer"}}>
                        <div style={{width:50,height:50,borderRadius:13,background:"rgba(240,192,64,0.1)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Briefcase size={22} color="#f0c040"/></div>
                        <div style={{flex:1}}>
                          <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:3}}>
                            <span style={{fontWeight:800,fontSize:"0.95rem"}}>{r.title}</span>
                            {r.urgent&&<span style={{fontSize:"0.58rem",padding:"2px 6px",background:"rgba(240,192,64,0.15)",border:"1px solid rgba(240,192,64,0.3)",borderRadius:4,color:"#f0c040",fontWeight:800}}>⚡ URGENT</span>}
                          </div>
                          <div style={{fontSize:"0.78rem",color:"rgba(255,255,255,0.5)"}}>{r.client} · {r.budget} · {r.cat} · {r.posted}</div>
                        </div>
                        <div style={{textAlign:"right",flexShrink:0}}>
                          <div style={{fontSize:"1.3rem",fontWeight:900,color:"#f0c040",lineHeight:1}}>{r.match}%</div>
                          <div style={{fontSize:"0.6rem",color:"rgba(255,255,255,0.35)"}}>AI Match</div>
                        </div>
                        <button style={{padding:"9px 16px",background:"rgba(240,192,64,0.15)",border:"1px solid rgba(240,192,64,0.3)",borderRadius:9,color:"#f0c040",fontWeight:700,fontSize:"0.78rem",cursor:"pointer",flexShrink:0}}>Apply</button>
                      </div>
                    )
                  ))}
                  {results.length===0&&(
                    <div style={{textAlign:"center",padding:"48px 20px",background:"rgba(4,15,36,0.7)",border:"1px solid rgba(26,107,255,0.1)",borderRadius:16}}>
                      <Search size={40} color="rgba(255,255,255,0.15)" style={{margin:"0 auto 12px"}}/>
                      <div style={{fontSize:"1rem",fontWeight:700,marginBottom:4}}>No results for "{q}"</div>
                      <div style={{fontSize:"0.82rem",color:"rgba(255,255,255,0.35)"}}>Try different keywords or browse by category</div>
                    </div>
                  )}
                </div>
              </>
            ):(
              <div>
                <div style={{fontSize:"0.72rem",fontWeight:700,color:"rgba(255,255,255,0.38)",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:10}}>Recent Searches</div>
                <div style={{display:"flex",flexDirection:"column",gap:6}}>
                  {RECENT.map((r,i)=>(
                    <button key={i} onClick={()=>{setQ(r);setSearched(true);}} style={{display:"flex",alignItems:"center",gap:10,padding:"12px 16px",background:"rgba(4,15,36,0.8)",border:"1px solid rgba(26,107,255,0.1)",borderRadius:10,color:"rgba(255,255,255,0.65)",cursor:"pointer",fontSize:"0.88rem",textAlign:"left",transition:"all 0.15s"}}>
                      <Clock size={14} color="rgba(255,255,255,0.3)"/>{r}<ArrowRight size={14} style={{marginLeft:"auto",color:"rgba(255,255,255,0.2)"}}/>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
