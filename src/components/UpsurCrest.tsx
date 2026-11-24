import React from 'react';

interface UpsurCrestProps {
  className?: string;
  variant?: 'navy' | 'light';
}

export const UpsurCrest: React.FC<UpsurCrestProps> = ({
  className = 'w-10 h-10',
  variant = 'navy',
}) => {
  const shieldFill = variant === 'navy' ? '#1B365D' : '#FFFFFF';
  const shieldStroke = variant === 'navy' ? '#0284C7' : '#38BDF8';
  const innerColor = variant === 'navy' ? '#FFFFFF' : '#1B365D';
  const accentColor = '#0284C7';

  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M32 4L56 12V31C56 45.5 45.6 56.8 32 60C18.4 56.8 8 45.5 8 31V12L32 4Z"
        fill={shieldFill}
        stroke={shieldStroke}
        strokeWidth="2.5"
      />
      <path
        d="M32 10L50 16V30.5C50 41.8 42.1 50.6 32 53.5C21.9 50.6 14 41.8 14 30.5V16L32 10Z"
        stroke={variant === 'navy' ? 'rgba(255,255,255,0.22)' : 'rgba(27,54,93,0.18)'}
        strokeWidth="1.2"
      />
      {/* Cruz del Sur / Geometric Compass Motif */}
      <path
        d="M32 18L34.4 26.6L43 29L34.4 31.4L32 40L29.6 31.4L21 29L29.6 26.6L32 18Z"
        fill={accentColor}
      />
      <circle cx="32" cy="29" r="3" fill={innerColor} />
      <path
        d="M22 43.5H42"
        stroke={innerColor}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M26 47.5H38"
        stroke={accentColor}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
};
