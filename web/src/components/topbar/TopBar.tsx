"use client";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Bell, Search, LogOut, ChevronDown, Shield, Settings, User, Zap } from "lucide-react";

export default function TopBar() {
  const { user, logout } = useAuth();
  const router   = useRouter();
  const pathname = usePathname();
  const [showMenu, setShowMenu] = useState(false);
  const [search, setSearch]     = useState("");

  const trustScore = user?.trustScore || 50;
  const tier = trustScore >= 950 ? "ELITE" : trustScore >= 850 ? "EXPERT" : trustScore >= 700 ? "PRO" : "VERIFIED";
  const tierColor = trustScore >= 950 ? "#f0c040" : trustScore >= 850 ? "#4da6ff" : trustScore >= 700 ? "#a78bfa" : "#00e676";

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (search.trim()) router.push(`/search?q=${encodeURIComponent(search.trim())}`);
  }

  return (
    <div style={{
      height: 56, background: "rgba(3,13,30,0.98)",
      borderBottom: "1px solid rgba(255,255,255,0.06)",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 20px", flexShrink: 0,
      backdropFilter: "blur(20px)", position: "sticky", top: 0, zIndex: 30,
    }}>
      {/* Search */}
      <form onSubmit={handleSearch} style={{ position:"relative", flex:1, maxWidth:360 }}>
        <Search size={14} style={{ position:"absolute", left:11, top:"50%", transform:"translateY(-50%)", color:"rgba(255,255,255,0.3)" }}/>
        <input
          value={search} onChange={e=>setSearch(e.target.value)}
          placeholder="Search jobs, workers, contracts..."
          style={{ width:"100%", padding:"7px 12px 7px 32px", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:9, color:"white", fontSize:"0.82rem", outline:"none" }}
        />
      </form>

      {/* Right side */}
      <div style={{ display:"flex", alignItems:"center", gap:10 }}>

        {/* AI Match indicator */}
        <div onClick={()=>router.push("/ai-match")} style={{ display:"flex", alignItems:"center", gap:6, padding:"5px 11px", background:"rgba(240,192,64,0.08)", border:"1px solid rgba(240,192,64,0.18)", borderRadius:20, cursor:"pointer", transition:"all 0.2s" }}
          onMouseEnter={e=>(e.currentTarget as HTMLDivElement).style.background="rgba(240,192,64,0.14)"}
          onMouseLeave={e=>(e.currentTarget as HTMLDivElement).style.background="rgba(240,192,64,0.08)"}>
          <Zap size={12} color="#f0c040"/>
          <span style={{ fontSize:"0.68rem", fontWeight:700, color:"#f0c040" }}>14 Matches</span>
        </div>

        {/* Trust Score pill */}
        {user && (
          <div style={{ display:"flex", alignItems:"center", gap:6, padding:"5px 11px", background:`${tierColor}12`, border:`1px solid ${tierColor}30`, borderRadius:20 }}>
            <Shield size={12} color={tierColor}/>
            <span style={{ fontSize:"0.72rem", fontWeight:800, color:tierColor }}>{trustScore}</span>
            <span style={{ fontSize:"0.6rem", color:`${tierColor}88`, fontWeight:600 }}>{tier}</span>
          </div>
        )}

        {/* Notifications */}
        <button onClick={()=>router.push("/notifications")} style={{ width:34, height:34, borderRadius:9, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", position:"relative", transition:"all 0.2s" }}
          onMouseEnter={e=>(e.currentTarget as HTMLButtonElement).style.background="rgba(255,255,255,0.08)"}
          onMouseLeave={e=>(e.currentTarget as HTMLButtonElement).style.background="rgba(255,255,255,0.04)"}>
          <Bell size={15} color="rgba(255,255,255,0.5)"/>
          <div style={{ position:"absolute", top:7, right:7, width:6, height:6, borderRadius:"50%", background:"#f0c040", border:"1.5px solid rgba(3,13,30,0.98)" }}/>
        </button>

        {/* User menu */}
        <div style={{ position:"relative" }}>
          <button onClick={()=>setShowMenu(!showMenu)} style={{ display:"flex", alignItems:"center", gap:8, padding:"5px 10px", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:9, cursor:"pointer", color:"white", transition:"all 0.2s" }}
            onMouseEnter={e=>(e.currentTarget as HTMLButtonElement).style.background="rgba(255,255,255,0.08)"}
            onMouseLeave={e=>(e.currentTarget as HTMLButtonElement).style.background="rgba(255,255,255,0.04)"}>
            <div style={{ width:26, height:26, borderRadius:7, background:"linear-gradient(135deg,#1a4a9e,#0d2d6b)", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:"0.78rem", border:"1px solid rgba(26,107,255,0.3)" }}>
              {user?.username?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "V"}
            </div>
            <span style={{ fontSize:"0.78rem", fontWeight:600, color:"rgba(255,255,255,0.8)", maxWidth:90, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
              {user?.username || user?.email?.split("@")[0] || "Account"}
            </span>
            <ChevronDown size={12} color="rgba(255,255,255,0.4)" style={{ transform:showMenu?"rotate(180deg)":"rotate(0)", transition:"transform 0.2s" }}/>
          </button>

          {showMenu && (
            <>
              <div onClick={()=>setShowMenu(false)} style={{ position:"fixed", inset:0, zIndex:40 }}/>
              <div style={{ position:"absolute", right:0, top:"calc(100% + 6px)", background:"rgba(4,15,36,0.99)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:12, padding:6, minWidth:180, zIndex:50, boxShadow:"0 12px 40px rgba(0,0,0,0.5)" }}>
                {/* User info */}
                <div style={{ padding:"10px 12px", borderBottom:"1px solid rgba(255,255,255,0.06)", marginBottom:4 }}>
                  <div style={{ fontWeight:700, fontSize:"0.82rem", color:"white" }}>{user?.username || "Account"}</div>
                  <div style={{ fontSize:"0.65rem", color:"rgba(255,255,255,0.4)" }}>{user?.email}</div>
                </div>
                {[
                  { label:"Dashboard",    icon:<User size={13}/>,     action:()=>router.push("/dashboard") },
                  { label:"Passport",     icon:<Shield size={13}/>,   action:()=>router.push("/passport")  },
                  { label:"Settings",     icon:<Settings size={13}/>, action:()=>router.push("/settings")  },
                ].map((item,i)=>(
                  <button key={i} onClick={()=>{item.action();setShowMenu(false);}}
                    style={{ width:"100%", padding:"8px 12px", background:"transparent", border:"none", borderRadius:8, color:"rgba(255,255,255,0.7)", fontSize:"0.8rem", cursor:"pointer", textAlign:"left", display:"flex", alignItems:"center", gap:9, transition:"all 0.15s" }}
                    onMouseEnter={e=>(e.currentTarget as HTMLButtonElement).style.background="rgba(26,107,255,0.1)"}
                    onMouseLeave={e=>(e.currentTarget as HTMLButtonElement).style.background="transparent"}>
                    <span style={{ color:"#4da6ff" }}>{item.icon}</span>{item.label}
                  </button>
                ))}
                <div style={{ height:1, background:"rgba(255,255,255,0.06)", margin:"4px 0" }}/>
                <button onClick={()=>{logout();setShowMenu(false);}}
                  style={{ width:"100%", padding:"8px 12px", background:"transparent", border:"none", borderRadius:8, color:"rgba(255,100,100,0.8)", fontSize:"0.8rem", cursor:"pointer", textAlign:"left", display:"flex", alignItems:"center", gap:9, transition:"all 0.15s" }}
                  onMouseEnter={e=>(e.currentTarget as HTMLButtonElement).style.background="rgba(255,85,85,0.08)"}
                  onMouseLeave={e=>(e.currentTarget as HTMLButtonElement).style.background="transparent"}>
                  <LogOut size={13}/> Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
