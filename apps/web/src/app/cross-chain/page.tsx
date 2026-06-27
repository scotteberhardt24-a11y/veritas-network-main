
"use client";
import { useState } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import TopBar from "@/components/topbar/TopBar";
import { Globe, Wallet, ArrowRightLeft, DollarSign, CheckCircle2, Copy, CheckCheck, ExternalLink, Plus, Lock, Loader2, X, TrendingUp } from "lucide-react";

const CHAINS = [
  {id:"eth",  name:"Ethereum",  symbol:"ETH",  balance:2.847,   usd:9823.41, icon:"⟠", color:"#627EEA", pct:+2.4},
  {id:"poly", name:"Polygon",   symbol:"MATIC", balance:4210.5,  usd:3892.11, icon:"⬡", color:"#8247E5", pct:-1.2},
  {id:"arb",  name:"Arbitrum",  symbol:"ARB",  balance:842.3,   usd:1124.67, icon:"◆", color:"#28A0F0", pct:+5.7},
  {id:"base", name:"Base",      symbol:"ETH",  balance:0.412,   usd:1421.33, icon:"🔵", color:"#0052FF", pct:+2.4},
];

const TOKENS = [
  {sym:"USDC",name:"USD Coin",  bal:12450.00,usd:12450.00,icon:"💵",pct:0},
  {sym:"ETH", name:"Ethereum",  bal:2.847,   usd:9823.41, icon:"⟠", pct:+2.4},
  {sym:"MATIC",name:"Polygon",  bal:4210.5,  usd:3892.11, icon:"⬡", pct:-1.2},
  {sym:"ARB", name:"Arbitrum",  bal:842.3,   usd:1124.67, icon:"◆", pct:+5.7},
  {sym:"USDT",name:"Tether",    bal:5000.00, usd:5000.00, icon:"💰",pct:0},
];

const TXS = [
  {id:"0x1a2b...9f3d",type:"received",amount:"+$4,500.00", token:"USDC",from:"TechVentures Inc.",chain:"Polygon",time:"2h ago",  status:"confirmed"},
  {id:"0x3c4d...8e2f",type:"fee",     amount:"-$90.00",    token:"USDC",from:"Platform Fee (2%)", chain:"Polygon",time:"2h ago",  status:"confirmed"},
  {id:"0x5e6f...7d1g",type:"received",amount:"+$9,800.00", token:"USDC",from:"FinEdge Capital",  chain:"Ethereum",time:"1d ago",  status:"confirmed"},
  {id:"0x7g8h...6c0h",type:"bridge",  amount:"2.0 ETH→MATIC",token:"Multi",from:"Bridge",        chain:"Cross-chain",time:"3d ago",status:"confirmed"},
  {id:"0x9i0j...5b9i",type:"received",amount:"+$3,200.00", token:"USDC",from:"Bloom Health",     chain:"Base",   time:"5d ago",  status:"confirmed"},
];

