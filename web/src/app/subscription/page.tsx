
"use client";
import { useState } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import TopBar from "@/components/topbar/TopBar";
import { CreditCard, CheckCircle2, ArrowUp, ArrowDown, X, Shield, Zap, Star, Loader2, Download } from "lucide-react";

const PLANS = [
  {id:"starter",name:"Starter",price:0,   fee:"3%", features:["5 active proposals","Basic AI matching","Standard visibility","Community access"],         current:false},
  {id:"pro",    name:"Pro",    price:49,  fee:"2%", features:["Unlimited proposals","Priority AI matching","Priority visibility","NFT Passport","Analytics","API access (10K/mo)"], current:true},
  {id:"elite",  name:"Elite",  price:149, fee:"1.5%",features:["Everything in Pro","1.5% platform fee","API access (100K/mo)","White-label","Dedicated manager","Custom escrow","5 team seats","SLA support"], current:false},
];

const INVOICES = [
  {id:"SUB-0024",date:"Jun 1, 2026", amount:49,status:"paid",plan:"Pro"},
  {id:"SUB-0023",date:"May 1, 2026", amount:49,status:"paid",plan:"Pro"},
  {id:"SUB-0022",date:"Apr 1, 2026", amount:49,status:"paid",plan:"Pro"},
  {id:"SUB-0021",date:"Mar 1, 2026", amount:49,status:"paid",plan:"Pro"},
];

