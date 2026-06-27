
"use client";
import { useState } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import TopBar from "@/components/topbar/TopBar";
import { VeritasEmblem } from "@/components/badges/VeritasBadges";
import { FileText, CheckCircle2, Clock, AlertTriangle, Eye, Download, Plus, Shield, Lock, X, Loader2, ExternalLink } from "lucide-react";

const CONTRACTS = [
  { id:"CTR-3301", title:"Full-Stack SaaS Dashboard",    client:"TechVentures Inc.", value:"$10,000", signed:"Jun 1, 2026",  status:"active",    milestones:4, completed:2, nextDue:"Jul 5",  blockchain:"0x4f3a...8c21" },
  { id:"CTR-3245", title:"Brand Identity & Design System",client:"GreenLeaf Studios", value:"$4,500",  signed:"May 5, 2026",  status:"completed", milestones:3, completed:3, nextDue:null,     blockchain:"0x7b2d...1e94" },
  { id:"CTR-3198", title:"Product Demo Video Package",   client:"CloudSync AI",      value:"$5,000",  signed:"Jun 3, 2026",  status:"disputed",  milestones:3, completed:1, nextDue:"Jul 10", blockchain:"0x9c1f...3a72" },
  { id:"CTR-3120", title:"Content Strategy Q2–Q3",       client:"FinEdge Capital",   value:"$2,800",  signed:"Apr 2, 2026",  status:"completed", milestones:2, completed:2, nextDue:null,     blockchain:"0x2e8b...5f30" },
  { id:"CTR-3080", title:"React Native App — Phase 1",   client:"Bloom Health",      value:"$18,000", signed:"Mar 1, 2026",  status:"completed", milestones:5, completed:5, nextDue:null,     blockchain:"0x6d4c...9b11" },
];

const S: Record<string,{label:string;color:string;bg:string;icon:React.ReactNode}> = {
  active:    {label:"Active",     color:"#4da6ff",  bg:"rgba(26,107,255,0.1)",  icon:<Clock size={13}/>},
  completed: {label:"Completed",  color:"#00e676",  bg:"rgba(0,200,83,0.1)",    icon:<CheckCircle2 size={13}/>},
  disputed:  {label:"Disputed",   color:"#ff5555",  bg:"rgba(255,85,85,0.1)",   icon:<AlertTriangle size={13}/>},
};

