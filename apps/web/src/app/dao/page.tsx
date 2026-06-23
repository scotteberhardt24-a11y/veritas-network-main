"use client";

import { useState } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import TopBar from "@/components/topbar/TopBar";
import {
  Vote,
  Plus,
  Clock,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Coins,
  Users,
  Shield,
  ChevronRight,
  X,
  Loader2,
  AlertCircle,
  BarChart3,
  Wallet,
} from "lucide-react";

type ProposalStatus = "active" | "passed" | "failed" | "pending";

interface Proposal {
  id: string;
  title: string;
  description: string;
  proposer: string;
  status: ProposalStatus;
  votesFor: number;
  votesAgainst: number;
  abstain: number;
  quorum: number;
  deadline: string;
  category: string;
  myVote?: "for" | "against" | "abstain";
  impact: string;
}

const MOCK_PROPOSALS: Proposal[] = [
  {
    id: "VIP-042",
    title: "Reduce Platform Fee from 2.5% to 2.0% for Elite Members",
    description: "Proposal to lower the platform fee for users with TruScore 90+ from 2.5% to 2.0% to incentivize high-quality work and reward top performers.",
    proposer: "Alex Chen (Score: 99)",
    status: "active",
    votesFor: 8420,
    votesAgainst: 2130,
    abstain: 450,
    quorum: 75,
    deadline: "Jul 22, 2026",
    category: "Economics",
    impact: "Est. $240K annual fee reduction distributed to Elite tier",
  },
  {
    id: "VIP-041",
    title: "Increase Dispute Resolution Panel from 3 to 5 Members",
    description: "Expand the dispute resolution panel from 3 to 5 randomly selected, verified arbitrators to reduce bias and improve outcomes.",
    proposer: "Priya Sharma (Score: 96)",
    status: "active",
    votesFor: 11200,
    votesAgainst: 890,
    abstain: 320,
    quorum: 85,
    deadline: "Jul 19, 2026",
    category: "Governance",
    impact: "Affects all dispute resolutions platform-wide",
  },
  {
    id: "VIP-040",
    title: "Launch Veritas Grants Program ($500K Treasury Allocation)",
    description: "Allocate $500,000 from the DAO treasury to fund open-source tools, integrations, and community projects that benefit the Veritas ecosystem.",
    proposer: "Maya Rodriguez (Score: 98)",
    status: "passed",
    votesFor: 14800,
    votesAgainst: 1200,
    abstain: 600,
    quorum: 90,
    deadline: "Jul 10, 2026",
    category: "Treasury",
    impact: "$500K deployed to 20+ ecosystem projects",
    myVote: "for",
  },
  {
    id: "VIP-039",
    title: "Mandatory Video Verification for $10K+ Contracts",
    description: "Require both parties to complete a 2-minute video verification before contracts exceeding $10,000 can be executed.",
    proposer: "James Park (Score: 97)",
    status: "failed",
    votesFor: 4200,
    votesAgainst: 9100,
    abstain: 800,
    quorum: 65,
    deadline: "Jul 5, 2026",
    category: "Security",
    impact: "Would affect ~15% of contracts on platform",
    myVote: "against",
  },
  {
    id: "VIP-043",
    title: "Add Native USDC Payment Support",
    description: "Integrate native USDC stablecoin payments across all escrow contracts, enabling crypto-native freelancers to receive payments without conversion.",
    proposer: "David Okonkwo (Score: 95)",
    status: "pending",
    votesFor: 0,
    votesAgainst: 0,
    abstain: 0,
    quorum: 70,
    deadline: "Aug 1, 2026",
    category: "Feature",
    impact: "Enables $0 conversion fees for crypto payments",
  },
];

const TREASURY = {
  total: 4200000,
  allocated: 980000,
  earned: 12400000,
  distributed: 11200000,
};

const STATUS_META: Record<ProposalStatus, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  active: { label: "Voting Active", color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20", icon: Vote },
  passed: { label: "Passed", color: "text-green-400", bg: "bg-green-500/10 border-green-500/20", icon: CheckCircle2 },
  failed: { label: "Failed", color: "text-red-400", bg: "bg-red-500/10 border-red-500/20", icon: XCircle },
  pending: { label: "Pending Review", color: "text-white/50", bg: "bg-white/5 border-white/10", icon: Clock },
};

