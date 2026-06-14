'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Button, LoadingSpinner, Card } from '@/components/ui';

interface Proposal {
  proposal_id: string;
  title: string;
  description: string;
  proposer_name: string;
  category: 'platform' | 'fee' | 'feature' | 'governance';
  status: 'active' | 'voting' | 'passed' | 'rejected' | 'executed';
  votes_for: number;
  votes_against: number;
  votes_abstain: number;
  voting_power_required: number;
  created_at: string;
  voting_end_at: string;
  execution_date?: string;
  impact: {
    fee_changes?: string;
    feature_changes?: string;
    governance_changes?: string;
  };
}

interface DAOStats {
  total_members: number;
  total_voting_power: number;
  treasury_balance: number;
  proposals_executed: number;
  avg_participation: number;
}

export default function DAOGovernancePage() {
  const [stats, setStats] = useState<DAOStats | null>(null);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [userVotes, setUserVotes] = useState<Record<string, 'for' | 'against' | 'abstain'>>({});
  const [loading, setLoading] = useState(true);
  const [userVotingPower, setUserVotingPower] = useState(0);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const token = localStorage.getItem('veritas_token');

      const [statsRes, proposalsRes, votesRes, powerRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dao/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dao/proposals`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dao/my-votes`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dao/voting-power`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (statsRes.ok) {
        const data = await statsRes.json();
        setStats(data.data);
      }

      if (proposalsRes.ok) {
        const data = await proposalsRes.json();
        setProposals(data.data || []);
      }

      if (votesRes.ok) {
        const data = await votesRes.json();
        setUserVotes(data.data || {});
      }

      if (powerRes.ok) {
        const data = await powerRes.json();
        setUserVotingPower(data.voting_power || 0);
      }
    } catch (error) {
      console.error('Failed to load DAO data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleVote(proposalId: string, vote: 'for' | 'against' | 'abstain') {
    try {
      const token = localStorage.getItem('veritas_token');

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/dao/proposals/${proposalId}/vote`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ vote, voting_power: userVotingPower }),
        }
      );

      if (res.ok) {
        loadData();
      }
    } catch (error) {
      console.error('Failed to vote:', error);
    }
  }

  async function executeProposal(proposalId: string) {
    try {
      const token = localStorage.getItem('veritas_token');

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/dao/proposals/${proposalId}/execute`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.ok) {
        loadData();
      }
    } catch (error) {
      console.error('Failed to execute proposal:', error);
    }
  }

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading DAO governance..." />;
  }

  const calculatePercentage = (votes: number, total: number) => {
    return total === 0 ? 0 : Math.round((votes / total) * 100);
  };

  const activeProposals = proposals.filter((p) => p.status === 'active' || p.status === 'voting');

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-gray-900 text-white p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-black mb-2">
              🏛️ DAO Governance
            </h1>
            <p className="text-gray-400">
              Decentralized platform governance and community decisions
            </p>
          </div>

          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
              <Card variant="default">
                <p className="text-xs text-gray-400 mb-1">Members</p>
                <p className="text-2xl font-black">{stats.total_members}</p>
              </Card>

              <Card variant="default">
                <p className="text-xs text-gray-400 mb-1">Treasury</p>
                <p className="text-2xl font-black text-cyan-400">
                  ${stats.treasury_balance.toLocaleString()}
                </p>
              </Card>

              <Card variant="default">
                <p className="text-xs text-gray-400 mb-1">Your Voting Power</p>
                <p className="text-2xl font-black text-green-400">
                  {userVotingPower.toFixed(1)}
                </p>
              </Card>

              <Card variant="default">
                <p className="text-xs text-gray-400 mb-1">Proposals Passed</p>
                <p className="text-2xl font-black">{stats.proposals_executed}</p>
              </Card>

              <Card variant="default">
                <p className="text-xs text-gray-400 mb-1">Participation</p>
                <p className="text-2xl font-black">{stats.avg_participation}%</p>
              </Card>
            </div>
          )}

          {/* Active Proposals */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">⚡ Active Proposals</h2>

            {activeProposals.length === 0 ? (
              <Card variant="default" className="text-center py-8">
                <p className="text-gray-400">No active proposals</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {activeProposals.map((proposal) => {
                  const totalVotes = proposal.votes_for + proposal.votes_against + proposal.votes_abstain;
                  const userVote = userVotes[proposal.proposal_id];

                  return (
                    <Card
                      key={proposal.proposal_id}
                      variant="default"
                      className="border-blue-700/30"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-bold mb-1">
                            {proposal.title}
                          </h3>
                          <p className="text-sm text-gray-400">
                            By {proposal.proposer_name} • {proposal.category}
                          </p>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-blue-900/30 text-blue-400 text-xs font-bold">
                          {proposal.status}
                        </span>
                      </div>

                      <p className="text-sm text-gray-300 mb-4">
                        {proposal.description}
                      </p>

                      {/* Voting Bars */}
                      <div className="mb-4">
                        <div className="mb-2">
                          <div className="flex justify-between mb-1">
                            <span className="text-xs font-bold text-green-400">
                              For
                            </span>
                            <span className="text-xs">
                              {proposal.votes_for} ({calculatePercentage(proposal.votes_for, totalVotes)}%)
                            </span>
                          </div>
                          <div className="h-2 rounded-full bg-gray-700 overflow-hidden">
                            <div
                              className="h-full bg-green-500"
                              style={{
                                width: `${calculatePercentage(proposal.votes_for, totalVotes)}%`,
                              }}
                            />
                          </div>
                        </div>

                        <div className="mb-2">
                          <div className="flex justify-between mb-1">
                            <span className="text-xs font-bold text-red-400">
                              Against
                            </span>
                            <span className="text-xs">
                              {proposal.votes_against} ({calculatePercentage(proposal.votes_against, totalVotes)}%)
                            </span>
                          </div>
                          <div className="h-2 rounded-full bg-gray-700 overflow-hidden">
                            <div
                              className="h-full bg-red-500"
                              style={{
                                width: `${calculatePercentage(proposal.votes_against, totalVotes)}%`,
                              }}
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-xs font-bold text-gray-400">
                              Abstain
                            </span>
                            <span className="text-xs">
                              {proposal.votes_abstain} ({calculatePercentage(proposal.votes_abstain, totalVotes)}%)
                            </span>
                          </div>
                          <div className="h-2 rounded-full bg-gray-700 overflow-hidden">
                            <div
                              className="h-full bg-gray-500"
                              style={{
                                width: `${calculatePercentage(proposal.votes_abstain, totalVotes)}%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Voting Controls */}
                      {!userVote && proposal.status !== 'passed' && (
                        <div className="flex gap-2">
                          <Button
                            variant="primary"
                            size="sm"
                            fullWidth
                            onClick={() => handleVote(proposal.proposal_id, 'for')}
                          >
                            ✓ Vote For
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            fullWidth
                            onClick={() => handleVote(proposal.proposal_id, 'against')}
                          >
                            ✕ Vote Against
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            fullWidth
                            onClick={() => handleVote(proposal.proposal_id, 'abstain')}
                          >
                            ⊝ Abstain
                          </Button>
                        </div>
                      )}

                      {userVote && (
                        <div className="p-3 rounded-lg bg-blue-900/20 border border-blue-700/30">
                          <p className="text-xs text-blue-400">
                            Your vote: <span className="font-bold">{userVote}</span>
                          </p>
                        </div>
                      )}

                      {proposal.status === 'passed' && !proposal.execution_date && (
                        <Button
                          variant="primary"
                          fullWidth
                          onClick={() => executeProposal(proposal.proposal_id)}
                        >
                          ⚙️ Execute Proposal
                        </Button>
                      )}
                    </Card>
                  );
                })}
              </div>
            )}
          </div>

          {/* All Proposals */}
          <div>
            <h2 className="text-xl font-bold mb-4">📜 All Proposals</h2>

            <div className="space-y-3">
              {proposals.map((proposal) => (
                <Card
                  key={proposal.proposal_id}
                  variant="default"
                  className="cursor-pointer hover:border-blue-500/50 transition-all"
                  onClick={() => setSelectedProposal(proposal)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold">{proposal.title}</p>
                      <p className="text-sm text-gray-400">
                        {proposal.proposer_name}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded text-xs font-bold ${
                        proposal.status === 'passed'
                          ? 'bg-green-900/30 text-green-400'
                          : proposal.status === 'rejected'
                          ? 'bg-red-900/30 text-red-400'
                          : 'bg-gray-700 text-gray-300'
                      }`}
                    >
                      {proposal.status}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}
