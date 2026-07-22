"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/sidebar/Sidebar";
import TopBar from "@/components/topbar/TopBar";
import { VeritasVerifiedBadge } from "@/components/badges/VeritasBadges";
import { Shield, Search, Star, Clock, Briefcase, ChevronRight, Zap, MapPin, Filter } from "lucide-react";

const WORKERS = [
  { id:1, name:"Alex Chen",      username:"alexchen.dev",  title:"Full-Stack Developer",   score:990, rate:150, jobs:247, rating:5.0, skills:["React","Next.js","Node.js","PostgreSQL"], available:true,  location:"San Francisco, CA", earned:"$184K" },
  { id:2, name:"Maya Rodriguez", username:"maya.designs",  title:"UI/UX Designer",          score:980, rate:120, jobs:189, rating:5.0, skills:["Figma","Framer","React","CSS"],           available:true,  location:"Austin, TX",        earned:"$142K" },
  { id:3, name:"James Park",     username:"jpark.writes",  title:"Technical Writer",         score:970, rate:95,  jobs:312, rating:4.9, skills:["Docs","API","Content","SEO"],            available:false, location:"New York, NY",       earned:"$98K"  },
  { id:4, name:"Priya Sharma",   username:"priyadev",      title:"Backend Engineer",         score:960, rate:140, jobs:156, rating:5.0, skills:["Python","AWS","PostgreSQL","Docker"],     available:true,  location:"Remote",             earned:"$221K" },
  { id:5, name:"David Okonkwo",  username:"david.mktg",    title:"Growth Marketer",          score:950, rate:110, jobs:203, rating:4.9, skills:["SEO","Ads","Analytics","Content"],       available:true,  location:"Chicago, IL",        earned:"$87K"  },
  { id:6, name:"Lena Fischer",   username:"lena.ux",       title:"Product Designer",         score:940, rate:130, jobs:178, rating:5.0, skills:["Figma","Prototyping","UX","Webflow"],    available:true,  location:"Berlin, DE",         earned:"$156K" },
];

const CATS = ["All","Development","Design","Writing","Marketing","Web3","Video","Consulting"];

