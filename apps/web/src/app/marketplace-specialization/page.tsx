'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Button, LoadingSpinner, Card } from '@/components/ui';

interface Vertical {
  vertical_id: string;
  name: string;
  description: string;
  icon: string;
  jobs_count: number;
  workers_count: number;
  avg_rate: number;
  trending: boolean;
  subcategories: string[];
  verified_badge_url?: string;
}

interface WhiteLabelConfig {
  domain: string;
  brand_name: string;
  logo_url: string;
  primary_color: string;
  secondary_color: string;
  custom_css: string;
  smtp_settings: {
    host: string;
    port: number;
    from_email: string;
    from_name: string;
  };
  stripe_account_id: string;
  api_key: string;
  webhook_url: string;
  custom_fee_structure: {
    platform_fee: number;
    payment_fee: number;
    dispute_fee: number;
  };
  features_enabled: string[];
}

export default function MarketplaceVerticalPage() {
  const [verticals, setVerticals] = useState<Vertical[]>([]);
  const [selectedVertical, setSelectedVertical] = useState<Vertical | null>(null);
  const [whiteLabelConfig, setWhiteLabelConfig] = useState<WhiteLabelConfig | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'verticals' | 'whitelabel'>('verticals');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const token = localStorage.getItem('veritas_token');

      const [verticalsRes, whitelabelRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/marketplace/verticals`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/whitelabel/config`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (verticalsRes.ok) {
        const data = await verticalsRes.json();
        setVerticals(data.data || []);
      }

      if (whitelabelRes.ok) {
        const data = await whitelabelRes.json();
        setWhiteLabelConfig(data.data);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function updateWhiteLabelConfig(config: Partial<WhiteLabelConfig>) {
    try {
      const token = localStorage.getItem('veritas_token');

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/whitelabel/config`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(config),
        }
      );

      if (res.ok) {
        loadData();
        alert('Configuration saved!');
      }
    } catch (error) {
      console.error('Failed to update config:', error);
    }
  }

  async function generateAPIKey() {
    try {
      const token = localStorage.getItem('veritas_token');

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/whitelabel/generate-key`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.ok) {
        const data = await res.json();
        alert(`New API Key: ${data.api_key}`);
        loadData();
      }
    } catch (error) {
      console.error('Failed to generate API key:', error);
    }
  }

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading marketplace data..." />;
  }

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-gray-900 text-white p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-black mb-2">
              🎯 Marketplace Specialization
            </h1>
            <p className="text-gray-400">
              Vertical markets and white-label platform management
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-8 border-b border-gray-800">
            <button
              onClick={() => setTab('verticals')}
              className={`px-4 py-3 font-bold border-b-2 transition-all ${
                tab === 'verticals'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-gray-400'
              }`}
            >
              🏢 Verticals
            </button>
            <button
              onClick={() => setTab('whitelabel')}
              className={`px-4 py-3 font-bold border-b-2 transition-all ${
                tab === 'whitelabel'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-gray-400'
              }`}
            >
              🏷️ White-Label
            </button>
          </div>

          {tab === 'verticals' ? (
            // Verticals Tab
            <>
              {!selectedVertical ? (
                <div className="space-y-4">
                  <h2 className="text-xl font-bold mb-4">
                    Available Specializations
                  </h2>

                  {verticals.map((vertical) => (
                    <Card
                      key={vertical.vertical_id}
                      variant="default"
                      className="cursor-pointer hover:border-blue-500/50 transition-all"
                      onClick={() => setSelectedVertical(vertical)}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex gap-3">
                          <span className="text-3xl">{vertical.icon}</span>

                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-lg font-bold">
                                {vertical.name}
                              </p>
                              {vertical.trending && (
                                <span className="px-2 py-1 rounded text-xs font-bold bg-red-900/30 text-red-400">
                                  🔥 Trending
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-400">
                              {vertical.description}
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-2xl font-black text-cyan-400">
                            {vertical.jobs_count}
                          </p>
                          <p className="text-xs text-gray-400">jobs</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-3">
                        {vertical.subcategories.slice(0, 3).map((sub, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 rounded text-xs bg-gray-800 text-gray-300"
                          >
                            {sub}
                          </span>
                        ))}
                        {vertical.subcategories.length > 3 && (
                          <span className="px-2 py-1 rounded text-xs bg-gray-800 text-gray-300">
                            +{vertical.subcategories.length - 3} more
                          </span>
                        )}
                      </div>

                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-xs text-gray-400 mb-1">
                            Avg Rate
                          </p>
                          <p className="font-bold text-green-400">
                            ${vertical.avg_rate}/hr
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-gray-400 mb-1">Workers</p>
                          <p className="font-bold">
                            {vertical.workers_count}
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                // Vertical Detail
                <div className="space-y-6">
                  <Button
                    variant="secondary"
                    onClick={() => setSelectedVertical(null)}
                    className="mb-4"
                  >
                    ← Back
                  </Button>

                  <Card variant="elevated">
                    <div className="flex gap-4 mb-6">
                      <span className="text-6xl">{selectedVertical.icon}</span>

                      <div className="flex-1">
                        <h2 className="text-3xl font-black mb-2">
                          {selectedVertical.name}
                        </h2>
                        <p className="text-gray-400 mb-4">
                          {selectedVertical.description}
                        </p>

                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <p className="text-xs text-gray-400">Jobs</p>
                            <p className="text-2xl font-black">
                              {selectedVertical.jobs_count}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">Workers</p>
                            <p className="text-2xl font-black">
                              {selectedVertical.workers_count}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">Avg Rate</p>
                            <p className="text-2xl font-black text-green-400">
                              ${selectedVertical.avg_rate}/hr
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {selectedVertical.verified_badge_url && (
                      <div className="p-3 rounded-lg bg-green-900/20 border border-green-700/30 mb-4">
                        <p className="text-xs text-green-400 mb-2">
                          Official Badge
                        </p>
                        <p className="text-sm text-green-200">
                          ✓ Industry-verified professionals only
                        </p>
                      </div>
                    )}

                    <h3 className="font-bold mb-3">Subcategories</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedVertical.subcategories.map((sub, i) => (
                        <span
                          key={i}
                          className="px-3 py-2 rounded-lg bg-blue-900/20 border border-blue-700/30 text-blue-300 text-sm"
                        >
                          {sub}
                        </span>
                      ))}
                    </div>
                  </Card>

                  <Button variant="primary" fullWidth>
                    Specialize in {selectedVertical.name}
                  </Button>
                </div>
              )}
            </>
          ) : (
            // White-Label Tab
            <div className="space-y-6">
              {whiteLabelConfig ? (
                <>
                  <Card variant="elevated">
                    <h2 className="text-2xl font-bold mb-6">
                      🏷️ White-Label Configuration
                    </h2>

                    <div className="space-y-4 mb-6">
                      <div>
                        <label className="block text-sm font-bold text-gray-300 mb-2">
                          Domain
                        </label>
                        <input
                          type="text"
                          value={whiteLabelConfig.domain}
                          className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white"
                          readOnly
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-300 mb-2">
                          Brand Name
                        </label>
                        <input
                          type="text"
                          defaultValue={whiteLabelConfig.brand_name}
                          className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white"
                          onChange={(e) =>
                            updateWhiteLabelConfig({
                              brand_name: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-bold text-gray-300 mb-2">
                            Primary Color
                          </label>
                          <input
                            type="color"
                            defaultValue={whiteLabelConfig.primary_color}
                            className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-gray-300 mb-2">
                            Secondary Color
                          </label>
                          <input
                            type="color"
                            defaultValue={whiteLabelConfig.secondary_color}
                            className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700"
                          />
                        </div>
                      </div>
                    </div>

                    <Button variant="primary" fullWidth className="mb-4">
                      Save Configuration
                    </Button>
                  </Card>

                  <Card variant="default">
                    <h3 className="font-bold mb-4">💳 Payment Settings</h3>

                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-400 mb-1">
                          Stripe Account
                        </p>
                        <p className="font-mono text-sm">
                          {whiteLabelConfig.stripe_account_id}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-400 mb-2">
                          Fee Structure
                        </p>
                        <div className="space-y-1 text-sm">
                          <p>
                            Platform Fee:{' '}
                            {
                              whiteLabelConfig.custom_fee_structure
                                .platform_fee
                            }
                            %
                          </p>
                          <p>
                            Payment Fee:{' '}
                            {whiteLabelConfig.custom_fee_structure.payment_fee}%
                          </p>
                          <p>
                            Dispute Fee:{' '}
                            {whiteLabelConfig.custom_fee_structure.dispute_fee}
                            %
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>

                  <Card variant="default">
                    <h3 className="font-bold mb-4">🔑 API Access</h3>

                    <div className="p-3 rounded-lg bg-gray-800/30 mb-4">
                      <p className="text-xs text-gray-400 mb-2">API Key</p>
                      <p className="font-mono text-xs break-all">
                        {whiteLabelConfig.api_key}
                      </p>
                    </div>

                    <div className="p-3 rounded-lg bg-gray-800/30 mb-4">
                      <p className="text-xs text-gray-400 mb-2">Webhook URL</p>
                      <p className="font-mono text-xs break-all">
                        {whiteLabelConfig.webhook_url}
                      </p>
                    </div>

                    <Button
                      variant="outline"
                      fullWidth
                      onClick={generateAPIKey}
                    >
                      🔄 Regenerate API Key
                    </Button>
                  </Card>

                  <Card variant="default">
                    <h3 className="font-bold mb-4">✨ Features</h3>

                    <div className="space-y-2">
                      {whiteLabelConfig.features_enabled.map((feature, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            defaultChecked={true}
                            className="w-4 h-4 rounded"
                          />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                </>
              ) : (
                <Card variant="default" className="text-center py-12">
                  <p className="text-3xl mb-2">🏷️</p>
                  <p className="font-bold">No white-label configuration</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Contact support to enable white-label
                  </p>
                </Card>
              )}
            </div>
          )}
        </div>
      </main>
    </ProtectedRoute>
  );
}
