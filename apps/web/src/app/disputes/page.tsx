'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Button, LoadingSpinner, Card, ErrorBanner } from '@/components/ui';

interface Dispute {
  dispute_id: string;
  escrow_id: string;
  initiator_id: string;
  initiator_name: string;
  respondent_id: string;
  respondent_name: string;
  reason: string;
  description: string;
  amount_in_dispute: number;
  status: 'open' | 'under_review' | 'voting' | 'resolved' | 'appealed';
  created_at: string;
  evidence: DisputeEvidence[];
  ai_analysis?: AIAnalysis;
  votes?: VoteRecord[];
  resolution?: DisputeResolution;
}

interface DisputeEvidence {
  evidence_id: string;
  submitted_by: string;
  type: 'document' | 'screenshot' | 'message' | 'contract';
  title: string;
  description: string;
  url: string;
  created_at: string;
}

interface AIAnalysis {
  recommendation: 'initiator_win' | 'respondent_win' | 'split';
  confidence_score: number;
  analysis: string;
  key_findings: string[];
  bias_assessment: string;
}

interface VoteRecord {
  voter_id: string;
  voter_name: string;
  vote: 'initiator' | 'respondent' | 'abstain';
  reasoning: string;
  created_at: string;
}

interface DisputeResolution {
  initiator_amount: number;
  respondent_amount: number;
  winner: 'initiator' | 'respondent' | 'split';
  resolved_at: string;
  resolver_notes: string;
}

