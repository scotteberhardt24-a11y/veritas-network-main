"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import TopBar from "@/components/topbar/TopBar";
import {
  Globe,
  Heart,
  MessageCircle,
  Share2,
  BookOpen,
  Calendar,
  Users,
  TrendingUp,
  Plus,
  Shield,
  Flame,
  Award,
  ChevronRight,
  X,
  Send,
  Loader2,
  Sparkles,
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "https://veritas-trust-ledger-production.up.railway.app";

const TABS = ["Feed", "Events", "Forums", "Members", "Resources"];

const MOCK_POSTS = [
  {
    id: "1",
    author: "Alex Chen",
    username: "alexchen.dev",
    avatar: "AC",
    score: 99,
    verified: true,
    time: "2h ago",
    category: "Tip",
    content:
      "Just hit a TruScore of 99! The key? Never miss a deadline and always over-communicate. I send progress updates every 48 hours whether clients ask or not. Trust is built in the small moments. 🚀",
    likes: 142,
    comments: 38,
    liked: false,
    tags: ["TruScore", "Freelancing", "Tips"],
  },
  {
    id: "2",
    author: "Maya Rodriguez",
    username: "maya.designs",
    avatar: "MR",
    score: 98,
    verified: true,
    time: "5h ago",
    category: "Case Study",
    content:
      "Had a client dispute for the first time after 2 years on Veritas. The AI arbitration resolved it in 48 hours — $8,400 was released from escrow. The system genuinely works. Platform reputation protection is real here.",
    likes: 89,
    comments: 22,
    liked: true,
    tags: ["Escrow", "Dispute", "Platform"],
  },
  {
    id: "3",
    author: "James Park",
    username: "jpark.writes",
    avatar: "JP",
    score: 97,
    verified: true,
    time: "1d ago",
    category: "Discussion",
    content:
      "Question for the community: How do you handle clients who want to scope-creep after a contract is signed? I've been using the AI Contract Writer to add explicit change order clauses and it's been a game-changer.",
    likes: 67,
    comments: 44,
    liked: false,
    tags: ["Contracts", "Clients", "Advice"],
  },
  {
    id: "4",
    author: "Priya Sharma",
    username: "priyadev",
    avatar: "PS",
    score: 96,
    verified: true,
    time: "2d ago",
    category: "Achievement",
    content:
      "🎉 Milestone: $200K earned on Veritas since joining 14 months ago. From $0 to six figures as a solo developer. The trust infrastructure here is what makes clients comfortable paying premium rates. AMA!",
    likes: 334,
    comments: 91,
    liked: false,
    tags: ["Milestone", "Success", "Developer"],
  },
];

const EVENTS = [
  {
    id: "1",
    title: "Veritas Summit 2026",
    date: "Aug 15, 2026",
    time: "10:00 AM PST",
    type: "Virtual",
    attendees: 1247,
    desc: "Annual gathering of the top 100 Veritas professionals. Keynotes, workshops, networking.",
    hot: true,
  },
  {
    id: "2",
    title: "AI Freelancing Masterclass",
    date: "Jul 22, 2026",
    time: "2:00 PM PST",
    type: "Webinar",
    attendees: 456,
    desc: "How to use AI tools to 10x your freelancing income. Led by TruScore Elite members.",
    hot: false,
  },
  {
    id: "3",
    title: "Web3 Contracts & Escrow AMA",
    date: "Jul 18, 2026",
    time: "11:00 AM PST",
    type: "Live Q&A",
    attendees: 289,
    desc: "Deep dive into smart escrow, blockchain verification, and dispute prevention.",
    hot: false,
  },
];

const FORUMS = [
  { id: "1", title: "Freelancing Strategy", posts: 1842, members: 3210, hot: true },
  { id: "2", title: "Web3 & Blockchain", posts: 934, members: 1567, hot: true },
  { id: "3", title: "Client Management", posts: 2103, members: 4821, hot: false },
  { id: "4", title: "TruScore Optimization", posts: 788, members: 2190, hot: false },
  { id: "5", title: "Dispute Resolution", posts: 445, members: 1034, hot: false },
  { id: "6", title: "Design & Creative", posts: 1209, members: 2876, hot: false },
];

type Post = typeof MOCK_POSTS[0];

const CATEGORY_COLORS: Record<string, string> = {
  Tip: "bg-cyan-500/20 text-cyan-400",
  "Case Study": "bg-purple-500/20 text-purple-400",
  Discussion: "bg-yellow-500/20 text-yellow-400",
  Achievement: "bg-green-500/20 text-green-400",
};

export default function CommunityPage() {
  const [tab, setTab] = useState("Feed");
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [showCompose, setShowCompose] = useState(false);
  const [newPost, setNewPost] = useState("");
  const [postCategory, setPostCategory] = useState("Discussion");
  const [postLoading, setPostLoading] = useState(false);

  function toggleLike(id: string) {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
          : p
      )
    );
  }

  async function submitPost() {
    if (!newPost.trim()) return;
    setPostLoading(true);

    // Simulate post submission
    setTimeout(() => {
      const post: Post = {
        id: Date.now().toString(),
        author: "You",
        username: "you",
        avatar: "YO",
        score: 87,
        verified: true,
        time: "Just now",
        category: postCategory,
        content: newPost,
        likes: 0,
        comments: 0,
        liked: false,
        tags: [],
      };
      setPosts((prev) => [post, ...prev]);
      setNewPost("");
      setShowCompose(false);
      setPostLoading(false);
    }, 800);
  }

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
                <Globe className="text-cyan-400" size={28} />
                <h1 className="text-3xl font-black gold-text">Community</h1>
              </div>
              <p className="text-white/50">Connect with the world's most trusted freelancers</p>
            </div>
            <button
              onClick={() => setShowCompose(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-black font-bold transition"
            >
              <Plus size={18} />
              Post
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b border-white/10 pb-0">
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

          <div className="flex gap-6">
            {/* Main Content */}
            <div className="flex-1 space-y-4">
              {/* FEED */}
              {tab === "Feed" && posts.map((post) => (
                <div key={post.id} className="glass-card rounded-2xl p-6">
                  {/* Post Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-yellow-500/20 to-cyan-500/20 flex items-center justify-center font-bold text-sm">
                        {post.avatar}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 font-bold">
                          {post.author}
                          {post.verified && <Shield size={12} className="text-yellow-400" />}
                          <span className="text-xs text-white/40 font-normal">{post.time}</span>
                        </div>
                        <div className="text-xs text-white/40">@{post.username} · TruScore {post.score}</div>
                      </div>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${CATEGORY_COLORS[post.category] || "bg-white/10 text-white/50"}`}>
                      {post.category}
                    </span>
                  </div>

                  {/* Content */}
                  <p className="text-white/80 leading-relaxed mb-4">{post.content}</p>

                  {/* Tags */}
                  {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((tag) => (
                        <span key={tag} className="text-xs px-2 py-1 rounded-lg bg-white/5 text-white/40">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-4 pt-3 border-t border-white/5">
                    <button
                      onClick={() => toggleLike(post.id)}
                      className={`flex items-center gap-2 text-sm transition ${post.liked ? "text-red-400" : "text-white/40 hover:text-red-400"}`}
                    >
                      <Heart size={16} fill={post.liked ? "currentColor" : "none"} />
                      {post.likes}
                    </button>
                    <button className="flex items-center gap-2 text-sm text-white/40 hover:text-cyan-400 transition">
                      <MessageCircle size={16} />
                      {post.comments}
                    </button>
                    <button className="flex items-center gap-2 text-sm text-white/40 hover:text-green-400 transition">
                      <Share2 size={16} />
                      Share
                    </button>
                  </div>
                </div>
              ))}

              {/* EVENTS */}
              {tab === "Events" && (
                <div className="space-y-4">
                  {EVENTS.map((event) => (
                    <div key={event.id} className="glass-card rounded-2xl p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-lg">{event.title}</h3>
                            {event.hot && (
                              <div className="flex items-center gap-1 text-xs text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-full">
                                <Flame size={10} />
                                Hot
                              </div>
                            )}
                          </div>
                          <div className="text-sm text-white/50 flex items-center gap-3">
                            <span className="flex items-center gap-1">
                              <Calendar size={12} />
                              {event.date} · {event.time}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users size={12} />
                              {event.attendees.toLocaleString()} attending
                            </span>
                          </div>
                        </div>
                        <span className="text-xs px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                          {event.type}
                        </span>
                      </div>
                      <p className="text-sm text-white/60 mb-4">{event.desc}</p>
                      <button className="px-5 py-2 rounded-xl bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 text-sm font-medium hover:bg-yellow-500/30 transition">
                        Register Free →
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* FORUMS */}
              {tab === "Forums" && (
                <div className="space-y-3">
                  {FORUMS.map((forum) => (
                    <div key={forum.id} className="glass-card rounded-2xl p-5 flex items-center justify-between hover:bg-white/3 transition cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                          <BookOpen size={20} className="text-yellow-400" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 font-semibold">
                            {forum.title}
                            {forum.hot && <Flame size={12} className="text-orange-400" />}
                          </div>
                          <div className="text-xs text-white/40">
                            {forum.posts.toLocaleString()} posts · {forum.members.toLocaleString()} members
                          </div>
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-white/30" />
                    </div>
                  ))}
                </div>
              )}

              {/* MEMBERS */}
              {tab === "Members" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {MOCK_POSTS.map((p) => (
                    <div key={p.id} className="glass-card rounded-2xl p-5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500/20 to-cyan-500/20 flex items-center justify-center font-bold">
                          {p.avatar}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 font-semibold text-sm">
                            {p.author}
                            {p.verified && <Shield size={12} className="text-yellow-400" />}
                          </div>
                          <div className="text-xs text-white/40">@{p.username}</div>
                          <div className="text-xs gold-text font-bold mt-0.5">TruScore {p.score}</div>
                        </div>
                      </div>
                      <button className="text-xs px-3 py-1.5 rounded-lg border border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10 transition">
                        Follow
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* RESOURCES */}
              {tab === "Resources" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { icon: "📋", title: "Freelancing Starter Guide", desc: "Everything to launch on Veritas", tag: "Guide" },
                    { icon: "⚖️", title: "Legal Contract Templates", desc: "10+ ready-to-use templates", tag: "Templates" },
                    { icon: "🏆", title: "TruScore Optimization Playbook", desc: "Get from 0 to 90+ in 90 days", tag: "Strategy" },
                    { icon: "🔐", title: "Web3 Security Handbook", desc: "Protect your wallet and identity", tag: "Security" },
                    { icon: "💰", title: "Pricing Guide by Category", desc: "Market rates for every skill", tag: "Pricing" },
                    { icon: "🤖", title: "AI Tools for Freelancers", desc: "Boost output with AI workflows", tag: "AI" },
                  ].map((r, i) => (
                    <div key={i} className="glass-card rounded-2xl p-5 hover:bg-white/3 transition cursor-pointer">
                      <div className="text-2xl mb-3">{r.icon}</div>
                      <div className="font-bold mb-1">{r.title}</div>
                      <div className="text-sm text-white/50 mb-3">{r.desc}</div>
                      <span className="text-xs px-2 py-1 rounded-full bg-white/5 text-white/40">{r.tag}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="w-72 flex-shrink-0 hidden xl:flex flex-col gap-4">
              {/* Trending */}
              <div className="glass-card rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp size={16} className="text-yellow-400" />
                  <span className="font-bold text-sm">Trending Topics</span>
                </div>
                <div className="space-y-3">
                  {["#TruScore", "#Web3Freelance", "#SmartEscrow", "#AIContracts", "#FreelanceTips"].map((tag, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-sm text-cyan-400">{tag}</span>
                      <span className="text-xs text-white/30">{(Math.random() * 500 + 50 | 0)} posts</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Community Stats */}
              <div className="glass-card rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Award size={16} className="text-yellow-400" />
                  <span className="font-bold text-sm">Community Stats</span>
                </div>
                <div className="space-y-3">
                  {[
                    { label: "Active Members", value: "12,847" },
                    { label: "Posts Today", value: "3,291" },
                    { label: "Jobs Posted", value: "891" },
                    { label: "Disputes Resolved", value: "99.2%" },
                  ].map((s, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-white/50">{s.label}</span>
                      <span className="font-bold gold-text">{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Compose Modal */}
          {showCompose && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="glass-card rounded-3xl p-6 w-full max-w-lg">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-bold text-lg">Share with the Community</h3>
                  <button onClick={() => setShowCompose(false)} className="text-white/50 hover:text-white">
                    <X size={20} />
                  </button>
                </div>

                <div className="mb-4">
                  <div className="flex gap-2 mb-3">
                    {["Discussion", "Tip", "Case Study", "Achievement"].map((c) => (
                      <button
                        key={c}
                        onClick={() => setPostCategory(c)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                          postCategory === c
                            ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                            : "border border-white/10 text-white/40"
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                  <textarea
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    placeholder="Share an insight, tip, or achievement with the community..."
                    rows={5}
                    className="veritas-input resize-none text-sm"
                  />
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setShowCompose(false)} className="flex-1 py-2.5 rounded-xl border border-white/10 text-white/60 text-sm hover:text-white transition">
                    Cancel
                  </button>
                  <button
                    onClick={submitPost}
                    disabled={!newPost.trim() || postLoading}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-sm disabled:opacity-40 transition"
                  >
                    {postLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                    Post
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
