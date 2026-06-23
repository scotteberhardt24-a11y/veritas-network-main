
"use client";

import { useState } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import TopBar from "@/components/topbar/TopBar";
import { Vault, Lock, Unlock, Shield, DollarSign, TrendingUp, Clock, CheckCircle2, AlertTriangle, Plus, ArrowDownToLine, ArrowUpFromLine } from "lucide-react";

export default function VaultPage() {
  const [withdrawing, setWithdrawing] = useState(false);
  const [withdrawn, setWithdrawn]     = useState(false);

  function withdraw() {
    setWithdrawing(true);
    setTimeout(() => { setWithdrawing(false); setWithdrawn(true); setTimeout(()=>setWithdrawn(false),3000); }, 1500);
  }

  const TRANSACTIONS = [
    { id:"TXN-4821", type:"deposit",  desc:"Milestone 2 — TechVentures", amount:4500, date:"Jun 14", status:"completed" },
    { id:"TXN-4720", type:"fee",      desc:"Platform fee (2.5%)",         amount:-112.50, date:"Jun 14", status:"completed" },
    { id:"TXN-4681", type:"deposit",  desc:"Milestone 1 — FinEdge Capital",amount:9800,date:"Jun 8",  status:"completed" },
    { id:"TXN-4620", type:"withdraw", desc:"Bank transfer — Chase ••6789",  amount:-8000,date:"Jun 5", status:"completed" },
    { id:"TXN-4544", type:"deposit",  desc:"Milestone 3 — Bloom Health",  amount:3200,  date:"May 28",status:"completed" },
    { id:"TXN-4490", type:"hold",     desc:"Escrow hold — ESC-8821",       amount:-5500, date:"May 25",status:"held"      },
  ];

  const available = 4387.50;
  const held      = 5500;
  const pending   = 3200;
  const lifetime  = 182650;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopBar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">

          <div className="flex items-center gap-3 mb-6">
            <Vault className="text-yellow-400" size={28}/>
            <h1 className="text-3xl font-black gold-text">Vault</h1>
          </div>

          {/* Balance Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { icon:Unlock,     label:"Available",   value:`$${available.toLocaleString()}`,     color:"text-green-400",  bg:"bg-green-500/10" },
              { icon:Lock,       label:"Held Escrow", value:`$${held.toLocaleString()}`,          color:"text-yellow-400", bg:"bg-yellow-500/10" },
              { icon:Clock,      label:"Pending",     value:`$${pending.toLocaleString()}`,       color:"text-cyan-400",   bg:"bg-cyan-500/10" },
              { icon:TrendingUp, label:"Lifetime",    value:`$${lifetime.toLocaleString()}`,      color:"text-purple-400", bg:"bg-purple-500/10" },
            ].map((s,i) => {
              const Icon = s.icon;
              return (
                <div key={i} className="glass-card rounded-2xl p-5">
                  <div className={"w-9 h-9 rounded-xl "+s.bg+" flex items-center justify-center mb-3"}><Icon size={18} className={s.color}/></div>
                  <div className="text-2xl font-black mb-0.5">{s.value}</div>
                  <div className="text-xs text-white/50">{s.label}</div>
                </div>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex gap-3 mb-6">
            <button onClick={withdraw} disabled={withdrawing||available===0} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-black font-bold transition disabled:opacity-40">
              {withdrawing ? <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"/> : <ArrowUpFromLine size={18}/>}
              {withdrawn ? "Withdrawal Initiated!" : "Withdraw Funds"}
            </button>
            <button className="flex items-center gap-2 px-6 py-3 rounded-xl border border-white/10 text-white/70 hover:text-white hover:bg-white/5 transition font-medium">
              <ArrowDownToLine size={18}/> Add Funds
            </button>
            <button className="flex items-center gap-2 px-6 py-3 rounded-xl border border-white/10 text-white/70 hover:text-white hover:bg-white/5 transition font-medium">
              <Shield size={18}/> Verify Payout
            </button>
          </div>

          {/* Transaction History */}
          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/10 font-bold">Transaction History</div>
            {TRANSACTIONS.map((tx,i) => (
              <div key={tx.id} className="flex items-center justify-between px-6 py-4 border-b border-white/5 last:border-0 hover:bg-white/3 transition">
                <div className="flex items-center gap-4">
                  <div className={"w-9 h-9 rounded-xl flex items-center justify-center text-sm "+(tx.type==="deposit" ? "bg-green-500/10" : tx.type==="withdraw" ? "bg-red-500/10" : tx.type==="fee" ? "bg-white/5" : "bg-yellow-500/10")}>
                    {tx.type==="deposit" ? "↓" : tx.type==="withdraw" ? "↑" : tx.type==="fee" ? "%" : "🔒"}
                  </div>
                  <div>
                    <div className="font-medium text-sm">{tx.desc}</div>
                    <div className="text-xs text-white/40 font-mono">{tx.id} · {tx.date}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={"font-bold text-sm "+(tx.amount>0 ? "text-green-400" : tx.type==="hold" ? "text-yellow-400" : "text-red-400")}>
                    {tx.amount>0 ? "+" : ""}{tx.amount<0 && tx.type==="hold" ? "" : ""}{tx.amount>0?"$"+tx.amount.toLocaleString():"$"+(Math.abs(tx.amount)).toLocaleString()} {tx.type==="hold" ? "(held)" : tx.amount<0 ? "" : ""}
                  </div>
                  <div className={"text-xs flex items-center gap-1 justify-end mt-0.5 "+(tx.status==="completed" ? "text-green-400" : "text-yellow-400")}>
                    {tx.status==="completed" ? <CheckCircle2 size={10}/> : <Clock size={10}/>} {tx.status}
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
