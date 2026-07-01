
"use client";
import { useState } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import TopBar from "@/components/topbar/TopBar";
import { Lock, Unlock, Shield, AlertTriangle, CheckCircle2, Plus, Clock, DollarSign, Loader2, X } from "lucide-react";

const ESCROWS = [
  { id:"ESC-8821", job:"Full-Stack SaaS Dashboard",    client:"TechVentures Inc.", total:10000, released:4500, held:5500, status:"active",
    milestones:[
      {n:1,title:"Setup & Architecture",    amount:2000,status:"released",date:"Jun 1"},
      {n:2,title:"Core Feature Development",amount:2500,status:"released",date:"Jun 14"},
      {n:3,title:"API Integration & Testing",amount:3000,status:"held",   date:"Jul 5"},
      {n:4,title:"Launch & Deployment",     amount:2500,status:"pending", date:"Jul 20"},
    ]},
  { id:"ESC-8654", job:"Product Demo Video",            client:"CloudSync AI",     total:5000, released:1500, held:3500, status:"disputed",
    milestones:[
      {n:1,title:"Script & Storyboard",    amount:1500,status:"released",date:"Jun 5"},
      {n:2,title:"Animation & Edit",       amount:2000,status:"disputed",date:"Jun 25"},
      {n:3,title:"Final Delivery",         amount:1500,status:"pending", date:"Jul 10"},
    ]},
  { id:"ESC-8720", job:"Brand Identity Design",        client:"GreenLeaf Studios",total:4500, released:4500, held:0, status:"completed",
    milestones:[
      {n:1,title:"Research & Discovery",  amount:900, status:"released",date:"May 10"},
      {n:2,title:"Logo & Brand Mark",     amount:1800,status:"released",date:"May 22"},
      {n:3,title:"Design System Delivery",amount:1800,status:"released",date:"Jun 3"},
    ]},
];

const MS: Record<string,{color:string;bg:string;label:string}> = {
  released:  {color:"#00e676",bg:"rgba(0,200,83,0.1)",  label:"Released"},
  held:      {color:"#f0c040",bg:"rgba(240,192,64,0.1)",label:"In Escrow"},
  pending:   {color:"rgba(255,255,255,0.3)",bg:"rgba(255,255,255,0.04)",label:"Pending"},
  disputed:  {color:"#ff5555",bg:"rgba(255,85,85,0.1)", label:"Disputed"},
  active:    {color:"#4da6ff",bg:"rgba(26,107,255,0.1)",label:"Active"},
  completed: {color:"#00e676",bg:"rgba(0,200,83,0.08)", label:"Completed"},
};

