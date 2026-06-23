
"use client";
import { useState } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import TopBar from "@/components/topbar/TopBar";
import { Send, Star, Shield, CheckCircle2, X, Clock, DollarSign, MessageSquare, ThumbsUp, ThumbsDown, Loader2 } from "lucide-react";

const PROPOSALS = [
  { id:"P001", jobId:"JB-4501", job:"Full-Stack Next.js Developer — SaaS Platform", worker:"Alex Chen", avatar:"AC", score:99, rate:"$9,500 fixed", delivery:"45 days", cover:"I have built 12 similar SaaS platforms and can start immediately. My latest project for FinVault went live in 38 days under budget. I will provide weekly demos and full documentation.", skills:["Next.js","PostgreSQL","Stripe"], rating:5.0, jobs:247, submitted:"2h ago", status:"pending" },
  { id:"P002", jobId:"JB-4501", job:"Full-Stack Next.js Developer — SaaS Platform", worker:"Priya Sharma", avatar:"PS", score:96, rate:"$11,200 fixed", delivery:"60 days", cover:"Senior engineer with 8 years building enterprise SaaS. My approach: 2-week sprints, daily standups, automated test coverage above 80%. Available to start Monday.", skills:["Next.js","TypeScript","AWS"], rating:4.9, jobs:156, submitted:"3h ago", status:"pending" },
  { id:"P003", jobId:"JB-4501", job:"Full-Stack Next.js Developer — SaaS Platform", worker:"Marcus Webb", avatar:"MW", score:91, rate:"$8,000 fixed", delivery:"50 days", cover:"Full-stack dev specializing in Next.js 15. I can deliver the MVP in 5 weeks. Portfolio includes 3 auth + billing SaaS projects. References available on request.", skills:["Next.js","React","Node.js"], rating:4.7, jobs:89, submitted:"5h ago", status:"pending" },
];

export default function ProposalsPage() {
  const [proposals,setProposals] = useState(PROPOSALS);
  const [selected,setSelected]   = useState(PROPOSALS[0]);
  const [acting,setActing]       = useState<string|null>(null);

  function act(id:string, action:"accept"|"decline") {
    setActing(id+action);
    setTimeout(()=>{
      setProposals(p=>p.map(pr=>pr.id===id?{...pr,status:action==="accept"?"accepted":"declined"}:pr));
      setActing(null);
    },1000);
  }

  const pending   = proposals.filter(p=>p.status==="pending").length;
  const accepted  = proposals.filter(p=>p.status==="accepted").length;

  return (
    <div className="flex min-h-screen"><Sidebar/>
    <div className="flex-1 flex flex-col"><TopBar/>
    <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
      <div className="flex items-center gap-3 mb-6">
        <Send className="text-yellow-400" size={28}/>
        <h1 className="text-3xl font-black gold-text">Proposals</h1>
        {pending>0&&<span className="bg-yellow-500 text-black text-xs font-bold px-2.5 py-1 rounded-full">{pending} new</span>}
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[["Total",proposals.length,"text-white"],["Pending",pending,"text-yellow-400"],["Accepted",accepted,"text-green-400"]].map(([l,v,c],i)=>(
          <div key={i} className="glass-card rounded-2xl p-4 text-center">
            <div className={"text-2xl font-black mb-1 "+c}>{v}</div>
            <div className="text-xs text-white/50">{l}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-6">
        <div className="w-80 flex-shrink-0 space-y-3">
          {proposals.map(p=>(
            <button key={p.id} onClick={()=>setSelected(p)} className={"w-full glass-card rounded-2xl p-4 text-left transition border "+(selected.id===p.id?"border-yellow-500/30 bg-yellow-500/5":"border-white/5 hover:border-white/15")}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-yellow-500/20 to-cyan-500/20 flex items-center justify-center font-bold text-sm">{p.avatar}</div>
                  <div>
                    <div className="font-semibold text-sm">{p.worker}</div>
                    <div className="text-xs gold-text font-bold">{p.score}</div>
                  </div>
                </div>
                <span className={"text-xs px-2 py-0.5 rounded-full border "+(p.status==="accepted"?"bg-green-500/10 text-green-400 border-green-500/20":p.status==="declined"?"bg-red-500/10 text-red-400 border-red-500/20":"bg-white/5 text-white/40 border-white/10")}>{p.status}</span>
              </div>
              <div className="text-xs text-white/50 flex justify-between">
                <span className="flex items-center gap-1"><DollarSign size={10}/>{p.rate}</span>
                <span className="flex items-center gap-1"><Clock size={10}/>{p.delivery}</span>
              </div>
            </button>
          ))}
        </div>

        <div className="flex-1 glass-card rounded-3xl p-6">
          <div className="flex items-start justify-between mb-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-cyan-500/20 flex items-center justify-center font-black text-lg">{selected.avatar}</div>
              <div>
                <div className="flex items-center gap-2 font-black text-xl">{selected.worker}<Shield size={14} className="text-yellow-400"/></div>
                <div className="flex items-center gap-3 text-sm text-white/50 mt-0.5">
                  <span className="flex items-center gap-1"><Star size={12} className="text-yellow-400" fill="currentColor"/>{selected.rating}</span>
                  <span>{selected.jobs} jobs</span>
                  <span>TruScore <span className="gold-text font-bold">{selected.score}</span></span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xl font-black gold-text">{selected.rate}</div>
              <div className="text-xs text-white/40">{selected.delivery} delivery</div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-5">
            {selected.skills.map(s=><span key={s} className="text-xs px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-white/60">{s}</span>)}
          </div>

          <div className="p-4 rounded-2xl bg-white/3 border border-white/10 mb-5">
            <p className="text-sm text-white/70 leading-relaxed italic">"{selected.cover}"</p>
          </div>

          <div className="text-xs text-white/30 mb-5">Submitted {selected.submitted}</div>

          {selected.status==="pending"?(
            <div className="flex gap-3">
              <button onClick={()=>act(selected.id,"decline")} disabled={!!acting} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-red-500/20 text-red-400 text-sm font-bold hover:bg-red-500/10 transition disabled:opacity-40">
                {acting===selected.id+"decline"?<Loader2 size={16} className="animate-spin"/>:<ThumbsDown size={16}/>} Decline
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-white/10 text-white/60 text-sm hover:bg-white/5 transition">
                <MessageSquare size={16}/> Message
              </button>
              <button onClick={()=>act(selected.id,"accept")} disabled={!!acting} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-sm transition disabled:opacity-40">
                {acting===selected.id+"accept"?<Loader2 size={16} className="animate-spin"/>:<ThumbsUp size={16}/>} Accept & Hire
              </button>
            </div>
          ):(
            <div className={"flex items-center gap-2 font-bold "+(selected.status==="accepted"?"text-green-400":"text-red-400")}>
              <CheckCircle2 size={18}/> {selected.status==="accepted"?"Proposal Accepted — Contract Pending":"Proposal Declined"}
            </div>
          )}
        </div>
      </div>
    </main></div></div>
  );
}
