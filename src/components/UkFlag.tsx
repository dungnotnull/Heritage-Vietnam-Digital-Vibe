import React from 'react';

interface UkFlagProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showBorder?: boolean;
}

export const UkFlag: React.FC<UkFlagProps> = ({
  className = '',
  size = 'md',
  showBorder = true,
}) => {
  const sizeClasses = {
    xs: 'w-4 h-2.5',
    sm: 'w-5 h-3.5',
    md: 'w-6 h-4',
    lg: 'w-8 h-5.5',
    xl: 'w-10 h-7',
  };

  return (
    <span
      className={`inline-block overflow-hidden rounded-[3px] flex-shrink-0 align-middle shadow-2xs ${
        showBorder ? 'border border-blue-900/30' : ''
      } ${sizeClasses[size]} ${className}`}
      title="United Kingdom Flag (English)"
    >
      <svg
        viewBox="0 0 60 30"
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full block"
      >
        <clipPath id="uk-flag-clip">
          <path d="M0 0v30h60V0z" />
        </clipPath>
        <g clipPath="url(#uk-flag-clip)">
          {/* Blue background */}
          <path d="M0 0v30h60V0z" fill="#012169" />
          
          {/* Diagonal White Cross (St. Andrew & St. Patrick background) */}
          <path d="M0 0l60 30m0-30L0 30" stroke="#fff" strokeWidth="6" />
          
          {/* Diagonal Red Cross (St. Patrick counterchanged) */}
          <path d="M0 0l60 30m0-30L0 30" stroke="#C8102E" strokeWidth="4" />
          <path d="M0 0l30 15m30 0L30 30m0-30l30 15M0 30l30-15" stroke="#012169" strokeWidth="2" />
          <path d="M0 0l20 10M60 30L40 20M0 30l20-10M60 0L40 10" stroke="#C8102E" strokeWidth="2" />
          
          {/* Broad White Cross (St. George background) */}
          <path d="M30 0v30M0 15h60" stroke="#fff" strokeWidth="10" />
          
          {/* Red Cross (St. George) */}
          <path d="M30 0v30M0 15h60" stroke="#C8102E" strokeWidth="6" />
        </g>
      </svg>
    </span>
  );
};
