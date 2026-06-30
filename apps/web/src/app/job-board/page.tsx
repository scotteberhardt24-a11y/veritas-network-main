
"use client";
import { useState } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import TopBar from "@/components/topbar/TopBar";
import { Briefcase, Search, Filter, Zap, Shield, Clock, DollarSign, ChevronRight, Star, MapPin, Bookmark, BookmarkCheck, SlidersHorizontal } from "lucide-react";

const JOBS = [
  {id:"JB-4520",title:"Senior Next.js 15 Developer — SaaS Dashboard",client:"TechVentures Inc.",    verified:true, budget:"$12,000–18,000",type:"Fixed",cat:"Development",skills:["Next.js","TypeScript","PostgreSQL","Stripe"],match:99,proposals:3, posted:"1h ago",  urgent:true,  desc:"Build a multi-tenant SaaS dashboard with Stripe billing, role-based auth, and real-time analytics. Must have 3+ similar projects."},
  {id:"JB-4519",title:"React Native App — Health Tracker Phase 2",   client:"Bloom Health",         verified:true, budget:"$15,000–20,000",type:"Fixed",cat:"Mobile",      skills:["React Native","Expo","Firebase","HealthKit"],match:97,proposals:5, posted:"3h ago",  urgent:false, desc:"Continue Phase 1 of our health tracking app. Add Apple Watch integration, push notifications, and offline sync."},
  {id:"JB-4518",title:"Brand Identity & Design System",              client:"GreenLeaf Studios",    verified:true, budget:"$3,500–5,500",  type:"Fixed",cat:"Design",      skills:["Figma","Brand","Design Systems","Illustration"],match:94,proposals:11,posted:"5h ago",  urgent:false, desc:"Complete brand identity for eco-startup: logo, color system, typography, and 40+ component Figma library."},
  {id:"JB-4517",title:"Solidity Smart Contract — DeFi Protocol",     client:"CryptoEdge Finance",   verified:true, budget:"$20,000–35,000",type:"Fixed",cat:"Blockchain",  skills:["Solidity","Hardhat","EVM","DeFi"],match:91,proposals:4, posted:"8h ago",  urgent:true,  desc:"Build and audit a yield-aggregating DeFi protocol. Must have mainnet deployment experience with $1M+ TVL."},
  {id:"JB-4516",title:"Full-Stack API + Admin Dashboard",            client:"RetailBoost",          verified:false,budget:"$8,000–12,000", type:"Fixed",cat:"Development",skills:["Node.js","React","PostgreSQL","REST API"],match:89,proposals:18,posted:"12h ago", urgent:false, desc:"RESTful API with admin dashboard for e-commerce analytics. Multi-region deployment on AWS."},
  {id:"JB-4515",title:"Motion Design — Product Explainer Video",     client:"SaaS Labs",            verified:true, budget:"$2,500–4,000",  type:"Fixed",cat:"Video",       skills:["After Effects","Motion","Lottie","Storyboard"],match:86,proposals:7, posted:"1d ago",  urgent:false, desc:"60-second product explainer in our brand style. Must provide storyboard in Week 1 for approval."},
  {id:"JB-4514",title:"SEO Content Strategy — 20 Articles",         client:"FinEdge Capital",      verified:true, budget:"$4,000–6,000",  type:"Milestone",cat:"Writing",   skills:["SEO","Finance","Long-form","Research"],match:83,proposals:22,posted:"1d ago",  urgent:false, desc:"20 high-intent SEO articles for a fintech audience. Must have finance writing samples and keyword research process."},
  {id:"JB-4513",title:"ML Model — Customer Churn Prediction",        client:"SaaS Growth Labs",     verified:true, budget:"$6,000–9,000",  type:"Fixed",cat:"Data/ML",     skills:["Python","scikit-learn","PostgreSQL","Jupyter"],match:80,proposals:9, posted:"2d ago",  urgent:false, desc:"Train and deploy a churn prediction model using 24 months of CRM data. Deliverable: deployed API endpoint + docs."},
];

const CATS = ["All","Development","Design","Mobile","Blockchain","Video","Writing","Data/ML"];

