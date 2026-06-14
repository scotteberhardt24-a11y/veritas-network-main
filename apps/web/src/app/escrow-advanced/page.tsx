'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Button, LoadingSpinner, Card } from '@/components/ui';

interface Milestone {
  milestone_id: string;
  title: string;
  description: string;
  amount: number;
  percentage: number;
  status: 'pending' | 'in_progress' | 'submitted' | 'approved' | 'released' | 'disputed';
  deliverables: string[];
  deadline: string;
  submission_date?: string;
  approval_date?: string;
  release_date?: string;
  conditions: MilestoneCondition[];
  auto_release: boolean;
  auto_release_days: number;
  evidence_submitted?: string[];
}

interface MilestoneCondition {
  condition_id: string;
  type: 'deliverable' | 'deadline' | 'quality' | 'approval';
  description: string;
  verified: boolean;
  verified_by?: string;
  verified_at?: string;
}

interface SmartEscrow {
  escrow_id: string;
  job_title: string;
  client_name: string;
  worker_name: string;
  total_amount: number;
  currency: string;
  status: 'active' | 'completed' | 'disputed' | 'refunded';
  created_at: string;
  milestones: Milestone[];
  smart_contract_address?: string;
  blockchain_verified: boolean;
  auto_release_enabled: boolean;
  payment_method: 'stripe' | 'crypto' | 'bank';
  dispute_resolution?: {
    initiated_by: string;
    initiated_at: string;
    status: 'open' | 'resolved';
    resolution: string;
  };
}

