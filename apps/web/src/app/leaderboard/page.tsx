"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import TopBar from "@/components/topbar/TopBar";
import {
  Trophy,
  Shield,
  Star,
  TrendingUp,
  TrendingDown,
  Minus,
  Crown,
  Zap,
  Globe,
  Filter,
  Search,
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "https://veritas-trust-ledger-production.up.railway.app";

const CATEGORIES = ["All", "Development", "Design", "Writing", "Marketing", "Consulting", "Video"];
const TIME_FILTERS = ["All Time", "This Month", "This Week"];

const MOCK_LEADERS = [
  { rank: 1, prev: 1, name: "Alex Chen", username: "alexchen.dev", score: 99, category: "Development", jobs: 247, earnings: 184500, badge: "🏆", verified: true, streak: 30 },
  { rank: 2, prev: 3, name: "Maya Rodriguez", username: "maya.designs", score: 98, category: "Design", jobs: 189, earnings: 142000, badge: "🥈", verified: true, streak: 22 },
  { rank: 3, prev: 2, name: "James Park", username: "jpark.writes", score: 97, category: "Writing", jobs: 312, earnings: 98700, badge: "🥉", verified: true, streak: 45 },
  { rank: 4, prev: 6, name: "Priya Sharma", username: "priyadev", score: 96, category: "Development", jobs: 156, earnings: 221000, badge: "⭐", verified: true, streak: 18 },
  { rank: 5, prev: 4, name: "David Okonkwo", username: "david.mktg", score: 95, category: "Marketing", jobs: 203, earnings: 87400, badge: "⭐", verified: true, streak: 29 },
  { rank: 6, prev: 7, name: "Lena Fischer", username: "lena.ux", score: 94, category: "Design", jobs: 178, earnings: 156300, badge: "⭐", verified: true, streak: 12 },
  { rank: 7, prev: 5, name: "Rahul Mehta", username: "rahulmehta", score: 93, category: "Consulting", jobs: 94, earnings: 312000, badge: "⭐", verified: true, streak: 8 },
  { rank: 8, prev: 9, name: "Sofia Torres", username: "sofia.vid", score: 92, category: "Video", jobs: 267, earnings: 124500, badge: "⭐", verified: false, streak: 14 },
  { rank: 9, prev: 8, name: "Marcus Johnson", username: "mjohnson.dev", score: 91, category: "Development", jobs: 198, earnings: 178900, badge: "⭐", verified: true, streak: 6 },
  { rank: 10, prev: 11, name: "Yuki Tanaka", username: "yuki.writes", score: 90, category: "Writing", jobs: 445, earnings: 76300, badge: "⭐", verified: true, streak: 21 },
  { rank: 11, prev: 10, name: "Carlos Lima", username: "carloslima", score: 89, category: "Marketing", jobs: 167, earnings: 98200, badge: "⭐", verified: false, streak: 9 },
  { rank: 12, prev: 14, name: "Aisha Diallo", username: "aisha.design", score: 88, category: "Design", jobs: 132, earnings: 112400, badge: "⭐", verified: true, streak: 15 },
];

type Leader = typeof MOCK_LEADERS[0];

function RankChange({ rank, prev }: { rank: number; prev: number }) {
  const diff = prev - rank;
  if (diff > 0) return <div className="flex items-center gap-1 text-green-400 text-xs"><TrendingUp size={12} />+{diff}</div>;
  if (diff < 0) return <div className="flex items-center gap-1 text-red-400 text-xs"><TrendingDown size={12} />{diff}</div>;
  return <div className="flex items-center gap-1 text-white/30 text-xs"><Minus size={12} /></div>;
}

function ScoreRing({ score }: { score: number }) {
  const r = 20;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  return (
    <div className="relative w-14 h-14 flex items-center justify-center">
      <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 56 56">
        <circle cx={28} cy={28} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={4} />
        <circle cx={28} cy={28} r={r} fill="none" stroke={score >= 90 ? "#d4af37" : score >= 75 ? "#06b6d4" : "#a1a1aa"} strokeWidth={4} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" />
      </svg>
      <span className="text-xs font-bold gold-text">{score}</span>
    </div>
  );
}

export default function LeaderboardPage() {
  const [category, setCategory] = useState("All");
  const [timeFilter, setTimeFilter] = useState("All Time");
  const [search, setSearch] = useState("");
  const [leaders, setLeaders] = useState<Leader[]>(MOCK_LEADERS);

  useEffect(() => {
    // Try live API, fall back to mock
    const token = localStorage.getItem("veritas_token");
    if (!token) return;
    fetch(`${API}/api/trust/leaderboard`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => d.data?.length && setLeaders(d.data))
      .catch(() => {});
  }, [category, timeFilter]);

  const filtered = leaders.filter((l) => {
    const matchCat = category === "All" || l.category === category;
    const matchSearch =
      !search ||
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.username.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const top3 = filtered.slice(0, 3);
  const rest = filtered.slice(3);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopBar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Trophy className="text-yellow-400" size={28} />
              <h1 className="text-3xl font-black gold-text">TruScore Leaderboard</h1>
            </div>
            <p className="text-white/50">The most trusted professionals on the Veritas Network</p>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1 max-w-sm">
              <Search size={16} className="absolute left-4 top-3.5 text-white/40" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search professionals..."
                className="veritas-input pl-10 py-3 text-sm"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                    category === c
                      ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                      : "border border-white/10 text-white/50 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              {TIME_FILTERS.map((t) => (
                <button
                  key={t}
                  onClick={() => setTimeFilter(t)}
                  className={`px-3 py-2 rounded-xl text-xs transition ${
                    timeFilter === t
                      ? "bg-white/10 text-white"
                      : "text-white/40 hover:text-white"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Podium Top 3 */}
          {top3.length >= 3 && (
            <div className="flex items-end justify-center gap-4 mb-10">
              {/* 2nd */}
              <div className="flex flex-col items-center gap-3 w-36">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center text-2xl font-black text-white">
                    {top3[1].name[0]}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-slate-500 flex items-center justify-center text-xs font-bold">2</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-sm">{top3[1].name}</div>
                  <div className="text-xs text-white/40">@{top3[1].username}</div>
                  <div className="text-xl font-black gold-text mt-1">{top3[1].score}</div>
                </div>
                <div className="w-full h-20 bg-gradient-to-t from-slate-700/40 to-transparent rounded-t-xl flex items-center justify-center">
                  <span className="text-3xl">🥈</span>
                </div>
              </div>

              {/* 1st */}
              <div className="flex flex-col items-center gap-3 w-40">
                <Crown size={28} className="text-yellow-400" />
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-3xl font-black text-black veritas-glow">
                    {top3[0].name[0]}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center text-xs font-bold text-black">1</div>
                </div>
                <div className="text-center">
                  <div className="font-bold">{top3[0].name}</div>
                  <div className="text-xs text-white/40">@{top3[0].username}</div>
                  <div className="text-2xl font-black gold-text mt-1">{top3[0].score}</div>
                </div>
                <div className="w-full h-32 bg-gradient-to-t from-yellow-500/20 to-transparent rounded-t-xl flex items-center justify-center">
                  <span className="text-4xl">🏆</span>
                </div>
              </div>

              {/* 3rd */}
              <div className="flex flex-col items-center gap-3 w-36">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-700 to-amber-900 flex items-center justify-center text-2xl font-black text-white">
                    {top3[2].name[0]}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-amber-700 flex items-center justify-center text-xs font-bold">3</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-sm">{top3[2].name}</div>
                  <div className="text-xs text-white/40">@{top3[2].username}</div>
                  <div className="text-xl font-black gold-text mt-1">{top3[2].score}</div>
                </div>
                <div className="w-full h-12 bg-gradient-to-t from-amber-700/30 to-transparent rounded-t-xl flex items-center justify-center">
                  <span className="text-3xl">🥉</span>
                </div>
              </div>
            </div>
          )}

          {/* Full Table */}
          <div className="glass-card rounded-3xl overflow-hidden">
            <div className="grid grid-cols-12 px-6 py-3 text-xs text-white/40 uppercase tracking-wide border-b border-white/10">
              <div className="col-span-1">Rank</div>
              <div className="col-span-4">Professional</div>
              <div className="col-span-2">TruScore</div>
              <div className="col-span-2 hidden sm:block">Category</div>
              <div className="col-span-1 hidden md:block">Jobs</div>
              <div className="col-span-2 hidden lg:block">Earnings</div>
            </div>

            {rest.map((leader) => (
              <div
                key={leader.rank}
                className="grid grid-cols-12 px-6 py-4 border-b border-white/5 hover:bg-white/3 transition items-center cursor-pointer"
              >
                {/* Rank */}
                <div className="col-span-1">
                  <div className="flex flex-col items-start gap-1">
                    <span className="font-bold text-white/80">#{leader.rank}</span>
                    <RankChange rank={leader.rank} prev={leader.prev} />
                  </div>
                </div>

                {/* Name */}
                <div className="col-span-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500/20 to-cyan-500/20 flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {leader.name[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 font-semibold text-sm">
                      {leader.name}
                      {leader.verified && (
                        <Shield size={12} className="text-yellow-400" />
                      )}
                    </div>
                    <div className="text-xs text-white/40">@{leader.username}</div>
                    {leader.streak >= 14 && (
                      <div className="flex items-center gap-1 text-xs text-orange-400 mt-0.5">
                        <Zap size={10} />
                        {leader.streak}d streak
                      </div>
                    )}
                  </div>
                </div>

                {/* Score */}
                <div className="col-span-2">
                  <ScoreRing score={leader.score} />
                </div>

                {/* Category */}
                <div className="col-span-2 hidden sm:block">
                  <span className="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/60">
                    {leader.category}
                  </span>
                </div>

                {/* Jobs */}
                <div className="col-span-1 hidden md:block text-sm text-white/60">
                  {leader.jobs}
                </div>

                {/* Earnings */}
                <div className="col-span-2 hidden lg:block text-sm font-semibold text-green-400">
                  ${leader.earnings.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
