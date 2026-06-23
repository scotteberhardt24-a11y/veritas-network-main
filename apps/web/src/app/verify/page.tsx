
"use client";
import { useState } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import TopBar from "@/components/topbar/TopBar";
import { ShieldCheck, CheckCircle2, Clock, Upload, Phone, Mail, CreditCard, Loader2, AlertCircle, Zap } from "lucide-react";

const STEPS_DATA = [
  { id:"email",  icon:Mail,         label:"Email Verification",      desc:"Verify your email address",                   done:true,  points:5  },
  { id:"phone",  icon:Phone,        label:"Phone Verification",      desc:"Confirm your mobile number via SMS",           done:true,  points:10 },
  { id:"id",     icon:CreditCard,   label:"Government ID",           desc:"Passport, driver's license, or national ID",  done:false, points:20 },
  { id:"address",icon:ShieldCheck,  label:"Address Verification",    desc:"Utility bill or bank statement",               done:false, points:10 },
  { id:"payment",icon:CreditCard,   label:"Payment Method",          desc:"Add a verified bank account or card",          done:false, points:5  },
];

export default function VerifyPage() {
  const [steps,setSteps]       = useState(STEPS_DATA);
  const [verifying,setVerifying] = useState<string|null>(null);
  const [expanded,setExpanded] = useState<string|null>("id");

  const doneCount  = steps.filter(s=>s.done).length;
  const totalPts   = steps.reduce((a,s)=>a+(s.done?s.points:0),0);
  const maxPts     = steps.reduce((a,s)=>a+s.points,0);
  const scorePct   = Math.round((doneCount/steps.length)*100);

  function verify(id:string){
    setVerifying(id);
    setTimeout(()=>{
      setSteps(p=>p.map(s=>s.id===id?{...s,done:true}:s));
      setVerifying(null);
      setExpanded(null);
    },2000);
  }

  return (
    <div className="flex min-h-screen"><Sidebar/>
    <div className="flex-1 flex flex-col"><TopBar/>
    <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
      <div className="flex items-center gap-3 mb-6"><ShieldCheck className="text-yellow-400" size={28}/><h1 className="text-3xl font-black gold-text">Identity Verification</h1></div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="glass-card rounded-2xl p-5 text-center"><div className="text-3xl font-black gold-text mb-1">{doneCount}/{steps.length}</div><div className="text-xs text-white/50">Steps Complete</div></div>
        <div className="glass-card rounded-2xl p-5 text-center"><div className="text-3xl font-black text-cyan-400 mb-1">+{totalPts}</div><div className="text-xs text-white/50">TruScore Points Earned</div></div>
        <div className="glass-card rounded-2xl p-5 text-center"><div className="text-3xl font-black text-green-400 mb-1">{scorePct}%</div><div className="text-xs text-white/50">Verification Complete</div></div>
      </div>

      <div className="mb-5 glass-card rounded-2xl p-4">
        <div className="flex justify-between text-xs mb-1.5"><span className="text-white/50">Verification Progress</span><span className="text-yellow-400 font-bold">{totalPts}/{maxPts} pts</span></div>
        <div className="h-3 rounded-full bg-white/10 overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-yellow-500 to-green-400 transition-all" style={{width:scorePct+"%"}}/>
        </div>
      </div>

      <div className="space-y-3 max-w-2xl">
        {steps.map(s=>{
          const Icon = s.icon;
          const isExp = expanded===s.id;
          return (
            <div key={s.id} className={"glass-card rounded-2xl border transition "+(s.done?"border-green-500/20":isExp?"border-yellow-500/30":"border-white/5")}>
              <div className="flex items-center justify-between p-5 cursor-pointer" onClick={()=>!s.done&&setExpanded(isExp?null:s.id)}>
                <div className="flex items-center gap-4">
                  <div className={"w-11 h-11 rounded-xl flex items-center justify-center "+(s.done?"bg-green-500/10":"bg-white/5")}>
                    {s.done?<CheckCircle2 size={20} className="text-green-400"/>:<Icon size={20} className="text-white/50"/>}
                  </div>
                  <div>
                    <div className="font-bold text-sm">{s.label}</div>
                    <div className="text-xs text-white/40">{s.desc}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="flex items-center gap-1 text-xs text-cyan-400"><Zap size={10}/>{s.points} pts</div>
                  {s.done?<span className="text-xs text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/20">Verified</span>:<span className="text-xs text-white/30">Pending</span>}
                </div>
              </div>
              {isExp&&!s.done&&(
                <div className="px-5 pb-5 border-t border-white/10 pt-4">
                  <div className="border-2 border-dashed border-white/10 rounded-2xl p-8 text-center mb-4 hover:border-yellow-500/30 transition cursor-pointer">
                    <Upload size={24} className="text-white/30 mx-auto mb-2"/>
                    <div className="text-sm text-white/50">Upload document or <span className="text-yellow-400">browse</span></div>
                    <div className="text-xs text-white/30 mt-1">JPG, PNG, PDF · Max 10MB</div>
                  </div>
                  <button onClick={()=>verify(s.id)} disabled={verifying===s.id} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-black font-bold transition disabled:opacity-40">
                    {verifying===s.id?<><Loader2 size={16} className="animate-spin"/>Verifying...</>:"Submit for Verification"}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </main></div></div>
  );
}
