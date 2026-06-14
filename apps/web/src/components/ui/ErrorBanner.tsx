import React, { useState } from 'react';
import Button from './Button';

interface ErrorBannerProps {
  message: string;
  title?: string;
  onRetry?: () => void;
  onDismiss?: () => void;
  variant?: 'banner' | 'card' | 'inline';
}

export default function ErrorBanner({
  message,
  title = 'Error',
  onRetry,
  onDismiss,
  variant = 'banner',
}: ErrorBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss?.();
  };

  if (dismissed) return null;

  if (variant === 'card') {
    return (
      <div className="w-full bg-red-900/20 border border-red-700/50 rounded-2xl p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="text-3xl">⚠️</div>
          <div className="flex-1">
            <h3 className="font-bold text-red-400 mb-1">{title}</h3>
            <p className="text-red-300 text-sm mb-4">{message}</p>
            <div className="flex gap-3">
              {onRetry && (
                <Button variant="danger" size="sm" onClick={onRetry}>
                  Try Again
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={handleDismiss}>
                Dismiss
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className="flex items-center gap-2 text-red-400 text-sm mb-4">
        <span>⚠️</span>
        <p>{message}</p>
      </div>
    );
  }

  // banner variant (default)
  return (
    <div className="fixed top-0 left-0 right-0 bg-red-600/95 backdrop-blur-sm text-white p-4 flex items-center justify-between z-50">
      <div className="max-w-4xl mx-auto w-full flex items-center gap-4">
        <span className="text-xl">⚠️</span>
        <div className="flex-1">
          <p className="font-bold">{title}</p>
          <p className="text-sm opacity-90">{message}</p>
        </div>
        <div className="flex gap-2">
          {onRetry && (
            <Button variant="secondary" size="sm" onClick={onRetry}>
              Retry
            </Button>
          )}
          <button
            onClick={handleDismiss}
            className="text-white hover:opacity-75 transition"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
