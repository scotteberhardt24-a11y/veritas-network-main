'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Button, LoadingSpinner, ErrorBanner, EmptyState, Card } from '@/components/ui';

interface Escrow {
  escrow_id: string;
  job_id: string;
  job_title: string;
  client_name: string;
  worker_name: string;
  amount: number;
  status: 'pending' | 'locked' | 'in_progress' | 'released' | 'disputed';
  milestones: Milestone[];
  blockchain_tx: string | null;
  created_at: string;
  deadline: string;
  smart_contract_address: string | null;
}

interface Milestone {
  milestone_id: string;
  title: string;
  description: string;
  amount: number;
  status: 'pending' | 'in_progress' | 'completed' | 'approved';
  deadline: string;
  completion_evidence?: string;
}

type FilterStatus = 'all' | 'pending' | 'active' | 'completed' | 'disputed';

export default function EscrowPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [escrows, setEscrows] = useState<Escrow[]>([]);
  const [filteredEscrows, setFilteredEscrows] = useState<Escrow[]>([]);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [selectedEscrow, setSelectedEscrow] = useState<Escrow | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    loadEscrows();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [escrows, filterStatus]);

  async function loadEscrows() {
    try {
      setLoading(true);
      const token = localStorage.getItem('veritas_token');

      if (!token) {
        router.push('/auth');
        return;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/escrow`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error('Failed to load escrows');

      const data = await res.json();
      setEscrows(data.data || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load escrows');
    } finally {
      setLoading(false);
    }
  }

  function applyFilters() {
    let filtered = escrows;

    if (filterStatus !== 'all') {
      filtered = filtered.filter((e) => {
        if (filterStatus === 'active') {
          return ['locked', 'in_progress'].includes(e.status);
        }
        if (filterStatus === 'completed') {
          return e.status === 'released';
        }
        return e.status === filterStatus;
      });
    }

    setFilteredEscrows(filtered);
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-900/30 text-yellow-400';
      case 'locked':
        return 'bg-blue-900/30 text-blue-400';
      case 'in_progress':
        return 'bg-cyan-900/30 text-cyan-400';
      case 'released':
        return 'bg-green-900/30 text-green-400';
      case 'disputed':
        return 'bg-red-900/30 text-red-400';
      default:
        return 'bg-gray-700 text-gray-300';
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading escrow accounts..." />;
  }

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-gray-900 text-white">
        {error && !showDetail && <ErrorBanner message={error} />}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-black mb-2">
              💰 Escrow Management
            </h1>
            <p className="text-gray-400">
              Secure, blockchain-verified fund management for all your projects
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              label="Total Locked"
              value={`$${escrows.reduce((sum, e) => (e.status === 'locked' || e.status === 'in_progress' ? sum + e.amount : sum), 0).toLocaleString()}`}
              icon="🔒"
            />
            <StatCard
              label="Active Projects"
              value={escrows.filter((e) => ['locked', 'in_progress'].includes(e.status)).length.toString()}
              icon="⚡"
            />
            <StatCard
              label="Completed"
              value={escrows.filter((e) => e.status === 'released').length.toString()}
              icon="✓"
            />
            <StatCard
              label="Blockchain Verified"
              value={escrows.filter((e) => e.blockchain_tx).length.toString()}
              icon="⛓️"
            />
          </div>

          {/* Filters */}
          <div className="mb-6 flex flex-wrap gap-2">
            {(['all', 'pending', 'active', 'completed', 'disputed'] as FilterStatus[]).map(
              (status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2 rounded-lg font-bold transition-all ${
                    filterStatus === status
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {status === 'all'
                    ? 'All'
                    : status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              )
            )}
          </div>

          {/* Escrows List */}
          {filteredEscrows.length === 0 ? (
            <EmptyState
              icon="💼"
              title="No escrows yet"
              description="Complete a job to create an escrow account"
              actionLabel="Browse Jobs"
              onAction={() => router.push('/jobs')}
            />
          ) : (
            <div className="space-y-4">
              {filteredEscrows.map((escrow) => (
                <Card key={escrow.escrow_id} variant="default" hover>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-2">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold mb-1">{escrow.job_title}</h3>
                      <p className="text-sm text-gray-400 mb-3">
                        {escrow.client_name} → {escrow.worker_name}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(
                            escrow.status
                          )}`}
                        >
                          {escrow.status.replace('_', ' ').toUpperCase()}
                        </span>
                        {escrow.blockchain_tx && (
                          <span className="px-3 py-1 rounded-full bg-purple-900/30 text-purple-400 text-xs font-bold">
                            ⛓️ Blockchain Verified
                          </span>
                        )}
                      </div>

                      {/* Milestones Progress */}
                      {escrow.milestones.length > 0 && (
                        <div className="mt-3">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs text-gray-400">
                              Milestones:{' '}
                              {escrow.milestones.filter((m) => m.status === 'approved')
                                .length}/{escrow.milestones.length}
                            </span>
                          </div>
                          <div className="h-2 rounded-full bg-gray-700 overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all"
                              style={{
                                width: `${
                                  (escrow.milestones.filter((m) => m.status === 'approved')
                                    .length / escrow.milestones.length) *
                                  100
                                }%`,
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="w-full sm:w-auto text-right">
                      <p className="text-2xl font-black text-cyan-400 mb-3">
                        ${escrow.amount.toLocaleString()}
                      </p>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => {
                          setSelectedEscrow(escrow);
                          setShowDetail(true);
                        }}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Detail Modal */}
        {showDetail && selectedEscrow && (
          <EscrowDetailModal
            escrow={selectedEscrow}
            onClose={() => {
              setShowDetail(false);
              setSelectedEscrow(null);
            }}
            onRefresh={loadEscrows}
          />
        )}
      </main>
    </ProtectedRoute>
  );
}

// Stat Card Component
function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: string;
}) {
  return (
    <Card variant="default">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-400 mb-1">{label}</p>
          <p className="text-2xl font-black">{value}</p>
        </div>
        <p className="text-3xl">{icon}</p>
      </div>
    </Card>
  );
}

