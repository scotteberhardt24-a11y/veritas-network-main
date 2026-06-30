
"use client";
import { useState } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import TopBar from "@/components/topbar/TopBar";
import { Wallet, DollarSign, Lock, Unlock, ArrowDown, ArrowUp, TrendingUp, CreditCard, CheckCircle2, Loader2, X, AlertCircle } from "lucide-react";

const TXS = [
  {id:"TX-9821",desc:"Milestone 3 Released — TechVentures",    amount:+3500,  fee:-70,   net:+3430,  date:"Jun 28",type:"credit",status:"confirmed"},
  {id:"TX-9820",desc:"Platform Fee (2%) — TechVentures",       amount:-70,    fee:0,     net:-70,    date:"Jun 28",type:"fee",   status:"confirmed"},
  {id:"TX-9818",desc:"Milestone 2 Released — GreenLeaf",       amount:+1800,  fee:-36,   net:+1764,  date:"Jun 20",type:"credit",status:"confirmed"},
  {id:"TX-9812",desc:"Bank Transfer — Chase ••6789",           amount:-8000,  fee:0,     net:-8000,  date:"Jun 15",type:"debit", status:"confirmed"},
  {id:"TX-9805",desc:"Milestone 1 Released — FinEdge",         amount:+9800,  fee:-196,  net:+9604,  date:"Jun 10",type:"credit",status:"confirmed"},
  {id:"TX-9798",desc:"Escrow Held — ESC-8821",                 amount:-5500,  fee:0,     net:-5500,  date:"Jun 1", type:"hold",  status:"held"},
];

