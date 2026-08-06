"use client";
export const dynamic = "force-dynamic";
import { useState } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import TopBar from "@/components/topbar/TopBar";
import { useAuth } from "@/context/AuthContext";
import { VeritasVerifiedBadge, VeritasEmblem } from "@/components/badges/VeritasBadges";
import { Shield, Copy, CheckCheck, Globe, ExternalLink, Sparkles, CheckCircle2, Lock } from "lucide-react";

const BADGE_DATA = [
  { id:"new-member",    name:"New Member",      desc:"Joined Veritas Network",                   pts:50,  earned:true,  icon:"🌟" },
  { id:"first-escrow",  name:"First Escrow",    desc:"Completed first escrow contract",          pts:25,  earned:true,  icon:"🔒" },
  { id:"jobs-50",       name:"50 Jobs",         desc:"Completed 50 jobs with 90%+ success rate", pts:100, earned:false, icon:"💼" },
  { id:"jobs-100",      name:"100 Jobs",        desc:"Top 8% milestone",                         pts:200, earned:false, icon:"🏆" },
  { id:"escrow-master", name:"Escrow Master",   desc:"50+ escrow contracts at 98%+ release rate",pts:150, earned:false, icon:"🏦" },
  { id:"year-verified", name:"1 Year Verified", desc:"Remained a verified member for 1 year",    pts:75,  earned:false, icon:"📅" },
  { id:"top-trust",     name:"Top Trust Score", desc:"Trust Score in the global top 10%",        pts:200, earned:false, icon:"👑" },
];