// Detail Modal
function EscrowDetailModal({
  escrow,
  onClose,
  onRefresh,
}: {
  escrow: Escrow;
  onClose: () => void;
  onRefresh: () => void;
}) {
  const [releasing, setReleasing] = useState(false);
  const [disputing, setDisputing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRelease() {
    if (!confirm('Release funds to worker?')) return;

    try {
      setReleasing(true);
      const token = localStorage.getItem('veritas_token');

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/escrow/${escrow.escrow_id}/release`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error('Failed to release funds');

      onRefresh();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to release funds');
    } finally {
      setReleasing(false);
    }
  }

  async function handleDispute() {
    if (!confirm('Open a dispute for this escrow?')) return;

    try {
      setDisputing(true);
      const token = localStorage.getItem('veritas_token');

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/escrow/${escrow.escrow_id}/dispute`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error('Failed to open dispute');

      onRefresh();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to open dispute');
    } finally {
      setDisputing(false);
    }
  }

  const getMilestoneStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-gray-700 text-gray-300';
      case 'in_progress':
        return 'bg-blue-900/30 text-blue-400';
      case 'completed':
        return 'bg-yellow-900/30 text-yellow-400';
      case 'approved':
        return 'bg-green-900/30 text-green-400';
      default:
        return 'bg-gray-700 text-gray-300';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card variant="elevated" className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{escrow.job_title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ✕
          </button>
        </div>

        {error && <ErrorBanner message={error} variant="card" />}

        {/* Info */}
        <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-gray-700">
          <div>
            <p className="text-xs text-gray-500 mb-1">Total Amount</p>
            <p className="text-2xl font-black text-cyan-400">
              ${escrow.amount.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Status</p>
            <p className="text-lg font-bold capitalize">{escrow.status.replace('_', ' ')}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Client</p>
            <p className="font-bold">{escrow.client_name}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Worker</p>
            <p className="font-bold">{escrow.worker_name}</p>
          </div>
        </div>

        {/* Blockchain */}
        {escrow.blockchain_tx && (
          <Card variant="default" className="mb-6 bg-purple-900/20 border-purple-700/30">
            <p className="text-xs text-purple-400 mb-1">Blockchain Transaction</p>
            <p className="font-mono text-sm text-purple-300 break-all">
              {escrow.blockchain_tx.slice(0, 10)}...
              {escrow.blockchain_tx.slice(-10)}
            </p>
          </Card>
        )}

        {/* Milestones */}
        {escrow.milestones.length > 0 && (
          <div className="mb-6">
            <h3 className="font-bold text-lg mb-3">Milestones</h3>
            <div className="space-y-3">
              {escrow.milestones.map((milestone, i) => (
                <div
                  key={milestone.milestone_id}
                  className="p-4 rounded-lg bg-gray-800/30 border border-gray-700"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-bold">
                        {i + 1}. {milestone.title}
                      </p>
                      <p className="text-sm text-gray-400 mt-1">
                        {milestone.description}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${getMilestoneStatusColor(milestone.status)}`}>
                      {milestone.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-cyan-400 font-bold">
                    ${milestone.amount.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          {escrow.status === 'in_progress' && (
            <>
              <Button
                variant="primary"
                fullWidth
                loading={releasing}
                onClick={handleRelease}
              >
                Release Funds
              </Button>
              <Button
                variant="danger"
                fullWidth
                loading={disputing}
                onClick={handleDispute}
              >
                Open Dispute
              </Button>
            </>
          )}
          <Button
            variant="secondary"
            fullWidth
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </Card>
    </div>
  );
}
