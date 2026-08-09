"use client";
import Sidebar from "@/components/sidebar/Sidebar";
import TopBar from "@/components/topbar/TopBar";
import { Code2, Shield, ExternalLink, Copy, CheckCheck } from "lucide-react";
import { useState } from "react";

export default function SmartContractsPage() {
  const [copied, setCopied] = useState(false);
  const contract = "0x4f3a8c21b9e04a2d8c21b9042f8a33d1e2c4b567";
  
  function copy() {
    navigator.clipboard.writeText(contract);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div style={{display:"flex",minHeight:"100vh",background:"#030d1e"}}>
      <Sidebar/>
      <div style={{flex:1,display:"flex",flexDirection:"column"}}>
        <TopBar/>
        <main style={{flex:1,padding:24,color:"white"}}>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:24}}>
            <Code2 size={28} color="#4da6ff"/>
            <h1 style={{fontSize:"1.8rem",fontWeight:900,margin:0}}>Smart Contracts</h1>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:16,maxWidth:700}}>
            {[
              {name:"VeritasTrustPassport",address:"0x4f3a8c21b9e04a2d8c21b9042f8a33d1e2c4b567",network:"Polygon Mainnet",status:"Live",desc:"Soulbound NFT representing verified worker identity and Trust Score"},
              {name:"VeritasEscrow",address:"Not yet deployed",network:"Polygon Mainnet",status:"Coming Soon",desc:"Smart escrow contract for milestone-based payments"},
            ].map((c,i)=>(
              <div key={i} style={{background:"rgba(4,15,36,0.9)",border:"1px solid rgba(26,107,255,0.14)",borderRadius:16,padding:22}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
                  <div style={{fontWeight:800,fontSize:"1rem"}}>{c.name}</div>
                  <span style={{fontSize:"0.65rem",padding:"3px 9px",borderRadius:8,fontWeight:700,
                    background:c.status==="Live"?"rgba(0,200,83,0.1)":"rgba(240,192,64,0.1)",
                    color:c.status==="Live"?"#00e676":"#f0c040"}}>{c.status}</span>
                </div>
                <div style={{fontSize:"0.8rem",color:"rgba(255,255,255,0.5)",marginBottom:12}}>{c.desc}</div>
                <div style={{display:"flex",alignItems:"center",gap:8,padding:"9px 12px",background:"rgba(6,18,41,0.8)",border:"1px solid rgba(26,107,255,0.15)",borderRadius:8,marginBottom:10}}>
                  <Shield size={13} color="#4da6ff"/>
                  <span style={{fontFamily:"monospace",fontSize:"0.75rem",color:"rgba(255,255,255,0.6)",flex:1}}>{c.address}</span>
                  {c.status==="Live"&&<button onClick={copy} style={{background:"none",border:"none",cursor:"pointer",color:"#4da6ff"}}>{copied?<CheckCheck size={13}/>:<Copy size={13}/>}</button>}
                </div>
                <div style={{fontSize:"0.72rem",color:"rgba(255,255,255,0.4)"}}>Network: {c.network}</div>
                {c.status==="Live"&&<a href={`https://polygonscan.com/address/${c.address}`} target="_blank" style={{display:"inline-flex",alignItems:"center",gap:5,marginTop:8,fontSize:"0.72rem",color:"#4da6ff"}}><ExternalLink size={11}/>View on PolygonScan</a>}
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
