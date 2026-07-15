"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Bell, Search, LogOut, ChevronDown, Shield } from "lucide-react";

export default function TopBar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div style={{height:56,background:"rgba(2,10,24,0.98)",borderBottom:"1px solid rgba(26,107,255,0.1)",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 20px",flexShrink:0,backdropFilter:"blur(20px)",position:"sticky",top:0,zIndex:30}}>
      <div style={{position:"relative",flex:1,maxWidth:340}}>
        <Search size={14} style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:"rgba(255,255,255,0.3)"}}/>
        <input placeholder="Search..." style={{width:"100%",padding:"7px 12px 7px 32px",background:"rgba(26,107,255,0.06)",border:"1px solid rgba(26,107,255,0.14)",borderRadius:8,color:"white",fontSize:"0.82rem",outline:"none"}}/>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        {user&&(
          <div style={{display:"flex",alignItems:"center",gap:6,padding:"5px 10px",background:"rgba(0,200,83,0.08)",border:"1px solid rgba(0,200,83,0.2)",borderRadius:8}}>
            <Shield size={13} color="#00e676"/>
            <span style={{fontSize:"0.78rem",fontWeight:700,color:"#00e676"}}>{user.trustScore||50}</span>
          </div>
        )}
        <button onClick={()=>router.push("/notifications")} style={{width:34,height:34,borderRadius:8,background:"rgba(26,107,255,0.06)",border:"1px solid rgba(26,107,255,0.14)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",position:"relative"}}>
          <Bell size={15} color="rgba(255,255,255,0.5)"/>
          <div style={{position:"absolute",top:6,right:6,width:6,height:6,borderRadius:"50%",background:"#f0c040"}}/>
        </button>
        <div style={{position:"relative"}}>
          <button onClick={()=>setShowMenu(!showMenu)} style={{display:"flex",alignItems:"center",gap:8,padding:"5px 10px",background:"rgba(26,107,255,0.06)",border:"1px solid rgba(26,107,255,0.14)",borderRadius:8,cursor:"pointer",color:"white"}}>
            <div style={{width:24,height:24,borderRadius:6,background:"linear-gradient(135deg,#1a3a6b,#0d1f3d)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:"0.72rem"}}>
              {user?.name?.[0]||user?.email?.[0]?.toUpperCase()||"V"}
            </div>
            <span style={{fontSize:"0.78rem",fontWeight:600,color:"rgba(255,255,255,0.8)",maxWidth:100,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
              {user?.name||user?.email?.split("@")[0]||"Account"}
            </span>
            <ChevronDown size={13} color="rgba(255,255,255,0.4)"/>
          </button>
          {showMenu&&(
            <div style={{position:"absolute",right:0,top:"calc(100% + 6px)",background:"rgba(4,15,36,0.99)",border:"1px solid rgba(26,107,255,0.2)",borderRadius:10,padding:6,minWidth:160,zIndex:50,boxShadow:"0 8px 32px rgba(0,0,0,0.4)"}}>
              {[{label:"Dashboard",action:()=>router.push("/dashboard")},{label:"Settings",action:()=>router.push("/settings")},{label:"Sign Out",action:logout,danger:true}].map((item,i)=>(
                <button key={i} onClick={()=>{item.action();setShowMenu(false);}} style={{width:"100%",padding:"8px 12px",background:"transparent",border:"none",borderRadius:7,color:(item as any).danger?"#ff7777":"rgba(255,255,255,0.7)",fontSize:"0.8rem",cursor:"pointer",textAlign:"left",display:"flex",alignItems:"center",gap:8}}
                  onMouseEnter={e=>(e.currentTarget as HTMLButtonElement).style.background="rgba(26,107,255,0.08)"}
                  onMouseLeave={e=>(e.currentTarget as HTMLButtonElement).style.background="transparent"}>
                  {item.label==="Sign Out"&&<LogOut size={13}/>}{item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
