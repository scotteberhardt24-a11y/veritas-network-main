'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiLogin, apiRegister } from '@/lib/api';
import { Button, LoadingSpinner, ErrorBanner } from '@/components/ui';

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Login form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup form
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [signupRole, setSignupRole] = useState<'worker' | 'client'>('worker');

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!loginEmail || !loginPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (!validateEmail(loginEmail)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);

    const res = await apiLogin(loginEmail, loginPassword);

    if (res.status === 'ok') {
      localStorage.setItem('veritas_token', res.data.token);
      router.push('/dashboard');
    } else {
      setError(res.error || 'Login failed. Please try again.');
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!signupName || !signupEmail || !signupPassword || !signupConfirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (!validateEmail(signupEmail)) {
      setError('Please enter a valid email address');
      return;
    }

    if (signupPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (signupPassword !== signupConfirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    const res = await apiRegister(
      signupName,
      signupEmail,
      signupPassword,
      signupRole
    );

    if (res.status === 'ok') {
      // Auto login after signup
      const loginRes = await apiLogin(signupEmail, signupPassword);
      if (loginRes.status === 'ok') {
        localStorage.setItem('veritas_token', loginRes.data.token);
        router.push('/onboarding');
      } else {
        setError('Account created! Please log in.');
        setIsLogin(true);
        setLoading(false);
      }
    } else {
      setError(res.error || 'Signup failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-gray-900 text-white flex items-center justify-center p-4">
      {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}

      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black mb-2">🛡️ Veritas</h1>
          <p className="text-gray-400">Trust Ledger</p>
        </div>

        <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-8 sm:p-10">
          {/* Tabs */}
          <div className="flex gap-4 mb-8">
            <button
              onClick={() => {
                setIsLogin(true);
                setError(null);
              }}
              className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                isLogin
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => {
                setIsLogin(false);
                setError(null);
              }}
              className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                !isLogin
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* LOGIN FORM */}
          {isLogin && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <Button
                type="submit"
                loading={loading}
                fullWidth
                size="lg"
                className="mt-6"
              >
                {loading ? 'Logging in...' : 'Login'}
              </Button>

              <div className="text-center pt-4">
                <a
                  href="/forgot-password"
                  className="text-sm text-blue-400 hover:text-blue-300 transition"
                >
                  Forgot password?
                </a>
              </div>
            </form>
          )}

          {/* SIGNUP FORM */}
          {!isLogin && (
            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">
                  I am a
                </label>
                <select
                  value={signupRole}
                  onChange={(e) => setSignupRole(e.target.value as 'worker' | 'client')}
                  className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-blue-500 transition-colors"
                >
                  <option value="worker">Worker (Freelancer)</option>
                  <option value="client">Client (Hiring)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
                <p className="text-xs text-gray-500 mt-1">At least 8 characters</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={signupConfirmPassword}
                  onChange={(e) => setSignupConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <Button
                type="submit"
                loading={loading}
                fullWidth
                size="lg"
                className="mt-6"
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>
          )}
        </div>

        <p className="text-center text-gray-500 text-sm mt-6">
          By signing up, you agree to our{' '}
          <a href="/privacy" className="text-blue-400 hover:text-blue-300">
            Privacy Policy
          </a>
        </p>
      </div>
    </main>
  );
}
