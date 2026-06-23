"use client";

import { useState } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import TopBar from "@/components/topbar/TopBar";
import { Scale, AlertTriangle, CheckCircle2, Shield, Loader2, X, Send, Upload, FileText } from "lucide-react";

const MOCK_DISPUTES = [
  { id:"DSP-1021", job:"Product Demo Video & Animation Package", against:"CloudSync AI", amount:2000, status:"under_review", opened:"Jun 28, 2026", desc:"Client claims deliverable didn't match scope. Requesting partial refund of $2,000.", evidence:["final_video_v3.mp4","original_brief.pdf"], aiVerdict:"Insufficient evidence submitted. Requesting additional documentation from both parties.", timeline:[ { date:"Jun 28", event:"Dispute opened by client", type:"open" }, { date:"Jun 28", event:"AI Arbitration initiated", type:"ai" }, { date:"Jun 29", event:"You submitted evidence", type:"submit" }, { date:"Pending", event:"Panel review (3 arbitrators)", type:"pending" } ] },
  { id:"DSP-0987", job:"SEO Blog Writing — 20 Articles", against:"RetailBoost Co.", amount:800, status:"resolved_won", opened:"May 14, 2026", desc:"Client refused to pay final milestone claiming articles were AI-generated.", evidence:["articles_final.zip","originality_report.pdf"], aiVerdict:"Evidence conclusively shows human-authored content. Full payment awarded to service provider.", timeline:[ { date:"May 14", event:"Dispute opened", type:"open" }, { date:"May 15", event:"AI analysis complete", type:"ai" }, { date:"May 17", event:"Panel voted 3-0 in your favor", type:"resolve" }, { date:"May 17", event:"$800 released from escrow", type:"payment" } ] },
];

const STATUS_META: Record<string,{label:string;color:string;bg:string}> = {
  under_review:  { label:"Under Review",   color:"text-yellow-400", bg:"bg-yellow-500/10 border-yellow-500/20" },
  resolved_won:  { label:"Resolved — Won", color:"text-green-400",  bg:"bg-green-500/10 border-green-500/20" },
  resolved_lost: { label:"Resolved — Lost",color:"text-red-400",    bg:"bg-red-500/10 border-red-500/20" },
};

