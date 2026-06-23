"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/sidebar/Sidebar";
import TopBar from "@/components/topbar/TopBar";
import {
  Bot,
  Send,
  Sparkles,
  Zap,
  FileText,
  Search,
  Scale,
  Briefcase,
  ChevronRight,
  RotateCcw,
  Copy,
  CheckCheck,
  Loader2,
  Shield,
  TrendingUp,
  MessageSquare,
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const QUICK_ACTIONS = [
  {
    icon: FileText,
    label: "Draft a Contract",
    prompt:
      "Help me draft a freelance contract for a web development project. Include payment terms, deliverables, and IP ownership clauses.",
    color: "text-yellow-400",
    bg: "bg-yellow-500/10 border-yellow-500/20",
  },
  {
    icon: Search,
    label: "Find Best Workers",
    prompt:
      "I need to find the best React developers for a 3-month project. What should I look for in their TruScore and what questions should I ask?",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10 border-cyan-500/20",
  },
  {
    icon: Scale,
    label: "Dispute Advice",
    prompt:
      "A client is refusing to pay the final milestone claiming the work wasn't completed. What are my options and how should I approach this dispute?",
    color: "text-red-400",
    bg: "bg-red-500/10 border-red-500/20",
  },
  {
    icon: TrendingUp,
    label: "Grow My TruScore",
    prompt:
      "My TruScore is currently at 74. What are the fastest and most effective ways to improve it on the Veritas platform?",
    color: "text-green-400",
    bg: "bg-green-500/10 border-green-500/20",
  },
  {
    icon: Briefcase,
    label: "Proposal Writing",
    prompt:
      "Help me write a compelling job proposal for a UI/UX design project. I have 5 years of experience and a TruScore of 91.",
    color: "text-purple-400",
    bg: "bg-purple-500/10 border-purple-500/20",
  },
  {
    icon: Shield,
    label: "Escrow Strategy",
    prompt:
      "What's the best way to structure milestone payments for a $15,000 website build to protect both parties?",
    color: "text-orange-400",
    bg: "bg-orange-500/10 border-orange-500/20",
  },
];

const SYSTEM_PROMPT = `You are the Veritas AI Trust Assistant — an expert advisor embedded in the Veritas Trust Ledger platform, the world's most advanced Web3 gig marketplace.

Your expertise covers:
- TruScore reputation system (0-100 score based on on-time delivery, client ratings, dispute resolution, identity verification, and blockchain attestations)
- Smart Escrow contracts with milestone-based release and dispute resolution
- NFT Reputation Passports on Polygon blockchain
- AI-powered worker matching with trust-weighted scoring
- Freelance contract law, payment protection, and dispute best practices
- Platform features: Job marketplace, video conferencing, time tracking, DAO governance, referral system

Your personality: Professional, knowledgeable, concise, trustworthy. You speak with authority but warmth. Always prioritize user protection and platform trust.

Always give actionable, specific advice. When relevant, mention Veritas-specific features that can help. Keep responses focused and useful — not generic.`;

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hello! I'm your Veritas AI Trust Assistant. I can help you draft contracts, find top talent, navigate disputes, grow your TruScore, and maximize your success on the platform. What can I help you with today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(content: string) {
    if (!content.trim() || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const history = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: [
            ...history,
            { role: "user", content: content.trim() },
          ],
        }),
      });

      const data = await res.json();
      const text =
        data.content?.[0]?.text || "I'm sorry, I couldn't process that. Please try again.";

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: text,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "I'm experiencing a connection issue. Please check your network and try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  function copyMessage(id: string, content: string) {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  function resetChat() {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content:
          "Hello! I'm your Veritas AI Trust Assistant. I can help you draft contracts, find top talent, navigate disputes, grow your TruScore, and maximize your success on the platform. What can I help you with today?",
        timestamp: new Date(),
      },
    ]);
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopBar />

        <div className="flex-1 flex overflow-hidden p-4 sm:p-6 gap-6">
          {/* Chat Area */}
          <div className="flex-1 flex flex-col glass-card rounded-3xl overflow-hidden">
            {/* Chat Header */}
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                  <Bot className="text-yellow-400" size={20} />
                </div>
                <div>
                  <div className="font-bold">Veritas AI Assistant</div>
                  <div className="text-xs text-green-400 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
                    Online • Powered by Claude
                  </div>
                </div>
              </div>
              <button
                onClick={resetChat}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-white/50 hover:text-white hover:bg-white/5 transition text-sm"
              >
                <RotateCcw size={14} />
                New Chat
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center ${
                      msg.role === "assistant"
                        ? "bg-yellow-500/20"
                        : "bg-cyan-500/20"
                    }`}
                  >
                    {msg.role === "assistant" ? (
                      <Bot size={16} className="text-yellow-400" />
                    ) : (
                      <MessageSquare size={16} className="text-cyan-400" />
                    )}
                  </div>

                  {/* Bubble */}
                  <div className={`max-w-[80%] group`}>
                    <div
                      className={`rounded-2xl px-5 py-4 text-sm leading-relaxed whitespace-pre-wrap ${
                        msg.role === "assistant"
                          ? "bg-white/5 border border-white/10 text-white"
                          : "bg-yellow-500/20 border border-yellow-500/30 text-white"
                      }`}
                    >
                      {msg.content}
                    </div>
                    <div className="flex items-center gap-2 mt-1 px-1 opacity-0 group-hover:opacity-100 transition">
                      <span className="text-xs text-white/30">
                        {msg.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      {msg.role === "assistant" && (
                        <button
                          onClick={() => copyMessage(msg.id, msg.content)}
                          className="text-white/30 hover:text-white/70 transition"
                        >
                          {copiedId === msg.id ? (
                            <CheckCheck size={12} className="text-green-400" />
                          ) : (
                            <Copy size={12} />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex gap-4">
                  <div className="w-9 h-9 rounded-xl bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
                    <Bot size={16} className="text-yellow-400" />
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4">
                    <div className="flex items-center gap-2 text-white/50">
                      <Loader2 size={14} className="animate-spin" />
                      <span className="text-sm">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="px-6 py-4 border-t border-white/10">
              <div className="flex gap-3 items-end">
                <div className="flex-1 relative">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask me anything about contracts, workers, disputes, TruScore..."
                    rows={1}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-white text-sm outline-none focus:border-yellow-500/50 resize-none transition"
                    style={{ minHeight: 48, maxHeight: 160 }}
                    onInput={(e) => {
                      const el = e.currentTarget;
                      el.style.height = "auto";
                      el.style.height = Math.min(el.scrollHeight, 160) + "px";
                    }}
                  />
                </div>
                <button
                  onClick={() => sendMessage(input)}
                  disabled={loading || !input.trim()}
                  className="w-12 h-12 rounded-2xl bg-yellow-500 hover:bg-yellow-400 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition flex-shrink-0"
                >
                  <Send size={18} className="text-black" />
                </button>
              </div>
              <p className="text-xs text-white/30 mt-2 text-center">
                Press Enter to send • Shift+Enter for new line
              </p>
            </div>
          </div>

          {/* Quick Actions Panel */}
          <div className="w-72 flex-shrink-0 hidden xl:flex flex-col gap-4">
            <div className="glass-card rounded-3xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles size={16} className="text-yellow-400" />
                <span className="font-bold text-sm">Quick Actions</span>
              </div>
              <div className="space-y-2">
                {QUICK_ACTIONS.map((action, i) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={i}
                      onClick={() => sendMessage(action.prompt)}
                      disabled={loading}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition hover:scale-[1.02] disabled:opacity-40 ${action.bg}`}
                    >
                      <Icon size={16} className={action.color} />
                      <span className="text-sm text-white/80">{action.label}</span>
                      <ChevronRight size={14} className="ml-auto text-white/30" />
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="glass-card rounded-3xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Zap size={16} className="text-cyan-400" />
                <span className="font-bold text-sm">AI Capabilities</span>
              </div>
              <ul className="space-y-2 text-xs text-white/60">
                {[
                  "Contract drafting & review",
                  "Dispute strategy & advice",
                  "TruScore optimization",
                  "Proposal writing",
                  "Payment structure guidance",
                  "Talent evaluation criteria",
                  "Platform navigation help",
                  "Web3 & blockchain explainers",
                ].map((cap, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/60" />
                    {cap}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
