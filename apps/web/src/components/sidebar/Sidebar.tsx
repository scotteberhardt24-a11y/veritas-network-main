
"use client";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { VeritasEmblem } from "@/components/badges/VeritasBadges";
import {
  LayoutDashboard, Briefcase, MessageSquare, DollarSign, FileText,
  Shield, Trophy, Users, Settings, LogOut, ChevronLeft, ChevronRight,
  Zap, Brain, Vote, Heart, Star, Clock, BarChart3, Wallet,
  Key, Webhook, Globe, Award, Bell, Search, Map, Code2,
  Scale, Gift, TrendingUp, BookOpen, HelpCircle
} from "lucide-react";

const NAV_SECTIONS = [
  {
    label: "Main",
    items: [
      { href:"/dashboard",        icon:LayoutDashboard, label:"Dashboard"         },
      { href:"/ai-match",         icon:Brain,           label:"Find Talent",      badge:"AI", badgeColor:"#f0c040" },
      { href:"/job-board",        icon:Briefcase,       label:"Job Board"         },
      { href:"/messages",         icon:MessageSquare,   label:"Messages"          },
      { href:"/notifications",    icon:Bell,            label:"Notifications"     },
    ]
  },
  {
    label: "Trust & Identity",
    items: [
      { href:"/passport",         icon:Shield,          label:"Trust Passport"    },
      { href:"/trust-score",      icon:Star,            label:"Trust Score"       },
      { href:"/leaderboard",      icon:Trophy,          label:"Leaderboard"       },
      { href:"/verify",           icon:Award,           label:"Get Verified"      },
      { href:"/badges",           icon:Award,           label:"Badges"            },
    ]
  },
  {
    label: "Work",
    items: [
      { href:"/contracts",        icon:FileText,        label:"Contracts"         },
      { href:"/escrow",           icon:DollarSign,      label:"Escrow"            },
      { href:"/milestones",       icon:Clock,           label:"Milestones"        },
      { href:"/disputes",         icon:Scale,           label:"Disputes"          },
      { href:"/reviews",          icon:Star,            label:"Reviews"           },
      { href:"/time-tracker",     icon:Clock,           label:"Time Tracker"      },
    ]
  },
  {
    label: "Intelligence",
    items: [
      { href:"/ai-match-engine",  icon:Zap,             label:"AI Match Engine"   },
      { href:"/performance-insights",icon:BarChart3,    label:"Performance"       },
      { href:"/skill-intelligence",icon:Brain,          label:"Skill Intel"       },
      { href:"/automation-hub",   icon:Zap,             label:"Automations"       },
      { href:"/job-alerts",       icon:Bell,            label:"Job Alerts"        },
    ]
  },
  {
    label: "Finance",
    items: [
      { href:"/vault",            icon:Wallet,          label:"Vault"             },
      { href:"/invoices",         icon:FileText,        label:"Invoices"          },
      { href:"/earnings-forecast",icon:TrendingUp,      label:"Forecast"          },
      { href:"/payment-history",  icon:DollarSign,      label:"Payments"          },
      { href:"/subscription",     icon:Star,            label:"Subscription"      },
    ]
  },
  {
    label: "Community",
    items: [
      { href:"/governance",       icon:Vote,            label:"Governance",       badge:"Vote", badgeColor:"#f0c040" },
      { href:"/coming-soon",      icon:Heart,           label:"Worker Benefits",  badge:"New",  badgeColor:"#00e676" },
      { href:"/dao",              icon:Users,           label:"DAO"               },
      { href:"/leaderboard",      icon:Trophy,          label:"Rankings"          },
      { href:"/community",        icon:Users,           label:"Community"         },
    ]
  },
  {
    label: "Developer",
    items: [
      { href:"/api-keys",         icon:Key,             label:"API Keys"          },
      { href:"/webhooks",         icon:Webhook,         label:"Webhooks"          },
      { href:"/smart-contracts",  icon:Code2,           label:"Smart Contracts"   },
      { href:"/reputation-export",icon:Globe,           label:"Export Reputation" },
    ]
  },
  {
    label: "Account",
    items: [
      { href:"/settings",         icon:Settings,        label:"Settings"          },
      { href:"/help",             icon:HelpCircle,      label:"Help Center"       },
    ]
  },
];

