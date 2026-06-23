
"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Sidebar from "@/components/sidebar/Sidebar";
import TopBar from "@/components/topbar/TopBar";
import { Briefcase, Shield, DollarSign, Clock, Users, CheckCircle2, Star, Send, X, Loader2, Zap, Lock } from "lucide-react";

const JOB = {
  id:"JB-4504", title:"React Native Mobile App — iOS & Android", client:"Bloom Health",
  clientScore:94, clientRating:4.9, clientJobs:12, verified:true,
  budget:"$15,000–$20,000", duration:"3–4 months", category:"Development", posted:"3h ago",
  proposals:2, escrow:true, urgent:true,
  skills:["React Native","Expo","Node.js","MongoDB","Firebase","Push Notifications"],
  match:99,
  desc:`We are building a comprehensive health tracking mobile app for iOS and Android. The app will integrate with Apple Watch and Fitbit, providing real-time health metrics, custom goal tracking, and AI-powered health insights.

Phase 1 scope (this contract):
• User onboarding & profile setup
• Dashboard with real-time health metrics
• Wearable device integration (Apple Health, Google Fit)
• Push notification system
• Offline-first data sync with conflict resolution

Requirements:
• 4+ years React Native experience
• Production apps in App Store / Google Play
• Strong TypeScript skills
• Experience with health APIs preferred
• Weekly progress demos required`,
  milestones:[
    { n:1, title:"Project Setup & Architecture",     pct:15, amount:2700 },
    { n:2, title:"Core UI & Navigation",             pct:25, amount:4500 },
    { n:3, title:"Wearable Integration & Sync",      pct:35, amount:6300 },
    { n:4, title:"Testing, Polish & App Store",      pct:25, amount:4500 },
  ],
};

