"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import TopBar from "@/components/topbar/TopBar";
import {
  Building2,
  Users,
  Briefcase,
  DollarSign,
  Plus,
  Shield,
  TrendingUp,
  Star,
  ChevronRight,
  Mail,
  Clock,
  CheckCircle2,
  AlertCircle,
  Settings,
  ExternalLink,
  UserPlus,
  X,
  Loader2,
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "https://veritas-trust-ledger-production.up.railway.app";

const MOCK_MEMBERS = [
  { id: "1", name: "Sarah Kim", role: "Lead Developer", email: "sarah@agency.io", score: 94, status: "active", activeJobs: 3, earnings: 14200, joined: "Jan 2026" },
  { id: "2", name: "Marcus Webb", role: "UI Designer", email: "marcus@agency.io", score: 91, status: "active", activeJobs: 2, earnings: 9800, joined: "Feb 2026" },
  { id: "3", name: "Rina Patel", role: "Copywriter", email: "rina@agency.io", score: 88, status: "active", activeJobs: 4, earnings: 6700, joined: "Mar 2026" },
  { id: "4", name: "Tom Ellis", role: "SEO Specialist", email: "tom@agency.io", score: 85, status: "idle", activeJobs: 0, earnings: 4200, joined: "Apr 2026" },
  { id: "5", name: "Zoe Larsson", role: "Video Editor", email: "zoe@agency.io", score: 90, status: "active", activeJobs: 1, earnings: 8900, joined: "Feb 2026" },
];

const MOCK_CLIENTS = [
  { id: "1", name: "TechVentures Inc.", contact: "Brian Walsh", activeProjects: 3, totalSpent: 48500, status: "premium", since: "Nov 2025" },
  { id: "2", name: "GreenLeaf Studios", contact: "Amy Chen", activeProjects: 1, totalSpent: 12300, status: "standard", since: "Jan 2026" },
  { id: "3", name: "FinEdge Capital", contact: "David Price", activeProjects: 2, totalSpent: 31700, status: "premium", since: "Dec 2025" },
  { id: "4", name: "Bloom Health", contact: "Nadia Rose", activeProjects: 1, totalSpent: 8900, status: "standard", since: "Mar 2026" },
];

const MOCK_PROJECTS = [
  { id: "1", title: "E-commerce Rebuild", client: "TechVentures Inc.", assigned: ["Sarah Kim", "Marcus Webb"], budget: 18000, spent: 12400, deadline: "Jul 30", status: "on-track" },
  { id: "2", title: "Brand Identity Pack", client: "GreenLeaf Studios", assigned: ["Marcus Webb"], budget: 5500, spent: 4200, deadline: "Jul 20", status: "at-risk" },
  { id: "3", title: "Q3 Content Strategy", client: "FinEdge Capital", assigned: ["Rina Patel", "Tom Ellis"], budget: 9800, spent: 2100, deadline: "Aug 15", status: "on-track" },
  { id: "4", title: "Product Demo Video", client: "Bloom Health", assigned: ["Zoe Larsson"], budget: 4200, spent: 3900, deadline: "Jul 18", status: "at-risk" },
];

type Tab = "Overview" | "Team" | "Clients" | "Projects" | "Billing";

export default function AgencyPage() {
  const [tab, setTab] = useState<Tab>("Overview");
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Developer");
  const [inviting, setInviting] = useState(false);
  const [inviteSent, setInviteSent] = useState(false);

  const totalEarnings = MOCK_MEMBERS.reduce((a, m) => a + m.earnings, 0);
  const activeMembers = MOCK_MEMBERS.filter((m) => m.status === "active").length;
  const totalProjects = MOCK_PROJECTS.length;
  const atRisk = MOCK_PROJECTS.filter((p) => p.status === "at-risk").length;

  async function sendInvite() {
    if (!inviteEmail) return;
    setInviting(true);
    setTimeout(() => {
      setInviting(false);
      setInviteSent(true);
      setTimeout(() => {
        setInviteSent(false);
        setShowInvite(false);
        setInviteEmail("");
      }, 1500);
    }, 1000);
  }

  const TABS: Tab[] = ["Overview", "Team", "Clients", "Projects", "Billing"];

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopBar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <Building2 className="text-yellow-400" size={28} />
                <h1 className="text-3xl font-black gold-text">Agency Hub</h1>
              </div>
              <p className="text-white/50">Manage your team, clients, and projects in one place</p>
            </div>
            <button
              onClick={() => setShowInvite(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-black font-bold transition"
            >
              <UserPlus size={18} />
              Invite Member
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b border-white/10">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-2.5 text-sm font-medium border-b-2 transition -mb-px ${
                  tab === t
                    ? "border-yellow-400 text-yellow-400"
                    : "border-transparent text-white/40 hover:text-white"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* OVERVIEW */}
          {tab === "Overview" && (
            <div className="space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { icon: Users, label: "Active Members", value: `${activeMembers}/${MOCK_MEMBERS.length}`, color: "text-cyan-400" },
                  { icon: Briefcase, label: "Active Projects", value: totalProjects, color: "text-yellow-400" },
                  { icon: DollarSign, label: "Month Earnings", value: `$${totalEarnings.toLocaleString()}`, color: "text-green-400" },
                  { icon: AlertCircle, label: "At Risk", value: atRisk, color: "text-red-400" },
                ].map((stat, i) => {
                  const Icon = stat.icon;
                  return (
                    <div key={i} className="glass-card rounded-2xl p-5">
                      <Icon size={20} className={stat.color} />
                      <div className="text-2xl font-black mt-3 mb-1">{stat.value}</div>
                      <div className="text-xs text-white/50">{stat.label}</div>
                    </div>
                  );
                })}
              </div>

              {/* Projects at risk */}
              {atRisk > 0 && (
                <div className="glass-card rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <AlertCircle size={16} className="text-red-400" />
                    <span className="font-bold text-red-400 text-sm">Projects Needing Attention</span>
                  </div>
                  <div className="space-y-3">
                    {MOCK_PROJECTS.filter((p) => p.status === "at-risk").map((p) => (
                      <div key={p.id} className="flex items-center justify-between p-3 rounded-xl bg-red-500/5 border border-red-500/20">
                        <div>
                          <div className="font-medium text-sm">{p.title}</div>
                          <div className="text-xs text-white/40">{p.client} · Due {p.deadline}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-red-400 font-medium">
                            ${p.spent.toLocaleString()} / ${p.budget.toLocaleString()}
                          </div>
                          <div className="text-xs text-white/30">
                            {Math.round((p.spent / p.budget) * 100)}% budget used
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Team Quick View */}
              <div className="glass-card rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-bold">Team Performance</span>
                  <button onClick={() => setTab("Team")} className="text-xs text-yellow-400 hover:underline flex items-center gap-1">
                    View All <ChevronRight size={12} />
                  </button>
                </div>
                <div className="space-y-3">
                  {MOCK_MEMBERS.slice(0, 4).map((m) => (
                    <div key={m.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-yellow-500/20 to-cyan-500/20 flex items-center justify-center text-sm font-bold">
                          {m.name[0]}
                        </div>
                        <div>
                          <div className="text-sm font-medium">{m.name}</div>
                          <div className="text-xs text-white/40">{m.role}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className={`w-2 h-2 rounded-full ${m.status === "active" ? "bg-green-400" : "bg-white/20"}`} />
                        <span className="text-sm font-bold gold-text">{m.score}</span>
                        <span className="text-sm text-green-400 hidden sm:block">${m.earnings.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TEAM */}
          {tab === "Team" && (
            <div className="space-y-3">
              {MOCK_MEMBERS.map((m) => (
                <div key={m.id} className="glass-card rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500/20 to-cyan-500/20 flex items-center justify-center font-bold">
                        {m.name[0]}
                      </div>
                      <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-black ${m.status === "active" ? "bg-green-400" : "bg-white/20"}`} />
                    </div>
                    <div>
                      <div className="font-bold flex items-center gap-2">
                        {m.name}
                        <Shield size={12} className="text-yellow-400" />
                      </div>
                      <div className="text-sm text-white/50">{m.role}</div>
                      <div className="text-xs text-white/30 flex items-center gap-1">
                        <Mail size={10} /> {m.email}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 sm:gap-8">
                    <div className="text-center">
                      <div className="text-xs text-white/40">TruScore</div>
                      <div className="font-bold gold-text">{m.score}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-white/40">Active Jobs</div>
                      <div className="font-bold">{m.activeJobs}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-white/40">This Month</div>
                      <div className="font-bold text-green-400">${m.earnings.toLocaleString()}</div>
                    </div>
                    <div className="text-center hidden md:block">
                      <div className="text-xs text-white/40">Joined</div>
                      <div className="text-sm">{m.joined}</div>
                    </div>
                    <button className="p-2 rounded-lg border border-white/10 hover:bg-white/5 transition">
                      <Settings size={14} className="text-white/50" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* CLIENTS */}
          {tab === "Clients" && (
            <div className="space-y-3">
              {MOCK_CLIENTS.map((c) => (
                <div key={c.id} className="glass-card rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-bold text-yellow-400">
                      {c.name[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 font-bold">
                        {c.name}
                        {c.status === "premium" && (
                          <Star size={12} className="text-yellow-400" fill="currentColor" />
                        )}
                      </div>
                      <div className="text-sm text-white/50">Contact: {c.contact}</div>
                      <div className="text-xs text-white/30">Client since {c.since}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="text-xs text-white/40">Projects</div>
                      <div className="font-bold">{c.activeProjects}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-white/40">Total Spent</div>
                      <div className="font-bold text-green-400">${c.totalSpent.toLocaleString()}</div>
                    </div>
                    <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/10 text-sm text-white/60 hover:text-white hover:bg-white/5 transition">
                      <ExternalLink size={12} />
                      Portal
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* PROJECTS */}
          {tab === "Projects" && (
            <div className="space-y-4">
              {MOCK_PROJECTS.map((p) => {
                const pct = Math.round((p.spent / p.budget) * 100);
                return (
                  <div key={p.id} className="glass-card rounded-2xl p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-lg">{p.title}</h3>
                        <div className="text-sm text-white/50 flex items-center gap-3 mt-1">
                          <span>{p.client}</span>
                          <span className="flex items-center gap-1">
                            <Clock size={12} /> Due {p.deadline}
                          </span>
                        </div>
                      </div>
                      <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                        p.status === "on-track"
                          ? "bg-green-500/10 text-green-400 border border-green-500/20"
                          : "bg-red-500/10 text-red-400 border border-red-500/20"
                      }`}>
                        {p.status === "on-track" ? "✓ On Track" : "⚠ At Risk"}
                      </span>
                    </div>

                    {/* Team */}
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-xs text-white/40">Team:</span>
                      {p.assigned.map((name) => (
                        <span key={name} className="text-xs px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-white/70">
                          {name}
                        </span>
                      ))}
                    </div>

                    {/* Budget Bar */}
                    <div>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-white/40">Budget Used</span>
                        <span className={pct >= 90 ? "text-red-400" : "text-white/60"}>
                          ${p.spent.toLocaleString()} / ${p.budget.toLocaleString()} ({pct}%)
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${pct >= 90 ? "bg-red-500" : pct >= 70 ? "bg-yellow-500" : "bg-green-500"}`}
                          style={{ width: `${Math.min(pct, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* BILLING */}
          {tab === "Billing" && (
            <div className="space-y-6 max-w-3xl">
              <div className="glass-card rounded-2xl p-6">
                <h3 className="font-bold mb-5">Agency Plan</h3>
                <div className="flex items-center justify-between p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 mb-5">
                  <div>
                    <div className="font-bold text-yellow-400">Agency Pro</div>
                    <div className="text-sm text-white/50">Up to 20 members · Priority support · 1.5% platform fee</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black gold-text">$149</div>
                    <div className="text-xs text-white/40">/month</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: "Members", value: `${MOCK_MEMBERS.length}/20` },
                    { label: "This Month", value: `$${totalEarnings.toLocaleString()}` },
                    { label: "Platform Fee", value: `$${Math.round(totalEarnings * 0.015).toLocaleString()}` },
                    { label: "Net Earnings", value: `$${Math.round(totalEarnings * 0.985).toLocaleString()}` },
                  ].map((s, i) => (
                    <div key={i} className="text-center p-3 rounded-xl bg-white/5">
                      <div className="text-white/50 text-xs mb-1">{s.label}</div>
                      <div className="font-bold">{s.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card rounded-2xl p-6">
                <h3 className="font-bold mb-4">Recent Payouts</h3>
                <div className="space-y-3">
                  {["Jun 2026", "May 2026", "Apr 2026"].map((month, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/3 transition">
                      <div>
                        <div className="font-medium text-sm">{month} Payout</div>
                        <div className="text-xs text-white/40">Processed via Stripe Connect</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-400">${(totalEarnings * (1 - 0.015) * (0.9 + i * 0.05)).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</div>
                        <div className="text-xs text-white/30 flex items-center gap-1 justify-end">
                          <CheckCircle2 size={10} className="text-green-400" /> Deposited
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Invite Modal */}
          {showInvite && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="glass-card rounded-3xl p-6 w-full max-w-md">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-bold text-lg">Invite Team Member</h3>
                  <button onClick={() => setShowInvite(false)} className="text-white/50 hover:text-white">
                    <X size={20} />
                  </button>
                </div>

                {inviteSent ? (
                  <div className="text-center py-8">
                    <CheckCircle2 size={48} className="text-green-400 mx-auto mb-3" />
                    <div className="font-bold">Invite Sent!</div>
                    <div className="text-sm text-white/50">They'll receive an email shortly</div>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4 mb-5">
                      <div>
                        <label className="text-xs text-white/50 mb-2 block uppercase tracking-wide">Email Address</label>
                        <input
                          value={inviteEmail}
                          onChange={(e) => setInviteEmail(e.target.value)}
                          placeholder="team@example.com"
                          type="email"
                          className="veritas-input"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-white/50 mb-2 block uppercase tracking-wide">Role</label>
                        <select
                          value={inviteRole}
                          onChange={(e) => setInviteRole(e.target.value)}
                          className="veritas-input"
                        >
                          {["Developer", "Designer", "Writer", "Marketing", "Video", "Consultant", "Manager"].map((r) => (
                            <option key={r}>{r}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <button
                      onClick={sendInvite}
                      disabled={!inviteEmail || inviting}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-black font-bold disabled:opacity-40 transition"
                    >
                      {inviting ? <Loader2 size={16} className="animate-spin" /> : <Mail size={16} />}
                      Send Invite
                    </button>
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
