import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'outline';
  hover?: boolean;
}

export default function Card({
  children,
  className = '',
  variant = 'default',
  hover = true,
}: CardProps) {
  const variantStyles = {
    default: 'bg-gray-900/40 border border-gray-800',
    elevated: 'bg-gray-900/60 border border-gray-700 shadow-lg',
    outline: 'bg-transparent border-2 border-gray-700',
  };

  const hoverClass = hover ? 'hover:border-gray-600 hover:shadow-xl transition-all duration-200 hover:scale-105' : '';

  return (
    <div
      className={`
        rounded-2xl p-6
        ${variantStyles[variant]}
        ${hoverClass}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
