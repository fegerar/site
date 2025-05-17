'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Our fixed data points (training data)
const dataPoints = [
  { x: 50, y: 75 },
  { x: 150, y: 125 },
  { x: 250, y: 175 },
  { x: 350, y: 225 },
  { x: 450, y: 275 },
];

// Preset iterations representing the progression of parameters (slope and intercept)
const iterations = [
  { m: 0, c: 150 },
  { m: 0.25, c: 130 },
  { m: 0.4, c: 100 },
  { m: 0.48, c: 70 },
  { m: 0.5, c: 50 },
];

export function LinearRegression() {
  const [isPlaying, setIsPlaying] = React.useState(true);
  const [speed, setSpeed] = React.useState(1);
  const [currentIteration, setCurrentIteration] = React.useState(0);

  // Get the current regression parameters
  const { m, c } = iterations[currentIteration];

  // Compute the loss (mean squared error) for the current parameters
  const loss =
    dataPoints.reduce((acc, point) => {
      const predicted = m * point.x + c;
      const error = predicted - point.y;
      return acc + error * error;
    }, 0) / dataPoints.length;

  // Compute endpoints for the regression line.
  // Here x runs from 0 to 600 (the full width of the plot).
  const x1 = 0;
  const y1 = m * x1 + c;
  const x2 = 600;
  const y2 = m * x2 + c;

  // Update the regression iteration on an interval.
  // Once the final iteration is reached, loop back to the start.
  React.useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setCurrentIteration((prev) => (prev + 1) % iterations.length);
    }, 2000 / speed);
    return () => clearInterval(timer);
  }, [isPlaying, speed]);

  // For each data point, draw a dashed line (“residual”) from the point to its prediction.
  const renderResiduals = () => {
    return dataPoints.map((point, i) => {
      const predictedY = m * point.x + c;
      return (
        <motion.line
          key={`residual-${i}`}
          x1={point.x}
          y1={point.y}
          x2={point.x}
          y2={predictedY}
          stroke="#9ca3af"
          strokeDasharray="4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 / speed }}
        />
      );
    });
  };

  // Render the entire plot: background, data points, residual lines, and regression line.
  const renderPlot = () => {
    return (
      <svg width={600} height={300} viewBox="0 0 600 300">
        {/* Background */}
        <rect x={0} y={0} width={600} height={300} fill="#fff" />
        {/* Data Points */}
        {dataPoints.map((point, i) => (
          <motion.circle
            key={`point-${i}`}
            cx={point.x}
            cy={point.y}
            r={6}
            fill="#f87171"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 20,
              delay: i * 0.1,
            }}
          />
        ))}
        {/* Residual Lines */}
        {renderResiduals()}
        {/* Regression Line with animated coordinates */}
        <motion.line
          animate={{
            x1,
            y1,
            x2,
            y2,
          }}
          stroke="#2563eb"
          strokeWidth={3}
          transition={{ duration: 1 / speed, ease: 'easeInOut' }}
        />
      </svg>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 relative bg-white border border-gray-200 rounded-md">
      <div className="flex flex-col items-center space-y-4">
        <div className="h-[320px] w-full flex items-center justify-center">
          <AnimatePresence mode="wait">{renderPlot()}</AnimatePresence>
        </div>
        <div className="text-sm text-gray-600 self-start">
          <div>
            Regression Equation:{' '}
            <span className="font-semibold">
              y = {m.toFixed(2)}x + {c.toFixed(2)}
            </span>
          </div>
          <div>
            Loss:{' '}
            <span className="font-semibold">{loss.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 right-4 flex items-center space-x-1">
        <button
          className="p-[2px] rounded-full bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
          onClick={() => setIsPlaying(!isPlaying)}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 9v6m4-6v6"
              />
            </svg>
          ) : (
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
              />
            </svg>
          )}
        </button>
        {[0.5, 1, 1.5, 2].map((s) => (
          <button
            key={s}
            className={`px-2 py-1 text-xs rounded ${
              speed === s
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800'
            } hover:bg-blue-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-400`}
            onClick={() => setSpeed(s)}
          >
            {s}x
          </button>
        ))}
      </div>
    </div>
  );
}
