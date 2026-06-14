'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Button, LoadingSpinner, ErrorBanner, Card } from '@/components/ui';

interface JobDetail {
  job_id: string;
  title: string;
  description: string;
  detailed_description: string;
  budget: number;
  budget_max: number;
  status: string;
  skills_required: string[];
  category: string;
  experience_level: string;
  client_name: string;
  client_id: string;
  client_rating: number;
  client_reviews: number;
  client_completed_jobs: number;
  applicants_count: number;
  created_at: string;
  deadline: string;
  urgent: boolean;
  ai_match_score: number;
  ai_match_reasons: string[];
  timeline: string;
  deliverables: string[];
  payment_method: string;
  escrow_required: boolean;
  portfolio_required: boolean;
  verification_required: boolean;
}

export default function JobDetailPage() {
  const router = useRouter();
  const params = useParams();
  const jobId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [job, setJob] = useState<JobDetail | null>(null);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [applyLoading, setApplyLoading] = useState(false);
  const [applyCoverLetter, setApplyCoverLetter] = useState('');
  const [applyRate, setApplyRate] = useState('');
  const [applyTimeline, setApplyTimeline] = useState('');

  useEffect(() => {
    loadJobDetail();
  }, [jobId]);

  async function loadJobDetail() {
    try {
      setLoading(true);
      const token = localStorage.getItem('veritas_token');

      if (!token) {
        router.push('/auth');
        return;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/jobs/${jobId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) {
        if (res.status === 404) {
          setError('Job not found');
          return;
        }
        throw new Error('Failed to load job');
      }

      const data = await res.json();
      setJob(data.data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load job');
      console.error('Job detail load error:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleApply() {
    if (!applyCoverLetter || !applyRate || !applyTimeline) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setApplyLoading(true);
      const token = localStorage.getItem('veritas_token');

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/jobs/${jobId}/apply`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            cover_letter: applyCoverLetter,
            proposed_rate: Number(applyRate),
            timeline: applyTimeline,
          }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to apply');
      }

      setShowApplyForm(false);
      setApplyCoverLetter('');
      setApplyRate('');
      setApplyTimeline('');
      setError(null);
      // Show success message
      alert('Application submitted! The client will review your proposal.');
      loadJobDetail();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to apply');
    } finally {
      setApplyLoading(false);
    }
  }

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading job details..." />;
  }

  if (!job) {
    return (
      <ProtectedRoute>
        <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-gray-900 text-white p-4 sm:p-6 lg:p-8">
          <div className="max-w-4xl mx-auto">
            <Button
              variant="secondary"
              onClick={() => router.back()}
              className="mb-6"
            >
              ← Back
            </Button>
            <ErrorBanner message={error || 'Job not found'} />
          </div>
        </main>
      </ProtectedRoute>
    );
  }

  const daysPosted = Math.floor(
    (new Date().getTime() - new Date(job.created_at).getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-gray-900 text-white">
        {error && !showApplyForm && (
          <ErrorBanner message={error} />
        )}

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <Button
            variant="secondary"
            size="md"
            onClick={() => router.back()}
            className="mb-8"
          >
            ← Back to Jobs
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Header */}
              <div className="mb-8">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                  <div>
                    <h1 className="text-3xl sm:text-4xl font-black mb-2">
                      {job.title}
                    </h1>
                    <p className="text-gray-400 text-sm">
                      Posted {daysPosted} days ago
                    </p>
                  </div>
                  {job.urgent && (
                    <span className="px-4 py-2 rounded-full bg-red-900/30 text-red-400 font-bold text-sm">
                      🔥 Urgent
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-3 mb-6">
                  <span className="px-3 py-1 rounded-full bg-cyan-900/30 text-cyan-400 text-sm font-bold">
                    {job.category}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-blue-900/30 text-blue-400 text-sm font-bold">
                    {job.experience_level}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-green-900/30 text-green-400 text-sm font-bold">
                    {job.status === 'open' ? '✓ Open' : 'Filled'}
                  </span>
                </div>
              </div>

              {/* AI Match Section */}
              <Card variant="elevated" className="mb-8 bg-cyan-900/20 border-cyan-700/30">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-cyan-300 mb-2">
                      🤖 AI Match Analysis
                    </h3>
                    <p className="text-sm text-cyan-200">
                      Based on your profile and skills
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-black text-cyan-300">
                      {job.ai_match_score}%
                    </div>
                    <p className="text-xs text-cyan-400 font-bold">Match Score</p>
                  </div>
                </div>

                <div className="h-2 rounded-full bg-cyan-900/50 overflow-hidden mb-4">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all"
                    style={{ width: `${job.ai_match_score}%` }}
                  />
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-bold text-cyan-300 mb-3">Why you're a great fit:</p>
                  {job.ai_match_reasons.map((reason, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-cyan-200">
                      <span className="text-lg mt-0.5">✓</span>
                      <span>{reason}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Job Description */}
              <Card variant="default" className="mb-8">
                <h2 className="text-2xl font-bold mb-4">About This Job</h2>
                <div className="prose prose-invert max-w-none mb-6">
                  <p className="text-gray-300 leading-relaxed whitespace-pre-wrap mb-6">
                    {job.detailed_description}
                  </p>
                </div>

                {job.deliverables.length > 0 && (
                  <>
                    <h3 className="text-lg font-bold mb-3">Deliverables</h3>
                    <ul className="space-y-2 mb-6">
                      {job.deliverables.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-gray-300">
                          <span className="text-cyan-400 mt-0.5">📦</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                <h3 className="text-lg font-bold mb-3">Required Skills</h3>
                <div className="flex flex-wrap gap-2 mb-6">
                  {job.skills_required.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 rounded-lg bg-gray-800 text-gray-300 text-sm font-bold"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-800">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Timeline</p>
                    <p className="font-bold">{job.timeline}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Payment Type</p>
                    <p className="font-bold capitalize">{job.payment_method}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Applicants</p>
                    <p className="font-bold">{job.applicants_count}</p>
                  </div>
                  {job.escrow_required && (
                    <div className="col-span-1">
                      <p className="text-xs text-gray-500 mb-1">Escrow</p>
                      <p className="font-bold text-cyan-400">✓ Required</p>
                    </div>
                  )}
                  {job.portfolio_required && (
                    <div className="col-span-1">
                      <p className="text-xs text-gray-500 mb-1">Portfolio</p>
                      <p className="font-bold text-cyan-400">✓ Required</p>
                    </div>
                  )}
                  {job.verification_required && (
                    <div className="col-span-1">
                      <p className="text-xs text-gray-500 mb-1">Verification</p>
                      <p className="font-bold text-cyan-400">✓ Required</p>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Budget Card */}
              <Card variant="elevated" className="mb-6 bg-blue-900/20 border-blue-700/30">
                <p className="text-xs text-gray-400 mb-1">Budget</p>
                <p className="text-3xl font-black text-blue-300 mb-4">
                  ${job.budget.toLocaleString()} - ${job.budget_max.toLocaleString()}
                </p>
                <Button
                  variant="primary"
                  fullWidth
                  onClick={() => setShowApplyForm(true)}
                  disabled={job.status !== 'open'}
                >
                  {job.status === 'open' ? 'Apply Now' : 'Job Filled'}
                </Button>
              </Card>

              {/* Client Card */}
              <Card variant="default" className="mb-6">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <span className="text-2xl">👤</span>
                  Client
                </h3>

                <p className="font-bold text-lg mb-1">{job.client_name}</p>

                <div className="flex items-center gap-2 mb-4">
                  <span className="text-sm">
                    {'⭐'.repeat(Math.floor(job.client_rating))}
                    <span className="text-gray-600">
                      {'⭐'.repeat(5 - Math.floor(job.client_rating))}
                    </span>
                  </span>
                  <span className="text-sm text-gray-400">
                    {job.client_rating.toFixed(1)} ({job.client_reviews} reviews)
                  </span>
                </div>

                <div className="space-y-2 text-sm mb-4">
                  <p className="text-gray-400">
                    ✓ {job.client_completed_jobs} jobs completed
                  </p>
                  <p className="text-gray-400">
                    ✓ {job.client_reviews} verified reviews
                  </p>
                </div>

                <Button variant="outline" fullWidth size="sm">
                  View Profile
                </Button>
              </Card>

              {/* Requirements */}
              <Card variant="default">
                <h3 className="font-bold mb-4">Requirements</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2 text-sm">
                    <span className={job.portfolio_required ? 'text-cyan-400' : 'text-gray-600'}>
                      {job.portfolio_required ? '✓' : '○'}
                    </span>
                    <span>Portfolio</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <span className={job.verification_required ? 'text-cyan-400' : 'text-gray-600'}>
                      {job.verification_required ? '✓' : '○'}
                    </span>
                    <span>Verified Profile</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <span className={job.escrow_required ? 'text-cyan-400' : 'text-gray-600'}>
                      {job.escrow_required ? '✓' : '○'}
                    </span>
                    <span>Escrow Enabled</span>
                  </li>
                </ul>
              </Card>
            </div>
          </div>

          {/* Apply Form Modal */}
          {showApplyForm && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <Card variant="elevated" className="max-w-2xl w-full">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Submit Your Proposal</h2>
                  <button
                    onClick={() => setShowApplyForm(false)}
                    className="text-gray-400 hover:text-white text-2xl"
                  >
                    ✕
                  </button>
                </div>

                {error && (
                  <div className="mb-4 p-3 rounded-lg bg-red-900/20 border border-red-700/30 text-red-400 text-sm">
                    {error}
                  </div>
                )}

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">
                      Cover Letter *
                    </label>
                    <textarea
                      value={applyCoverLetter}
                      onChange={(e) => setApplyCoverLetter(e.target.value)}
                      placeholder="Tell the client why you're the perfect fit for this job..."
                      className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none h-32"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">
                        Your Rate ($/hr) *
                      </label>
                      <input
                        type="number"
                        value={applyRate}
                        onChange={(e) => setApplyRate(e.target.value)}
                        placeholder="Enter your rate"
                        className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">
                        Timeline *
                      </label>
                      <select
                        value={applyTimeline}
                        onChange={(e) => setApplyTimeline(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-blue-500"
                      >
                        <option value="">Select timeline</option>
                        <option value="1_week">1 Week</option>
                        <option value="2_weeks">2 Weeks</option>
                        <option value="1_month">1 Month</option>
                        <option value="2_months">2 Months</option>
                        <option value="3_months">3 Months</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="primary"
                    fullWidth
                    loading={applyLoading}
                    onClick={handleApply}
                  >
                    Submit Proposal
                  </Button>
                  <Button
                    variant="secondary"
                    fullWidth
                    onClick={() => setShowApplyForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </Card>
            </div>
          )}
        </div>
      </main>
    </ProtectedRoute>
  );
}
