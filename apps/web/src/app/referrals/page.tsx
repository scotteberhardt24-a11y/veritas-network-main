
"use client";

import { useState } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import TopBar from "@/components/topbar/TopBar";
import { Gift, Copy, CheckCheck, Users, DollarSign, TrendingUp, Share2, ChevronRight, Zap, Star } from "lucide-react";

export default function ReferralsPage() {
  const [copied, setCopied] = useState(false);
  const refCode = "SCOTT-V9X2K";
  const refLink = `https://veritas.network/join?ref=${refCode}`;

  function copy() {
    navigator.clipboard.writeText(refLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const referrals = [
    { name:"Jordan Lee",    joined:"Jun 10",  status:"active",  earned:142.50, tier:"Worker"  },
    { name:"Priya Nair",    joined:"May 28",  status:"active",  earned:89.00,  tier:"Worker"  },
    { name:"Mike Okafor",   joined:"May 15",  status:"pending", earned:0,      tier:"Client"  },
    { name:"Tanya Brooks",  joined:"Apr 30",  status:"active",  earned:220.75, tier:"Worker"  },
    { name:"Carlos Rivera", joined:"Apr 12",  status:"active",  earned:167.20, tier:"Client"  },
  ];

  const totalEarned  = referrals.reduce((a,r) => a + r.earned, 0);
  const activeCount  = referrals.filter(r => r.status === "active").length;
  const pendingCount = referrals.filter(r => r.status === "pending").length;

  const tiers = [
    { range:"1–5 referrals",  pct:"10%", desc:"10% of their first 3 months of platform fees",  active: referrals.length <= 5 },
    { range:"6–20 referrals", pct:"12%", desc:"12% commission + bonus $50/referral",             active: false },
    { range:"21+ referrals",  pct:"15%", desc:"15% commission + dedicated partner manager",      active: false },
  ];

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopBar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">

          <div className="flex items-center gap-3 mb-6">
            <Gift className="text-yellow-400" size={28}/>
            <h1 className="text-3xl font-black gold-text">Referral Program</h1>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { icon:Users,      label:"Total Referrals",  value: referrals.length,          color:"text-cyan-400"   },
              { icon:Zap,        label:"Active",           value: activeCount,                color:"text-green-400"  },
              { icon:DollarSign, label:"Total Earned",     value:`$${totalEarned.toFixed(2)}`,color:"text-yellow-400" },
              { icon:TrendingUp, label:"This Month",       value:"$182.50",                   color:"text-purple-400" },
            ].map((s,i) => {
              const Icon = s.icon;
              return (
                <div key={i} className="glass-card rounded-2xl p-5">
                  <Icon size={20} className={s.color}/>
                  <div className="text-2xl font-black mt-3 mb-1">{s.value}</div>
                  <div className="text-xs text-white/50">{s.label}</div>
                </div>
              );
            })}
          </div>

          {/* Referral Link */}
          <div className="glass-card rounded-3xl p-6 mb-6">
            <h3 className="font-bold mb-4 flex items-center gap-2"><Share2 size={16} className="text-yellow-400"/>Your Referral Link</h3>
            <div className="flex gap-3 mb-4">
              <div className="flex-1 flex items-center bg-black/30 rounded-xl px-4 py-3 border border-white/10">
                <span className="text-sm font-mono text-white/70 truncate">{refLink}</span>
              </div>
              <button onClick={copy} className="flex items-center gap-2 px-5 py-3 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-sm transition flex-shrink-0">
                {copied ? <CheckCheck size={16}/> : <Copy size={16}/>}
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <div className="flex gap-3">
              {[
                { label:"Share on X",        icon:"𝕏", bg:"bg-black" },
                { label:"Share on LinkedIn",  icon:"in",bg:"bg-blue-700" },
                { label:"Send Email",         icon:"✉️", bg:"bg-white/10" },
              ].map((btn,i) => (
                <button key={i} className={"flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition hover:opacity-90 "+btn.bg}>
                  <span>{btn.icon}</span>{btn.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-6">
            {/* Referral List */}
            <div className="flex-1">
              <h3 className="font-bold mb-4">Your Referrals</h3>
              <div className="glass-card rounded-2xl overflow-hidden">
                {referrals.map((r,i) => (
                  <div key={i} className="flex items-center justify-between px-5 py-4 border-b border-white/5 last:border-0 hover:bg-white/3 transition">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500/20 to-cyan-500/20 flex items-center justify-center font-bold text-sm">{r.name[0]}</div>
                      <div>
                        <div className="font-medium text-sm">{r.name}</div>
                        <div className="text-xs text-white/40">Joined {r.joined} · {r.tier}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={"text-xs px-2 py-0.5 rounded-full font-medium "+(r.status==="active" ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-white/5 text-white/40")}>{r.status}</span>
                      <div className="text-right">
                        <div className="text-sm font-bold text-green-400">${r.earned.toFixed(2)}</div>
                        <div className="text-xs text-white/30">earned</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Commission Tiers */}
            <div className="w-72 flex-shrink-0 space-y-4">
              <h3 className="font-bold">Commission Tiers</h3>
              {tiers.map((t,i) => (
                <div key={i} className={"glass-card rounded-2xl p-4 border "+(t.active ? "border-yellow-500/30 bg-yellow-500/5" : "border-white/5")}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-white/70">{t.range}</span>
                    <span className={"text-lg font-black "+(t.active ? "gold-text" : "text-white/40")}>{t.pct}</span>
                  </div>
                  <p className="text-xs text-white/40">{t.desc}</p>
                  {t.active && <div className="mt-2 text-xs text-yellow-400 flex items-center gap-1"><Star size={10} fill="currentColor"/> Current Tier</div>}
                </div>
              ))}
              <div className="glass-card rounded-2xl p-4 border border-white/5">
                <div className="text-xs text-white/50 leading-relaxed">Commissions are paid monthly. Minimum payout is $25. Referred users must complete at least one paid job.</div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