export default function DisputesPage() {
  const [disputes]            = useState(MOCK_DISPUTES);
  const [selected, setSelected] = useState(MOCK_DISPUTES[0]);
  const [showNew, setShowNew]   = useState(false);
  const [newDesc, setNewDesc]   = useState("");
  const [evidence, setEvidence] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function submitEvidence() {
    if (!evidence.trim()) return;
    setSubmitting(true);
    setTimeout(() => { setSubmitting(false); setEvidence(""); }, 1000);
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
                <Scale className="text-yellow-400" size={28} />
                <h1 className="text-3xl font-black gold-text">Dispute Resolution</h1>
              </div>
              <p className="text-white/50">AI-powered arbitration with human panel oversight</p>
            </div>
            <button onClick={() => setShowNew(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 font-bold text-sm hover:bg-red-500/30 transition">
              <AlertTriangle size={18} /> Open Dispute
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label:"Active", value: disputes.filter(d=>d.status==="under_review").length, color:"text-yellow-400" },
              { label:"Won", value: disputes.filter(d=>d.status==="resolved_won").length, color:"text-green-400" },
              { label:"Resolution Rate", value:"99.2%", color:"text-cyan-400" },
            ].map((s,i) => (
              <div key={i} className="glass-card rounded-2xl p-5 text-center">
                <div className={"text-3xl font-black mb-1 "+s.color}>{s.value}</div>
                <div className="text-xs text-white/50">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="flex gap-6">
            <div className="w-80 flex-shrink-0 space-y-3">
              {disputes.map(d => (
                <button key={d.id} onClick={() => setSelected(d)} className={"w-full glass-card rounded-2xl p-4 text-left transition border "+(selected.id===d.id ? "border-yellow-500/30" : "border-white/5 hover:border-white/15")}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-white/30">{d.id}</span>
                    <span className={"text-xs px-2 py-0.5 rounded-full border "+STATUS_META[d.status].bg+" "+STATUS_META[d.status].color}>{STATUS_META[d.status].label}</span>
                  </div>
                  <div className="font-semibold text-sm line-clamp-1 mb-1">{d.job}</div>
                  <div className="text-xs text-white/40 mb-2">vs. {d.against}</div>
                  <div className="text-sm font-bold text-red-400">Disputed: ${d.amount.toLocaleString()}</div>
                </button>
              ))}
            </div>

            <div className="flex-1 glass-card rounded-3xl p-6 space-y-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs text-white/40 font-mono mb-1">{selected.id} · Opened {selected.opened}</div>
                  <h2 className="font-bold text-xl mb-1">{selected.job}</h2>
                  <div className="text-sm text-white/50">Against: {selected.against} · Disputed: <span className="text-red-400 font-bold">${selected.amount.toLocaleString()}</span></div>
                </div>
                <span className={"text-sm px-3 py-1.5 rounded-xl border font-medium "+STATUS_META[selected.status].bg+" "+STATUS_META[selected.status].color}>{STATUS_META[selected.status].label}</span>
              </div>

              <p className="text-sm text-white/60 leading-relaxed">{selected.desc}</p>

              <div className="p-4 rounded-2xl bg-cyan-500/5 border border-cyan-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <Shield size={14} className="text-cyan-400" />
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-wide">AI Arbitration Analysis</span>
                </div>
                <p className="text-sm text-white/70">{selected.aiVerdict}</p>
              </div>

              <div>
                <h3 className="font-bold text-xs mb-3 text-white/50 uppercase tracking-wide">Timeline</h3>
                <div className="space-y-2.5">
                  {selected.timeline.map((t,i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className={"w-2 h-2 rounded-full flex-shrink-0 "+(t.type==="resolve"||t.type==="payment" ? "bg-green-400" : t.type==="pending" ? "bg-white/20" : t.type==="ai" ? "bg-cyan-400" : "bg-yellow-400")} />
                      <span className="text-xs text-white/40 w-20 flex-shrink-0">{t.date}</span>
                      <span className="text-sm text-white/70">{t.event}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-bold text-xs mb-3 text-white/50 uppercase tracking-wide">Evidence Files</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {selected.evidence.map((f,i) => (
                    <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white/60">
                      <FileText size={14} className="text-yellow-400" />{f}
                    </div>
                  ))}
                </div>
                {selected.status === "under_review" && (
                  <div className="flex gap-3">
                    <textarea value={evidence} onChange={e=>setEvidence(e.target.value)} rows={2} placeholder="Add evidence description or URL..." className="veritas-input flex-1 resize-none text-sm" />
                    <div className="flex flex-col gap-2">
                      <button className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-white/10 text-white/50 hover:text-white text-sm transition"><Upload size={14}/> File</button>
                      <button onClick={submitEvidence} disabled={!evidence||submitting} className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 text-sm disabled:opacity-40 transition hover:bg-yellow-500/30">
                        {submitting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14}/>} Submit
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {showNew && (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="glass-card rounded-3xl p-6 w-full max-w-md border border-red-500/20">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-bold text-lg text-red-400">Open a Dispute</h3>
                  <button onClick={() => setShowNew(false)} className="text-white/40 hover:text-white"><X size={20}/></button>
                </div>
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-300 mb-5">
                  Only open disputes for legitimate unresolved issues. Frivolous disputes impact your TruScore.
                </div>
                <div className="space-y-4 mb-5">
                  <div>
                    <label className="text-xs text-white/50 mb-2 block uppercase tracking-wide">Contract</label>
                    <select className="veritas-input text-sm"><option>Select contract...</option><option>ESC-8821 — SaaS Platform</option></select>
                  </div>
                  <div>
                    <label className="text-xs text-white/50 mb-2 block uppercase tracking-wide">Disputed Amount</label>
                    <input type="number" placeholder="0.00" className="veritas-input" />
                  </div>
                  <div>
                    <label className="text-xs text-white/50 mb-2 block uppercase tracking-wide">Issue Description</label>
                    <textarea value={newDesc} onChange={e=>setNewDesc(e.target.value)} rows={4} placeholder="Explain the dispute clearly..." className="veritas-input resize-none text-sm" />
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setShowNew(false)} className="flex-1 py-3 rounded-xl border border-white/10 text-white/60 text-sm hover:text-white transition">Cancel</button>
                  <button onClick={() => setShowNew(false)} className="flex-1 py-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 font-bold text-sm hover:bg-red-500/30 transition">Submit</button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
