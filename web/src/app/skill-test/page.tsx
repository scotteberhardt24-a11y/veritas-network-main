
"use client";
import { useState, useEffect } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import TopBar from "@/components/topbar/TopBar";
import { Jobs50Badge, VeritasEmblem } from "@/components/badges/VeritasBadges";
import { CheckCircle2, XCircle, Clock, Award, Loader2, ChevronRight, Zap, Shield } from "lucide-react";

const SKILLS = [
  {id:"nextjs",   label:"Next.js 15",    icon:"⚡", questions:15, duration:"20 min", badge:"+20 pts", takers:8241},
  {id:"react",    label:"React 19",      icon:"⚛️", questions:15, duration:"20 min", badge:"+20 pts", takers:12088},
  {id:"ts",       label:"TypeScript",    icon:"🔷", questions:12, duration:"15 min", badge:"+15 pts", takers:9342},
  {id:"postgres", label:"PostgreSQL",    icon:"🐘", questions:12, duration:"15 min", badge:"+15 pts", takers:5671},
  {id:"solidity", label:"Solidity",      icon:"🔗", questions:10, duration:"15 min", badge:"+25 pts", takers:2104},
  {id:"figma",    label:"Figma Design",  icon:"🎨", questions:10, duration:"12 min", badge:"+15 pts", takers:6890},
];

const SAMPLE_Qs = [
  {q:"In Next.js 15, what is the default caching behavior for fetch() requests?",options:["Cached forever","Not cached by default","Cached for 30s","Depends on HTTP headers"],correct:1},
  {q:"Which React 19 hook is used to manage form state and actions?",options:["useFormState","useActionState","useFormAction","useServerAction"],correct:1},
  {q:"What TypeScript utility type makes all properties optional?",options:["Readonly<T>","Required<T>","Partial<T>","Pick<T,K>"],correct:2},
];

