import React, { useState } from 'react';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  position?: 'top' | 'right' | 'bottom' | 'left';
  delay?: number;
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  delay = 300,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState<number | null>(null);

  const showTooltip = () => {
    const id = window.setTimeout(() => {
      setIsVisible(true);
    }, delay);
    setTimeoutId(id);
  };

  const hideTooltip = () => {
    if (timeoutId) {
      window.clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setIsVisible(false);
  };

  const getPositionClasses = () => {
    switch (position) {
      case 'top':
        return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2';
      case 'right':
        return 'left-full top-1/2 transform -translate-y-1/2 ml-2';
      case 'bottom':
        return 'top-full left-1/2 transform -translate-x-1/2 mt-2';
      case 'left':
        return 'right-full top-1/2 transform -translate-y-1/2 mr-2';
      default:
        return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2';
    }
  };

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
      >
        {children}
      </div>
      {isVisible && (
        <div
          className={`
            absolute z-50 px-2 py-1 text-xs font-medium text-white bg-gray-900 
            rounded shadow-sm max-w-xs whitespace-normal
            ${getPositionClasses()}
            ${className}
          `}
          role="tooltip"
        >
          {content}
          <div
            className={`
              absolute w-0 h-0 border-4 border-transparent
              ${position === 'top' ? 'border-t-gray-900 top-full left-1/2 transform -translate-x-1/2' : ''}
              ${position === 'right' ? 'border-r-gray-900 right-full top-1/2 transform -translate-y-1/2' : ''}
              ${position === 'bottom' ? 'border-b-gray-900 bottom-full left-1/2 transform -translate-x-1/2' : ''}
              ${position === 'left' ? 'border-l-gray-900 left-full top-1/2 transform -translate-y-1/2' : ''}
            `}
          />
        </div>
      )}
    </div>
  );
};