export default function PassportPage() {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [tab, setTab] = useState("passport");
  const [minting, setMinting] = useState(false);
  const [minted, setMinted] = useState(false);

  const score = user?.trustScore || 845;
  const tier = score >= 950 ? "ELITE" : score >= 850 ? "EXPERT" : score >= 700 ? "PRO" : "VERIFIED";
  const wallet = "0x742d35Cc6634C0532925a3b8D4C9F9e14a3B2c91";

  function copy() {
    navigator.clipboard.writeText(wallet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:"#030d1e" }}>
      <Sidebar/>
      <div style={{ flex:1, display:"flex", flexDirection:"column" }}>
        <TopBar/>
        <main style={{ flex:1, overflowY:"auto", padding:24, color:"white" }}>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
            <Shield size={28} color="#1a6bff"/>
            <div>
              <h1 style={{ fontSize:"1.8rem", fontWeight:900, margin:0 }}>Trust Passport</h1>
              <div style={{ fontSize:"0.65rem", color:"#00d4ff", letterSpacing:"0.15em", textTransform:"uppercase" }}>NFT · Soulbound · Polygon Mainnet</div>
            </div>
          </div>

          <div style={{ display:"flex", gap:2, marginBottom:20, borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
            {[["passport","🛡️ Passport"],["badges","🏆 Badges"],["onchain","⛓️ On-Chain"]].map(([t,l])=>(
              <button key={t} onClick={()=>setTab(t)} style={{ padding:"10px 18px", fontSize:"0.85rem", fontWeight:600, border:"none", background:"transparent", cursor:"pointer", color:tab===t?"#4da6ff":"rgba(255,255,255,0.4)", borderBottom:tab===t?"2px solid #1a6bff":"2px solid transparent", marginBottom:-1 }}>{l}</button>
            ))}
          </div>

          {tab==="passport" && (
            <div style={{ display:"grid", gridTemplateColumns:"auto 1fr", gap:24, alignItems:"start" }}>
              <VeritasVerifiedBadge score={score} size={200}/>
              <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:16, padding:20 }}>
                  <div style={{ fontWeight:900, fontSize:"1.3rem", marginBottom:4 }}>{user?.email?.split("@")[0] || "Your Name"}</div>
                  <div style={{ fontSize:"0.82rem", color:"rgba(255,255,255,0.5)", marginBottom:12 }}>@{user?.email?.split("@")[0] || "username"}</div>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginBottom:14 }}>
                    {[["Trust Score",score,"#00e676"],["Tier",tier,"#f0c040"],["Top","6%","#4da6ff"]].map(([l,v,c],i)=>(
                      <div key={i} style={{ padding:12, background:"rgba(26,107,255,0.06)", border:"1px solid rgba(26,107,255,0.14)", borderRadius:10, textAlign:"center" }}>
                        <div style={{ fontWeight:900, color:c as string, fontSize:"1.1rem", marginBottom:2 }}>{v}</div>
                        <div style={{ fontSize:"0.6rem", color:"rgba(255,255,255,0.4)" }}>{l}</div>
                      </div>
                    ))}
                  </div>
                </div>
                {!minted ? (
                  <div style={{ background:"rgba(4,15,36,0.9)", border:"1px solid rgba(167,139,250,0.2)", borderRadius:14, padding:18 }}>
                    <div style={{ fontWeight:800, marginBottom:8, display:"flex", alignItems:"center", gap:7 }}><Sparkles size={16} color="#a78bfa"/>Mint Your NFT Passport</div>
                    <p style={{ fontSize:"0.8rem", color:"rgba(255,255,255,0.5)", lineHeight:1.65, marginBottom:14 }}>Your Trust Passport becomes a soulbound NFT on Polygon — permanently on-chain, verifiable by anyone.</p>
                    <button onClick={()=>{setMinting(true);setTimeout(()=>{setMinting(false);setMinted(true);},2000);}} disabled={minting} style={{ width:"100%", padding:"12px", background:"linear-gradient(135deg,#a78bfa,#7c3aed)", border:"none", borderRadius:10, color:"white", fontWeight:700, cursor:"pointer" }}>
                      {minting?"Minting on Polygon...":"Mint NFT Passport"}
                    </button>
                  </div>
                ) : (
                  <div style={{ padding:16, background:"rgba(0,200,83,0.06)", border:"1px solid rgba(0,200,83,0.2)", borderRadius:14, display:"flex", gap:10, alignItems:"center" }}>
                    <CheckCircle2 size={24} color="#00e676"/>
                    <div>
                      <div style={{ fontWeight:800, color:"#00e676" }}>NFT Minted!</div>
                      <div style={{ fontSize:"0.75rem", color:"rgba(255,255,255,0.5)" }}>Verified on Polygon Mainnet</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {tab==="badges" && (
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14 }}>
              {BADGE_DATA.map((b,i)=>(
                <div key={i} style={{ background:"rgba(4,15,36,0.9)", border:`1px solid ${b.earned?"rgba(212,175,55,0.25)":"rgba(26,107,255,0.1)"}`, borderRadius:16, padding:18, textAlign:"center", opacity:b.earned?1:0.5 }}>
                  <div style={{ fontSize:"2.5rem", marginBottom:10 }}>{b.icon}</div>
                  {!b.earned && <Lock size={16} color="rgba(255,255,255,0.3)" style={{ margin:"0 auto 8px" }}/>}
                  <div style={{ fontWeight:800, fontSize:"0.88rem", marginBottom:4 }}>{b.name}</div>
                  <div style={{ fontSize:"0.7rem", color:"rgba(255,255,255,0.45)", lineHeight:1.5, marginBottom:6 }}>{b.desc}</div>
                  <div style={{ fontSize:"0.68rem", color:b.earned?"#00e676":"rgba(255,255,255,0.3)", fontWeight:700 }}>+{b.pts} pts</div>
                </div>
              ))}
            </div>
          )}

          {tab==="onchain" && (
            <div style={{ maxWidth:580, display:"flex", flexDirection:"column", gap:12 }}>
              <div style={{ background:"rgba(4,15,36,0.9)", border:"1px solid rgba(167,139,250,0.2)", borderRadius:16, padding:20 }}>
                <div style={{ fontWeight:800, marginBottom:14, display:"flex", alignItems:"center", gap:7 }}><Globe size={16} color="#a78bfa"/>Blockchain Details</div>
                {[["Network","Polygon Mainnet"],["Token Type","ERC-721 Soulbound"],["Status","Not yet minted"],["Contract","Deploy contract to enable"]].map(([l,v],i)=>(
                  <div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"9px 0", borderBottom:"1px solid rgba(26,107,255,0.06)", fontSize:"0.82rem" }}>
                    <span style={{ color:"rgba(255,255,255,0.45)" }}>{l}</span>
                    <span style={{ fontFamily:"monospace", color:"rgba(255,255,255,0.75)" }}>{v}</span>
                  </div>
                ))}
              </div>
              <div style={{ display:"flex", gap:8, padding:"11px 14px", background:"rgba(6,18,41,0.8)", border:"1px solid rgba(26,107,255,0.18)", borderRadius:10 }}>
                <span style={{ fontFamily:"monospace", fontSize:"0.78rem", color:"rgba(255,255,255,0.6)", flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{wallet}</span>
                <button onClick={copy} style={{ display:"flex", alignItems:"center", gap:4, padding:"5px 10px", background:"rgba(26,107,255,0.1)", border:"1px solid rgba(26,107,255,0.2)", borderRadius:7, color:"#4da6ff", fontSize:"0.72rem", cursor:"pointer" }}>
                  {copied?<CheckCheck size={12}/>:<Copy size={12}/>}{copied?"Copied!":"Copy"}
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
