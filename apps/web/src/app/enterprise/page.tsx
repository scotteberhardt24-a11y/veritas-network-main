"use client";

import { useState } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import TopBar from "@/components/topbar/TopBar";
import {
  Settings,
  Globe,
  Key,
  Webhook,
  Palette,
  Shield,
  Copy,
  CheckCheck,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  Building2,
  Zap,
} from "lucide-react";

const TABS = ["Branding", "API Keys", "Webhooks", "Custom Domain", "Security"];

const MOCK_KEYS = [
  { id: "1", name: "Production API", key: "vt_live_sk_4xK9mP2nQ8wR3jL7vY1tH6aZ5cB0dE", created: "Jan 15, 2026", lastUsed: "2 min ago", requests: 142847, status: "active" },
  { id: "2", name: "Staging Environment", key: "vt_test_sk_9yN4rS6kT2vM8hW5aP0qX3bC7dF1gJ", created: "Feb 3, 2026", lastUsed: "1h ago", requests: 28391, status: "active" },
  { id: "3", name: "Mobile App", key: "vt_live_sk_2bD7fG4hJ9kL5mN1oP3qR6sT8uV0wX", created: "Mar 20, 2026", lastUsed: "3d ago", requests: 9102, status: "active" },
];

const MOCK_WEBHOOKS = [
  { id: "1", url: "https://api.myapp.com/webhooks/veritas", events: ["job.created", "payment.released", "dispute.opened"], status: "active", lastTrigger: "5m ago" },
  { id: "2", url: "https://slack.hooks.example.com/T01234/B56789", events: ["payment.released"], status: "active", lastTrigger: "2h ago" },
];

const WEBHOOK_EVENTS = [
  "job.created", "job.applied", "job.completed",
  "payment.released", "payment.disputed", "payment.refunded",
  "dispute.opened", "dispute.resolved",
  "user.verified", "user.score_changed",
  "contract.signed", "contract.completed",
];

