"use client";

import { useState } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import TopBar from "@/components/topbar/TopBar";
import {
  FileText,
  Sparkles,
  Download,
  PenLine,
  CheckCircle2,
  ChevronRight,
  Loader2,
  Copy,
  CheckCheck,
  AlertCircle,
  Shield,
  Clock,
  DollarSign,
  User,
} from "lucide-react";

const TEMPLATES = [
  {
    id: "web-dev",
    icon: "💻",
    label: "Web Development",
    desc: "Full-stack, frontend, or backend projects",
  },
  {
    id: "design",
    icon: "🎨",
    label: "UI/UX Design",
    desc: "Wireframes, prototypes, brand identity",
  },
  {
    id: "writing",
    icon: "✍️",
    label: "Content Writing",
    desc: "Blogs, copy, technical docs",
  },
  {
    id: "marketing",
    icon: "📈",
    label: "Digital Marketing",
    desc: "SEO, ads, social media campaigns",
  },
  {
    id: "video",
    icon: "🎬",
    label: "Video Production",
    desc: "Editing, animation, production",
  },
  {
    id: "consulting",
    icon: "🤝",
    label: "Consulting",
    desc: "Strategy, advisory, audits",
  },
  {
    id: "custom",
    icon: "⚡",
    label: "Custom",
    desc: "Describe your specific project type",
  },
];

interface ContractForm {
  template: string;
  clientName: string;
  workerName: string;
  projectTitle: string;
  description: string;
  totalAmount: string;
  currency: string;
  milestones: string;
  startDate: string;
  endDate: string;
  revisions: string;
  jurisdiction: string;
  extras: string;
}

