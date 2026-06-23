"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import TopBar from "@/components/topbar/TopBar";
import { Vault, DollarSign, Clock, CheckCircle2, AlertTriangle, Shield, TrendingUp, Plus, ChevronRight, Loader2, X, Lock, Unlock, Scale } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "https://veritas-trust-ledger-production.up.railway.app";

const MOCK_ESCROWS = [
  {
    id: "ESC-8821", job: "Full-Stack Next.js Developer — SaaS Platform", client: "TechVentures Inc.",
    total: 10000, released: 4500, held: 5500, status: "active",
    milestones: [
      { id: 1, title: "Project Setup & Architecture", amount: 2000, status: "released", date: "Jun 1" },
      { id: 2, title: "Core Feature Development", amount: 2500, status: "released", date: "Jun 14" },
      { id: 3, title: "API Integration & Testing", amount: 3000, status: "held", date: "Jul 5" },
      { id: 4, title: "Launch & Deployment", amount: 2500, status: "pending", date: "Jul 20" },
    ],
  },
  {
    id: "ESC-8720", job: "Brand Identity & UI/UX Design System", client: "GreenLeaf Studios",
    total: 4500, released: 4500, held: 0, status: "completed",
    milestones: [
      { id: 1, title: "Research & Discovery", amount: 900, status: "released", date: "May 10" },
      { id: 2, title: "Logo & Brand Mark", amount: 1800, status: "released", date: "May 22" },
      { id: 3, title: "Design System Delivery", amount: 1800, status: "released", date: "Jun 3" },
    ],
  },
  {
    id: "ESC-8654", job: "Product Demo Video", client: "CloudSync AI",
    total: 5000, released: 1500, held: 3500, status: "disputed",
    milestones: [
      { id: 1, title: "Script & Storyboard", amount: 1500, status: "released", date: "Jun 5" },
      { id: 2, title: "Animation & Edit", amount: 2000, status: "disputed", date: "Jun 25" },
      { id: 3, title: "Final Delivery", amount: 1500, status: "pending", date: "Jul 10" },
    ],
  },
];

