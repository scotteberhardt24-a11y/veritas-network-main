
"use client";
import { useState } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import TopBar from "@/components/topbar/TopBar";
import { Image as ImageIcon, Plus, Star, Eye, Globe, Github, Edit3, Trash2, X, Loader2, CheckCircle2, ExternalLink } from "lucide-react";

const PROJECTS = [
  {id:"1",title:"FinVault SaaS Dashboard",  cat:"Development",img:"💻",desc:"Full-stack Next.js 15 SaaS with Stripe billing, role-based auth, real-time analytics, and multi-tenant architecture.",       tech:["Next.js","PostgreSQL","Stripe","Tailwind"],url:"https://finvault.io",views:342,stars:5,featured:true,  year:2026},
  {id:"2",title:"GreenLeaf Brand Identity",  cat:"Design",      img:"🎨",desc:"Complete rebrand including logo system, color palette, typography guide, and 60+ component library in Figma.",               tech:["Figma","Illustrator","Design Tokens"],    url:"",                  views:218,stars:5,featured:true,  year:2026},
  {id:"3",title:"CloudSync API Integration", cat:"Development",img:"⚡",desc:"RESTful API layer connecting 4 third-party services with webhook handling, retry logic, and rate limiting.",                    tech:["Node.js","Express","Redis","Docker"],     url:"https://github.com",views:89, stars:4,featured:false, year:2025},
  {id:"4",title:"Bloom Health Mobile App",   cat:"Mobile",      img:"📱",desc:"React Native health tracker with Apple Watch integration, push notifications, and offline-first data sync.",                   tech:["React Native","Expo","Firebase"],         url:"",                  views:156,stars:5,featured:false, year:2026},
  {id:"5",title:"CryptoEdge Dashboard",      cat:"Web3",        img:"🔗",desc:"Real-time crypto portfolio tracker with DeFi integrations, on-chain analytics, and automated alerts.",                        tech:["Next.js","Web3.js","Chart.js"],           url:"https://cryptoedge.io",views:204,stars:5,featured:false,year:2025},
  {id:"6",title:"RetailBoost Ad Dashboard",  cat:"Marketing",   img:"📈",desc:"Performance marketing dashboard aggregating Google, Meta, and TikTok ad data with AI-powered recommendations.",               tech:["React","Python","BigQuery"],              url:"",                  views:67, stars:4,featured:false, year:2025},
];

const CATS = ["All","Development","Design","Mobile","Web3","Marketing"];