export default function EnterprisePage() {
  const [tab, setTab] = useState("Branding");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [visibleKey, setVisibleKey] = useState<string | null>(null);
  const [primaryColor, setPrimaryColor] = useState("#d4af37");
  const [brandName, setBrandName] = useState("Veritas Network");
  const [domain, setDomain] = useState("");
  const [domainStatus, setDomainStatus] = useState<"idle" | "checking" | "verified" | "error">("idle");
  const [showNewKey, setShowNewKey] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");

  function copyKey(key: string, id: string) {
    navigator.clipboard.writeText(key);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  }

  function checkDomain() {
    if (!domain) return;
    setDomainStatus("checking");
    setTimeout(() => setDomainStatus(Math.random() > 0.3 ? "verified" : "error"), 1800);
  }

  function maskKey(key: string) {
    return key.slice(0, 12) + "•".repeat(24) + key.slice(-8);
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopBar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <Building2 className="text-yellow-400" size={28} />
            <div>
              <h1 className="text-3xl font-black gold-text">Enterprise & White Label</h1>
              <p className="text-white/50">API access, custom branding, and enterprise configuration</p>
            </div>
          </div>

          {/* Plan Banner */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 mb-6">
            <div className="flex items-center gap-3">
              <Zap size={20} className="text-yellow-400" />
              <div>
                <div className="font-bold text-yellow-400">Enterprise Plan — Active</div>
                <div className="text-sm text-white/50">White-label enabled · 1M API requests/mo · Custom domain · SSO ready</div>
              </div>
            </div>
            <button className="text-xs px-3 py-1.5 rounded-lg border border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10 transition">
              Manage Plan
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b border-white/10">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-2.5 text-sm font-medium border-b-2 transition -mb-px ${
                  tab === t ? "border-yellow-400 text-yellow-400" : "border-transparent text-white/40 hover:text-white"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* BRANDING */}
          {tab === "Branding" && (
            <div className="max-w-2xl space-y-6">
              <div className="glass-card rounded-2xl p-6">
                <h3 className="font-bold mb-5 flex items-center gap-2"><Palette size={16} className="text-yellow-400" /> Brand Identity</h3>
                <div className="space-y-5">
                  <div>
                    <label className="text-xs text-white/50 mb-2 block uppercase tracking-wide">Platform Name</label>
                    <input value={brandName} onChange={(e) => setBrandName(e.target.value)} className="veritas-input" placeholder="Your brand name" />
                  </div>
                  <div>
                    <label className="text-xs text-white/50 mb-2 block uppercase tracking-wide">Primary Brand Color</label>
                    <div className="flex gap-3 items-center">
                      <input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="w-12 h-10 rounded-xl border border-white/10 bg-transparent cursor-pointer" />
                      <input value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="veritas-input flex-1 font-mono" placeholder="#d4af37" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-white/50 mb-2 block uppercase tracking-wide">Logo Upload</label>
                    <div className="border-2 border-dashed border-white/10 rounded-2xl p-8 text-center hover:border-yellow-500/30 transition cursor-pointer">
                      <div className="text-3xl mb-2">🖼️</div>
                      <div className="text-sm text-white/50">Drag & drop logo or <span className="text-yellow-400">browse</span></div>
                      <div className="text-xs text-white/30 mt-1">PNG, SVG · Max 2MB · Recommended 200×60px</div>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-white/50 mb-2 block uppercase tracking-wide">Favicon Upload</label>
                    <div className="border-2 border-dashed border-white/10 rounded-2xl p-6 text-center hover:border-yellow-500/30 transition cursor-pointer">
                      <div className="text-2xl mb-1">🔲</div>
                      <div className="text-sm text-white/50">Upload favicon · <span className="text-yellow-400">browse</span></div>
                      <div className="text-xs text-white/30 mt-1">ICO, PNG · 32×32px</div>
                    </div>
                  </div>
                </div>
                <button className="mt-5 px-6 py-2.5 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-sm transition">
                  Save Branding
                </button>
              </div>

              {/* Preview */}
              <div className="glass-card rounded-2xl p-6">
                <h3 className="font-bold mb-4 text-sm text-white/60">LIVE PREVIEW</h3>
                <div className="rounded-xl overflow-hidden border border-white/10">
                  <div className="px-4 py-3 flex items-center gap-3" style={{ background: `${primaryColor}20`, borderBottom: `1px solid ${primaryColor}30` }}>
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs" style={{ background: primaryColor, color: "#000" }}>
                      {brandName[0]}
                    </div>
                    <span className="font-bold text-sm" style={{ color: primaryColor }}>{brandName}</span>
                    <div className="ml-auto flex gap-2">
                      {["Dashboard", "Jobs", "Escrow"].map((l) => (
                        <span key={l} className="text-xs text-white/40">{l}</span>
                      ))}
                    </div>
                  </div>
                  <div className="p-4 text-xs text-white/30 text-center">White-labeled interface preview</div>
                </div>
              </div>
            </div>
          )}

          {/* API KEYS */}
          {tab === "API Keys" && (
            <div className="max-w-3xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-white/50">Manage API keys for programmatic access to the Veritas platform.</div>
                <button
                  onClick={() => setShowNewKey(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 text-sm font-medium hover:bg-yellow-500/30 transition"
                >
                  <Plus size={14} /> New Key
                </button>
              </div>

              {MOCK_KEYS.map((k) => (
                <div key={k.id} className="glass-card rounded-2xl p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="font-bold">{k.name}</div>
                      <div className="text-xs text-white/40 mt-0.5">Created {k.created} · Last used {k.lastUsed} · {k.requests.toLocaleString()} requests</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">{k.status}</span>
                      <button className="p-1.5 rounded-lg hover:bg-red-500/10 text-white/30 hover:text-red-400 transition">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-black/30 rounded-xl px-4 py-3">
                    <code className="text-xs font-mono text-white/60 flex-1 truncate">
                      {visibleKey === k.id ? k.key : maskKey(k.key)}
                    </code>
                    <button onClick={() => setVisibleKey(visibleKey === k.id ? null : k.id)} className="text-white/30 hover:text-white transition flex-shrink-0">
                      {visibleKey === k.id ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                    <button onClick={() => copyKey(k.key, k.id)} className="text-white/30 hover:text-yellow-400 transition flex-shrink-0">
                      {copiedKey === k.id ? <CheckCheck size={14} className="text-green-400" /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>
              ))}

              {showNewKey && (
                <div className="glass-card rounded-2xl p-5 border border-yellow-500/20">
                  <h4 className="font-bold mb-4">Create New API Key</h4>
                  <div className="flex gap-3">
                    <input value={newKeyName} onChange={(e) => setNewKeyName(e.target.value)} placeholder="Key name (e.g. Mobile App)" className="veritas-input flex-1" />
                    <button
                      onClick={() => { if (newKeyName) { setShowNewKey(false); setNewKeyName(""); } }}
                      className="px-4 py-2.5 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-sm transition"
                    >
                      Generate
                    </button>
                    <button onClick={() => setShowNewKey(false)} className="px-4 py-2.5 rounded-xl border border-white/10 text-white/60 text-sm hover:text-white transition">Cancel</button>
                  </div>
                </div>
              )}

              <div className="p-4 rounded-xl bg-white/3 border border-white/10">
                <div className="text-xs text-white/40 flex items-start gap-2">
                  <AlertCircle size={12} className="mt-0.5 flex-shrink-0 text-yellow-400" />
                  Keep API keys secret. Never expose them in client-side code. Rotate keys immediately if compromised.
                </div>
              </div>
            </div>
          )}

          {/* WEBHOOKS */}
          {tab === "Webhooks" && (
            <div className="max-w-3xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-white/50">Receive real-time event notifications via HTTP POST.</div>
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 text-sm font-medium hover:bg-yellow-500/30 transition">
                  <Plus size={14} /> Add Webhook
                </button>
              </div>

              {MOCK_WEBHOOKS.map((wh) => (
                <div key={wh.id} className="glass-card rounded-2xl p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <code className="text-sm font-mono text-cyan-400">{wh.url}</code>
                      <div className="text-xs text-white/40 mt-1">Last triggered: {wh.lastTrigger}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">{wh.status}</span>
                      <button className="p-1.5 rounded-lg hover:bg-white/5 transition"><RefreshCw size={14} className="text-white/40" /></button>
                      <button className="p-1.5 rounded-lg hover:bg-red-500/10 transition"><Trash2 size={14} className="text-white/30 hover:text-red-400" /></button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {wh.events.map((e) => (
                      <span key={e} className="text-xs px-2 py-1 rounded-lg bg-white/5 border border-white/10 font-mono text-white/50">{e}</span>
                    ))}
                  </div>
                </div>
              ))}

              <div className="glass-card rounded-2xl p-5">
                <h4 className="font-bold mb-3 text-sm">Available Events</h4>
                <div className="flex flex-wrap gap-2">
                  {WEBHOOK_EVENTS.map((e) => (
                    <span key={e} className="text-xs px-2 py-1 rounded-lg bg-white/3 border border-white/10 font-mono text-white/40">{e}</span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* CUSTOM DOMAIN */}
          {tab === "Custom Domain" && (
            <div className="max-w-2xl space-y-6">
              <div className="glass-card rounded-2xl p-6">
                <h3 className="font-bold mb-1 flex items-center gap-2"><Globe size={16} className="text-yellow-400" /> Custom Domain</h3>
                <p className="text-sm text-white/50 mb-5">Host your white-labeled platform on your own domain.</p>
                <div className="flex gap-3 mb-4">
                  <input value={domain} onChange={(e) => setDomain(e.target.value)} placeholder="platform.yourdomain.com" className="veritas-input flex-1 font-mono" />
                  <button onClick={checkDomain} className="px-4 py-2.5 rounded-xl bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 text-sm font-medium hover:bg-yellow-500/30 transition">
                    Verify
                  </button>
                </div>
                {domainStatus === "checking" && <div className="text-sm text-white/50 flex items-center gap-2"><RefreshCw size={14} className="animate-spin" /> Checking DNS records...</div>}
                {domainStatus === "verified" && <div className="text-sm text-green-400 flex items-center gap-2"><CheckCircle2 size={14} /> Domain verified! SSL certificate provisioned automatically.</div>}
                {domainStatus === "error" && <div className="text-sm text-red-400 flex items-center gap-2"><AlertCircle size={14} /> DNS records not found. Check the instructions below.</div>}
              </div>

              <div className="glass-card rounded-2xl p-6">
                <h4 className="font-bold mb-4">DNS Configuration</h4>
                <div className="space-y-3">
                  {[
                    { type: "CNAME", name: "@", value: "proxy.veritas.network", ttl: "3600" },
                    { type: "TXT", name: "_veritas-verify", value: "veritas-site-verification=abc123xyz789", ttl: "3600" },
                  ].map((record, i) => (
                    <div key={i} className="grid grid-cols-4 gap-2 p-3 rounded-xl bg-black/20 font-mono text-xs">
                      <span className="text-yellow-400">{record.type}</span>
                      <span className="text-white/60">{record.name}</span>
                      <span className="text-cyan-400 col-span-2 truncate">{record.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SECURITY */}
          {tab === "Security" && (
            <div className="max-w-2xl space-y-5">
              {[
                { title: "Two-Factor Authentication", desc: "Require 2FA for all admin logins", enabled: true },
                { title: "SSO / SAML Integration", desc: "Enterprise single sign-on via Okta, Auth0, or Azure AD", enabled: false },
                { title: "IP Allowlisting", desc: "Restrict API access to specific IP ranges", enabled: false },
                { title: "Audit Logging", desc: "Full audit trail of all admin actions", enabled: true },
                { title: "Data Export Encryption", desc: "Encrypt all data exports with PGP key", enabled: true },
                { title: "Session Timeout", desc: "Auto-logout inactive sessions after 30 minutes", enabled: true },
              ].map((setting, i) => (
                <div key={i} className="glass-card rounded-2xl p-5 flex items-center justify-between">
                  <div>
                    <div className="font-medium">{setting.title}</div>
                    <div className="text-sm text-white/40">{setting.desc}</div>
                  </div>
                  <div className={`relative w-12 h-6 rounded-full cursor-pointer transition-colors ${setting.enabled ? "bg-yellow-500" : "bg-white/10"}`}>
                    <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${setting.enabled ? "translate-x-7" : "translate-x-1"}`} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
