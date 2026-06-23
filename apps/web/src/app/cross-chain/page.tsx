"use client";

import { useState } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import TopBar from "@/components/topbar/TopBar";
import {
  Zap,
  Wallet,
  ArrowRightLeft,
  DollarSign,
  TrendingUp,
  Shield,
  Copy,
  CheckCheck,
  ExternalLink,
  Plus,
  ChevronDown,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Globe,
} from "lucide-react";

const CHAINS = [
  { id: "ethereum", name: "Ethereum", symbol: "ETH", balance: 2.847, usd: 9823.41, icon: "⟠", color: "text-blue-400", explorer: "etherscan.io" },
  { id: "polygon", name: "Polygon", symbol: "MATIC", balance: 4210.5, usd: 3892.11, icon: "⬡", color: "text-purple-400", explorer: "polygonscan.com" },
  { id: "arbitrum", name: "Arbitrum", symbol: "ARB", balance: 842.3, usd: 1124.67, icon: "◆", color: "text-cyan-400", explorer: "arbiscan.io" },
  { id: "base", name: "Base", symbol: "ETH", balance: 0.412, usd: 1421.33, icon: "🔵", color: "text-blue-300", explorer: "basescan.org" },
];

const TOKENS = [
  { symbol: "USDC", name: "USD Coin", balance: 12450.00, usd: 12450.00, icon: "💵", change: 0 },
  { symbol: "ETH", name: "Ethereum", balance: 2.847, usd: 9823.41, icon: "⟠", change: 2.4 },
  { symbol: "MATIC", name: "Polygon", balance: 4210.5, usd: 3892.11, icon: "⬡", change: -1.2 },
  { symbol: "ARB", name: "Arbitrum", balance: 842.3, usd: 1124.67, icon: "◆", change: 5.7 },
  { symbol: "USDT", name: "Tether", balance: 5000.00, usd: 5000.00, icon: "💰", change: 0 },
];

const TX_HISTORY = [
  { id: "0x1a2b...9f3d", type: "received", amount: "+$4,500.00", token: "USDC", from: "TechVentures Inc.", chain: "Polygon", time: "2h ago", status: "confirmed" },
  { id: "0x3c4d...8e2f", type: "sent", amount: "-$250.00", token: "USDC", from: "Platform Fee", chain: "Polygon", time: "2h ago", status: "confirmed" },
  { id: "0x5e6f...7d1g", type: "received", amount: "+$9,800.00", token: "USDC", from: "FinEdge Capital", chain: "Ethereum", time: "1d ago", status: "confirmed" },
  { id: "0x7g8h...6c0h", type: "bridge", amount: "2.0 ETH → 4,210 MATIC", token: "ETH/MATIC", from: "Bridge Transfer", chain: "ETH → Polygon", time: "3d ago", status: "confirmed" },
  { id: "0x9i0j...5b9i", type: "received", amount: "+$3,200.00", token: "USDC", from: "Bloom Health", chain: "Base", time: "5d ago", status: "confirmed" },
];

