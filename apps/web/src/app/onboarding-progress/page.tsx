
"use client";
import { useState } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import TopBar from "@/components/topbar/TopBar";
import { VeritasVerifiedBadge, NewMemberBadge } from "@/components/badges/VeritasBadges";
import { CheckCircle2, ChevronRight, Zap, Shield, Star, Briefcase, Trophy, Lock, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

const STEPS = [
  {id:"profile",  icon:"👤", title:"Complete Your Profile",          pts:50,  done:true,  desc:"Add bio, hourly rate, portfolio link",                    cta:"Edit Profile",   href:"/settings"},
  {id:"skills",   icon:"⚡", title:"Add 5+ Skills",                  pts:30,  done:true,  desc:"List your top technical skills",                          cta:"Add Skills",     href:"/settings"},
  {id:"verify",   icon:"🪪", title:"Verify Your Identity",           pts:200, done:true,  desc:"Government ID + phone verification",                      cta:"Get Verified",   href:"/verify"},
  {id:"first_job",icon:"💼", title:"Apply to Your First Job",        pts:20,  done:true,  desc:"Submit a proposal to a matched job",                      cta:"Browse Jobs",    href:"/jobs"},
  {id:"first_earn",icon:"💰",title:"Complete First Paid Job",        pts:100, done:false, desc:"Earn your first dollar on the platform",                  cta:"View Jobs",      href:"/jobs"},
  {id:"skill_test",icon:"🏆",title:"Pass a Skills Assessment",       pts:200, done:false, desc:"Earn a verified skill badge",                             cta:"Take Test",      href:"/skill-test"},
  {id:"review",   icon:"⭐", title:"Receive Your First 5-Star Review",pts:50, done:false, desc:"Complete a job and get reviewed",                         cta:"View Active",    href:"/contracts"},
  {id:"escrow",   icon:"🔒", title:"Use Escrow for a Job",           pts:50,  done:false, desc:"Post or accept a job with escrow enabled",                cta:"New Proposal",   href:"/post-job"},
  {id:"referral", icon:"🎁", title:"Refer a Friend",                 pts:100, done:false, desc:"Invite a colleague to join Veritas",                      cta:"Get Link",       href:"/referrals"},
  {id:"portfolio",icon:"🎨", title:"Add 3 Portfolio Projects",       pts:30,  done:false, desc:"Show clients your best work",                            cta:"Add Projects",   href:"/portfolio"},
];

export default function OnboardingProgressPage() {
  const router = useRouter();
  const done    = STEPS.filter(s=>s.done);
  const pending = STEPS.filter(s=>!s.done);
  const earned  = done.reduce((a,s)=>a+s.pts,0);
  const total   = STEPS.reduce((a,s)=>a+s.pts,0);
  const pct     = Math.round((done.length/STEPS.length)*100);
  const score   = 350 + earned;

  return (
    <div style={{display:"flex",minHeight:"100vh",background:"#010812"}}>
      <Sidebar/>
      <div style={{flex:1,display:"flex",flexDirection:"column"}}>
        <TopBar/>
        <main style={{flex:1,overflowY:"auto",padding:24,color:"white"}}>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:24}}>
            <Trophy size={28} color="#f0c040"/>
            <h1 style={{fontSize:"1.8rem",fontWeight:900,margin:0}}>Onboarding Progress</h1>
          </div>

          {/* Hero */}
          <div style={{display:"grid",gridTemplateColumns:"1fr auto",gap:20,marginBottom:20,alignItems:"center"}}>
            <div style={{background:"rgba(4,15,36,0.95)",border:"1px solid rgba(26,107,255,0.18)",borderRadius:18,padding:22}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
                <div>
                  <div style={{fontSize:"0.65rem",fontWeight:700,color:"rgba(255,255,255,0.38)",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:4}}>Profile Completion</div>
                  <div style={{fontSize:"2.5rem",fontWeight:900,color:"#f0c040",lineHeight:1,marginBottom:3}}>{pct}%</div>
                  <div style={{fontSize:"0.78rem",color:"rgba(255,255,255,0.45)"}}>{done.length}/{STEPS.length} steps complete · +{earned} Trust Score pts</div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontSize:"2rem",fontWeight:900,color:"#00e676"}}>{score}</div>
                  <div style={{fontSize:"0.7rem",color:"rgba(255,255,255,0.38)"}}>Trust Score</div>
                  <div style={{fontSize:"0.65rem",color:"#00d4ff",marginTop:2}}>+{total-earned} pts possible</div>
                </div>
              </div>
              <div style={{height:10,background:"rgba(26,107,255,0.08)",borderRadius:5,overflow:"hidden",marginBottom:6}}>
                <div style={{width:`${pct}%`,height:"100%",background:"linear-gradient(90deg,#f0c040,#00e676)",borderRadius:5,transition:"width 0.8s"}}/>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:"0.65rem",color:"rgba(255,255,255,0.3)"}}><span>{pct}% complete</span><span>{total-earned} pts remaining</span></div>
            </div>
            <NewMemberBadge size={130}/>
          </div>

          {/* Completed */}
          <div style={{fontWeight:800,marginBottom:10,fontSize:"0.85rem",color:"rgba(255,255,255,0.5)",textTransform:"uppercase",letterSpacing:"0.08em"}}>Completed ✓</div>
          <div style={{display:"flex",flexDirection:"column",gap:7,marginBottom:20}}>
            {done.map(s=>(
              <div key={s.id} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",background:"rgba(0,200,83,0.05)",border:"1px solid rgba(0,200,83,0.15)",borderRadius:12}}>
                <CheckCircle2 size={20} color="#00e676"/>
                <span style={{fontSize:"1.1rem"}}>{s.icon}</span>
                <div style={{flex:1}}><span style={{fontWeight:700,fontSize:"0.88rem",color:"rgba(255,255,255,0.7)"}}>{s.title}</span><span style={{fontSize:"0.7rem",color:"rgba(255,255,255,0.35)",marginLeft:8}}>{s.desc}</span></div>
                <span style={{fontSize:"0.72rem",fontWeight:700,color:"#00e676"}}>+{s.pts} pts</span>
              </div>
            ))}
          </div>

          {/* Remaining */}
          <div style={{fontWeight:800,marginBottom:10,fontSize:"0.85rem",color:"rgba(255,255,255,0.5)",textTransform:"uppercase",letterSpacing:"0.08em"}}>Next Steps</div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {pending.map((s,i)=>(
              <div key={s.id} style={{display:"flex",alignItems:"center",gap:12,padding:"14px 16px",background:"rgba(4,15,36,0.85)",border:"1px solid rgba(26,107,255,0.12)",borderRadius:14}}>
                <div style={{width:40,height:40,borderRadius:10,background:"rgba(26,107,255,0.08)",border:"1px solid rgba(26,107,255,0.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.1rem",flexShrink:0}}>{s.icon}</div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:700,fontSize:"0.9rem",marginBottom:2}}>{s.title}</div>
                  <div style={{fontSize:"0.72rem",color:"rgba(255,255,255,0.45)"}}>{s.desc}</div>
                </div>
                <div style={{textAlign:"right",flexShrink:0,marginRight:8}}>
                  <div style={{fontWeight:800,color:"#f0c040",fontSize:"0.88rem"}}>+{s.pts} pts</div>
                </div>
                <button onClick={()=>router.push(s.href)} style={{display:"flex",alignItems:"center",gap:5,padding:"8px 14px",background:"linear-gradient(135deg,#1a6bff,#0050dd)",border:"none",borderRadius:9,color:"white",fontWeight:700,fontSize:"0.78rem",cursor:"pointer",flexShrink:0,boxShadow:"0 2px 10px rgba(26,107,255,0.3)"}}>
                  {s.cta}<ArrowRight size={13}/>
                </button>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