const STATUS_META: Record<string, { label: string; color: string; bg: string }> = {
  active:    { label: "Active",    color: "text-cyan-400",   bg: "bg-cyan-500/10 border-cyan-500/20" },
  completed: { label: "Completed", color: "text-green-400",  bg: "bg-green-500/10 border-green-500/20" },
  disputed:  { label: "Disputed",  color: "text-red-400",    bg: "bg-red-500/10 border-red-500/20" },
  held:      { label: "In Escrow", color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20" },
  released:  { label: "Released",  color: "text-green-400",  bg: "bg-green-500/10 border-green-500/20" },
  pending:   { label: "Pending",   color: "text-white/40",   bg: "bg-white/5 border-white/10" },
};

export default function EscrowPage() {
  const [escrows, setEscrows]   = useState(MOCK_ESCROWS);
  const [selected, setSelected] = useState(MOCK_ESCROWS[0]);
  const [releasing, setReleasing] = useState<number | null>(null);
  const [tab, setTab]           = useState<"active"|"completed"|"disputed">("active");

  const filtered = escrows.filter(e =>
    tab === "active" ? e.status === "active" :
    tab === "completed" ? e.status === "completed" : e.status === "disputed"
  );

  const totalHeld     = escrows.reduce((a, e) => a + e.held, 0);
  const totalReleased = escrows.reduce((a, e) => a + e.released, 0);
  const activeCount   = escrows.filter(e => e.status === "active").length;

  function releaseMilestone(escrowId: string, milestoneId: number) {
    setReleasing(milestoneId);
    setTimeout(() => {
      setEscrows(prev => prev.map(e => {
        if (e.id !== escrowId) return e;
        const ms = e.milestones.map(m => m.id === milestoneId ? { ...m, status: "released" } : m);
        const released = ms.filter(m => m.status === "released").reduce((a, m) => a + m.amount, 0);
        const held     = e.total - released;
        return { ...e, milestones: ms, released, held };
      }));
      if (selected.id === escrowId) {
        setSelected(prev => ({
          ...prev,
          milestones: prev.milestones.map(m => m.id === milestoneId ? { ...m, status: "released" } : m),
        }));
      }
      setReleasing(null);
    }, 1200);
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopBar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">

          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <Vault className="text-yellow-400" size={28} />
                <h1 className="text-3xl font-black gold-text">Escrow Vault</h1>
              </div>
              <p className="text-white/50">Blockchain-secured milestone payments — your money is always protected</p>
            </div>
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 font-bold text-sm transition hover:bg-yellow-500/30">
              <Plus size={18} /> New Escrow
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { icon: Lock, label: "Held in Escrow", value: `$${totalHeld.toLocaleString()}`, color: "text-yellow-400" },
              { icon: Unlock, label: "Total Released", value: `$${totalReleased.toLocaleString()}`, color: "text-green-400" },
              { icon: Shield, label: "Active Contracts", value: activeCount, color: "text-cyan-400" },
              { icon: AlertTriangle, label: "Disputes", value: escrows.filter(e => e.status === "disputed").length, color: "text-red-400" },
            ].map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className="glass-card rounded-2xl p-5">
                  <Icon size={20} className={s.color} />
                  <div className="text-2xl font-black mt-3 mb-1">{s.value}</div>
                  <div className="text-xs text-white/50">{s.label}</div>
                </div>
              );
            })}
          </div>

          <div className="flex gap-6">
            {/* List */}
            <div className="w-80 flex-shrink-0 space-y-3">
              <div className="flex gap-1 mb-4">
                {(["active","completed","disputed"] as const).map(t => (
                  <button key={t} onClick={() => setTab(t)} className={`flex-1 py-2 rounded-xl text-xs font-medium capitalize transition ${tab === t ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30" : "border border-white/10 text-white/40 hover:text-white"}`}>{t}</button>
                ))}
              </div>
              {filtered.map(e => (
                <button key={e.id} onClick={() => setSelected(e)} className={`w-full glass-card rounded-2xl p-4 text-left transition border ${selected.id === e.id ? "border-yellow-500/30 bg-yellow-500/5" : "border-white/5 hover:border-white/15"}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-white/30 font-mono">{e.id}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${STATUS_META[e.status].bg} ${STATUS_META[e.status].color}`}>{STATUS_META[e.status].label}</span>
                  </div>
                  <div className="font-semibold text-sm mb-1 line-clamp-1">{e.job}</div>
                  <div className="text-xs text-white/40 mb-3">{e.client}</div>
                  <div className="flex justify-between text-xs">
                    <span className="text-white/40">Held: <span className="text-yellow-400 font-bold">${e.held.toLocaleString()}</span></span>
                    <span className="text-white/40">Total: <span className="font-bold">${e.total.toLocaleString()}</span></span>
                  </div>
                  <div className="mt-2 h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: `${(e.released / e.total) * 100}%` }} />
                  </div>
                </button>
              ))}
            </div>

            {/* Detail */}
            {selected && (
              <div className="flex-1 glass-card rounded-3xl p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="text-xs text-white/40 mb-1 font-mono">{selected.id}</div>
                    <h2 className="font-bold text-xl mb-1">{selected.job}</h2>
                    <div className="text-sm text-white/50">{selected.client}</div>
                  </div>
                  <span className={`text-sm px-3 py-1.5 rounded-xl border font-medium ${STATUS_META[selected.status].bg} ${STATUS_META[selected.status].color}`}>{STATUS_META[selected.status].label}</span>
                </div>

                {/* Progress */}
                <div className="mb-6 p-4 rounded-2xl bg-white/3 border border-white/10">
                  <div className="flex justify-between text-sm mb-3">
                    <span className="text-white/50">Total Contract Value</span>
                    <span className="font-black text-xl gold-text">${selected.total.toLocaleString()}</span>
                  </div>
                  <div className="h-3 rounded-full bg-white/10 overflow-hidden mb-2">
                    <div className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full transition-all" style={{ width: `${(selected.released / selected.total) * 100}%` }} />
                  </div>
                  <div className="flex justify-between text-xs text-white/40">
                    <span>Released: <span className="text-green-400 font-bold">${selected.released.toLocaleString()}</span></span>
                    <span>Held: <span className="text-yellow-400 font-bold">${selected.held.toLocaleString()}</span></span>
                  </div>
                </div>

                {/* Milestones */}
                <h3 className="font-bold mb-4 text-sm uppercase tracking-wide text-white/50">Milestones</h3>
                <div className="space-y-3">
                  {selected.milestones.map(m => {
                    const meta = STATUS_META[m.status];
                    return (
                      <div key={m.id} className={`flex items-center justify-between p-4 rounded-2xl border ${m.status === "disputed" ? "border-red-500/20 bg-red-500/5" : "border-white/8 bg-white/3"}`}>
                        <div className="flex items-center gap-4">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${meta.bg}`}>
                            {m.status === "released" ? <CheckCircle2 size={16} className="text-green-400" /> :
                             m.status === "disputed"  ? <AlertTriangle size={16} className="text-red-400" /> :
                             m.status === "held"      ? <Lock size={16} className="text-yellow-400" /> :
                             <Clock size={16} className="text-white/30" />}
                          </div>
                          <div>
                            <div className="font-medium text-sm">{m.title}</div>
                            <div className="text-xs text-white/40">Due {m.date}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="font-bold">${m.amount.toLocaleString()}</div>
                            <span className={`text-xs ${meta.color}`}>{meta.label}</span>
                          </div>
                          {m.status === "held" && (
                            <button onClick={() => releaseMilestone(selected.id, m.id)} disabled={releasing === m.id} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-green-500/20 border border-green-500/30 text-green-400 text-xs font-bold hover:bg-green-500/30 transition disabled:opacity-50">
                              {releasing === m.id ? <Loader2 size={12} className="animate-spin" /> : <Unlock size={12} />}
                              Release
                            </button>
                          )}
                          {m.status === "disputed" && (
                            <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-bold hover:bg-red-500/30 transition">
                              <Scale size={12} /> Dispute
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
