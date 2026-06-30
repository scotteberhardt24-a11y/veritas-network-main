
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/sidebar/Sidebar";
import TopBar from "@/components/topbar/TopBar";
import { FileText, Sparkles, Plus, X, CheckCircle2, Loader2, Shield, DollarSign, Calendar } from "lucide-react";

const STEPS = ["Parties & Scope","Milestones & Payment","Terms & Legal","Review & Sign"];

export default function ContractWizardPage() {
  const router = useRouter();
  const [step,setStep] = useState(0);
  const [client,setClient] = useState("");
  const [title,setTitle]   = useState("");
  const [scope,setScope]   = useState("");
  const [milestones,setMs] = useState([{title:"",amount:"",due:""}]);
  const [revisions,setRev] = useState(2);
  const [ipTransfer,setIp] = useState(true);
  const [nda,setNda]       = useState(false);
  const [generating,setGen]= useState(false);
  const [signed,setSigned] = useState(false);

  function addMs(){ setMs(p=>[...p,{title:"",amount:"",due:""}]); }
  function updateMs(i:number,field:string,val:string){ setMs(p=>p.map((m,idx)=>idx===i?{...m,[field]:val}:m)); }
  function removeMs(i:number){ setMs(p=>p.filter((_,idx)=>idx!==i)); }

  function generateAI(){
    setGen(true);
    setTimeout(()=>{
      setScope(`This agreement covers the development and delivery of "${title}" for ${client}. The contractor (Scott Eberhardt, Veritas Trust Score 845) will provide professional services as outlined in the milestone schedule below.\n\nDeliverables include source code, documentation, and deployment support. All work is protected by Veritas blockchain escrow — payment releases only upon milestone approval.\n\nIntellectual property transfers to client upon final payment. Contractor retains right to showcase work in portfolio unless NDA specified.`);
      setGen(false);
    },1500);
  }

  const totalValue = milestones.reduce((a,m)=>a+(parseInt(m.amount)||0),0);

  return(
    <div style={{display:"flex",minHeight:"100vh",background:"#010812"}}>
      <Sidebar/>
      <div style={{flex:1,display:"flex",flexDirection:"column"}}>
        <TopBar/>
        <main style={{flex:1,overflowY:"auto",padding:24,color:"white"}}>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:24}}><Sparkles size={28} color="#f0c040"/><h1 style={{fontSize:"1.8rem",fontWeight:900,margin:0}}>AI Contract Writer</h1></div>

          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:24,overflowX:"auto"}}>
            {STEPS.map((s,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
                <div style={{display:"flex",alignItems:"center",gap:7,padding:"7px 14px",borderRadius:10,fontSize:"0.78rem",fontWeight:700,background:step===i?"rgba(26,107,255,0.15)":step>i?"rgba(0,200,83,0.08)":"transparent",border:step===i?"1px solid rgba(26,107,255,0.4)":step>i?"1px solid rgba(0,200,83,0.2)":"1px solid transparent",color:step===i?"#4da6ff":step>i?"#00e676":"rgba(255,255,255,0.3)"}}>
                  {step>i?<CheckCircle2 size={13}/>:<span>{i+1}</span>}{s}
                </div>
                {i<STEPS.length-1&&<div style={{width:16,height:1,background:step>i?"#1a6bff":"rgba(26,107,255,0.15)"}}/>}
              </div>
            ))}
          </div>

          <div style={{maxWidth:680}}>
            {step===0&&(
              <div style={{background:"rgba(4,15,36,0.95)",border:"1px solid rgba(26,107,255,0.2)",borderRadius:20,padding:26}}>
                <h2 style={{fontSize:"1.15rem",fontWeight:800,marginBottom:16}}>Parties & Project Scope</h2>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
                  <div><label style={{fontSize:"0.68rem",fontWeight:700,color:"rgba(255,255,255,0.4)",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:6,display:"block"}}>Client Name</label><input value={client} onChange={e=>setClient(e.target.value)} placeholder="TechVentures Inc." style={{width:"100%",padding:"11px 14px",background:"rgba(6,18,41,0.8)",border:"1px solid rgba(26,107,255,0.2)",borderRadius:9,color:"white",fontSize:"0.88rem",outline:"none"}}/></div>
                  <div><label style={{fontSize:"0.68rem",fontWeight:700,color:"rgba(255,255,255,0.4)",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:6,display:"block"}}>Project Title</label><input value={title} onChange={e=>setTitle(e.target.value)} placeholder="SaaS Dashboard Build" style={{width:"100%",padding:"11px 14px",background:"rgba(6,18,41,0.8)",border:"1px solid rgba(26,107,255,0.2)",borderRadius:9,color:"white",fontSize:"0.88rem",outline:"none"}}/></div>
                </div>
                <div style={{marginBottom:14}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                    <label style={{fontSize:"0.68rem",fontWeight:700,color:"rgba(255,255,255,0.4)",textTransform:"uppercase",letterSpacing:"0.1em"}}>Project Scope</label>
                    <button onClick={generateAI} disabled={!client||!title||generating} style={{display:"flex",alignItems:"center",gap:5,padding:"5px 11px",background:"rgba(240,192,64,0.1)",border:"1px solid rgba(240,192,64,0.25)",borderRadius:7,color:"#f0c040",fontSize:"0.7rem",fontWeight:700,cursor:"pointer",opacity:!client||!title?0.4:1}}>
                      {generating?<Loader2 size={12} style={{animation:"spin 1s linear infinite"}}/>:<Sparkles size={12}/>}{generating?"Writing...":"AI Generate"}
                    </button>
                  </div>
                  <textarea value={scope} onChange={e=>setScope(e.target.value)} rows={7} placeholder="Describe the project scope, deliverables, and expectations..." style={{width:"100%",padding:"12px 14px",background:"rgba(6,18,41,0.8)",border:"1px solid rgba(26,107,255,0.2)",borderRadius:10,color:"white",fontSize:"0.85rem",outline:"none",resize:"none",lineHeight:1.6}}/>
                </div>
                <button onClick={()=>setStep(1)} disabled={!client||!title||!scope} style={{width:"100%",padding:"13px",background:"linear-gradient(135deg,#1a6bff,#0050dd)",border:"none",borderRadius:10,color:"white",fontWeight:700,cursor:"pointer",opacity:!client||!title||!scope?0.4:1}}>Continue →</button>
              </div>
            )}

            {step===1&&(
              <div style={{background:"rgba(4,15,36,0.95)",border:"1px solid rgba(26,107,255,0.2)",borderRadius:20,padding:26}}>
                <h2 style={{fontSize:"1.15rem",fontWeight:800,marginBottom:16}}>Milestones & Payment</h2>
                {milestones.map((m,i)=>(
                  <div key={i} style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr auto",gap:8,marginBottom:10,alignItems:"end"}}>
                    <input value={m.title} onChange={e=>updateMs(i,"title",e.target.value)} placeholder={`Milestone ${i+1} description`} style={{padding:"10px 12px",background:"rgba(6,18,41,0.8)",border:"1px solid rgba(26,107,255,0.18)",borderRadius:9,color:"white",fontSize:"0.82rem",outline:"none"}}/>
                    <input value={m.amount} onChange={e=>updateMs(i,"amount",e.target.value)} type="number" placeholder="$" style={{padding:"10px 12px",background:"rgba(6,18,41,0.8)",border:"1px solid rgba(26,107,255,0.18)",borderRadius:9,color:"white",fontSize:"0.82rem",outline:"none"}}/>
                    <input value={m.due} onChange={e=>updateMs(i,"due",e.target.value)} type="date" style={{padding:"10px 12px",background:"rgba(6,18,41,0.8)",border:"1px solid rgba(26,107,255,0.18)",borderRadius:9,color:"white",fontSize:"0.78rem",outline:"none"}}/>
                    {milestones.length>1&&<button onClick={()=>removeMs(i)} style={{padding:10,background:"rgba(255,85,85,0.07)",border:"1px solid rgba(255,85,85,0.18)",borderRadius:9,cursor:"pointer"}}><X size={14} color="rgba(255,85,85,0.7)"/></button>}
                  </div>
                ))}
                <button onClick={addMs} style={{display:"flex",alignItems:"center",gap:6,padding:"9px 14px",background:"rgba(26,107,255,0.07)",border:"1px dashed rgba(26,107,255,0.2)",borderRadius:9,color:"#4da6ff",fontSize:"0.8rem",cursor:"pointer",marginBottom:16}}><Plus size={14}/>Add Milestone</button>
                <div style={{padding:14,background:"rgba(0,200,83,0.06)",border:"1px solid rgba(0,200,83,0.18)",borderRadius:12,marginBottom:16,display:"flex",justifyContent:"space-between"}}>
                  <span style={{color:"rgba(255,255,255,0.5)",fontSize:"0.85rem"}}>Total Contract Value</span>
                  <span style={{fontWeight:900,fontSize:"1.3rem",color:"#00e676"}}>${totalValue.toLocaleString()}</span>
                </div>
                <div style={{display:"flex",gap:10}}>
                  <button onClick={()=>setStep(0)} style={{flex:1,padding:"12px",borderRadius:10,border:"1px solid rgba(26,107,255,0.15)",background:"transparent",color:"rgba(255,255,255,0.5)",cursor:"pointer"}}>← Back</button>
                  <button onClick={()=>setStep(2)} disabled={totalValue===0} style={{flex:2,padding:"12px",background:"linear-gradient(135deg,#1a6bff,#0050dd)",border:"none",borderRadius:10,color:"white",fontWeight:700,cursor:"pointer",opacity:totalValue===0?0.4:1}}>Continue →</button>
                </div>
              </div>
            )}

            {step===2&&(
              <div style={{background:"rgba(4,15,36,0.95)",border:"1px solid rgba(26,107,255,0.2)",borderRadius:20,padding:26}}>
                <h2 style={{fontSize:"1.15rem",fontWeight:800,marginBottom:16}}>Terms & Legal</h2>
                <div style={{marginBottom:16}}>
                  <label style={{fontSize:"0.68rem",fontWeight:700,color:"rgba(255,255,255,0.4)",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:8,display:"block"}}>Included Revisions</label>
                  <div style={{display:"flex",gap:8}}>
                    {[1,2,3,5].map(n=><button key={n} onClick={()=>setRev(n)} style={{flex:1,padding:"10px",background:revisions===n?"rgba(26,107,255,0.15)":"rgba(26,107,255,0.04)",border:`1px solid ${revisions===n?"rgba(26,107,255,0.4)":"rgba(26,107,255,0.1)"}`,borderRadius:9,color:revisions===n?"#4da6ff":"rgba(255,255,255,0.5)",fontWeight:700,cursor:"pointer"}}>{n} rounds</button>)}
                  </div>
                </div>
                <div style={{display:"flex",gap:14,marginBottom:8}}>
                  {[{l:"IP Transfers on Payment",v:ipTransfer,s:()=>setIp(!ipTransfer)},{l:"Require NDA",v:nda,s:()=>setNda(!nda)}].map((t,i)=>(
                    <label key={i} style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer",flex:1}} onClick={t.s}>
                      <div style={{width:38,height:21,borderRadius:11,background:t.v?"#1a6bff":"rgba(255,255,255,0.1)",position:"relative",flexShrink:0}}><span style={{position:"absolute",top:3,width:15,height:15,borderRadius:"50%",background:"white",transition:"left 0.2s",left:t.v?20:3}}/></div>
                      <span style={{fontSize:"0.82rem",color:t.v?"white":"rgba(255,255,255,0.5)"}}>{t.l}</span>
                    </label>
                  ))}
                </div>
                <div style={{padding:12,background:"rgba(26,107,255,0.04)",border:"1px solid rgba(26,107,255,0.1)",borderRadius:10,fontSize:"0.75rem",color:"rgba(255,255,255,0.4)",marginBottom:18,lineHeight:1.6}}>
                  Standard Veritas terms apply: blockchain escrow, dispute arbitration, 2% platform fee on milestone release.
                </div>
                <div style={{display:"flex",gap:10}}>
                  <button onClick={()=>setStep(1)} style={{flex:1,padding:"12px",borderRadius:10,border:"1px solid rgba(26,107,255,0.15)",background:"transparent",color:"rgba(255,255,255,0.5)",cursor:"pointer"}}>← Back</button>
                  <button onClick={()=>setStep(3)} style={{flex:2,padding:"12px",background:"linear-gradient(135deg,#1a6bff,#0050dd)",border:"none",borderRadius:10,color:"white",fontWeight:700,cursor:"pointer"}}>Review Contract →</button>
                </div>
              </div>
            )}

            {step===3&&(
              signed?(
                <div style={{textAlign:"center",padding:48,background:"rgba(4,15,36,0.95)",border:"1px solid rgba(0,200,83,0.2)",borderRadius:20}}>
                  <CheckCircle2 size={52} color="#00e676" style={{margin:"0 auto 14px"}}/>
                  <div style={{fontSize:"1.5rem",fontWeight:900,marginBottom:6}}>Contract Sent for Signature!</div>
                  <div style={{color:"rgba(255,255,255,0.45)"}}>{client} will be notified to review and sign.</div>
                </div>
              ):(
                <div style={{background:"rgba(4,15,36,0.95)",border:"1px solid rgba(26,107,255,0.2)",borderRadius:20,padding:26}}>
                  <h2 style={{fontSize:"1.15rem",fontWeight:800,marginBottom:16}}>Review & Sign</h2>
                  {[["Client",client],["Project",title],["Total Value","$"+totalValue.toLocaleString()],["Milestones",String(milestones.length)],["Revisions",revisions+" rounds"],["IP Transfer",ipTransfer?"Yes":"No"],["NDA",nda?"Required":"Not required"]].map(([l,v],i)=>(
                    <div key={i} style={{display:"flex",gap:16,padding:"10px 0",borderBottom:"1px solid rgba(26,107,255,0.06)"}}>
                      <span style={{fontSize:"0.68rem",fontWeight:700,color:"rgba(255,255,255,0.35)",textTransform:"uppercase",letterSpacing:"0.08em",width:90,flexShrink:0,paddingTop:2}}>{l}</span>
                      <span style={{fontSize:"0.88rem",color:"rgba(255,255,255,0.8)"}}>{v}</span>
                    </div>
                  ))}
                  <div style={{display:"flex",gap:10,marginTop:20}}>
                    <button onClick={()=>setStep(2)} style={{flex:1,padding:"13px",borderRadius:10,border:"1px solid rgba(26,107,255,0.15)",background:"transparent",color:"rgba(255,255,255,0.5)",cursor:"pointer"}}>← Edit</button>
                    <button onClick={()=>setSigned(true)} style={{flex:2,padding:"13px",background:"linear-gradient(135deg,#d4af37,#c9a227,#a07810)",border:"none",borderRadius:10,color:"#0a0800",fontWeight:800,fontSize:"0.95rem",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                      <Shield size={18}/>Sign & Send to Client
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