export default function SubscriptionManagerPage() {
  const [annual, setAnnual]     = useState(false);
  const [switching, setSwitching] = useState<string|null>(null);
  const [switched, setSwitched]   = useState(false);

  function switchPlan(id:string){
    setSwitching(id);
    setTimeout(()=>{setSwitching(null);setSwitched(true);setTimeout(()=>setSwitched(false),2500);},1200);
  }

  const currentPlan = PLANS.find(p=>p.current)!;

  return (
    <div style={{display:"flex",minHeight:"100vh",background:"#010812"}}>
      <Sidebar/>
      <div style={{flex:1,display:"flex",flexDirection:"column"}}>
        <TopBar/>
        <main style={{flex:1,overflowY:"auto",padding:24,color:"white"}}>

          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:24}}>
            <CreditCard size={28} color="#f0c040"/>
            <h1 style={{fontSize:"1.8rem",fontWeight:900,margin:0}}>Subscription</h1>
          </div>

          {/* Current plan hero */}
          <div style={{background:"linear-gradient(135deg,rgba(4,15,36,0.98),rgba(6,18,41,0.96))",border:"1px solid rgba(240,192,64,0.22)",borderRadius:20,padding:24,marginBottom:20}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:12}}>
              <div>
                <div style={{fontSize:"0.65rem",color:"rgba(255,255,255,0.38)",textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:4}}>Current Plan</div>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:4}}>
                  <span style={{fontSize:"2rem",fontWeight:900,color:"#f0c040"}}>{currentPlan.name}</span>
                  <span style={{fontSize:"0.65rem",padding:"3px 9px",background:"rgba(0,200,83,0.1)",border:"1px solid rgba(0,200,83,0.2)",borderRadius:5,color:"#00e676",fontWeight:700}}>ACTIVE</span>
                </div>
                <div style={{color:"rgba(255,255,255,0.45)",fontSize:"0.85rem"}}>Renews Jul 1, 2026 · ${currentPlan.price}/month · {currentPlan.fee} platform fee</div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
                {[["Platform Fee",currentPlan.fee,"#00e676"],["Month Spend","$49","white"],["Saved vs. 3% fee","~$576/yr","#00e676"]].map(([l,v,c],i)=>(
                  <div key={i} style={{textAlign:"center",padding:"12px",background:"rgba(26,107,255,0.06)",border:"1px solid rgba(26,107,255,0.12)",borderRadius:10}}>
                    <div style={{fontWeight:900,color:c,fontSize:"1.1rem",marginBottom:2}}>{v}</div>
                    <div style={{fontSize:"0.62rem",color:"rgba(255,255,255,0.38)"}}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Annual toggle */}
          <div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:12,marginBottom:20}}>
            <span style={{fontSize:"0.9rem",color:annual?"rgba(255,255,255,0.4)":"white"}}>Monthly</span>
            <div onClick={()=>setAnnual(!annual)} style={{width:52,height:28,borderRadius:14,background:annual?"#1a6bff":"rgba(255,255,255,0.1)",position:"relative",cursor:"pointer",transition:"background 0.2s"}}>
              <span style={{position:"absolute",top:4,width:20,height:20,borderRadius:"50%",background:"white",transition:"left 0.2s",left:annual?28:4}}/>
            </div>
            <span style={{fontSize:"0.9rem",color:annual?"white":"rgba(255,255,255,0.4)"}}>Annual <span style={{color:"#00e676",fontWeight:700,fontSize:"0.82rem"}}>Save 20%</span></span>
          </div>

          {/* Plan cards */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16,marginBottom:24}}>
            {PLANS.map(plan=>(
              <div key={plan.id} style={{background:"rgba(4,15,36,0.95)",border:`1.5px solid ${plan.current?"rgba(240,192,64,0.35)":"rgba(26,107,255,0.15)"}`,borderRadius:18,padding:22,position:"relative",boxShadow:plan.current?"0 0 30px rgba(240,192,64,0.08)":"none"}}>
                {plan.current&&<div style={{position:"absolute",top:-10,left:"50%",transform:"translateX(-50%)",padding:"3px 14px",background:"linear-gradient(135deg,#f0c040,#c9a227)",borderRadius:10,fontSize:"0.65rem",fontWeight:900,color:"#0a0800",whiteSpace:"nowrap"}}>Current Plan</div>}
                <div style={{fontSize:"1.1rem",fontWeight:900,color:plan.current?"#f0c040":"rgba(255,255,255,0.85)",marginBottom:4}}>{plan.name}</div>
                <div style={{marginBottom:16}}>
                  <span style={{fontSize:"2.2rem",fontWeight:900}}>{plan.price===0?"Free":"$"+(annual?Math.round(plan.price*0.8):plan.price)}</span>
                  {plan.price>0&&<span style={{color:"rgba(255,255,255,0.4)",fontSize:"0.85rem"}}>/month</span>}
                  {annual&&plan.price>0&&<div style={{fontSize:"0.65rem",color:"#00e676",marginTop:2}}>Save ${Math.round(plan.price*0.2*12)}/yr</div>}
                </div>
                <div style={{fontSize:"0.8rem",color:"#f0c040",fontWeight:700,marginBottom:12}}>Platform fee: {plan.fee}</div>
                <div style={{display:"flex",flexDirection:"column",gap:7,marginBottom:18}}>
                  {plan.features.map((f,i)=>(
                    <div key={i} style={{display:"flex",alignItems:"center",gap:7,fontSize:"0.8rem",color:"rgba(255,255,255,0.7)"}}>
                      <CheckCircle2 size={13} color="#00e676" style={{flexShrink:0}}/>{f}
                    </div>
                  ))}
                </div>
                {plan.current?(
                  <div style={{padding:"10px",textAlign:"center",background:"rgba(240,192,64,0.07)",border:"1px solid rgba(240,192,64,0.15)",borderRadius:9,fontSize:"0.8rem",color:"rgba(255,255,255,0.4)"}}>✓ Active Plan</div>
                ):(
                  <button onClick={()=>switchPlan(plan.id)} disabled={!!switching} style={{width:"100%",padding:"11px",borderRadius:9,fontWeight:700,fontSize:"0.85rem",cursor:"pointer",border:"none",display:"flex",alignItems:"center",justifyContent:"center",gap:7,
                    background:plan.id==="elite"?"linear-gradient(135deg,#00d4ff,#0090cc)":"rgba(26,107,255,0.12)",
                    color:plan.id==="elite"?"#001830":"#4da6ff",
                    opacity:switching?0.6:1}}>
                    {switching===plan.id?<Loader2 size={15} style={{animation:"spin 1s linear infinite"}}/>:plan.price>currentPlan.price?<ArrowUp size={15}/>:<ArrowDown size={15}/>}
                    {switching===plan.id?"Switching...":`Switch to ${plan.name}`}
                  </button>
                )}
              </div>
            ))}
          </div>

          {switched&&(
            <div style={{padding:"12px 18px",background:"rgba(0,200,83,0.08)",border:"1px solid rgba(0,200,83,0.2)",borderRadius:12,marginBottom:20,display:"flex",alignItems:"center",gap:8}}>
              <CheckCircle2 size={18} color="#00e676"/>
              <span style={{color:"#00e676",fontWeight:700}}>Plan updated successfully! Changes take effect immediately.</span>
            </div>
          )}

          {/* Billing history */}
          <div style={{background:"rgba(4,15,36,0.9)",border:"1px solid rgba(26,107,255,0.14)",borderRadius:16,overflow:"hidden"}}>
            <div style={{padding:"14px 18px",borderBottom:"1px solid rgba(26,107,255,0.1)",fontWeight:800,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span>Billing History</span>
              <button style={{fontSize:"0.75rem",color:"#4da6ff",background:"none",border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:4}}><Download size={13}/>Export All</button>
            </div>
            {INVOICES.map((inv,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"13px 18px",borderBottom:"1px solid rgba(26,107,255,0.06)"}}>
                <div>
                  <div style={{fontWeight:600,fontSize:"0.88rem",marginBottom:1}}>{inv.plan} Plan · {inv.date}</div>
                  <div style={{fontSize:"0.68rem",fontFamily:"monospace",color:"rgba(255,255,255,0.3)"}}>{inv.id}</div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:12}}>
                  <div style={{fontWeight:800,color:"#00e676"}}>${inv.amount}</div>
                  <span style={{fontSize:"0.65rem",padding:"3px 8px",background:"rgba(0,200,83,0.08)",border:"1px solid rgba(0,200,83,0.18)",borderRadius:5,color:"#00e676",fontWeight:700"}}>Paid</span>
                  <button style={{padding:"5px 10px",background:"rgba(26,107,255,0.07)",border:"1px solid rgba(26,107,255,0.15)",borderRadius:7,color:"#4da6ff",fontSize:"0.7rem",cursor:"pointer",display:"flex",alignItems:"center",gap:4}}><Download size={11}/>PDF</button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
