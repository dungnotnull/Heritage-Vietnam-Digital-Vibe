import React from 'react';

interface VietnamFlagProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showBorder?: boolean;
}

export const VietnamFlag: React.FC<VietnamFlagProps> = ({
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
        showBorder ? 'border border-red-800/30' : ''
      } ${sizeClasses[size]} ${className}`}
      title="Quốc kỳ Việt Nam (Cờ đỏ sao vàng)"
    >
      <svg
        viewBox="0 0 900 600"
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full block"
      >
        {/* Red Field (#DA251D - Standard National Flag Red) */}
        <rect width="900" height="600" fill="#DA251D" />
        
        {/* 5-pointed Gold Star (#FFFF00 - Standard Proportions) */}
        {/* Radius R = 180 (0.6 of 300 half-height) */}
        <polygon
          fill="#FFFF00"
          points="450,120 492.36,250.36 621.17,250.36 516.90,326.18 556.73,450 450,372.36 343.27,450 383.10,326.18 278.83,250.36 407.64,250.36"
        />
      </svg>
    </span>
  );
};
