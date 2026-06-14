'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, LoadingSpinner, EmptyState } from '@/components/ui';

interface DashboardMetrics {
  totalUsers: number;
  activeJobs: number;
  escrowVolume: number;
  todayRevenue: number;
  weeklyGrowth: number;
  disputeCount: number;
}

interface User {
  user_id: string;
  name: string;
  email: string;
  role: string;
  truscore: number;
  email_verified: boolean;
  suspended: boolean;
  created_at: string;
  last_login: string;
}

interface Job {
  job_id: string;
  title: string;
  status: string;
  client_name: string;
  worker_name: string;
  budget: number;
  created_at: string;
}

type TabType = 'overview' | 'users' | 'jobs' | 'finance' | 'ai';

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    try {
      const token = localStorage.getItem('veritas_token');

      if (!token) {
        router.push('/auth');
        return;
      }

      // Load metrics
      const metricsRes = await fetch('/api/admin/metrics', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (metricsRes.ok) {
        const metricsData = await metricsRes.json();
        setMetrics(metricsData.data);
      }

      // Load users
      const usersRes = await fetch('/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData.data || []);
      }

      // Load jobs
      const jobsRes = await fetch('/api/admin/jobs', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (jobsRes.ok) {
        const jobsData = await jobsRes.json();
        setJobs(jobsData.data || []);
      }

      setLoading(false);
    } catch (err) {
      setError('Failed to load admin dashboard');
      console.error('Admin load error:', err);
      setLoading(false);
    }
  }

  async function suspendUser(userId: string, reason: string) {
    if (!confirm('Are you sure you want to suspend this user?')) return;

    const token = localStorage.getItem('veritas_token');
    try {
      await fetch(`/api/admin/users/${userId}/suspend`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason }),
      });

      loadDashboardData();
    } catch (err) {
      console.error('Failed to suspend user:', err);
    }
  }

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || u.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const filteredJobs = jobs.filter((j) => {
    const matchesStatus = filterStatus === 'all' || j.status === filterStatus;
    return matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-gray-900 flex items-center justify-center">
        <LoadingSpinner message="Loading admin dashboard..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-gray-900 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-gray-900 border-b border-gray-800 sticky top-0 z-40 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black">🛡️ Admin Dashboard</h1>
            <p className="text-gray-400 text-sm mt-1">
              Veritas Trust Ledger Control Panel
            </p>
          </div>
          <Button
            onClick={() => router.push('/dashboard')}
            variant="secondary"
            size="md"
          >
            ← Back to Dashboard
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-gray-900/50 border-b border-gray-800 sticky top-16 z-30 overflow-x-auto">
        <div className="flex gap-2 sm:gap-4 px-4 sm:px-6">
          {[
            { id: 'overview' as TabType, label: '📊 Overview' },
            { id: 'users' as TabType, label: '👥 Users' },
            { id: 'jobs' as TabType, label: '💼 Jobs' },
            { id: 'finance' as TabType, label: '💰 Finance' },
            { id: 'ai' as TabType, label: '🤖 AI' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 sm:px-6 py-4 border-b-2 transition-all whitespace-nowrap text-sm sm:text-base font-bold ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && metrics && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
              <MetricCard
                title="Total Users"
                value={metrics.totalUsers.toLocaleString()}
                change={`+${metrics.weeklyGrowth}% this week`}
                icon="👥"
              />
              <MetricCard
                title="Active Jobs"
                value={metrics.activeJobs.toLocaleString()}
                change="Real-time"
                icon="💼"
              />
              <MetricCard
                title="Escrow Volume"
                value={`$${(metrics.escrowVolume / 1000).toFixed(1)}K`}
                change="Total held"
                icon="💰"
              />
              <MetricCard
                title="Today's Revenue"
                value={`$${metrics.todayRevenue.toLocaleString()}`}
                change="Platform fees"
                icon="📈"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-6">
                <h3 className="font-bold text-lg mb-4">Recent Activity</h3>
                <ActivityFeed />
              </div>

              <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-6">
                <h3 className="font-bold text-lg mb-4">Health Status</h3>
                <SystemStatus />
              </div>
            </div>
          </>
        )}

        {/* USERS TAB */}
        {activeTab === 'users' && (
          <>
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="all">All Roles</option>
                <option value="worker">Worker</option>
                <option value="client">Client</option>
              </select>
            </div>

            {filteredUsers.length === 0 ? (
              <EmptyState
                icon="👥"
                title="No users found"
                description="Try adjusting your search criteria"
              />
            ) : (
              <div className="bg-gray-900/40 border border-gray-800 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-800/50 border-b border-gray-700">
                      <tr>
                        <th className="px-4 py-3 sm:px-6 text-left text-sm font-bold text-gray-400">
                          Name
                        </th>
                        <th className="px-4 py-3 sm:px-6 text-left text-sm font-bold text-gray-400 hidden sm:table-cell">
                          Email
                        </th>
                        <th className="px-4 py-3 sm:px-6 text-left text-sm font-bold text-gray-400 hidden md:table-cell">
                          Role
                        </th>
                        <th className="px-4 py-3 sm:px-6 text-left text-sm font-bold text-gray-400">
                          TruScore
                        </th>
                        <th className="px-4 py-3 sm:px-6 text-left text-sm font-bold text-gray-400 hidden lg:table-cell">
                          Status
                        </th>
                        <th className="px-4 py-3 sm:px-6 text-left text-sm font-bold text-gray-400">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {filteredUsers.map((user) => (
                        <tr
                          key={user.user_id}
                          className="hover:bg-gray-800/30 transition-colors"
                        >
                          <td className="px-4 py-4 sm:px-6 font-bold">{user.name}</td>
                          <td className="px-4 py-4 sm:px-6 text-gray-400 hidden sm:table-cell text-sm">
                            {user.email}
                          </td>
                          <td className="px-4 py-4 sm:px-6 text-gray-400 hidden md:table-cell capitalize text-sm">
                            {user.role}
                          </td>
                          <td className="px-4 py-4 sm:px-6 font-bold text-yellow-400">
                            {user.truscore}
                          </td>
                          <td className="px-4 py-4 sm:px-6 hidden lg:table-cell">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              user.suspended
                                ? 'bg-red-900/30 text-red-400'
                                : 'bg-green-900/30 text-green-400'
                            }`}>
                              {user.suspended ? 'Suspended' : 'Active'}
                            </span>
                          </td>
                          <td className="px-4 py-4 sm:px-6">
                            <button
                              onClick={() => suspendUser(user.user_id, 'Admin action')}
                              className="text-red-400 hover:text-red-300 text-sm font-bold"
                            >
                              {user.suspended ? 'Restore' : 'Suspend'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

        {/* JOBS TAB */}
        {activeTab === 'jobs' && (
          <>
            <div className="mb-6">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="disputed">Disputed</option>
              </select>
            </div>

            {filteredJobs.length === 0 ? (
              <EmptyState
                icon="💼"
                title="No jobs found"
                description="Try adjusting your filters"
              />
            ) : (
              <div className="bg-gray-900/40 border border-gray-800 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-800/50 border-b border-gray-700">
                      <tr>
                        <th className="px-4 py-3 sm:px-6 text-left text-sm font-bold text-gray-400">
                          Job Title
                        </th>
                        <th className="px-4 py-3 sm:px-6 text-left text-sm font-bold text-gray-400 hidden sm:table-cell">
                          Client
                        </th>
                        <th className="px-4 py-3 sm:px-6 text-left text-sm font-bold text-gray-400 hidden md:table-cell">
                          Budget
                        </th>
                        <th className="px-4 py-3 sm:px-6 text-left text-sm font-bold text-gray-400">
                          Status
                        </th>
                        <th className="px-4 py-3 sm:px-6 text-left text-sm font-bold text-gray-400 hidden lg:table-cell">
                          Posted
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {filteredJobs.map((job) => (
                        <tr
                          key={job.job_id}
                          className="hover:bg-gray-800/30 transition-colors"
                        >
                          <td className="px-4 py-4 sm:px-6 font-bold">{job.title}</td>
                          <td className="px-4 py-4 sm:px-6 text-gray-400 hidden sm:table-cell text-sm">
                            {job.client_name}
                          </td>
                          <td className="px-4 py-4 sm:px-6 font-bold hidden md:table-cell">
                            ${job.budget}
                          </td>
                          <td className="px-4 py-4 sm:px-6">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              job.status === 'completed'
                                ? 'bg-green-900/30 text-green-400'
                                : job.status === 'disputed'
                                ? 'bg-red-900/30 text-red-400'
                                : 'bg-blue-900/30 text-blue-400'
                            }`}>
                              {job.status}
                            </span>
                          </td>
                          <td className="px-4 py-4 sm:px-6 text-gray-400 hidden lg:table-cell text-sm">
                            {new Date(job.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

        {/* FINANCE TAB */}
        {activeTab === 'finance' && metrics && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-6">
              <h3 className="font-bold text-lg mb-6">Financial Overview</h3>
              <div className="space-y-4">
                <FinanceStat label="Escrow Balance" value={`$${metrics.escrowVolume.toLocaleString()}`} />
                <FinanceStat label="Pending Payouts" value="$12,450" />
                <FinanceStat label="Total Revenue" value={`$${metrics.todayRevenue.toLocaleString()}`} />
                <FinanceStat label="Avg Transaction" value="$287" />
              </div>
            </div>

            <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-6">
              <h3 className="font-bold text-lg mb-6">Revenue Breakdown</h3>
              <p className="text-gray-500 text-center py-8">
                📊 Chart coming soon
              </p>
            </div>
          </div>
        )}

        {/* AI TAB */}
        {activeTab === 'ai' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <AIMetric label="Match Accuracy" value="94.2%" trend="+2.1%" />
            <AIMetric label="Avg Response Time" value="1.3s" trend="-0.2s" />
            <AIMetric label="Price Accuracy" value="91.7%" trend="+3.4%" />
            <AIMetric label="Dispute Prediction" value="87.5%" trend="+1.8%" />
          </div>
        )}
      </div>
    </div>
  );
}

// Helper Components
function MetricCard({
  title,
  value,
  change,
  icon,
}: {
  title: string;
  value: string;
  change: string;
  icon: string;
}) {
  return (
    <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-all">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-sm font-bold text-gray-400">{title}</h3>
        <span className="text-2xl">{icon}</span>
      </div>
      <p className="text-3xl font-black mb-2">{value}</p>
      <p className="text-sm text-blue-400">{change}</p>
    </div>
  );
}

function ActivityFeed() {
  const activities = [
    { icon: '👤', text: 'New user: John Smith', time: '2m ago' },
    { icon: '💼', text: 'Job posted: Plumbing repair', time: '5m ago' },
    { icon: '✓', text: 'Job completed: Kitchen renovation', time: '12m ago' },
    { icon: '⚠️', text: 'Dispute opened: Payment issue', time: '18m ago' },
    { icon: '💰', text: 'Payout released: $450', time: '25m ago' },
  ];

  return (
    <div className="space-y-4">
      {activities.map((activity, i) => (
        <div key={i} className="flex gap-3 pb-4 border-b border-gray-800 last:border-b-0">
          <span className="text-xl">{activity.icon}</span>
          <div>
            <p className="text-sm font-bold">{activity.text}</p>
            <p className="text-xs text-gray-500">{activity.time}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function SystemStatus() {
  const checks = [
    { label: 'API', status: 'online' },
    { label: 'Database', status: 'online' },
    { label: 'Blockchain', status: 'offline' },
    { label: 'Email Service', status: 'online' },
  ];

  return (
    <div className="space-y-3">
      {checks.map((check) => (
        <div key={check.label} className="flex items-center justify-between">
          <span className="text-sm">{check.label}</span>
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${
            check.status === 'online'
              ? 'bg-green-900/30 text-green-400'
              : 'bg-red-900/30 text-red-400'
          }`}>
            {check.status}
          </span>
        </div>
      ))}
    </div>
  );
}

function FinanceStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center pb-4 border-b border-gray-800">
      <span className="text-gray-400 text-sm">{label}</span>
      <span className="font-bold text-lg">{value}</span>
    </div>
  );
}

function AIMetric({ label, value, trend }: { label: string; value: string; trend: string }) {
  const isPositive = trend.startsWith('+');
  return (
    <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-6">
      <p className="text-gray-400 text-sm mb-2">{label}</p>
      <p className="text-2xl font-black mb-2">{value}</p>
      <p className={`text-sm font-bold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
        {trend} from last week
      </p>
    </div>
  );
}
