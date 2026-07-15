
"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { VeritasEmblem, VeritasVerifiedBadge } from "@/components/badges/VeritasBadges";
import { Eye, EyeOff, Loader2, ArrowRight, Shield } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const FLOATING = [
  { score:990, size:80, x:"8%",  y:"15%", delay:0   },
  { score:940, size:65, x:"88%", y:"10%", delay:0.4 },
  { score:870, size:55, x:"5%",  y:"70%", delay:0.8 },
  { score:910, size:70, x:"85%", y:"65%", delay:1.2 },
  { score:830, size:58, x:"2%",  y:"42%", delay:1.0 },
];

export default function LoginPage() {
  const router      = useRouter();
  const params      = useSearchParams();
  const { login, isAuth } = useAuth();
  const redirect    = params.get("redirect") || "/dashboard";

  const [email,setEmail]     = useState("");
  const [password,setPassword] = useState("");
  const [showPw,setShowPw]   = useState(false);
  const [loading,setLoading] = useState(false);
  const [error,setError]     = useState("");
  const [mounted,setMounted] = useState(false);
  const [hovBtn,setHovBtn]   = useState(false);

  useEffect(() => { setTimeout(() => setMounted(true), 50); }, []);
  useEffect(() => { if (isAuth) router.replace(redirect); }, [isAuth]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) { setError("Please fill in all fields"); return; }
    setLoading(true); setError("");
    try {
      await login(email, password);
      // Force hard redirect to dashboard
      window.location.href = redirect || "/dashboard";
    } catch (err: any) {
      setError(err.message || "Login failed — please try again");
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight:"100vh", background:"#010812", display:"flex", overflow:"hidden", position:"relative", color:"white" }}>
      <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(circle,rgba(26,107,255,0.18) 1px,transparent 1px)", backgroundSize:"28px 28px", opacity:0.2 }}/>
      <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 80% 60% at 50% 0%,rgba(26,107,255,0.12),transparent 70%)" }}/>

      {FLOATING.map((b,i) => (
        <div key={i} style={{ position:"absolute", left:b.x, top:b.y, opacity:mounted?0.15:0, transform:mounted?"translateY(0) scale(1)":"translateY(20px) scale(0.8)", transition:`all 1.2s ease ${b.delay}s`, pointerEvents:"none", animation:`floatB${i} 6s ease-in-out ${b.delay}s infinite alternate` }}>
          <VeritasVerifiedBadge score={b.score} size={b.size}/>
        </div>
      ))}

      <style>{`
        ${FLOATING.map((_,i)=>`@keyframes floatB${i}{from{transform:translateY(0)}to{transform:translateY(-12px)}}`).join("")}
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        .vt-input:focus{border-color:rgba(26,107,255,0.5)!important;box-shadow:0 0 0 3px rgba(26,107,255,0.1)!important;outline:none;}
        .vt-input{transition:border-color 0.2s,box-shadow 0.2s;}
      `}</style>

      {/* Left — branding */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", padding:48, position:"relative", zIndex:10, opacity:mounted?1:0, transform:mounted?"translateX(0)":"translateX(-30px)", transition:"all 0.8s ease 0.1s" }}>
        <div style={{ maxWidth:400, textAlign:"center" }}>
          <div style={{ display:"flex", justifyContent:"center", marginBottom:24 }}><VeritasVerifiedBadge score={845} size={170}/></div>
          <h1 style={{ fontSize:"2.4rem", fontWeight:900, marginBottom:10, lineHeight:1.2 }}>
            Truth Becomes<br/><span style={{ background:"linear-gradient(135deg,#f0c040,#c9a227)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Trust</span>
          </h1>
          <p style={{ color:"rgba(255,255,255,0.45)", fontSize:"0.92rem", lineHeight:1.75, marginBottom:24 }}>One verified badge. Portable across every platform. Your reputation follows you everywhere.</p>
          {[["🛡️","Blockchain-verified identity"],["💰","Smart escrow on every job"],["🏆","Trust Score that grows with you"]].map(([ic,t],i) => (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 16px", background:"rgba(26,107,255,0.06)", border:"1px solid rgba(26,107,255,0.14)", borderRadius:10, marginBottom:8, opacity:mounted?1:0, transform:mounted?"translateX(0)":"translateX(-20px)", transition:`all 0.6s ease ${0.3+i*0.15}s` }}>
              <span style={{ fontSize:"1.1rem" }}>{ic}</span>
              <span style={{ color:"rgba(255,255,255,0.7)", fontSize:"0.85rem" }}>{t}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ width:1, background:"linear-gradient(180deg,transparent,rgba(26,107,255,0.2),transparent)", alignSelf:"stretch", zIndex:10 }}/>

      {/* Right — form */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", padding:48, position:"relative", zIndex:10, opacity:mounted?1:0, transform:mounted?"translateX(0)":"translateX(30px)", transition:"all 0.8s ease 0.2s" }}>
        <div style={{ width:"100%", maxWidth:380 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:28 }}>
            <VeritasEmblem size={38}/>
            <div><div style={{ fontSize:"1rem", fontWeight:900, letterSpacing:"0.08em" }}>VERITAS</div><div style={{ fontSize:"0.5rem", fontWeight:600, letterSpacing:"0.2em", color:"#00d4ff", textTransform:"uppercase" }}>Truth Becomes Trust</div></div>
          </div>

          <h2 style={{ fontSize:"1.8rem", fontWeight:900, marginBottom:6 }}>Welcome back</h2>
          <p style={{ color:"rgba(255,255,255,0.4)", marginBottom:24, fontSize:"0.85rem" }}>
            No account?{" "}<span onClick={()=>router.push("/signup")} style={{ color:"#4da6ff", cursor:"pointer", fontWeight:600 }}>Sign up free</span>
          </p>

          <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <div>
              <label style={{ fontSize:"0.65rem", fontWeight:700, color:"rgba(255,255,255,0.4)", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:5, display:"block" }}>Email</label>
              <input className="vt-input" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com"
                style={{ width:"100%", padding:"13px 14px", background:"rgba(6,18,41,0.8)", border:"1px solid rgba(26,107,255,0.2)", borderRadius:10, color:"white", fontSize:"0.9rem" }}/>
            </div>
            <div>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                <label style={{ fontSize:"0.65rem", fontWeight:700, color:"rgba(255,255,255,0.4)", textTransform:"uppercase", letterSpacing:"0.1em" }}>Password</label>
                <span style={{ fontSize:"0.72rem", color:"#4da6ff", cursor:"pointer" }}>Forgot?</span>
              </div>
              <div style={{ position:"relative" }}>
                <input className="vt-input" type={showPw?"text":"password"} value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••"
                  style={{ width:"100%", padding:"13px 44px 13px 14px", background:"rgba(6,18,41,0.8)", border:"1px solid rgba(26,107,255,0.2)", borderRadius:10, color:"white", fontSize:"0.9rem" }}/>
                <button type="button" onClick={()=>setShowPw(!showPw)} style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"rgba(255,255,255,0.35)", padding:4 }}>
                  {showPw?<EyeOff size={15}/>:<Eye size={15}/>}
                </button>
              </div>
            </div>

            {error&&<div style={{ padding:"10px 14px", background:"rgba(255,85,85,0.08)", border:"1px solid rgba(255,85,85,0.25)", borderRadius:9, fontSize:"0.82rem", color:"#ff7777" }}>⚠️ {error}</div>}

            <button type="submit" disabled={loading}
              onMouseEnter={()=>setHovBtn(true)} onMouseLeave={()=>setHovBtn(false)}
              style={{ width:"100%", padding:"14px", background:hovBtn?"linear-gradient(135deg,#2a7bff,#1060ee)":"linear-gradient(135deg,#1a6bff,#0050dd)", border:"none", borderRadius:11, color:"white", fontWeight:800, fontSize:"1rem", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:9, boxShadow:hovBtn?"0 8px 32px rgba(26,107,255,0.5)":"0 4px 18px rgba(26,107,255,0.35)", transform:hovBtn?"translateY(-2px)":"translateY(0)", transition:"all 0.2s ease", opacity:loading?0.7:1 }}>
              {loading?<><Loader2 size={17} style={{ animation:"spin 1s linear infinite" }}/>Signing in...</>:<>Sign In <ArrowRight size={17}/></>}
            </button>
          </form>

          <div style={{ display:"flex", alignItems:"center", gap:10, margin:"20px 0" }}>
            <div style={{ flex:1, height:1, background:"rgba(26,107,255,0.1)" }}/><span style={{ fontSize:"0.7rem", color:"rgba(255,255,255,0.3)" }}>or</span><div style={{ flex:1, height:1, background:"rgba(26,107,255,0.1)" }}/>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:20 }}>
            {[["🔵","Google"],["⬛","GitHub"]].map(([ic,name])=>(
              <button key={name} style={{ padding:"11px", background:"rgba(26,107,255,0.06)", border:"1px solid rgba(26,107,255,0.16)", borderRadius:10, color:"rgba(255,255,255,0.65)", fontSize:"0.84rem", fontWeight:600, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:7, transition:"all 0.2s" }}
                onMouseEnter={e=>{(e.currentTarget as HTMLButtonElement).style.background="rgba(26,107,255,0.12)";}}
                onMouseLeave={e=>{(e.currentTarget as HTMLButtonElement).style.background="rgba(26,107,255,0.06)";}}>
                <span>{ic}</span>{name}
              </button>
            ))}
          </div>

          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:6, fontSize:"0.7rem", color:"rgba(255,255,255,0.28)" }}>
            <Shield size={11} color="rgba(26,107,255,0.4)"/> SSL encrypted · Blockchain secured
          </div>
        </div>
      </div>
    </div>
  );
}
