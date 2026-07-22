"use client";
import { useState } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import TopBar from "@/components/topbar/TopBar";
import { VeritasVerifiedBadge } from "@/components/badges/VeritasBadges";
import { Search, Filter, Zap, Shield, Clock, DollarSign, MapPin, Star, ChevronRight, Briefcase, TrendingUp } from "lucide-react";

const JOBS = [
  { id:1, title:"Full-Stack SaaS Dashboard", client:"TechVentures Inc.", budget:"$8,000–$12,000", type:"Fixed", match:99, skills:["React","Node.js","PostgreSQL"], posted:"2h ago", proposals:3, verified:true, urgent:true, trustRequired:700 },
  { id:2, title:"AI Chatbot Integration",    client:"CloudSync AI",     budget:"$150/hr",         type:"Hourly",match:97, skills:["Python","OpenAI","FastAPI"],   posted:"4h ago", proposals:5, verified:true, urgent:false,trustRequired:600 },
  { id:3, title:"Brand Identity & Logo",     client:"GreenLeaf Studio", budget:"$3,500–$5,000",   type:"Fixed", match:94, skills:["Figma","Illustrator","Branding"],posted:"6h ago",proposals:2, verified:true, urgent:false,trustRequired:500 },
  { id:4, title:"Smart Contract Audit",      client:"DeFi Protocol",    budget:"$5,000–$8,000",   type:"Fixed", match:91, skills:["Solidity","Security","Web3"],   posted:"1d ago", proposals:4, verified:true, urgent:true, trustRequired:800 },
  { id:5, title:"Mobile App — React Native", client:"StartupXYZ",       budget:"$120/hr",         type:"Hourly",match:88, skills:["React Native","TypeScript","iOS"],posted:"1d ago",proposals:7, verified:false,urgent:false,trustRequired:600 },
  { id:6, title:"SEO & Content Strategy",    client:"E-Commerce Co.",   budget:"$2,000–$3,000",   type:"Fixed", match:85, skills:["SEO","Content","Analytics"],    posted:"2d ago", proposals:9, verified:true, urgent:false,trustRequired:400 },
];

const CATS = ["All","Development","Design","Writing","Marketing","Web3","Consulting"];

