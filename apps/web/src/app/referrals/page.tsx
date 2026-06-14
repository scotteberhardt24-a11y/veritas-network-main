'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Button, LoadingSpinner, Card } from '@/components/ui';

interface ReferralData {
  referral_code: string;
  total_referrals: number;
  active_referrals: number;
  total_earnings: number;
  pending_earnings: number;
  conversion_rate: number;
  referrals: ReferralRecord[];
}

interface ReferralRecord {
  referral_id: string;
  referred_user: {
    name: string;
    email: string;
  };
  status: 'pending' | 'active' | 'completed';
  referred_at: string;
  commission_amount: number;
  jobs_referred: number;
}

export default function ReferralsPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ReferralData | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadReferralData();
  }, []);

  async function loadReferralData() {
    try {
      const token = localStorage.getItem('veritas_token');
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/referrals`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error('Failed to load referral data');

      const response = await res.json();
      setData(response.data);
    } catch (error) {
      console.error('Failed to load referrals:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading referrals..." />;
  }

  if (!data) {
    return (
      <ProtectedRoute>
        <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-gray-900 text-white p-4">
          <Card variant="default">Error loading referral data</Card>
        </main>
      </ProtectedRoute>
    );
  }

  const referralUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/join?ref=${data.referral_code}`;

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-gray-900 text-white p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-black mb-2">
              🚀 Referral Program
            </h1>
            <p className="text-gray-400">
              Earn commissions by referring workers and clients
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              label="Total Referrals"
              value={data.total_referrals.toString()}
              icon="👥"
            />
            <StatCard
              label="Active"
              value={data.active_referrals.toString()}
              icon="✓"
            />
            <StatCard
              label="Earnings"
              value={`$${data.total_earnings.toLocaleString()}`}
              icon="💰"
              highlight
            />
            <StatCard
              label="Conversion"
              value={`${data.conversion_rate}%`}
              icon="📈"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main */}
            <div className="lg:col-span-2 space-y-6">
              {/* Share Section */}
              <Card variant="elevated" className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border-blue-700/30">
                <h2 className="text-2xl font-bold mb-4">🎁 Share Your Code</h2>

                <p className="text-gray-300 mb-6">
                  Each referred user who completes their first job earns you a 10%
                  commission. No limit!
                </p>

                <div className="mb-4">
                  <label className="block text-sm font-bold text-gray-300 mb-2">
                    Your Referral Code
                  </label>
                  <div className="flex gap-2">
                    <div className="flex-1 px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 font-mono text-white">
                      {data.referral_code}
                    </div>
                    <Button
                      variant="primary"
                      onClick={() => {
                        navigator.clipboard.writeText(data.referral_code);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                    >
                      {copied ? '✓' : '📋'} Copy
                    </Button>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-bold text-gray-300 mb-2">
                    Referral Link
                  </label>
                  <div className="flex gap-2">
                    <div className="flex-1 px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white break-all text-sm">
                      {referralUrl}
                    </div>
                    <Button
                      variant="primary"
                      onClick={() => {
                        navigator.clipboard.writeText(referralUrl);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                    >
                      {copied ? '✓' : '📋'} Copy
                    </Button>
                  </div>
                </div>

                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant="outline"
                    onClick={() => {
                      const text = `Join Veritas - the Web3 freelance platform! Use my code ${data.referral_code} to get started. ${referralUrl}`;
                      navigator.clipboard.writeText(text);
                      alert('Tweet template copied!');
                    }}
                  >
                    𝕏 Twitter
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => alert('Telegram share would open Telegram in production')}
                  >
                    📱 Telegram
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => alert('Email share would open email client in production')}
                  >
                    📧 Email
                  </Button>
                </div>
              </Card>

              {/* How It Works */}
              <Card variant="default">
                <h3 className="text-xl font-bold mb-4">💡 How It Works</h3>

                <div className="space-y-4">
                  <HowItWorksStep
                    number="1"
                    title="Share Your Code"
                    description="Give your unique referral code to friends"
                  />
                  <HowItWorksStep
                    number="2"
                    title="They Sign Up"
                    description="They join Veritas using your code"
                  />
                  <HowItWorksStep
                    number="3"
                    title="First Job"
                    description="When they complete their first job, you earn 10%"
                  />
                  <HowItWorksStep
                    number="4"
                    title="Get Paid"
                    description="Commissions automatically added to your account"
                  />
                </div>
              </Card>

              {/* Referrals List */}
              <Card variant="default">
                <h3 className="text-xl font-bold mb-4">📊 Your Referrals</h3>

                {data.referrals.length === 0 ? (
                  <p className="text-center text-gray-400 py-8">
                    No referrals yet. Start sharing your code!
                  </p>
                ) : (
                  <div className="space-y-3">
                    {data.referrals.map((ref) => (
                      <div
                        key={ref.referral_id}
                        className="p-4 rounded-lg bg-gray-800/30 border border-gray-700 flex items-start justify-between"
                      >
                        <div>
                          <p className="font-bold">{ref.referred_user.name}</p>
                          <p className="text-sm text-gray-400">
                            {ref.referred_user.email}
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            {ref.jobs_referred} jobs • Referred{' '}
                            {new Date(ref.referred_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-cyan-400">
                            ${ref.commission_amount.toFixed(2)}
                          </p>
                          <StatusBadge status={ref.status} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Pending Earnings */}
              <Card variant="default" className="bg-yellow-900/20 border-yellow-700/30">
                <p className="text-xs text-yellow-400 mb-1">Pending Earnings</p>
                <p className="text-3xl font-black text-yellow-300">
                  ${data.pending_earnings.toFixed(2)}
                </p>
                <p className="text-xs text-yellow-400 mt-2">
                  Clears in 30 days
                </p>
              </Card>

              {/* Commission Rates */}
              <Card variant="default">
                <h3 className="font-bold mb-3">💸 Commission Rates</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">First Job</span>
                    <span className="font-bold text-green-400">+10%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Per Transaction</span>
                    <span className="font-bold text-green-400">+2%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Bonus (10+ refs)</span>
                    <span className="font-bold text-green-400">+5%</span>
                  </div>
                </div>
              </Card>

              {/* Leaderboard */}
              <Card variant="default">
                <h3 className="font-bold mb-3">🏆 Top Referrers</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>🥇 Sarah M.</span>
                    <span className="font-bold">$15,240</span>
                  </div>
                  <div className="flex justify-between">
                    <span>🥈 Ahmed K.</span>
                    <span className="font-bold">$12,560</span>
                  </div>
                  <div className="flex justify-between">
                    <span>🥉 Emma T.</span>
                    <span className="font-bold">$9,840</span>
                  </div>
                </div>
              </Card>

              {/* Tips */}
              <Card variant="default" className="bg-blue-900/20 border-blue-700/30">
                <h3 className="font-bold text-blue-300 mb-3">💡 Tips</h3>
                <ul className="space-y-2 text-xs text-blue-200">
                  <li>✓ Share in Discord communities</li>
                  <li>✓ Tweet about Veritas</li>
                  <li>✓ Tell friends one-on-one</li>
                  <li>✓ Add to your email signature</li>
                </ul>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}

function StatCard({
  label,
  value,
  icon,
  highlight = false,
}: {
  label: string;
  value: string;
  icon: string;
  highlight?: boolean;
}) {
  return (
    <Card
      variant="default"
      className={highlight ? 'bg-cyan-900/20 border-cyan-700/30' : ''}
    >
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <p className="text-2xl font-black flex items-center gap-2">
        {value}
        <span className="text-lg">{icon}</span>
      </p>
    </Card>
  );
}

function HowItWorksStep({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold flex-shrink-0">
        {number}
      </div>
      <div>
        <p className="font-bold mb-1">{title}</p>
        <p className="text-sm text-gray-400">{description}</p>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors = {
    pending: 'bg-yellow-900/30 text-yellow-400',
    active: 'bg-green-900/30 text-green-400',
    completed: 'bg-blue-900/30 text-blue-400',
  };

  return (
    <span className={`px-2 py-1 rounded text-xs font-bold mt-2 inline-block ${colors[status as keyof typeof colors]}`}>
      {status}
    </span>
  );
}
