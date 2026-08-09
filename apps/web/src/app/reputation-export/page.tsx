"use client";
import Sidebar from "@/components/sidebar/Sidebar";
import TopBar from "@/components/topbar/TopBar";
import { useAuth } from "@/context/AuthContext";
import { Globe, Download, Copy, CheckCheck, Shield } from "lucide-react";
import { useState } from "react";

export default function ReputationExportPage() {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const apiUrl = `https://splendid-enjoyment-production-910a.up.railway.app/api/passport/metadata/${user?.username || "username"}`;

  function copy() {
    navigator.clipboard.writeText(apiUrl);
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
            <Globe size={28} color="#4da6ff"/>
            <h1 style={{fontSize:"1.8rem",fontWeight:900,margin:0}}>Export Reputation</h1>
          </div>
          <div style={{maxWidth:640,display:"flex",flexDirection:"column",gap:16}}>
            <div style={{background:"rgba(4,15,36,0.9)",border:"1px solid rgba(26,107,255,0.14)",borderRadius:16,padding:22}}>
              <div style={{fontWeight:800,marginBottom:8,display:"flex",alignItems:"center",gap:7}}><Shield size={15} color="#4da6ff"/>Public API Endpoint</div>
              <p style={{fontSize:"0.82rem",color:"rgba(255,255,255,0.5)",marginBottom:14,lineHeight:1.65}}>Share your verified Trust Score and badges with any platform using this public API URL.</p>
              <div style={{display:"flex",alignItems:"center",gap:8,padding:"10px 14px",background:"rgba(6,18,41,0.8)",border:"1px solid rgba(26,107,255,0.18)",borderRadius:9,marginBottom:12}}>
                <span style={{fontFamily:"monospace",fontSize:"0.72rem",color:"rgba(255,255,255,0.6)",flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{apiUrl}</span>
                <button onClick={copy} style={{display:"flex",alignItems:"center",gap:4,padding:"5px 10px",background:"rgba(26,107,255,0.1)",border:"1px solid rgba(26,107,255,0.2)",borderRadius:7,color:"#4da6ff",fontSize:"0.72rem",cursor:"pointer",flexShrink:0}}>
                  {copied?<CheckCheck size={12}/>:<Copy size={12}/>}{copied?"Copied!":"Copy"}
                </button>
              </div>
            </div>
            <div style={{background:"rgba(4,15,36,0.9)",border:"1px solid rgba(26,107,255,0.14)",borderRadius:16,padding:22}}>
              <div style={{fontWeight:800,marginBottom:12}}>Export Formats</div>
              {[["JSON Badge","Machine-readable Trust Score + badges","Download JSON"],["PDF Certificate","Printable verification certificate","Download PDF"],["NFT Metadata","OpenSea-compatible metadata","View Metadata"]].map(([t,d,a],i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 0",borderBottom:i<2?"1px solid rgba(26,107,255,0.06)":"none"}}>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:700,fontSize:"0.88rem"}}>{t}</div>
                    <div style={{fontSize:"0.72rem",color:"rgba(255,255,255,0.4)"}}>{d}</div>
                  </div>
                  <button style={{padding:"7px 14px",background:"rgba(26,107,255,0.08)",border:"1px solid rgba(26,107,255,0.2)",borderRadius:8,color:"#4da6ff",fontSize:"0.75rem",fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",gap:5}}><Download size={12}/>{a}</button>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