export default function DisputesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [filter, setFilter] = useState<'all' | 'open' | 'resolved'>('all');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDisputes();
  }, [filter]);

  async function loadDisputes() {
    try {
      setLoading(true);
      const token = localStorage.getItem('veritas_token');

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/disputes?status=${filter === 'all' ? '' : filter}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error('Failed to load disputes');

      const data = await res.json();
      setDisputes(data.data || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load disputes');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading disputes..." />;
  }

  const filteredDisputes = disputes.filter((d) => {
    if (filter === 'all') return true;
    if (filter === 'open') return ['open', 'under_review', 'voting'].includes(d.status);
    if (filter === 'resolved') return ['resolved'].includes(d.status);
    return true;
  });

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-gray-900 text-white p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Button
              variant="secondary"
              onClick={() => router.back()}
              className="mb-4"
            >
              ← Back
            </Button>
            <h1 className="text-3xl sm:text-4xl font-black mb-2">
              ⚖️ Disputes & Resolution
            </h1>
            <p className="text-gray-400">
              AI-powered arbitration with transparent voting
            </p>
          </div>

          {error && (
            <ErrorBanner
              message={error}
              onDismiss={() => setError(null)}
            />
          )}

          {/* Filters */}
          <div className="flex gap-3 mb-8 flex-wrap">
            {(['all', 'open', 'resolved'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg font-bold transition-all ${
                  filter === f
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {f === 'all' ? 'All Disputes' : f === 'open' ? 'Open' : 'Resolved'}
              </button>
            ))}
          </div>

          {selectedDispute ? (
            // Dispute Detail View
            <DisputeDetailView
              dispute={selectedDispute}
              onBack={() => setSelectedDispute(null)}
              onRefresh={loadDisputes}
            />
          ) : (
            // Disputes List
            <div className="space-y-4">
              {filteredDisputes.length === 0 ? (
                <Card variant="default" className="text-center py-12">
                  <p className="text-3xl mb-2">✓</p>
                  <p className="text-xl font-bold">No disputes</p>
                  <p className="text-gray-400 mt-1">
                    {filter === 'open'
                      ? 'No active disputes'
                      : 'All resolved peacefully'}
                  </p>
                </Card>
              ) : (
                filteredDisputes.map((dispute) => (
                  <Card key={dispute.dispute_id} variant="default" hover>
                    <button
                      onClick={() => setSelectedDispute(dispute)}
                      className="w-full text-left"
                    >
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex-1">
                          <h3 className="font-bold text-lg mb-1">
                            {dispute.initiator_name} vs {dispute.respondent_name}
                          </h3>
                          <p className="text-sm text-gray-400 line-clamp-2">
                            {dispute.reason}
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="text-2xl font-black text-cyan-400 mb-2">
                            ${dispute.amount_in_dispute.toLocaleString()}
                          </div>
                          <StatusBadge status={dispute.status} />
                        </div>
                      </div>

                      {dispute.ai_analysis && (
                        <div className="mt-4 pt-4 border-t border-gray-800">
                          <p className="text-xs text-gray-500 mb-2">AI Recommendation</p>
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-bold text-cyan-300">
                              {dispute.ai_analysis.recommendation === 'split'
                                ? '50/50 Split'
                                : dispute.ai_analysis.recommendation === 'initiator_win'
                                ? 'Favor Initiator'
                                : 'Favor Respondent'}
                            </p>
                            <p className="text-xs text-gray-400">
                              {Math.round(dispute.ai_analysis.confidence_score * 100)}%
                              confidence
                            </p>
                          </div>
                        </div>
                      )}
                    </button>
                  </Card>
                ))
              )}
            </div>
          )}
        </div>
      </main>
    </ProtectedRoute>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors = {
    open: 'bg-yellow-900/30 text-yellow-400',
    under_review: 'bg-blue-900/30 text-blue-400',
    voting: 'bg-purple-900/30 text-purple-400',
    resolved: 'bg-green-900/30 text-green-400',
    appealed: 'bg-red-900/30 text-red-400',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold ${colors[status as keyof typeof colors]}`}>
      {status.replace('_', ' ').toUpperCase()}
    </span>
  );
}

function DisputeDetailView({
  dispute,
  onBack,
  onRefresh,
}: {
  dispute: Dispute;
  onBack: () => void;
  onRefresh: () => void;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [newEvidence, setNewEvidence] = useState('');

  async function handleAddEvidence() {
    if (!newEvidence.trim()) return;

    try {
      setSubmitting(true);
      const token = localStorage.getItem('veritas_token');

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/disputes/${dispute.dispute_id}/evidence`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            description: newEvidence,
            type: 'document',
          }),
        }
      );

      if (!res.ok) throw new Error('Failed to add evidence');

      setNewEvidence('');
      onRefresh();
    } catch (error) {
      alert('Failed to add evidence');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <Button variant="secondary" onClick={onBack}>
        ← Back to Disputes
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Dispute Info */}
          <Card variant="elevated">
            <h2 className="text-2xl font-bold mb-4">Dispute Details</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center pb-3 border-b border-gray-700">
                <span className="text-gray-400">Reason</span>
                <span className="font-bold">{dispute.reason}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-700">
                <span className="text-gray-400">Amount</span>
                <span className="font-bold text-cyan-400">
                  ${dispute.amount_in_dispute.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Status</span>
                <StatusBadge status={dispute.status} />
              </div>
            </div>

            <p className="text-gray-300 mb-4">{dispute.description}</p>
          </Card>

          {/* AI Analysis */}
          {dispute.ai_analysis && (
            <Card
              variant="default"
              className="bg-cyan-900/20 border-cyan-700/30"
            >
              <h3 className="font-bold text-lg text-cyan-300 mb-4">
                🤖 AI Analysis
              </h3>

              <div className="space-y-3">
                <div>
                  <p className="text-xs text-cyan-400 mb-1">Recommendation</p>
                  <p className="font-bold">
                    {dispute.ai_analysis.recommendation === 'split'
                      ? 'Recommend 50/50 Split'
                      : dispute.ai_analysis.recommendation === 'initiator_win'
                      ? 'Favor Initiator'
                      : 'Favor Respondent'}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-cyan-400 mb-1">Confidence</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 rounded-full bg-cyan-900/30 overflow-hidden">
                      <div
                        className="h-full bg-cyan-500"
                        style={{
                          width: `${dispute.ai_analysis.confidence_score * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm font-bold">
                      {Math.round(dispute.ai_analysis.confidence_score * 100)}%
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-cyan-400 mb-1">Key Findings</p>
                  <ul className="space-y-1">
                    {dispute.ai_analysis.key_findings.map((finding, i) => (
                      <li key={i} className="text-sm text-gray-300">
                        • {finding}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          )}

          {/* Evidence */}
          <Card variant="default">
            <h3 className="font-bold text-lg mb-4">📋 Evidence</h3>

            {dispute.evidence.length === 0 ? (
              <p className="text-gray-400 text-center py-6">No evidence submitted yet</p>
            ) : (
              <div className="space-y-3 mb-6">
                {dispute.evidence.map((ev) => (
                  <div key={ev.evidence_id} className="p-3 rounded-lg bg-gray-800/30 border border-gray-700">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-bold">{ev.title}</p>
                      <span className="text-xs bg-gray-700 px-2 py-1 rounded">
                        {ev.type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400">{ev.description}</p>
                    <a
                      href={ev.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 text-xs mt-2 hover:text-blue-300"
                    >
                      View →
                    </a>
                  </div>
                ))}
              </div>
            )}

            {dispute.status === 'open' || dispute.status === 'under_review' ? (
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">
                  Add Evidence
                </label>
                <textarea
                  value={newEvidence}
                  onChange={(e) => setNewEvidence(e.target.value)}
                  placeholder="Describe your evidence..."
                  className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none h-24 mb-3"
                />
                <Button
                  variant="primary"
                  fullWidth
                  loading={submitting}
                  onClick={handleAddEvidence}
                >
                  Submit Evidence
                </Button>
              </div>
            ) : null}
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Participants */}
          <Card variant="default">
            <h3 className="font-bold mb-4">Participants</h3>

            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-blue-900/20 border border-blue-700/30">
                <p className="text-xs text-blue-400 mb-1">Initiator</p>
                <p className="font-bold">{dispute.initiator_name}</p>
              </div>

              <div className="p-3 rounded-lg bg-red-900/20 border border-red-700/30">
                <p className="text-xs text-red-400 mb-1">Respondent</p>
                <p className="font-bold">{dispute.respondent_name}</p>
              </div>
            </div>
          </Card>

          {/* Voting */}
          {dispute.votes && dispute.votes.length > 0 && (
            <Card variant="default">
              <h3 className="font-bold mb-4">⚖️ Votes</h3>

              <div className="space-y-2">
                {dispute.votes.map((vote) => (
                  <div key={vote.voter_id} className="text-sm">
                    <p className="font-bold">{vote.voter_name}</p>
                    <p className="text-gray-400">{vote.vote}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Resolution */}
          {dispute.resolution && (
            <Card
              variant="default"
              className="bg-green-900/20 border-green-700/30"
            >
              <h3 className="font-bold text-green-300 mb-4">✓ Resolved</h3>

              <div className="space-y-2 text-sm">
                <div>
                  <p className="text-gray-400">Initiator receives</p>
                  <p className="font-bold text-green-300">
                    ${dispute.resolution.initiator_amount.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">Respondent receives</p>
                  <p className="font-bold text-green-300">
                    ${dispute.resolution.respondent_amount.toLocaleString()}
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
