'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button, LoadingSpinner, Card } from '@/components/ui';

interface PublicProfile {
  user_id: string;
  name: string;
  bio: string;
  avatar_url: string;
  role: 'worker' | 'client';
  location: string;
  website: string;
  truscore: number;
  joined_date: string;
  stats: {
    jobs_completed: number;
    total_earned: number;
    avg_rating: number;
    on_time_rate: number;
    response_rate: number;
  };
  badges: Badge[];
  recent_work: RecentWork[];
  nft_passport?: {
    token_id: string;
    contract_address: string;
    chain: string;
  };
  blockchain_verified: boolean;
  social_links: {
    twitter?: string;
    github?: string;
    linkedin?: string;
  };
}

interface Badge {
  icon: string;
  name: string;
  description: string;
  earned_at: string;
}

interface RecentWork {
  title: string;
  description: string;
  rating: number;
  completed_at: string;
}

export default function PublicProfilePage() {
  const params = useParams();
  const username = params.username as string;

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadProfile();
  }, [username]);

  async function loadProfile() {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/${username}/profile`
      );

      if (!res.ok) throw new Error('Profile not found');

      const data = await res.json();
      setProfile(data.data);
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading profile..." />;
  }

  if (!profile) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-gray-900 text-white flex items-center justify-center p-4">
        <Card variant="default" className="max-w-md text-center">
          <p className="text-3xl mb-2">😔</p>
          <p className="font-bold mb-1">Profile not found</p>
          <p className="text-gray-400 text-sm">
            This profile doesn't exist or has been removed
          </p>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-gray-900 text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-4xl flex-shrink-0">
            👤
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl sm:text-4xl font-black">{profile.name}</h1>
              {profile.blockchain_verified && (
                <span className="px-3 py-1 rounded-full bg-green-900/30 text-green-400 text-xs font-bold">
                  ✓ Verified
                </span>
              )}
              {profile.nft_passport && (
                <span className="px-3 py-1 rounded-full bg-purple-900/30 text-purple-400 text-xs font-bold">
                  🏆 NFT Passport
                </span>
              )}
            </div>

            <p className="text-gray-400 mb-4">{profile.bio}</p>

            <div className="flex flex-wrap gap-6 text-sm">
              {profile.location && (
                <div>
                  <p className="text-gray-500">📍 Location</p>
                  <p className="font-bold">{profile.location}</p>
                </div>
              )}
              <div>
                <p className="text-gray-500">📅 Joined</p>
                <p className="font-bold">
                  {new Date(profile.joined_date).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-gray-500">🎯 Role</p>
                <p className="font-bold capitalize">{profile.role}</p>
              </div>
            </div>
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              variant="primary"
              fullWidth
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
            >
              {copied ? '✓ Copied' : '🔗 Share'}
            </Button>
            <Button variant="outline">💬 Message</Button>
          </div>
        </div>

        {/* TruScore & Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
          <StatCard
            label="TruScore"
            value={profile.truscore.toString()}
            icon="🛡️"
            highlight
          />
          <StatCard
            label="Jobs Done"
            value={profile.stats.jobs_completed.toString()}
            icon="✓"
          />
          <StatCard
            label="Rating"
            value={`${profile.stats.avg_rating.toFixed(1)}⭐`}
            icon="⭐"
          />
          <StatCard
            label="On Time"
            value={`${profile.stats.on_time_rate}%`}
            icon="⏰"
          />
          <StatCard
            label="Response"
            value={`${profile.stats.response_rate}%`}
            icon="⚡"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Badges */}
            {profile.badges.length > 0 && (
              <Card variant="default">
                <h3 className="text-lg font-bold mb-4">🏆 Badges & Achievements</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {profile.badges.map((badge, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-lg bg-gray-800/30 border border-gray-700 text-center hover:border-cyan-500/30 transition-all"
                    >
                      <p className="text-3xl mb-2">{badge.icon}</p>
                      <p className="font-bold text-sm mb-1">{badge.name}</p>
                      <p className="text-xs text-gray-400">{badge.description}</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Recent Work */}
            {profile.recent_work.length > 0 && (
              <Card variant="default">
                <h3 className="text-lg font-bold mb-4">💼 Recent Work</h3>
                <div className="space-y-4">
                  {profile.recent_work.map((work, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-lg bg-gray-800/30 border border-gray-700"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <p className="font-bold">{work.title}</p>
                        <div className="flex gap-1">
                          {Array.from({ length: Math.round(work.rating) }).map(
                            (_, j) => (
                              <span key={j} className="text-yellow-400">
                                ⭐
                              </span>
                            )
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-400 mb-2">
                        {work.description}
                      </p>
                      <p className="text-xs text-gray-500">
                        Completed{' '}
                        {new Date(work.completed_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Verification Status */}
            <Card variant="default" className="bg-green-900/20 border-green-700/30">
              <h3 className="font-bold text-green-300 mb-4">✓ Verification</h3>
              <div className="space-y-2 text-sm">
                <VerificationItem
                  label="Identity Verified"
                  verified={profile.blockchain_verified}
                />
                <VerificationItem
                  label="Email Verified"
                  verified={true}
                />
                {profile.nft_passport && (
                  <VerificationItem label="NFT Passport" verified={true} />
                )}
              </div>
            </Card>

            {/* NFT Passport */}
            {profile.nft_passport && (
              <Card variant="default" className="bg-purple-900/20 border-purple-700/30">
                <h3 className="font-bold text-purple-300 mb-3">🏆 NFT Passport</h3>
                <a
                  href={`https://opensea.io/assets/polygon/${profile.nft_passport.contract_address}/${profile.nft_passport.token_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-3 rounded-lg bg-purple-900/30 hover:bg-purple-900/50 transition-all text-center"
                >
                  <p className="text-xs text-purple-300 mb-2">View on OpenSea</p>
                  <p className="font-mono text-xs text-purple-400 break-all">
                    #{profile.nft_passport.token_id}
                  </p>
                </a>
              </Card>
            )}

            {/* Social Links */}
            {Object.keys(profile.social_links).length > 0 && (
              <Card variant="default">
                <h3 className="font-bold mb-3">🔗 Social</h3>
                <div className="space-y-2">
                  {profile.social_links.twitter && (
                    <a
                      href={`https://twitter.com/${profile.social_links.twitter}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-2 rounded hover:bg-gray-800/30 transition-all"
                    >
                      <span>𝕏</span>
                      <span className="text-sm text-gray-400">
                        @{profile.social_links.twitter}
                      </span>
                    </a>
                  )}
                  {profile.social_links.github && (
                    <a
                      href={`https://github.com/${profile.social_links.github}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-2 rounded hover:bg-gray-800/30 transition-all"
                    >
                      <span>🐙</span>
                      <span className="text-sm text-gray-400">
                        {profile.social_links.github}
                      </span>
                    </a>
                  )}
                </div>
              </Card>
            )}

            {/* Earnings */}
            <Card variant="default" className="bg-blue-900/20 border-blue-700/30">
              <p className="text-xs text-blue-400 mb-1">Total Earned</p>
              <p className="text-3xl font-black text-blue-300">
                ${profile.stats.total_earned.toLocaleString()}
              </p>
            </Card>
          </div>
        </div>
      </div>
    </main>
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

function VerificationItem({
  label,
  verified,
}: {
  label: string;
  verified: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className={verified ? 'text-green-400' : 'text-gray-500'}>
        {verified ? '✓' : '○'}
      </span>
      <span className="text-sm">{label}</span>
    </div>
  );
}
