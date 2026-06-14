'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Button, LoadingSpinner, ErrorBanner, EmptyState, Card } from '@/components/ui';

interface Job {
  job_id: string;
  title: string;
  description: string;
  budget: number;
  budget_max: number;
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  skills_required: string[];
  category: string;
  experience_level: 'entry' | 'intermediate' | 'expert';
  client_name: string;
  client_rating: number;
  applicants_count: number;
  created_at: string;
  deadline: string;
  urgent: boolean;
  ai_match_score?: number;
}

type FilterSort = 'recent' | 'budget_high' | 'budget_low' | 'rating' | 'ai_match';
type FilterStatus = 'all' | 'open' | 'in_progress';
type FilterLevel = 'all' | 'entry' | 'intermediate' | 'expert';

export default function JobsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Data
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState<FilterLevel>('all');
  const [selectedStatus, setSelectedStatus] = useState<FilterStatus>('open');
  const [budgetMin, setBudgetMin] = useState(0);
  const [budgetMax, setBudgetMax] = useState(50000);
  const [sortBy, setSortBy] = useState<FilterSort>('recent');
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    loadJobs();
  }, []);

  // Apply filters when any filter changes
  useEffect(() => {
    applyFilters();
  }, [
    jobs,
    searchQuery,
    selectedCategory,
    selectedLevel,
    selectedStatus,
    budgetMin,
    budgetMax,
    sortBy,
  ]);

  async function loadJobs() {
    try {
      setLoading(true);
      const token = localStorage.getItem('veritas_token');
      
      if (!token) {
        router.push('/auth');
        return;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/jobs`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) {
        if (res.status === 401) {
          localStorage.removeItem('veritas_token');
          router.push('/auth');
          return;
        }
        throw new Error('Failed to load jobs');
      }

      const data = await res.json();
      setJobs(data.data || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load jobs');
      console.error('Jobs load error:', err);
    } finally {
      setLoading(false);
    }
  }

  function applyFilters() {
    let filtered = jobs.filter((job) => {
      // Status filter
      if (selectedStatus !== 'all' && job.status !== selectedStatus) {
        return false;
      }

      // Search query
      if (searchQuery && !job.title.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      // Category filter
      if (selectedCategory !== 'all' && job.category !== selectedCategory) {
        return false;
      }

      // Level filter
      if (selectedLevel !== 'all' && job.experience_level !== selectedLevel) {
        return false;
      }

      // Budget filter
      if (job.budget < budgetMin || job.budget_max > budgetMax) {
        return false;
      }

      return true;
    });

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'budget_high':
          return b.budget_max - a.budget_max;
        case 'budget_low':
          return a.budget - b.budget;
        case 'rating':
          return b.client_rating - a.client_rating;
        case 'ai_match':
          return (b.ai_match_score || 0) - (a.ai_match_score || 0);
        default:
          return 0;
      }
    });

    setFilteredJobs(filtered);
  }

  const categories = [
    'All',
    'Web Development',
    'Mobile App',
    'Design',
    'Writing',
    'Data Science',
    'Blockchain',
    'AI/ML',
    'DevOps',
    'QA Testing',
  ];

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading available jobs..." />;
  }

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-gray-900 text-white">
        {error && (
          <ErrorBanner message={error} onRetry={loadJobs} />
        )}

        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900/80 to-gray-900/80 border-b border-gray-800 sticky top-0 z-30 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h1 className="text-3xl sm:text-4xl font-black">💼 Marketplace</h1>
                <p className="text-gray-400 text-sm mt-1">
                  {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'} available
                </p>
              </div>

              <Button
                variant="primary"
                size="lg"
                onClick={() => router.push('/jobs/new')}
                className="w-full sm:w-auto"
              >
                + Post a Job
              </Button>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search jobs by title or skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 sm:py-4 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                🔍
              </span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gray-900/40 border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            {/* Quick Filters */}
            <div className="mb-4">
              <div className="flex flex-wrap gap-2 mb-4">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as FilterStatus)}
                  className="px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="open">Open Only</option>
                  <option value="in_progress">In Progress</option>
                </select>

                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value as FilterLevel)}
                  className="px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-blue-500"
                >
                  <option value="all">All Levels</option>
                  <option value="entry">Entry Level</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="expert">Expert</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as FilterSort)}
                  className="px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-blue-500"
                >
                  <option value="recent">Most Recent</option>
                  <option value="ai_match">AI Match Score</option>
                  <option value="budget_high">Highest Budget</option>
                  <option value="budget_low">Lowest Budget</option>
                  <option value="rating">Top Rated</option>
                </select>

                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white text-sm font-bold transition-all"
                >
                  {showAdvanced ? '✕ Advanced' : '⚙️ Advanced'}
                </button>
              </div>

              {/* Advanced Filters */}
              {showAdvanced && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-gray-800/30 rounded-xl border border-gray-700 mb-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-2">
                      Category
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-blue-500"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat.toLowerCase().replace(' ', '_')}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-2">
                      Min Budget: ${budgetMin}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="50000"
                      step="500"
                      value={budgetMin}
                      onChange={(e) => setBudgetMin(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-2">
                      Max Budget: ${budgetMax}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="50000"
                      step="500"
                      value={budgetMax}
                      onChange={(e) => setBudgetMax(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  <div className="flex items-end">
                    <Button
                      variant="outline"
                      size="md"
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory('all');
                        setSelectedLevel('all');
                        setBudgetMin(0);
                        setBudgetMax(50000);
                        setSortBy('recent');
                      }}
                      fullWidth
                    >
                      Reset Filters
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Jobs Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {filteredJobs.length === 0 ? (
            <EmptyState
              icon="🔍"
              title={searchQuery ? 'No jobs match your search' : 'No jobs available'}
              description={
                searchQuery
                  ? 'Try adjusting your search criteria'
                  : 'Check back soon for new opportunities'
              }
              actionLabel="Clear Filters"
              onAction={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedLevel('all');
              }}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredJobs.map((job) => (
                <JobCard key={job.job_id} job={job} onApply={() => {}} />
              ))}
            </div>
          )}
        </div>
      </main>
    </ProtectedRoute>
  );
}

// Job Card Component
function JobCard({ job, onApply }: { job: Job; onApply: () => void }) {
  const router = useRouter();
  
  const getBudgetDisplay = () => {
    if (job.budget === job.budget_max) {
      return `$${job.budget.toLocaleString()}`;
    }
    return `$${job.budget.toLocaleString()} - $${job.budget_max.toLocaleString()}`;
  };

  const getUrgencyBadge = () => {
    if (job.urgent) {
      return (
        <span className="px-3 py-1 rounded-full bg-red-900/30 text-red-400 text-xs font-bold">
          🔥 Urgent
        </span>
      );
    }
    return null;
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'entry':
        return 'bg-green-900/30 text-green-400';
      case 'intermediate':
        return 'bg-blue-900/30 text-blue-400';
      case 'expert':
        return 'bg-purple-900/30 text-purple-400';
      default:
        return 'bg-gray-700 text-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-green-900/30 text-green-400';
      case 'in_progress':
        return 'bg-blue-900/30 text-blue-400';
      case 'completed':
        return 'bg-gray-700 text-gray-300';
      default:
        return 'bg-gray-700 text-gray-300';
    }
  };

  const daysPosted = Math.floor(
    (new Date().getTime() - new Date(job.created_at).getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <Card variant="default" hover className="flex flex-col h-full">
      {/* Header */}
      <div className="flex justify-between items-start gap-2 mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-bold mb-1 line-clamp-2">{job.title}</h3>
          <p className="text-xs text-gray-400">
            By <span className="font-bold text-cyan-400">{job.client_name}</span>
          </p>
        </div>
        {getUrgencyBadge()}
      </div>

      {/* Client Rating */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm">
          {'⭐'.repeat(Math.floor(job.client_rating))}
          <span className="text-gray-500">
            {'⭐'.repeat(5 - Math.floor(job.client_rating))}
          </span>
        </span>
        <span className="text-xs text-gray-400">
          {job.client_rating.toFixed(1)} ({job.applicants_count} applications)
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-300 line-clamp-3 mb-4 flex-grow">
        {job.description}
      </p>

      {/* Skills */}
      {job.skills_required.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {job.skills_required.slice(0, 3).map((skill) => (
            <span
              key={skill}
              className="px-2 py-1 rounded-md bg-gray-800 text-gray-300 text-xs"
            >
              {skill}
            </span>
          ))}
          {job.skills_required.length > 3 && (
            <span className="px-2 py-1 text-gray-500 text-xs">
              +{job.skills_required.length - 3} more
            </span>
          )}
        </div>
      )}

      {/* Meta */}
      <div className="flex flex-wrap gap-2 mb-4 text-xs">
        <span className={`px-2 py-1 rounded-full ${getLevelColor(job.experience_level)}`}>
          {job.experience_level.charAt(0).toUpperCase() + job.experience_level.slice(1)}
        </span>
        <span className={`px-2 py-1 rounded-full ${getStatusColor(job.status)}`}>
          {job.status === 'open' ? '✓ Open' : job.status.replace('_', ' ').toUpperCase()}
        </span>
        <span className="px-2 py-1 rounded-full bg-gray-700 text-gray-300">
          {daysPosted} days ago
        </span>
      </div>

      {/* AI Match Score */}
      {job.ai_match_score !== undefined && (
        <div className="mb-4 p-3 rounded-lg bg-cyan-900/20 border border-cyan-700/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-cyan-400">AI Match Score</span>
            <span className="text-lg font-black text-cyan-300">{job.ai_match_score}%</span>
          </div>
          <div className="mt-2 h-1.5 rounded-full bg-gray-700 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all"
              style={{ width: `${job.ai_match_score}%` }}
            />
          </div>
        </div>
      )}

      {/* Budget & CTA */}
      <div className="flex items-center justify-between mt-auto">
        <div className="text-xl font-black text-cyan-400">
          {getBudgetDisplay()}
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => router.push(`/jobs/${job.job_id}`)}
        >
          View Job
        </Button>
      </div>
    </Card>
  );
}