export default function JobDetailPage() {
  const router = useRouter();
  const [showApply,setShowApply] = useState(false);
  const [proposal,setProposal]   = useState("");
  const [rate,setRate]           = useState("");
  const [submitting,setSubmitting] = useState(false);
  const [submitted,setSubmitted]   = useState(false);

  function submit(){
    if(!proposal||!rate)return;
    setSubmitting(true);
    setTimeout(()=>{setSubmitting(false);setSubmitted(true);},1500);
  }

  return (
    <div className="flex min-h-screen"><Sidebar/>
    <div className="flex-1 flex flex-col"><TopBar/>
    <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
      <button onClick={()=>router.back()} className="flex items-center gap-2 text-white/40 hover:text-white text-sm mb-6 transition">← Back to Jobs</button>

      <div className="flex gap-6 max-w-5xl">
        <div className="flex-1 space-y-5">
          {/* Header */}
          <div className="glass-card rounded-3xl p-6">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {JOB.urgent&&<span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 font-medium">⚡ Urgent</span>}
              {JOB.escrow&&<span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">🔒 Escrow Protected</span>}
              <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-white/40">{JOB.category}</span>
              <span className="text-xs text-white/30 ml-auto">{JOB.id} · {JOB.posted}</span>
            </div>
            <h1 className="text-2xl font-black mb-3">{JOB.title}</h1>
            <div className="flex flex-wrap gap-4 text-sm text-white/60">
              <span className="flex items-center gap-1.5"><DollarSign size={14}/>{JOB.budget}</span>
              <span className="flex items-center gap-1.5"><Clock size={14}/>{JOB.duration}</span>
              <span className="flex items-center gap-1.5"><Users size={14}/>{JOB.proposals} proposals</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {JOB.skills.map(s=><span key={s} className="text-xs px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-white/60">{s}</span>)}
            </div>
          </div>

          {/* Description */}
          <div className="glass-card rounded-3xl p-6">
            <h2 className="font-bold mb-4">Project Description</h2>
            <pre className="text-sm text-white/70 whitespace-pre-wrap leading-relaxed font-sans">{JOB.desc}</pre>
          </div>

          {/* Milestones */}
          <div className="glass-card rounded-3xl p-6">
            <h2 className="font-bold mb-4">Payment Milestones</h2>
            <div className="space-y-3">
              {JOB.milestones.map(m=>(
                <div key={m.n} className="flex items-center justify-between p-4 rounded-xl bg-white/3 border border-white/8">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-yellow-500/20 flex items-center justify-center text-xs font-bold text-yellow-400">{m.n}</div>
                    <div><div className="font-medium text-sm">{m.title}</div><div className="text-xs text-white/40">{m.pct}% of total</div></div>
                  </div>
                  <div className="flex items-center gap-2"><Lock size={12} className="text-yellow-400"/><span className="font-bold">${m.amount.toLocaleString()}</span></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-72 flex-shrink-0 space-y-4">
          {/* AI Match */}
          <div className="glass-card rounded-2xl p-5 text-center">
            <div className="text-5xl font-black gold-text mb-1">{JOB.match}%</div>
            <div className="text-xs text-white/40 mb-3">AI Match Score</div>
            <div className="flex items-center gap-1.5 text-xs text-yellow-400 justify-center"><Zap size={12}/>Highly compatible</div>
          </div>

          {/* Client */}
          <div className="glass-card rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center font-bold text-lg">B</div>
              <div>
                <div className="flex items-center gap-1.5 font-bold">{JOB.client}<Shield size={12} className="text-yellow-400"/></div>
                <div className="text-xs text-white/40">{JOB.clientJobs} jobs posted</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="p-2 rounded-lg bg-white/5"><div className="font-bold gold-text">{JOB.clientScore}</div><div className="text-xs text-white/40">TruScore</div></div>
              <div className="p-2 rounded-lg bg-white/5"><div className="flex items-center gap-0.5 justify-center">{Array.from({length:Math.round(JOB.clientRating)}).map((_,i)=><Star key={i} size={10} className="text-yellow-400" fill="currentColor"/>)}</div><div className="text-xs text-white/40">{JOB.clientRating}</div></div>
            </div>
          </div>

          <button onClick={()=>setShowApply(true)} className="w-full py-3.5 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-black font-black text-lg transition">Apply Now</button>
        </div>
      </div>

      {/* Apply Modal */}
      {showApply&&(
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-card rounded-3xl p-6 w-full max-w-lg border border-white/10">
            <div className="flex items-start justify-between mb-5">
              <div><div className="text-xs text-white/40 mb-1">{JOB.id}</div><h3 className="font-bold text-lg">{JOB.title}</h3></div>
              <button onClick={()=>setShowApply(false)} className="text-white/40 hover:text-white"><X size={20}/></button>
            </div>
            {submitted?(
              <div className="text-center py-10"><CheckCircle2 size={48} className="text-green-400 mx-auto mb-3"/><div className="font-bold text-lg">Proposal Submitted!</div><div className="text-sm text-white/50 mt-1">You will hear back within 24 hours.</div></div>
            ):(
              <>
                <div className="space-y-4 mb-5">
                  <div><label className="text-xs text-white/50 mb-2 block uppercase tracking-wide">Your Bid</label><input value={rate} onChange={e=>setRate(e.target.value)} placeholder="e.g. $17,500 fixed" className="veritas-input"/></div>
                  <div><label className="text-xs text-white/50 mb-2 block uppercase tracking-wide">Cover Letter</label><textarea value={proposal} onChange={e=>setProposal(e.target.value)} rows={5} placeholder="Why are you the best fit? Highlight experience, approach, and timeline..." className="veritas-input resize-none text-sm"/></div>
                </div>
                <div className="flex gap-3">
                  <button onClick={()=>setShowApply(false)} className="flex-1 py-3 rounded-xl border border-white/10 text-white/60 text-sm hover:text-white transition">Cancel</button>
                  <button onClick={submit} disabled={!proposal||!rate||submitting} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-sm disabled:opacity-40 transition">
                    {submitting?<Loader2 size={16} className="animate-spin"/>:<Send size={16}/>} Submit
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </main></div></div>
  );
}
