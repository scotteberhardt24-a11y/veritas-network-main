
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Shield, User, Briefcase, CheckCircle2, ChevronRight,
  Upload, Plus, X, Loader2, Sparkles,
} from "lucide-react";

const STEPS = [
  { id:1, title:"Welcome",          icon:"👋" },
  { id:2, title:"Your Role",        icon:"🎯" },
  { id:3, title:"Skills & Rate",    icon:"⚡" },
  { id:4, title:"Verify Identity",  icon:"🪪" },
  { id:5, title:"Go Live",          icon:"🚀" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep]       = useState(1);
  const [role, setRole]       = useState<"worker"|"client"|"both"|"">("");
  const [skills, setSkills]   = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [rate, setRate]       = useState("");
  const [title, setTitle]     = useState("");
  const [bio, setBio]         = useState("");
  const [verifying, setVerifying]   = useState(false);
  const [verified, setVerified]     = useState(false);
  const [completing, setCompleting] = useState(false);

  function addSkill() {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills(prev => [...prev, skillInput.trim()]);
      setSkillInput("");
    }
  }

  function removeSkill(s: string) { setSkills(prev => prev.filter(x => x !== s)); }

  function doVerify() {
    setVerifying(true);
    setTimeout(() => { setVerifying(false); setVerified(true); }, 2000);
  }

  function finish() {
    setCompleting(true);
    setTimeout(() => router.push("/dashboard"), 1500);
  }

  function next() { setStep(s => Math.min(s + 1, 5)); }
  function back() { setStep(s => Math.max(s - 1, 1)); }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{background:"linear-gradient(135deg, #0a0a0f 0%, #0d1117 50%, #0a0a0f 100%)"}}>
      <div className="w-full max-w-lg">

        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <Shield className="text-yellow-400" size={28}/>
          <span className="text-2xl font-black gold-text italic">VERITAS</span>
          <span className="text-xs text-white/40 uppercase tracking-widest">NETWORK</span>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-between mb-8 px-2">
          {STEPS.map((s,i) => (
            <div key={s.id} className="flex items-center">
              <div className={"flex flex-col items-center gap-1 "+(step > s.id ? "opacity-100" : step === s.id ? "opacity-100" : "opacity-30")}>
                <div className={"w-9 h-9 rounded-xl flex items-center justify-center text-sm transition-all "+(step > s.id ? "bg-green-500 text-white" : step === s.id ? "bg-yellow-500 text-black font-bold" : "bg-white/10 text-white/50")}>
                  {step > s.id ? <CheckCircle2 size={16}/> : s.icon}
                </div>
                <span className="text-xs text-white/40 hidden sm:block">{s.title}</span>
              </div>
              {i < STEPS.length-1 && <div className={"h-0.5 w-8 sm:w-12 mx-1 transition-all "+(step > s.id ? "bg-green-500" : "bg-white/10")}/>}
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="glass-card rounded-3xl p-8">

          {/* STEP 1: Welcome */}
          {step === 1 && (
            <div className="text-center">
              <div className="text-5xl mb-4">👋</div>
              <h2 className="text-2xl font-black mb-3">Welcome to Veritas Network</h2>
              <p className="text-white/50 mb-8 leading-relaxed">The world's most trusted Web3 gig marketplace. Let's get your profile set up in under 5 minutes.</p>
              <div className="grid grid-cols-3 gap-4 mb-8">
                {[["🛡️","Trust-First","Every payment secured by blockchain escrow"],["🤖","AI-Matched","Jobs matched by our AI to your exact skillset"],["🏆","Build Reputation","Your TruScore travels with you forever"]].map(([i,t,d],idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-white/5 text-center">
                    <div className="text-2xl mb-2">{i}</div>
                    <div className="font-bold text-sm mb-1">{t}</div>
                    <div className="text-xs text-white/40">{d}</div>
                  </div>
                ))}
              </div>
              <button onClick={next} className="w-full py-3.5 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-black font-black text-lg transition">Get Started →</button>
            </div>
          )}

          {/* STEP 2: Role */}
          {step === 2 && (
            <div>
              <h2 className="text-xl font-black mb-2">How will you use Veritas?</h2>
              <p className="text-white/50 text-sm mb-6">You can change this anytime in settings.</p>
              <div className="space-y-3 mb-8">
                {[
                  { id:"worker", icon:"👷", title:"I'm a Freelancer / Service Provider", desc:"Find clients, get paid, build my reputation" },
                  { id:"client", icon:"🏢", title:"I'm a Client / Business",             desc:"Hire talent, manage projects, pay securely" },
                  { id:"both",   icon:"⚡", title:"Both — I do both",                     desc:"Switch between hiring and working" },
                ].map(r => (
                  <button key={r.id} onClick={() => setRole(r.id as any)} className={"w-full flex items-center gap-4 p-4 rounded-2xl border text-left transition "+(role===r.id ? "border-yellow-500/50 bg-yellow-500/10" : "border-white/10 hover:border-white/20 hover:bg-white/3")}>
                    <span className="text-2xl">{r.icon}</span>
                    <div><div className="font-bold">{r.title}</div><div className="text-sm text-white/50">{r.desc}</div></div>
                    {role===r.id && <CheckCircle2 size={18} className="text-yellow-400 ml-auto"/>}
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={back} className="flex-1 py-3 rounded-xl border border-white/10 text-white/60 hover:text-white transition">Back</button>
                <button onClick={next} disabled={!role} className="flex-1 py-3 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-black font-bold disabled:opacity-40 transition">Continue →</button>
              </div>
            </div>
          )}

          {/* STEP 3: Skills */}
          {step === 3 && (
            <div>
              <h2 className="text-xl font-black mb-2">Skills & Professional Title</h2>
              <p className="text-white/50 text-sm mb-6">This powers your AI job matching.</p>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-xs text-white/50 mb-2 block uppercase tracking-wide">Professional Title</label>
                  <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="e.g. Full-Stack Developer" className="veritas-input"/>
                </div>
                <div>
                  <label className="text-xs text-white/50 mb-2 block uppercase tracking-wide">Hourly Rate (USD)</label>
                  <input value={rate} onChange={e=>setRate(e.target.value)} type="number" placeholder="150" className="veritas-input"/>
                </div>
                <div>
                  <label className="text-xs text-white/50 mb-2 block uppercase tracking-wide">Add Skills</label>
                  <div className="flex gap-2 mb-3">
                    <input value={skillInput} onChange={e=>setSkillInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addSkill()} placeholder="e.g. React, Figma, Python..." className="veritas-input flex-1"/>
                    <button onClick={addSkill} className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 transition"><Plus size={16}/></button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skills.map(s => (
                      <span key={s} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-yellow-500/15 border border-yellow-500/30 text-yellow-400 text-sm">
                        {s}<button onClick={()=>removeSkill(s)} className="hover:text-red-400 transition"><X size={12}/></button>
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-white/50 mb-2 block uppercase tracking-wide">Bio (optional)</label>
                  <textarea value={bio} onChange={e=>setBio(e.target.value)} rows={3} placeholder="Brief intro for your profile..." className="veritas-input resize-none text-sm"/>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={back} className="flex-1 py-3 rounded-xl border border-white/10 text-white/60 hover:text-white transition">Back</button>
                <button onClick={next} disabled={!title||skills.length===0} className="flex-1 py-3 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-black font-bold disabled:opacity-40 transition">Continue →</button>
              </div>
            </div>
          )}

          {/* STEP 4: Verify */}
          {step === 4 && (
            <div>
              <h2 className="text-xl font-black mb-2">Verify Your Identity</h2>
              <p className="text-white/50 text-sm mb-6">Verified users earn 3x more and get priority placement. Takes 60 seconds.</p>
              {!verified ? (
                <div>
                  <div className="space-y-3 mb-6">
                    {[
                      { icon:"📧", label:"Email Verified",  done:true  },
                      { icon:"📱", label:"Phone Verified",  done:false },
                      { icon:"🪪", label:"Government ID",   done:false },
                    ].map((v,i) => (
                      <div key={i} className={"flex items-center justify-between p-4 rounded-xl border "+(v.done ? "border-green-500/20 bg-green-500/5" : "border-white/10")}>
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{v.icon}</span>
                          <span className="font-medium text-sm">{v.label}</span>
                        </div>
                        {v.done ? <CheckCircle2 size={16} className="text-green-400"/> : <span className="text-xs text-white/30">Pending</span>}
                      </div>
                    ))}
                  </div>
                  <button onClick={doVerify} disabled={verifying} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-black font-bold transition disabled:opacity-60 mb-3">
                    {verifying ? <><Loader2 size={16} className="animate-spin"/> Verifying...</> : <><Upload size={16}/> Start Verification</>}
                  </button>
                  <button onClick={next} className="w-full py-2.5 rounded-xl border border-white/10 text-white/50 text-sm hover:text-white transition">Skip for now</button>
                </div>
              ) : (
                <div className="text-center py-6">
                  <CheckCircle2 size={56} className="text-green-400 mx-auto mb-3"/>
                  <div className="font-black text-xl mb-2 text-green-400">Identity Verified!</div>
                  <div className="text-sm text-white/50 mb-6">Your TruScore has been boosted by +10 points for completing verification.</div>
                  <button onClick={next} className="w-full py-3 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-black font-bold transition">Continue →</button>
                </div>
              )}
            </div>
          )}

          {/* STEP 5: Done */}
          {step === 5 && (
            <div className="text-center">
              <div className="text-6xl mb-4">🚀</div>
              <h2 className="text-2xl font-black mb-3">You're All Set!</h2>
              <p className="text-white/50 mb-6 leading-relaxed">Welcome to Veritas Network. Your profile is live and our AI is already finding job matches for you.</p>
              <div className="grid grid-cols-3 gap-3 mb-8">
                {[["TruScore","72"],["Matches","14"],["Badges","2"]].map(([l,v],i) => (
                  <div key={i} className="p-4 rounded-2xl bg-yellow-500/10 border border-yellow-500/20">
                    <div className="text-2xl font-black gold-text">{v}</div>
                    <div className="text-xs text-white/50 mt-1">{l}</div>
                  </div>
                ))}
              </div>
              <button onClick={finish} className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-black font-black text-lg transition">
                {completing ? <><Loader2 size={20} className="animate-spin"/> Taking you in...</> : <><Sparkles size={20}/> Enter Veritas →</>}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
