"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  Users, Briefcase, DollarSign, Shield, TrendingUp, AlertTriangle,
  Search, ChevronRight, Ban, CheckCircle, Eye, RefreshCw, Download,
  Settings, Bell, Database, Zap, Globe, Award
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "";

const MOCK_STATS = {
  totalUsers: 1247, newToday: 23, workers: 891, clients: 356,
  activeJobs: 143, completedJobs: 2847, totalEscrow: 284700,
  pendingDisputes: 7, resolvedDisputes: 234, totalRevenue: 71175,
  avgTrustScore: 672, verifiedUsers: 1089,
};

const MOCK_USERS = [
  { id:"1", email:"alex@dev.com",   username:"alexchen",   role:"WORKER", trustScore:990, jobs:247, status:"ACTIVE",  joined:"2026-01-15" },
  { id:"2", email:"maya@design.io", username:"mayarod",    role:"WORKER", trustScore:980, jobs:189, status:"ACTIVE",  joined:"2026-02-03" },
  { id:"3", email:"corp@tech.com",  username:"techcorp",   role:"CLIENT", trustScore:820, jobs:45,  status:"ACTIVE",  joined:"2026-01-28" },
  { id:"4", email:"spam@fake.com",  username:"spammer",    role:"WORKER", trustScore:120, jobs:2,   status:"SUSPENDED",joined:"2026-03-10" },
  { id:"5", email:"james@plumb.co", username:"jameswilson",role:"WORKER", trustScore:845, jobs:134, status:"ACTIVE",  joined:"2026-01-20" },
];

const MOCK_JOBS = [
  { id:"1", title:"Full-Stack SaaS",     client:"TechVentures", budget:10000, status:"ACTIVE",   worker:"alexchen",   created:"2026-07-01" },
  { id:"2", title:"Brand Identity",      client:"GreenLeaf",    budget:4500,  status:"PENDING",  worker:null,         created:"2026-07-05" },
  { id:"3", title:"Smart Contract Audit",client:"DeFi Protocol",budget:8000,  status:"DISPUTE",  worker:"mayarod",    created:"2026-06-28" },
  { id:"4", title:"AI Chatbot",          client:"CloudSync",    budget:6000,  status:"COMPLETED",worker:"jameswilson",created:"2026-06-15" },
];

const MOCK_DISPUTES = [
  { id:"1", job:"Full-Stack SaaS", worker:"alexchen", client:"TechVentures", amount:5000, reason:"Milestone not delivered", status:"PENDING", created:"2026-07-10" },
  { id:"2", job:"Smart Contract",  worker:"mayarod",  client:"DeFi Protocol", amount:8000, reason:"Quality dispute",         status:"REVIEWING",created:"2026-07-08" },
];

