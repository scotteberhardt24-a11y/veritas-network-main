
"use client";
import { useRouter } from "next/navigation";
import { Bell, Search, Shield, ChevronDown } from "lucide-react";

export default function TopBar() {
  const router = useRouter();
  return (
    <div style={{
      height:60, background:"rgba(2,13,31,0.97)",
      borderBottom:"1px solid rgba(26,107,255,0.1)",
      backdropFilter:"blur(20px)", display:"flex",
      alignItems:"center", padding:"0 24px", gap:16,
      position:"sticky", top:0, zIndex:40, flexShrink:0,
    }}>
      {/* Search */}
      <div style={{flex:1,maxWidth:420,position:"relative"}}>
        <Search size={14} style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:"rgba(255,255,255,0.3)"}}/>
        <input placeholder="Search jobs, workers, contracts..." style={{
          width:"100%", background:"rgba(26,107,255,0.06)",
          border:"1px solid rgba(26,107,255,0.15)", borderRadius:8,
          padding:"8px 12px 8px 34px", color:"white", fontSize:"0.82rem",
          outline:"none",
        }}/>
      </div>

      <div style={{flex:1}}/>

      {/* Notifications */}
      <button style={{position:"relative",width:36,height:36,borderRadius:8,background:"rgba(26,107,255,0.08)",border:"1px solid rgba(26,107,255,0.15)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
        <Bell size={16} color="rgba(255,255,255,0.6)"/>
        <span style={{position:"absolute",top:6,right:6,width:7,height:7,borderRadius:"50%",background:"#ff3333",border:"1.5px solid #020d1f"}}/>
      </button>

      {/* Profile */}
      <button style={{display:"flex",alignItems:"center",gap:8,padding:"6px 10px",background:"rgba(26,107,255,0.08)",border:"1px solid rgba(26,107,255,0.15)",borderRadius:8,cursor:"pointer"}}>
        <div style={{width:26,height:26,borderRadius:6,background:"linear-gradient(135deg,#1a3a6b,#0d1f3d)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.9rem"}}>👷</div>
        <div style={{textAlign:"left"}}>
          <div style={{fontSize:"0.75rem",fontWeight:700,color:"white"}}>Scott E.</div>
          <div style={{fontSize:"0.6rem",color:"#00e676",fontWeight:700}}>Score: 845</div>
        </div>
        <ChevronDown size={12} color="rgba(255,255,255,0.4)"/>
      </button>
    </div>
  );
}
