'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Button, LoadingSpinner, ErrorBanner, Card } from '@/components/ui';

const CATEGORIES = [
  'Web Development',
  'Mobile App',
  'Design',
  'Writing',
  'Data Science',
  'Blockchain',
  'AI/ML',
  'DevOps',
  'QA Testing',
  'Other',
];

const SKILLS_SUGGESTIONS = [
  'React',
  'Node.js',
  'Python',
  'Solidity',
  'TypeScript',
  'Vue.js',
  'Django',
  'PostgreSQL',
  'AWS',
  'Docker',
  'Figma',
  'Next.js',
  'Smart Contracts',
  'Web3',
  'Blockchain',
];

export default function PostJobPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(1);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Web Development');
  const [budgetMin, setBudgetMin] = useState(500);
  const [budgetMax, setBudgetMax] = useState(5000);
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('intermediate');
  const [timeline, setTimeline] = useState('2_weeks');
  const [urgent, setUrgent] = useState(false);
  const [escrowRequired, setEscrowRequired] = useState(true);
  const [portfolioRequired, setPortfolioRequired] = useState(false);
  const [verificationRequired, setVerificationRequired] = useState(false);
  const [deliverables, setDeliverables] = useState<string[]>([]);
  const [deliverableInput, setDeliverableInput] = useState('');

  const addSkill = (skill: string) => {
    if (!skills.includes(skill)) {
      setSkills([...skills, skill]);
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const addDeliverable = (deliverable: string) => {
    if (deliverable.trim()) {
      setDeliverables([...deliverables, deliverable.trim()]);
      setDeliverableInput('');
    }
  };

  const removeDeliverable = (index: number) => {
    setDeliverables(deliverables.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!title || !description || skills.length === 0) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('veritas_token');

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/jobs/create`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title,
            description,
            category,
            budget: budgetMin,
            budget_max: budgetMax,
            skills_required: skills,
            experience_level: experienceLevel,
            timeline,
            urgent,
            escrow_required: escrowRequired,
            portfolio_required: portfolioRequired,
            verification_required: verificationRequired,
            deliverables,
          }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to create job');
      }

      const data = await res.json();
      router.push(`/jobs/${data.data.job_id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create job');
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-gray-900 text-white">
        {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <Button
              variant="secondary"
              onClick={() => router.back()}
              className="mb-4"
            >
              ← Back
            </Button>
            <h1 className="text-3xl sm:text-4xl font-black mb-2">Post a Job</h1>
            <p className="text-gray-400">
              Fill in the details to find the perfect freelancer
            </p>
          </div>

          {/* Progress */}
          <div className="mb-8 flex gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`flex-1 h-2 rounded-full transition-all ${
                  s <= step ? 'bg-blue-500' : 'bg-gray-700'
                }`}
              />
            ))}
          </div>

          {/* Step 1: Basic Info */}
          {step === 1 && (
            <Card variant="elevated" className="mb-8">
              <h2 className="text-2xl font-bold mb-6">Job Details</h2>

              <div className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Build a React Dashboard for Analytics"
                    className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">
                    Detailed Description *
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe what you need built, your vision, and any specific requirements..."
                    className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none h-32"
                  />
                </div>

                {/* Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">
                      Category *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-blue-500"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">
                      Experience Level *
                    </label>
                    <select
                      value={experienceLevel}
                      onChange={(e) => setExperienceLevel(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="entry">Entry Level</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="expert">Expert</option>
                    </select>
                  </div>
                </div>

                {/* Budget */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">
                      Budget Min: ${budgetMin}
                    </label>
                    <input
                      type="range"
                      min="100"
                      max="50000"
                      step="100"
                      value={budgetMin}
                      onChange={(e) => setBudgetMin(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">
                      Budget Max: ${budgetMax}
                    </label>
                    <input
                      type="range"
                      min="100"
                      max="50000"
                      step="100"
                      value={budgetMax}
                      onChange={(e) => setBudgetMax(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <Button
                  variant="primary"
                  fullWidth
                  onClick={() => {
                    if (!title || !description) {
                      setError('Please fill in all fields');
                      return;
                    }
                    setStep(2);
                  }}
                >
                  Next: Requirements →
                </Button>
              </div>
            </Card>
          )}

          {/* Step 2: Requirements */}
          {step === 2 && (
            <Card variant="elevated" className="mb-8">
              <h2 className="text-2xl font-bold mb-6">Required Skills & Timeline</h2>

              <div className="space-y-6">
                {/* Skills */}
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">
                    Required Skills *
                  </label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addSkill(skillInput);
                        }
                      }}
                      placeholder="Type a skill and press Enter..."
                      className="flex-1 px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                    />
                    <Button
                      variant="secondary"
                      onClick={() => addSkill(skillInput)}
                    >
                      Add
                    </Button>
                  </div>

                  {/* Suggested Skills */}
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-2">Suggested:</p>
                    <div className="flex flex-wrap gap-2">
                      {SKILLS_SUGGESTIONS.filter(
                        (s) => !skills.includes(s)
                      ).map((skill) => (
                        <button
                          key={skill}
                          onClick={() => addSkill(skill)}
                          className="px-3 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm transition-all"
                        >
                          + {skill}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Selected Skills */}
                  {skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 p-4 bg-gray-800/30 rounded-lg border border-gray-700">
                      {skills.map((skill) => (
                        <div
                          key={skill}
                          className="px-3 py-1 rounded-lg bg-blue-900/30 text-blue-400 text-sm font-bold flex items-center gap-2"
                        >
                          {skill}
                          <button
                            onClick={() => removeSkill(skill)}
                            className="text-blue-300 hover:text-blue-200"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Timeline */}
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">
                    Timeline
                  </label>
                  <select
                    value={timeline}
                    onChange={(e) => setTimeline(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="1_week">1 Week</option>
                    <option value="2_weeks">2 Weeks</option>
                    <option value="1_month">1 Month</option>
                    <option value="2_months">2 Months</option>
                    <option value="3_months">3 Months</option>
                  </select>
                </div>

                {/* Deliverables */}
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">
                    Deliverables
                  </label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={deliverableInput}
                      onChange={(e) => setDeliverableInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addDeliverable(deliverableInput);
                        }
                      }}
                      placeholder="e.g., Responsive UI components..."
                      className="flex-1 px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                    />
                    <Button
                      variant="secondary"
                      onClick={() => addDeliverable(deliverableInput)}
                    >
                      Add
                    </Button>
                  </div>

                  {deliverables.length > 0 && (
                    <div className="space-y-2 p-4 bg-gray-800/30 rounded-lg border border-gray-700">
                      {deliverables.map((item, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between bg-gray-800 px-3 py-2 rounded-lg"
                        >
                          <span className="text-gray-300">{item}</span>
                          <button
                            onClick={() => removeDeliverable(i)}
                            className="text-gray-500 hover:text-white"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <Button variant="secondary" fullWidth onClick={() => setStep(1)}>
                  ← Back
                </Button>
                <Button
                  variant="primary"
                  fullWidth
                  onClick={() => {
                    if (skills.length === 0) {
                      setError('Please add at least one required skill');
                      return;
                    }
                    setStep(3);
                  }}
                >
                  Next: Options →
                </Button>
              </div>
            </Card>
          )}

          {/* Step 3: Options */}
          {step === 3 && (
            <Card variant="elevated" className="mb-8">
              <h2 className="text-2xl font-bold mb-6">Job Options</h2>

              <div className="space-y-4 mb-8">
                {/* Urgent */}
                <label className="flex items-center gap-3 p-4 rounded-lg bg-gray-800/30 border border-gray-700 cursor-pointer hover:bg-gray-800/50 transition-all">
                  <input
                    type="checkbox"
                    checked={urgent}
                    onChange={(e) => setUrgent(e.target.checked)}
                    className="w-5 h-5 accent-blue-500 cursor-pointer"
                  />
                  <div>
                    <p className="font-bold">🔥 Mark as Urgent</p>
                    <p className="text-sm text-gray-400">
                      Gets higher visibility and attracts top talent faster
                    </p>
                  </div>
                </label>

                {/* Escrow Required */}
                <label className="flex items-center gap-3 p-4 rounded-lg bg-gray-800/30 border border-gray-700 cursor-pointer hover:bg-gray-800/50 transition-all">
                  <input
                    type="checkbox"
                    checked={escrowRequired}
                    onChange={(e) => setEscrowRequired(e.target.checked)}
                    className="w-5 h-5 accent-blue-500 cursor-pointer"
                  />
                  <div>
                    <p className="font-bold">💰 Require Escrow</p>
                    <p className="text-sm text-gray-400">
                      Protects both you and the freelancer. Funds held in escrow until
                      project completion
                    </p>
                  </div>
                </label>

                {/* Portfolio Required */}
                <label className="flex items-center gap-3 p-4 rounded-lg bg-gray-800/30 border border-gray-700 cursor-pointer hover:bg-gray-800/50 transition-all">
                  <input
                    type="checkbox"
                    checked={portfolioRequired}
                    onChange={(e) => setPortfolioRequired(e.target.checked)}
                    className="w-5 h-5 accent-blue-500 cursor-pointer"
                  />
                  <div>
                    <p className="font-bold">📂 Require Portfolio</p>
                    <p className="text-sm text-gray-400">
                      Only freelancers with verified portfolios can apply
                    </p>
                  </div>
                </label>

                {/* Verification Required */}
                <label className="flex items-center gap-3 p-4 rounded-lg bg-gray-800/30 border border-gray-700 cursor-pointer hover:bg-gray-800/50 transition-all">
                  <input
                    type="checkbox"
                    checked={verificationRequired}
                    onChange={(e) => setVerificationRequired(e.target.checked)}
                    className="w-5 h-5 accent-blue-500 cursor-pointer"
                  />
                  <div>
                    <p className="font-bold">✓ Require Identity Verification</p>
                    <p className="text-sm text-gray-400">
                      Only verified freelancers can apply to this job
                    </p>
                  </div>
                </label>
              </div>

              {/* Summary */}
              <Card variant="default" className="mb-8 bg-blue-900/20 border-blue-700/30">
                <h3 className="font-bold text-lg mb-4 text-blue-300">Job Summary</h3>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="text-gray-400">Title:</span> <span className="font-bold">{title}</span>
                  </p>
                  <p>
                    <span className="text-gray-400">Budget:</span>{' '}
                    <span className="font-bold">
                      ${budgetMin} - ${budgetMax}
                    </span>
                  </p>
                  <p>
                    <span className="text-gray-400">Skills:</span>{' '}
                    <span className="font-bold">{skills.join(', ')}</span>
                  </p>
                  <p>
                    <span className="text-gray-400">Requirements:</span>{' '}
                    <span className="font-bold">
                      {[
                        escrowRequired && 'Escrow',
                        portfolioRequired && 'Portfolio',
                        verificationRequired && 'Verification',
                      ]
                        .filter(Boolean)
                        .join(', ') || 'None'}
                    </span>
                  </p>
                </div>
              </Card>

              <div className="flex gap-3">
                <Button variant="secondary" fullWidth onClick={() => setStep(2)}>
                  ← Back
                </Button>
                <Button
                  variant="primary"
                  fullWidth
                  loading={loading}
                  onClick={handleSubmit}
                >
                  {loading ? 'Creating Job...' : 'Post Job'}
                </Button>
              </div>
            </Card>
          )}
        </div>
      </main>
    </ProtectedRoute>
  );
}