export default function VaultV2Page() {
  const [showWithdraw, setShow] = useState(false);
  const [amount, setAmount]     = useState("");
  const [method, setMethod]     = useState("bank");
  const [withdrawing, setWith]  = useState(false);
  const [done, setDone]         = useState(false);
  const [filter, setFilter]     = useState("all");

  const balance  = 12840.50;
  const held     = 5500;
  const pending  = 4500;
  const lifetime = 182500;

  const filtered = filter==="all" ? TXS : TXS.filter(t=>filter==="credits"?t.type==="credit":filter==="debits"?t.type==="debit"||t.type==="fee":t.type==="hold");

  function withdraw(){
    if(!amount) return;
    setWith(true);
    setTimeout(()=>{setWith(false);setDone(true);setTimeout(()=>{setDone(false);setShow(false);setAmount("");},2000);},1500);
  }

  return(
    <div style={{display:"flex",minHeight:"100vh",background:"#010812"}}>
      <Sidebar/>
      <div style={{flex:1,display:"flex",flexDirection:"column"}}>
        <TopBar/>
        <main style={{flex:1,overflowY:"auto",padding:24,color:"white"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24,flexWrap:"wrap",gap:12}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <Wallet size={28} color="#f0c040"/>
              <h1 style={{fontSize:"1.8rem",fontWeight:900,margin:0}}>Vault</h1>
            </div>
            <button onClick={()=>setShow(true)} style={{display:"flex",alignItems:"center",gap:7,padding:"11px 20px",background:"linear-gradient(135deg,#d4af37,#c9a227,#a07810)",border:"none",borderRadius:10,color:"#0a0800",fontWeight:800,fontSize:"0.88rem",cursor:"pointer",boxShadow:"0 3px 14px rgba(201,162,39,0.35)"}}>
              <ArrowUp size={17}/>Withdraw Funds
            </button>
          </div>

          {/* Balance cards */}
          <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr",gap:14,marginBottom:20}}>
            <div style={{background:"linear-gradient(135deg,rgba(4,15,36,0.98),rgba(6,18,41,0.96))",border:"1px solid rgba(240,192,64,0.25)",borderRadius:18,padding:"22px 24px",position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",top:0,right:0,width:120,height:120,background:"radial-gradient(ellipse,rgba(240,192,64,0.08),transparent)",borderRadius:"50%"}}/>
              <div style={{fontSize:"0.65rem",fontWeight:700,color:"rgba(255,255,255,0.4)",textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:6}}>Available Balance</div>
              <div style={{fontSize:"3rem",fontWeight:900,background:"linear-gradient(135deg,#f0c040,#c9a227)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",lineHeight:1,marginBottom:4}}>${balance.toLocaleString("en-US",{minimumFractionDigits:2})}</div>
              <div style={{fontSize:"0.75rem",color:"rgba(255,255,255,0.45)"}}>Available to withdraw immediately</div>
            </div>
            {[{label:"Held in Escrow",value:`$${held.toLocaleString()}`,color:"#4da6ff",icon:<Lock size={18}/>},{label:"Pending Release",value:`$${pending.toLocaleString()}`,color:"#f0c040",icon:<Clock size={18}/>},{label:"Lifetime Earned",value:`$${lifetime.toLocaleString()}`,color:"#00e676",icon:<TrendingUp size={18}/>}].map((s,i)=>(
              <div key={i} style={{background:"rgba(4,15,36,0.9)",border:"1px solid rgba(26,107,255,0.14)",borderRadius:16,padding:"18px 16px"}}>
                <div style={{color:s.color,marginBottom:8}}>{s.icon}</div>
                <div style={{fontSize:"1.5rem",fontWeight:900,color:s.color,marginBottom:3}}>{s.value}</div>
                <div style={{fontSize:"0.7rem",color:"rgba(255,255,255,0.4)"}}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Payout methods */}
          <div style={{background:"rgba(4,15,36,0.9)",border:"1px solid rgba(26,107,255,0.14)",borderRadius:16,padding:18,marginBottom:16}}>
            <div style={{fontWeight:800,marginBottom:12,fontSize:"0.9rem"}}>Payout Methods</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
              {[{ic:"🏦",name:"Chase Bank ••6789",type:"Checking",primary:true,speed:"1-2 days"},{ic:"💳",name:"Visa Debit ••4242",type:"Instant",primary:false,speed:"Instant"},{ic:"₿",name:"USDC on Polygon",type:"Crypto",primary:false,speed:"~5 min"}].map((m,i)=>(
                <div key={i} style={{display:"flex",gap:10,padding:"12px",background:"rgba(26,107,255,0.05)",border:`1px solid ${m.primary?"rgba(240,192,64,0.25)":"rgba(26,107,255,0.12)"}`,borderRadius:10}}>
                  <span style={{fontSize:"1.4rem"}}>{m.ic}</span>
                  <div>
                    <div style={{fontWeight:700,fontSize:"0.82rem"}}>{m.name}</div>
                    <div style={{fontSize:"0.63rem",color:"rgba(255,255,255,0.4)"}}>{m.type} · {m.speed}</div>
                    {m.primary&&<div style={{fontSize:"0.58rem",color:"#f0c040",fontWeight:700,marginTop:2}}>PRIMARY</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Transactions */}
          <div style={{background:"rgba(4,15,36,0.9)",border:"1px solid rgba(26,107,255,0.14)",borderRadius:16,overflow:"hidden"}}>
            <div style={{padding:"14px 18px",borderBottom:"1px solid rgba(26,107,255,0.1)",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
              <span style={{fontWeight:800}}>Transaction History</span>
              <div style={{display:"flex",gap:6}}>
                {[["all","All"],["credits","Credits"],["debits","Debits"],["holds","Holds"]].map(([v,l])=>(
                  <button key={v} onClick={()=>setFilter(v)} style={{padding:"5px 11px",borderRadius:7,border:`1px solid ${filter===v?"rgba(26,107,255,0.4)":"rgba(26,107,255,0.1)"}`,background:filter===v?"rgba(26,107,255,0.12)":"transparent",color:filter===v?"#4da6ff":"rgba(255,255,255,0.4)",fontSize:"0.72rem",fontWeight:600,cursor:"pointer"}}>{l}</button>
                ))}
              </div>
            </div>
            {filtered.map((tx,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"13px 18px",borderBottom:"1px solid rgba(26,107,255,0.06)"}}>
                <div style={{width:36,height:36,borderRadius:9,background:tx.type==="credit"?"rgba(0,200,83,0.1)":tx.type==="hold"?"rgba(26,107,255,0.1)":"rgba(255,255,255,0.04)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:"1rem"}}>
                  {tx.type==="credit"?"↓":tx.type==="hold"?"🔒":tx.type==="fee"?"%":"↑"}
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontWeight:600,fontSize:"0.87rem",marginBottom:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{tx.desc}</div>
                  <div style={{fontSize:"0.65rem",color:"rgba(255,255,255,0.35)",display:"flex",gap:8,flexWrap:"wrap"}}><span style={{fontFamily:"monospace"}}>{tx.id}</span><span>{tx.date}</span></div>
                </div>
                <div style={{textAlign:"right",flexShrink:0}}>
                  <div style={{fontWeight:800,color:tx.net>0?"#00e676":tx.type==="hold"?"#4da6ff":"rgba(255,200,100,0.8)",fontSize:"0.9rem"}}>{tx.net>0?"+":""}{tx.net<0&&tx.type!=="hold"?"-":""}{tx.type==="hold"?"🔒 ":""}{tx.net>0?"$"+tx.net.toLocaleString():"$"+Math.abs(tx.net).toLocaleString()}</div>
                  {tx.fee!==0&&<div style={{fontSize:"0.62rem",color:"rgba(255,255,255,0.3)"}}>Fee: ${Math.abs(tx.fee)}</div>}
                  <div style={{fontSize:"0.6rem",color:"#00e676",display:"flex",alignItems:"center",gap:3,justifyContent:"flex-end",marginTop:2}}><CheckCircle2 size={9}/>{tx.status}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Withdraw modal */}
          {showWithdraw&&(
            <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",backdropFilter:"blur(8px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:50,padding:16}}>
              <div style={{background:"rgba(4,15,36,0.99)",border:"1px solid rgba(240,192,64,0.25)",borderRadius:22,padding:28,width:"100%",maxWidth:420,color:"white"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
                  <div style={{fontWeight:900,fontSize:"1.1rem"}}>Withdraw Funds</div>
                  <button onClick={()=>setShow(false)} style={{background:"none",border:"none",color:"rgba(255,255,255,0.4)",cursor:"pointer"}}><X size={20}/></button>
                </div>
                {done?(
                  <div style={{textAlign:"center",padding:"28px 0"}}><CheckCircle2 size={48} color="#00e676" style={{margin:"0 auto 12px"}}/><div style={{fontWeight:800,fontSize:"1.1rem",marginBottom:4}}>Transfer Initiated!</div><div style={{fontSize:"0.82rem",color:"rgba(255,255,255,0.45)"}}>Expected: 1–2 business days</div></div>
                ):(
                  <>
                    <div style={{padding:"14px 16px",background:"rgba(240,192,64,0.07)",border:"1px solid rgba(240,192,64,0.18)",borderRadius:12,marginBottom:16}}>
                      <div style={{fontWeight:700,color:"#f0c040",marginBottom:2,fontSize:"0.88rem"}}>Available Balance</div>
                      <div style={{fontWeight:900,fontSize:"1.8rem",color:"#00e676"}}>${balance.toLocaleString("en-US",{minimumFractionDigits:2})}</div>
                    </div>
                    <div style={{marginBottom:12}}>
                      <label style={{fontSize:"0.68rem",fontWeight:700,color:"rgba(255,255,255,0.4)",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:5,display:"block"}}>Amount ($)</label>
                      <input value={amount} onChange={e=>setAmount(e.target.value)} type="number" placeholder="0.00" style={{width:"100%",padding:"12px 14px",background:"rgba(6,18,41,0.8)",border:"1px solid rgba(26,107,255,0.2)",borderRadius:9,color:"white",fontSize:"1.1rem",fontWeight:700,outline:"none"}}/>
                      <div style={{display:"flex",gap:6,marginTop:6}}>
                        {[100,500,1000,"All"].map(v=>(
                          <button key={v} onClick={()=>setAmount(v==="All"?String(balance):String(v))} style={{flex:1,padding:"5px",background:"rgba(26,107,255,0.07)",border:"1px solid rgba(26,107,255,0.14)",borderRadius:6,color:"rgba(255,255,255,0.5)",fontSize:"0.7rem",cursor:"pointer"}}>{v==="All"?"Max":("$"+v)}</button>
                        ))}
                      </div>
                    </div>
                    <div style={{marginBottom:16}}>
                      <label style={{fontSize:"0.68rem",fontWeight:700,color:"rgba(255,255,255,0.4)",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:5,display:"block"}}>Payout Method</label>
                      <select value={method} onChange={e=>setMethod(e.target.value)} style={{width:"100%",padding:"11px 14px",background:"rgba(6,18,41,0.8)",border:"1px solid rgba(26,107,255,0.18)",borderRadius:9,color:"white",fontSize:"0.88rem",outline:"none"}}>
                        <option value="bank">Chase Bank ••6789 (1-2 days)</option>
                        <option value="instant">Visa Debit ••4242 (Instant, 1.5% fee)</option>
                        <option value="crypto">USDC on Polygon (~5 min)</option>
                      </select>
                    </div>
                    <div style={{padding:10,background:"rgba(26,107,255,0.04)",border:"1px solid rgba(26,107,255,0.1)",borderRadius:9,fontSize:"0.72rem",color:"rgba(255,255,255,0.45)",marginBottom:14,lineHeight:1.6}}>
                      Min withdrawal: $25 · No fees for bank transfer · 1.5% fee for instant payout
                    </div>
                    <div style={{display:"flex",gap:10}}>
                      <button onClick={()=>setShow(false)} style={{flex:1,padding:"12px",borderRadius:10,border:"1px solid rgba(26,107,255,0.15)",background:"transparent",color:"rgba(255,255,255,0.5)",cursor:"pointer"}}>Cancel</button>
                      <button onClick={withdraw} disabled={!amount||withdrawing} style={{flex:2,padding:"12px",background:"linear-gradient(135deg,#d4af37,#c9a227,#a07810)",border:"none",borderRadius:10,color:"#0a0800",fontWeight:800,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:7,opacity:!amount?0.4:1}}>
                        {withdrawing?<Loader2 size={15} style={{animation:"spin 1s linear infinite"}}/>:<ArrowUp size={15}/>}{withdrawing?"Processing...":"Withdraw Now"}
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