export default function EscrowV2Page() {
  const [selected, setSel]     = useState(ESCROWS[0]);
  const [releasing, setRel]    = useState<number|null>(null);
  const [tab, setTab]          = useState<"active"|"completed"|"disputed">("active");

  const filtered = ESCROWS.filter(e=> tab==="active"?e.status==="active":tab==="completed"?e.status==="completed":e.status==="disputed");
  const totalHeld     = ESCROWS.reduce((a,e)=>a+e.held,0);
  const totalReleased = ESCROWS.reduce((a,e)=>a+e.released,0);

  function release(n:number) {
    setRel(n);
    setTimeout(()=>{
      setSel(prev=>{
        const ms = prev.milestones.map(m=>m.n===n?{...m,status:"released"}:m);
        const released = ms.filter(m=>m.status==="released").reduce((a,m)=>a+m.amount,0);
        return {...prev,milestones:ms,released,held:prev.total-released};
      });
      setRel(null);
    },1200);
  }

  return (
    <div style={{display:"flex",minHeight:"100vh",background:"#010812"}}>
      <Sidebar/>
      <div style={{flex:1,display:"flex",flexDirection:"column"}}>
        <TopBar/>
        <main style={{flex:1,overflowY:"auto",padding:24,color:"white"}}>

          {/* Header */}
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24,flexWrap:"wrap",gap:12}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <Lock size={28} color="#f0c040"/>
              <h1 style={{fontSize:"1.8rem",fontWeight:900,margin:0}}>Escrow Vault</h1>
            </div>
            <button style={{display:"flex",alignItems:"center",gap:7,padding:"11px 18px",background:"rgba(26,107,255,0.08)",border:"1px solid rgba(26,107,255,0.22)",borderRadius:10,color:"#4da6ff",fontWeight:600,fontSize:"0.85rem",cursor:"pointer"}}>
              <Plus size={16}/> New Escrow
            </button>
          </div>

          {/* Stats */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:20}}>
            {[
              {icon:<Lock size={20}/>,      label:"Held in Escrow",   value:`$${totalHeld.toLocaleString()}`,     color:"#f0c040"},
              {icon:<Unlock size={20}/>,    label:"Total Released",   value:`$${totalReleased.toLocaleString()}`, color:"#00e676"},
              {icon:<Shield size={20}/>,    label:"Active Contracts", value:ESCROWS.filter(e=>e.status==="active").length, color:"#4da6ff"},
              {icon:<AlertTriangle size={20}/>,label:"Disputes",      value:ESCROWS.filter(e=>e.status==="disputed").length, color:"#ff5555"},
            ].map((s,i)=>(
              <div key={i} style={{background:"rgba(4,15,36,0.9)",border:"1px solid rgba(26,107,255,0.14)",borderRadius:14,padding:"18px 16px"}}>
                <div style={{color:s.color,marginBottom:8}}>{s.icon}</div>
                <div style={{fontSize:"1.7rem",fontWeight:900,color:s.color,lineHeight:1,marginBottom:4}}>{s.value}</div>
                <div style={{fontSize:"0.7rem",color:"rgba(255,255,255,0.4)"}}>{s.label}</div>
              </div>
            ))}
          </div>

          <div style={{display:"flex",gap:20}}>
            {/* List */}
            <div style={{width:300,flexShrink:0,display:"flex",flexDirection:"column",gap:4}}>
              <div style={{display:"flex",gap:4,marginBottom:8}}>
                {(["active","completed","disputed"] as const).map(t=>(
                  <button key={t} onClick={()=>setTab(t)} style={{flex:1,padding:"7px",borderRadius:8,border:`1px solid ${tab===t?"rgba(26,107,255,0.4)":"rgba(26,107,255,0.1)"}`,background:tab===t?"rgba(26,107,255,0.12)":"transparent",color:tab===t?"#4da6ff":"rgba(255,255,255,0.4)",fontSize:"0.72rem",fontWeight:600,cursor:"pointer",textTransform:"capitalize"}}>{t}</button>
                ))}
              </div>
              {filtered.map(e=>(
                <button key={e.id} onClick={()=>setSel(e)} style={{padding:14,background:selected.id===e.id?"rgba(26,107,255,0.1)":"rgba(4,15,36,0.8)",border:`1px solid ${selected.id===e.id?"rgba(26,107,255,0.35)":"rgba(26,107,255,0.1)"}`,borderRadius:12,textAlign:"left",cursor:"pointer",transition:"all 0.15s"}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                    <span style={{fontSize:"0.65rem",fontFamily:"monospace",color:"rgba(255,255,255,0.35)"}}>{e.id}</span>
                    <span style={{fontSize:"0.62rem",padding:"2px 7px",background:MS[e.status].bg,borderRadius:5,color:MS[e.status].color,fontWeight:700}}>{MS[e.status].label}</span>
                  </div>
                  <div style={{fontWeight:700,fontSize:"0.85rem",marginBottom:3,lineHeight:1.3}}>{e.job}</div>
                  <div style={{fontSize:"0.68rem",color:"rgba(255,255,255,0.38)",marginBottom:8}}>{e.client}</div>
                  <div style={{display:"flex",justifyContent:"space-between",fontSize:"0.72rem"}}>
                    <span style={{color:"rgba(255,255,255,0.38)"}}>Held: <span style={{color:"#f0c040",fontWeight:700}}>${e.held.toLocaleString()}</span></span>
                    <span style={{color:"rgba(255,255,255,0.38)"}}>Total: <span style={{fontWeight:700}}>${e.total.toLocaleString()}</span></span>
                  </div>
                  <div style={{marginTop:7,height:3,background:"rgba(26,107,255,0.08)",borderRadius:2,overflow:"hidden"}}>
                    <div style={{width:`${(e.released/e.total)*100}%`,height:"100%",background:"#00e676",borderRadius:2}}/>
                  </div>
                </button>
              ))}
            </div>

            {/* Detail */}
            <div style={{flex:1,background:"rgba(4,15,36,0.95)",border:"1px solid rgba(26,107,255,0.18)",borderRadius:18,padding:24}}>
              <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:20}}>
                <div>
                  <div style={{fontSize:"0.65rem",fontFamily:"monospace",color:"rgba(255,255,255,0.35)",marginBottom:4}}>{selected.id}</div>
                  <div style={{fontWeight:900,fontSize:"1.2rem",marginBottom:4}}>{selected.job}</div>
                  <div style={{fontSize:"0.78rem",color:"rgba(255,255,255,0.45)"}}>{selected.client}</div>
                </div>
                <span style={{fontSize:"0.8rem",padding:"6px 14px",background:MS[selected.status].bg,borderRadius:9,color:MS[selected.status].color,fontWeight:700,border:`1px solid ${MS[selected.status].color}44`}}>{MS[selected.status].label}</span>
              </div>

              {/* Balance */}
              <div style={{padding:18,background:"rgba(26,107,255,0.04)",border:"1px solid rgba(26,107,255,0.12)",borderRadius:14,marginBottom:20}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                  <span style={{color:"rgba(255,255,255,0.45)",fontSize:"0.85rem"}}>Total Contract Value</span>
                  <span style={{fontWeight:900,fontSize:"1.4rem",color:"#00e676"}}>${selected.total.toLocaleString()}</span>
                </div>
                <div style={{height:10,background:"rgba(26,107,255,0.08)",borderRadius:5,overflow:"hidden",marginBottom:8}}>
                  <div style={{width:`${(selected.released/selected.total)*100}%`,height:"100%",background:"linear-gradient(90deg,#00e676,#00c853)",borderRadius:5,transition:"width 0.8s"}}/>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:"0.75rem"}}>
                  <span style={{color:"#00e676"}}>Released: <strong>${selected.released.toLocaleString()}</strong></span>
                  <span style={{color:"#f0c040"}}>Held: <strong>${selected.held.toLocaleString()}</strong></span>
                </div>
              </div>

              {/* Milestones */}
              <div style={{fontWeight:800,marginBottom:12,fontSize:"0.85rem",color:"rgba(255,255,255,0.6)",textTransform:"uppercase",letterSpacing:"0.08em"}}>Milestones</div>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {selected.milestones.map(m=>{
                  const ms = MS[m.status];
                  return(
                    <div key={m.n} style={{display:"flex",alignItems:"center",gap:14,padding:"14px 16px",background:m.status==="disputed"?"rgba(255,85,85,0.05)":"rgba(26,107,255,0.03)",border:`1px solid ${m.status==="disputed"?"rgba(255,85,85,0.2)":"rgba(26,107,255,0.1)"}`,borderRadius:12}}>
                      <div style={{width:32,height:32,borderRadius:9,background:ms.bg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                        {m.status==="released"?<CheckCircle2 size={16} color="#00e676"/>:m.status==="disputed"?<AlertTriangle size={16} color="#ff5555"/>:m.status==="held"?<Lock size={16} color="#f0c040"/>:<Clock size={16} color="rgba(255,255,255,0.3)"/>}
                      </div>
                      <div style={{flex:1}}>
                        <div style={{fontWeight:700,fontSize:"0.88rem",marginBottom:2}}>{m.title}</div>
                        <div style={{fontSize:"0.67rem",color:"rgba(255,255,255,0.38)"}}>Due {m.date}</div>
                      </div>
                      <div style={{textAlign:"right",flexShrink:0}}>
                        <div style={{fontWeight:800,fontSize:"0.95rem",marginBottom:2}}>${m.amount.toLocaleString()}</div>
                        <span style={{fontSize:"0.62rem",color:ms.color,fontWeight:700}}>{ms.label}</span>
                      </div>
                      {m.status==="held"&&(
                        <button onClick={()=>release(m.n)} disabled={releasing===m.n} style={{padding:"8px 14px",background:"rgba(0,200,83,0.12)",border:"1px solid rgba(0,200,83,0.3)",borderRadius:8,color:"#00e676",fontSize:"0.75rem",fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:5,flexShrink:0}}>
                          {releasing===m.n?<Loader2 size={13} style={{animation:"spin 1s linear infinite"}}/>:<Unlock size={13}/>} Release
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
