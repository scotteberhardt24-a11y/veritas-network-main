
"use client";

import { useState } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import TopBar from "@/components/topbar/TopBar";
import {
  Settings, User, Lock, Bell, CreditCard, Shield, Eye, EyeOff,
  Camera, CheckCircle2, Loader2, X, Globe, Smartphone,
} from "lucide-react";

const TABS = ["Profile","Security","Notifications","Billing","Privacy"];

export default function SettingsPage() {
  const [tab, setTab]             = useState("Profile");
  const [saving, setSaving]       = useState(false);
  const [saved, setSaved]         = useState(false);
  const [showPass, setShowPass]   = useState(false);

  // Profile state
  const [name, setName]           = useState("Scott Eberhardt");
  const [username, setUsername]   = useState("scotteberhardt");
  const [email, setEmail]         = useState("scott@veritas.network");
  const [bio, setBio]             = useState("Full-stack developer & Web3 builder. Founder of Veritas Network.");
  const [location, setLocation]   = useState("Seattle, WA");
  const [website, setWebsite]     = useState("https://veritas.network");
  const [hourlyRate, setHourlyRate] = useState("150");

  // Security state
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass]         = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [twoFA, setTwoFA]             = useState(true);

  // Notification state
  const [notifPrefs, setNotifPrefs] = useState({
    newMessage: true, jobMatch: true, payment: true, dispute: true,
    newsletter: false, marketing: false, weeklyDigest: true,
  });

  function save() {
    setSaving(true);
    setTimeout(() => { setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2500); }, 1000);
  }

  const SaveButton = () => (
    <button onClick={save} disabled={saving} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-sm disabled:opacity-40 transition">
      {saving ? <Loader2 size={16} className="animate-spin" /> : saved ? <CheckCircle2 size={16} /> : <Settings size={16} />}
      {saved ? "Saved!" : saving ? "Saving..." : "Save Changes"}
    </button>
  );

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopBar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="flex items-center gap-3 mb-6">
            <Settings className="text-yellow-400" size={28} />
            <h1 className="text-3xl font-black gold-text">Settings</h1>
          </div>

          <div className="flex gap-2 mb-6 border-b border-white/10">
            {TABS.map(t => (
              <button key={t} onClick={() => setTab(t)} className={"px-4 py-2.5 text-sm font-medium border-b-2 transition -mb-px "+(tab===t ? "border-yellow-400 text-yellow-400" : "border-transparent text-white/40 hover:text-white")}>{t}</button>
            ))}
          </div>

          <div className="max-w-2xl">

            {/* PROFILE */}
            {tab === "Profile" && (
              <div className="glass-card rounded-3xl p-6 space-y-6">
                {/* Avatar */}
                <div className="flex items-center gap-5">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-yellow-500/30 to-cyan-500/20 flex items-center justify-center text-2xl font-black">SE</div>
                    <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-lg bg-yellow-500 flex items-center justify-center hover:bg-yellow-400 transition">
                      <Camera size={14} className="text-black" />
                    </button>
                  </div>
                  <div>
                    <div className="font-bold text-lg">{name}</div>
                    <div className="text-sm text-white/50">@{username}</div>
                    <div className="text-xs text-white/30 mt-0.5">Click camera to update photo</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-xs text-white/50 mb-2 block uppercase tracking-wide">Full Name</label>
                    <input value={name} onChange={e=>setName(e.target.value)} className="veritas-input" />
                  </div>
                  <div>
                    <label className="text-xs text-white/50 mb-2 block uppercase tracking-wide">Username</label>
                    <input value={username} onChange={e=>setUsername(e.target.value)} className="veritas-input" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs text-white/50 mb-2 block uppercase tracking-wide">Email</label>
                    <input value={email} onChange={e=>setEmail(e.target.value)} type="email" className="veritas-input" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs text-white/50 mb-2 block uppercase tracking-wide">Bio</label>
                    <textarea value={bio} onChange={e=>setBio(e.target.value)} rows={3} className="veritas-input resize-none" />
                  </div>
                  <div>
                    <label className="text-xs text-white/50 mb-2 block uppercase tracking-wide flex items-center gap-1"><Globe size={10}/>Location</label>
                    <input value={location} onChange={e=>setLocation(e.target.value)} className="veritas-input" />
                  </div>
                  <div>
                    <label className="text-xs text-white/50 mb-2 block uppercase tracking-wide">Hourly Rate ($)</label>
                    <input value={hourlyRate} onChange={e=>setHourlyRate(e.target.value)} type="number" className="veritas-input" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs text-white/50 mb-2 block uppercase tracking-wide">Website / Portfolio</label>
                    <input value={website} onChange={e=>setWebsite(e.target.value)} className="veritas-input" />
                  </div>
                </div>
                <SaveButton />
              </div>
            )}

            {/* SECURITY */}
            {tab === "Security" && (
              <div className="space-y-4">
                <div className="glass-card rounded-3xl p-6 space-y-5">
                  <h3 className="font-bold flex items-center gap-2"><Lock size={16} className="text-yellow-400"/>Change Password</h3>
                  <div className="space-y-4">
                    {[
                      { label:"Current Password", val:currentPass, set:setCurrentPass },
                      { label:"New Password",     val:newPass,     set:setNewPass },
                      { label:"Confirm New Password", val:confirmPass, set:setConfirmPass },
                    ].map((f,i) => (
                      <div key={i}>
                        <label className="text-xs text-white/50 mb-2 block uppercase tracking-wide">{f.label}</label>
                        <div className="relative">
                          <input type={showPass ? "text" : "password"} value={f.val} onChange={e=>f.set(e.target.value)} className="veritas-input pr-10" />
                          <button onClick={()=>setShowPass(!showPass)} className="absolute right-3 top-3 text-white/40 hover:text-white">
                            {showPass ? <EyeOff size={16}/> : <Eye size={16}/>}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <SaveButton />
                </div>
                <div className="glass-card rounded-2xl p-5 flex items-center justify-between">
                  <div>
                    <div className="font-medium flex items-center gap-2"><Shield size={14} className="text-yellow-400"/>Two-Factor Authentication</div>
                    <div className="text-sm text-white/40">Authenticator app (Google/Authy)</div>
                  </div>
                  <button onClick={()=>setTwoFA(!twoFA)} className={"w-12 h-6 rounded-full transition-colors relative "+(twoFA ? "bg-yellow-500" : "bg-white/10")}>
                    <span className={"absolute top-1 w-4 h-4 rounded-full bg-white transition-transform "+(twoFA ? "translate-x-7" : "translate-x-1")} />
                  </button>
                </div>
                <div className="glass-card rounded-2xl p-5">
                  <div className="font-medium mb-3 flex items-center gap-2"><Smartphone size={14} className="text-cyan-400"/>Active Sessions</div>
                  {[
                    { device:"Chrome on macOS", location:"Seattle, WA", time:"Current session", current:true },
                    { device:"Safari on iPhone 15", location:"Seattle, WA", time:"2h ago", current:false },
                  ].map((s,i) => (
                    <div key={i} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                      <div>
                        <div className="text-sm font-medium">{s.device}</div>
                        <div className="text-xs text-white/40">{s.location} · {s.time}</div>
                      </div>
                      {s.current ? <span className="text-xs text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full">Current</span> :
                        <button className="text-xs text-red-400 hover:underline">Revoke</button>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* NOTIFICATIONS */}
            {tab === "Notifications" && (
              <div className="glass-card rounded-3xl p-6 space-y-4">
                <h3 className="font-bold flex items-center gap-2"><Bell size={16} className="text-yellow-400"/>Notification Preferences</h3>
                {Object.entries({
                  newMessage:"New messages", jobMatch:"Job match alerts", payment:"Payment & escrow",
                  dispute:"Dispute updates", newsletter:"Platform newsletter", marketing:"Marketing emails", weeklyDigest:"Weekly digest",
                }).map(([key,label]) => (
                  <div key={key} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                    <span className="text-sm">{label}</span>
                    <button onClick={()=>setNotifPrefs(p=>({...p,[key]:!p[key as keyof typeof p]}))} className={"w-11 h-6 rounded-full transition-colors relative "+(notifPrefs[key as keyof typeof notifPrefs] ? "bg-yellow-500" : "bg-white/10")}>
                      <span className={"absolute top-1 w-4 h-4 rounded-full bg-white transition-transform "+(notifPrefs[key as keyof typeof notifPrefs] ? "translate-x-6" : "translate-x-1")} />
                    </button>
                  </div>
                ))}
                <SaveButton />
              </div>
            )}

            {/* BILLING */}
            {tab === "Billing" && (
              <div className="space-y-4">
                <div className="glass-card rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="font-bold text-yellow-400">Pro Plan</div>
                      <div className="text-sm text-white/50">$49/month · Renews Jul 17, 2026</div>
                    </div>
                    <button className="text-sm text-yellow-400 border border-yellow-500/30 px-3 py-1.5 rounded-xl hover:bg-yellow-500/10 transition">Upgrade</button>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {[["Platform Fee","2.5%"],["Monthly Earnings","$43,200"],["YTD Earned","$312,100"]].map(([l,v],i) => (
                      <div key={i} className="text-center p-3 rounded-xl bg-white/5">
                        <div className="text-xs text-white/40 mb-1">{l}</div>
                        <div className="font-bold text-sm">{v}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="glass-card rounded-2xl p-5">
                  <div className="font-bold mb-4 flex items-center gap-2"><CreditCard size={16} className="text-yellow-400"/>Payment Methods</div>
                  {[
                    { type:"Visa", last4:"4242", expiry:"09/27", primary:true },
                    { type:"Bank Account", last4:"6789", expiry:"Chase ••••6789", primary:false },
                  ].map((c,i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 mb-3 last:mb-0">
                      <div className="flex items-center gap-3">
                        <div className="text-xl">{c.type==="Visa" ? "💳" : "🏦"}</div>
                        <div>
                          <div className="text-sm font-medium">{c.type} ••••{c.last4}</div>
                          <div className="text-xs text-white/40">{c.expiry}</div>
                        </div>
                      </div>
                      {c.primary ? <span className="text-xs text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full">Primary</span> :
                        <button className="text-xs text-white/40 hover:text-white">Set Primary</button>}
                    </div>
                  ))}
                  <button className="mt-3 w-full py-2.5 rounded-xl border border-dashed border-white/20 text-white/40 text-sm hover:text-white hover:border-white/40 transition">+ Add Payment Method</button>
                </div>
              </div>
            )}

            {/* PRIVACY */}
            {tab === "Privacy" && (
              <div className="glass-card rounded-3xl p-6 space-y-4">
                <h3 className="font-bold flex items-center gap-2"><Eye size={16} className="text-yellow-400"/>Privacy Controls</h3>
                {[
                  { label:"Public Profile", desc:"Anyone can view your Reputation Passport", enabled:true },
                  { label:"Show Earnings", desc:"Display lifetime earnings on profile", enabled:false },
                  { label:"Show TruScore", desc:"Show your TruScore on public profile", enabled:true },
                  { label:"Discoverable in Search", desc:"Appear in client search results", enabled:true },
                  { label:"Show Online Status", desc:"Let clients see when you're online", enabled:true },
                  { label:"Analytics Tracking", desc:"Help improve the platform with usage data", enabled:false },
                ].map((s,i) => (
                  <div key={i} className="flex items-start justify-between py-3 border-b border-white/5 last:border-0 gap-4">
                    <div>
                      <div className="font-medium text-sm">{s.label}</div>
                      <div className="text-xs text-white/40">{s.desc}</div>
                    </div>
                    <div className={"w-11 h-6 rounded-full flex-shrink-0 transition-colors relative cursor-pointer "+(s.enabled ? "bg-yellow-500" : "bg-white/10")}>
                      <span className={"absolute top-1 w-4 h-4 rounded-full bg-white transition-transform "+(s.enabled ? "translate-x-6" : "translate-x-1")} />
                    </div>
                  </div>
                ))}
                <div className="pt-4 border-t border-white/10">
                  <button className="text-red-400 text-sm hover:underline">Delete Account</button>
                  <p className="text-xs text-white/30 mt-1">This action is permanent and cannot be undone.</p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