export default function SmartEscrowPage() {
  const [escrows, setEscrows] = useState<SmartEscrow[]>([]);
  const [selectedEscrow, setSelectedEscrow] = useState<SmartEscrow | null>(null);
  const [loading, setLoading] = useState(true);
  const [submittingEvidence, setSubmittingEvidence] = useState(false);

  useEffect(() => {
    loadEscrows();
  }, []);

  async function loadEscrows() {
    try {
      const token = localStorage.getItem('veritas_token');
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/escrow/smart`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error('Failed to load escrows');

      const data = await res.json();
      setEscrows(data.data || []);
    } catch (error) {
      console.error('Failed to load escrows:', error);
    } finally {
      setLoading(false);
    }
  }

  async function submitMilestoneEvidence(
    escrowId: string,
    milestoneId: string,
    evidence: string[]
  ) {
    try {
      setSubmittingEvidence(true);
      const token = localStorage.getItem('veritas_token');

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/escrow/${escrowId}/milestones/${milestoneId}/submit`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ evidence }),
        }
      );

      if (res.ok) {
        loadEscrows();
        alert('Milestone evidence submitted successfully!');
      }
    } catch (error) {
      console.error('Failed to submit evidence:', error);
    } finally {
      setSubmittingEvidence(false);
    }
  }

  async function approveMilestone(escrowId: string, milestoneId: string) {
    try {
      const token = localStorage.getItem('veritas_token');

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/escrow/${escrowId}/milestones/${milestoneId}/approve`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.ok) {
        loadEscrows();
        alert('Milestone approved!');
      }
    } catch (error) {
      console.error('Failed to approve milestone:', error);
    }
  }

  async function releaseMilestonePayment(escrowId: string, milestoneId: string) {
    try {
      const token = localStorage.getItem('veritas_token');

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/escrow/${escrowId}/milestones/${milestoneId}/release`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.ok) {
        loadEscrows();
        alert('Payment released!');
      }
    } catch (error) {
      console.error('Failed to release payment:', error);
    }
  }

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading smart escrows..." />;
  }

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-gray-900 text-white p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-black mb-2">
              💼 Smart Escrow
            </h1>
            <p className="text-gray-400">
              Milestone-based payments with automated conditions
            </p>
          </div>

          {!selectedEscrow ? (
            // Escrow List
            <div className="space-y-4">
              {escrows.length === 0 ? (
                <Card variant="default" className="text-center py-12">
                  <p className="text-3xl mb-2">💼</p>
                  <p className="font-bold">No active escrows</p>
                </Card>
              ) : (
                escrows.map((escrow) => (
                  <Card
                    key={escrow.escrow_id}
                    variant="default"
                    className="cursor-pointer hover:border-blue-500/50 transition-all"
                    onClick={() => setSelectedEscrow(escrow)}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-bold text-lg">{escrow.job_title}</p>
                        <p className="text-sm text-gray-400">
                          {escrow.client_name} → {escrow.worker_name}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-2xl font-black text-cyan-400">
                          ${escrow.total_amount.toLocaleString()}
                        </p>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold inline-block mt-1 ${
                            escrow.status === 'active'
                              ? 'bg-blue-900/30 text-blue-400'
                              : escrow.status === 'completed'
                              ? 'bg-green-900/30 text-green-400'
                              : escrow.status === 'disputed'
                              ? 'bg-red-900/30 text-red-400'
                              : 'bg-gray-700 text-gray-300'
                          }`}
                        >
                          {escrow.status}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-3">
                      <div className="flex justify-between mb-1">
                        <span className="text-xs text-gray-400">Progress</span>
                        <span className="text-xs font-bold">
                          {Math.round(
                            (escrow.milestones.filter((m) => m.status === 'released').length /
                              escrow.milestones.length) *
                              100
                          )}
                          %
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-gray-700 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                          style={{
                            width: `${(escrow.milestones.filter((m) => m.status === 'released').length / escrow.milestones.length) * 100}%`,
                          }}
                        />
                      </div>
                    </div>

                    {escrow.blockchain_verified && (
                      <p className="text-xs text-green-400">
                        ✓ Blockchain verified
                      </p>
                    )}
                  </Card>
                ))
              )}
            </div>
          ) : (
            // Escrow Detail
            <div className="space-y-6">
              <Button
                variant="secondary"
                onClick={() => setSelectedEscrow(null)}
                className="mb-4"
              >
                ← Back
              </Button>

              {/* Overall Info */}
              <Card variant="elevated">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Total Amount</p>
                    <p className="text-2xl font-black text-cyan-400">
                      ${selectedEscrow.total_amount.toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400 mb-1">Status</p>
                    <p className="text-lg font-bold capitalize">
                      {selectedEscrow.status}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400 mb-1">Payment Method</p>
                    <p className="text-lg font-bold capitalize">
                      {selectedEscrow.payment_method}
                    </p>
                  </div>
                </div>

                {selectedEscrow.smart_contract_address && (
                  <div className="mt-4 p-3 rounded-lg bg-purple-900/20 border border-purple-700/30">
                    <p className="text-xs text-purple-400 mb-1">Smart Contract</p>
                    <p className="font-mono text-sm break-all text-purple-300">
                      {selectedEscrow.smart_contract_address}
                    </p>
                  </div>
                )}
              </Card>

              {/* Milestones */}
              <div>
                <h2 className="text-xl font-bold mb-4">📋 Milestones</h2>

                <div className="space-y-4">
                  {selectedEscrow.milestones.map((milestone, index) => (
                    <Card key={milestone.milestone_id} variant="default">
                      <div className="flex items-start gap-4 mb-4">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0 ${
                            milestone.status === 'released'
                              ? 'bg-green-600'
                              : milestone.status === 'approved'
                              ? 'bg-blue-600'
                              : milestone.status === 'submitted'
                              ? 'bg-yellow-600'
                              : 'bg-gray-700'
                          }`}
                        >
                          {index + 1}
                        </div>

                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-bold">{milestone.title}</p>
                              <p className="text-sm text-gray-400">
                                {milestone.description}
                              </p>
                            </div>

                            <div className="text-right">
                              <p className="font-bold text-cyan-400">
                                ${milestone.amount.toLocaleString()}
                              </p>
                              <p className="text-xs text-gray-400">
                                {milestone.percentage}% of total
                              </p>
                            </div>
                          </div>

                          {/* Deliverables */}
                          {milestone.deliverables.length > 0 && (
                            <div className="mb-3 p-2 rounded bg-gray-800/30">
                              <p className="text-xs text-gray-400 mb-2">
                                Deliverables:
                              </p>
                              <ul className="space-y-1">
                                {milestone.deliverables.map((d, i) => (
                                  <li key={i} className="text-xs text-gray-300">
                                    • {d}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Conditions */}
                          <div className="mb-3 space-y-1">
                            {milestone.conditions.map((cond) => (
                              <div
                                key={cond.condition_id}
                                className="flex items-center gap-2 text-xs"
                              >
                                <span
                                  className={cond.verified ? 'text-green-400' : 'text-gray-500'}
                                >
                                  {cond.verified ? '✓' : '○'}
                                </span>
                                <span className="text-gray-300">
                                  {cond.description}
                                </span>
                              </div>
                            ))}
                          </div>

                          {/* Actions */}
                          <div className="flex gap-2 flex-wrap">
                            {milestone.status === 'in_progress' && (
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() =>
                                  submitMilestoneEvidence(
                                    selectedEscrow.escrow_id,
                                    milestone.milestone_id,
                                    []
                                  )
                                }
                                loading={submittingEvidence}
                              >
                                📤 Submit Deliverables
                              </Button>
                            )}

                            {milestone.status === 'submitted' && (
                              <>
                                <Button
                                  variant="primary"
                                  size="sm"
                                  onClick={() =>
                                    approveMilestone(
                                      selectedEscrow.escrow_id,
                                      milestone.milestone_id
                                    )
                                  }
                                >
                                  ✓ Approve
                                </Button>
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  onClick={() =>
                                    alert('Request revision functionality')
                                  }
                                >
                                  📝 Request Revision
                                </Button>
                              </>
                            )}

                            {milestone.status === 'approved' && (
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() =>
                                  releaseMilestonePayment(
                                    selectedEscrow.escrow_id,
                                    milestone.milestone_id
                                  )
                                }
                              >
                                💰 Release Payment
                              </Button>
                            )}

                            {milestone.status === 'released' && (
                              <div className="text-xs text-green-400 py-2">
                                ✓ Payment released on {milestone.release_date}
                              </div>
                            )}
                          </div>

                          {/* Deadline */}
                          <div className="mt-2 text-xs text-gray-500">
                            Deadline: {milestone.deadline}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Disputes */}
              {selectedEscrow.dispute_resolution && (
                <Card
                  variant="default"
                  className="bg-red-900/20 border-red-700/30"
                >
                  <h3 className="font-bold text-red-300 mb-3">⚖️ Dispute</h3>
                  <p className="text-sm text-red-200 mb-2">
                    Initiated by: {selectedEscrow.dispute_resolution.initiated_by}
                  </p>
                  <p className="text-sm text-red-200">
                    Status: {selectedEscrow.dispute_resolution.status}
                  </p>
                </Card>
              )}
            </div>
          )}
        </div>
      </main>
    </ProtectedRoute>
  );
}
