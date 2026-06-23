
"use client";

import { useState } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import TopBar from "@/components/topbar/TopBar";
import { FileText, CheckCircle2, Clock, AlertTriangle, Eye, Download, Plus, Shield } from "lucide-react";

const CONTRACTS = [
  { id:"CTR-3301", title:"Full-Stack SaaS Platform", client:"TechVentures Inc.", value:"$10,000", signed:"Jun 1, 2026", status:"active", milestones:4, completed:2 },
  { id:"CTR-3245", title:"Brand Identity Design",    client:"GreenLeaf Studios", value:"$4,500",  signed:"May 5, 2026", status:"completed", milestones:3, completed:3 },
  { id:"CTR-3198", title:"Product Demo Video",       client:"CloudSync AI",      value:"$5,000",  signed:"Jun 3, 2026", status:"disputed",  milestones:3, completed:1 },
  { id:"CTR-3120", title:"Content Strategy Q2",      client:"FinEdge Capital",   value:"$2,800",  signed:"Apr 2, 2026", status:"completed", milestones:2, completed:2 },
  { id:"CTR-3080", title:"React Native App Phase 1", client:"Bloom Health",      value:"$18,000", signed:"Mar 1, 2026", status:"completed", milestones:5, completed:5 },
];

const STATUS_STYLE: Record<string,string> = {
  active:    "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  completed: "bg-green-500/10 text-green-400 border-green-500/20",
  disputed:  "bg-red-500/10 text-red-400 border-red-500/20",
  pending:   "bg-white/5 text-white/40 border-white/10",
};

export default function ContractsPage() {
  const [filter, setFilter] = useState("all");

  const filtered = CONTRACTS.filter(c => filter==="all" || c.status===filter);
  const total = CONTRACTS.reduce((a,c)=>a+parseInt(c.value.replace(/[$,]/g,"")),0);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopBar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <FileText className="text-yellow-400" size={28}/>
              <h1 className="text-3xl font-black gold-text">Contracts</h1>
            </div>
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-sm transition">
              <Plus size={18}/> New Contract
            </button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { label:"Total Value",  value:`$${total.toLocaleString()}` },
              { label:"Active",       value: CONTRACTS.filter(c=>c.status==="active").length   },
              { label:"Completed",    value: CONTRACTS.filter(c=>c.status==="completed").length },
              { label:"Disputed",     value: CONTRACTS.filter(c=>c.status==="disputed").length  },
            ].map((s,i) => (
              <div key={i} className="glass-card rounded-2xl p-4 text-center">
                <div className="text-2xl font-black gold-text mb-1">{s.value}</div>
                <div className="text-xs text-white/50">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="flex gap-2 mb-4">
            {["all","active","completed","disputed"].map(f => (
              <button key={f} onClick={()=>setFilter(f)} className={"px-4 py-2 rounded-xl text-xs font-medium capitalize transition "+(filter===f ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30" : "border border-white/10 text-white/40 hover:text-white")}>{f}</button>
            ))}
          </div>

          <div className="space-y-3">
            {filtered.map(c => (
              <div key={c.id} className="glass-card rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={"w-10 h-10 rounded-xl flex items-center justify-center "+(c.status==="active" ? "bg-cyan-500/10" : c.status==="completed" ? "bg-green-500/10" : "bg-red-500/10")}>
                    {c.status==="active" ? <Clock size={18} className="text-cyan-400"/> : c.status==="completed" ? <CheckCircle2 size={18} className="text-green-400"/> : <AlertTriangle size={18} className="text-red-400"/>}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 font-bold">
                      {c.title}<Shield size={12} className="text-yellow-400"/>
                    </div>
                    <div className="text-xs text-white/40">{c.id} · {c.client} · Signed {c.signed}</div>
                    <div className="text-xs text-white/30 mt-0.5">Milestones: {c.completed}/{c.milestones} complete</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-bold text-lg gold-text">{c.value}</div>
                    <span className={"text-xs px-2 py-0.5 rounded-full border capitalize "+STATUS_STYLE[c.status]}>{c.status}</span>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 rounded-lg border border-white/10 hover:bg-white/5 transition"><Eye size={14} className="text-white/50"/></button>
                    <button className="p-2 rounded-lg border border-white/10 hover:bg-white/5 transition"><Download size={14} className="text-white/50"/></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
