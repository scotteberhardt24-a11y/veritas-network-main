'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Button, LoadingSpinner, Card } from '@/components/ui';

interface Chain {
  chain_id: string;
  name: string;
  symbol: string;
  network: string;
  rpc_url: string;
  explorer_url: string;
  supported_tokens: Token[];
  gas_price?: string;
  estimated_fee?: string;
}

interface Token {
  token_id: string;
  symbol: string;
  name: string;
  decimals: number;
  contract_address: string;
  logo_url?: string;
  balance?: string;
  usd_price?: number;
  chain_id: string;
}

interface PaymentOption {
  payment_id: string;
  token: Token;
  chain: Chain;
  amount: number;
  usd_equivalent: number;
  exchange_rate: number;
  fee: number;
  arrival_time: number;
  stability: 'stable' | 'volatile';
}

export default function CrossChainPaymentsPage() {
  const [chains, setChains] = useState<Chain[]>([]);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [paymentOptions, setPaymentOptions] = useState<PaymentOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedChain, setSelectedChain] = useState<Chain | null>(null);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [amount, setAmount] = useState<number>(0);
  const [showSwap, setShowSwap] = useState(false);

  useEffect(() => {
    loadPaymentOptions();
  }, []);

  async function loadPaymentOptions() {
    try {
      const token = localStorage.getItem('veritas_token');

      const [chainsRes, tokensRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payment/chains`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payment/tokens`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (chainsRes.ok && tokensRes.ok) {
        const chainsData = await chainsRes.json();
        const tokensData = await tokensRes.json();

        setChains(chainsData.data || []);
        setTokens(tokensData.data || []);

        // Set default chain
        if (chainsData.data && chainsData.data.length > 0) {
          setSelectedChain(chainsData.data[0]);
        }
      }
    } catch (error) {
      console.error('Failed to load payment options:', error);
    } finally {
      setLoading(false);
    }
  }

  async function getPaymentQuote(tokenId: string, chainId: string, amount: number) {
    try {
      const token = localStorage.getItem('veritas_token');

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/payment/quote?token_id=${tokenId}&chain_id=${chainId}&amount=${amount}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.ok) {
        const data = await res.json();
        setPaymentOptions(data.quotes || []);
      }
    } catch (error) {
      console.error('Failed to get quotes:', error);
    }
  }

  async function initiatePayment(paymentId: string) {
    try {
      const token = localStorage.getItem('veritas_token');

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/payment/initiate`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ payment_id: paymentId }),
        }
      );

      if (res.ok) {
        const data = await res.json();
        // Redirect to wallet or show transaction
        alert(`Payment initiated! TX: ${data.transaction_hash}`);
      }
    } catch (error) {
      console.error('Failed to initiate payment:', error);
    }
  }

  async function performAtomicSwap(fromToken: Token, toToken: Token, amount: number) {
    try {
      const token = localStorage.getItem('veritas_token');

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/payment/atomic-swap`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from_token_id: fromToken.token_id,
            to_token_id: toToken.token_id,
            amount,
          }),
        }
      );

      if (res.ok) {
        const data = await res.json();
        alert(`Swap initiated! TX: ${data.transaction_hash}`);
        setShowSwap(false);
      }
    } catch (error) {
      console.error('Failed to perform swap:', error);
    }
  }

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading payment options..." />;
  }

  const selectedChainTokens = tokens.filter((t) => t.chain_id === selectedChain?.chain_id);

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-gray-900 text-white p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-black mb-2">
              ⛓️ Cross-Chain Payments
            </h1>
            <p className="text-gray-400">
              Pay with any token across multiple blockchains
            </p>
          </div>

          {!showSwap ? (
            <>
              {/* Payment Options */}
              <Card variant="elevated" className="mb-8">
                <h2 className="text-2xl font-bold mb-6">💳 Payment Options</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">
                      Select Chain
                    </label>
                    <select
                      value={selectedChain?.chain_id || ''}
                      onChange={(e) => {
                        const chain = chains.find((c) => c.chain_id === e.target.value);
                        setSelectedChain(chain || null);
                      }}
                      className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white"
                    >
                      {chains.map((chain) => (
                        <option key={chain.chain_id} value={chain.chain_id}>
                          {chain.name} ({chain.symbol})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">
                      Select Token
                    </label>
                    <select
                      value={selectedToken?.token_id || ''}
                      onChange={(e) => {
                        const token = tokens.find((t) => t.token_id === e.target.value);
                        setSelectedToken(token || null);
                      }}
                      className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white"
                    >
                      <option value="">Select a token</option>
                      {selectedChainTokens.map((token) => (
                        <option key={token.token_id} value={token.token_id}>
                          {token.symbol} - {token.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-bold text-gray-300 mb-2">
                    Amount
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                      placeholder="Enter amount"
                      className="flex-1 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white"
                    />
                    <Button
                      variant="primary"
                      onClick={() => getPaymentQuote(selectedToken?.token_id || '', selectedChain?.chain_id || '', amount)}
                      disabled={!selectedToken || amount <= 0}
                    >
                      Get Quote
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Payment Quotes */}
              {paymentOptions.length > 0 && (
                <div className="space-y-4 mb-8">
                  <h2 className="text-xl font-bold">Best Routes</h2>

                  {paymentOptions.map((option) => (
                    <Card
                      key={option.payment_id}
                      variant="default"
                      className="hover:border-blue-500/50 transition-all"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="font-bold text-lg">{option.token.symbol}</p>
                          <p className="text-sm text-gray-400">
                            on {option.chain.name}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-2xl font-black text-cyan-400">
                            {option.amount} {option.token.symbol}
                          </p>
                          <p className="text-sm text-gray-400">
                            ≈ ${option.usd_equivalent.toFixed(2)}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-4 p-3 rounded-lg bg-gray-800/30">
                        <div>
                          <p className="text-xs text-gray-400">Fee</p>
                          <p className="font-bold">
                            ${option.fee.toFixed(2)}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-gray-400">Arrival</p>
                          <p className="font-bold">{option.arrival_time}s</p>
                        </div>

                        <div>
                          <p className="text-xs text-gray-400">Stability</p>
                          <p
                            className={`font-bold ${
                              option.stability === 'stable'
                                ? 'text-green-400'
                                : 'text-yellow-400'
                            }`}
                          >
                            {option.stability}
                          </p>
                        </div>
                      </div>

                      <Button
                        variant="primary"
                        fullWidth
                        onClick={() => initiatePayment(option.payment_id)}
                      >
                        Pay with {option.token.symbol}
                      </Button>
                    </Card>
                  ))}
                </div>
              )}

              {/* Token Swap */}
              <Card variant="default">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-bold">🔄 Atomic Swap</h3>
                    <p className="text-sm text-gray-400">
                      Exchange tokens at best rates
                    </p>
                  </div>
                  <Button
                    variant="secondary"
                    onClick={() => setShowSwap(true)}
                  >
                    Swap Tokens
                  </Button>
                </div>
              </Card>
            </>
          ) : (
            // Swap Interface
            <div className="space-y-6">
              <Button
                variant="secondary"
                onClick={() => setShowSwap(false)}
                className="mb-4"
              >
                ← Back
              </Button>

              <Card variant="elevated">
                <h2 className="text-2xl font-bold mb-6">🔄 Token Swap</h2>

                <div className="space-y-4">
                  {/* From Token */}
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">
                      From
                    </label>
                    <select className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white">
                      {tokens.map((token) => (
                        <option key={token.token_id} value={token.token_id}>
                          {token.symbol} - {token.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Arrow */}
                  <div className="flex justify-center">
                    <div className="p-3 rounded-full bg-blue-900/20 border border-blue-700/30">
                      <svg
                        className="w-6 h-6 text-blue-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16V4m0 0L3 8m0 0l4 4m10-4v12m0 0l4-4m0 0l-4-4"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* To Token */}
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">
                      To
                    </label>
                    <select className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white">
                      {tokens.map((token) => (
                        <option key={token.token_id} value={token.token_id}>
                          {token.symbol} - {token.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Amount */}
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">
                      Amount
                    </label>
                    <input
                      type="number"
                      placeholder="0.00"
                      className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white"
                    />
                  </div>

                  {/* Rate */}
                  <div className="p-3 rounded-lg bg-gray-800/30">
                    <p className="text-xs text-gray-400">Exchange Rate</p>
                    <p className="text-lg font-bold">1 ETH = 2,500 USDC</p>
                  </div>

                  <Button variant="primary" fullWidth>
                    Confirm Swap
                  </Button>
                </div>
              </Card>
            </div>
          )}

          {/* Supported Chains */}
          <div className="mt-12">
            <h2 className="text-xl font-bold mb-4">🌐 Supported Networks</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {chains.map((chain) => (
                <Card key={chain.chain_id} variant="default">
                  <p className="font-bold mb-2">{chain.name}</p>
                  <p className="text-sm text-gray-400 mb-3">{chain.network}</p>

                  <div className="space-y-1 mb-3">
                    <p className="text-xs text-gray-500">
                      Tokens: {chain.supported_tokens.length}
                    </p>
                    {chain.gas_price && (
                      <p className="text-xs text-gray-500">
                        Gas: {chain.gas_price}
                      </p>
                    )}
                    {chain.estimated_fee && (
                      <p className="text-xs text-green-400">
                        Fee: ${chain.estimated_fee}
                      </p>
                    )}
                  </div>

                  <a
                    href={chain.explorer_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-400 hover:text-blue-300"
                  >
                    View Explorer →
                  </a>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}