export default function PortfolioV2Page() {
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState<typeof PROJECTS[0]|null>(null);
  const [showAdd, setShowAdd]   = useState(false);
  const [saving, setSaving]     = useState(false);
  const [saved, setSaved]       = useState(false);

  const filtered = filter==="All" ? PROJECTS : PROJECTS.filter(p=>p.cat===filter);

  function saveProject(){
    setSaving(true);
    setTimeout(()=>{setSaving(false);setSaved(true);setTimeout(()=>{setSaved(false);setShowAdd(false);},1500);},1000);
  }

  return (
    <div style={{display:"flex",minHeight:"100vh",background:"#010812"}}>
      <Sidebar/>
      <div style={{flex:1,display:"flex",flexDirection:"column"}}>
        <TopBar/>
        <main style={{flex:1,overflowY:"auto",padding:24,color:"white"}}>

          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24,flexWrap:"wrap",gap:12}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <ImageIcon size={28} color="#1a6bff"/>
              <h1 style={{fontSize:"1.8rem",fontWeight:900,margin:0}}>Portfolio</h1>
            </div>
            <button onClick={()=>setShowAdd(true)} style={{display:"flex",alignItems:"center",gap:7,padding:"11px 20px",background:"linear-gradient(135deg,#1a6bff,#0050dd)",border:"none",borderRadius:10,color:"white",fontWeight:700,fontSize:"0.88rem",cursor:"pointer",boxShadow:"0 3px 14px rgba(26,107,255,0.35)"}}>
              <Plus size={17}/> Add Project
            </button>
          </div>

          {/* Category filter */}
          <div style={{display:"flex",gap:7,flexWrap:"wrap",marginBottom:20}}>
            {CATS.map(c=>(
              <button key={c} onClick={()=>setFilter(c)} style={{padding:"7px 14px",borderRadius:20,border:`1px solid ${filter===c?"rgba(26,107,255,0.45)":"rgba(26,107,255,0.12)"}`,background:filter===c?"rgba(26,107,255,0.12)":"transparent",color:filter===c?"#4da6ff":"rgba(255,255,255,0.45)",fontSize:"0.78rem",fontWeight:600,cursor:"pointer"}}>{c}</button>
            ))}
          </div>

          {/* Grid */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))",gap:16}}>
            {filtered.map(p=>(
              <div key={p.id} style={{background:"rgba(4,15,36,0.9)",border:`1px solid ${p.featured?"rgba(240,192,64,0.2)":"rgba(26,107,255,0.12)"}`,borderRadius:18,overflow:"hidden",cursor:"pointer",transition:"border-color 0.2s"}} onClick={()=>setSelected(p)}>
                <div style={{height:140,background:"linear-gradient(135deg,rgba(26,107,255,0.12),rgba(0,100,200,0.06))",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"3.5rem",position:"relative"}}>
                  {p.img}
                  {p.featured&&<span style={{position:"absolute",top:10,left:10,fontSize:"0.62rem",padding:"3px 9px",background:"rgba(240,192,64,0.2)",border:"1px solid rgba(240,192,64,0.35)",borderRadius:6,color:"#f0c040",fontWeight:700}}>⭐ Featured</span>}
                  <div style={{position:"absolute",top:10,right:10,display:"flex",gap:5}}>
                    <button onClick={e=>{e.stopPropagation();}} style={{width:28,height:28,borderRadius:7,background:"rgba(0,0,0,0.4)",border:"none",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}><Edit3 size={13} color="rgba(255,255,255,0.6)"/></button>
                    <button onClick={e=>{e.stopPropagation();}} style={{width:28,height:28,borderRadius:7,background:"rgba(0,0,0,0.4)",border:"none",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}><Trash2 size={13} color="rgba(255,100,100,0.8)"/></button>
                  </div>
                </div>
                <div style={{padding:16}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                    <div>
                      <div style={{fontWeight:800,fontSize:"0.98rem",marginBottom:2}}>{p.title}</div>
                      <div style={{fontSize:"0.68rem",color:"rgba(255,255,255,0.38)"}}>{p.cat} · {p.year}</div>
                    </div>
                    <div style={{display:"flex",gap:0.5,flexShrink:0}}>
                      {Array.from({length:p.stars}).map((_,i)=><Star key={i} size={13} color="#f0c040" fill="#f0c040"/>)}
                    </div>
                  </div>
                  <p style={{fontSize:"0.78rem",color:"rgba(255,255,255,0.5)",lineHeight:1.55,marginBottom:10}}>{p.desc.slice(0,90)}...</p>
                  <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:10}}>
                    {p.tech.slice(0,3).map(t=><span key={t} style={{padding:"3px 9px",background:"rgba(26,107,255,0.08)",border:"1px solid rgba(26,107,255,0.15)",borderRadius:6,fontSize:"0.66rem",color:"rgba(255,255,255,0.55)",fontWeight:600}}>{t}</span>)}
                  </div>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                    <div style={{fontSize:"0.68rem",color:"rgba(255,255,255,0.3)",display:"flex",alignItems:"center",gap:4}}><Eye size={11}/>{p.views} views</div>
                    <div style={{display:"flex",gap:6}}>
                      {p.url&&<a href={p.url} target="_blank" onClick={e=>e.stopPropagation()} style={{display:"flex",alignItems:"center",gap:4,padding:"4px 10px",background:"rgba(26,107,255,0.08)",border:"1px solid rgba(26,107,255,0.15)",borderRadius:7,fontSize:"0.68rem",color:"#4da6ff",fontWeight:600,textDecoration:"none"}}><Globe size={11}/>Live</a>}
                      <button style={{display:"flex",alignItems:"center",gap:4,padding:"4px 10px",background:"rgba(26,107,255,0.06)",border:"1px solid rgba(26,107,255,0.12)",borderRadius:7,fontSize:"0.68rem",color:"rgba(255,255,255,0.5)",cursor:"pointer"}}><Github size={11}/>Repo</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add modal */}
          {showAdd&&(
            <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",backdropFilter:"blur(8px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:50,padding:16}}>
              <div style={{background:"rgba(4,15,36,0.99)",border:"1px solid rgba(26,107,255,0.25)",borderRadius:22,padding:28,width:"100%",maxWidth:500,color:"white"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
                  <div style={{fontWeight:900,fontSize:"1.1rem"}}>Add Portfolio Project</div>
                  <button onClick={()=>setShowAdd(false)} style={{background:"none",border:"none",color:"rgba(255,255,255,0.4)",cursor:"pointer"}}><X size={20}/></button>
                </div>
                {saved?(
                  <div style={{textAlign:"center",padding:"30px 0"}}>
                    <CheckCircle2 size={44} color="#00e676" style={{margin:"0 auto 12px"}}/>
                    <div style={{fontWeight:800,fontSize:"1.1rem"}}>Project Added!</div>
                  </div>
                ):(
                  <>
                    <div style={{display:"flex",flexDirection:"column",gap:11,marginBottom:18}}>
                      {[["Project Title","e.g. E-commerce Platform Rebuild"],["Live URL (optional)","https://yourproject.com"],["GitHub URL (optional)","https://github.com/..."]].map(([l,p],i)=>(
                        <div key={i}>
                          <label style={{fontSize:"0.68rem",fontWeight:700,color:"rgba(255,255,255,0.4)",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:5,display:"block"}}>{l}</label>
                          <input placeholder={p} style={{width:"100%",padding:"11px 14px",background:"rgba(6,18,41,0.8)",border:"1px solid rgba(26,107,255,0.18)",borderRadius:9,color:"white",fontSize:"0.88rem",outline:"none"}}/>
                        </div>
                      ))}
                      <div>
                        <label style={{fontSize:"0.68rem",fontWeight:700,color:"rgba(255,255,255,0.4)",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:5,display:"block"}}>Description</label>
                        <textarea rows={3} placeholder="Describe what you built, tech used, and results achieved..." style={{width:"100%",padding:"11px 14px",background:"rgba(6,18,41,0.8)",border:"1px solid rgba(26,107,255,0.18)",borderRadius:9,color:"white",fontSize:"0.85rem",outline:"none",resize:"none",lineHeight:1.55}}/>
                      </div>
                    </div>
                    <div style={{display:"flex",gap:10}}>
                      <button onClick={()=>setShowAdd(false)} style={{flex:1,padding:"12px",borderRadius:10,border:"1px solid rgba(26,107,255,0.15)",background:"transparent",color:"rgba(255,255,255,0.5)",cursor:"pointer"}}>Cancel</button>
                      <button onClick={saveProject} disabled={saving} style={{flex:2,padding:"12px",background:"linear-gradient(135deg,#1a6bff,#0050dd)",border:"none",borderRadius:10,color:"white",fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:7}}>
                        {saving?<Loader2 size={15} style={{animation:"spin 1s linear infinite"}}/>:<Plus size={15}/>}{saving?"Saving...":"Add Project"}
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
