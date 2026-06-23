
"use client";

import { useState } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import TopBar from "@/components/topbar/TopBar";
import { BarChart3, TrendingUp, DollarSign, Briefcase, Star, Calendar, Download } from "lucide-react";

const PERIODS = ["7 days","30 days","90 days","1 year","All time"];

const MONTHLY = [
  { month:"Jan", earnings:18400, jobs:12, score:89 },
  { month:"Feb", earnings:22100, jobs:15, score:90 },
  { month:"Mar", earnings:31200, jobs:18, score:91 },
  { month:"Apr", earnings:28900, jobs:14, score:92 },
  { month:"May", earnings:38700, jobs:21, score:93 },
  { month:"Jun", earnings:43200, jobs:24, score:94 },
];

function BarGroup({ data, max, color }: { data: number[]; max: number; color: string }) {
  return (
    <div className="flex items-end gap-1 h-32">
      {data.map((v,i) => (
        <div key={i} className={"rounded-t-md flex-1 transition-all "+color} style={{ height: `${(v/max)*100}%`, minHeight:4 }} />
      ))}
    </div>
  );
}

export default function AnalyticsPage() {
  const [period, setPeriod] = useState("30 days");

  const totalEarnings = MONTHLY.reduce((a,m)=>a+m.earnings,0);
  const totalJobs     = MONTHLY.reduce((a,m)=>a+m.jobs,0);
  const avgScore      = Math.round(MONTHLY.reduce((a,m)=>a+m.score,0)/MONTHLY.length);
  const maxEarnings   = Math.max(...MONTHLY.map(m=>m.earnings));

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopBar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <BarChart3 className="text-yellow-400" size={28}/>
              <h1 className="text-3xl font-black gold-text">Analytics</h1>
            </div>
            <div className="flex gap-2">
              {PERIODS.map(p => (
                <button key={p} onClick={()=>setPeriod(p)} className={"px-3 py-1.5 rounded-xl text-xs font-medium transition "+(period===p ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30" : "border border-white/10 text-white/40 hover:text-white")}>{p}</button>
              ))}
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { icon:DollarSign, label:"Total Earnings",   value:`$${totalEarnings.toLocaleString()}`, sub:"+18% vs last period", color:"text-green-400"  },
              { icon:Briefcase,  label:"Jobs Completed",   value:totalJobs,    sub:"+4 vs last period",    color:"text-yellow-400" },
              { icon:Star,       label:"Avg TruScore",     value:avgScore,     sub:"+5 points",            color:"text-cyan-400"   },
              { icon:TrendingUp, label:"Repeat Hire Rate", value:"71%",        sub:"+8% vs last period",   color:"text-purple-400" },
            ].map((s,i) => {
              const Icon = s.icon;
              return (
                <div key={i} className="glass-card rounded-2xl p-5">
                  <Icon size={18} className={s.color}/>
                  <div className="text-2xl font-black mt-3 mb-0.5">{s.value}</div>
                  <div className="text-xs text-white/50 mb-1">{s.label}</div>
                  <div className="text-xs text-green-400">{s.sub}</div>
                </div>
              );
            })}
          </div>

          {/* Earnings Chart */}
          <div className="glass-card rounded-3xl p-6 mb-5">
            <div className="flex items-center justify-between mb-5">
              <span className="font-bold">Monthly Earnings</span>
              <button className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white transition">
                <Download size={14}/> Export
              </button>
            </div>
            <div className="flex items-end gap-4">
              <div className="flex-1">
                <BarGroup data={MONTHLY.map(m=>m.earnings)} max={maxEarnings} color="bg-yellow-500/70 hover:bg-yellow-500" />
                <div className="flex gap-1 mt-2">
                  {MONTHLY.map(m => <div key={m.month} className="flex-1 text-center text-xs text-white/30">{m.month}</div>)}
                </div>
              </div>
            </div>
          </div>

          {/* Monthly Breakdown Table */}
          <div className="glass-card rounded-2xl overflow-hidden mb-5">
            <div className="grid grid-cols-4 px-5 py-3 text-xs text-white/40 uppercase tracking-wide border-b border-white/10">
              <div>Month</div><div>Earnings</div><div>Jobs</div><div>TruScore</div>
            </div>
            {[...MONTHLY].reverse().map((m,i) => (
              <div key={i} className="grid grid-cols-4 px-5 py-3.5 border-b border-white/5 last:border-0 hover:bg-white/3 transition">
                <div className="flex items-center gap-2"><Calendar size={14} className="text-white/30"/><span className="text-sm">{m.month} 2026</span></div>
                <div className="text-sm font-bold text-green-400">${m.earnings.toLocaleString()}</div>
                <div className="text-sm">{m.jobs} jobs</div>
                <div className="text-sm font-bold gold-text">{m.score}</div>
              </div>
            ))}
          </div>

          {/* Top Categories */}
          <div className="glass-card rounded-2xl p-5">
            <h3 className="font-bold mb-4">Earnings by Category</h3>
            <div className="space-y-3">
              {[
                { cat:"Development",  pct:62, amount:113244 },
                { cat:"Design",       pct:21, amount:38325  },
                { cat:"Consulting",   pct:11, amount:20081  },
                { cat:"Writing",      pct:6,  amount:10950  },
              ].map((c,i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-white/70">{c.cat}</span>
                    <span className="font-bold">${c.amount.toLocaleString()} <span className="text-white/40">({c.pct}%)</span></span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-yellow-500 to-yellow-300" style={{width:`${c.pct}%`}}/>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
