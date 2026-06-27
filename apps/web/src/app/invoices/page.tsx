
"use client";
import { useState } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import TopBar from "@/components/topbar/TopBar";
import { Receipt, Plus, Download, Send, CheckCircle2, Clock, AlertCircle, DollarSign, Loader2, X, Eye } from "lucide-react";

const INVOICES = [
  { id:"INV-2024", client:"TechVentures Inc.", amount:4500,  issued:"Jun 14", due:"Jun 28", status:"paid",    items:[{desc:"Milestone 2 — Backend API Development",qty:1,rate:4500}] },
  { id:"INV-2023", client:"FinEdge Capital",   amount:9800,  issued:"Jun 8",  due:"Jun 22", status:"paid",    items:[{desc:"Milestone 1 — Project Setup & Auth",   qty:1,rate:9800}] },
  { id:"INV-2025", client:"GreenLeaf Studios", amount:1800,  issued:"Jun 18", due:"Jul 2",  status:"pending", items:[{desc:"Design System Delivery — Final Assets", qty:1,rate:1800}] },
  { id:"INV-2022", client:"Bloom Health",      amount:3200,  issued:"May 28", due:"Jun 11", status:"overdue", items:[{desc:"Final Milestone — Product Demo Video",  qty:1,rate:3200}] },
  { id:"INV-2021", client:"SaaS Growth Labs",  amount:6000,  issued:"May 15", due:"May 29", status:"paid",    items:[{desc:"ML Model — Phase 1 Delivery",           qty:1,rate:6000}] },
];

const S_STYLE:Record<string,{color:string;bg:string;border:string}> = {
  paid:    {color:"#00e676",bg:"rgba(0,200,83,0.08)",  border:"rgba(0,200,83,0.2)"},
  pending: {color:"#f0c040",bg:"rgba(240,192,64,0.08)",border:"rgba(240,192,64,0.2)"},
  overdue: {color:"#ff5555",bg:"rgba(255,85,85,0.08)", border:"rgba(255,85,85,0.2)"},
};