export default function MarketplacePage() {
  const router = useRouter();
  const [search, setSearch]   = useState("");
  const [cat, setCat]         = useState("All");
  const [selected, setSel]    = useState(WORKERS[0]);
  const [hiring, setHiring]   = useState(false);

  const filtered = WORKERS.filter(w =>
    (!search || w.name.toLowerCase().includes(search.toLowerCase()) || w.title.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:"#030d1e" }}>
      <Sidebar/>
      <div style={{ flex:1, display:"flex", flexDirection:"column" }}>
        <TopBar/>
        <main style={{ flex:1, display:"flex", flexDirection:"column", color:"white", overflow:"hidden" }}>

          {/* Header */}
          <div style={{ padding:"20px 24px 14px", borderBottom:"1px solid rgba(255,255,255,0.06)", background:"linear-gradient(180deg,rgba(10,25,55,0.4),transparent)" }}>
            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:14 }}>
              <Shield size={24} color="#4da6ff"/>
              <div>
                <h1 style={{ fontSize:"1.6rem", fontWeight:900, margin:0 }}>Talent Marketplace</h1>
                <div style={{ fontSize:"0.7rem", color:"rgba(255,255,255,0.4)" }}>Only verified professionals — every worker blockchain-verified</div>
              </div>
              <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:6, padding:"6px 14px", background:"rgba(26,107,255,0.08)", border:"1px solid rgba(26,107,255,0.2)", borderRadius:20, fontSize:"0.72rem", color:"#4da6ff", fontWeight:700 }}>
                <Zap size={13}/> AI-Sorted by Best Match
              </div>
            </div>
            <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
              <div style={{ position:"relative", flex:1, minWidth:200 }}>
                <Search size={14} style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:"rgba(255,255,255,0.3)" }}/>
                <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search professionals..." style={{ width:"100%", padding:"9px 12px 9px 34px", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:9, color:"white", fontSize:"0.85rem", outline:"none" }}/>
              </div>
              <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                {CATS.map(c=>(
                  <button key={c} onClick={()=>setCat(c)} style={{ padding:"8px 14px", borderRadius:18, border:`1px solid ${cat===c?"rgba(26,107,255,0.5)":"rgba(255,255,255,0.1)"}`, background:cat===c?"rgba(26,107,255,0.12)":"transparent", color:cat===c?"#4da6ff":"rgba(255,255,255,0.5)", fontSize:"0.75rem", fontWeight:600, cursor:"pointer" }}>{c}</button>
                ))}
              </div>
            </div>
          </div>

          {/* Split view */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 400px", flex:1, overflow:"hidden" }}>

            {/* Worker list */}
            <div style={{ overflowY:"auto", padding:"16px 24px", borderRight:"1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ fontSize:"0.72rem", color:"rgba(255,255,255,0.35)", marginBottom:12 }}>{filtered.length} verified professionals</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                {filtered.map(w=>(
                  <div key={w.id} onClick={()=>setSel(w)} style={{ background:selected.id===w.id?"rgba(26,107,255,0.08)":"rgba(255,255,255,0.02)", border:`1px solid ${selected.id===w.id?"rgba(26,107,255,0.35)":"rgba(255,255,255,0.06)"}`, borderRadius:14, padding:16, cursor:"pointer", transition:"all 0.15s" }}
                    onMouseEnter={e=>{if(selected.id!==w.id)(e.currentTarget as HTMLDivElement).style.borderColor="rgba(26,107,255,0.2)";}}
                    onMouseLeave={e=>{if(selected.id!==w.id)(e.currentTarget as HTMLDivElement).style.borderColor="rgba(255,255,255,0.06)";}}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
                      <VeritasVerifiedBadge score={w.score} size={58}/>
                      <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:4 }}>
                        <div style={{ fontSize:"0.62rem", padding:"2px 7px", borderRadius:8, background:w.available?"rgba(0,200,83,0.1)":"rgba(255,255,255,0.05)", color:w.available?"#00e676":"rgba(255,255,255,0.35)", fontWeight:700 }}>{w.available?"● Available":"○ Busy"}</div>
                        <div style={{ fontSize:"0.72rem", fontWeight:800, color:"#00e676" }}>${w.rate}/hr</div>
                      </div>
                    </div>
                    <div style={{ fontWeight:800, fontSize:"0.9rem", marginBottom:2 }}>{w.name}</div>
                    <div style={{ fontSize:"0.72rem", color:"rgba(255,255,255,0.5)", marginBottom:8 }}>{w.title}</div>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:5, marginBottom:8 }}>
                      {w.skills.slice(0,3).map(s=><span key={s} style={{ fontSize:"0.58rem", padding:"2px 7px", background:"rgba(26,107,255,0.08)", border:"1px solid rgba(26,107,255,0.15)", borderRadius:5, color:"#4da6ff" }}>{s}</span>)}
                    </div>
                    <div style={{ display:"flex", justifyContent:"space-between", fontSize:"0.65rem", color:"rgba(255,255,255,0.4)" }}>
                      <span>⭐ {w.rating} · {w.jobs} jobs</span>
                      <span style={{ color:"rgba(255,255,255,0.25)", display:"flex", alignItems:"center", gap:3 }}><MapPin size={10}/>{w.location.split(",")[0]}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Worker profile detail */}
            <div style={{ overflowY:"auto", padding:"16px 24px" }}>
              {selected&&(
                <div>
                  <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:10, marginBottom:20, padding:"20px", background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:16 }}>
                    <VeritasVerifiedBadge score={selected.score} size={110}/>
                    <div style={{ textAlign:"center" }}>
                      <h2 style={{ fontSize:"1.2rem", fontWeight:900, margin:"0 0 3px" }}>{selected.name}</h2>
                      <div style={{ fontSize:"0.82rem", color:"rgba(255,255,255,0.5)", marginBottom:6 }}>{selected.title}</div>
                      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:5, fontSize:"0.68rem", color:"rgba(255,255,255,0.4)" }}><MapPin size={11}/>{selected.location}</div>
                    </div>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, width:"100%" }}>
                      {[["Trust Score",selected.score,"#00e676"],["Rate",`$${selected.rate}/hr`,"#f0c040"],["Jobs",selected.jobs,"#4da6ff"]].map(([l,v,c],i)=>(
                        <div key={i} style={{ textAlign:"center", padding:10, background:"rgba(26,107,255,0.06)", borderRadius:9 }}>
                          <div style={{ fontWeight:900, color:c, fontSize:"1rem", lineHeight:1, marginBottom:2 }}>{v}</div>
                          <div style={{ fontSize:"0.58rem", color:"rgba(255,255,255,0.4)" }}>{l}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginBottom:14 }}>
                    <div style={{ fontSize:"0.68rem", fontWeight:700, color:"rgba(255,255,255,0.4)", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:7 }}>Skills & Expertise</div>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:7 }}>
                      {selected.skills.map(s=><span key={s} style={{ padding:"5px 12px", background:"rgba(26,107,255,0.08)", border:"1px solid rgba(26,107,255,0.2)", borderRadius:7, fontSize:"0.78rem", color:"#4da6ff", fontWeight:600 }}>{s}</span>)}
                    </div>
                  </div>

                  <div style={{ padding:12, background:"rgba(0,200,83,0.05)", border:"1px solid rgba(0,200,83,0.15)", borderRadius:10, marginBottom:14, fontSize:"0.75rem", color:"rgba(255,255,255,0.55)", lineHeight:1.6, display:"flex", gap:8 }}>
                    <Shield size={14} color="#00e676" style={{ flexShrink:0, marginTop:2 }}/>
                    <span>All payments protected by Veritas Escrow. Hire with confidence — funds release only on your approval.</span>
                  </div>

                  <button onClick={()=>router.push("/ai-match")} style={{ width:"100%", padding:"13px", background:"linear-gradient(135deg,#1a6bff,#0040cc)", border:"none", borderRadius:11, color:"white", fontWeight:800, fontSize:"0.95rem", cursor:"pointer", boxShadow:"0 4px 18px rgba(26,107,255,0.4)", marginBottom:8 }}>
                    Hire {selected.name.split(" ")[0]} — Start Project
                  </button>
                  <button style={{ width:"100%", padding:"11px", background:"transparent", border:"1px solid rgba(255,255,255,0.1)", borderRadius:11, color:"rgba(255,255,255,0.6)", fontSize:"0.85rem", cursor:"pointer" }}>
                    Message
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
