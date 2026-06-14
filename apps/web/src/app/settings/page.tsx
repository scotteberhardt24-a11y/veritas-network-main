'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Button, LoadingSpinner, Card, ErrorBanner } from '@/components/ui';

interface UserSettings {
  user_id: string;
  profile: {
    name: string;
    email: string;
    bio: string;
    avatar_url: string;
    location: string;
    website: string;
  };
  preferences: {
    notifications_enabled: boolean;
    email_digest: 'daily' | 'weekly' | 'never';
    show_profile_publicly: boolean;
    allow_direct_messages: boolean;
    language: string;
    timezone: string;
  };
  security: {
    two_factor_enabled: boolean;
    last_password_change: string;
    active_sessions: number;
    trusted_devices: string[];
  };
  payments: {
    stripe_connected: boolean;
    stripe_account_id?: string;
    payout_method: 'stripe' | 'crypto' | 'both';
    crypto_wallet_address?: string;
  };
  billing: {
    subscription_tier: 'free' | 'pro' | 'enterprise';
    subscription_status: 'active' | 'cancelled' | 'past_due';
    renewal_date: string;
    auto_renew: boolean;
  };
}

type Tab = 'profile' | 'preferences' | 'security' | 'payments' | 'billing';

export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [settings, setSettings] = useState<UserSettings | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    location: '',
    website: '',
  });

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      const token = localStorage.getItem('veritas_token');
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/me/settings`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error('Failed to load settings');

      const data = await res.json();
      setSettings(data.data);
      setFormData({
        name: data.data.profile.name,
        email: data.data.profile.email,
        bio: data.data.profile.bio,
        location: data.data.profile.location,
        website: data.data.profile.website,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveProfile() {
    try {
      setSaving(true);
      const token = localStorage.getItem('veritas_token');

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/me/profile`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        }
      );

      if (!res.ok) throw new Error('Failed to save profile');

      setSuccess('Profile updated successfully!');
      loadSettings();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading settings..." />;
  }

  if (!settings) {
    return (
      <ProtectedRoute>
        <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-gray-900 text-white p-4">
          <ErrorBanner message={error || 'Settings not available'} />
        </main>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <Button
              variant="secondary"
              onClick={() => router.back()}
              className="mb-4"
            >
              ← Back
            </Button>
            <h1 className="text-3xl sm:text-4xl font-black mb-2">⚙️ Settings</h1>
            <p className="text-gray-400">Manage your account and preferences</p>
          </div>

          {error && (
            <ErrorBanner
              message={error}
              onDismiss={() => setError(null)}
            />
          )}

          {success && (
            <div className="mb-6 p-4 rounded-xl bg-green-900/20 border border-green-700/30 text-green-400">
              ✓ {success}
            </div>
          )}

          {/* Tabs */}
          <div className="flex gap-2 mb-8 border-b border-gray-800 overflow-x-auto">
            {(['profile', 'preferences', 'security', 'payments', 'billing'] as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 font-bold border-b-2 transition-all whitespace-nowrap ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                {tab === 'profile' && '👤 Profile'}
                {tab === 'preferences' && '🎯 Preferences'}
                {tab === 'security' && '🔒 Security'}
                {tab === 'payments' && '💳 Payments'}
                {tab === 'billing' && '📋 Billing'}
              </button>
            ))}
          </div>

          {/* Content */}
          {activeTab === 'profile' && (
            <ProfileTab
              formData={formData}
              setFormData={setFormData}
              saving={saving}
              onSave={handleSaveProfile}
            />
          )}

          {activeTab === 'preferences' && (
            <PreferencesTab settings={settings} />
          )}

          {activeTab === 'security' && (
            <SecurityTab settings={settings} />
          )}

          {activeTab === 'payments' && (
            <PaymentsTab settings={settings} />
          )}

          {activeTab === 'billing' && (
            <BillingTab settings={settings} />
          )}
        </div>
      </main>
    </ProtectedRoute>
  );
}

function ProfileTab({
  formData,
  setFormData,
  saving,
  onSave,
}: {
  formData: any;
  setFormData: any;
  saving: boolean;
  onSave: () => void;
}) {
  return (
    <Card variant="elevated" className="max-w-2xl">
      <h2 className="text-2xl font-bold mb-6">Profile Information</h2>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-bold text-gray-300 mb-2">
            Full Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-300 mb-2">
            Email
          </label>
          <input
            type="email"
            value={formData.email}
            disabled
            className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 text-gray-500 cursor-not-allowed"
          />
          <p className="text-xs text-gray-500 mt-1">
            Contact support to change email
          </p>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-300 mb-2">
            Bio
          </label>
          <textarea
            value={formData.bio}
            onChange={(e) =>
              setFormData({ ...formData, bio: e.target.value })
            }
            placeholder="Tell clients about yourself..."
            className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none h-24"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-300 mb-2">
            Location
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
            placeholder="City, Country"
            className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-300 mb-2">
            Website
          </label>
          <input
            type="url"
            value={formData.website}
            onChange={(e) =>
              setFormData({ ...formData, website: e.target.value })
            }
            placeholder="https://..."
            className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      <Button
        variant="primary"
        fullWidth
        loading={saving}
        onClick={onSave}
      >
        Save Profile
      </Button>
    </Card>
  );
}

