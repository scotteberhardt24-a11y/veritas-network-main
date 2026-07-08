'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Button, LoadingSpinner, Card } from '@/components/ui';

interface ReputationPassport {
  nft_id: string;
  owner_address: string;
  token_id: string;
  metadata_uri: string;
  contract_address: string;
  chain: 'polygon' | 'ethereum' | 'arbitrum';
  created_at: string;
  minted_at: string;
  transaction_hash: string;
  verification_level: number;
  truscore: number;
  badges: string[];
  verified_credentials: string[];
}

interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes: Array<{
    trait_type: string;
    value: string | number;
  }>;
  external_url: string;
}

export default function NFTPassportPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [minting, setMinting] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [passport, setPassport] = useState<ReputationPassport | null>(null);
  const [showMintForm, setShowMintForm] = useState(false);

  // Mint NFT Passport
  async function handleMintPassport() {
    if (!walletAddress) {
      alert('Please enter your wallet address');
      return;
    }

    try {
      setMinting(true);
      const token = localStorage.getItem('veritas_token');

      // Step 1: Generate metadata
      const metadataRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/nft/generate-metadata`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            wallet_address: walletAddress,
          }),
        }
      );

      if (!metadataRes.ok) throw new Error('Failed to generate metadata');

      const metadata = await metadataRes.json();

      // Step 2: Mint NFT on blockchain
      const mintRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/nft/mint`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            wallet_address: walletAddress,
            metadata_uri: metadata.uri,
            chain: 'polygon', // Default to Polygon for low gas
          }),
        }
      );

      if (!mintRes.ok) throw new Error('Failed to mint NFT');

      const mintData = await mintRes.json();
      setPassport(mintData.data);
      setShowMintForm(false);
      setWalletAddress('');

      // Show success message
      alert(
        `🎉 NFT Passport minted! Transaction: ${mintData.data.transaction_hash}`
      );
    } catch (error) {
      alert(
        `Failed to mint: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    } finally {
      setMinting(false);
    }
  }

  // Load existing passport
  async function loadPassport() {
    try {
      setLoading(true);
      const token = localStorage.getItem('veritas_token');

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/nft/passport`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.ok) {
        const data = await res.json();
        setPassport(data.data);
      }
    } catch (error) {
      console.error('Failed to load passport:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-gray-900 text-white p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Button
              variant="secondary"
              onClick={() => router.back()}
              className="mb-4"
            >
              ← Back
            </Button>
            <h1 className="text-3xl sm:text-4xl font-black mb-2">
              🏆 NFT Reputation Passport
            </h1>
            <p className="text-gray-400">
              Mint your transferable Web3 reputation credential
            </p>
          </div>

          {loading ? (
            <LoadingSpinner message="Loading passport..." />
          ) : passport ? (
            // Display Minted Passport
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* NFT Display */}
              <div className="lg:col-span-2">
                <Card variant="elevated" className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 border-purple-700/30">
                  <div className="aspect-square rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 p-1 mb-6 flex items-center justify-center">
                    <div className="w-full h-full rounded-xl bg-black/50 flex flex-col items-center justify-center text-center">
                      <p className="text-6xl mb-4">🏆</p>
                      <p className="text-2xl font-black text-purple-200 mb-2">
                        VERITAS
                      </p>
                      <p className="text-sm text-purple-300">
                        Reputation Passport
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Token ID</p>
                      <p className="font-mono text-sm text-purple-300">
                        {passport.token_id}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-400 mb-1">
                        Contract Address
                      </p>
                      <p className="font-mono text-sm text-purple-300 break-all">
                        {passport.contract_address.slice(0, 10)}...
                        {passport.contract_address.slice(-10)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-400 mb-1">Chain</p>
                      <p className="font-bold text-purple-300 capitalize">
                        {passport.chain}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-400 mb-1">
                        Transaction Hash
                      </p>
                      <a
                        href={`https://polygonscan.com/tx/${passport.transaction_hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 text-sm font-mono break-all"
                      >
                        View on Polygonscan ↗️
                      </a>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Stats */}
              <div className="space-y-4">
                <Card variant="default" className="bg-blue-900/20 border-blue-700/30">
                  <p className="text-xs text-blue-400 mb-1">TruScore</p>
                  <p className="text-3xl font-black text-blue-300">
                    {passport.truscore}
                  </p>
                </Card>

                <Card variant="default" className="bg-green-900/20 border-green-700/30">
                  <p className="text-xs text-green-400 mb-1">
                    Verification Level
                  </p>
                  <p className="text-3xl font-black text-green-300">
                    {passport.verification_level}/5
                  </p>
                </Card>

                <Card variant="default" className="bg-purple-900/20 border-purple-700/30">
                  <p className="text-xs text-purple-400 mb-1">Badges</p>
                  <p className="text-2xl font-black text-purple-300">
                    {passport.badges.length}
                  </p>
                </Card>

                {/* Actions */}
                <Button
                  variant="primary"
                  fullWidth
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `${window.location.origin}/nft/${passport.nft_id}`
                    );
                    alert('Shareable link copied!');
                  }}
                >
                  🔗 Copy Share Link
                </Button>

                <Button
                  variant="outline"
                  fullWidth
                  onClick={() =>
                    window.open(
                      `https://opensea.io/assets/polygon/${passport.contract_address}/${passport.token_id}`,
                      '_blank'
                    )
                  }
                >
                  👀 View on OpenSea
                </Button>
              </div>
            </div>
          ) : (
            // Mint New Passport
            <Card variant="elevated" className="max-w-2xl">
              <h2 className="text-2xl font-bold mb-4">Mint Your Passport</h2>

              <p className="text-gray-400 mb-6">
                Create your NFT reputation passport to build trust across the entire Web3
                ecosystem. Your credentials are transferable and verifiable on-chain.
              </p>

              {/* Features */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <FeatureItem
                  icon="🔗"
                  title="On-Chain Verified"
                  description="All credentials verified by smart contracts"
                />
                <FeatureItem
                  icon="🌍"
                  title="Cross-Platform"
                  description="Use on any Web3 platform"
                />
                <FeatureItem
                  icon="📊"
                  title="Live Stats"
                  description="Real-time TruScore and badges"
                />
                <FeatureItem
                  icon="🎯"
                  title="Transferable"
                  description="Own your reputation"
                />
              </div>

              {showMintForm && (
                <div className="bg-gray-800/30 rounded-xl p-4 mb-6 border border-gray-700">
                  <label className="block text-sm font-bold text-gray-300 mb-2">
                    Polygon Wallet Address
                  </label>
                  <input
                    type="text"
                    placeholder="0x..."
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 font-mono text-sm"
                  />
                  <p className="text-xs text-gray-400 mt-2">
                    Make sure you have a Polygon wallet configured in MetaMask
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                {showMintForm ? (
                  <>
                    <Button
                      variant="primary"
                      fullWidth
                      loading={minting}
                      onClick={handleMintPassport}
                    >
                      🎨 Mint Now
                    </Button>
                    <Button
                      variant="secondary"
                      fullWidth
                      onClick={() => setShowMintForm(false)}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="primary"
                    fullWidth
                    onClick={() => setShowMintForm(true)}
                  >
                    🚀 Start Minting
                  </Button>
                )}
              </div>

              <p className="text-xs text-gray-500 text-center mt-4">
                ⛽ No gas fees on Polygon. Minting is FREE.
              </p>
            </Card>
          )}

          {/* Benefits Section */}
          <Card variant="default" className="mt-8 bg-blue-900/20 border-blue-700/30">
            <h3 className="font-bold text-lg text-blue-300 mb-4">Why Mint an NFT Passport?</h3>
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex gap-3">
                <span>✓</span>
                <span>Build permanent, verifiable Web3 reputation</span>
              </li>
              <li className="flex gap-3">
                <span>✓</span>
                <span>Use credentials across multiple platforms</span>
              </li>
              <li className="flex gap-3">
                <span>✓</span>
                <span>Earn premium rates with verified credentials</span>
              </li>
              <li className="flex gap-3">
                <span>✓</span>
                <span>Access exclusive opportunities reserved for NFT holders</span>
              </li>
              <li className="flex gap-3">
                <span>✓</span>
                <span>Transparent, fraud-resistant credentials</span>
              </li>
            </ul>
          </Card>
        </div>
      </main>
    </ProtectedRoute>
  );
}

function FeatureItem({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="p-4 rounded-lg bg-gray-800/30 border border-gray-700">
      <p className="text-2xl mb-2">{icon}</p>
      <p className="font-bold text-sm mb-1">{title}</p>
      <p className="text-xs text-gray-400">{description}</p>
    </div>
  );
}
