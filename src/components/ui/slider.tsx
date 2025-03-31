import React, { useState, useRef, useEffect } from 'react';

interface SliderProps {
  min: number;
  max: number;
  step?: number;
  defaultValue?: number;
  value?: number;
  onChange?: (value: number) => void;
  className?: string;
  label?: string;
  showValue?: boolean;
  disabled?: boolean;
}

export const Slider: React.FC<SliderProps> = ({
  min,
  max,
  step = 1,
  defaultValue,
  value: controlledValue,
  onChange,
  className = '',
  label,
  showValue = true,
  disabled = false,
}) => {
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue || min);
  const value = isControlled ? controlledValue : internalValue;
  
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const percentage = ((value - min) / (max - min)) * 100;
  
  const updateValue = (newValue: number) => {
    const clampedValue = Math.min(Math.max(newValue, min), max);
    const steppedValue = Math.round(clampedValue / step) * step;
    
    if (!isControlled) {
      setInternalValue(steppedValue);
    }
    
    if (onChange) {
      onChange(steppedValue);
    }
  };
  
  const handleMouseDown = (e: React.MouseEvent) => {
    if (disabled) return;
    setIsDragging(true);
    updateValueFromClientX(e.clientX);
  };
  
  const updateValueFromClientX = (clientX: number) => {
    if (!sliderRef.current) return;
    
    const rect = sliderRef.current.getBoundingClientRect();
    const position = clientX - rect.left;
    const percentage = Math.min(Math.max(position / rect.width, 0), 1);
    const newValue = min + percentage * (max - min);
    
    updateValue(newValue);
  };
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        updateValueFromClientX(e.clientX);
      }
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
    };
    
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    
    let newValue = value;
    
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        newValue += step;
        e.preventDefault();
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        newValue -= step;
        e.preventDefault();
        break;
      case 'Home':
        newValue = min;
        e.preventDefault();
        break;
      case 'End':
        newValue = max;
        e.preventDefault();
        break;
      default:
        return;
    }
    
    updateValue(newValue);
  };
  
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-700">{label}</label>
          {showValue && (
            <span className="text-sm text-gray-500">{value.toFixed(step < 1 ? 2 : 0)}</span>
          )}
        </div>
      )}
      
      <div
        ref={sliderRef}
        className={`relative h-5 flex items-center cursor-pointer ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        onMouseDown={handleMouseDown}
        tabIndex={disabled ? -1 : 0}
        role="slider"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-disabled={disabled}
        onKeyDown={handleKeyDown}
      >
        <div className="absolute h-1 w-full bg-gray-200 rounded-full">
          <div
            className="absolute h-full bg-primary rounded-full"
            style={{ width: `${percentage}%` }}
          />
        </div>
        
        <div
          className={`absolute h-4 w-4 rounded-full shadow-md transform -translate-x-1/2 focus:outline-none ${
            isDragging ? 'ring-4 ring-primary-light' : ''
          }`}
          style={{ left: `${percentage}%`, backgroundColor: disabled ? '#cbd5e0' : '#3b82f6' }}
        />
      </div>
      
      {!label && showValue && (
        <div className="mt-2 text-right">
          <span className="text-sm text-gray-500">{value.toFixed(step < 1 ? 2 : 0)}</span>
        </div>
      )}
    </div>
  );
};

export default Slider;
