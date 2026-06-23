
"use client";
import { useState } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import TopBar from "@/components/topbar/TopBar";
import { Zap, Briefcase, DollarSign, Shield, Star, Clock, TrendingUp, Filter } from "lucide-react";

const FEED = [
  { type:"job_match",  time:"Just now",  data:{ id:"JB-4508", title:"Senior React Developer", client:"StartupX", budget:"$12,000", match:99, urgent:true }},
  { type:"payment",    time:"5m ago",    data:{ amount:4500, from:"TechVentures Inc.", escrow:"ESC-8821", milestone:"Milestone 2" }},
  { type:"score_up",   time:"12m ago",   data:{ from:93, to:94, reason:"5-star review from Bloom Health" }},
  { type:"job_match",  time:"1h ago",    data:{ id:"JB-4507", title:"ML Engineer — Churn Model", client:"SaaS Growth Labs", budget:"$8,000", match:95, urgent:false }},
  { type:"review",     time:"2h ago",    data:{ author:"Nadia Rose", company:"Bloom Health", rating:5, text:"Exceptional work!" }},
  { type:"job_match",  time:"3h ago",    data:{ id:"JB-4506", title:"Video Editor — Product Demo", client:"CloudSync AI", budget:"$5,000", match:92, urgent:false }},
  { type:"badge",      time:"1d ago",    data:{ badge:"🔥 30-Day Streak", desc:"Active for 30 consecutive days. +2 TruScore bonus." }},
];

export default function FeedPage() {
  const [filter,setFilter] = useState("all");
  const filtered = filter==="all"?FEED:FEED.filter(f=>f.type.startsWith(filter==="jobs"?"job":filter));

  return (
    <div className="flex min-h-screen"><Sidebar/>
    <div className="flex-1 flex flex-col"><TopBar/>
    <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
      <div className="flex items-center gap-3 mb-6"><Zap className="text-yellow-400" size={28}/><h1 className="text-3xl font-black gold-text">Activity Feed</h1></div>

      <div className="flex gap-2 mb-6">
        {[["all","All"],["jobs","Job Matches"],["payment","Payments"],["score","Score Updates"]].map(([v,l])=>(
          <button key={v} onClick={()=>setFilter(v)} className={"px-4 py-2 rounded-xl text-xs font-medium transition "+(filter===v?"bg-yellow-500/20 text-yellow-400 border border-yellow-500/30":"border border-white/10 text-white/40 hover:text-white")}>{l}</button>
        ))}
      </div>

      <div className="max-w-2xl space-y-3">
        {filtered.map((item,i)=>(
          <div key={i} className="glass-card rounded-2xl p-5">
            {item.type==="job_match"&&(
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center flex-shrink-0"><Briefcase size={18} className="text-yellow-400"/></div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-yellow-400 font-medium">New Job Match</span>
                      {"urgent" in item.data&&item.data.urgent&&<span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">⚡ Urgent</span>}
                    </div>
                    <div className="font-bold">{"title" in item.data?item.data.title:""}</div>
                    <div className="text-sm text-white/50">{"client" in item.data?item.data.client:""} · {"budget" in item.data?item.data.budget:""}</div>
                    <button className="mt-2 text-xs px-3 py-1.5 rounded-lg bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/30 transition">View Job →</button>
                  </div>
                </div>
                <div className="text-right flex-shrink-0"><div className="text-2xl font-black gold-text">{"match" in item.data?item.data.match:""}%</div><div className="text-xs text-white/40">match · {item.time}</div></div>
              </div>
            )}
            {item.type==="payment"&&(
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center flex-shrink-0"><DollarSign size={18} className="text-green-400"/></div>
                <div className="flex-1">
                  <div className="text-xs text-green-400 font-medium mb-0.5">Payment Released</div>
                  <div className="font-bold text-green-400 text-lg">${"amount" in item.data?item.data.amount:""}</div>
                  <div className="text-xs text-white/40">{"from" in item.data?item.data.from:""} · {"milestone" in item.data?item.data.milestone:""} · {item.time}</div>
                </div>
              </div>
            )}
            {item.type==="score_up"&&(
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center flex-shrink-0"><TrendingUp size={18} className="text-cyan-400"/></div>
                <div>
                  <div className="text-xs text-cyan-400 font-medium mb-0.5">TruScore Increased</div>
                  <div className="font-bold">{"from" in item.data?item.data.from:""} <span className="text-white/30">→</span> <span className="gold-text">{"to" in item.data?item.data.to:""}</span></div>
                  <div className="text-xs text-white/40">{"reason" in item.data?item.data.reason:""} · {item.time}</div>
                </div>
              </div>
            )}
            {item.type==="review"&&(
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center flex-shrink-0"><Star size={18} className="text-purple-400"/></div>
                <div className="flex-1">
                  <div className="text-xs text-purple-400 font-medium mb-1">New Review</div>
                  <div className="flex gap-0.5 mb-1">{"rating" in item.data&&Array.from({length:item.data.rating}).map((_,k)=><Star key={k} size={12} className="text-yellow-400" fill="currentColor"/>)}</div>
                  <p className="text-sm text-white/70 italic">{"text" in item.data?'"'+item.data.text+'"':""}</p>
                  <div className="text-xs text-white/40 mt-1">{"author" in item.data?item.data.author:""}, {"company" in item.data?item.data.company:""} · {item.time}</div>
                </div>
              </div>
            )}
            {item.type==="badge"&&(
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center text-xl flex-shrink-0">🏅</div>
                <div>
                  <div className="text-xs text-yellow-400 font-medium mb-0.5">Badge Earned</div>
                  <div className="font-bold">{"badge" in item.data?item.data.badge:""}</div>
                  <div className="text-xs text-white/40">{"desc" in item.data?item.data.desc:""} · {item.time}</div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </main></div></div>
  );
}
