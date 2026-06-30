
"use client";
import { useState } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import TopBar from "@/components/topbar/TopBar";
import { Key, Plus, Copy, CheckCheck, Eye, EyeOff, Trash2, Shield, Zap, CheckCircle2, Loader2, X, AlertTriangle } from "lucide-react";

const KEYS = [
  {id:"K1",name:"Production App",     key:"vrt_live_4xK9mP2nQ8rL7vB3sN6wE1tJ5hA0cF",  created:"Jun 1",  lastUsed:"2m ago",  calls:48291, limit:"100K/mo", env:"live",    perms:["read","write","webhooks"]},
  {id:"K2",name:"Development Server", key:"vrt_test_2aR7kM5pQ3nL8vX6sE9wB4tJ1hC0dG", created:"May 15", lastUsed:"1h ago",  calls:12847, limit:"10K/mo",  env:"test",    perms:["read","write"]},
  {id:"K3",name:"Analytics Dashboard",key:"vrt_live_7bS2nP8mQ4kL9vC1sW6eJ3hB5tA0fD", created:"Apr 10", lastUsed:"3h ago",  calls:7293,  limit:"50K/mo",  env:"live",    perms:["read"]},
];

export default function APIKeysPage() {
  const [keys, setKeys]         = useState(KEYS);
  const [showNew, setShowNew]   = useState(false);
  const [newName, setNewName]   = useState("");
  const [newEnv, setNewEnv]     = useState("test");
  const [newPerms, setNewPerms] = useState(["read"]);
  const [creating, setCreating] = useState(false);
  const [created, setCreated]   = useState(false);
  const [newKey, setNewKey]     = useState("");
  const [revealed, setRevealed] = useState<string[]>([]);
  const [copied, setCopied]     = useState<string|null>(null);

  function maskKey(k:string){ return k.slice(0,12)+"•".repeat(24)+k.slice(-6); }
  function copyKey(id:string, key:string){ navigator.clipboard.writeText(key); setCopied(id); setTimeout(()=>setCopied(null),2000); }
  function toggleReveal(id:string){ setRevealed(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id]); }
  function deleteKey(id:string){ if(confirm("Delete this API key? This cannot be undone.")) setKeys(p=>p.filter(k=>k.id!==id)); }
  function togglePerm(p:string){ setNewPerms(prev=>prev.includes(p)?prev.filter(x=>x!==p):[...prev,p]); }

  function create(){
    if(!newName) return;
    setCreating(true);
    setTimeout(()=>{
      const generated = `vrt_${newEnv}_${Math.random().toString(36).slice(2,10)}${Math.random().toString(36).slice(2,18)}`;
      setNewKey(generated);
      setKeys(p=>[{id:"K"+Date.now(),name:newName,key:generated,created:"Now",lastUsed:"Never",calls:0,limit:"10K/mo",env:newEnv,perms:newPerms},...p]);
      setCreating(false);
      setCreated(true);
    },1000);
  }

  const totalCalls = keys.reduce((a,k)=>a+k.calls,0);

  return(
    <div style={{display:"flex",minHeight:"100vh",background:"#010812"}}>
      <Sidebar/>
      <div style={{flex:1,display:"flex",flexDirection:"column"}}>
        <TopBar/>
        <main style={{flex:1,overflowY:"auto",padding:24,color:"white"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24,flexWrap:"wrap",gap:12}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}><Key size={28} color="#a78bfa"/><h1 style={{fontSize:"1.8rem",fontWeight:900,margin:0}}>API Keys</h1></div>
            <button onClick={()=>setShowNew(true)} style={{display:"flex",alignItems:"center",gap:7,padding:"11px 20px",background:"linear-gradient(135deg,#a78bfa,#7c3aed)",border:"none",borderRadius:10,color:"white",fontWeight:700,fontSize:"0.88rem",cursor:"pointer",boxShadow:"0 3px 14px rgba(167,139,250,0.35)"}}><Plus size={17}/>Create API Key</button>
          </div>

          {/* Stats */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:20}}>
            {[{l:"Active Keys",v:keys.length,c:"#a78bfa"},{l:"Total API Calls",v:totalCalls.toLocaleString(),c:"#4da6ff"},{l:"Plan Limit",v:"100K/mo",c:"#00e676"}].map((s,i)=>(
              <div key={i} style={{background:"rgba(4,15,36,0.9)",border:"1px solid rgba(26,107,255,0.14)",borderRadius:14,padding:"18px 16px",textAlign:"center"}}>
                <div style={{fontSize:"1.8rem",fontWeight:900,color:s.c,marginBottom:4}}>{s.v}</div>
                <div style={{fontSize:"0.7rem",color:"rgba(255,255,255,0.4)"}}>{s.l}</div>
              </div>
            ))}
          </div>

          {/* Warning */}
          <div style={{display:"flex",alignItems:"flex-start",gap:10,padding:"12px 16px",background:"rgba(240,192,64,0.06)",border:"1px solid rgba(240,192,64,0.18)",borderRadius:12,marginBottom:16,fontSize:"0.78rem",color:"rgba(255,255,255,0.55)",lineHeight:1.6}}>
            <AlertTriangle size={16} color="#f0c040" style={{flexShrink:0,marginTop:1}}/>
            <span>Keep your API keys secret. Never expose them in client-side code or public repositories. Rotate keys immediately if compromised.</span>
          </div>

          {/* Keys list */}
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            {keys.map(k=>(
              <div key={k.id} style={{background:"rgba(4,15,36,0.9)",border:"1px solid rgba(26,107,255,0.14)",borderRadius:16,padding:20}}>
                <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:12,marginBottom:12,flexWrap:"wrap"}}>
                  <div>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                      <span style={{fontWeight:800,fontSize:"0.95rem"}}>{k.name}</span>
                      <span style={{fontSize:"0.62rem",padding:"2px 7px",borderRadius:5,fontWeight:700,background:k.env==="live"?"rgba(0,200,83,0.1)":"rgba(240,192,64,0.1)",border:`1px solid ${k.env==="live"?"rgba(0,200,83,0.22)":"rgba(240,192,64,0.22)"}`,color:k.env==="live"?"#00e676":"#f0c040"}}>{k.env}</span>
                    </div>
                    <div style={{fontSize:"0.72rem",color:"rgba(255,255,255,0.38)",display:"flex",gap:10}}>
                      <span>Created {k.created}</span>
                      <span>·</span>
                      <span>Last used {k.lastUsed}</span>
                      <span>·</span>
                      <span style={{color:"#4da6ff",fontWeight:600}}>{k.calls.toLocaleString()} calls</span>
                    </div>
                  </div>
                  <div style={{display:"flex",gap:6,flexShrink:0}}>
                    {k.perms.map(p=><span key={p} style={{fontSize:"0.62rem",padding:"2px 7px",background:"rgba(167,139,250,0.1)",border:"1px solid rgba(167,139,250,0.2)",borderRadius:5,color:"#a78bfa",fontWeight:600}}>{p}</span>)}
                  </div>
                </div>

                {/* Key display */}
                <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:10}}>
                  <div style={{flex:1,padding:"10px 14px",background:"rgba(2,8,20,0.8)",border:"1px solid rgba(26,107,255,0.15)",borderRadius:9,fontFamily:"monospace",fontSize:"0.78rem",color:"rgba(255,255,255,0.65)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                    {revealed.includes(k.id)?k.key:maskKey(k.key)}
                  </div>
                  <button onClick={()=>toggleReveal(k.id)} style={{padding:"9px",background:"rgba(26,107,255,0.08)",border:"1px solid rgba(26,107,255,0.15)",borderRadius:8,cursor:"pointer",color:"rgba(255,255,255,0.5)"}}>
                    {revealed.includes(k.id)?<EyeOff size={15}/>:<Eye size={15}/>}
                  </button>
                  <button onClick={()=>copyKey(k.id,k.key)} style={{display:"flex",alignItems:"center",gap:4,padding:"9px 14px",background:copied===k.id?"rgba(0,200,83,0.12)":"rgba(26,107,255,0.08)",border:`1px solid ${copied===k.id?"rgba(0,200,83,0.3)":"rgba(26,107,255,0.15)"}`,borderRadius:8,color:copied===k.id?"#00e676":"#4da6ff",fontSize:"0.75rem",fontWeight:600,cursor:"pointer"}}>
                    {copied===k.id?<CheckCheck size={13}/>:<Copy size={13}/>}{copied===k.id?"Copied!":"Copy"}
                  </button>
                  <button onClick={()=>deleteKey(k.id)} style={{padding:"9px",background:"rgba(255,85,85,0.07)",border:"1px solid rgba(255,85,85,0.18)",borderRadius:8,cursor:"pointer",color:"rgba(255,85,85,0.7)"}}>
                    <Trash2 size={15}/>
                  </button>
                </div>

                {/* Usage bar */}
                <div>
                  <div style={{display:"flex",justifyContent:"space-between",fontSize:"0.65rem",marginBottom:4,color:"rgba(255,255,255,0.38)"}}><span>Monthly usage</span><span>{k.calls.toLocaleString()} / {k.limit}</span></div>
                  <div style={{height:4,background:"rgba(26,107,255,0.08)",borderRadius:2,overflow:"hidden"}}>
                    <div style={{width:`${Math.min((k.calls/100000)*100,100)}%`,height:"100%",background:"#a78bfa",borderRadius:2}}/>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {showNew&&(
            <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",backdropFilter:"blur(8px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:50,padding:16}}>
              <div style={{background:"rgba(4,15,36,0.99)",border:"1px solid rgba(167,139,250,0.25)",borderRadius:22,padding:28,width:"100%",maxWidth:440,color:"white"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
                  <div style={{fontWeight:900,fontSize:"1.1rem"}}>{created?"Key Created!":"Create API Key"}</div>
                  <button onClick={()=>{setShowNew(false);setCreated(false);setNewKey("");setNewName("");}} style={{background:"none",border:"none",color:"rgba(255,255,255,0.4)",cursor:"pointer"}}><X size={20}/></button>
                </div>
                {created?(
                  <div>
                    <div style={{padding:14,background:"rgba(0,200,83,0.07)",border:"1px solid rgba(0,200,83,0.2)",borderRadius:12,marginBottom:14,display:"flex",alignItems:"flex-start",gap:8}}><AlertTriangle size={16} color="#f0c040" style={{flexShrink:0,marginTop:2}}/><div style={{fontSize:"0.78rem",color:"rgba(255,255,255,0.6)",lineHeight:1.6}}>Copy this key now — it won't be shown again.</div></div>
                    <div style={{display:"flex",gap:8,marginBottom:16}}>
                      <div style={{flex:1,padding:"11px 14px",background:"rgba(2,8,20,0.8)",border:"1px solid rgba(167,139,250,0.2)",borderRadius:9,fontFamily:"monospace",fontSize:"0.75rem",color:"rgba(255,255,255,0.8)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{newKey}</div>
                      <button onClick={()=>copyKey("new",newKey)} style={{padding:"11px 14px",background:"linear-gradient(135deg,#a78bfa,#7c3aed)",border:"none",borderRadius:9,color:"white",fontWeight:700,cursor:"pointer",fontSize:"0.8rem",display:"flex",alignItems:"center",gap:5}}>{copied==="new"?<CheckCheck size={13}/>:<Copy size={13}/>}{copied==="new"?"Copied!":"Copy"}</button>
                    </div>
                    <button onClick={()=>{setShowNew(false);setCreated(false);setNewKey("");setNewName("");}} style={{width:"100%",padding:"12px",background:"rgba(26,107,255,0.1)",border:"1px solid rgba(26,107,255,0.2)",borderRadius:10,color:"#4da6ff",fontWeight:600,cursor:"pointer"}}>Done</button>
                  </div>
                ):(
                  <>
                    <div style={{display:"flex",flexDirection:"column",gap:11,marginBottom:18}}>
                      <div><label style={{fontSize:"0.68rem",fontWeight:700,color:"rgba(255,255,255,0.4)",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:5,display:"block"}}>Key Name</label><input value={newName} onChange={e=>setNewName(e.target.value)} placeholder="e.g. Production Backend" style={{width:"100%",padding:"11px 14px",background:"rgba(6,18,41,0.8)",border:"1px solid rgba(167,139,250,0.18)",borderRadius:9,color:"white",fontSize:"0.88rem",outline:"none"}}/></div>
                      <div><label style={{fontSize:"0.68rem",fontWeight:700,color:"rgba(255,255,255,0.4)",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:5,display:"block"}}>Environment</label>
                        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                          {[["live","Live / Production"],["test","Test / Sandbox"]].map(([v,l])=>(
                            <button key={v} onClick={()=>setNewEnv(v)} style={{padding:"10px",borderRadius:9,border:`1px solid ${newEnv===v?v==="live"?"rgba(0,200,83,0.4)":"rgba(240,192,64,0.35)":"rgba(26,107,255,0.15)"}`,background:newEnv===v?v==="live"?"rgba(0,200,83,0.08)":"rgba(240,192,64,0.08)":"rgba(26,107,255,0.04)",color:newEnv===v?v==="live"?"#00e676":"#f0c040":"rgba(255,255,255,0.5)",fontWeight:600,fontSize:"0.8rem",cursor:"pointer"}}>{l}</button>
                          ))}
                        </div>
                      </div>
                      <div><label style={{fontSize:"0.68rem",fontWeight:700,color:"rgba(255,255,255,0.4)",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:5,display:"block"}}>Permissions</label>
                        <div style={{display:"flex",gap:7}}>
                          {["read","write","webhooks","admin"].map(p=>(
                            <button key={p} onClick={()=>togglePerm(p)} style={{flex:1,padding:"8px",borderRadius:8,border:`1px solid ${newPerms.includes(p)?"rgba(167,139,250,0.4)":"rgba(26,107,255,0.14)"}`,background:newPerms.includes(p)?"rgba(167,139,250,0.12)":"rgba(26,107,255,0.04)",color:newPerms.includes(p)?"#a78bfa":"rgba(255,255,255,0.45)",fontSize:"0.72rem",fontWeight:600,cursor:"pointer"}}>{p}</button>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div style={{display:"flex",gap:10}}>
                      <button onClick={()=>setShowNew(false)} style={{flex:1,padding:"12px",borderRadius:10,border:"1px solid rgba(26,107,255,0.15)",background:"transparent",color:"rgba(255,255,255,0.5)",cursor:"pointer"}}>Cancel</button>
                      <button onClick={create} disabled={!newName||creating} style={{flex:2,padding:"12px",background:"linear-gradient(135deg,#a78bfa,#7c3aed)",border:"none",borderRadius:10,color:"white",fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:7,opacity:!newName?0.4:1}}>
                        {creating?<Loader2 size={15} style={{animation:"spin 1s linear infinite"}}/>:<Key size={15}/>}{creating?"Creating...":"Create Key"}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