export default function JobBoardPage() {
  const [search, setSearch]     = useState("");
  const [cat, setCat]           = useState("All");
  const [saved, setSaved]       = useState<string[]>([]);
  const [selected, setSelected] = useState(JOBS[0]);
  const [showFilters, setShowFilters] = useState(false);
  const [minBudget, setMinBudget]     = useState(0);
  const [verifiedOnly, setVerOnly]    = useState(false);
  const [sortBy, setSortBy]           = useState("match");

  const filtered = JOBS
    .filter(j => {
      const q = search.toLowerCase();
      const matchQ = !q || j.title.toLowerCase().includes(q) || j.skills.some(s=>s.toLowerCase().includes(q)) || j.client.toLowerCase().includes(q);
      const matchCat = cat==="All" || j.cat===cat;
      const matchBudget = !minBudget || parseInt(j.budget.replace(/\D/g,"")) >= minBudget;
      const matchVer = !verifiedOnly || j.verified;
      return matchQ && matchCat && matchBudget && matchVer;
    })
    .sort((a,b) => sortBy==="match" ? b.match-a.match : sortBy==="recent" ? 0 : parseInt(b.budget)-parseInt(a.budget));

  function toggleSave(id:string){ setSaved(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id]); }

  return (
    <div style={{display:"flex",minHeight:"100vh",background:"#010812"}}>
      <Sidebar/>
      <div style={{flex:1,display:"flex",flexDirection:"column"}}>
        <TopBar/>
        <main style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
          {/* Header bar */}
          <div style={{padding:"16px 24px",borderBottom:"1px solid rgba(26,107,255,0.1)",background:"rgba(2,13,31,0.98)",display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
            <div style={{position:"relative",flex:1,minWidth:200}}>
              <Search size={15} style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:"rgba(255,255,255,0.3)"}}/>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by skill, title, or client..." style={{width:"100%",padding:"10px 12px 10px 36px",background:"rgba(6,18,41,0.8)",border:"1px solid rgba(26,107,255,0.18)",borderRadius:9,color:"white",fontSize:"0.85rem",outline:"none"}}/>
            </div>
            <button onClick={()=>setShowFilters(!showFilters)} style={{display:"flex",alignItems:"center",gap:6,padding:"10px 16px",background:showFilters?"rgba(26,107,255,0.15)":"rgba(26,107,255,0.07)",border:`1px solid ${showFilters?"rgba(26,107,255,0.4)":"rgba(26,107,255,0.18)"}`,borderRadius:9,color:"#4da6ff",fontSize:"0.82rem",fontWeight:600,cursor:"pointer"}}>
              <SlidersHorizontal size={14}/>Filters{saved.length>0&&<span style={{background:"#f0c040",color:"#0a0800",fontSize:"0.6rem",fontWeight:800,padding:"1px 5px",borderRadius:8}}>{saved.length}</span>}
            </button>
            <select value={sortBy} onChange={e=>setSortBy(e.target.value)} style={{padding:"10px 12px",background:"rgba(6,18,41,0.8)",border:"1px solid rgba(26,107,255,0.18)",borderRadius:9,color:"white",fontSize:"0.82rem",outline:"none"}}>
              <option value="match">Sort: AI Match</option>
              <option value="recent">Sort: Newest</option>
              <option value="budget">Sort: Budget</option>
            </select>
          </div>

          {/* Filter row */}
          {showFilters&&(
            <div style={{padding:"12px 24px",background:"rgba(4,15,36,0.9)",borderBottom:"1px solid rgba(26,107,255,0.08)",display:"flex",gap:14,alignItems:"center",flexWrap:"wrap"}}>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                {CATS.map(c=><button key={c} onClick={()=>setCat(c)} style={{padding:"5px 12px",borderRadius:16,border:`1px solid ${cat===c?"rgba(26,107,255,0.5)":"rgba(26,107,255,0.14)"}`,background:cat===c?"rgba(26,107,255,0.14)":"transparent",color:cat===c?"#4da6ff":"rgba(255,255,255,0.45)",fontSize:"0.74rem",fontWeight:600,cursor:"pointer"}}>{c}</button>)}
              </div>
              <label style={{display:"flex",alignItems:"center",gap:7,cursor:"pointer",fontSize:"0.78rem",color:"rgba(255,255,255,0.6)",whiteSpace:"nowrap"}} onClick={()=>setVerOnly(!verifiedOnly)}>
                <div style={{width:36,height:20,borderRadius:10,background:verifiedOnly?"#1a6bff":"rgba(255,255,255,0.1)",position:"relative",transition:"background 0.2s"}}>
                  <span style={{position:"absolute",top:2,width:16,height:16,borderRadius:"50%",background:"white",transition:"left 0.2s",left:verifiedOnly?18:2}}/>
                </div>
                Verified Clients Only
              </label>
            </div>
          )}

          {/* Main layout */}
          <div style={{flex:1,display:"flex",overflow:"hidden",padding:"0"}}>
            {/* Job list */}
            <div style={{width:380,flexShrink:0,overflowY:"auto",borderRight:"1px solid rgba(26,107,255,0.1)"}}>
              <div style={{padding:"12px 16px 6px",fontSize:"0.72rem",color:"rgba(255,255,255,0.35)",fontWeight:600}}>{filtered.length} jobs · Sorted by {sortBy}</div>
              {filtered.map(job=>(
                <div key={job.id} onClick={()=>setSelected(job)} style={{padding:"14px 16px",borderBottom:"1px solid rgba(26,107,255,0.07)",cursor:"pointer",background:selected.id===job.id?"rgba(26,107,255,0.08)":"transparent",borderLeft:selected.id===job.id?"3px solid #1a6bff":"3px solid transparent",transition:"all 0.15s",color:"white"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8,marginBottom:6}}>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{display:"flex",gap:5,marginBottom:4,flexWrap:"wrap"}}>
                        {job.urgent&&<span style={{fontSize:"0.58rem",padding:"2px 6px",background:"rgba(240,192,64,0.15)",border:"1px solid rgba(240,192,64,0.3)",borderRadius:4,color:"#f0c040",fontWeight:800}}>⚡ URGENT</span>}
                        {job.verified&&<span style={{fontSize:"0.58rem",padding:"2px 6px",background:"rgba(26,107,255,0.1)",border:"1px solid rgba(26,107,255,0.2)",borderRadius:4,color:"#4da6ff",fontWeight:700,display:"flex",alignItems:"center",gap:3}}><Shield size={8}/>VERIFIED</span>}
                      </div>
                      <div style={{fontWeight:700,fontSize:"0.88rem",lineHeight:1.3,marginBottom:2}}>{job.title}</div>
                      <div style={{fontSize:"0.7rem",color:"rgba(255,255,255,0.45)"}}>{job.client} · {job.posted}</div>
                    </div>
                    <div style={{textAlign:"center",flexShrink:0}}>
                      <div style={{fontSize:"1.2rem",fontWeight:900,color:"#f0c040",lineHeight:1}}>{job.match}%</div>
                      <div style={{fontSize:"0.55rem",color:"rgba(255,255,255,0.3)"}}>match</div>
                    </div>
                  </div>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div style={{fontSize:"0.72rem",color:"rgba(255,255,255,0.5)",display:"flex",gap:8}}>
                      <span style={{color:"#00e676",fontWeight:700}}>{job.budget}</span>
                      <span>{job.proposals} proposals</span>
                    </div>
                    <button onClick={e=>{e.stopPropagation();toggleSave(job.id);}} style={{background:"none",border:"none",cursor:"pointer",color:saved.includes(job.id)?"#f0c040":"rgba(255,255,255,0.25)",padding:2}}>
                      {saved.includes(job.id)?<BookmarkCheck size={15}/>:<Bookmark size={15}/>}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Job detail */}
            <div style={{flex:1,overflowY:"auto",padding:24,color:"white"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16,gap:12,flexWrap:"wrap"}}>
                <div>
                  <div style={{display:"flex",gap:6,marginBottom:6,flexWrap:"wrap"}}>
                    {selected.urgent&&<span style={{fontSize:"0.65rem",padding:"3px 9px",background:"rgba(240,192,64,0.15)",border:"1px solid rgba(240,192,64,0.3)",borderRadius:6,color:"#f0c040",fontWeight:800}}>⚡ URGENT</span>}
                    <span style={{fontSize:"0.65rem",padding:"3px 9px",background:"rgba(26,107,255,0.08)",border:"1px solid rgba(26,107,255,0.18)",borderRadius:6,color:"#4da6ff"}}>{selected.cat}</span>
                    <span style={{fontSize:"0.65rem",padding:"3px 9px",background:"rgba(26,107,255,0.06)",border:"1px solid rgba(26,107,255,0.12)",borderRadius:6,color:"rgba(255,255,255,0.5)"}}>{selected.type}</span>
                  </div>
                  <h2 style={{fontSize:"1.4rem",fontWeight:900,marginBottom:4,lineHeight:1.2}}>{selected.title}</h2>
                  <div style={{fontSize:"0.82rem",color:"rgba(255,255,255,0.5)",display:"flex",gap:10,flexWrap:"wrap"}}>
                    {selected.verified&&<span style={{display:"flex",alignItems:"center",gap:4,color:"#4da6ff"}}><Shield size={12}/>Verified Client</span>}
                    <span>{selected.client}</span>
                    <span>·</span>
                    <span>Posted {selected.posted}</span>
                    <span>·</span>
                    <span>{selected.proposals} proposals</span>
                  </div>
                </div>
                <div style={{textAlign:"center",flexShrink:0}}>
                  <div style={{fontSize:"2.5rem",fontWeight:900,color:"#f0c040",lineHeight:1}}>{selected.match}%</div>
                  <div style={{fontSize:"0.65rem",color:"rgba(255,255,255,0.4)"}}>AI Match Score</div>
                </div>
              </div>

              {/* Stats row */}
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:18}}>
                {[["Budget",selected.budget,"#00e676"],[`${selected.proposals} Proposals`,"Competition","rgba(255,255,255,0.6)"],[selected.type,"Contract Type","#4da6ff"]].map(([v,l,c],i)=>(
                  <div key={i} style={{padding:"12px",background:"rgba(26,107,255,0.05)",border:"1px solid rgba(26,107,255,0.12)",borderRadius:10}}>
                    <div style={{fontWeight:800,color:c,fontSize:"0.95rem",marginBottom:2}}>{v}</div>
                    <div style={{fontSize:"0.65rem",color:"rgba(255,255,255,0.38)"}}>{l}</div>
                  </div>
                ))}
              </div>

              {/* Description */}
              <div style={{marginBottom:16}}>
                <div style={{fontWeight:700,marginBottom:8,fontSize:"0.85rem",color:"rgba(255,255,255,0.5)",textTransform:"uppercase",letterSpacing:"0.08em"}}>Job Description</div>
                <p style={{fontSize:"0.88rem",color:"rgba(255,255,255,0.7)",lineHeight:1.75}}>{selected.desc}</p>
              </div>

              {/* Skills */}
              <div style={{marginBottom:20}}>
                <div style={{fontWeight:700,marginBottom:8,fontSize:"0.85rem",color:"rgba(255,255,255,0.5)",textTransform:"uppercase",letterSpacing:"0.08em"}}>Required Skills</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
                  {selected.skills.map(s=><span key={s} style={{padding:"6px 14px",background:"rgba(26,107,255,0.08)",border:"1px solid rgba(26,107,255,0.2)",borderRadius:8,fontSize:"0.8rem",color:"#4da6ff",fontWeight:600}}>{s}</span>)}
                </div>
              </div>

              {/* CTA */}
              <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                <button style={{flex:2,padding:"14px 28px",background:"linear-gradient(135deg,#1a6bff,#0050dd)",border:"none",borderRadius:10,color:"white",fontWeight:800,fontSize:"1rem",cursor:"pointer",boxShadow:"0 4px 20px rgba(26,107,255,0.4)",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                  <Zap size={18}/>Quick Apply
                </button>
                <button onClick={()=>toggleSave(selected.id)} style={{padding:"13px 18px",background:saved.includes(selected.id)?"rgba(240,192,64,0.1)":"rgba(26,107,255,0.07)",border:`1px solid ${saved.includes(selected.id)?"rgba(240,192,64,0.3)":"rgba(26,107,255,0.2)"}`,borderRadius:10,color:saved.includes(selected.id)?"#f0c040":"#4da6ff",fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",gap:6}}>
                  {saved.includes(selected.id)?<BookmarkCheck size={16}/>:<Bookmark size={16}/>}{saved.includes(selected.id)?"Saved":"Save"}
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
