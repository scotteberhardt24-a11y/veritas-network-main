
"use client";
import { useState } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import TopBar from "@/components/topbar/TopBar";
import { CheckCircle2, Clock, Lock, AlertTriangle, Unlock, Plus, X, Loader2, DollarSign, Calendar, Shield } from "lucide-react";

const CONTRACTS_DATA = [
  { id:"CTR-3301", title:"Full-Stack SaaS Dashboard", client:"TechVentures Inc.", total:10000,
    milestones:[
      {n:1,title:"Setup & Architecture",     amount:2000,status:"released",date:"Jun 1", note:"Completed 2 days early"},
      {n:2,title:"Core Feature Development", amount:2500,status:"released",date:"Jun 14",note:"All features delivered"},
      {n:3,title:"API Integration & Testing",amount:3000,status:"active",  date:"Jul 5", note:"In progress"},
      {n:4,title:"Launch & Deployment",      amount:2500,status:"pending", date:"Jul 20",note:"Not started"},
    ]},
  { id:"CTR-3245", title:"Brand Identity Pack",        client:"GreenLeaf Studios", total:4500,
    milestones:[
      {n:1,title:"Research & Discovery",    amount:900, status:"released",date:"May 10",note:""},
      {n:2,title:"Logo & Brand Mark",       amount:1800,status:"released",date:"May 22",note:""},
      {n:3,title:"Design System Delivery",  amount:1800,status:"released",date:"Jun 3", note:"Project complete"},
    ]},
];

const S:Record<string,{color:string;bg:string;border:string;label:string;icon:React.ReactNode}> = {
  released:{color:"#00e676",bg:"rgba(0,200,83,0.08)",  border:"rgba(0,200,83,0.2)",   label:"Released", icon:<CheckCircle2 size={16}/>},
  active:  {color:"#f0c040",bg:"rgba(240,192,64,0.08)",border:"rgba(240,192,64,0.2)", label:"In Escrow",icon:<Lock size={16}/>},
  pending: {color:"rgba(255,255,255,0.3)",bg:"rgba(255,255,255,0.03)",border:"rgba(255,255,255,0.08)",label:"Pending",icon:<Clock size={16}/>},
  disputed:{color:"#ff5555",bg:"rgba(255,85,85,0.08)", border:"rgba(255,85,85,0.2)",  label:"Disputed", icon:<AlertTriangle size={16}/>},
};

