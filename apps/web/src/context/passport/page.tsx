
"use client";
import { useState, useEffect } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import TopBar from "@/components/topbar/TopBar";
import { useAuth } from "@/context/AuthContext";
import { VeritasVerifiedBadge, NewMemberBadge, Jobs50Badge, FirstEscrowBadge, YearVerifiedBadge, VeritasEmblem } from "@/components/badges/VeritasBadges";
import { Shield, Copy, CheckCheck, ExternalLink, Zap, Award, Star, TrendingUp, Lock, Globe, Share2, Download, Sparkles, CheckCircle2 } from "lucide-react";

const POLYGON_SCAN = "https://polygonscan.com/token/0x4f3a8c21b9e04a2d8c21b";

export default function PassportV2Page() {
  const { user } = useAuth();
  const [copied, setCopied]     = useState(false);
  const [tab, setTab]           = useState("passport");
  const [minting, setMinting]   = useState(false);
  const [minted, setMinted]     = useState(false);
  const [tiltX, setTiltX]       = useState(0);
  const [tiltY, setTiltY]       = useState(0);

  const trustScore = user?.trustScore || 845;
  const walletAddr = "0x742d35Cc6634C0532925a3b8D4C9F9e14a3B2c91";
  const tokenId    = "VTR-00127";
  const contract   = "0x4f3a8c21b9e04a2d8c21b9042f8a33d1e2c4b567";

  const EARNED_BADGES = [
    { Comp:NewMemberBadge,      name:"New Member",    date:"Jan 2026", pts:50 },
    { Comp:FirstEscrowBadge,    name:"First Escrow",  date:"Feb 2026", pts:25 },
    { Comp:YearVerifiedBadge,   name:"1 Year",        date:"Jan 2027", pts:75 },
    { Comp:Jobs50Badge,         name:"50 Jobs",       date:"Jun 2026", pts:100},
  ];

  const STATS = [
    {label:"Trust Score",  value:trustScore, color:"#00e676", icon:"🛡️"},
    {label:"Jobs Done",    value:94,          color:"#4da6ff", icon:"💼"},
    {label:"On-Time Rate", value:"100%",      color:"#00e676", icon:"⏱️"},
    {label:"Avg Rating",   value:"5.0★",      color:"#f0c040", icon:"⭐"},
    {label:"Total Earned", value:"$182K",     color:"#00e676", icon:"💰"},
    {label:"Badges",       value:EARNED_BADGES.length, color:"#a78bfa", icon:"🏆"},
  ];

  function copyAddr() {
    navigator.clipboard.writeText(walletAddr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -20;
    setTiltX(x); setTiltY(y);
  }

  function mintNFT() {
    setMinting(true);
    setTimeout(() => { setMinting(false); setMinted(true); }, 2500);
  }

  const percentile = trustScore >= 950 ? 99 : trustScore >= 900 ? 97 : trustScore >= 850 ? 94 : trustScore >= 800 ? 90 : trustScore >= 700 ? 80 : 60;
  const tier = trustScore >= 950 ? "Elite" : trustScore >= 850 ? "Expert" : trustScore >= 700 ? "Professional" : "Verified";

  return (
    <div style={{display:"flex",minHeight:"100vh",background:"#010812"}}>
      <Sidebar/>
      <div style={{flex:1,display:"flex",flexDirection:"column"}}>
        <TopBar/>
        <main style={{flex:1,overflowY:"auto",padding:24,color:"white"}}>

          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20,flexWrap:"wrap",gap:12}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <Shield size={28} color="#1a6bff"/>
              <div>
                <h1 style={{fontSize:"1.8rem",fontWeight:900,margin:0}}>Trust Passport</h1>
                <div style={{fontSize:"0.65rem",color:"#00d4ff",letterSpacing:"0.15em",textTransform:"uppercase"}}>NFT · Soulbound · Polygon Mainnet</div>
              </div>
            </div>
            <div style={{display:"flex",gap:8}}>
              <button style={{display:"flex",alignItems:"center",gap:6,padding:"9px 14px",background:"rgba(26,107,255,0.08)",border:"1px solid rgba(26,107,255,0.2)",borderRadius:9,color:"#4da6ff",fontSize:"0.78rem",fontWeight:600,cursor:"pointer"}}><Share2 size={13}/>Share</button>
              <button style={{display:"flex",alignItems:"center",gap:6,padding:"9px 14px",background:"rgba(26,107,255,0.08)",border:"1px solid rgba(26,107,255,0.2)",borderRadius:9,color:"#4da6ff",fontSize:"0.78rem",fontWeight:600,cursor:"pointer"}}><Download size={13}/>Export</button>
            </div>
          </div>

          {/* Tabs */}
          <div style={{display:"flex",gap:2,marginBottom:20,borderBottom:"1px solid rgba(26,107,255,0.1)"}}>
            {[["passport","🛡️ Passport"],["badges","🏆 Badges"],["onchain","⛓️ On-Chain"],["history","📋 History"]].map(([t,l])=>(
              <button key={t} onClick={()=>setTab(t)} style={{padding:"10px 18px",fontSize:"0.85rem",fontWeight:600,border:"none",background:"transparent",cursor:"pointer",color:tab===t?"#4da6ff":"rgba(255,255,255,0.4)",borderBottom:tab===t?"2px solid #1a6bff":"2px solid transparent",marginBottom:-1}}>{l}</button>
            ))}
          </div>

          {/* PASSPORT TAB */}
          {tab==="passport"&&(
            <div style={{display:"grid",gridTemplateColumns:"auto 1fr",gap:24,alignItems:"start"}}>
              {/* 3D Passport Card */}
              <div
                onMouseMove={handleMouseMove}
                onMouseLeave={()=>{setTiltX(0);setTiltY(0);}}
                style={{
                  perspective:"1000px",
                  cursor:"pointer",
                  flexShrink:0,
                }}>
                <div style={{
                  width:280,
                  background:"linear-gradient(135deg,rgba(4,15,36,0.98),rgba(6,18,41,0.96))",
                  border:"1.5px solid rgba(26,107,255,0.3)",
                  borderRadius:24,
                  padding:24,
                  transform:`rotateY(${tiltX}deg) rotateX(${tiltY}deg)`,
                  transition:"transform 0.1s ease",
                  boxShadow:`0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(26,107,255,0.15), ${tiltX*2}px ${tiltY*-2}px 30px rgba(26,107,255,0.1)`,
                  position:"relative",
                  overflow:"hidden",
                }}>
                  {/* Holographic shine */}
                  <div style={{position:"absolute",inset:0,background:`linear-gradient(${135+tiltX*3}deg,transparent 40%,rgba(26,107,255,0.08) 50%,transparent 60%)`,pointerEvents:"none",borderRadius:24}}/>
                  <div style={{position:"absolute",top:0,right:0,width:120,height:120,background:"radial-gradient(ellipse,rgba(240,192,64,0.06),transparent)",borderRadius:"50%"}}/>

                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
                    <VeritasEmblem size={32}/>
                    <div style={{textAlign:"right"}}>
                      <div style={{fontSize:"0.5rem",fontWeight:600,letterSpacing:"0.2em",color:"#00d4ff",textTransform:"uppercase"}}>Soulbound NFT</div>
                      <div style={{fontFamily:"monospace",fontSize:"0.6rem",color:"rgba(255,255,255,0.4)"}}>{tokenId}</div>
                    </div>
                  </div>

                  <div style={{display:"flex",justifyContent:"center",marginBottom:14}}>
                    <VeritasVerifiedBadge score={trustScore} size={130}/>
                  </div>

                  <div style={{fontWeight:900,fontSize:"1.1rem",marginBottom:2,textAlign:"center"}}>{user?.name || "Your Name"}</div>
                  <div style={{fontSize:"0.7rem",color:"rgba(255,255,255,0.45)",textAlign:"center",marginBottom:14}}>@{user?.email?.split("@")[0] || "username"}</div>

                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6,marginBottom:12}}>
                    {[["Score",trustScore,"#00e676"],["Tier",tier,"#f0c040"],["Top",`${percentile}%`,"#4da6ff"]].map(([l,v,c],i)=>(
                      <div key={i} style={{textAlign:"center",padding:"6px",background:"rgba(26,107,255,0.08)",borderRadius:7}}>
                        <div style={{fontWeight:800,color:c,fontSize:"0.82rem",lineHeight:1,marginBottom:2}}>{v}</div>
                        <div style={{fontSize:"0.52rem",color:"rgba(255,255,255,0.35)"}}>{l}</div>
                      </div>
                    ))}
                  </div>

                  <div style={{display:"flex",alignItems:"center",gap:6,padding:"6px 10px",background:"rgba(26,107,255,0.06)",border:"1px solid rgba(26,107,255,0.14)",borderRadius:7}}>
                    <div style={{width:6,height:6,borderRadius:"50%",background:"#00e676",flexShrink:0,animation:"pulse 2s infinite"}}/>
                    <span style={{fontFamily:"monospace",fontSize:"0.6rem",color:"rgba(255,255,255,0.5)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{walletAddr.slice(0,18)}...</span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div style={{display:"flex",flexDirection:"column",gap:14}}>
                <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
                  {STATS.map((s,i)=>(
                    <div key={i} style={{background:"rgba(4,15,36,0.9)",border:"1px solid rgba(26,107,255,0.14)",borderRadius:14,padding:"16px",textAlign:"center"}}>
                      <div style={{fontSize:"1.5rem",marginBottom:4}}>{s.icon}</div>
                      <div style={{fontSize:"1.5rem",fontWeight:900,color:s.color,lineHeight:1,marginBottom:3}}>{s.value}</div>
                      <div style={{fontSize:"0.65rem",color:"rgba(255,255,255,0.4)"}}>{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* Trust Score breakdown */}
                <div style={{background:"rgba(4,15,36,0.9)",border:"1px solid rgba(26,107,255,0.14)",borderRadius:16,padding:20}}>
                  <div style={{fontWeight:800,marginBottom:14,display:"flex",alignItems:"center",gap:7}}><TrendingUp size={16} color="#00e676"/>Trust Score Breakdown</div>
                  {[
                    {label:"Job Completion",    value:94,  max:100, pts:282,  color:"#4da6ff"},
                    {label:"On-Time Delivery",  value:100, max:100, pts:200,  color:"#00e676"},
                    {label:"Client Reviews",    value:50,  max:50,  pts:150,  color:"#f0c040"},
                    {label:"Verification Level",value:3,   max:5,   pts:130,  color:"#a78bfa"},
                    {label:"Response Rate",     value:98,  max:100, pts:83,   color:"#00d4ff"},
                  ].map((s,i)=>(
                    <div key={i} style={{marginBottom:10}}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:4,fontSize:"0.78rem"}}>
                        <span style={{color:"rgba(255,255,255,0.6)"}}>{s.label}</span>
                        <span style={{color:s.color,fontWeight:700}}>+{s.pts} pts · {s.value}/{s.max}</span>
                      </div>
                      <div style={{height:5,background:"rgba(26,107,255,0.08)",borderRadius:3,overflow:"hidden"}}>
                        <div style={{width:`${(s.value/s.max)*100}%`,height:"100%",background:s.color,borderRadius:3}}/>
                      </div>
                    </div>
                  ))}
                  <div style={{marginTop:10,padding:"10px 14px",background:"rgba(0,200,83,0.06)",border:"1px solid rgba(0,200,83,0.18)",borderRadius:10,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <span style={{fontSize:"0.82rem",color:"rgba(255,255,255,0.5)"}}>Total Trust Score</span>
                    <span style={{fontWeight:900,fontSize:"1.4rem",color:"#00e676"}}>{trustScore}</span>
                  </div>
                </div>

                {/* NFT Mint */}
                {!minted?(
                  <div style={{background:"rgba(4,15,36,0.9)",border:"1px solid rgba(167,139,250,0.2)",borderRadius:16,padding:18}}>
                    <div style={{fontWeight:800,marginBottom:8,display:"flex",alignItems:"center",gap:7}}><Sparkles size={16} color="#a78bfa"/>Mint Your NFT Passport</div>
                    <p style={{fontSize:"0.8rem",color:"rgba(255,255,255,0.5)",lineHeight:1.65,marginBottom:14}}>Your Trust Passport becomes a soulbound NFT on Polygon — permanently on-chain, verifiable by anyone, portable across any platform.</p>
                    <div style={{display:"flex",gap:10,fontSize:"0.72rem",color:"rgba(255,255,255,0.4)",marginBottom:14}}>
                      <span>✓ Free to mint</span><span>✓ ~$0.01 gas on Polygon</span><span>✓ Non-transferable</span>
                    </div>
                    <button onClick={mintNFT} disabled={minting} style={{width:"100%",padding:"12px",background:"linear-gradient(135deg,#a78bfa,#7c3aed)",border:"none",borderRadius:10,color:"white",fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,boxShadow:"0 3px 14px rgba(167,139,250,0.35)"}}>
                      {minting?<><div style={{width:16,height:16,border:"2px solid rgba(255,255,255,0.3)",borderTop:"2px solid white",borderRadius:"50%",animation:"spin 1s linear infinite"}}/>Minting on Polygon...</>:<><Sparkles size={15}/>Mint NFT Passport</>}
                    </button>
                  </div>
                ):(
                  <div style={{background:"rgba(0,200,83,0.06)",border:"1px solid rgba(0,200,83,0.2)",borderRadius:16,padding:18,display:"flex",gap:12,alignItems:"center"}}>
                    <CheckCircle2 size={28} color="#00e676" style={{flexShrink:0}}/>
                    <div>
                      <div style={{fontWeight:800,color:"#00e676",marginBottom:4}}>NFT Minted Successfully!</div>
                      <div style={{fontSize:"0.78rem",color:"rgba(255,255,255,0.5)"}}>Token ID: {tokenId} · Verified on Polygon</div>
                      <a href={POLYGON_SCAN} target="_blank" style={{fontSize:"0.72rem",color:"#4da6ff",display:"flex",alignItems:"center",gap:4,marginTop:6}}><ExternalLink size={11}/>View on PolygonScan</a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* BADGES TAB */}
          {tab==="badges"&&(
            <div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:20}}>
                {EARNED_BADGES.map((b,i)=>{
                  const Comp = b.Comp as any;
                  return(
                    <div key={i} style={{background:"rgba(4,15,36,0.95)",border:"1px solid rgba(240,192,64,0.18)",borderRadius:16,padding:18,textAlign:"center"}}>
                      <div style={{display:"flex",justifyContent:"center",marginBottom:10}}><Comp size={90}/></div>
                      <div style={{fontWeight:800,fontSize:"0.88rem",marginBottom:3}}>{b.name}</div>
                      <div style={{fontSize:"0.68rem",color:"rgba(255,255,255,0.38)",marginBottom:6}}>Earned {b.date}</div>
                      <div style={{fontSize:"0.7rem",color:"#00e676",fontWeight:700}}>+{b.pts} Trust Score</div>
                    </div>
                  );
                })}
              </div>
              <div style={{background:"rgba(4,15,36,0.9)",border:"1px solid rgba(26,107,255,0.14)",borderRadius:14,padding:16}}>
                <div style={{fontWeight:700,marginBottom:10,fontSize:"0.88rem",color:"rgba(255,255,255,0.5)"}}>🔒 Locked Badges — Keep building to unlock</div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}}>
                  {[["Jobs 100","Complete 100 jobs","100 jobs"],["Escrow Master","50 escrow contracts","50 escrows"],["Top Score","Top 10% globally","Score 900+"],["Elite Verified","All verifications","5 verifications"]].map(([n,d,req],i)=>(
                    <div key={i} style={{padding:14,background:"rgba(26,107,255,0.03)",border:"1px solid rgba(26,107,255,0.08)",borderRadius:12,textAlign:"center",opacity:0.5}}>
                      <Lock size={24} color="rgba(255,255,255,0.2)" style={{margin:"0 auto 8px"}}/>
                      <div style={{fontWeight:700,fontSize:"0.8rem",marginBottom:3}}>{n}</div>
                      <div style={{fontSize:"0.65rem",color:"rgba(255,255,255,0.35)",marginBottom:4}}>{d}</div>
                      <div style={{fontSize:"0.62rem",color:"#4da6ff",fontWeight:600}}>{req}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ON-CHAIN TAB */}
          {tab==="onchain"&&(
            <div style={{maxWidth:640,display:"flex",flexDirection:"column",gap:14}}>
              <div style={{background:"rgba(4,15,36,0.95)",border:"1px solid rgba(167,139,250,0.2)",borderRadius:16,padding:20}}>
                <div style={{fontWeight:800,marginBottom:14,display:"flex",alignItems:"center",gap:7}}><Globe size={16} color="#a78bfa"/>Blockchain Details</div>
                {[
                  ["Network","Polygon Mainnet"],
                  ["Contract",contract.slice(0,20)+"..."],
                  ["Token ID",tokenId],
                  ["Token Type","ERC-721 Soulbound (non-transferable)"],
                  ["Wallet",walletAddr.slice(0,20)+"..."],
                  ["Minted","Jun 1, 2026"],
                  ["Last Updated","Jun 28, 2026"],
                ].map(([l,v],i)=>(
                  <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"9px 0",borderBottom:"1px solid rgba(26,107,255,0.06)",fontSize:"0.82rem"}}>
                    <span style={{color:"rgba(255,255,255,0.45)"}}>{l}</span>
                    <span style={{fontFamily:"monospace",color:"rgba(255,255,255,0.75)",fontWeight:600}}>{v}</span>
                  </div>
                ))}
              </div>

              <div style={{display:"flex",gap:8,alignItems:"center",padding:"11px 14px",background:"rgba(6,18,41,0.8)",border:"1px solid rgba(26,107,255,0.18)",borderRadius:10}}>
                <span style={{fontFamily:"monospace",fontSize:"0.78rem",color:"rgba(255,255,255,0.6)",flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{walletAddr}</span>
                <button onClick={copyAddr} style={{display:"flex",alignItems:"center",gap:4,padding:"6px 10px",background:"rgba(26,107,255,0.1)",border:"1px solid rgba(26,107,255,0.2)",borderRadius:7,color:"#4da6ff",fontSize:"0.72rem",cursor:"pointer",flexShrink:0}}>
                  {copied?<CheckCheck size={12}/>:<Copy size={12}/>}{copied?"Copied!":"Copy"}
                </button>
                <a href={POLYGON_SCAN} target="_blank" style={{padding:"6px 10px",background:"rgba(26,107,255,0.1)",border:"1px solid rgba(26,107,255,0.2)",borderRadius:7,color:"#4da6ff",display:"flex",alignItems:"center"}}>
                  <ExternalLink size={12}/>
                </a>
              </div>

              <div style={{padding:14,background:"rgba(0,200,83,0.05)",border:"1px solid rgba(0,200,83,0.15)",borderRadius:12,fontSize:"0.78rem",color:"rgba(255,255,255,0.5)",lineHeight:1.65}}>
                <strong style={{color:"#00e676"}}>🔒 Soulbound means non-transferable.</strong> Your Trust Passport is permanently tied to your identity. It cannot be sold, transferred, or faked — making it the most trustworthy credential in the gig economy.
              </div>
            </div>
          )}

          {/* HISTORY TAB */}
          {tab==="history"&&(
            <div style={{maxWidth:640}}>
              <div style={{background:"rgba(4,15,36,0.9)",border:"1px solid rgba(26,107,255,0.14)",borderRadius:16,overflow:"hidden"}}>
                <div style={{padding:"12px 16px",borderBottom:"1px solid rgba(26,107,255,0.08)",fontWeight:700,fontSize:"0.88rem"}}>Score History</div>
                {[
                  {event:"Completed job — TechVentures Milestone 3",change:"+3",score:845,date:"Jun 28"},
                  {event:"5-star review received from Brian Walsh",  change:"+2",score:842,date:"Jun 27"},
                  {event:"50 Jobs badge earned",                     change:"+5",score:840,date:"Jun 20"},
                  {event:"Completed job — GreenLeaf Brand Identity", change:"+3",score:835,date:"Jun 14"},
                  {event:"Identity verification completed",           change:"+10",score:832,date:"Jun 1"},
                  {event:"Account created — New Member badge",       change:"+50",score:822,date:"Jan 1"},
                ].map((h,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",borderBottom:"1px solid rgba(26,107,255,0.05)"}}>
                    <div style={{width:36,height:36,borderRadius:9,background:"rgba(0,200,83,0.1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1rem",flexShrink:0}}>📈</div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontWeight:600,fontSize:"0.82rem",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{h.event}</div>
                      <div style={{fontSize:"0.65rem",color:"rgba(255,255,255,0.35)"}}>{h.date}</div>
                    </div>
                    <div style={{textAlign:"right",flexShrink:0}}>
                      <div style={{fontWeight:800,color:"#00e676",fontSize:"0.88rem"}}>{h.change}</div>
                      <div style={{fontSize:"0.65rem",color:"rgba(255,255,255,0.45)"}}>{h.score} total</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}`}</style>
        </main>
      </div>
    </div>
  );
}