export default function JobBoardPage() {
  const [search, setSearch] = useState("");
  const [cat, setCat]       = useState("All");
  const [selected, setSel]  = useState(JOBS[0]);

  const filtered = JOBS.filter(j =>
    (!search || j.title.toLowerCase().includes(search.toLowerCase())) &&
    (cat === "All" || j.skills.some(s => s.toLowerCase().includes(cat.toLowerCase())))
  );

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:"#030d1e" }}>
      <Sidebar/>
      <div style={{ flex:1, display:"flex", flexDirection:"column" }}>
        <TopBar/>
        <main style={{ flex:1, overflowY:"auto", color:"white" }}>

          {/* Header */}
          <div style={{ padding:"20px 24px 0", background:"linear-gradient(180deg,rgba(10,25,55,0.5),transparent)" }}>
            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
              <Briefcase size={24} color="#4da6ff"/>
              <div>
                <h1 style={{ fontSize:"1.6rem", fontWeight:900, margin:0 }}>Job Board</h1>
                <div style={{ fontSize:"0.7rem", color:"rgba(255,255,255,0.4)" }}>AI-matched jobs sorted by your Trust Score compatibility</div>
              </div>
              <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:8, padding:"7px 14px", background:"rgba(0,200,83,0.08)", border:"1px solid rgba(0,200,83,0.2)", borderRadius:20 }}>
                <Zap size={13} color="#00e676"/>
                <span style={{ fontSize:"0.72rem", fontWeight:700, color:"#00e676" }}>AI Matching Active</span>
              </div>
            </div>

            {/* Search + filters */}
            <div style={{ display:"flex", gap:10, marginBottom:14, flexWrap:"wrap" }}>
              <div style={{ position:"relative", flex:1, minWidth:200 }}>
                <Search size={14} style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:"rgba(255,255,255,0.3)" }}/>
                <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search jobs..." style={{ width:"100%", padding:"9px 12px 9px 34px", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:9, color:"white", fontSize:"0.85rem", outline:"none" }}/>
              </div>
              <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                {CATS.map(c=>(
                  <button key={c} onClick={()=>setCat(c)} style={{ padding:"8px 14px", borderRadius:18, border:`1px solid ${cat===c?"rgba(26,107,255,0.5)":"rgba(255,255,255,0.1)"}`, background:cat===c?"rgba(26,107,255,0.12)":"transparent", color:cat===c?"#4da6ff":"rgba(255,255,255,0.5)", fontSize:"0.75rem", fontWeight:600, cursor:"pointer" }}>{c}</button>
                ))}
              </div>
            </div>
          </div>

          {/* Split view */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 380px", gap:0, flex:1 }}>

            {/* Job list */}
            <div style={{ padding:"0 24px 24px", overflowY:"auto", borderRight:"1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ fontSize:"0.72rem", color:"rgba(255,255,255,0.35)", marginBottom:10 }}>{filtered.length} jobs matched to your profile</div>
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {filtered.map(j=>(
                  <div key={j.id} onClick={()=>setSel(j)} style={{ background:selected.id===j.id?"rgba(26,107,255,0.08)":"rgba(255,255,255,0.02)", border:`1px solid ${selected.id===j.id?"rgba(26,107,255,0.35)":"rgba(255,255,255,0.06)"}`, borderRadius:14, padding:16, cursor:"pointer", transition:"all 0.15s" }}
                    onMouseEnter={e=>{ if(selected.id!==j.id)(e.currentTarget as HTMLDivElement).style.borderColor="rgba(26,107,255,0.2)"; }}
                    onMouseLeave={e=>{ if(selected.id!==j.id)(e.currentTarget as HTMLDivElement).style.borderColor="rgba(255,255,255,0.06)"; }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8, gap:10 }}>
                      <div style={{ flex:1 }}>
                        <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:4, flexWrap:"wrap" }}>
                          {j.urgent&&<span style={{ fontSize:"0.58rem", padding:"2px 7px", background:"rgba(255,85,85,0.1)", border:"1px solid rgba(255,85,85,0.25)", borderRadius:6, color:"#ff7777", fontWeight:700 }}>🔥 URGENT</span>}
                          {j.verified&&<span style={{ fontSize:"0.58rem", padding:"2px 7px", background:"rgba(26,107,255,0.1)", border:"1px solid rgba(26,107,255,0.25)", borderRadius:6, color:"#4da6ff", fontWeight:700 }}><Shield size={9} style={{display:"inline",marginRight:3}}/>VERIFIED CLIENT</span>}
                          <span style={{ fontSize:"0.6rem", color:"rgba(255,255,255,0.35)" }}>{j.posted}</span>
                        </div>
                        <div style={{ fontWeight:800, fontSize:"0.92rem", marginBottom:3 }}>{j.title}</div>
                        <div style={{ fontSize:"0.75rem", color:"rgba(255,255,255,0.45)" }}>{j.client}</div>
                      </div>
                      <div style={{ textAlign:"right", flexShrink:0 }}>
                        <div style={{ fontWeight:800, color:"#00e676", fontSize:"0.92rem" }}>{j.budget}</div>
                        <div style={{ fontSize:"0.62rem", color:"rgba(255,255,255,0.35)" }}>{j.type}</div>
                        <div style={{ marginTop:6, fontSize:"0.68rem", color:"#f0c040", fontWeight:700 }}>⚡ {j.match}% match</div>
                      </div>
                    </div>
                    <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                      {j.skills.map(s=><span key={s} style={{ fontSize:"0.62rem", padding:"2px 8px", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:5, color:"rgba(255,255,255,0.6)" }}>{s}</span>)}
                    </div>
                    <div style={{ display:"flex", justifyContent:"space-between", marginTop:8, fontSize:"0.65rem", color:"rgba(255,255,255,0.35)" }}>
                      <span>{j.proposals} proposals</span>
                      <span>Min Trust Score: {j.trustRequired}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Job detail */}
            <div style={{ padding:"0 24px 24px", overflowY:"auto" }}>
              <div style={{ position:"sticky", top:0, background:"#030d1e", paddingTop:16, paddingBottom:10, zIndex:10 }}>
                <div style={{ fontSize:"0.65rem", color:"rgba(255,255,255,0.35)", marginBottom:6 }}>JOB DETAILS</div>
              </div>
              {selected&&(
                <div>
                  <div style={{ display:"flex", gap:7, marginBottom:10, flexWrap:"wrap" }}>
                    {selected.urgent&&<span style={{ fontSize:"0.62rem", padding:"3px 9px", background:"rgba(255,85,85,0.1)", border:"1px solid rgba(255,85,85,0.25)", borderRadius:7, color:"#ff7777", fontWeight:700 }}>🔥 URGENT</span>}
                    {selected.verified&&<span style={{ fontSize:"0.62rem", padding:"3px 9px", background:"rgba(26,107,255,0.1)", border:"1px solid rgba(26,107,255,0.25)", borderRadius:7, color:"#4da6ff", fontWeight:700 }}>✓ VERIFIED CLIENT</span>}
                    <span style={{ fontSize:"0.62rem", padding:"3px 9px", background:"rgba(0,200,83,0.1)", border:"1px solid rgba(0,200,83,0.2)", borderRadius:7, color:"#00e676", fontWeight:700 }}>{selected.type}</span>
                  </div>
                  <h2 style={{ fontSize:"1.2rem", fontWeight:900, marginBottom:6, lineHeight:1.3 }}>{selected.title}</h2>
                  <div style={{ fontSize:"0.8rem", color:"rgba(255,255,255,0.5)", marginBottom:16 }}>{selected.client} · Posted {selected.posted}</div>

                  {/* Match score */}
                  <div style={{ background:"linear-gradient(135deg,rgba(26,107,255,0.08),rgba(212,175,55,0.05))", border:"1px solid rgba(26,107,255,0.2)", borderRadius:12, padding:14, marginBottom:14 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6, fontSize:"0.75rem" }}>
                      <span style={{ color:"rgba(255,255,255,0.5)" }}>AI Match Score</span>
                      <span style={{ color:"#f0c040", fontWeight:800 }}>{selected.match}%</span>
                    </div>
                    <div style={{ height:6, background:"rgba(26,107,255,0.1)", borderRadius:3, overflow:"hidden" }}>
                      <div style={{ width:`${selected.match}%`, height:"100%", background:"linear-gradient(90deg,#1a6bff,#f0c040)", borderRadius:3 }}/>
                    </div>
                    <div style={{ fontSize:"0.65rem", color:"rgba(255,255,255,0.35)", marginTop:6 }}>Your skills and Trust Score align strongly with this job</div>
                  </div>

                  {/* Budget */}
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:14 }}>
                    {[["Budget",selected.budget,"#00e676"],["Type",selected.type,"#4da6ff"],["Proposals",`${selected.proposals} submitted`,"rgba(255,255,255,0.6)"],["Min Trust",selected.trustRequired.toString(),"#f0c040"]].map(([l,v,c],i)=>(
                      <div key={i} style={{ padding:12, background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:10 }}>
                        <div style={{ fontSize:"0.6rem", color:"rgba(255,255,255,0.35)", marginBottom:3, textTransform:"uppercase", letterSpacing:"0.08em" }}>{l}</div>
                        <div style={{ fontWeight:700, color:c, fontSize:"0.88rem" }}>{v}</div>
                      </div>
                    ))}
                  </div>

                  {/* Skills */}
                  <div style={{ marginBottom:16 }}>
                    <div style={{ fontSize:"0.68rem", fontWeight:700, color:"rgba(255,255,255,0.4)", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:7 }}>Required Skills</div>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:7 }}>
                      {selected.skills.map(s=><span key={s} style={{ padding:"5px 12px", background:"rgba(26,107,255,0.08)", border:"1px solid rgba(26,107,255,0.2)", borderRadius:7, fontSize:"0.78rem", color:"#4da6ff", fontWeight:600 }}>{s}</span>)}
                    </div>
                  </div>

                  {/* Escrow note */}
                  <div style={{ padding:12, background:"rgba(0,200,83,0.05)", border:"1px solid rgba(0,200,83,0.15)", borderRadius:10, marginBottom:16, fontSize:"0.75rem", color:"rgba(255,255,255,0.55)", lineHeight:1.6, display:"flex", gap:8 }}>
                    <Shield size={14} color="#00e676" style={{ flexShrink:0, marginTop:2 }}/>
                    <span>Payment protected by Veritas Escrow. Funds lock on contract start and release only when you approve milestones.</span>
                  </div>

                  <button style={{ width:"100%", padding:"13px", background:"linear-gradient(135deg,#1a6bff,#0040cc)", border:"none", borderRadius:11, color:"white", fontWeight:800, fontSize:"0.95rem", cursor:"pointer", boxShadow:"0 4px 18px rgba(26,107,255,0.4)", marginBottom:8 }}>
                    Apply Now — {selected.match}% Match ⚡
                  </button>
                  <button style={{ width:"100%", padding:"11px", background:"transparent", border:"1px solid rgba(255,255,255,0.1)", borderRadius:11, color:"rgba(255,255,255,0.6)", fontSize:"0.85rem", cursor:"pointer" }}>
                    Save Job
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
