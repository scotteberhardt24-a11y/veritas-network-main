import React from 'react';
import Button from './Button';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  variant?: 'default' | 'compact';
}

export default function EmptyState({
  icon = '📭',
  title,
  description,
  actionLabel,
  onAction,
  variant = 'default',
}: EmptyStateProps) {
  if (variant === 'compact') {
    return (
      <div className="text-center py-8">
        <p className="text-3xl mb-2">{icon}</p>
        <h3 className="font-bold text-gray-300 mb-1">{title}</h3>
        {description && <p className="text-gray-500 text-sm">{description}</p>}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 sm:py-20 px-4">
      <p className="text-6xl sm:text-7xl mb-4">{icon}</p>
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-200 mb-2">{title}</h2>
      {description && (
        <p className="text-gray-500 text-center max-w-md mb-6">{description}</p>
      )}
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="primary">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
