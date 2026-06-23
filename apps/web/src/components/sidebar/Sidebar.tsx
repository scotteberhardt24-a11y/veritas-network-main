
"use client";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Briefcase, MessageSquare, Shield, DollarSign,
  Trophy, Users, Bot, FileText, BarChart3, Settings, Bell,
  Gift, Globe, Building2, Vote, Wallet, Search, Zap, LogOut,
  Clock, Receipt, Image as ImageIcon,
} from "lucide-react";

const NAV = [
  { section: "MAIN" },
  { href:"/dashboard",     icon:LayoutDashboard, label:"Dashboard"       },
  { href:"/feed",          icon:Zap,             label:"Activity Feed"   },
  { href:"/notifications", icon:Bell,            label:"Notifications"   },

  { section: "WORK" },
  { href:"/jobs",          icon:Briefcase,       label:"Job Marketplace" },
  { href:"/marketplace",   icon:Users,           label:"Find Talent"     },
  { href:"/proposals",     icon:FileText,        label:"Proposals"       },
  { href:"/contracts",     icon:FileText,        label:"Contracts"       },
  { href:"/messages",      icon:MessageSquare,   label:"Messages"        },

  { section: "FINANCE" },
  { href:"/escrow",        icon:DollarSign,      label:"Escrow Vault"    },
  { href:"/vault",         icon:Wallet,          label:"Wallet"          },
  { href:"/invoices",      icon:Receipt,         label:"Invoices"        },
  { href:"/time-tracker",  icon:Clock,           label:"Time Tracker"    },

  { section: "TRUST" },
  { href:"/passport",      icon:Shield,          label:"Trust Passport"  },
  { href:"/leaderboard",   icon:Trophy,          label:"Leaderboard"     },
  { href:"/verify",        icon:Shield,          label:"Get Verified"    },

  { section: "AI & WEB3" },
  { href:"/ai-assistant",  icon:Bot,             label:"AI Assistant"    },
  { href:"/ai-contracts",  icon:FileText,        label:"AI Contracts"    },
  { href:"/dao",           icon:Vote,            label:"DAO Governance"  },
  { href:"/cross-chain",   icon:Globe,           label:"Crypto Wallet"   },

  { section: "GROW" },
  { href:"/community",     icon:Globe,           label:"Community"       },
  { href:"/referrals",     icon:Gift,            label:"Referrals"       },
  { href:"/analytics",     icon:BarChart3,       label:"Analytics"       },
  { href:"/portfolio",     icon:ImageIcon,       label:"Portfolio"       },
  { href:"/agency",        icon:Building2,       label:"Agency Hub"      },

  { section: "ACCOUNT" },
  { href:"/settings",      icon:Settings,        label:"Settings"        },
  { href:"/enterprise",    icon:Building2,       label:"Enterprise"      },
];

function VShield(){
  return(
    <svg width="28" height="32" viewBox="0 0 100 115" fill="none">
      <defs>
        <linearGradient id="sb1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#1a6bff"/><stop offset="100%" stopColor="#0033aa"/></linearGradient>
        <linearGradient id="sb2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#c0d8ff"/><stop offset="100%" stopColor="#6699ff"/></linearGradient>
      </defs>
      <path d="M50 4 L96 22 L96 58 Q96 90 50 112 Q4 90 4 58 L4 22 Z" fill="url(#sb1)" stroke="url(#sb2)" strokeWidth="2.5"/>
      <path d="M28 56 L42 70 L72 40" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const router   = useRouter();

  return (
    <div style={{
      width:220, minHeight:"100vh", flexShrink:0,
      background:"linear-gradient(180deg,#020d1f 0%,#010812 100%)",
      borderRight:"1px solid rgba(26,107,255,0.12)",
      display:"flex", flexDirection:"column",
      position:"sticky", top:0, height:"100vh", overflowY:"auto",
    }}>
      {/* Logo */}
      <div style={{padding:"18px 16px 12px",borderBottom:"1px solid rgba(26,107,255,0.1)",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer"}} onClick={()=>router.push("/")}>
          <VShield/>
          <div>
            <div style={{fontSize:"1.1rem",fontWeight:900,letterSpacing:"0.08em",color:"white"}}>VERITAS</div>
            <div style={{fontSize:"0.52rem",fontWeight:600,letterSpacing:"0.2em",color:"#00d4ff",textTransform:"uppercase"}}>Truth Becomes Trust</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <div style={{flex:1,padding:"8px 8px",overflowY:"auto"}}>
        {NAV.map((item, i) => {
          if ("section" in item) return (
            <div key={i} style={{padding:"14px 12px 4px",fontSize:"0.58rem",fontWeight:800,letterSpacing:"0.12em",color:"rgba(26,107,255,0.5)",textTransform:"uppercase"}}>
              {item.section}
            </div>
          );
          const Icon = item.icon;
          const active = pathname === item.href || pathname?.startsWith(item.href+"/");
          return (
            <div key={i} onClick={()=>router.push(item.href)} style={{
              display:"flex", alignItems:"center", gap:10,
              padding:"9px 12px", fontSize:"0.82rem", fontWeight:500,
              color: active ? "#4da6ff" : "rgba(255,255,255,0.5)",
              borderRadius:8, margin:"1px 0", cursor:"pointer",
              background: active ? "rgba(26,107,255,0.12)" : "transparent",
              border: active ? "1px solid rgba(26,107,255,0.2)" : "1px solid transparent",
              transition:"all 0.15s",
            }}
            onMouseEnter={e=>{if(!active){(e.currentTarget as HTMLElement).style.background="rgba(26,107,255,0.07)";(e.currentTarget as HTMLElement).style.color="rgba(255,255,255,0.8)";}}}
            onMouseLeave={e=>{if(!active){(e.currentTarget as HTMLElement).style.background="transparent";(e.currentTarget as HTMLElement).style.color="rgba(255,255,255,0.5)";}}}
            >
              <Icon size={15} style={{flexShrink:0}}/>
              {item.label}
            </div>
          );
        })}
      </div>

      {/* Bottom: Trust Score */}
      <div style={{padding:12,borderTop:"1px solid rgba(26,107,255,0.1)",flexShrink:0}}>
        <div style={{background:"rgba(26,107,255,0.08)",border:"1px solid rgba(26,107,255,0.15)",borderRadius:10,padding:"10px 12px",marginBottom:8}}>
          <div style={{fontSize:"0.6rem",fontWeight:700,color:"rgba(255,255,255,0.4)",marginBottom:3,letterSpacing:"0.06em",textTransform:"uppercase"}}>Your Trust Score</div>
          <div style={{fontSize:"1.6rem",fontWeight:900,color:"#00e676",lineHeight:1}}>845</div>
          <div style={{fontSize:"0.58rem",fontWeight:700,color:"#00e676",letterSpacing:"0.05em"}}>Excellent</div>
        </div>
        <button style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"center",gap:6,padding:"8px",background:"rgba(255,0,0,0.06)",border:"1px solid rgba(255,0,0,0.1)",borderRadius:8,fontSize:"0.75rem",color:"rgba(255,100,100,0.6)",cursor:"pointer"}}>
          <LogOut size={13}/> Sign Out
        </button>
      </div>
    </div>
  );
}