export default function ContractsV2Page() {
  const [filter, setFilter]     = useState("all");
  const [selected, setSelected] = useState(CONTRACTS[0]);
  const [showNew, setShowNew]   = useState(false);
  const [signing, setSigning]   = useState(false);
  const [signed, setSigned]     = useState(false);

  const filtered = filter==="all" ? CONTRACTS : CONTRACTS.filter(c=>c.status===filter);
  const totalValue = CONTRACTS.reduce((a,c)=>a+parseInt(c.value.replace(/\D/g,"")),0);
  const activeValue = CONTRACTS.filter(c=>c.status==="active").reduce((a,c)=>a+parseInt(c.value.replace(/\D/g,"")),0);

  return (
    <div style={{display:"flex",minHeight:"100vh",background:"#010812"}}>
      <Sidebar/>
      <div style={{flex:1,display:"flex",flexDirection:"column"}}>
        <TopBar/>
        <main style={{flex:1,overflowY:"auto",padding:24,color:"white"}}>

          {/* Header */}
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24,flexWrap:"wrap",gap:12}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <FileText size={28} color="#1a6bff"/>
              <h1 style={{fontSize:"1.8rem",fontWeight:900,margin:0}}>Contracts</h1>
            </div>
            <button onClick={()=>setShowNew(true)} style={{display:"flex",alignItems:"center",gap:7,padding:"11px 20px",background:"linear-gradient(135deg,#1a6bff,#0050dd)",border:"none",borderRadius:10,color:"white",fontWeight:700,fontSize:"0.88rem",cursor:"pointer",boxShadow:"0 4px 16px rgba(26,107,255,0.4)"}}>
              <Plus size={17}/> New Contract
            </button>
          </div>

          {/* KPIs */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:20}}>
            {[
              {label:"Total Contracts", value:CONTRACTS.length,          color:"#4da6ff"},
              {label:"Active",          value:CONTRACTS.filter(c=>c.status==="active").length, color:"#00d4ff"},
              {label:"Total Value",     value:`$${totalValue.toLocaleString()}`, color:"#00e676"},
              {label:"Active Value",    value:`$${activeValue.toLocaleString()}`, color:"#f0c040"},
            ].map((s,i)=>(
              <div key={i} style={{background:"rgba(4,15,36,0.9)",border:"1px solid rgba(26,107,255,0.14)",borderRadius:14,padding:"18px 16px"}}>
                <div style={{fontSize:"1.7rem",fontWeight:900,color:s.color,marginBottom:4}}>{s.value}</div>
                <div style={{fontSize:"0.7rem",color:"rgba(255,255,255,0.4)"}}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Filter tabs */}
          <div style={{display:"flex",gap:7,marginBottom:16}}>
            {[["all","All"],["active","Active"],["completed","Completed"],["disputed","Disputed"]].map(([v,l])=>(
              <button key={v} onClick={()=>setFilter(v)} style={{padding:"7px 14px",borderRadius:9,border:`1px solid ${filter===v?"rgba(26,107,255,0.45)":"rgba(26,107,255,0.12)"}`,background:filter===v?"rgba(26,107,255,0.12)":"transparent",color:filter===v?"#4da6ff":"rgba(255,255,255,0.45)",fontSize:"0.78rem",fontWeight:600,cursor:"pointer"}}>{l}</button>
            ))}
          </div>

          <div style={{display:"flex",gap:18}}>
            {/* List */}
            <div style={{flex:1,display:"flex",flexDirection:"column",gap:10}}>
              {filtered.map(c=>{
                const ss = S[c.status];
                const pct = Math.round((c.completed/c.milestones)*100);
                return(
                  <div key={c.id} onClick={()=>setSelected(c)} style={{background:"rgba(4,15,36,0.9)",border:`1px solid ${selected.id===c.id?"rgba(26,107,255,0.4)":"rgba(26,107,255,0.12)"}`,borderRadius:14,padding:18,cursor:"pointer",transition:"all 0.15s"}}>
                    <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:12,marginBottom:10}}>
                      <div>
                        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                          <span style={{fontWeight:800,fontSize:"0.95rem"}}>{c.title}</span>
                          <Shield size={12} color="#1a6bff"/>
                          <span style={{display:"flex",alignItems:"center",gap:4,fontSize:"0.62rem",padding:"3px 8px",background:ss.bg,borderRadius:6,color:ss.color,fontWeight:700}}>{ss.icon}{ss.label}</span>
                        </div>
                        <div style={{fontSize:"0.72rem",color:"rgba(255,255,255,0.4)"}}>{c.id} · {c.client} · Signed {c.signed}</div>
                        {c.nextDue&&<div style={{fontSize:"0.68rem",color:"#f0c040",marginTop:2}}>Next due: {c.nextDue}</div>}
                      </div>
                      <div style={{textAlign:"right",flexShrink:0}}>
                        <div style={{fontWeight:900,color:"#00e676",fontSize:"1rem"}}>{c.value}</div>
                        <div style={{fontSize:"0.65rem",color:"rgba(255,255,255,0.35)"}}>{c.completed}/{c.milestones} milestones</div>
                      </div>
                    </div>
                    <div style={{height:4,background:"rgba(26,107,255,0.08)",borderRadius:2,overflow:"hidden"}}>
                      <div style={{width:`${pct}%`,height:"100%",background:c.status==="disputed"?"#ff5555":c.status==="completed"?"#00e676":"#1a6bff",borderRadius:2}}/>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Detail */}
            {selected&&(
              <div style={{width:300,flexShrink:0}}>
                <div style={{background:"rgba(4,15,36,0.98)",border:"1px solid rgba(26,107,255,0.22)",borderRadius:18,overflow:"hidden",position:"sticky",top:20}}>
                  <div style={{height:4,background:`linear-gradient(90deg,${S[selected.status].color},${S[selected.status].color}88)`}}/>
                  <div style={{padding:"18px 18px"}}>
                    <div style={{fontSize:"0.62rem",color:"rgba(255,255,255,0.35)",fontFamily:"monospace",marginBottom:4}}>{selected.id}</div>
                    <div style={{fontWeight:800,fontSize:"1rem",marginBottom:4,lineHeight:1.3}}>{selected.title}</div>
                    <div style={{fontSize:"0.75rem",color:"rgba(255,255,255,0.45)",marginBottom:14}}>{selected.client} · {selected.signed}</div>

                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}}>
                      {[["Value",selected.value],["Milestones",`${selected.completed}/${selected.milestones}`],["Status",S[selected.status].label],["Next Due",selected.nextDue||"Complete"]].map(([l,v],i)=>(
                        <div key={i} style={{padding:"10px",background:"rgba(26,107,255,0.06)",border:"1px solid rgba(26,107,255,0.12)",borderRadius:9}}>
                          <div style={{fontSize:"0.6rem",color:"rgba(255,255,255,0.35)",marginBottom:3,textTransform:"uppercase",letterSpacing:"0.07em"}}>{l}</div>
                          <div style={{fontWeight:700,fontSize:"0.85rem",color:i===2?S[selected.status].color:"white"}}>{v}</div>
                        </div>
                      ))}
                    </div>

                    {/* Blockchain verification */}
                    <div style={{padding:"10px 12px",background:"rgba(0,200,83,0.06)",border:"1px solid rgba(0,200,83,0.18)",borderRadius:10,marginBottom:14}}>
                      <div style={{fontSize:"0.62rem",fontWeight:700,color:"#00e676",marginBottom:4,display:"flex",alignItems:"center",gap:5}}><Lock size={10}/>BLOCKCHAIN VERIFIED</div>
                      <div style={{fontSize:"0.65rem",fontFamily:"monospace",color:"rgba(255,255,255,0.45)",wordBreak:"break-all"}}>{selected.blockchain}</div>
                    </div>

                    <div style={{display:"flex",flexDirection:"column",gap:7}}>
                      <button style={{padding:"10px",background:"rgba(26,107,255,0.1)",border:"1px solid rgba(26,107,255,0.22)",borderRadius:9,color:"#4da6ff",fontSize:"0.8rem",fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}><Eye size={13}/>View Contract</button>
                      <button style={{padding:"10px",background:"rgba(26,107,255,0.06)",border:"1px solid rgba(26,107,255,0.14)",borderRadius:9,color:"rgba(255,255,255,0.5)",fontSize:"0.8rem",fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}><Download size={13}/>Download PDF</button>
                      <button style={{padding:"10px",background:"rgba(26,107,255,0.06)",border:"1px solid rgba(26,107,255,0.14)",borderRadius:9,color:"rgba(255,255,255,0.5)",fontSize:"0.8rem",fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}><ExternalLink size={13}/>View on Chain</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* New contract modal */}
          {showNew&&(
            <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",backdropFilter:"blur(8px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:50,padding:16}}>
              <div style={{background:"linear-gradient(135deg,rgba(4,15,36,0.99),rgba(6,18,41,0.97))",border:"1px solid rgba(26,107,255,0.25)",borderRadius:22,padding:28,width:"100%",maxWidth:480,color:"white"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
                  <div style={{fontWeight:900,fontSize:"1.1rem"}}>New Contract</div>
                  <button onClick={()=>setShowNew(false)} style={{background:"none",border:"none",color:"rgba(255,255,255,0.4)",cursor:"pointer"}}><X size={20}/></button>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:12,marginBottom:20}}>
                  {[{l:"Contract Title",p:"e.g. E-commerce Platform Build"},{l:"Client Name",p:"Full name or company"},{l:"Total Value ($)",p:"10000"}].map((f,i)=>(
                    <div key={i}>
                      <label style={{fontSize:"0.68rem",fontWeight:700,color:"rgba(255,255,255,0.4)",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:5,display:"block"}}>{f.l}</label>
                      <input placeholder={f.p} style={{width:"100%",padding:"11px 14px",background:"rgba(6,18,41,0.8)",border:"1px solid rgba(26,107,255,0.2)",borderRadius:9,color:"white",fontSize:"0.88rem",outline:"none"}}/>
                    </div>
                  ))}
                  <div>
                    <label style={{fontSize:"0.68rem",fontWeight:700,color:"rgba(255,255,255,0.4)",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:5,display:"block"}}>Or Generate with AI</label>
                    <button style={{width:"100%",padding:"11px",background:"rgba(240,192,64,0.1)",border:"1px solid rgba(240,192,64,0.25)",borderRadius:9,color:"#f0c040",fontSize:"0.85rem",fontWeight:700,cursor:"pointer"}}>✨ Use AI Contract Writer →</button>
                  </div>
                </div>
                <div style={{display:"flex",gap:10}}>
                  <button onClick={()=>setShowNew(false)} style={{flex:1,padding:"12px",borderRadius:10,border:"1px solid rgba(26,107,255,0.15)",background:"transparent",color:"rgba(255,255,255,0.5)",cursor:"pointer"}}>Cancel</button>
                  <button onClick={()=>setShowNew(false)} style={{flex:2,padding:"12px",background:"linear-gradient(135deg,#1a6bff,#0050dd)",border:"none",borderRadius:10,color:"white",fontWeight:700,cursor:"pointer"}}>Create Contract</button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