export default function CrossChainV2Page() {
  const [connected]         = useState(true);
  const [showSend, setShowSend] = useState(false);
  const [sendAmount, setSendAmount] = useState("");
  const [sendTo, setSendTo]     = useState("");
  const [sendToken, setSendToken] = useState("USDC");
  const [sending, setSending]   = useState(false);
  const [sent, setSent]         = useState(false);
  const [copied, setCopied]     = useState(false);
  const addr = "0x742d35Cc6634C0532925a3b8D4C9F9e14a3B2c91";
  const totalUSD = TOKENS.reduce((a,t)=>a+t.usd,0);

  function copyAddr(){ navigator.clipboard.writeText(addr); setCopied(true); setTimeout(()=>setCopied(false),2000); }
  function send(){
    if(!sendAmount||!sendTo) return;
    setSending(true);
    setTimeout(()=>{setSending(false);setSent(true);setTimeout(()=>{setSent(false);setShowSend(false);setSendAmount("");setSendTo("");},2000);},1800);
  }

  return (
    <div style={{display:"flex",minHeight:"100vh",background:"#010812"}}>
      <Sidebar/>
      <div style={{flex:1,display:"flex",flexDirection:"column"}}>
        <TopBar/>
        <main style={{flex:1,overflowY:"auto",padding:24,color:"white"}}>

          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24,flexWrap:"wrap",gap:12}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <Globe size={28} color="#1a6bff"/>
              <h1 style={{fontSize:"1.8rem",fontWeight:900,margin:0}}>Crypto Wallet</h1>
            </div>
            <button onClick={()=>setShowSend(true)} style={{display:"flex",alignItems:"center",gap:7,padding:"11px 20px",background:"linear-gradient(135deg,#1a6bff,#0050dd)",border:"none",borderRadius:10,color:"white",fontWeight:700,fontSize:"0.88rem",cursor:"pointer",boxShadow:"0 3px 14px rgba(26,107,255,0.35)"}}>
              <ArrowRightLeft size={17}/> Send / Receive
            </button>
          </div>

          {/* Wallet address bar */}
          <div style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",background:"rgba(0,200,83,0.05)",border:"1px solid rgba(0,200,83,0.18)",borderRadius:12,marginBottom:18}}>
            <CheckCircle2 size={18} color="#00e676"/>
            <div style={{flex:1}}>
              <div style={{fontSize:"0.65rem",color:"rgba(255,255,255,0.38)",marginBottom:2}}>Connected Wallet</div>
              <div style={{fontFamily:"monospace",fontSize:"0.82rem",color:"rgba(255,255,255,0.7)"}}>{addr.slice(0,22)}...{addr.slice(-6)}</div>
            </div>
            <button onClick={copyAddr} style={{padding:7,background:"rgba(26,107,255,0.08)",border:"1px solid rgba(26,107,255,0.15)",borderRadius:8,cursor:"pointer"}}>
              {copied?<CheckCheck size={14} color="#00e676"/>:<Copy size={14} color="rgba(255,255,255,0.45)"/>}
            </button>
            <button style={{padding:7,background:"rgba(26,107,255,0.08)",border:"1px solid rgba(26,107,255,0.15)",borderRadius:8,cursor:"pointer"}}><ExternalLink size={14} color="rgba(255,255,255,0.45)"/></button>
          </div>

          {/* Portfolio */}
          <div style={{background:"rgba(4,15,36,0.95)",border:"1px solid rgba(26,107,255,0.18)",borderRadius:18,padding:22,marginBottom:16}}>
            <div style={{fontSize:"0.68rem",color:"rgba(255,255,255,0.38)",marginBottom:3,textTransform:"uppercase",letterSpacing:"0.08em"}}>Total Portfolio</div>
            <div style={{fontSize:"2.6rem",fontWeight:900,background:"linear-gradient(135deg,#f0c040,#c9a227)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",marginBottom:14}}>
              ${totalUSD.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:10}}>
              {TOKENS.map(t=>(
                <div key={t.sym} style={{padding:12,background:"rgba(26,107,255,0.05)",border:"1px solid rgba(26,107,255,0.1)",borderRadius:10,textAlign:"center"}}>
                  <div style={{fontSize:"1.4rem",marginBottom:4}}>{t.icon}</div>
                  <div style={{fontWeight:800,fontSize:"0.82rem",marginBottom:2}}>{t.sym}</div>
                  <div style={{fontSize:"0.7rem",color:"rgba(255,255,255,0.5)",marginBottom:4}}>{t.bal.toLocaleString()}</div>
                  <div style={{fontSize:"0.7rem",fontWeight:700,color:t.pct>0?"#00e676":t.pct<0?"#ff5555":"rgba(255,255,255,0.4)"}}>
                    {t.pct>0?"+":""}{t.pct}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chains */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:16}}>
            {CHAINS.map(c=>(
              <div key={c.id} style={{background:"rgba(4,15,36,0.9)",border:"1px solid rgba(26,107,255,0.12)",borderRadius:12,padding:14}}>
                <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8}}>
                  <span style={{fontSize:"1.2rem"}}>{c.icon}</span>
                  <span style={{fontWeight:700,fontSize:"0.82rem",color:c.color}}>{c.name}</span>
                </div>
                <div style={{fontWeight:800,fontSize:"1rem",marginBottom:2}}>{c.balance} {c.symbol}</div>
                <div style={{fontSize:"0.72rem",color:"rgba(255,255,255,0.4)"}}>${c.usd.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}</div>
              </div>
            ))}
          </div>

          {/* Transactions */}
          <div style={{background:"rgba(4,15,36,0.9)",border:"1px solid rgba(26,107,255,0.14)",borderRadius:16,overflow:"hidden"}}>
            <div style={{padding:"14px 18px",borderBottom:"1px solid rgba(26,107,255,0.1)",fontWeight:800}}>Transaction History</div>
            {TXS.map((tx,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"13px 18px",borderBottom:"1px solid rgba(26,107,255,0.06)"}}>
                <div style={{width:36,height:36,borderRadius:9,background:tx.type==="received"?"rgba(0,200,83,0.1)":tx.type==="fee"?"rgba(255,255,255,0.04)":"rgba(167,139,250,0.1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1rem",flexShrink:0}}>
                  {tx.type==="received"?"↓":tx.type==="fee"?"%":"⇄"}
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontWeight:600,fontSize:"0.85rem",marginBottom:1}}>{tx.from}</div>
                  <div style={{fontSize:"0.65rem",color:"rgba(255,255,255,0.38)",display:"flex",gap:8}}><span style={{fontFamily:"monospace"}}>{tx.id}</span><span>{tx.chain}</span><span>{tx.time}</span></div>
                </div>
                <div style={{textAlign:"right",flexShrink:0}}>
                  <div style={{fontWeight:800,fontSize:"0.9rem",color:tx.type==="received"?"#00e676":tx.type==="fee"?"rgba(255,200,100,0.7)":"#a78bfa"}}>{tx.amount}</div>
                  <div style={{fontSize:"0.62rem",color:"#00e676",display:"flex",alignItems:"center",gap:3,justifyContent:"flex-end",marginTop:2}}><CheckCircle2 size={10}/>{tx.status}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Send modal */}
          {showSend&&(
            <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",backdropFilter:"blur(8px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:50,padding:16}}>
              <div style={{background:"rgba(4,15,36,0.99)",border:"1px solid rgba(26,107,255,0.25)",borderRadius:22,padding:28,width:"100%",maxWidth:440,color:"white"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
                  <div style={{fontWeight:900,fontSize:"1.1rem"}}>Send Payment</div>
                  <button onClick={()=>setShowSend(false)} style={{background:"none",border:"none",color:"rgba(255,255,255,0.4)",cursor:"pointer"}}><X size={20}/></button>
                </div>
                {sent?(
                  <div style={{textAlign:"center",padding:"28px 0"}}>
                    <CheckCircle2 size={48} color="#00e676" style={{margin:"0 auto 12px"}}/>
                    <div style={{fontWeight:800,fontSize:"1.1rem",marginBottom:4}}>Payment Sent!</div>
                    <div style={{fontSize:"0.82rem",color:"rgba(255,255,255,0.45)"}}>Transaction submitted to network</div>
                  </div>
                ):(
                  <>
                    <div style={{display:"flex",flexDirection:"column",gap:12,marginBottom:18}}>
                      {[{l:"Token",isSelect:true},{l:"Amount",p:"0.00",type:"number"},{l:"Recipient Address or ENS",p:"0x... or name.eth"}].map((f,i)=>(
                        <div key={i}>
                          <label style={{fontSize:"0.68rem",fontWeight:700,color:"rgba(255,255,255,0.4)",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:5,display:"block"}}>{f.l}</label>
                          {f.isSelect?(
                            <select value={sendToken} onChange={e=>setSendToken(e.target.value)} style={{width:"100%",padding:"11px 14px",background:"rgba(6,18,41,0.8)",border:"1px solid rgba(26,107,255,0.18)",borderRadius:9,color:"white",fontSize:"0.88rem",outline:"none"}}>
                              {TOKENS.map(t=><option key={t.sym}>{t.sym}</option>)}
                            </select>
                          ):(
                            <input value={i===1?sendAmount:sendTo} onChange={e=>i===1?setSendAmount(e.target.value):setSendTo(e.target.value)} placeholder={f.p} type={f.type||"text"} style={{width:"100%",padding:"11px 14px",background:"rgba(6,18,41,0.8)",border:"1px solid rgba(26,107,255,0.18)",borderRadius:9,color:"white",fontSize:"0.88rem",outline:"none",fontFamily:i===2?"monospace":"inherit"}}/>
                          )}
                        </div>
                      ))}
                      <div style={{padding:10,background:"rgba(26,107,255,0.04)",border:"1px solid rgba(26,107,255,0.1)",borderRadius:9,fontSize:"0.72rem",color:"rgba(255,255,255,0.4)",lineHeight:1.55}}>
                        ⚠️ Network fee: ~$0.03 on Polygon. Transactions are irreversible once submitted.
                      </div>
                    </div>
                    <div style={{display:"flex",gap:10}}>
                      <button onClick={()=>setShowSend(false)} style={{flex:1,padding:"12px",borderRadius:10,border:"1px solid rgba(26,107,255,0.15)",background:"transparent",color:"rgba(255,255,255,0.5)",cursor:"pointer"}}>Cancel</button>
                      <button onClick={send} disabled={!sendAmount||!sendTo||sending} style={{flex:2,padding:"12px",background:"linear-gradient(135deg,#1a6bff,#0050dd)",border:"none",borderRadius:10,color:"white",fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:7,opacity:!sendAmount||!sendTo?0.4:1}}>
                        {sending?<Loader2 size={16} style={{animation:"spin 1s linear infinite"}}/>:<ArrowRightLeft size={16}/>}{sending?"Sending...":"Send"}
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
