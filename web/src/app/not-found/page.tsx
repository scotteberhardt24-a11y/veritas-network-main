
"use client";
import { useRouter } from "next/navigation";
import { VeritasEmblem } from "@/components/badges/VeritasBadges";
import { Home, ArrowLeft, Search, Shield } from "lucide-react";

export default function NotFound() {
  const router = useRouter();
  return (
    <div style={{minHeight:"100vh",background:"#010812",display:"flex",alignItems:"center",justifyContent:"center",padding:20,position:"relative"}}>
      <div style={{position:"absolute",inset:0,backgroundImage:"radial-gradient(circle,rgba(26,107,255,0.15) 1px,transparent 1px)",backgroundSize:"28px 28px",opacity:0.18}}/>
      <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse 60% 50% at 50% 40%,rgba(26,107,255,0.08) 0%,transparent 70%)"}}/>
      <div style={{position:"relative",zIndex:10,textAlign:"center",maxWidth:480,color:"white"}}>
        <div style={{display:"flex",justifyContent:"center",marginBottom:24}}><VeritasEmblem size={80}/></div>
        <div style={{fontSize:"6rem",fontWeight:900,background:"linear-gradient(135deg,#1a6bff,#00d4ff)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",lineHeight:1,marginBottom:12}}>404</div>
        <h1 style={{fontSize:"1.6rem",fontWeight:900,marginBottom:8}}>Page Not Found</h1>
        <p style={{color:"rgba(255,255,255,0.45)",marginBottom:28,lineHeight:1.7,fontSize:"0.9rem"}}>
          The page you're looking for doesn't exist or has been moved. Your Trust Score is still safe — we promise.
        </p>
        <div style={{display:"flex",justifyContent:"center",gap:12,flexWrap:"wrap"}}>
          <button onClick={()=>router.back()} style={{display:"flex",alignItems:"center",gap:7,padding:"12px 22px",background:"rgba(26,107,255,0.08)",border:"1px solid rgba(26,107,255,0.25)",borderRadius:10,color:"#4da6ff",fontWeight:600,fontSize:"0.88rem",cursor:"pointer"}}>
            <ArrowLeft size={16}/>Go Back
          </button>
          <button onClick={()=>router.push("/dashboard")} style={{display:"flex",alignItems:"center",gap:7,padding:"12px 22px",background:"linear-gradient(135deg,#1a6bff,#0050dd)",border:"none",borderRadius:10,color:"white",fontWeight:700,fontSize:"0.88rem",cursor:"pointer",boxShadow:"0 3px 14px rgba(26,107,255,0.35)"}}>
            <Home size={16}/>Dashboard
          </button>
          <button onClick={()=>router.push("/search")} style={{display:"flex",alignItems:"center",gap:7,padding:"12px 22px",background:"rgba(26,107,255,0.06)",border:"1px solid rgba(26,107,255,0.18)",borderRadius:10,color:"rgba(255,255,255,0.6)",fontWeight:600,fontSize:"0.88rem",cursor:"pointer"}}>
            <Search size={16}/>Search
          </button>
        </div>
        <div style={{marginTop:28,padding:"12px 18px",background:"rgba(26,107,255,0.04)",border:"1px solid rgba(26,107,255,0.1)",borderRadius:12,fontSize:"0.78rem",color:"rgba(255,255,255,0.35)",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
          <Shield size={12} color="rgba(26,107,255,0.5)"/>Protected by Veritas Trust Infrastructure
        </div>
      </div>
    </div>
  );
}