export default function DAOPage() {
  const [proposals, setProposals] = useState<Proposal[]>(MOCK_PROPOSALS);
  const [filter, setFilter] = useState<"all" | ProposalStatus>("all");
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newCategory, setNewCategory] = useState("Governance");
  const [voting, setVoting] = useState<string | null>(null);

  const myVotingPower = 94; // TruScore = voting power
  const activeCount = proposals.filter((p) => p.status === "active").length;

  function vote(proposalId: string, choice: "for" | "against" | "abstain") {
    setVoting(proposalId + choice);
    setTimeout(() => {
      setProposals((prev) =>
        prev.map((p) => {
          if (p.id !== proposalId) return p;
          const update = { ...p, myVote: choice } as Proposal;
          if (choice === "for") update.votesFor += myVotingPower;
          if (choice === "against") update.votesAgainst += myVotingPower;
          if (choice === "abstain") update.abstain += myVotingPower;
          return update;
        })
      );
      setVoting(null);
    }, 700);
  }

  function submitProposal() {
    if (!newTitle || !newDesc) return;
    const p: Proposal = {
      id: `VIP-0${44 + proposals.length}`,
      title: newTitle,
      description: newDesc,
      proposer: "You (Score: 87)",
      status: "pending",
      votesFor: 0,
      votesAgainst: 0,
      abstain: 0,
      quorum: 70,
      deadline: "TBD",
      category: newCategory,
      impact: "To be determined by community",
    };
    setProposals((prev) => [p, ...prev]);
    setNewTitle("");
    setNewDesc("");
    setShowCreate(false);
  }

  const filtered = filter === "all" ? proposals : proposals.filter((p) => p.status === filter);

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
                <Vote className="text-yellow-400" size={28} />
                <h1 className="text-3xl font-black gold-text">DAO Governance</h1>
              </div>
              <p className="text-white/50">Shape the future of the Veritas platform with your vote</p>
            </div>
            <button
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-black font-bold transition"
            >
              <Plus size={18} />
              New Proposal
            </button>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { icon: Vote, label: "Active Proposals", value: activeCount, color: "text-yellow-400" },
              { icon: Wallet, label: "Your Voting Power", value: `${myVotingPower} VP`, color: "text-cyan-400" },
              { icon: Coins, label: "Treasury", value: `$${(TREASURY.total / 1000000).toFixed(1)}M`, color: "text-green-400" },
              { icon: Users, label: "DAO Members", value: "8,241", color: "text-purple-400" },
            ].map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className="glass-card rounded-2xl p-5">
                  <Icon size={20} className={s.color} />
                  <div className="text-2xl font-black mt-3 mb-1">{s.value}</div>
                  <div className="text-xs text-white/50">{s.label}</div>
                </div>
              );
            })}
          </div>

          {/* Treasury Breakdown */}
          <div className="glass-card rounded-2xl p-6 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Coins size={18} className="text-yellow-400" />
              <span className="font-bold">Treasury Overview</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Total Treasury", value: `$${(TREASURY.total / 1000000).toFixed(2)}M`, color: "text-yellow-400" },
                { label: "Allocated", value: `$${(TREASURY.allocated / 1000).toFixed(0)}K`, color: "text-orange-400" },
                { label: "Available", value: `$${((TREASURY.total - TREASURY.allocated) / 1000000).toFixed(2)}M`, color: "text-green-400" },
                { label: "Total Earned", value: `$${(TREASURY.earned / 1000000).toFixed(1)}M`, color: "text-cyan-400" },
              ].map((t, i) => (
                <div key={i} className="text-center p-3 rounded-xl bg-white/5">
                  <div className="text-xs text-white/40 mb-1">{t.label}</div>
                  <div className={`text-xl font-black ${t.color}`}>{t.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-5">
            {(["all", "active", "passed", "failed", "pending"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition ${
                  filter === f
                    ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                    : "border border-white/10 text-white/40 hover:text-white"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Proposals */}
          <div className="space-y-4">
            {filtered.map((p) => {
              const total = p.votesFor + p.votesAgainst + p.abstain;
              const forPct = total ? Math.round((p.votesFor / total) * 100) : 0;
              const againstPct = total ? Math.round((p.votesAgainst / total) * 100) : 0;
              const meta = STATUS_META[p.status];
              const StatusIcon = meta.icon;
              const isActive = p.status === "active";

              return (
                <div key={p.id} className="glass-card rounded-2xl p-6">
                  {/* Proposal Header */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs text-white/30 font-mono">{p.id}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-white/40">{p.category}</span>
                        <span className={`text-xs px-3 py-1 rounded-full border flex items-center gap-1 font-medium ${meta.bg} ${meta.color}`}>
                          <StatusIcon size={10} />
                          {meta.label}
                        </span>
                      </div>
                      <h3 className="font-bold text-lg leading-snug mb-1">{p.title}</h3>
                      <p className="text-sm text-white/50 mb-2">{p.description}</p>
                      <div className="flex items-center gap-3 text-xs text-white/30">
                        <span>Proposed by {p.proposer}</span>
                        {isActive && <span className="flex items-center gap-1"><Clock size={10} /> Ends {p.deadline}</span>}
                        <span className="text-yellow-400/70">⚡ {p.impact}</span>
                      </div>
                    </div>
                  </div>

                  {/* Vote Bar */}
                  {total > 0 && (
                    <div className="mb-4">
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-green-400 font-medium">For: {forPct}% ({p.votesFor.toLocaleString()} VP)</span>
                        <span className="text-white/40">Quorum: {p.quorum}% required</span>
                        <span className="text-red-400 font-medium">Against: {againstPct}% ({p.votesAgainst.toLocaleString()} VP)</span>
                      </div>
                      <div className="h-3 rounded-full bg-white/10 overflow-hidden flex">
                        <div className="h-full bg-green-500 transition-all" style={{ width: `${forPct}%` }} />
                        <div className="h-full bg-white/20 transition-all" style={{ width: `${total ? Math.round((p.abstain / total) * 100) : 0}%` }} />
                        <div className="h-full bg-red-500 transition-all" style={{ width: `${againstPct}%` }} />
                      </div>
                      <div className="text-xs text-white/30 mt-1">{total.toLocaleString()} total votes cast</div>
                    </div>
                  )}

                  {/* Voting Buttons */}
                  {isActive && !p.myVote && (
                    <div className="flex gap-3">
                      {(["for", "against", "abstain"] as const).map((choice) => (
                        <button
                          key={choice}
                          onClick={() => vote(p.id, choice)}
                          disabled={!!voting}
                          className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition capitalize disabled:opacity-50 ${
                            choice === "for"
                              ? "bg-green-500/20 border border-green-500/30 text-green-400 hover:bg-green-500/30"
                              : choice === "against"
                              ? "bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30"
                              : "bg-white/5 border border-white/10 text-white/40 hover:bg-white/10"
                          }`}
                        >
                          {voting === p.id + choice ? (
                            <Loader2 size={14} className="animate-spin mx-auto" />
                          ) : (
                            `Vote ${choice === "for" ? "✓" : choice === "against" ? "✗" : "~"} ${choice}`
                          )}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Already voted */}
                  {p.myVote && (
                    <div className={`flex items-center gap-2 text-sm font-medium ${
                      p.myVote === "for" ? "text-green-400" : p.myVote === "against" ? "text-red-400" : "text-white/40"
                    }`}>
                      <CheckCircle2 size={16} />
                      You voted {p.myVote} with {myVotingPower} voting power
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Create Proposal Modal */}
          {showCreate && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="glass-card rounded-3xl p-6 w-full max-w-lg">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-bold text-lg">Submit a Proposal</h3>
                  <button onClick={() => setShowCreate(false)} className="text-white/50 hover:text-white">
                    <X size={20} />
                  </button>
                </div>

                <div className="p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-start gap-2 mb-5 text-sm">
                  <AlertCircle size={16} className="text-yellow-400 flex-shrink-0 mt-0.5" />
                  <span className="text-yellow-300">Requires TruScore 75+ and 30 days on platform to submit. Proposals need 5% quorum to proceed to vote.</span>
                </div>

                <div className="space-y-4 mb-5">
                  <div>
                    <label className="text-xs text-white/50 mb-2 block uppercase tracking-wide">Category</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="veritas-input"
                    >
                      {["Governance", "Economics", "Security", "Feature", "Treasury", "Community"].map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-white/50 mb-2 block uppercase tracking-wide">Proposal Title</label>
                    <input
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="Clear, specific title describing the change"
                      className="veritas-input"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/50 mb-2 block uppercase tracking-wide">Full Description</label>
                    <textarea
                      value={newDesc}
                      onChange={(e) => setNewDesc(e.target.value)}
                      placeholder="Describe the proposal in detail: what it changes, why it's needed, and expected impact..."
                      rows={5}
                      className="veritas-input resize-none"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowCreate(false)}
                    className="flex-1 py-3 rounded-xl border border-white/10 text-white/60 text-sm hover:text-white transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={submitProposal}
                    disabled={!newTitle || !newDesc}
                    className="flex-1 py-3 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-sm disabled:opacity-40 transition"
                  >
                    Submit for Review
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