export default function InvoicesV2Page() {
  const [invoices]          = useState(INVOICES);
  const [selected, setSel]  = useState(INVOICES[0]);
  const [filter, setFilter] = useState("all");
  const [sending, setSend]  = useState(false);
  const [sent, setSent]     = useState(false);
  const [showCreate, setCreate] = useState(false);

  const filtered = filter==="all" ? invoices : invoices.filter(i=>i.status===filter);
  const totalPaid    = invoices.filter(i=>i.status==="paid").reduce((a,i)=>a+i.amount,0);
  const totalPending = invoices.filter(i=>i.status==="pending").reduce((a,i)=>a+i.amount,0);
  const totalOverdue = invoices.filter(i=>i.status==="overdue").reduce((a,i)=>a+i.amount,0);

  function remind(){setSend(true);setTimeout(()=>{setSend(false);setSent(true);setTimeout(()=>setSent(false),2000);},1000);}

  return (
    <div style={{display:"flex",minHeight:"100vh",background:"#010812"}}>
      <Sidebar/>
      <div style={{flex:1,display:"flex",flexDirection:"column"}}>
        <TopBar/>
        <main style={{flex:1,overflowY:"auto",padding:24,color:"white"}}>

          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24,flexWrap:"wrap",gap:12}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <Receipt size={28} color="#f0c040"/>
              <h1 style={{fontSize:"1.8rem",fontWeight:900,margin:0}}>Invoices</h1>
            </div>
            <button onClick={()=>setCreate(true)} style={{display:"flex",alignItems:"center",gap:7,padding:"11px 20px",background:"linear-gradient(135deg,#1a6bff,#0050dd)",border:"none",borderRadius:10,color:"white",fontWeight:700,fontSize:"0.88rem",cursor:"pointer",boxShadow:"0 3px 14px rgba(26,107,255,0.35)"}}>
              <Plus size={17}/> New Invoice
            </button>
          </div>

          {/* KPIs */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:20}}>
            {[
              {label:"Paid",    value:`$${totalPaid.toLocaleString()}`,    color:"#00e676", icon:<CheckCircle2 size={18}/>},
              {label:"Pending", value:`$${totalPending.toLocaleString()}`, color:"#f0c040", icon:<Clock size={18}/>},
              {label:"Overdue", value:`$${totalOverdue.toLocaleString()}`, color:"#ff5555", icon:<AlertCircle size={18}/>},
            ].map((s,i)=>(
              <div key={i} style={{background:"rgba(4,15,36,0.9)",border:"1px solid rgba(26,107,255,0.14)",borderRadius:14,padding:"18px 16px",display:"flex",gap:14,alignItems:"center"}}>
                <div style={{color:s.color}}>{s.icon}</div>
                <div>
                  <div style={{fontSize:"1.6rem",fontWeight:900,color:s.color,lineHeight:1,marginBottom:3}}>{s.value}</div>
                  <div style={{fontSize:"0.72rem",color:"rgba(255,255,255,0.4)"}}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div style={{display:"flex",gap:7,marginBottom:14}}>
            {["all","paid","pending","overdue"].map(f=>(
              <button key={f} onClick={()=>setFilter(f)} style={{padding:"7px 14px",borderRadius:9,border:`1px solid ${filter===f?"rgba(26,107,255,0.4)":"rgba(26,107,255,0.1)"}`,background:filter===f?"rgba(26,107,255,0.12)":"transparent",color:filter===f?"#4da6ff":"rgba(255,255,255,0.4)",fontSize:"0.78rem",fontWeight:600,cursor:"pointer",textTransform:"capitalize"}}>{f}</button>
            ))}
          </div>

          <div style={{display:"flex",gap:20}}>
            {/* List */}
            <div style={{width:280,flexShrink:0,display:"flex",flexDirection:"column",gap:8}}>
              {filtered.map(inv=>(
                <button key={inv.id} onClick={()=>setSel(inv)} style={{padding:14,background:selected.id===inv.id?"rgba(26,107,255,0.1)":"rgba(4,15,36,0.8)",border:`1px solid ${selected.id===inv.id?"rgba(26,107,255,0.35)":"rgba(26,107,255,0.1)"}`,borderRadius:12,textAlign:"left",cursor:"pointer",transition:"all 0.15s"}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                    <span style={{fontSize:"0.65rem",fontFamily:"monospace",color:"rgba(255,255,255,0.35)"}}>{inv.id}</span>
                    <span style={{fontSize:"0.62rem",padding:"2px 7px",background:S_STYLE[inv.status].bg,border:`1px solid ${S_STYLE[inv.status].border}`,borderRadius:5,color:S_STYLE[inv.status].color,fontWeight:700,textTransform:"capitalize"}}>{inv.status}</span>
                  </div>
                  <div style={{fontWeight:700,fontSize:"0.85rem",marginBottom:3}}>{inv.client}</div>
                  <div style={{fontWeight:900,color:"#00e676",fontSize:"1rem"}}>${inv.amount.toLocaleString()}</div>
                  <div style={{fontSize:"0.65rem",color:"rgba(255,255,255,0.3)",marginTop:3}}>Due {inv.due}</div>
                </button>
              ))}
            </div>

            {/* Detail */}
            <div style={{flex:1,background:"rgba(4,15,36,0.95)",border:"1px solid rgba(26,107,255,0.18)",borderRadius:18,padding:24}}>
              {/* Invoice header */}
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:20}}>
                <div>
                  <div style={{fontSize:"0.62rem",fontFamily:"monospace",color:"rgba(255,255,255,0.3)",marginBottom:4}}>{selected.id}</div>
                  <div style={{fontWeight:900,fontSize:"1.1rem",marginBottom:4}}>{selected.client}</div>
                  <div style={{fontSize:"0.75rem",color:"rgba(255,255,255,0.4)"}}>Issued {selected.issued} · Due {selected.due}</div>
                </div>
                <span style={{fontSize:"0.85rem",padding:"6px 14px",borderRadius:9,fontWeight:700,background:S_STYLE[selected.status].bg,border:`1px solid ${S_STYLE[selected.status].border}`,color:S_STYLE[selected.status].color,height:"fit-content",textTransform:"capitalize"}}>{selected.status}</span>
              </div>

              {/* Line items */}
              <div style={{border:"1px solid rgba(26,107,255,0.12)",borderRadius:12,overflow:"hidden",marginBottom:18}}>
                <div style={{display:"grid",gridTemplateColumns:"1fr auto auto",padding:"10px 16px",fontSize:"0.65rem",fontWeight:700,color:"rgba(255,255,255,0.35)",textTransform:"uppercase",letterSpacing:"0.08em",background:"rgba(26,107,255,0.04)",borderBottom:"1px solid rgba(26,107,255,0.08)"}}>
                  <div>Description</div><div style={{textAlign:"center",paddingRight:16}}>Qty</div><div style={{textAlign:"right"}}>Amount</div>
                </div>
                {selected.items.map((item,i)=>(
                  <div key={i} style={{display:"grid",gridTemplateColumns:"1fr auto auto",padding:"14px 16px",borderBottom:"1px solid rgba(26,107,255,0.06)"}}>
                    <div style={{fontSize:"0.88rem",fontWeight:500}}>{item.desc}</div>
                    <div style={{textAlign:"center",paddingRight:16,fontSize:"0.85rem",color:"rgba(255,255,255,0.5)"}}>{item.qty}</div>
                    <div style={{textAlign:"right",fontWeight:800,color:"#00e676"}}>${item.rate.toLocaleString()}</div>
                  </div>
                ))}
                <div style={{display:"grid",gridTemplateColumns:"1fr auto",padding:"14px 16px",background:"rgba(26,107,255,0.04)",borderTop:"1px solid rgba(26,107,255,0.1)"}}>
                  <div style={{fontWeight:800,fontSize:"0.95rem"}}>Total</div>
                  <div style={{fontWeight:900,fontSize:"1.3rem",color:"#00e676"}}>${selected.amount.toLocaleString()}</div>
                </div>
              </div>

              {/* Actions */}
              <div style={{display:"flex",gap:10}}>
                <button style={{display:"flex",alignItems:"center",gap:6,padding:"11px 18px",background:"rgba(26,107,255,0.07)",border:"1px solid rgba(26,107,255,0.18)",borderRadius:9,color:"#4da6ff",fontSize:"0.82rem",fontWeight:600,cursor:"pointer"}}><Download size={14}/>PDF</button>
                <button style={{display:"flex",alignItems:"center",gap:6,padding:"11px 18px",background:"rgba(26,107,255,0.07)",border:"1px solid rgba(26,107,255,0.18)",borderRadius:9,color:"#4da6ff",fontSize:"0.82rem",fontWeight:600,cursor:"pointer"}}><Eye size={14}/>Preview</button>
                {selected.status!=="paid"&&(
                  <button onClick={remind} disabled={sending} style={{display:"flex",alignItems:"center",gap:6,padding:"11px 18px",background:sent?"rgba(0,200,83,0.1)":"linear-gradient(135deg,#1a6bff,#0050dd)",border:"none",borderRadius:9,color:"white",fontSize:"0.82rem",fontWeight:700,cursor:"pointer",boxShadow:"0 2px 12px rgba(26,107,255,0.3)"}}>
                    {sending?<Loader2 size={14} style={{animation:"spin 1s linear infinite"}}/>:sent?<CheckCircle2 size={14}/>:<Send size={14}/>}
                    {sent?"Sent!":sending?"Sending...":"Send Reminder"}
                  </button>
                )}
              </div>
            </div>
          </div>

          {showCreate&&(
            <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",backdropFilter:"blur(8px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:50,padding:16}}>
              <div style={{background:"rgba(4,15,36,0.99)",border:"1px solid rgba(26,107,255,0.25)",borderRadius:22,padding:28,width:"100%",maxWidth:480,color:"white"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
                  <div style={{fontWeight:900,fontSize:"1.1rem"}}>Create Invoice</div>
                  <button onClick={()=>setCreate(false)} style={{background:"none",border:"none",color:"rgba(255,255,255,0.4)",cursor:"pointer"}}><X size={20}/></button>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:11,marginBottom:18}}>
                  {[["Client Name","TechVentures Inc."],["Invoice Amount ($)","0.00"],["Due Date",""],["Description","Service description"]].map(([l,p],i)=>(
                    <div key={i}>
                      <label style={{fontSize:"0.68rem",fontWeight:700,color:"rgba(255,255,255,0.4)",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:5,display:"block"}}>{l}</label>
                      <input placeholder={p} type={i===1?"number":i===2?"date":"text"} style={{width:"100%",padding:"11px 14px",background:"rgba(6,18,41,0.8)",border:"1px solid rgba(26,107,255,0.18)",borderRadius:9,color:"white",fontSize:"0.88rem",outline:"none"}}/>
                    </div>
                  ))}
                </div>
                <div style={{display:"flex",gap:10}}>
                  <button onClick={()=>setCreate(false)} style={{flex:1,padding:"12px",borderRadius:10,border:"1px solid rgba(26,107,255,0.15)",background:"transparent",color:"rgba(255,255,255,0.5)",cursor:"pointer"}}>Cancel</button>
                  <button onClick={()=>setCreate(false)} style={{flex:2,padding:"12px",background:"linear-gradient(135deg,#d4af37,#c9a227,#a07810)",border:"none",borderRadius:10,color:"#0a0800",fontWeight:700,cursor:"pointer"}}>Create & Send</button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
