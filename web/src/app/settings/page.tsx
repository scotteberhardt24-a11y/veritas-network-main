
"use client";
import { useState } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import TopBar from "@/components/topbar/TopBar";
import { VeritasEmblem } from "@/components/badges/VeritasBadges";
import { Settings, User, Lock, Bell, CreditCard, Eye, EyeOff, Camera, CheckCircle2, Loader2, Shield, Smartphone, Globe, Trash2 } from "lucide-react";

const TABS = ["Profile","Security","Notifications","Billing","Privacy","Danger Zone"];

export default function SettingsV2Page() {
  const [tab, setTab]           = useState("Profile");
  const [saving, setSaving]     = useState(false);
  const [saved, setSaved]       = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [twoFA, setTwoFA]       = useState(true);
  const [name, setName]         = useState("Scott Eberhardt");
  const [email, setEmail]       = useState("scott@veritas.network");
  const [bio, setBio]           = useState("Full-stack developer & Web3 builder. Founder of Veritas Network.");
  const [location, setLocation] = useState("Seattle, WA");
  const [rate, setRate]         = useState("150");
  const [website, setWebsite]   = useState("https://veritas.network");
  const [notifs, setNotifs]     = useState({payment:true,job:true,trust:true,dispute:true,badge:true,newsletter:false,marketing:false});

  function save(){ setSaving(true); setTimeout(()=>{setSaving(false);setSaved(true);setTimeout(()=>setSaved(false),2500);},900); }

  const SaveBtn = ()=>(
    <button onClick={save} disabled={saving} style={{display:"flex",alignItems:"center",gap:7,padding:"11px 22px",background:"linear-gradient(135deg,#1a6bff,#0050dd)",border:"none",borderRadius:10,color:"white",fontWeight:700,fontSize:"0.88rem",cursor:"pointer",opacity:saving?0.7:1,boxShadow:"0 3px 14px rgba(26,107,255,0.35)"}}>
      {saving?<Loader2 size={15} style={{animation:"spin 1s linear infinite"}}/>:saved?<CheckCircle2 size={15}/>:<Settings size={15}/>}
      {saved?"Saved!":saving?"Saving...":"Save Changes"}
    </button>
  );

  const Card = ({children,title}:{children:React.ReactNode;title?:string})=>(
    <div style={{background:"rgba(4,15,36,0.9)",border:"1px solid rgba(26,107,255,0.14)",borderRadius:16,padding:22,marginBottom:14}}>
      {title&&<div style={{fontWeight:800,marginBottom:16,fontSize:"0.95rem"}}>{title}</div>}
      {children}
    </div>
  );

  const Field = ({label,children}:{label:string;children:React.ReactNode})=>(
    <div style={{marginBottom:14}}>
      <label style={{fontSize:"0.68rem",fontWeight:700,color:"rgba(255,255,255,0.4)",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:6,display:"block"}}>{label}</label>
      {children}
    </div>
  );

  const Input = ({value,onChange,type="text",placeholder=""}:{value:string;onChange:(v:string)=>void;type?:string;placeholder?:string})=>(
    <input value={value} onChange={e=>onChange(e.target.value)} type={type} placeholder={placeholder} style={{width:"100%",padding:"11px 14px",background:"rgba(6,18,41,0.8)",border:"1px solid rgba(26,107,255,0.18)",borderRadius:9,color:"white",fontSize:"0.88rem",outline:"none"}}/>
  );

  const Toggle = ({val,onChange,label,desc}:{val:boolean;onChange:()=>void;label:string;desc?:string})=>(
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 0",borderBottom:"1px solid rgba(26,107,255,0.06)"}}>
      <div><div style={{fontWeight:600,fontSize:"0.88rem"}}>{label}</div>{desc&&<div style={{fontSize:"0.68rem",color:"rgba(255,255,255,0.38)"}}>{desc}</div>}</div>
      <div onClick={onChange} style={{width:42,height:23,borderRadius:12,background:val?"#1a6bff":"rgba(255,255,255,0.1)",position:"relative",cursor:"pointer",flexShrink:0,transition:"background 0.2s"}}>
        <span style={{position:"absolute",top:3,width:17,height:17,borderRadius:"50%",background:"white",transition:"left 0.2s",left:val?22:3}}/>
      </div>
    </div>
  );

  return (
    <div style={{display:"flex",minHeight:"100vh",background:"#010812"}}>
      <Sidebar/>
      <div style={{flex:1,display:"flex",flexDirection:"column"}}>
        <TopBar/>
        <main style={{flex:1,overflowY:"auto",padding:24,color:"white"}}>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:24}}>
            <Settings size={28} color="#4da6ff"/>
            <h1 style={{fontSize:"1.8rem",fontWeight:900,margin:0}}>Settings</h1>
          </div>

          {/* Tabs */}
          <div style={{display:"flex",gap:2,marginBottom:20,borderBottom:"1px solid rgba(26,107,255,0.1)",overflowX:"auto"}}>
            {TABS.map(t=>(
              <button key={t} onClick={()=>setTab(t)} style={{padding:"10px 16px",fontSize:"0.82rem",fontWeight:600,border:"none",background:"transparent",cursor:"pointer",color:tab===t?"#4da6ff":"rgba(255,255,255,0.4)",borderBottom:tab===t?"2px solid #1a6bff":"2px solid transparent",marginBottom:-1,whiteSpace:"nowrap"}}>{t}</button>
            ))}
          </div>

          <div style={{maxWidth:600}}>

            {tab==="Profile"&&(
              <>
                <Card>
                  <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:20}}>
                    <div style={{position:"relative"}}>
                      <div style={{width:76,height:76,borderRadius:18,background:"linear-gradient(135deg,#1a3a6b,#0d1f3d)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"2rem",border:"2px solid rgba(26,107,255,0.3)"}}>SE</div>
                      <button style={{position:"absolute",bottom:-2,right:-2,width:26,height:26,borderRadius:8,background:"linear-gradient(135deg,#1a6bff,#0050dd)",border:"none",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
                        <Camera size={13} color="white"/>
                      </button>
                    </div>
                    <div>
                      <div style={{fontWeight:800,fontSize:"1rem"}}>{name}</div>
                      <div style={{fontSize:"0.75rem",color:"rgba(255,255,255,0.45)"}}>@scotteberhardt</div>
                      <div style={{display:"inline-flex",alignItems:"center",gap:4,padding:"3px 9px 3px 7px",background:"rgba(26,107,255,0.1)",border:"1px solid rgba(26,107,255,0.22)",borderRadius:14,marginTop:5}}>
                        <Shield size={9} color="#4da6ff"/><span style={{fontSize:"0.6rem",fontWeight:800,color:"#4da6ff"}}>VERITAS VERIFIED</span>
                      </div>
                    </div>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                    <Field label="Full Name"><Input value={name} onChange={setName}/></Field>
                    <Field label="Email"><Input value={email} onChange={setEmail} type="email"/></Field>
                    <Field label="Location"><Input value={location} onChange={setLocation} placeholder="City, Country"/></Field>
                    <Field label="Hourly Rate ($)"><Input value={rate} onChange={setRate} type="number"/></Field>
                    <div style={{gridColumn:"1/-1"}}><Field label="Bio"><textarea value={bio} onChange={e=>setBio(e.target.value)} rows={3} style={{width:"100%",padding:"11px 14px",background:"rgba(6,18,41,0.8)",border:"1px solid rgba(26,107,255,0.18)",borderRadius:9,color:"white",fontSize:"0.85rem",outline:"none",resize:"none",lineHeight:1.55}}/></Field></div>
                    <div style={{gridColumn:"1/-1"}}><Field label="Website"><Input value={website} onChange={setWebsite}/></Field></div>
                  </div>
                  <SaveBtn/>
                </Card>
              </>
            )}

            {tab==="Security"&&(
              <>
                <Card title="Change Password">
                  {["Current Password","New Password","Confirm New Password"].map((l,i)=>(
                    <Field key={i} label={l}>
                      <div style={{position:"relative"}}>
                        <input type={showPass?"text":"password"} placeholder="••••••••" style={{width:"100%",padding:"11px 40px 11px 14px",background:"rgba(6,18,41,0.8)",border:"1px solid rgba(26,107,255,0.18)",borderRadius:9,color:"white",fontSize:"0.88rem",outline:"none"}}/>
                        <button onClick={()=>setShowPass(!showPass)} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:"rgba(255,255,255,0.35)"}}>
                          {showPass?<EyeOff size={15}/>:<Eye size={15}/>}
                        </button>
                      </div>
                    </Field>
                  ))}
                  <SaveBtn/>
                </Card>
                <Card title="Two-Factor Authentication">
                  <Toggle val={twoFA} onChange={()=>setTwoFA(!twoFA)} label="Enable 2FA" desc="Authenticator app (Google Authenticator / Authy)"/>
                </Card>
                <Card title="Active Sessions">
                  {[{d:"Chrome on macOS",l:"Seattle, WA",t:"Current",cur:true},{d:"Safari on iPhone 15",l:"Seattle, WA",t:"2h ago",cur:false}].map((s,i)=>(
                    <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:i<1?"1px solid rgba(26,107,255,0.07)":"none"}}>
                      <div>
                        <div style={{fontWeight:600,fontSize:"0.85rem"}}>{s.d}</div>
                        <div style={{fontSize:"0.7rem",color:"rgba(255,255,255,0.38)"}}>{s.l} · {s.t}</div>
                      </div>
                      {s.cur?<span style={{fontSize:"0.65rem",padding:"3px 8px",background:"rgba(0,200,83,0.1)",border:"1px solid rgba(0,200,83,0.2)",borderRadius:5,color:"#00e676",fontWeight:700}}>Current</span>
                        :<button style={{fontSize:"0.7rem",color:"#ff5555",background:"none",border:"none",cursor:"pointer"}}>Revoke</button>}
                    </div>
                  ))}
                </Card>
              </>
            )}

            {tab==="Notifications"&&(
              <Card title="Notification Preferences">
                {[
                  {k:"payment",l:"Payments & Escrow",d:"Releases, fees, withdrawals"},
                  {k:"job",    l:"Job Matches",       d:"New AI-matched opportunities"},
                  {k:"trust",  l:"Trust Score",       d:"Score changes and milestones"},
                  {k:"dispute",l:"Disputes",          d:"Opens, updates, resolutions"},
                  {k:"badge",  l:"Badges & Awards",   d:"New badges earned"},
                  {k:"newsletter",l:"Newsletter",     d:"Platform updates and tips"},
                  {k:"marketing",l:"Marketing",       d:"Promotions and offers"},
                ].map(p=>(
                  <Toggle key={p.k} val={notifs[p.k as keyof typeof notifs]} onChange={()=>setNotifs(n=>({...n,[p.k]:!n[p.k as keyof typeof notifs]}))} label={p.l} desc={p.d}/>
                ))}
                <div style={{marginTop:14}}><SaveBtn/></div>
              </Card>
            )}

            {tab==="Billing"&&(
              <>
                <Card title="Current Plan">
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:14,background:"rgba(240,192,64,0.07)",border:"1px solid rgba(240,192,64,0.18)",borderRadius:12,marginBottom:14}}>
                    <div><div style={{fontWeight:800,color:"#f0c040"}}>Pro Plan</div><div style={{fontSize:"0.75rem",color:"rgba(255,255,255,0.45)"}}>$49/month · Renews Jul 17, 2026</div></div>
                    <button style={{padding:"7px 14px",background:"rgba(240,192,64,0.1)",border:"1px solid rgba(240,192,64,0.25)",borderRadius:8,color:"#f0c040",fontSize:"0.78rem",fontWeight:700,cursor:"pointer"}}>Upgrade</button>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
                    {[["Platform Fee","2%"],["This Month","$43,200"],["YTD Earned","$312,100"]].map(([l,v],i)=>(
                      <div key={i} style={{textAlign:"center",padding:"10px",background:"rgba(26,107,255,0.06)",border:"1px solid rgba(26,107,255,0.12)",borderRadius:10}}>
                        <div style={{fontWeight:800,fontSize:"0.95rem",marginBottom:2}}>{v}</div>
                        <div style={{fontSize:"0.65rem",color:"rgba(255,255,255,0.38)"}}>{l}</div>
                      </div>
                    ))}
                  </div>
                </Card>
                <Card title="Payment Methods">
                  {[{t:"Visa",l4:"4242",exp:"09/27",p:true},{t:"Chase Bank",l4:"6789",exp:"Checking",p:false}].map((c,i)=>(
                    <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:i<1?"1px solid rgba(26,107,255,0.07)":"none"}}>
                      <div style={{display:"flex",alignItems:"center",gap:10}}>
                        <span style={{fontSize:"1.5rem"}}>{i===0?"💳":"🏦"}</span>
                        <div><div style={{fontWeight:600,fontSize:"0.85rem"}}>{c.t} ••••{c.l4}</div><div style={{fontSize:"0.68rem",color:"rgba(255,255,255,0.38)"}}>{c.exp}</div></div>
                      </div>
                      {c.p?<span style={{fontSize:"0.65rem",padding:"3px 8px",background:"rgba(0,200,83,0.08)",border:"1px solid rgba(0,200,83,0.18)",borderRadius:5,color:"#00e676",fontWeight:700}}>Primary</span>
                        :<button style={{fontSize:"0.72rem",color:"#4da6ff",background:"none",border:"none",cursor:"pointer"}}>Set Primary</button>}
                    </div>
                  ))}
                  <button style={{width:"100%",marginTop:12,padding:"10px",background:"rgba(26,107,255,0.04)",border:"1px dashed rgba(26,107,255,0.2)",borderRadius:9,color:"rgba(255,255,255,0.4)",fontSize:"0.8rem",cursor:"pointer"}}>+ Add Payment Method</button>
                </Card>
              </>
            )}

            {tab==="Privacy"&&(
              <Card title="Privacy Controls">
                {[
                  {l:"Public Profile",   d:"Anyone can view your Trust Passport",     v:true},
                  {l:"Show Earnings",    d:"Display lifetime earnings on profile",     v:false},
                  {l:"Show Trust Score", d:"Show score on public profile",             v:true},
                  {l:"Discoverable",     d:"Appear in client search results",          v:true},
                  {l:"Online Status",    d:"Let clients see when you're active",       v:true},
                  {l:"Analytics",        d:"Help improve the platform anonymously",    v:false},
                ].map((s,i)=>(
                  <Toggle key={i} val={s.v} onChange={()=>{}} label={s.l} desc={s.d}/>
                ))}
                <div style={{marginTop:14}}><SaveBtn/></div>
              </Card>
            )}

            {tab==="Danger Zone"&&(
              <Card title="Danger Zone">
                <div style={{padding:14,background:"rgba(255,85,85,0.05)",border:"1px solid rgba(255,85,85,0.15)",borderRadius:12,marginBottom:14}}>
                  <div style={{fontWeight:700,color:"#ff5555",marginBottom:5}}>Delete Account</div>
                  <div style={{fontSize:"0.82rem",color:"rgba(255,255,255,0.5)",marginBottom:12,lineHeight:1.6}}>Permanently delete your account and all associated data including your Trust Score, badges, contract history, and earnings records. This action cannot be undone.</div>
                  <button style={{padding:"10px 18px",background:"rgba(255,85,85,0.12)",border:"1px solid rgba(255,85,85,0.3)",borderRadius:9,color:"#ff5555",fontSize:"0.82rem",fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:6}}>
                    <Trash2 size={14}/>Delete My Account
                  </button>
                </div>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
