'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Button, LoadingSpinner, Card } from '@/components/ui';

interface UserProfile {
  user_id: string;
  name: string;
  email: string;
  avatar_url: string;
  bio: string;
  role: 'worker' | 'client';
  truscore: number;
  verification_status: {
    email: boolean;
    phone: boolean;
    identity: boolean;
    wallet: boolean;
  };
  badges: Badge[];
  stats: {
    jobs_completed: number;
    total_earned: number;
    avg_rating: number;
    on_time_rate: number;
    response_rate: number;
  };
  blockchain_wallet: string | null;
  nft_passport_uri: string | null;
}

interface Badge {
  badge_id: string;
  name: string;
  description: string;
  icon: string;
  earned_at: string;
}

export default function VerificationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'verification' | 'blockchain'>('overview');

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const token = localStorage.getItem('veritas_token');
      if (!token) {
        router.push('/auth');
        return;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/me/profile`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error('Failed to load profile');

      const data = await res.json();
      setProfile(data.data);
    } catch (err) {
      console.error('Profile load error:', err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading profile..." />;
  }

  if (!profile) {
    return (
      <ProtectedRoute>
        <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-gray-900 text-white p-4">
          <div className="max-w-4xl mx-auto">
            <Button variant="secondary" onClick={() => router.back()} className="mb-6">
              ← Back
            </Button>
            <p className="text-center text-gray-400">Profile not found</p>
          </div>
        </main>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <Button
            variant="secondary"
            size="md"
            onClick={() => router.back()}
            className="mb-8"
          >
            ← Back
          </Button>

          {/* Header with Profile */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-4xl flex-shrink-0">
                👤
              </div>

              <div className="flex-1">
                <h1 className="text-3xl sm:text-4xl font-black mb-2">{profile.name}</h1>
                <p className="text-gray-400 mb-4">{profile.bio}</p>

                <div className="flex flex-wrap gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">TruScore</p>
                    <p className="text-2xl font-black text-cyan-400">{profile.truscore}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Rating</p>
                    <p className="text-2xl font-black">
                      {'⭐'.repeat(Math.round(profile.stats.avg_rating))}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">On Time</p>
                    <p className="text-2xl font-black text-green-400">
                      {profile.stats.on_time_rate}%
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Role</p>
                    <p className="text-lg font-bold capitalize">
                      {profile.role === 'worker' ? '🎯 Worker' : '💼 Client'}
                    </p>
                  </div>
                </div>

                <Button variant="primary" onClick={() => router.push('/settings')}>
                  Edit Profile
                </Button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-8 border-b border-gray-800">
            {[
              { id: 'overview' as const, label: '📊 Overview' },
              { id: 'verification' as const, label: '✓ Verification' },
              { id: 'blockchain' as const, label: '⛓️ Blockchain' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 font-bold border-b-2 transition-all ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <StatCard
                label="Jobs Completed"
                value={profile.stats.jobs_completed.toString()}
                icon="✓"
              />
              <StatCard
                label="Total Earned"
                value={`$${profile.stats.total_earned.toLocaleString()}`}
                icon="💰"
              />
              <StatCard
                label="Response Rate"
                value={`${profile.stats.response_rate}%`}
                icon="⚡"
              />

              {/* Badges */}
              <div className="lg:col-span-3">
                <Card variant="default">
                  <h3 className="text-lg font-bold mb-4">🏆 Badges & Achievements</h3>
                  {profile.badges.length === 0 ? (
                    <p className="text-gray-400 text-center py-8">
                      Complete jobs to earn badges
                    </p>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                      {profile.badges.map((badge) => (
                        <div
                          key={badge.badge_id}
                          className="p-4 rounded-lg bg-gray-800/30 border border-gray-700 text-center"
                        >
                          <p className="text-3xl mb-2">{badge.icon}</p>
                          <p className="font-bold text-sm mb-1">{badge.name}</p>
                          <p className="text-xs text-gray-400">{badge.description}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              </div>
            </div>
          )}

          {/* Verification Tab */}
          {activeTab === 'verification' && (
            <div className="space-y-6">
              <Card variant="elevated" className="bg-cyan-900/20 border-cyan-700/30">
                <h3 className="text-lg font-bold text-cyan-300 mb-4">
                  🛡️ Veritas Verification
                </h3>
                <p className="text-cyan-200 mb-6">
                  Complete verification to build trust and unlock premium features
                </p>

                <div className="space-y-4">
                  {/* Email */}
                  <VerificationItem
                    icon="📧"
                    label="Email Verification"
                    verified={profile.verification_status.email}
                    description="Verify your email address"
                    onVerify={() => {}}
                  />

                  {/* Phone */}
                  <VerificationItem
                    icon="📱"
                    label="Phone Verification"
                    verified={profile.verification_status.phone}
                    description="Verify with SMS code"
                    onVerify={() => {}}
                  />

                  {/* Identity */}
                  <VerificationItem
                    icon="🪪"
                    label="Identity Verification"
                    verified={profile.verification_status.identity}
                    description="Government-issued ID verification"
                    onVerify={() => {}}
                  />

                  {/* Wallet */}
                  <VerificationItem
                    icon="💳"
                    label="Wallet Verification"
                    verified={profile.verification_status.wallet}
                    description="Connect blockchain wallet"
                    onVerify={() => {}}
                  />
                </div>

                {/* Verification Score */}
                <div className="mt-8 pt-6 border-t border-cyan-700/30">
                  <p className="text-sm font-bold text-cyan-400 mb-3">
                    Verification Level
                  </p>
                  <div className="h-3 rounded-full bg-cyan-900/50 overflow-hidden mb-2">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                      style={{
                        width: `${
                          (Object.values(profile.verification_status).filter(Boolean)
                            .length / 4) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                  <p className="text-xs text-cyan-300">
                    {Object.values(profile.verification_status).filter(Boolean).length}/4
                    complete
                  </p>
                </div>
              </Card>
            </div>
          )}

          {/* Blockchain Tab */}
          {activeTab === 'blockchain' && (
            <div className="space-y-6">
              <Card variant="elevated" className="bg-purple-900/20 border-purple-700/30">
                <h3 className="text-lg font-bold text-purple-300 mb-4">
                  ⛓️ Blockchain Integration
                </h3>

                {profile.blockchain_wallet ? (
                  <>
                    <div className="p-4 rounded-lg bg-purple-900/30 border border-purple-700/50 mb-6">
                      <p className="text-xs text-purple-400 mb-2">Connected Wallet</p>
                      <p className="font-mono text-sm text-purple-300 break-all">
                        {profile.blockchain_wallet.slice(0, 10)}...
                        {profile.blockchain_wallet.slice(-10)}
                      </p>
                    </div>

                    {profile.nft_passport_uri && (
                      <div className="p-4 rounded-lg bg-purple-900/30 border border-purple-700/50 mb-6">
                        <p className="text-xs text-purple-400 mb-2">
                          NFT Reputation Passport
                        </p>
                        <p className="font-mono text-sm text-purple-300 break-all">
                          {profile.nft_passport_uri.slice(0, 50)}...
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(profile.nft_passport_uri, '_blank')}
                          className="mt-3"
                        >
                          View on Blockchain
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-400 mb-4">No wallet connected</p>
                    <Button
                      variant="primary"
                      onClick={() => router.push('/settings')}
                    >
                      Connect Wallet
                    </Button>
                  </div>
                )}
              </Card>

              {/* Web3 Features */}
              <Card variant="default">
                <h3 className="font-bold text-lg mb-4">Web3 Features</h3>
                <div className="space-y-3">
                  <FeatureItem
                    enabled={!!profile.blockchain_wallet}
                    label="Blockchain Verification"
                    description="All transactions verified on-chain"
                  />
                  <FeatureItem
                    enabled={!!profile.nft_passport_uri}
                    label="NFT Reputation Passport"
                    description="Transferable reputation across platforms"
                  />
                  <FeatureItem
                    enabled={profile.verification_status.wallet}
                    label="Smart Contract Escrow"
                    description="Trustless, decentralized payments"
                  />
                  <FeatureItem
                    enabled={true}
                    label="Transparent History"
                    description="All work visible on blockchain"
                  />
                </div>
              </Card>
            </div>
          )}
        </div>
      </main>
    </ProtectedRoute>
  );
}

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
      <p className="text-xs text-gray-400 mb-2">{label}</p>
      <div className="flex items-end justify-between">
        <p className="text-3xl font-black">{value}</p>
        <p className="text-2xl">{icon}</p>
      </div>
    </Card>
  );
}