export default function MilestoneTrackerPage() {
  const [contracts,setContracts] = useState(CONTRACTS_DATA);
  const [selId,setSelId]         = useState("CTR-3301");
  const [releasing,setReleasing] = useState<number|null>(null);
  const [showAdd,setShowAdd]     = useState(false);
  const [newTitle,setNewTitle]   = useState("");
  const [newAmt,setNewAmt]       = useState("");

  const sel = contracts.find(c=>c.id===selId)!;

  function release(n:number){
    setReleasing(n);
    setTimeout(()=>{
      setContracts(p=>p.map(c=>c.id!==selId?c:{...c,milestones:c.milestones.map(m=>m.n===n?{...m,status:"released"}:m)}));
      setReleasing(null);
    },1200);
  }

  const releasedAmt = sel.milestones.filter(m=>m.status==="released").reduce((a,m)=>a+m.amount,0);
  const heldAmt     = sel.milestones.filter(m=>m.status==="active").reduce((a,m)=>a+m.amount,0);
  const pct         = Math.round((releasedAmt/sel.total)*100);

  return (
    <div style={{display:"flex",minHeight:"100vh",background:"#010812"}}>
      <Sidebar/>
      <div style={{flex:1,display:"flex",flexDirection:"column"}}>
        <TopBar/>
        <main style={{flex:1,overflowY:"auto",padding:24,color:"white"}}>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:24}}>
            <CheckCircle2 size={28} color="#00e676"/>
            <h1 style={{fontSize:"1.8rem",fontWeight:900,margin:0}}>Milestone Tracker</h1>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"240px 1fr",gap:20}}>
            {/* Contract list */}
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {contracts.map(c=>{
                const rel=c.milestones.filter(m=>m.status==="released").length;
                const pct2=Math.round((rel/c.milestones.length)*100);
                return(
                  <button key={c.id} onClick={()=>setSelId(c.id)} style={{padding:14,background:selId===c.id?"rgba(26,107,255,0.1)":"rgba(4,15,36,0.8)",border:`1px solid ${selId===c.id?"rgba(26,107,255,0.35)":"rgba(26,107,255,0.1)"}`,borderRadius:14,textAlign:"left",cursor:"pointer"}}>
                    <div style={{fontWeight:700,fontSize:"0.85rem",marginBottom:3}}>{c.title}</div>
                    <div style={{fontSize:"0.68rem",color:"rgba(255,255,255,0.4)",marginBottom:7}}>{c.client}</div>
                    <div style={{display:"flex",justifyContent:"space-between",fontSize:"0.7rem",marginBottom:5}}>
                      <span style={{color:"#00e676",fontWeight:700}}>${c.total.toLocaleString()}</span>
                      <span style={{color:"rgba(255,255,255,0.4)"}}>{rel}/{c.milestones.length} done</span>
                    </div>
                    <div style={{height:4,background:"rgba(26,107,255,0.08)",borderRadius:2,overflow:"hidden"}}>
                      <div style={{width:`${pct2}%`,height:"100%",background:"#00e676",borderRadius:2}}/>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Milestone detail */}
            <div style={{display:"flex",flexDirection:"column",gap:16}}>
              {/* Header */}
              <div style={{background:"rgba(4,15,36,0.95)",border:"1px solid rgba(26,107,255,0.18)",borderRadius:18,padding:22}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14,flexWrap:"wrap",gap:10}}>
                  <div>
                    <div style={{fontSize:"0.62rem",fontFamily:"monospace",color:"rgba(255,255,255,0.3)",marginBottom:4}}>{sel.id}</div>
                    <div style={{fontWeight:900,fontSize:"1.2rem",marginBottom:3}}>{sel.title}</div>
                    <div style={{fontSize:"0.78rem",color:"rgba(255,255,255,0.5)"}}>{sel.client}</div>
                  </div>
                  <button onClick={()=>setShowAdd(true)} style={{display:"flex",alignItems:"center",gap:6,padding:"9px 16px",background:"rgba(26,107,255,0.08)",border:"1px solid rgba(26,107,255,0.2)",borderRadius:9,color:"#4da6ff",fontSize:"0.8rem",fontWeight:600,cursor:"pointer"}}>
                    <Plus size={14}/>Add Milestone
                  </button>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:14}}>
                  {[["Total Value","$"+sel.total.toLocaleString(),"white"],["Released","$"+releasedAmt.toLocaleString(),"#00e676"],["In Escrow","$"+heldAmt.toLocaleString(),"#f0c040"]].map(([l,v,c],i)=>(
                    <div key={i} style={{padding:"10px",background:"rgba(26,107,255,0.05)",border:"1px solid rgba(26,107,255,0.1)",borderRadius:9,textAlign:"center"}}>
                      <div style={{fontWeight:900,color:c,fontSize:"1.1rem",marginBottom:2}}>{v}</div>
                      <div style={{fontSize:"0.62rem",color:"rgba(255,255,255,0.38)"}}>{l}</div>
                    </div>
                  ))}
                </div>
                <div style={{height:8,background:"rgba(26,107,255,0.08)",borderRadius:4,overflow:"hidden"}}>
                  <div style={{width:`${pct}%`,height:"100%",background:"linear-gradient(90deg,#00e676,#1a6bff)",borderRadius:4,transition:"width 0.8s"}}/>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:"0.68rem",marginTop:5,color:"rgba(255,255,255,0.35)"}}>
                  <span>{pct}% complete</span>
                  <span>${sel.total-releasedAmt} remaining</span>
                </div>
              </div>

              {/* Milestones */}
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {sel.milestones.map(m=>{
                  const ss=S[m.status];
                  return(
                    <div key={m.n} style={{display:"flex",alignItems:"center",gap:14,padding:"16px 18px",background:ss.bg,border:`1px solid ${ss.border}`,borderRadius:14}}>
                      <div style={{width:42,height:42,borderRadius:11,background:ss.bg,border:`1px solid ${ss.border}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,color:ss.color}}>{ss.icon}</div>
                      <div style={{flex:1}}>
                        <div style={{fontWeight:700,fontSize:"0.92rem",marginBottom:3}}>{m.title}</div>
                        <div style={{fontSize:"0.7rem",color:"rgba(255,255,255,0.4)",display:"flex",gap:10"}}>
                          <span style={{display:"flex",alignItems:"center",gap:4}}><Calendar size={11}/>{m.date}</span>
                          {m.note&&<span>· {m.note}</span>}
                        </div>
                      </div>
                      <div style={{textAlign:"right",flexShrink:0}}>
                        <div style={{fontWeight:900,fontSize:"1rem",marginBottom:2}}>${m.amount.toLocaleString()}</div>
                        <span style={{fontSize:"0.62rem",color:ss.color,fontWeight:700}}>{ss.label}</span>
                      </div>
                      {m.status==="active"&&(
                        <button onClick={()=>release(m.n)} disabled={releasing===m.n} style={{display:"flex",alignItems:"center",gap:5,padding:"9px 14px",background:"rgba(0,200,83,0.12)",border:"1px solid rgba(0,200,83,0.3)",borderRadius:9,color:"#00e676",fontSize:"0.8rem",fontWeight:700,cursor:"pointer",flexShrink:0}}>
                          {releasing===m.n?<Loader2 size={13} style={{animation:"spin 1s linear infinite"}}/>:<Unlock size={13}/>}
                          {releasing===m.n?"...":"Release"}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {showAdd&&(
            <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",backdropFilter:"blur(8px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:50,padding:16}}>
              <div style={{background:"rgba(4,15,36,0.99)",border:"1px solid rgba(26,107,255,0.25)",borderRadius:22,padding:28,width:"100%",maxWidth:380,color:"white"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}><div style={{fontWeight:900,fontSize:"1.05rem"}}>Add Milestone</div><button onClick={()=>setShowAdd(false)} style={{background:"none",border:"none",cursor:"pointer",color:"rgba(255,255,255,0.4)"}}><X size={20}/></button></div>
                <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:16}}>
                  {[{l:"Milestone Title",v:newTitle,s:setNewTitle,p:"e.g. Final Testing & Deployment"},{l:"Amount ($)",v:newAmt,s:setNewAmt,p:"0.00"}].map((f,i)=>(
                    <div key={i}><label style={{fontSize:"0.68rem",fontWeight:700,color:"rgba(255,255,255,0.4)",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:5,display:"block"}}>{f.l}</label><input value={f.v} onChange={e=>f.s(e.target.value)} type={i===1?"number":"text"} placeholder={f.p} style={{width:"100%",padding:"11px 14px",background:"rgba(6,18,41,0.8)",border:"1px solid rgba(26,107,255,0.18)",borderRadius:9,color:"white",fontSize:"0.88rem",outline:"none"}}/></div>
                  ))}
                </div>
                <div style={{display:"flex",gap:10}}><button onClick={()=>setShowAdd(false)} style={{flex:1,padding:"12px",borderRadius:10,border:"1px solid rgba(26,107,255,0.15)",background:"transparent",color:"rgba(255,255,255,0.5)",cursor:"pointer"}}>Cancel</button><button onClick={()=>setShowAdd(false)} disabled={!newTitle||!newAmt} style={{flex:2,padding:"12px",background:"linear-gradient(135deg,#1a6bff,#0050dd)",border:"none",borderRadius:10,color:"white",fontWeight:700,cursor:"pointer",opacity:!newTitle||!newAmt?0.4:1}}>Add Milestone</button></div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
