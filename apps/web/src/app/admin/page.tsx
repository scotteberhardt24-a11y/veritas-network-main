
"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import TopBar from "@/components/topbar/TopBar";
import {
  Shield, Users, Briefcase, DollarSign, AlertTriangle,
  TrendingUp, Ban, CheckCircle2, Search, RefreshCw,
  BarChart3, Activity, Loader2, Eye,
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "https://veritas-trust-ledger-production.up.railway.app";

const MOCK_USERS = [
  { id:"U001", name:"Alex Chen",    email:"alex@dev.io",  role:"worker", score:99, status:"active",   joined:"Jan 2025", earnings:184500, jobs:247 },
  { id:"U002", name:"Maya Rodriguez",email:"maya@d.co",  role:"worker", score:98, status:"active",   joined:"Feb 2025", earnings:142000, jobs:189 },
  { id:"U003", name:"Brian Walsh",  email:"brian@tv.com", role:"client", score:91, status:"active",   joined:"Nov 2024", earnings:0,      jobs:34  },
  { id:"U004", name:"Bad Actor",    email:"scam@bad.io",  role:"worker", score:12, status:"flagged",  joined:"Jun 2026", earnings:0,      jobs:0   },
  { id:"U005", name:"James Park",   email:"jp@write.co",  role:"worker", score:97, status:"active",   joined:"Mar 2025", earnings:98700,  jobs:312 },
  { id:"U006", name:"New User",     email:"new@user.io",  role:"worker", score:50, status:"pending",  joined:"Jun 2026", earnings:0,      jobs:0   },
];

const MOCK_DISPUTES = [
  { id:"DSP-1021", parties:"CloudSync AI vs Zoe L.", amount:2000, status:"open",     opened:"Jun 28" },
  { id:"DSP-1019", parties:"RetailBoost vs Tom E.",  amount:800,  status:"resolved", opened:"Jun 20" },
  { id:"DSP-1015", parties:"FinEdge vs Rina P.",     amount:1500, status:"open",     opened:"Jun 15" },
];

export default function AdminPage() {
  const [tab, setTab]         = useState("Overview");
  const [users, setUsers]     = useState(MOCK_USERS);
  const [search, setSearch]   = useState("");
  const [banning, setBanning] = useState<string|null>(null);
  const [loading, setLoading] = useState(false);

  const TABS = ["Overview","Users","Disputes","Platform"];

  useEffect(() => {
    const token = localStorage.getItem("veritas_token");
    if (!token) return;
    fetch(`${API}/api/admin/stats`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).catch(() => {});
  }, []);

  function banUser(id: string) {
    setBanning(id);
    setTimeout(() => {
      setUsers(prev => prev.map(u => u.id === id ? { ...u, status:"banned" } : u));
      setBanning(null);
    }, 1000);
  }

  const filtered = users.filter(u =>
    !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  );

  const stats = [
    { icon:Users,      label:"Total Users",    value:"12,847",  sub:"+124 today",  color:"text-cyan-400"   },
    { icon:Briefcase,  label:"Active Jobs",    value:"2,341",   sub:"+89 today",   color:"text-yellow-400" },
    { icon:DollarSign, label:"Escrow Held",    value:"$1.2M",   sub:"Across 891",  color:"text-green-400"  },
    { icon:AlertTriangle,label:"Open Disputes",value:"14",      sub:"2 urgent",    color:"text-red-400"    },
  ];

  const platformMetrics = [
    { label:"Platform Revenue (MTD)",    value:"$48,200",   change:"+18%"  },
    { label:"Avg TruScore",              value:"78.4",      change:"+1.2"  },
    { label:"Dispute Resolution Rate",   value:"99.2%",     change:"+0.1%" },
    { label:"Worker Retention (90d)",    value:"84.7%",     change:"+3.2%" },
    { label:"Avg Job Value",             value:"$3,240",    change:"+$180" },
    { label:"AI Match Acceptance Rate",  value:"67.3%",     change:"+4.1%" },
    { label:"Escrow Release Rate",       value:"98.1%",     change:"+0.3%" },
    { label:"New Registrations (MTD)",   value:"1,247",     change:"+31%"  },
  ];

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopBar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Shield className="text-yellow-400" size={28}/>
              <h1 className="text-3xl font-black gold-text">Admin Panel</h1>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-red-500/10 border border-red-500/20">
              <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse"/>
              <span className="text-xs text-red-400 font-medium">Admin Access</span>
            </div>
          </div>

          <div className="flex gap-2 mb-6 border-b border-white/10">
            {TABS.map(t => (
              <button key={t} onClick={() => setTab(t)} className={"px-4 py-2.5 text-sm font-medium border-b-2 transition -mb-px "+(tab===t ? "border-yellow-400 text-yellow-400" : "border-transparent text-white/40 hover:text-white")}>{t}</button>
            ))}
          </div>

          {/* OVERVIEW */}
          {tab === "Overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((s,i) => {
                  const Icon = s.icon;
                  return (
                    <div key={i} className="glass-card rounded-2xl p-5">
                      <Icon size={20} className={s.color}/>
                      <div className="text-2xl font-black mt-3 mb-0.5">{s.value}</div>
                      <div className="text-xs text-white/50">{s.label}</div>
                      <div className="text-xs text-green-400 mt-1">{s.sub}</div>
                    </div>
                  );
                })}
              </div>
              <div className="glass-card rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4"><Activity size={16} className="text-yellow-400"/><span className="font-bold">Recent Platform Events</span></div>
                <div className="space-y-3">
                  {[
                    { type:"🟢", msg:"New Elite member: Alex Chen reached TruScore 99", time:"2m ago" },
                    { type:"💰", msg:"Large escrow activated: $18,000 — Bloom Health", time:"15m ago" },
                    { type:"🚨", msg:"Dispute escalated: DSP-1021 — requires manual review", time:"42m ago" },
                    { type:"👤", msg:"New registration spike: +47 users in last hour", time:"1h ago" },
                    { type:"🤖", msg:"AI model updated: Match accuracy improved to 94.2%", time:"3h ago" },
                  ].map((e,i) => (
                    <div key={i} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                      <span>{e.type}</span>
                      <span className="text-sm text-white/70 flex-1">{e.msg}</span>
                      <span className="text-xs text-white/30 flex-shrink-0">{e.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* USERS */}
          {tab === "Users" && (
            <div>
              <div className="flex gap-3 mb-4">
                <div className="relative flex-1 max-w-sm">
                  <Search size={14} className="absolute left-3 top-3.5 text-white/40"/>
                  <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search users..." className="veritas-input pl-9 py-3 text-sm"/>
                </div>
              </div>
              <div className="glass-card rounded-2xl overflow-hidden">
                <div className="grid grid-cols-12 px-5 py-3 text-xs text-white/40 uppercase tracking-wide border-b border-white/10">
                  <div className="col-span-3">User</div>
                  <div className="col-span-2">Role</div>
                  <div className="col-span-1">Score</div>
                  <div className="col-span-2 hidden sm:block">Earnings</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-2">Actions</div>
                </div>
                {filtered.map(u => (
                  <div key={u.id} className="grid grid-cols-12 px-5 py-3.5 border-b border-white/5 last:border-0 items-center hover:bg-white/3 transition">
                    <div className="col-span-3 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-xs font-bold flex-shrink-0">{u.name[0]}</div>
                      <div className="min-w-0">
                        <div className="text-sm font-medium truncate">{u.name}</div>
                        <div className="text-xs text-white/30 truncate">{u.email}</div>
                      </div>
                    </div>
                    <div className="col-span-2">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-white/50 capitalize">{u.role}</span>
                    </div>
                    <div className="col-span-1 font-bold gold-text text-sm">{u.score}</div>
                    <div className="col-span-2 hidden sm:block text-sm text-green-400 font-medium">{u.earnings > 0 ? `$${u.earnings.toLocaleString()}` : "—"}</div>
                    <div className="col-span-2">
                      <span className={"text-xs px-2 py-0.5 rounded-full border font-medium "+(
                        u.status==="active"  ? "bg-green-500/10 text-green-400 border-green-500/20" :
                        u.status==="flagged" ? "bg-red-500/10 text-red-400 border-red-500/20" :
                        u.status==="banned"  ? "bg-red-900/20 text-red-600 border-red-900/30" :
                        "bg-white/5 text-white/40 border-white/10"
                      )}>{u.status}</span>
                    </div>
                    <div className="col-span-2 flex gap-2">
                      <button className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition"><Eye size={14}/></button>
                      {u.status !== "banned" && u.status !== "active" && (
                        <button onClick={() => banUser(u.id)} disabled={banning===u.id} className="p-1.5 rounded-lg hover:bg-red-500/20 text-white/40 hover:text-red-400 transition">
                          {banning===u.id ? <Loader2 size={14} className="animate-spin"/> : <Ban size={14}/>}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DISPUTES */}
          {tab === "Disputes" && (
            <div className="space-y-3 max-w-3xl">
              {MOCK_DISPUTES.map(d => (
                <div key={d.id} className="glass-card rounded-2xl p-5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={"w-10 h-10 rounded-xl flex items-center justify-center "+(d.status==="open" ? "bg-red-500/10" : "bg-green-500/10")}>
                      {d.status==="open" ? <AlertTriangle size={18} className="text-red-400"/> : <CheckCircle2 size={18} className="text-green-400"/>}
                    </div>
                    <div>
                      <div className="font-bold text-sm">{d.id} — {d.parties}</div>
                      <div className="text-xs text-white/40">Opened {d.opened} · Disputed: <span className="text-red-400">${d.amount.toLocaleString()}</span></div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={"text-xs px-3 py-1 rounded-full border font-medium "+(d.status==="open" ? "bg-red-500/10 text-red-400 border-red-500/20" : "bg-green-500/10 text-green-400 border-green-500/20")}>{d.status}</span>
                    {d.status==="open" && <button className="text-xs px-3 py-1.5 rounded-lg bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/30 transition">Review</button>}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* PLATFORM */}
          {tab === "Platform" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl">
              {platformMetrics.map((m,i) => (
                <div key={i} className="glass-card rounded-2xl p-5">
                  <div className="text-xs text-white/40 mb-2">{m.label}</div>
                  <div className="text-xl font-black mb-1">{m.value}</div>
                  <div className="text-xs text-green-400">{m.change}</div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
