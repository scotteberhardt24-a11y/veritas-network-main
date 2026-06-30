
"use client";
import { useState } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import TopBar from "@/components/topbar/TopBar";
import { VeritasVerifiedBadge } from "@/components/badges/VeritasBadges";
import { Search, Shield, Star, MapPin, DollarSign, CheckCircle2, Filter, SlidersHorizontal, Zap, Clock } from "lucide-react";

const WORKERS = [
  { id:"W1",  name:"Alex Chen",     username:"alexchen.dev", avatar:"AC", score:99, title:"Full-Stack Developer",     rate:150, skills:["Next.js","TypeScript","PostgreSQL","Stripe"],  rating:5.0, jobs:247, available:true,  verified:true,  location:"San Francisco", responseTime:"< 1h",  bio:"Senior engineer specializing in SaaS platforms. 12 years experience.",       earnings:"$184K",  topSkill:"Next.js" },
  { id:"W2",  name:"Maya Rodriguez",username:"maya.designs", avatar:"MR", score:98, title:"UI/UX Designer",           rate:120, skills:["Figma","Design Systems","Tailwind","Framer"], rating:5.0, jobs:189, available:true,  verified:true,  location:"New York",      responseTime:"< 2h",  bio:"Award-winning product designer. Led design at 3 funded startups.",           earnings:"$142K",  topSkill:"Figma"   },
  { id:"W3",  name:"James Park",    username:"jpark.writes", avatar:"JP", score:97, title:"Content Strategist",       rate:80,  skills:["SEO","Finance","Long-form","Research"],        rating:5.0, jobs:312, available:false, verified:true,  location:"Austin",        responseTime:"< 4h",  bio:"Former journalist turned content strategist. Specializes in fintech & B2B.",  earnings:"$98K",   topSkill:"SEO"     },
  { id:"W4",  name:"Priya Sharma",  username:"priyadev",     avatar:"PS", score:96, title:"Backend Engineer",         rate:140, skills:["Node.js","AWS","PostgreSQL","Docker"],          rating:4.9, jobs:156, available:true,  verified:true,  location:"Remote",        responseTime:"< 2h",  bio:"Backend systems architect. Built infrastructure for 50K+ user apps.",         earnings:"$221K",  topSkill:"AWS"     },
  { id:"W5",  name:"Zoe Larsson",   username:"zoe.vid",      avatar:"ZL", score:90, title:"Video Producer",           rate:95,  skills:["After Effects","Premiere","Motion","VO"],      rating:4.8, jobs:267, available:true,  verified:false, location:"London",        responseTime:"< 6h",  bio:"Motion designer & video producer. 8 years creating brand content.",           earnings:"$124K",  topSkill:"Motion"  },
  { id:"W6",  name:"Carlos Rivera", username:"carlosdev",    avatar:"CR", score:87, title:"Growth Marketer",          rate:75,  skills:["Google Ads","Meta Ads","Analytics","CRO"],      rating:4.7, jobs:167, available:false, verified:true,  location:"Miami",         responseTime:"< 8h",  bio:"Performance marketing specialist. Managed $2M+ monthly ad spend.",            earnings:"$98K",   topSkill:"Google Ads" },
  { id:"W7",  name:"Rahul Mehta",   username:"rahulmehta",   avatar:"RM", score:95, title:"Blockchain Developer",     rate:180, skills:["Solidity","Web3.js","Hardhat","EVM"],           rating:5.0, jobs:94,  available:true,  verified:true,  location:"Remote",        responseTime:"< 3h",  bio:"Smart contract engineer. Deployed $10M+ TVL protocols on Ethereum.",          earnings:"$312K",  topSkill:"Solidity" },
  { id:"W8",  name:"Sofia Torres",  username:"sofia.data",   avatar:"ST", score:92, title:"Data Scientist",           rate:125, skills:["Python","ML","TensorFlow","SQL"],               rating:4.9, jobs:103, available:true,  verified:true,  location:"Barcelona",     responseTime:"< 3h",  bio:"ML engineer with focus on NLP and predictive analytics. Ex-Google.",           earnings:"$156K",  topSkill:"Python"  },
];

const CATS = ["All","Development","Design","Writing","Marketing","Video","Consulting","Data","Blockchain"];
const RATES = ["Any","Under $50/hr","$50–$100/hr","$100–$150/hr","$150+/hr"];

