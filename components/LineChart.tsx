import React, { useMemo } from 'react';

interface DataPoint {
  x: number; // Token supply
  y: number; // Token price
}

interface LineChartProps {
  data: DataPoint[];
  width?: number;
  height?: number;
  xAxisLabel?: string;
  yAxisLabel?: string;
  lineColor?: string;
  gridColor?: string;
  axisColor?: string;
  showGrid?: boolean;
  className?: string;
}

const LineChart: React.FC<LineChartProps> = ({
  data,
  width = 600,
  height = 300,
  xAxisLabel = 'Token Supply',
  yAxisLabel = 'Price',
  lineColor = '#3b82f6', // Blue color
  gridColor = '#e5e7eb', // Light gray
  axisColor = '#6b7280', // Medium gray
  showGrid = true,
  className = '',
}) => {
  // Padding for chart to make room for axis labels
  const padding = { top: 20, right: 30, bottom: 40, left: 60 };
  
  // Calculate the chart dimensions
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  
  // Calculate min and max values from data
  const chartData = useMemo(() => {
    if (!data.length) return { points: '', minX: 0, maxX: 0, minY: 0, maxY: 0 };
    
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;
    
    // Find min and max values
    data.forEach(point => {
      minX = Math.min(minX, point.x);
      maxX = Math.max(maxX, point.x);
      minY = Math.min(minY, point.y);
      maxY = Math.max(maxY, point.y);
    });
    
    // Add a small buffer
    minX = minX > 0 ? 0 : minX * 0.9;
    maxX = maxX * 1.1;
    minY = minY > 0 ? 0 : minY * 0.9;
    maxY = maxY * 1.1;
    
    // Scale the data points to fit the chart dimensions
    const scaleX = (x: number) => (
      padding.left + ((x - minX) / (maxX - minX)) * chartWidth
    );
    
    const scaleY = (y: number) => (
      height - padding.bottom - ((y - minY) / (maxY - minY)) * chartHeight
    );
    
    // Create the SVG path data string
    const points = data.map((point, i) => {
      const x = scaleX(point.x);
      const y = scaleY(point.y);
      return `${i === 0 ? 'M' : 'L'} ${x},${y}`;
    }).join(' ');
    
    return { points, minX, maxX, minY, maxY, scaleX, scaleY };
  }, [data, chartWidth, chartHeight, height, padding.left, padding.bottom]);
  
  // Generate tick marks for axes
  const generateTicks = (min: number, max: number, count: number = 5) => {
    const step = (max - min) / (count - 1);
    return Array.from({ length: count }, (_, i) => min + i * step);
  };
  
  const xTicks = useMemo(
    () => generateTicks(chartData.minX, chartData.maxX),
    [chartData.minX, chartData.maxX]
  );
  
  const yTicks = useMemo(
    () => generateTicks(chartData.minY, chartData.maxY),
    [chartData.minY, chartData.maxY]
  );
  
  // Format numbers to be more readable
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    } else {
      return num.toFixed(1);
    }
  };

  if (!data.length) {
    return (
      <div className={`flex items-center justify-center ${className}`} style={{ width, height }}>
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  return (
    <svg 
      width={width} 
      height={height} 
      className={`overflow-visible ${className}`}
    >
      {/* Grid lines */}
      {showGrid && (
        <g className="grid-lines">
          {xTicks.map((tick, i) => (
            <line
              key={`x-grid-${i}`}
              x1={chartData.scaleX(tick)}
              y1={height - padding.bottom}
              x2={chartData.scaleX(tick)}
              y2={padding.top}
              stroke={gridColor}
              strokeWidth="1"
              strokeDasharray="4,4"
              opacity="0.5"
            />
          ))}
          {yTicks.map((tick, i) => (
            <line
              key={`y-grid-${i}`}
              x1={padding.left}
              y1={chartData.scaleY(tick)}
              x2={width - padding.right}
              y2={chartData.scaleY(tick)}
              stroke={gridColor}
              strokeWidth="1"
              strokeDasharray="4,4"
              opacity="0.5"
            />
          ))}
        </g>
      )}

      {/* X and Y axes */}
      <line
        x1={padding.left}
        y1={height - padding.bottom}
        x2={width - padding.right}
        y2={height - padding.bottom}
        stroke={axisColor}
        strokeWidth="2"
      />
      <line
        x1={padding.left}
        y1={padding.top}
        x2={padding.left}
        y2={height - padding.bottom}
        stroke={axisColor}
        strokeWidth="2"
      />

      {/* X-axis ticks and labels */}
      {xTicks.map((tick, i) => (
        <g key={`x-tick-${i}`}>
          <line
            x1={chartData.scaleX(tick)}
            y1={height - padding.bottom}
            x2={chartData.scaleX(tick)}
            y2={height - padding.bottom + 5}
            stroke={axisColor}
          />
          <text
            x={chartData.scaleX(tick)}
            y={height - padding.bottom + 20}
            textAnchor="middle"
            fill={axisColor}
            fontSize="12"
          >
            {formatNumber(tick)}
          </text>
        </g>
      ))}

      {/* Y-axis ticks and labels */}
      {yTicks.map((tick, i) => (
        <g key={`y-tick-${i}`}>
          <line
            x1={padding.left - 5}
            y1={chartData.scaleY(tick)}
            x2={padding.left}
            y2={chartData.scaleY(tick)}
            stroke={axisColor}
          />
          <text
            x={padding.left - 10}
            y={chartData.scaleY(tick)}
            textAnchor="end"
            dominantBaseline="middle"
            fill={axisColor}
            fontSize="12"
          >
            {formatNumber(tick)}
          </text>
        </g>
      ))}

      {/* X-axis label */}
      <text
        x={padding.left + chartWidth / 2}
        y={height - 5}
        textAnchor="middle"
        fill={axisColor}
        fontSize="14"
        fontWeight="bold"
      >
        {xAxisLabel}
      </text>

      {/* Y-axis label */}
      <text
        x={0}
        y={padding.top + chartHeight / 2}
        textAnchor="middle"
        fill={axisColor}
        fontSize="14"
        fontWeight="bold"
        transform={`rotate(-90, 15, ${padding.top + chartHeight / 2})`}
      >
        {yAxisLabel}
      </text>

      {/* The line chart */}
      <path
        d={chartData.points}
        fill="none"
        stroke={lineColor}
        strokeWidth="2.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* Data points */}
      {data.map((point, i) => (
        <circle
          key={`point-${i}`}
          cx={chartData.scaleX(point.x)}
          cy={chartData.scaleY(point.y)}
          r="4"
          fill="white"
          stroke={lineColor}
          strokeWidth="2"
        />
      ))}
    </svg>
  );
};

export default LineChart;