export default function SkillTestPage() {
  const [phase, setPhase]       = useState<"select"|"test"|"result">("select");
  const [selected, setSelected] = useState<typeof SKILLS[0]|null>(null);
  const [qIndex, setQIndex]     = useState(0);
  const [answers, setAnswers]   = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(1200);
  const [submitting, setSub]    = useState(false);

  useEffect(()=>{
    if(phase!=="test") return;
    const t=setInterval(()=>setTimeLeft(s=>Math.max(0,s-1)),1000);
    return()=>clearInterval(t);
  },[phase]);

  function startTest(skill:typeof SKILLS[0]){
    setSelected(skill);
    setQIndex(0);
    setAnswers([]);
    setTimeLeft(1200);
    setPhase("test");
  }

  function answer(idx:number){
    const newA=[...answers,idx];
    setAnswers(newA);
    if(qIndex<SAMPLE_Qs.length-1){
      setQIndex(q=>q+1);
    } else {
      setSub(true);
      setTimeout(()=>{setSub(false);setPhase("result");},1000);
    }
  }

  const score = answers.length ? Math.round((answers.filter((a,i)=>a===SAMPLE_Qs[i].correct).length/SAMPLE_Qs.length)*100) : 0;
  const passed = score >= 75;
  const fmt=(s:number)=>`${Math.floor(s/60)}:${String(s%60).padStart(2,"0")}`;

  return (
    <div style={{display:"flex",minHeight:"100vh",background:"#010812"}}>
      <Sidebar/>
      <div style={{flex:1,display:"flex",flexDirection:"column"}}>
        <TopBar/>
        <main style={{flex:1,overflowY:"auto",padding:24,color:"white"}}>

          {phase==="select"&&(
            <>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:24}}>
                <Award size={28} color="#f0c040"/>
                <div>
                  <h1 style={{fontSize:"1.8rem",fontWeight:900,margin:0}}>Skills Assessment</h1>
                  <div style={{fontSize:"0.65rem",color:"#00d4ff",letterSpacing:"0.15em",textTransform:"uppercase",marginTop:2}}>Pass to earn verified skill badges + Trust Score points</div>
                </div>
              </div>

              <div style={{padding:"12px 18px",background:"rgba(26,107,255,0.07)",border:"1px solid rgba(26,107,255,0.18)",borderRadius:12,marginBottom:20,fontSize:"0.82rem",color:"rgba(255,255,255,0.6)",display:"flex",alignItems:"center",gap:8}}>
                <Shield size={15} color="#4da6ff" style={{flexShrink:0}}/>
                Pass score is 75%. You can retake failed assessments after 7 days. Verified skill badges are displayed on your Trust Passport and increase proposal acceptance by 34%.
              </div>

              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14}}>
                {SKILLS.map(skill=>(
                  <div key={skill.id} style={{background:"rgba(4,15,36,0.9)",border:"1px solid rgba(26,107,255,0.15)",borderRadius:16,padding:20,display:"flex",flexDirection:"column",gap:12}}>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                      <span style={{fontSize:"2rem"}}>{skill.icon}</span>
                      <span style={{fontSize:"0.65rem",padding:"3px 8px",background:"rgba(0,200,83,0.1)",border:"1px solid rgba(0,200,83,0.2)",borderRadius:6,color:"#00e676",fontWeight:700}}>{skill.badge}</span>
                    </div>
                    <div>
                      <div style={{fontWeight:800,fontSize:"1rem",marginBottom:4}}>{skill.label}</div>
                      <div style={{fontSize:"0.7rem",color:"rgba(255,255,255,0.4)",display:"flex",gap:10}}>
                        <span><Zap size={10} style={{display:"inline"}}/> {skill.questions} questions</span>
                        <span><Clock size={10} style={{display:"inline"}}/> {skill.duration}</span>
                      </div>
                    </div>
                    <div style={{fontSize:"0.65rem",color:"rgba(255,255,255,0.3)"}}>{skill.takers.toLocaleString()} professionals tested</div>
                    <button onClick={()=>startTest(skill)} style={{width:"100%",padding:"10px",background:"linear-gradient(135deg,#1a6bff,#0050dd)",border:"none",borderRadius:9,color:"white",fontWeight:700,fontSize:"0.82rem",cursor:"pointer",boxShadow:"0 2px 12px rgba(26,107,255,0.3)"}}>
                      Start Assessment →
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

          {phase==="test"&&(
            <div style={{maxWidth:640,margin:"0 auto"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
                <div style={{fontSize:"0.9rem",fontWeight:700}}>{selected?.label} Assessment</div>
                <div style={{display:"flex",items:"center",gap:8,padding:"7px 14px",background:"rgba(240,192,64,0.08)",border:"1px solid rgba(240,192,64,0.2)",borderRadius:8,color:"#f0c040",fontWeight:800,fontSize:"0.85rem"}}>
                  <Clock size={14} style={{display:"inline",marginRight:4}}/>{fmt(timeLeft)}
                </div>
              </div>

              {/* Progress */}
              <div style={{marginBottom:20}}>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:"0.7rem",color:"rgba(255,255,255,0.4)",marginBottom:6}}>
                  <span>Question {qIndex+1} of {SAMPLE_Qs.length}</span>
                  <span>{Math.round(((qIndex)/SAMPLE_Qs.length)*100)}% complete</span>
                </div>
                <div style={{height:5,background:"rgba(26,107,255,0.1)",borderRadius:3,overflow:"hidden"}}>
                  <div style={{width:`${(qIndex/SAMPLE_Qs.length)*100}%`,height:"100%",background:"linear-gradient(90deg,#1a6bff,#00e676)",borderRadius:3,transition:"width 0.3s"}}/>
                </div>
              </div>

              <div style={{background:"rgba(4,15,36,0.95)",border:"1px solid rgba(26,107,255,0.2)",borderRadius:20,padding:28}}>
                <div style={{fontWeight:700,fontSize:"1.05rem",lineHeight:1.55,marginBottom:24,color:"white"}}>{SAMPLE_Qs[qIndex].q}</div>
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  {SAMPLE_Qs[qIndex].options.map((opt,i)=>(
                    <button key={i} onClick={()=>!submitting&&answer(i)} disabled={submitting} style={{padding:"14px 18px",textAlign:"left",background:"rgba(26,107,255,0.05)",border:"1px solid rgba(26,107,255,0.15)",borderRadius:12,color:"rgba(255,255,255,0.8)",fontSize:"0.9rem",cursor:"pointer",transition:"all 0.15s",fontWeight:500,display:"flex",alignItems:"center",gap:10}}>
                      <span style={{width:24,height:24,borderRadius:"50%",border:"1.5px solid rgba(26,107,255,0.3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.7rem",fontWeight:700,color:"#4da6ff",flexShrink:0,fontFamily:"monospace"}}>
                        {["A","B","C","D"][i]}
                      </span>
                      {opt}
                    </button>
                  ))}
                </div>
                {submitting&&<div style={{textAlign:"center",marginTop:16,color:"rgba(255,255,255,0.5)",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}><Loader2 size={16} style={{animation:"spin 1s linear infinite"}}/>Scoring...</div>}
              </div>
            </div>
          )}

          {phase==="result"&&(
            <div style={{maxWidth:540,margin:"0 auto",textAlign:"center"}}>
              <div style={{display:"flex",justifyContent:"center",marginBottom:16}}>
                {passed?<Jobs50Badge size={130}/>:<div style={{fontSize:"4rem"}}>📋</div>}
              </div>
              <h2 style={{fontSize:"1.8rem",fontWeight:900,marginBottom:6,color:passed?"#00e676":"#f0c040"}}>
                {passed?"Assessment Passed! 🎉":"Not Quite There"}
              </h2>
              <div style={{fontSize:"3rem",fontWeight:900,color:passed?"#00e676":"#f0c040",marginBottom:4}}>{score}%</div>
              <div style={{color:"rgba(255,255,255,0.45)",marginBottom:20,fontSize:"0.88rem"}}>Pass score: 75% · {SAMPLE_Qs.length} questions</div>

              {passed?(
                <div style={{padding:16,background:"rgba(0,200,83,0.08)",border:"1px solid rgba(0,200,83,0.2)",borderRadius:14,marginBottom:20,textAlign:"left"}}>
                  <div style={{fontWeight:700,color:"#00e676",marginBottom:8}}>Rewards Earned:</div>
                  {[`✅ ${selected?.label} Verified badge added to your Trust Passport`,`⭐ +${parseInt(selected?.badge||"0")} Trust Score points applied`,`🏆 Skill endorsement visible to all clients`,`📈 Profile now ranks higher in AI matching`].map((r,i)=>(
                    <div key={i} style={{fontSize:"0.82rem",color:"rgba(255,255,255,0.7)",marginBottom:4}}>{r}</div>
                  ))}
                </div>
              ):(
                <div style={{padding:14,background:"rgba(240,192,64,0.07)",border:"1px solid rgba(240,192,64,0.18)",borderRadius:12,marginBottom:20,fontSize:"0.82rem",color:"rgba(255,255,255,0.6)",lineHeight:1.6}}>
                  You can retake this assessment in 7 days. Review the {selected?.label} documentation and try again — the questions rotate each attempt.
                </div>
              )}

              <div style={{display:"flex",gap:10,justifyContent:"center"}}>
                <button onClick={()=>setPhase("select")} style={{padding:"11px 24px",borderRadius:10,border:"1px solid rgba(26,107,255,0.2)",background:"rgba(26,107,255,0.08)",color:"#4da6ff",fontWeight:600,cursor:"pointer",fontSize:"0.88rem"}}>
                  Back to Assessments
                </button>
                {passed&&<button style={{padding:"11px 24px",borderRadius:10,background:"linear-gradient(135deg,#d4af37,#c9a227)",border:"none",color:"#0a0800",fontWeight:800,cursor:"pointer",fontSize:"0.88rem"}}>
                  View My Passport
                </button>}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