export default function WorkerSearchPage() {
  const [search, setSearch]     = useState("");
  const [cat, setCat]           = useState("All");
  const [rate, setRate]         = useState("Any");
  const [availOnly, setAvail]   = useState(false);
  const [verifiedOnly, setVer]  = useState(false);
  const [minScore, setMinScore] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [selected, setSelected] = useState<typeof WORKERS[0]|null>(null);

  const filtered = WORKERS.filter(w => {
    const q = search.toLowerCase();
    const matchSearch = !q || w.name.toLowerCase().includes(q) || w.skills.some(s=>s.toLowerCase().includes(q)) || w.title.toLowerCase().includes(q);
    const matchCat    = cat==="All" || w.title.toLowerCase().includes(cat.toLowerCase().replace("ment","").replace("ing",""));
    const matchAvail  = !availOnly  || w.available;
    const matchVer    = !verifiedOnly || w.verified;
    const matchScore  = w.score >= minScore;
    return matchSearch && matchCat && matchAvail && matchVer && matchScore;
  });

  return (
    <div style={{display:"flex",minHeight:"100vh",background:"#010812"}}>
      <Sidebar/>
      <div style={{flex:1,display:"flex",flexDirection:"column"}}>
        <TopBar/>
        <main style={{flex:1,overflowY:"auto",padding:24,color:"white"}}>

          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
            <Search size={28} color="#1a6bff"/>
            <h1 style={{fontSize:"1.8rem",fontWeight:900,margin:0}}>Find Verified Talent</h1>
          </div>

          {/* Search bar */}
          <div style={{display:"flex",gap:10,marginBottom:14}}>
            <div style={{flex:1,position:"relative"}}>
              <Search size={16} style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",color:"rgba(255,255,255,0.3)"}}/>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by name, skill, or specialty..." style={{width:"100%",padding:"12px 16px 12px 42px",background:"rgba(6,18,41,0.8)",border:"1px solid rgba(26,107,255,0.2)",borderRadius:10,color:"white",fontSize:"0.9rem",outline:"none"}}/>
            </div>
            <button onClick={()=>setShowFilters(!showFilters)} style={{display:"flex",alignItems:"center",gap:7,padding:"12px 18px",background:showFilters?"rgba(26,107,255,0.15)":"rgba(26,107,255,0.07)",border:`1px solid ${showFilters?"rgba(26,107,255,0.4)":"rgba(26,107,255,0.18)"}`,borderRadius:10,color:"#4da6ff",fontSize:"0.85rem",fontWeight:600,cursor:"pointer"}}>
              <SlidersHorizontal size={16}/> Filters
            </button>
          </div>

          {/* Filters panel */}
          {showFilters&&(
            <div style={{background:"rgba(4,15,36,0.95)",border:"1px solid rgba(26,107,255,0.18)",borderRadius:14,padding:20,marginBottom:14,display:"grid",gridTemplateColumns:"1fr 1fr auto auto auto",gap:16,alignItems:"end"}}>
              <div>
                <label style={{fontSize:"0.68rem",fontWeight:700,color:"rgba(255,255,255,0.4)",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:6,display:"block"}}>Hourly Rate</label>
                <select value={rate} onChange={e=>setRate(e.target.value)} style={{width:"100%",padding:"10px 12px",background:"rgba(6,18,41,0.8)",border:"1px solid rgba(26,107,255,0.18)",borderRadius:9,color:"white",fontSize:"0.85rem",outline:"none"}}>
                  {RATES.map(r=><option key={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label style={{fontSize:"0.68rem",fontWeight:700,color:"rgba(255,255,255,0.4)",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:6,display:"block"}}>Min Trust Score</label>
                <input type="range" min={0} max={100} value={minScore} onChange={e=>setMinScore(Number(e.target.value))} style={{width:"100%",accentColor:"#1a6bff"}}/>
                <div style={{fontSize:"0.72rem",color:"#4da6ff",marginTop:3}}>{minScore}+</div>
              </div>
              {[{l:"Available Now",v:availOnly,s:()=>setAvail(!availOnly)},{l:"Verified Only",v:verifiedOnly,s:()=>setVer(!verifiedOnly)}].map((t,i)=>(
                <label key={i} style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",whiteSpace:"nowrap"}} onClick={t.s}>
                  <div style={{width:40,height:22,borderRadius:11,background:t.v?"#1a6bff":"rgba(255,255,255,0.1)",position:"relative",transition:"background 0.2s",flexShrink:0}}>
                    <span style={{position:"absolute",top:3,width:16,height:16,borderRadius:"50%",background:"white",transition:"left 0.2s",left:t.v?21:3}}/>
                  </div>
                  <span style={{fontSize:"0.8rem",color:t.v?"#4da6ff":"rgba(255,255,255,0.5)",fontWeight:600}}>{t.l}</span>
                </label>
              ))}
              <button onClick={()=>{setRate("Any");setMinScore(0);setAvail(false);setVer(false);}} style={{padding:"10px 16px",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:9,color:"rgba(255,255,255,0.45)",fontSize:"0.78rem",cursor:"pointer",whiteSpace:"nowrap"}}>Clear</button>
            </div>
          )}

          {/* Category pills */}
          <div style={{display:"flex",gap:7,flexWrap:"wrap",marginBottom:14}}>
            {CATS.map(c=>(
              <button key={c} onClick={()=>setCat(c)} style={{padding:"7px 14px",borderRadius:20,border:`1px solid ${cat===c?"rgba(26,107,255,0.45)":"rgba(26,107,255,0.12)"}`,background:cat===c?"rgba(26,107,255,0.12)":"transparent",color:cat===c?"#4da6ff":"rgba(255,255,255,0.45)",fontSize:"0.76rem",fontWeight:600,cursor:"pointer"}}>
                {c}
              </button>
            ))}
          </div>

          <div style={{display:"flex",gap:20}}>
            {/* Results grid */}
            <div style={{flex:1}}>
              <div style={{fontSize:"0.78rem",color:"rgba(255,255,255,0.35)",marginBottom:12}}>{filtered.length} professionals found</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:14}}>
                {filtered.map(w=>(
                  <div key={w.id} onClick={()=>setSelected(w)} style={{background:"rgba(4,15,36,0.9)",border:`1px solid ${selected?.id===w.id?"rgba(26,107,255,0.45)":"rgba(26,107,255,0.12)"}`,borderRadius:16,padding:18,cursor:"pointer",transition:"all 0.15s"}}>
                    <div style={{display:"flex",alignItems:"flex-start",gap:12,marginBottom:12}}>
                      <div style={{position:"relative",flexShrink:0}}>
                        <div style={{width:48,height:48,borderRadius:12,background:"linear-gradient(135deg,#1a3a6b,#0d1f3d)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:"1.1rem",border:"2px solid rgba(26,107,255,0.25)"}}>{w.avatar}</div>
                        {w.available&&<span style={{position:"absolute",bottom:-2,right:-2,width:12,height:12,borderRadius:"50%",background:"#00e676",border:"2px solid #010812"}}/>}
                      </div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2}}>
                          <span style={{fontWeight:800,fontSize:"0.95rem",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{w.name}</span>
                          {w.verified&&<Shield size={12} color="#1a6bff"/>}
                        </div>
                        <div style={{fontSize:"0.75rem",color:"rgba(255,255,255,0.5)",marginBottom:3}}>{w.title}</div>
                        <div style={{display:"flex",alignItems:"center",gap:8,fontSize:"0.68rem",color:"rgba(255,255,255,0.4)"}}>
                          <span style={{display:"flex",alignItems:"center",gap:3}}><MapPin size={10}/>{w.location}</span>
                          <span style={{display:"flex",alignItems:"center",gap:3}}><Clock size={10}/>{w.responseTime}</span>
                        </div>
                      </div>
                      <div style={{textAlign:"center",flexShrink:0}}>
                        <div style={{fontSize:"1.4rem",fontWeight:900,color:"#00e676",lineHeight:1}}>{w.score}</div>
                        <div style={{fontSize:"0.55rem",color:"rgba(255,255,255,0.35)"}}>SCORE</div>
                      </div>
                    </div>
                    <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:10}}>
                      {w.skills.slice(0,3).map(s=><span key={s} style={{padding:"3px 9px",background:"rgba(26,107,255,0.08)",border:"1px solid rgba(26,107,255,0.15)",borderRadius:6,fontSize:"0.66rem",color:"rgba(255,255,255,0.6)",fontWeight:600}}>{s}</span>)}
                      {w.skills.length>3&&<span style={{padding:"3px 9px",background:"rgba(26,107,255,0.05)",border:"1px solid rgba(26,107,255,0.1)",borderRadius:6,fontSize:"0.66rem",color:"rgba(255,255,255,0.35)"}}>+{w.skills.length-3}</span>}
                    </div>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <div style={{display:"flex",gap:10,fontSize:"0.72rem",color:"rgba(255,255,255,0.45)"}}>
                        <span style={{display:"flex",alignItems:"center",gap:3}}><DollarSign size={10}/>${w.rate}/hr</span>
                        <span style={{display:"flex",alignItems:"center",gap:3}}><Star size={10} color="#f0c040" fill="#f0c040"/>{w.rating}</span>
                        <span>{w.jobs} jobs</span>
                      </div>
                      <button style={{padding:"6px 12px",background:"linear-gradient(135deg,#1a6bff,#0050dd)",border:"none",borderRadius:7,color:"white",fontSize:"0.72rem",fontWeight:700,cursor:"pointer",boxShadow:"0 2px 10px rgba(26,107,255,0.3)"}}>View</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Detail panel */}
            {selected&&(
              <div style={{width:300,flexShrink:0}}>
                <div style={{background:"rgba(4,15,36,0.98)",border:"1px solid rgba(26,107,255,0.25)",borderRadius:18,overflow:"hidden",position:"sticky",top:20}}>
                  <div style={{height:4,background:"linear-gradient(90deg,#1a6bff,#00d4ff)"}}/>
                  <div style={{padding:20}}>
                    <div style={{display:"flex",justifyContent:"center",marginBottom:12}}><VeritasVerifiedBadge score={selected.score*10} size={130}/></div>
                    <div style={{textAlign:"center",marginBottom:14}}>
                      <div style={{fontWeight:900,fontSize:"1.1rem",marginBottom:2}}>{selected.name}</div>
                      <div style={{fontSize:"0.78rem",color:"rgba(255,255,255,0.5)",marginBottom:6}}>{selected.title}</div>
                      <div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:6}}>
                        {selected.verified&&<div style={{display:"inline-flex",alignItems:"center",gap:4,padding:"3px 9px",background:"rgba(26,107,255,0.1)",border:"1px solid rgba(26,107,255,0.25)",borderRadius:20,fontSize:"0.6rem",fontWeight:800,color:"#4da6ff"}}><Shield size={9}/>VERIFIED</div>}
                        <div style={{fontSize:"0.65rem",color:selected.available?"#00e676":"rgba(255,255,255,0.3)",fontWeight:700}}>{selected.available?"● Available":"○ Busy"}</div>
                      </div>
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:14}}>
                      {[["$"+selected.rate+"/hr","Rate"],["★"+selected.rating,"Rating"],[selected.jobs+" jobs","Done"]].map(([v,l],i)=>(
                        <div key={i} style={{textAlign:"center",padding:"8px 4px",background:"rgba(26,107,255,0.06)",border:"1px solid rgba(26,107,255,0.12)",borderRadius:9}}>
                          <div style={{fontWeight:800,fontSize:"0.85rem",color:"#00e676"}}>{v}</div>
                          <div style={{fontSize:"0.58rem",color:"rgba(255,255,255,0.35)",marginTop:2}}>{l}</div>
                        </div>
                      ))}
                    </div>
                    <p style={{fontSize:"0.78rem",color:"rgba(255,255,255,0.55)",lineHeight:1.6,marginBottom:14}}>{selected.bio}</p>
                    <div style={{fontSize:"0.68rem",color:"rgba(255,255,255,0.35)",marginBottom:3}}>LIFETIME EARNINGS</div>
                    <div style={{fontWeight:900,fontSize:"1.3rem",color:"#00e676",marginBottom:14}}>{selected.earnings}</div>
                    <div style={{display:"flex",flexDirection:"column",gap:7}}>
                      <button style={{padding:"12px",background:"linear-gradient(135deg,#1a6bff,#0050dd)",border:"none",borderRadius:10,color:"white",fontWeight:800,fontSize:"0.88rem",cursor:"pointer",boxShadow:"0 4px 16px rgba(26,107,255,0.4)"}}>🔒 Hire Securely</button>
                      <button style={{padding:"11px",background:"rgba(26,107,255,0.08)",border:"1px solid rgba(26,107,255,0.2)",borderRadius:10,color:"#4da6ff",fontWeight:600,fontSize:"0.85rem",cursor:"pointer"}}>💬 Send Message</button>
                      <button style={{padding:"11px",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:10,color:"rgba(255,255,255,0.45)",fontWeight:600,fontSize:"0.82rem",cursor:"pointer"}}>View Full Profile →</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
