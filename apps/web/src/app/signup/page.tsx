
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { VeritasEmblem, NewMemberBadge } from "@/components/badges/VeritasBadges";
import { Eye, EyeOff, Loader2, ArrowRight, User, Briefcase } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function SignupPage() {
  const router = useRouter();
  const { register, isAuth } = useAuth();

  const [accountType,setAccountType] = useState<"worker"|"client">("worker");
  const [name,setName]       = useState("");
  const [email,setEmail]     = useState("");
  const [password,setPassword] = useState("");
  const [showPw,setShowPw]   = useState(false);
  const [loading,setLoading] = useState(false);
  const [error,setError]     = useState("");
  const [done,setDone]       = useState(false);
  const [mounted,setMounted] = useState(false);
  const [hovBtn,setHovBtn]   = useState(false);

  useEffect(()=>{ setTimeout(()=>setMounted(true),50); },[]);
  useEffect(()=>{ if(isAuth) router.replace("/dashboard"); },[isAuth]);

  const pwStrength = password.length===0?0:password.length<6?1:password.length<10?2:/[A-Z]/.test(password)&&/[0-9]/.test(password)?4:3;
  const pwColors   = ["","#ff5555","#f0c040","#4da6ff","#00e676"];
  const pwLabels   = ["","Too short","Fair","Good","Strong"];

  async function handleSubmit(e:React.FormEvent){
    e.preventDefault();
    if(!name||!email||!password){setError("Please fill in all fields");return;}
    if(password.length<6){setError("Password must be at least 6 characters");return;}
    setLoading(true);setError("");
    try{
      await register(name,email,password,accountType);
      setDone(true);
      setTimeout(()=>router.replace("/onboarding"),2000);
    }catch(err:any){
      setError(err.message||"Registration failed");
      setLoading(false);
    }
  }

  return(
    <div style={{ minHeight:"100vh", background:"#010812", display:"flex", alignItems:"center", justifyContent:"center", padding:16, position:"relative", overflow:"hidden", color:"white" }}>
      <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(circle,rgba(26,107,255,0.18) 1px,transparent 1px)", backgroundSize:"28px 28px", opacity:0.18 }}/>
      <style>{`
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes popIn{from{opacity:0;transform:scale(0.7)}to{opacity:1;transform:scale(1)}}
        .vt-input:focus{border-color:rgba(26,107,255,0.5)!important;box-shadow:0 0 0 3px rgba(26,107,255,0.1)!important;outline:none;}
        .vt-input{transition:border-color 0.2s,box-shadow 0.2s;}
      `}</style>

      <div style={{ width:"100%", maxWidth:460, position:"relative", zIndex:10, opacity:mounted?1:0, transform:mounted?"translateY(0)":"translateY(24px)", transition:"all 0.7s ease" }}>
        {done?(
          <div style={{ background:"rgba(4,15,36,0.98)", border:"1px solid rgba(0,200,83,0.25)", borderRadius:24, padding:40, textAlign:"center" }}>
            <div style={{ display:"flex", justifyContent:"center", marginBottom:16, animation:"popIn 0.6s ease" }}><NewMemberBadge size={140}/></div>
            <h2 style={{ fontSize:"1.8rem", fontWeight:900, marginBottom:8 }}>Welcome to Veritas! 🎉</h2>
            <p style={{ color:"rgba(255,255,255,0.5)", marginBottom:20, lineHeight:1.7 }}>New Member badge earned. <strong style={{ color:"#00e676" }}>+50 Trust Score</strong> applied. Setting up your profile...</p>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8, color:"#4da6ff", fontSize:"0.85rem" }}>
              <Loader2 size={15} style={{ animation:"spin 1s linear infinite" }}/> Taking you to onboarding...
            </div>
          </div>
        ):(
          <div style={{ background:"rgba(4,15,36,0.98)", border:"1.5px solid rgba(26,107,255,0.2)", borderRadius:24, padding:32 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:22 }}>
              <VeritasEmblem size={38}/>
              <div><div style={{ fontSize:"1rem", fontWeight:900, letterSpacing:"0.08em" }}>VERITAS</div><div style={{ fontSize:"0.5rem", fontWeight:600, letterSpacing:"0.2em", color:"#00d4ff", textTransform:"uppercase" }}>Truth Becomes Trust</div></div>
            </div>
            <h2 style={{ fontSize:"1.6rem", fontWeight:900, marginBottom:4 }}>Create your account</h2>
            <p style={{ color:"rgba(255,255,255,0.4)", marginBottom:18, fontSize:"0.84rem" }}>
              Already have an account?{" "}<span onClick={()=>router.push("/login")} style={{ color:"#4da6ff", cursor:"pointer", fontWeight:600 }}>Sign in</span>
            </p>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:18 }}>
              {([["worker","I'm a Professional",User,"Find work & build reputation"],["client","I'm Hiring",Briefcase,"Find verified talent"]] as const).map(([t,l,Icon,sub])=>(
                <button key={t} onClick={()=>setAccountType(t)} style={{ padding:"12px 8px", background:accountType===t?"rgba(26,107,255,0.14)":"rgba(26,107,255,0.04)", border:`1.5px solid ${accountType===t?"rgba(26,107,255,0.5)":"rgba(26,107,255,0.12)"}`, borderRadius:12, cursor:"pointer", textAlign:"center", transition:"all 0.2s", transform:accountType===t?"translateY(-1px)":"translateY(0)", boxShadow:accountType===t?"0 4px 16px rgba(26,107,255,0.2)":"none" }}>
                  <Icon size={18} color={accountType===t?"#4da6ff":"rgba(255,255,255,0.3)"} style={{ margin:"0 auto 5px" }}/>
                  <div style={{ fontWeight:700, fontSize:"0.8rem", color:accountType===t?"#4da6ff":"rgba(255,255,255,0.6)", marginBottom:2 }}>{l}</div>
                  <div style={{ fontSize:"0.6rem", color:"rgba(255,255,255,0.35)" }}>{sub}</div>
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {[{l:"Full Name",v:name,s:setName,p:"Alex Chen",t:"text"},{l:"Email",v:email,s:setEmail,p:"you@example.com",t:"email"}].map((f,i)=>(
                <div key={i}>
                  <label style={{ fontSize:"0.65rem", fontWeight:700, color:"rgba(255,255,255,0.4)", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:5, display:"block" }}>{f.l}</label>
                  <input className="vt-input" type={f.t} value={f.v} onChange={e=>f.s(e.target.value)} placeholder={f.p}
                    style={{ width:"100%", padding:"12px 14px", background:"rgba(6,18,41,0.8)", border:"1px solid rgba(26,107,255,0.18)", borderRadius:9, color:"white", fontSize:"0.9rem" }}/>
                </div>
              ))}
              <div>
                <label style={{ fontSize:"0.65rem", fontWeight:700, color:"rgba(255,255,255,0.4)", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:5, display:"block" }}>Password</label>
                <div style={{ position:"relative" }}>
                  <input className="vt-input" type={showPw?"text":"password"} value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••"
                    style={{ width:"100%", padding:"12px 44px 12px 14px", background:"rgba(6,18,41,0.8)", border:"1px solid rgba(26,107,255,0.18)", borderRadius:9, color:"white", fontSize:"0.9rem" }}/>
                  <button type="button" onClick={()=>setShowPw(!showPw)} style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"rgba(255,255,255,0.35)", padding:4 }}>
                    {showPw?<EyeOff size={15}/>:<Eye size={15}/>}
                  </button>
                </div>
                {password.length>0&&(
                  <div style={{ marginTop:6 }}>
                    <div style={{ display:"flex", gap:4, marginBottom:3 }}>
                      {[1,2,3,4].map(i=><div key={i} style={{ flex:1, height:3, borderRadius:2, background:i<=pwStrength?pwColors[pwStrength]:"rgba(26,107,255,0.1)", transition:"background 0.3s" }}/>)}
                    </div>
                    <div style={{ fontSize:"0.63rem", color:pwColors[pwStrength], fontWeight:600 }}>{pwLabels[pwStrength]}</div>
                  </div>
                )}
              </div>

              {error&&<div style={{ padding:"10px 14px", background:"rgba(255,85,85,0.08)", border:"1px solid rgba(255,85,85,0.25)", borderRadius:9, fontSize:"0.82rem", color:"#ff7777" }}>⚠️ {error}</div>}

              <button type="submit" disabled={loading}
                onMouseEnter={()=>setHovBtn(true)} onMouseLeave={()=>setHovBtn(false)}
                style={{ width:"100%", padding:"14px", background:hovBtn?"linear-gradient(135deg,#2a7bff,#1060ee)":"linear-gradient(135deg,#1a6bff,#0050dd)", border:"none", borderRadius:11, color:"white", fontWeight:800, fontSize:"1rem", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:9, boxShadow:hovBtn?"0 8px 32px rgba(26,107,255,0.5)":"0 4px 18px rgba(26,107,255,0.35)", transform:hovBtn?"translateY(-2px)":"translateY(0)", transition:"all 0.2s ease", opacity:loading?0.7:1, marginTop:4 }}>
                {loading?<><Loader2 size={17} style={{ animation:"spin 1s linear infinite" }}/>Creating account...</>:<>Create Free Account <ArrowRight size={17}/></>}
              </button>
              <p style={{ fontSize:"0.68rem", color:"rgba(255,255,255,0.28)", textAlign:"center", lineHeight:1.6 }}>
                By signing up you agree to our <span style={{ color:"#4da6ff", cursor:"pointer" }}>Terms</span> and <span style={{ color:"#4da6ff", cursor:"pointer" }}>Privacy Policy</span>
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