export default function AIContractPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [form, setForm] = useState<ContractForm>({
    template: "",
    clientName: "",
    workerName: "",
    projectTitle: "",
    description: "",
    totalAmount: "",
    currency: "USD",
    milestones: "3",
    startDate: "",
    endDate: "",
    revisions: "2",
    jurisdiction: "Delaware, USA",
    extras: "",
  });
  const [loading, setLoading] = useState(false);
  const [contract, setContract] = useState("");
  const [copied, setCopied] = useState(false);
  const [clientSigned, setClientSigned] = useState(false);
  const [workerSigned, setWorkerSigned] = useState(false);

  function update(key: keyof ContractForm, val: string) {
    setForm((prev) => ({ ...prev, [key]: val }));
  }

  async function generateContract() {
    setLoading(true);
    setStep(3);

    const prompt = `Generate a comprehensive, legally-structured freelance service contract for the Veritas Trust Ledger platform with the following details:

Template Type: ${form.template}
Client Name: ${form.clientName}
Service Provider (Worker): ${form.workerName}
Project Title: ${form.projectTitle}
Project Description: ${form.description}
Total Project Value: ${form.totalAmount} ${form.currency}
Number of Milestones: ${form.milestones}
Project Start Date: ${form.startDate}
Project End Date: ${form.endDate}
Allowed Revisions: ${form.revisions}
Governing Jurisdiction: ${form.jurisdiction}
Additional Requirements: ${form.extras}

Create a complete, professional contract with these sections:
1. AGREEMENT OVERVIEW (parties, effective date, project summary)
2. SCOPE OF WORK (detailed deliverables based on description)
3. PAYMENT TERMS (milestone schedule with percentages, escrow requirements)
4. INTELLECTUAL PROPERTY RIGHTS
5. CONFIDENTIALITY & NON-DISCLOSURE
6. REVISION POLICY
7. TIMELINE & DEADLINES
8. DISPUTE RESOLUTION (mentioning Veritas platform arbitration)
9. TERMINATION CONDITIONS
10. WARRANTIES & REPRESENTATIONS
11. LIMITATION OF LIABILITY
12. BLOCKCHAIN VERIFICATION (noting this contract is recorded on Veritas Trust Ledger)
13. SIGNATURE BLOCK

Make it professional, legally sound, and specific to the project details provided. Use formal legal language but keep it clear and readable.`;

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await res.json();
      setContract(data.content?.[0]?.text || "Error generating contract.");
    } catch {
      setContract(
        "Failed to generate contract. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  }

  function copyContract() {
    navigator.clipboard.writeText(contract);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function downloadContract() {
    const blob = new Blob([contract], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${form.projectTitle.replace(/\s+/g, "_")}_Contract.txt`;
    a.click();
  }

  const bothSigned = clientSigned && workerSigned;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopBar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <FileText className="text-yellow-400" size={28} />
              <h1 className="text-3xl font-black gold-text">AI Contract Writer</h1>
            </div>
            <p className="text-white/50">
              Generate legally-structured contracts in seconds, powered by AI
            </p>
          </div>

          {/* Stepper */}
          <div className="flex items-center gap-4 mb-8">
            {["Select Template", "Project Details", "Generated Contract"].map(
              (label, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition ${
                      step === i + 1
                        ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                        : step > i + 1
                        ? "bg-green-500/10 text-green-400"
                        : "text-white/30"
                    }`}
                  >
                    {step > i + 1 ? (
                      <CheckCircle2 size={16} />
                    ) : (
                      <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-xs">
                        {i + 1}
                      </span>
                    )}
                    <span className="hidden sm:block">{label}</span>
                  </div>
                  {i < 2 && <ChevronRight size={16} className="text-white/20" />}
                </div>
              )
            )}
          </div>

          {/* STEP 1: Template */}
          {step === 1 && (
            <div className="max-w-4xl">
              <h2 className="text-xl font-bold mb-6">
                What type of contract do you need?
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {TEMPLATES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      update("template", t.id === "custom" ? "" : t.label);
                      setStep(2);
                    }}
                    className={`glass-card rounded-2xl p-5 text-left border transition hover:border-yellow-500/50 hover:bg-yellow-500/5 ${
                      form.template === t.label
                        ? "border-yellow-500/50 bg-yellow-500/5"
                        : "border-white/10"
                    }`}
                  >
                    <div className="text-3xl mb-3">{t.icon}</div>
                    <div className="font-bold mb-1">{t.label}</div>
                    <div className="text-sm text-white/50">{t.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: Form */}
          {step === 2 && (
            <div className="max-w-3xl">
              <div className="glass-card rounded-3xl p-8">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Sparkles size={20} className="text-yellow-400" />
                  Project Details
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-xs text-white/50 mb-2 block uppercase tracking-wide">
                      Contract Type
                    </label>
                    <input
                      value={form.template}
                      onChange={(e) => update("template", e.target.value)}
                      placeholder="e.g. Web Development"
                      className="veritas-input"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/50 mb-2 block uppercase tracking-wide">
                      Project Title
                    </label>
                    <input
                      value={form.projectTitle}
                      onChange={(e) => update("projectTitle", e.target.value)}
                      placeholder="e.g. E-commerce Platform Build"
                      className="veritas-input"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-white/50 mb-2 block uppercase tracking-wide flex items-center gap-1">
                      <User size={12} /> Client Name
                    </label>
                    <input
                      value={form.clientName}
                      onChange={(e) => update("clientName", e.target.value)}
                      placeholder="Full name or company"
                      className="veritas-input"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/50 mb-2 block uppercase tracking-wide flex items-center gap-1">
                      <User size={12} /> Service Provider
                    </label>
                    <input
                      value={form.workerName}
                      onChange={(e) => update("workerName", e.target.value)}
                      placeholder="Full name or company"
                      className="veritas-input"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-white/50 mb-2 block uppercase tracking-wide flex items-center gap-1">
                      <DollarSign size={12} /> Total Value
                    </label>
                    <div className="flex gap-2">
                      <input
                        value={form.totalAmount}
                        onChange={(e) => update("totalAmount", e.target.value)}
                        placeholder="5000"
                        type="number"
                        className="veritas-input flex-1"
                      />
                      <select
                        value={form.currency}
                        onChange={(e) => update("currency", e.target.value)}
                        className="veritas-input w-24"
                      >
                        <option>USD</option>
                        <option>EUR</option>
                        <option>GBP</option>
                        <option>USDC</option>
                        <option>ETH</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-white/50 mb-2 block uppercase tracking-wide">
                      # of Milestones
                    </label>
                    <select
                      value={form.milestones}
                      onChange={(e) => update("milestones", e.target.value)}
                      className="veritas-input"
                    >
                      {["1", "2", "3", "4", "5"].map((n) => (
                        <option key={n}>{n}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-white/50 mb-2 block uppercase tracking-wide flex items-center gap-1">
                      <Clock size={12} /> Start Date
                    </label>
                    <input
                      type="date"
                      value={form.startDate}
                      onChange={(e) => update("startDate", e.target.value)}
                      className="veritas-input"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/50 mb-2 block uppercase tracking-wide flex items-center gap-1">
                      <Clock size={12} /> End Date
                    </label>
                    <input
                      type="date"
                      value={form.endDate}
                      onChange={(e) => update("endDate", e.target.value)}
                      className="veritas-input"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-white/50 mb-2 block uppercase tracking-wide">
                      Revisions Allowed
                    </label>
                    <select
                      value={form.revisions}
                      onChange={(e) => update("revisions", e.target.value)}
                      className="veritas-input"
                    >
                      {["1", "2", "3", "5", "Unlimited"].map((n) => (
                        <option key={n}>{n}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-white/50 mb-2 block uppercase tracking-wide">
                      Jurisdiction
                    </label>
                    <input
                      value={form.jurisdiction}
                      onChange={(e) => update("jurisdiction", e.target.value)}
                      placeholder="e.g. Delaware, USA"
                      className="veritas-input"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs text-white/50 mb-2 block uppercase tracking-wide">
                      Project Description
                    </label>
                    <textarea
                      value={form.description}
                      onChange={(e) => update("description", e.target.value)}
                      placeholder="Describe the scope of work, deliverables, and any specific requirements..."
                      rows={4}
                      className="veritas-input resize-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs text-white/50 mb-2 block uppercase tracking-wide">
                      Additional Clauses (optional)
                    </label>
                    <textarea
                      value={form.extras}
                      onChange={(e) => update("extras", e.target.value)}
                      placeholder="Any special terms, non-compete clauses, exclusivity agreements, etc."
                      rows={3}
                      className="veritas-input resize-none"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-8">
                  <button
                    onClick={() => setStep(1)}
                    className="px-6 py-3 rounded-xl border border-white/10 text-white/60 hover:text-white hover:border-white/30 transition"
                  >
                    Back
                  </button>
                  <button
                    onClick={generateContract}
                    disabled={
                      !form.projectTitle ||
                      !form.clientName ||
                      !form.workerName ||
                      !form.totalAmount
                    }
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-black font-bold disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    <Sparkles size={18} />
                    Generate Contract with AI
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Generated Contract */}
          {step === 3 && (
            <div className="max-w-4xl">
              {loading ? (
                <div className="glass-card rounded-3xl p-16 flex flex-col items-center gap-6 text-center">
                  <div className="w-20 h-20 rounded-full bg-yellow-500/10 flex items-center justify-center">
                    <Loader2 size={36} className="text-yellow-400 animate-spin" />
                  </div>
                  <div>
                    <div className="text-xl font-bold mb-2">
                      Drafting Your Contract...
                    </div>
                    <div className="text-white/50 text-sm">
                      AI is analyzing your requirements and generating a legally-structured document
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {/* Contract Actions */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={20} className="text-green-400" />
                      <span className="font-bold">Contract Generated</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={copyContract}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 text-sm hover:bg-white/5 transition"
                      >
                        {copied ? (
                          <CheckCheck size={14} className="text-green-400" />
                        ) : (
                          <Copy size={14} />
                        )}
                        {copied ? "Copied!" : "Copy"}
                      </button>
                      <button
                        onClick={downloadContract}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 text-sm hover:bg-white/5 transition"
                      >
                        <Download size={14} />
                        Download
                      </button>
                      <button
                        onClick={() => {
                          setStep(2);
                          setContract("");
                          setClientSigned(false);
                          setWorkerSigned(false);
                        }}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 text-sm hover:bg-white/5 transition"
                      >
                        <PenLine size={14} />
                        Edit
                      </button>
                    </div>
                  </div>

                  {/* Contract Text */}
                  <div className="glass-card rounded-3xl p-8 mb-6 max-h-[600px] overflow-y-auto">
                    <pre className="text-sm text-white/80 whitespace-pre-wrap leading-relaxed font-mono">
                      {contract}
                    </pre>
                  </div>

                  {/* Dual Signature */}
                  <div className="glass-card rounded-3xl p-6">
                    <div className="flex items-center gap-2 mb-5">
                      <Shield size={18} className="text-yellow-400" />
                      <h3 className="font-bold">Dual-Signature Execution</h3>
                    </div>

                    {!bothSigned && (
                      <div className="flex items-start gap-2 p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20 mb-5 text-sm text-yellow-300">
                        <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                        Both parties must sign before the contract is blockchain-verified and escrow is activated.
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div
                        className={`p-5 rounded-2xl border transition ${
                          clientSigned
                            ? "border-green-500/40 bg-green-500/10"
                            : "border-white/10 bg-white/5"
                        }`}
                      >
                        <div className="text-sm text-white/50 mb-1">Client</div>
                        <div className="font-bold mb-4">
                          {form.clientName || "Client"}
                        </div>
                        {clientSigned ? (
                          <div className="flex items-center gap-2 text-green-400 text-sm">
                            <CheckCircle2 size={16} />
                            Signed & Verified
                          </div>
                        ) : (
                          <button
                            onClick={() => setClientSigned(true)}
                            className="w-full py-2.5 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-black text-sm font-bold transition"
                          >
                            Sign as Client
                          </button>
                        )}
                      </div>

                      <div
                        className={`p-5 rounded-2xl border transition ${
                          workerSigned
                            ? "border-green-500/40 bg-green-500/10"
                            : "border-white/10 bg-white/5"
                        }`}
                      >
                        <div className="text-sm text-white/50 mb-1">
                          Service Provider
                        </div>
                        <div className="font-bold mb-4">
                          {form.workerName || "Provider"}
                        </div>
                        {workerSigned ? (
                          <div className="flex items-center gap-2 text-green-400 text-sm">
                            <CheckCircle2 size={16} />
                            Signed & Verified
                          </div>
                        ) : (
                          <button
                            onClick={() => setWorkerSigned(true)}
                            className="w-full py-2.5 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-black text-sm font-bold transition"
                          >
                            Sign as Provider
                          </button>
                        )}
                      </div>
                    </div>

                    {bothSigned && (
                      <div className="mt-5 p-5 rounded-2xl bg-green-500/10 border border-green-500/30 text-center">
                        <CheckCircle2
                          size={32}
                          className="text-green-400 mx-auto mb-2"
                        />
                        <div className="font-bold text-green-400 text-lg">
                          Contract Executed!
                        </div>
                        <div className="text-sm text-white/60 mt-1">
                          This agreement has been blockchain-verified on the Veritas Trust Ledger. Escrow is now active.
                        </div>
                        <button className="mt-4 px-6 py-2.5 rounded-xl bg-green-500 hover:bg-green-400 text-black font-bold text-sm transition">
                          Activate Escrow →
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