export default function Sidebar() {
  const router   = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string|null>(null);

  function isActive(href: string) {
    return pathname === href || (href !== "/" && pathname.startsWith(href + "/"));
  }

  return (
    <div style={{
      width: collapsed ? 64 : 220,
      minHeight: "100vh",
      background: "rgba(2,10,24,0.98)",
      borderRight: "1px solid rgba(26,107,255,0.1)",
      display: "flex",
      flexDirection: "column",
      flexShrink: 0,
      transition: "width 0.25s ease",
      position: "relative",
      zIndex: 40,
    }}>

      {/* Logo */}
      <div style={{ padding: collapsed ? "16px 0" : "16px 14px", borderBottom: "1px solid rgba(26,107,255,0.08)", display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}
        onClick={() => router.push("/")}>
        <VeritasEmblem size={collapsed ? 32 : 28} />
        {!collapsed && (
          <div>
            <div style={{ fontSize: "0.85rem", fontWeight: 900, color: "white", letterSpacing: "0.08em" }}>VERITAS</div>
            <div style={{ fontSize: "0.42rem", fontWeight: 600, letterSpacing: "0.18em", color: "#00d4ff", textTransform: "uppercase" }}>Truth Becomes Trust</div>
          </div>
        )}
      </div>

      {/* Collapse toggle */}
      <button onClick={() => setCollapsed(!collapsed)} style={{
        position: "absolute", top: 20, right: -10,
        width: 20, height: 20, borderRadius: "50%",
        background: "rgba(26,107,255,0.2)", border: "1px solid rgba(26,107,255,0.3)",
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer", zIndex: 10, color: "#4da6ff",
      }}>
        {collapsed ? <ChevronRight size={11} /> : <ChevronLeft size={11} />}
      </button>

      {/* User badge */}
      {user && !collapsed && (
        <div style={{ padding: "10px 14px", borderBottom: "1px solid rgba(26,107,255,0.08)", display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: "linear-gradient(135deg,#1a3a6b,#0d1f3d)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "0.75rem", color: "white", flexShrink: 0 }}>
            {user.name?.[0] || user.email[0].toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: "0.75rem", color: "white", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.name || user.email}</div>
            <div style={{ fontSize: "0.6rem", color: "#00e676", fontWeight: 600 }}>Score: {user.trustScore || 50}</div>
          </div>
        </div>
      )}

      {/* Nav */}
      <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
        {NAV_SECTIONS.map((section, si) => (
          <div key={si} style={{ marginBottom: 4 }}>
            {!collapsed && (
              <div style={{ padding: "6px 14px 3px", fontSize: "0.55rem", fontWeight: 700, color: "rgba(255,255,255,0.25)", textTransform: "uppercase", letterSpacing: "0.12em" }}>
                {section.label}
              </div>
            )}
            {section.items.map((item, ii) => {
              const active = isActive(item.href);
              const hovered = hoveredItem === item.href + si + ii;
              const Icon = item.icon;
              return (
                <div key={ii}
                  onClick={() => router.push(item.href)}
                  onMouseEnter={() => setHoveredItem(item.href + si + ii)}
                  onMouseLeave={() => setHoveredItem(null)}
                  style={{
                    display: "flex", alignItems: "center", gap: 9,
                    padding: collapsed ? "8px 0" : "7px 14px",
                    justifyContent: collapsed ? "center" : "flex-start",
                    cursor: "pointer",
                    background: active ? "rgba(26,107,255,0.12)" : hovered ? "rgba(26,107,255,0.06)" : "transparent",
                    borderLeft: active ? "2px solid #1a6bff" : "2px solid transparent",
                    borderRadius: collapsed ? 0 : "0 8px 8px 0",
                    transition: "all 0.15s",
                    marginRight: collapsed ? 0 : 8,
                    position: "relative",
                  }}>
                  <Icon size={15} color={active ? "#4da6ff" : hovered ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.4)"} style={{ flexShrink: 0 }} />
                  {!collapsed && (
                    <span style={{ fontSize: "0.78rem", fontWeight: active ? 700 : 500, color: active ? "#4da6ff" : hovered ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.5)", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {item.label}
                    </span>
                  )}
                  {!collapsed && (item as any).badge && (
                    <span style={{ fontSize: "0.52rem", padding: "2px 5px", background: `${(item as any).badgeColor}22`, border: `1px solid ${(item as any).badgeColor}44`, borderRadius: 4, color: (item as any).badgeColor, fontWeight: 700, flexShrink: 0 }}>
                      {(item as any).badge}
                    </span>
                  )}
                  {collapsed && active && (
                    <div style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", width: 2, height: 16, background: "#1a6bff", borderRadius: "0 2px 2px 0" }} />
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Logout */}
      <div style={{ padding: collapsed ? "12px 0" : "12px 14px", borderTop: "1px solid rgba(26,107,255,0.08)" }}>
        <div onClick={logout} style={{
          display: "flex", alignItems: "center", gap: 9, padding: collapsed ? "8px 0" : "8px 10px",
          justifyContent: collapsed ? "center" : "flex-start",
          cursor: "pointer", borderRadius: 8,
          transition: "all 0.15s",
        }}
          onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = "rgba(255,85,85,0.08)"}
          onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = "transparent"}>
          <LogOut size={15} color="rgba(255,100,100,0.6)" />
          {!collapsed && <span style={{ fontSize: "0.78rem", color: "rgba(255,100,100,0.6)", fontWeight: 500 }}>Sign Out</span>}
        </div>
      </div>
    </div>
  );
}
