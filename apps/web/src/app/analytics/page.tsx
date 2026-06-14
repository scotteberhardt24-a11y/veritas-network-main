'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Button, LoadingSpinner, Card } from '@/components/ui';

interface AnalyticsData {
  period: {
    start_date: string;
    end_date: string;
  };
  summary: {
    total_jobs: number;
    total_earnings: number;
    avg_rating: number;
    response_rate: number;
  };
  performance: {
    jobs_completed: number;
    jobs_ongoing: number;
    jobs_cancelled: number;
    completion_rate: number;
    avg_completion_time: number;
  };
  earnings: {
    total: number;
    from_jobs: number;
    from_referrals: number;
    pending: number;
    withdrawn: number;
  };
  trends: {
    date: string;
    jobs: number;
    earnings: number;
  }[];
  top_skills: Array<{
    skill: string;
    jobs_completed: number;
    avg_earnings: number;
  }>;
  client_breakdown: Array<{
    name: string;
    jobs: number;
    total_spent: number;
    rating: number;
  }>;
}

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [period, setPeriod] = useState<'week' | 'month' | 'quarter' | 'year'>('month');

  useEffect(() => {
    loadAnalytics();
  }, [period]);

  async function loadAnalytics() {
    try {
      setLoading(true);
      const token = localStorage.getItem('veritas_token');
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/analytics?period=${period}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error('Failed to load analytics');

      const response = await res.json();
      setData(response.data);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading analytics..." />;
  }

  if (!data) {
    return (
      <ProtectedRoute>
        <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-gray-900 text-white p-4">
          <Card variant="default">Error loading analytics</Card>
        </main>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-gray-900 text-white p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black mb-2">
                📊 Analytics
              </h1>
              <p className="text-gray-400">
                Track your performance and earnings
              </p>
            </div>

            <div className="flex gap-2 flex-wrap">
              {(['week', 'month', 'quarter', 'year'] as const).map((p) => (
                <Button
                  key={p}
                  variant={period === p ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setPeriod(p)}
                >
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <SummaryCard
              label="Total Jobs"
              value={data.summary.total_jobs.toString()}
              icon="💼"
              trend="+12%"
            />
            <SummaryCard
              label="Total Earnings"
              value={`$${data.summary.total_earnings.toLocaleString()}`}
              icon="💰"
              trend="+23%"
              highlight
            />
            <SummaryCard
              label="Avg Rating"
              value={`${data.summary.avg_rating.toFixed(1)}⭐`}
              icon="⭐"
              trend="+0.3"
            />
            <SummaryCard
              label="Response Rate"
              value={`${data.summary.response_rate}%`}
              icon="⚡"
              trend="+5%"
            />
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Performance */}
            <Card variant="default">
              <h3 className="text-lg font-bold mb-4">📈 Performance</h3>
              <div className="space-y-3">
                <MetricRow
                  label="Completed"
                  value={data.performance.jobs_completed.toString()}
                  color="bg-green-600"
                />
                <MetricRow
                  label="Ongoing"
                  value={data.performance.jobs_ongoing.toString()}
                  color="bg-blue-600"
                />
                <MetricRow
                  label="Cancelled"
                  value={data.performance.jobs_cancelled.toString()}
                  color="bg-red-600"
                />
                <div className="pt-3 border-t border-gray-700">
                  <p className="text-xs text-gray-400 mb-1">
                    Completion Rate
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 rounded-full bg-gray-700 overflow-hidden">
                      <div
                        className="h-full bg-green-500"
                        style={{
                          width: `${data.performance.completion_rate}%`,
                        }}
                      />
                    </div>
                    <span className="font-bold text-sm">
                      {data.performance.completion_rate}%
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Earnings Breakdown */}
            <Card variant="default">
              <h3 className="text-lg font-bold mb-4">💸 Earnings</h3>
              <div className="space-y-3">
                <EarningRow
                  label="From Jobs"
                  amount={`$${data.earnings.from_jobs.toLocaleString()}`}
                  percent={Math.round(
                    (data.earnings.from_jobs / data.earnings.total) * 100
                  )}
                  color="bg-blue-500"
                />
                <EarningRow
                  label="From Referrals"
                  amount={`$${data.earnings.from_referrals.toLocaleString()}`}
                  percent={Math.round(
                    (data.earnings.from_referrals / data.earnings.total) * 100
                  )}
                  color="bg-green-500"
                />
                <div className="pt-3 border-t border-gray-700">
                  <div className="flex justify-between mb-2">
                    <span className="text-xs text-gray-400">Pending</span>
                    <span className="font-bold text-yellow-400">
                      ${data.earnings.pending.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-400">Withdrawn</span>
                    <span className="font-bold text-green-400">
                      ${data.earnings.withdrawn.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Quick Stats */}
            <Card variant="default">
              <h3 className="text-lg font-bold mb-4">📊 Quick Stats</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Avg Completion</span>
                  <span className="font-bold">
                    {data.performance.avg_completion_time} days
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">TruScore</span>
                  <span className="font-bold text-cyan-400">850+</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Skills</span>
                  <span className="font-bold">{data.top_skills.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Active Clients</span>
                  <span className="font-bold">
                    {data.client_breakdown.length}
                  </span>
                </div>
              </div>
            </Card>
          </div>

          {/* Bottom Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Skills */}
            <Card variant="default">
              <h3 className="text-lg font-bold mb-4">🎯 Top Skills</h3>
              <div className="space-y-3">
                {data.top_skills.map((skill, i) => (
                  <div key={i} className="p-3 rounded-lg bg-gray-800/30">
                    <div className="flex justify-between mb-2">
                      <p className="font-bold">{skill.skill}</p>
                      <p className="text-sm text-gray-400">
                        {skill.jobs_completed} jobs
                      </p>
                    </div>
                    <p className="text-sm text-cyan-400">
                      Avg: ${skill.avg_earnings.toLocaleString()}/job
                    </p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Client Breakdown */}
            <Card variant="default">
              <h3 className="text-lg font-bold mb-4">👥 Top Clients</h3>
              <div className="space-y-3">
                {data.client_breakdown.slice(0, 5).map((client, i) => (
                  <div key={i} className="p-3 rounded-lg bg-gray-800/30">
                    <div className="flex justify-between mb-2">
                      <p className="font-bold">{client.name}</p>
                      <p className="text-sm text-gray-400">
                        {client.jobs} jobs
                      </p>
                    </div>
                    <div className="flex justify-between text-sm">
                      <p className="text-gray-400">
                        ${client.total_spent.toLocaleString()}
                      </p>
                      <p className="text-yellow-400">
                        {'⭐'.repeat(Math.round(client.rating))}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Export */}
          <div className="mt-8 text-center">
            <Button
              variant="secondary"
              onClick={() => alert('Export functionality in production')}
            >
              📥 Export Report
            </Button>
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}

function SummaryCard({
  label,
  value,
  icon,
  trend,
  highlight = false,
}: {
  label: string;
  value: string;
  icon: string;
  trend: string;
  highlight?: boolean;
}) {
  return (
    <Card
      variant="default"
      className={highlight ? 'bg-cyan-900/20 border-cyan-700/30' : ''}
    >
      <div className="flex justify-between items-start mb-3">
        <p className="text-xs text-gray-400">{label}</p>
        <span className="text-2xl">{icon}</span>
      </div>
      <p className="text-2xl font-black mb-2">{value}</p>
      <p className="text-xs text-green-400">↗ {trend}</p>
    </Card>
  );
}

function MetricRow({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${color}`} />
        <span className="text-sm text-gray-400">{label}</span>
      </div>
      <span className="font-bold">{value}</span>
    </div>
  );
}

function EarningRow({
  label,
  amount,
  percent,
  color,
}: {
  label: string;
  amount: string;
  percent: number;
  color: string;
}) {
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-sm text-gray-400">{label}</span>
        <span className="font-bold">{amount}</span>
      </div>
      <div className="h-1.5 rounded-full bg-gray-700 overflow-hidden">
        <div className={`h-full ${color}`} style={{ width: `${percent}%` }} />
      </div>
      <p className="text-xs text-gray-500 mt-1">{percent}% of total</p>
    </div>
  );
}