function PreferencesTab({ settings }: { settings: UserSettings }) {
  return (
    <Card variant="elevated" className="max-w-2xl space-y-6">
      <h2 className="text-2xl font-bold">Preferences</h2>

      <div>
        <label className="flex items-center gap-3 p-4 rounded-lg bg-gray-800/30 border border-gray-700 cursor-pointer hover:bg-gray-800/50 transition-all">
          <input
            type="checkbox"
            checked={settings.preferences.notifications_enabled}
            className="w-5 h-5 accent-blue-500"
          />
          <div>
            <p className="font-bold">Enable Notifications</p>
            <p className="text-sm text-gray-400">Receive updates about your account</p>
          </div>
        </label>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-300 mb-3">
          Email Digest
        </label>
        <select className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-blue-500">
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="never">Never</option>
        </select>
      </div>

      <div>
        <label className="flex items-center gap-3 p-4 rounded-lg bg-gray-800/30 border border-gray-700 cursor-pointer hover:bg-gray-800/50 transition-all">
          <input
            type="checkbox"
            checked={settings.preferences.show_profile_publicly}
            className="w-5 h-5 accent-blue-500"
          />
          <div>
            <p className="font-bold">Show Profile Publicly</p>
            <p className="text-sm text-gray-400">Allow others to view your profile</p>
          </div>
        </label>
      </div>

      <Button variant="primary" fullWidth>
        Save Preferences
      </Button>
    </Card>
  );
}

function SecurityTab({ settings }: { settings: UserSettings }) {
  return (
    <Card variant="elevated" className="max-w-2xl space-y-6">
      <h2 className="text-2xl font-bold">Security</h2>

      <div className="p-4 rounded-lg bg-blue-900/20 border border-blue-700/30">
        <p className="font-bold text-blue-300 mb-2">Two-Factor Authentication</p>
        <p className="text-sm text-blue-200 mb-3">
          {settings.security.two_factor_enabled
            ? '✓ Enabled'
            : 'Not enabled'}
        </p>
        <Button variant="outline" size="sm">
          {settings.security.two_factor_enabled ? 'Disable' : 'Enable'} 2FA
        </Button>
      </div>

      <div>
        <p className="text-sm font-bold text-gray-300 mb-3">
          Active Sessions: {settings.security.active_sessions}
        </p>
        <Button variant="secondary" fullWidth>
          Sign Out All Other Sessions
        </Button>
      </div>

      <div>
        <Button
          variant="danger"
          fullWidth
          onClick={() =>
            alert(
              'Password change functionality would open a modal in production'
            )
          }
        >
          Change Password
        </Button>
      </div>
    </Card>
  );
}

function PaymentsTab({ settings }: { settings: UserSettings }) {
  return (
    <Card variant="elevated" className="max-w-2xl space-y-6">
      <h2 className="text-2xl font-bold">Payment Methods</h2>

      <div className="p-4 rounded-lg bg-gray-800/30 border border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="font-bold">💳 Stripe Connected</p>
            <p className="text-sm text-gray-400">
              {settings.payments.stripe_connected ? 'Connected' : 'Not connected'}
            </p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
            settings.payments.stripe_connected
              ? 'bg-green-900/30 text-green-400'
              : 'bg-gray-700 text-gray-300'
          }`}>
            {settings.payments.stripe_connected ? 'Active' : 'Inactive'}
          </span>
        </div>
        <Button variant={settings.payments.stripe_connected ? 'secondary' : 'primary'} fullWidth>
          {settings.payments.stripe_connected ? 'Manage' : 'Connect'} Stripe
        </Button>
      </div>

      <div className="p-4 rounded-lg bg-gray-800/30 border border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="font-bold">⛓️ Crypto Wallet</p>
            <p className="text-sm text-gray-400">
              Receive payments in crypto
            </p>
          </div>
        </div>
        <Button variant="outline" fullWidth>
          Connect Wallet
        </Button>
      </div>
    </Card>
  );
}

function BillingTab({ settings }: { settings: UserSettings }) {
  return (
    <Card variant="elevated" className="max-w-2xl space-y-6">
      <h2 className="text-2xl font-bold">Billing</h2>

      <div className="p-4 rounded-lg bg-blue-900/20 border border-blue-700/30">
        <div className="mb-4">
          <p className="text-xs text-blue-400 mb-1">Current Plan</p>
          <p className="text-2xl font-black text-blue-300 capitalize">
            {settings.billing.subscription_tier}
          </p>
        </div>

        <div className="mb-4">
          <p className="text-xs text-blue-400 mb-1">Status</p>
          <p className="font-bold capitalize text-blue-200">
            {settings.billing.subscription_status}
          </p>
        </div>

        <div>
          <p className="text-xs text-blue-400 mb-1">Renewal Date</p>
          <p className="font-bold text-blue-200">
            {new Date(settings.billing.renewal_date).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <Button variant="primary" fullWidth>
          View Plans
        </Button>
        <Button variant="outline" fullWidth>
          Download Invoice
        </Button>
        <Button variant="secondary" fullWidth>
          Cancel Subscription
        </Button>
      </div>
    </Card>
  );
}