function VerificationItem({
  icon,
  label,
  verified,
  description,
  onVerify,
}: {
  icon: string;
  label: string;
  verified: boolean;
  description: string;
  onVerify: () => void;
}) {
  return (
    <div className="p-4 rounded-lg bg-gray-800/30 border border-gray-700 flex items-start justify-between">
      <div className="flex items-start gap-3">
        <p className="text-2xl">{icon}</p>
        <div>
          <p className="font-bold flex items-center gap-2">
            {label}
            {verified && <span className="text-cyan-400">✓</span>}
          </p>
          <p className="text-sm text-gray-400">{description}</p>
        </div>
      </div>
      {!verified && (
        <Button variant="outline" size="sm" onClick={onVerify}>
          Verify
        </Button>
      )}
    </div>
  );
}

function FeatureItem({
  enabled,
  label,
  description,
}: {
  enabled: boolean;
  label: string;
  description: string;
}) {
  return (
    <div className={`p-4 rounded-lg border ${
      enabled
        ? 'bg-green-900/20 border-green-700/30'
        : 'bg-gray-800/30 border-gray-700 opacity-50'
    }`}>
      <p className={`font-bold flex items-center gap-2 ${
        enabled ? 'text-green-400' : 'text-gray-400'
      }`}>
        {enabled ? '✓' : '○'} {label}
      </p>
      <p className="text-sm text-gray-400 mt-1">{description}</p>
    </div>
  );
}