function StatCard({ icon, label, value, sub, color }: any) {
  return (
    <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:14, padding:"18px 16px" }}>
      <div style={{ color, marginBottom:10 }}>{icon}</div>
      <div style={{ fontSize:"1.8rem", fontWeight:900, color, lineHeight:1, marginBottom:4 }}>{value}</div>
      <div style={{ fontSize:"0.78rem", fontWeight:600, color:"rgba(255,255,255,0.6)", marginBottom:2 }}>{label}</div>
      {sub && <div style={{ fontSize:"0.65rem", color:"rgba(255,255,255,0.35)" }}>{sub}</div>}
    </div>
  );
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState("overview");
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState(MOCK_USERS);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [actionMsg, setActionMsg] = useState("");

  // Simple admin check - in production check user.role === "ADMIN"
  useEffect(() => {
    if (user && user.role !== "WORKER" && user.role !== "CLIENT" && user.role !== "ADMIN") {
      router.push("/dashboard");
    }
  }, [user]);

  function showAction(msg: string) {
    setActionMsg(msg);
    setTimeout(() => setActionMsg(""), 3000);
  }

  function toggleUserStatus(userId: string) {
    setUsers(prev => prev.map(u => u.id === userId
      ? { ...u, status: u.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE" }
      : u
    ));
    showAction("User status updated");
  }

  const filtered = users.filter(u =>
    !search || u.email.includes(search) || u.username.includes(search)
  );

  const TABS = [
    ["overview","📊 Overview"],
    ["users","👥 Users"],
    ["jobs","💼 Jobs"],
    ["disputes","⚖️ Disputes"],
    ["trust","🛡️ Trust Scores"],
    ["settings","⚙️ Settings"],
  ];

  return (
    <div style={{ minHeight:"100vh", background:"#030d1e", color:"white", fontFamily:"Arial,sans-serif" }}>

      {/* Top bar */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 24px", background:"rgba(255,0,0,0.06)", borderBottom:"1px solid rgba(255,85,85,0.15)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <Shield size={20} color="#ff5555"/>
          <span style={{ fontWeight:800, fontSize:"0.9rem" }}>VERITAS ADMIN</span>
          <span style={{ fontSize:"0.62rem", padding:"2px 8px", background:"rgba(255,85,85,0.15)", border:"1px solid rgba(255,85,85,0.3)", borderRadius:5, color:"#ff7777" }}>RESTRICTED ACCESS</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          {actionMsg && <span style={{ fontSize:"0.78rem", color:"#00e676", fontWeight:700 }}>✓ {actionMsg}</span>}
          <button onClick={()=>router.push("/dashboard")} style={{ padding:"6px 14px", background:"transparent", border:"1px solid rgba(255,255,255,0.15)", borderRadius:7, color:"rgba(255,255,255,0.6)", fontSize:"0.78rem", cursor:"pointer" }}>← Back to Dashboard</button>
        </div>
      </div>

      <div style={{ display:"flex", minHeight:"calc(100vh - 53px)" }}>

        {/* Sidebar */}
        <div style={{ width:200, borderRight:"1px solid rgba(255,255,255,0.06)", padding:"16px 0", flexShrink:0 }}>
          {TABS.map(([t,l])=>(
            <button key={t} onClick={()=>setTab(t)} style={{ width:"100%", padding:"10px 18px", background:tab===t?"rgba(255,85,85,0.08)":"transparent", border:"none", borderLeft:tab===t?"2px solid #ff5555":"2px solid transparent", color:tab===t?"white":"rgba(255,255,255,0.45)", fontSize:"0.82rem", cursor:"pointer", textAlign:"left", fontWeight:tab===t?700:400 }}>{l}</button>
          ))}
        </div>

        {/* Main content */}
        <div style={{ flex:1, padding:24, overflowY:"auto" }}>

          {/* OVERVIEW */}
          {tab==="overview" && (
            <div>
              <h1 style={{ fontSize:"1.5rem", fontWeight:900, marginBottom:20 }}>Platform Overview</h1>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:20 }}>
                <StatCard icon={<Users size={20}/>}       label="Total Users"      value={MOCK_STATS.totalUsers.toLocaleString()} sub={`+${MOCK_STATS.newToday} today`}            color="#4da6ff"/>
                <StatCard icon={<Briefcase size={20}/>}   label="Active Jobs"      value={MOCK_STATS.activeJobs}                  sub={`${MOCK_STATS.completedJobs} completed`}      color="#00e676"/>
                <StatCard icon={<DollarSign size={20}/>}  label="Total Escrow"     value={`$${(MOCK_STATS.totalEscrow/1000).toFixed(0)}K`} sub={`$${(MOCK_STATS.totalRevenue/1000).toFixed(0)}K revenue`} color="#f0c040"/>
                <StatCard icon={<AlertTriangle size={20}/>} label="Open Disputes"  value={MOCK_STATS.pendingDisputes}             sub={`${MOCK_STATS.resolvedDisputes} resolved`}    color="#ff5555"/>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:24 }}>
                <StatCard icon={<Shield size={20}/>}      label="Verified Users"   value={MOCK_STATS.verifiedUsers}               sub={`${Math.round(MOCK_STATS.verifiedUsers/MOCK_STATS.totalUsers*100)}% of total`} color="#a78bfa"/>
                <StatCard icon={<TrendingUp size={20}/>}  label="Avg Trust Score"  value={MOCK_STATS.avgTrustScore}               sub="Platform average"                              color="#00e676"/>
                <StatCard icon={<Users size={20}/>}       label="Workers"          value={MOCK_STATS.workers}                     sub={`${MOCK_STATS.clients} clients`}               color="#4da6ff"/>
                <StatCard icon={<Award size={20}/>}       label="Platform Revenue" value={`$${(MOCK_STATS.totalRevenue/1000).toFixed(1)}K`} sub="2.5% escrow fee"                   color="#f0c040"/>
              </div>

              {/* Recent activity */}
              <div style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:14, padding:20 }}>
                <h3 style={{ fontWeight:800, marginBottom:14, fontSize:"0.95rem" }}>Recent Activity</h3>
                {[
                  { t:"New user registered", s:"alex@newdev.com signed up as WORKER", time:"2m ago", c:"#4da6ff" },
                  { t:"Dispute opened",       s:"Job #1247 — $5,000 in escrow",        time:"14m ago",c:"#ff5555" },
                  { t:"Escrow released",      s:"$3,500 released to jameswilson",      time:"1h ago", c:"#00e676" },
                  { t:"Trust Score updated",  s:"alexchen: 987 → 990",                 time:"2h ago", c:"#a78bfa" },
                  { t:"Job completed",        s:"Brand Identity — $4,500",             time:"3h ago", c:"#f0c040" },
                ].map((a,i)=>(
                  <div key={i} style={{ display:"flex", gap:12, padding:"10px 0", borderBottom:i<4?"1px solid rgba(255,255,255,0.04)":"none" }}>
                    <div style={{ width:8, height:8, borderRadius:"50%", background:a.c, marginTop:6, flexShrink:0 }}/>
                    <div style={{ flex:1 }}>
                      <div style={{ fontWeight:700, fontSize:"0.82rem" }}>{a.t}</div>
                      <div style={{ fontSize:"0.7rem", color:"rgba(255,255,255,0.45)" }}>{a.s}</div>
                    </div>
                    <div style={{ fontSize:"0.65rem", color:"rgba(255,255,255,0.3)", flexShrink:0 }}>{a.time}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* USERS */}
          {tab==="users" && (
            <div>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
                <h1 style={{ fontSize:"1.5rem", fontWeight:900, margin:0 }}>User Management</h1>
                <div style={{ display:"flex", gap:10 }}>
                  <div style={{ position:"relative" }}>
                    <Search size={13} style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", color:"rgba(255,255,255,0.3)" }}/>
                    <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search users..." style={{ padding:"8px 12px 8px 30px", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:8, color:"white", fontSize:"0.82rem", outline:"none", width:220 }}/>
                  </div>
                  <button style={{ padding:"8px 14px", background:"rgba(0,200,83,0.1)", border:"1px solid rgba(0,200,83,0.2)", borderRadius:8, color:"#00e676", fontSize:"0.78rem", cursor:"pointer" }}>
                    <Download size={13} style={{ display:"inline", marginRight:5 }}/>Export CSV
                  </button>
                </div>
              </div>

              <div style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:14, overflow:"hidden" }}>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 100px 80px 80px 100px 120px", padding:"10px 16px", fontSize:"0.62rem", fontWeight:700, color:"rgba(255,255,255,0.3)", textTransform:"uppercase", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
                  <div>User</div><div>Role</div><div>Score</div><div>Jobs</div><div>Status</div><div>Actions</div>
                </div>
                {filtered.map(u=>(
                  <div key={u.id} style={{ display:"grid", gridTemplateColumns:"1fr 100px 80px 80px 100px 120px", padding:"12px 16px", borderBottom:"1px solid rgba(255,255,255,0.04)", alignItems:"center" }}>
                    <div>
                      <div style={{ fontWeight:700, fontSize:"0.85rem" }}>{u.username}</div>
                      <div style={{ fontSize:"0.65rem", color:"rgba(255,255,255,0.4)" }}>{u.email}</div>
                      <div style={{ fontSize:"0.6rem", color:"rgba(255,255,255,0.25)" }}>Joined {u.joined}</div>
                    </div>
                    <div><span style={{ fontSize:"0.68rem", padding:"2px 8px", background:"rgba(26,107,255,0.1)", border:"1px solid rgba(26,107,255,0.2)", borderRadius:5, color:"#4da6ff" }}>{u.role}</span></div>
                    <div style={{ fontWeight:800, color:"#00e676" }}>{u.trustScore}</div>
                    <div style={{ color:"rgba(255,255,255,0.6)" }}>{u.jobs}</div>
                    <div>
                      <span style={{ fontSize:"0.68rem", padding:"2px 8px", borderRadius:5, fontWeight:700,
                        background:u.status==="ACTIVE"?"rgba(0,200,83,0.1)":"rgba(255,85,85,0.1)",
                        color:u.status==="ACTIVE"?"#00e676":"#ff5555",
                        border:`1px solid ${u.status==="ACTIVE"?"rgba(0,200,83,0.2)":"rgba(255,85,85,0.2)"}`
                      }}>{u.status}</span>
                    </div>
                    <div style={{ display:"flex", gap:6 }}>
                      <button onClick={()=>setSelectedUser(u)} style={{ padding:"4px 8px", background:"rgba(26,107,255,0.1)", border:"1px solid rgba(26,107,255,0.2)", borderRadius:5, color:"#4da6ff", fontSize:"0.65rem", cursor:"pointer" }}><Eye size={11}/></button>
                      <button onClick={()=>toggleUserStatus(u.id)} style={{ padding:"4px 8px", background:u.status==="ACTIVE"?"rgba(255,85,85,0.1)":"rgba(0,200,83,0.1)", border:`1px solid ${u.status==="ACTIVE"?"rgba(255,85,85,0.2)":"rgba(0,200,83,0.2)"}`, borderRadius:5, color:u.status==="ACTIVE"?"#ff5555":"#00e676", fontSize:"0.65rem", cursor:"pointer" }}>
                        {u.status==="ACTIVE"?<Ban size={11}/>:<CheckCircle size={11}/>}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* User detail panel */}
              {selectedUser && (
                <div style={{ marginTop:16, background:"rgba(26,107,255,0.05)", border:"1px solid rgba(26,107,255,0.2)", borderRadius:14, padding:20 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:14 }}>
                    <h3 style={{ margin:0, fontWeight:800 }}>User Detail — @{selectedUser.username}</h3>
                    <button onClick={()=>setSelectedUser(null)} style={{ background:"transparent", border:"none", color:"rgba(255,255,255,0.4)", cursor:"pointer", fontSize:"1.2rem" }}>×</button>
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12 }}>
                    {[["Email",selectedUser.email],["Role",selectedUser.role],["Trust Score",selectedUser.trustScore],["Jobs",selectedUser.jobs],["Status",selectedUser.status],["Joined",selectedUser.joined]].map(([l,v])=>(
                      <div key={l} style={{ padding:12, background:"rgba(255,255,255,0.03)", borderRadius:9 }}>
                        <div style={{ fontSize:"0.6rem", color:"rgba(255,255,255,0.4)", marginBottom:3 }}>{l}</div>
                        <div style={{ fontWeight:700, fontSize:"0.88rem" }}>{v}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display:"flex", gap:8, marginTop:14 }}>
                    <button onClick={()=>{toggleUserStatus(selectedUser.id);setSelectedUser(null);}} style={{ padding:"8px 16px", background:"rgba(255,85,85,0.1)", border:"1px solid rgba(255,85,85,0.2)", borderRadius:8, color:"#ff5555", fontSize:"0.8rem", cursor:"pointer" }}>
                      {selectedUser.status==="ACTIVE"?"Suspend User":"Reinstate User"}
                    </button>
                    <button onClick={()=>showAction("Score adjustment sent")} style={{ padding:"8px 16px", background:"rgba(26,107,255,0.1)", border:"1px solid rgba(26,107,255,0.2)", borderRadius:8, color:"#4da6ff", fontSize:"0.8rem", cursor:"pointer" }}>
                      Adjust Trust Score
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* JOBS */}
          {tab==="jobs" && (
            <div>
              <h1 style={{ fontSize:"1.5rem", fontWeight:900, marginBottom:16 }}>Job Management</h1>
              <div style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:14, overflow:"hidden" }}>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 120px 100px 100px 120px", padding:"10px 16px", fontSize:"0.62rem", fontWeight:700, color:"rgba(255,255,255,0.3)", textTransform:"uppercase", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
                  <div>Job</div><div>Client</div><div>Budget</div><div>Status</div><div>Worker</div>
                </div>
                {MOCK_JOBS.map(j=>(
                  <div key={j.id} style={{ display:"grid", gridTemplateColumns:"1fr 120px 100px 100px 120px", padding:"12px 16px", borderBottom:"1px solid rgba(255,255,255,0.04)", alignItems:"center" }}>
                    <div>
                      <div style={{ fontWeight:700, fontSize:"0.85rem" }}>{j.title}</div>
                      <div style={{ fontSize:"0.62rem", color:"rgba(255,255,255,0.35)" }}>Created {j.created}</div>
                    </div>
                    <div style={{ fontSize:"0.8rem", color:"rgba(255,255,255,0.6)" }}>{j.client}</div>
                    <div style={{ fontWeight:800, color:"#00e676" }}>${j.budget.toLocaleString()}</div>
                    <div>
                      <span style={{ fontSize:"0.65rem", padding:"2px 8px", borderRadius:5, fontWeight:700,
                        background:j.status==="ACTIVE"?"rgba(0,200,83,0.1)":j.status==="DISPUTE"?"rgba(255,85,85,0.1)":j.status==="COMPLETED"?"rgba(167,139,250,0.1)":"rgba(240,192,64,0.1)",
                        color:j.status==="ACTIVE"?"#00e676":j.status==="DISPUTE"?"#ff5555":j.status==="COMPLETED"?"#a78bfa":"#f0c040",
                        border:`1px solid ${j.status==="ACTIVE"?"rgba(0,200,83,0.2)":j.status==="DISPUTE"?"rgba(255,85,85,0.2)":j.status==="COMPLETED"?"rgba(167,139,250,0.2)":"rgba(240,192,64,0.2)"}`
                      }}>{j.status}</span>
                    </div>
                    <div style={{ fontSize:"0.8rem", color:"rgba(255,255,255,0.6)" }}>{j.worker || "—"}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DISPUTES */}
          {tab==="disputes" && (
            <div>
              <h1 style={{ fontSize:"1.5rem", fontWeight:900, marginBottom:16 }}>Dispute Resolution</h1>
              {MOCK_DISPUTES.map(d=>(
                <div key={d.id} style={{ background:"rgba(255,85,85,0.04)", border:"1px solid rgba(255,85,85,0.15)", borderRadius:14, padding:20, marginBottom:14 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:12 }}>
                    <div>
                      <div style={{ fontWeight:800, fontSize:"0.95rem", marginBottom:3 }}>{d.job}</div>
                      <div style={{ fontSize:"0.75rem", color:"rgba(255,255,255,0.5)" }}>{d.reason}</div>
                    </div>
                    <div style={{ textAlign:"right" }}>
                      <div style={{ fontWeight:900, color:"#ff5555", fontSize:"1.1rem" }}>${d.amount.toLocaleString()}</div>
                      <div style={{ fontSize:"0.62rem", color:"rgba(255,255,255,0.35)" }}>In escrow</div>
                    </div>
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginBottom:14 }}>
                    {[["Worker",d.worker],["Client",d.client],["Status",d.status]].map(([l,v])=>(
                      <div key={l} style={{ padding:10, background:"rgba(255,255,255,0.03)", borderRadius:8 }}>
                        <div style={{ fontSize:"0.6rem", color:"rgba(255,255,255,0.4)", marginBottom:2 }}>{l}</div>
                        <div style={{ fontWeight:700, fontSize:"0.82rem" }}>{v}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display:"flex", gap:8 }}>
                    <button onClick={()=>showAction("Ruled in favor of worker")} style={{ padding:"8px 16px", background:"rgba(0,200,83,0.1)", border:"1px solid rgba(0,200,83,0.2)", borderRadius:8, color:"#00e676", fontSize:"0.8rem", cursor:"pointer" }}>
                      Rule for Worker
                    </button>
                    <button onClick={()=>showAction("Ruled in favor of client")} style={{ padding:"8px 16px", background:"rgba(26,107,255,0.1)", border:"1px solid rgba(26,107,255,0.2)", borderRadius:8, color:"#4da6ff", fontSize:"0.8rem", cursor:"pointer" }}>
                      Rule for Client
                    </button>
                    <button onClick={()=>showAction("Split ruling applied")} style={{ padding:"8px 16px", background:"rgba(240,192,64,0.1)", border:"1px solid rgba(240,192,64,0.2)", borderRadius:8, color:"#f0c040", fontSize:"0.8rem", cursor:"pointer" }}>
                      Split Escrow
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TRUST SCORES */}
          {tab==="trust" && (
            <div>
              <h1 style={{ fontSize:"1.5rem", fontWeight:900, marginBottom:16 }}>Trust Score Management</h1>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>
                <div style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:14, padding:20 }}>
                  <h3 style={{ fontWeight:800, marginBottom:14, fontSize:"0.95rem" }}>Score Distribution</h3>
                  {[["ELITE (950-1000)","6%","#f0c040"],["EXPERT (850-949)","18%","#4da6ff"],["PRO (700-849)","31%","#a78bfa"],["VERIFIED (0-699)","45%","#00e676"]].map(([l,v,c])=>(
                    <div key={l} style={{ marginBottom:12 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4, fontSize:"0.75rem" }}>
                        <span style={{ color:"rgba(255,255,255,0.6)" }}>{l}</span>
                        <span style={{ fontWeight:700, color:c }}>{v}</span>
                      </div>
                      <div style={{ height:5, background:"rgba(255,255,255,0.06)", borderRadius:3 }}>
                        <div style={{ width:v, height:"100%", background:c, borderRadius:3 }}/>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:14, padding:20 }}>
                  <h3 style={{ fontWeight:800, marginBottom:14, fontSize:"0.95rem" }}>Manual Score Adjustment</h3>
                  <div style={{ marginBottom:10 }}>
                    <label style={{ fontSize:"0.72rem", color:"rgba(255,255,255,0.5)", display:"block", marginBottom:4 }}>Username or Email</label>
                    <input placeholder="Search user..." style={{ width:"100%", padding:"8px 12px", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:8, color:"white", fontSize:"0.82rem", outline:"none" }}/>
                  </div>
                  <div style={{ marginBottom:10 }}>
                    <label style={{ fontSize:"0.72rem", color:"rgba(255,255,255,0.5)", display:"block", marginBottom:4 }}>New Trust Score (0-1000)</label>
                    <input type="number" min="0" max="1000" placeholder="750" style={{ width:"100%", padding:"8px 12px", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:8, color:"white", fontSize:"0.82rem", outline:"none" }}/>
                  </div>
                  <div style={{ marginBottom:14 }}>
                    <label style={{ fontSize:"0.72rem", color:"rgba(255,255,255,0.5)", display:"block", marginBottom:4 }}>Reason</label>
                    <input placeholder="Manual adjustment reason..." style={{ width:"100%", padding:"8px 12px", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:8, color:"white", fontSize:"0.82rem", outline:"none" }}/>
                  </div>
                  <button onClick={()=>showAction("Trust score updated")} style={{ width:"100%", padding:"10px", background:"linear-gradient(135deg,#1a6bff,#0040cc)", border:"none", borderRadius:8, color:"white", fontWeight:700, cursor:"pointer" }}>
                    Update Score
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SETTINGS */}
          {tab==="settings" && (
            <div>
              <h1 style={{ fontSize:"1.5rem", fontWeight:900, marginBottom:16 }}>Platform Settings</h1>
              <div style={{ display:"flex", flexDirection:"column", gap:12, maxWidth:600 }}>
                {[
                  { label:"Escrow Fee %",          value:"2.5",   type:"number" },
                  { label:"Min Trust Score to Post Job", value:"0", type:"number" },
                  { label:"Min Trust Score for DAO", value:"500",  type:"number" },
                  { label:"Min Trust Score for Judge","value":"800",type:"number" },
                  { label:"Max Badge Count",        value:"50",    type:"number" },
                  { label:"Maintenance Mode",       value:"false", type:"text"   },
                ].map((s,i)=>(
                  <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px 16px", background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:10 }}>
                    <div style={{ fontWeight:600, fontSize:"0.85rem" }}>{s.label}</div>
                    <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                      <input defaultValue={s.value} type={s.type} style={{ width:80, padding:"5px 10px", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:6, color:"white", fontSize:"0.82rem", outline:"none", textAlign:"right" }}/>
                      <button onClick={()=>showAction("Setting saved")} style={{ padding:"5px 12px", background:"rgba(26,107,255,0.1)", border:"1px solid rgba(26,107,255,0.2)", borderRadius:6, color:"#4da6ff", fontSize:"0.72rem", cursor:"pointer" }}>Save</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