export default function CrossChainPage() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [selectedChain, setSelectedChain] = useState(CHAINS[0]);
  const [showSend, setShowSend] = useState(false);
  const [sendAmount, setSendAmount] = useState("");
  const [sendTo, setSendTo] = useState("");
  const [sendToken, setSendToken] = useState("USDC");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [copiedAddr, setCopiedAddr] = useState(false);

  const walletAddress = "0x742d35Cc6634C0532925a3b8D4C9F9e14a3B2c91";
  const totalUSD = TOKENS.reduce((a, t) => a + t.usd, 0);

  function connectWallet() {
    setConnecting(true);
    setTimeout(() => {
      setConnecting(false);
      setWalletConnected(true);
    }, 1500);
  }

  function copyAddress() {
    navigator.clipboard.writeText(walletAddress);
    setCopiedAddr(true);
    setTimeout(() => setCopiedAddr(false), 2000);
  }

  function sendPayment() {
    if (!sendAmount || !sendTo) return;
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSent(true);
      setTimeout(() => {
        setSent(false);
        setShowSend(false);
        setSendAmount("");
        setSendTo("");
      }, 2000);
    }, 2000);
  }

  if (!walletConnected) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <TopBar />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
            <div className="glass-card rounded-3xl p-12 max-w-md w-full text-center">
              <div className="w-20 h-20 rounded-full bg-yellow-500/10 flex items-center justify-center mx-auto mb-6">
                <Wallet size={36} className="text-yellow-400" />
              </div>
              <h2 className="text-2xl font-black mb-3">Connect Your Wallet</h2>
              <p className="text-white/50 text-sm mb-8 leading-relaxed">
                Connect a Web3 wallet to send and receive crypto payments, bridge assets across chains, and manage your on-chain escrow.
              </p>
              <div className="space-y-3 mb-8">
                {[
                  { name: "MetaMask", icon: "🦊", desc: "Browser extension" },
                  { name: "WalletConnect", icon: "🔗", desc: "Mobile & desktop" },
                  { name: "Coinbase Wallet", icon: "🔵", desc: "Coinbase users" },
                ].map((w) => (
                  <button
                    key={w.name}
                    onClick={connectWallet}
                    className="w-full flex items-center gap-4 p-4 rounded-2xl border border-white/10 hover:border-yellow-500/30 hover:bg-yellow-500/5 transition"
                  >
                    <span className="text-2xl">{w.icon}</span>
                    <div className="text-left">
                      <div className="font-bold text-sm">{w.name}</div>
                      <div className="text-xs text-white/40">{w.desc}</div>
                    </div>
                    {connecting ? <Loader2 size={16} className="ml-auto animate-spin text-yellow-400" /> : <ChevronDown size={16} className="ml-auto text-white/30 -rotate-90" />}
                  </button>
                ))}
              </div>
              <p className="text-xs text-white/30">
                Your wallet is non-custodial. Veritas never holds your private keys.
              </p>
            </div>
          </main>
        </div>
      </div>
    );
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
                <Globe className="text-yellow-400" size={28} />
                <h1 className="text-3xl font-black gold-text">Cross-Chain Wallet</h1>
              </div>
              <p className="text-white/50">Multi-chain payments, bridging, and escrow management</p>
            </div>
            <button
              onClick={() => setShowSend(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-black font-bold transition"
            >
              <ArrowRightLeft size={18} />
              Send / Receive
            </button>
          </div>

          {/* Wallet Address */}
          <div className="glass-card rounded-2xl p-4 flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-green-500/20 flex items-center justify-center">
                <CheckCircle2 size={18} className="text-green-400" />
              </div>
              <div>
                <div className="text-xs text-white/40 mb-0.5">Connected Wallet</div>
                <div className="font-mono text-sm">{walletAddress.slice(0, 20)}...{walletAddress.slice(-6)}</div>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={copyAddress} className="p-2 rounded-lg border border-white/10 hover:bg-white/5 transition">
                {copiedAddr ? <CheckCheck size={14} className="text-green-400" /> : <Copy size={14} className="text-white/50" />}
              </button>
              <button className="p-2 rounded-lg border border-white/10 hover:bg-white/5 transition">
                <ExternalLink size={14} className="text-white/50" />
              </button>
            </div>
          </div>

          {/* Portfolio Overview */}
          <div className="glass-card rounded-3xl p-6 mb-6">
            <div className="text-sm text-white/40 mb-1">Total Portfolio Value</div>
            <div className="text-4xl font-black gold-text mb-4">${totalUSD.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {TOKENS.map((t) => (
                <div key={t.symbol} className="p-3 rounded-xl bg-white/5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{t.icon}</span>
                    <span className="font-bold text-sm">{t.symbol}</span>
                    {t.change !== 0 && (
                      <span className={`text-xs ml-auto ${t.change > 0 ? "text-green-400" : "text-red-400"}`}>
                        {t.change > 0 ? "+" : ""}{t.change}%
                      </span>
                    )}
                  </div>
                  <div className="text-sm font-bold">{t.balance.toLocaleString()}</div>
                  <div className="text-xs text-white/40">${t.usd.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Chains */}
          <div className="mb-6">
            <h3 className="font-bold mb-3 flex items-center gap-2">
              <Zap size={16} className="text-yellow-400" />
              Connected Chains
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {CHAINS.map((chain) => (
                <button
                  key={chain.id}
                  onClick={() => setSelectedChain(chain)}
                  className={`glass-card rounded-2xl p-4 text-left transition border ${selectedChain.id === chain.id ? "border-yellow-500/40 bg-yellow-500/5" : "border-white/5 hover:border-white/20"}`}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl">{chain.icon}</span>
                    <span className={`text-sm font-bold ${chain.color}`}>{chain.name}</span>
                  </div>
                  <div className="font-bold">{chain.balance} {chain.symbol}</div>
                  <div className="text-xs text-white/40 mt-0.5">${chain.usd.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Transaction History */}
          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
              <span className="font-bold">Transaction History</span>
              <button className="text-xs text-yellow-400 hover:underline">View All</button>
            </div>
            <div className="divide-y divide-white/5">
              {TX_HISTORY.map((tx) => (
                <div key={tx.id} className="px-6 py-4 flex items-center justify-between hover:bg-white/3 transition">
                  <div className="flex items-center gap-4">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm ${
                      tx.type === "received" ? "bg-green-500/10" : tx.type === "sent" ? "bg-red-500/10" : "bg-purple-500/10"
                    }`}>
                      {tx.type === "received" ? "↓" : tx.type === "sent" ? "↑" : "⇄"}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{tx.from}</div>
                      <div className="text-xs text-white/40 flex items-center gap-2">
                        <span className="font-mono">{tx.id}</span>
                        <span>·</span>
                        <span>{tx.chain}</span>
                        <span>·</span>
                        <span>{tx.time}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold text-sm ${tx.type === "received" ? "text-green-400" : tx.type === "sent" ? "text-red-400" : "text-purple-400"}`}>
                      {tx.amount}
                    </div>
                    <div className="text-xs text-white/30 flex items-center gap-1 justify-end">
                      <CheckCircle2 size={10} className="text-green-400" />
                      {tx.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Send Modal */}
          {showSend && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="glass-card rounded-3xl p-6 w-full max-w-md">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-bold text-lg">Send Payment</h3>
                  <button onClick={() => setShowSend(false)} className="text-white/50 hover:text-white">
                    <ArrowRightLeft size={20} />
                  </button>
                </div>

                {sent ? (
                  <div className="text-center py-8">
                    <CheckCircle2 size={48} className="text-green-400 mx-auto mb-3" />
                    <div className="font-bold text-lg">Payment Sent!</div>
                    <div className="text-sm text-white/50 mt-1">Transaction submitted to {selectedChain.name}</div>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4 mb-5">
                      <div>
                        <label className="text-xs text-white/50 mb-2 block uppercase tracking-wide">Token</label>
                        <select value={sendToken} onChange={(e) => setSendToken(e.target.value)} className="veritas-input">
                          {TOKENS.map((t) => <option key={t.symbol}>{t.symbol}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-white/50 mb-2 block uppercase tracking-wide">Amount</label>
                        <input value={sendAmount} onChange={(e) => setSendAmount(e.target.value)} placeholder="0.00" type="number" className="veritas-input" />
                      </div>
                      <div>
                        <label className="text-xs text-white/50 mb-2 block uppercase tracking-wide">Recipient Address / ENS</label>
                        <input value={sendTo} onChange={(e) => setSendTo(e.target.value)} placeholder="0x... or name.eth" className="veritas-input font-mono" />
                      </div>
                      <div className="p-3 rounded-xl bg-white/5 text-xs text-white/40 flex items-start gap-2">
                        <AlertCircle size={12} className="mt-0.5 flex-shrink-0" />
                        Network fee: ~$0.03 on {selectedChain.name}. Transaction is irreversible once submitted.
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => setShowSend(false)} className="flex-1 py-3 rounded-xl border border-white/10 text-white/60 text-sm hover:text-white transition">Cancel</button>
                      <button
                        onClick={sendPayment}
                        disabled={!sendAmount || !sendTo || sending}
                        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-sm disabled:opacity-40 transition"
                      >
                        {sending ? <Loader2 size={16} className="animate-spin" /> : <ArrowRightLeft size={16} />}
                        {sending ? "Sending..." : "Send"}
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
