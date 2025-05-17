'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Training data points
const dataPoints = [
  { x: 100, y: 240, category: 0 }, // Normal weight
  { x: 120, y: 230, category: 0 },
  { x: 140, y: 220, category: 0 },
  { x: 160, y: 210, category: 0 },
  { x: 180, y: 180, category: 0 },
  { x: 200, y: 170, category: 1 }, // Overweight
  { x: 220, y: 160, category: 1 },
  { x: 240, y: 150, category: 1 },
  { x: 260, y: 140, category: 1 },
  { x: 280, y: 130, category: 1 },
];

// Sigmoid function to convert linear output to probability (0-1)
const sigmoid = (z: number): number => 1 / (1 + Math.exp(-z));

// Preset iterations representing the progression of parameters
const iterations = [
  { w1: 0.001, w2: 0.001, b: 0 },     // Initial weights
  { w1: 0.005, w2: -0.003, b: -0.5 }, // Early training
  { w1: 0.01, w2: -0.008, b: -1 },    // Mid training
  { w1: 0.015, w2: -0.012, b: -1.5 }, // Late training
  { w1: 0.02, w2: -0.015, b: -2 },    // Final weights
];

export function LogisticRegression() {
  const [isPlaying, setIsPlaying] = React.useState(true);
  const [speed, setSpeed] = React.useState(1);
  const [currentIteration, setCurrentIteration] = React.useState(0);

  // Get current model parameters
  const { w1, w2, b } = iterations[currentIteration];

  // Update the parameters every interval
  React.useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setCurrentIteration((prev) => (prev + 1) % iterations.length);
    }, 2000 / speed);
    return () => clearInterval(timer);
  }, [isPlaying, speed]);

  // Calculate decision boundary line
  // For logistic regression, decision boundary is where w1*x + w2*y + b = 0
  // Solving for y: y = (-w1*x - b) / w2
  const getYforX = (x: number) => (-w1 * x - b) / w2;

  // For visualization purposes, we'll draw the decision boundary 
  // across the range of our plot
  const x1 = 50;
  const y1 = getYforX(x1);
  const x2 = 350;
  const y2 = getYforX(x2);

  // Calculate accuracy
  const accuracy = dataPoints.reduce((acc, point) => {
    const z = w1 * point.x + w2 * point.y + b;
    const predicted = sigmoid(z) >= 0.5 ? 1 : 0;
    return acc + (predicted === point.category ? 1 : 0);
  }, 0) / dataPoints.length * 100;

  // Calculate the probability for each point
  const getProbability = (point: { x: number; y: number }) => {
    const z = w1 * point.x + w2 * point.y + b;
    return sigmoid(z);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 relative bg-white border border-gray-200 rounded-md">
      <div className="flex flex-col items-center space-y-4">
        <div className="h-[320px] w-full flex items-center justify-center">
          <AnimatePresence mode="wait">
            <svg width={600} height={300} viewBox="0 0 600 300">
              {/* Background grid for visualization */}
              <rect x={0} y={0} width={600} height={300} fill="#f8fafc" />
              <g stroke="#e2e8f0" strokeWidth={1}>
                {Array.from({ length: 12 }).map((_, i) => (
                  <line key={`v-${i}`} x1={i * 50} y1={0} x2={i * 50} y2={300} />
                ))}
                {Array.from({ length: 6 }).map((_, i) => (
                  <line key={`h-${i}`} x1={0} y1={i * 50} x2={600} y2={i * 50} />
                ))}
              </g>

              {/* Decision boundary */}
              <motion.line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#2563eb"
                strokeWidth={3}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, x1, y1, x2, y2 }}
                transition={{ duration: 1 / speed }}
              />

              {/* Data points */}
              {dataPoints.map((point, i) => {
                const prob = getProbability(point);
                return (
                  <g key={`point-${i}`}>
                    <motion.circle
                      cx={point.x}
                      cy={point.y}
                      r={10}
                      fill={point.category === 1 ? '#f87171' : '#60a5fa'}
                      opacity={0.8}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: 'spring',
                        stiffness: 300,
                        damping: 20,
                        delay: i * 0.1,
                      }}
                    />
                    {/* Probability indicator (fill proportion) */}
                    <motion.circle
                      cx={point.x}
                      cy={point.y}
                      r={10}
                      fill={point.category === 0 ? '#f87171' : '#60a5fa'}
                      initial={{ scale: 0 }}
                      animate={{ scale: prob }}
                      transition={{ 
                        duration: 1 / speed,
                        type: "spring", 
                        stiffness: 100, 
                        damping: 15 
                      }}
                    />
                    {/* Circle outline */}
                    <circle
                      cx={point.x}
                      cy={point.y}
                      r={10}
                      fill="none"
                      stroke="#4b5563"
                      strokeWidth={1}
                    />
                  </g>
                );
              })}

              {/* Labels */}
              <text x={300} y={295} textAnchor="middle" className="text-sm" fill="#4b5563" fontWeight="bold">
                Height (cm)
              </text>
              <text x={20} y={150} textAnchor="middle" transform="rotate(-90, 20, 150)" className="text-sm" fill="#4b5563" fontWeight="bold">
                Weight (kg)
              </text>
              
              {/* Axis guides */}
              <text x={100} y={275} textAnchor="middle" className="text-xs" fill="#6b7280">
                160
              </text>
              <text x={200} y={275} textAnchor="middle" className="text-xs" fill="#6b7280">
                170
              </text>
              <text x={300} y={275} textAnchor="middle" className="text-xs" fill="#6b7280">
                180
              </text>
              
              <text x={40} y={240} textAnchor="end" className="text-xs" fill="#6b7280">
                60
              </text>
              <text x={40} y={190} textAnchor="end" className="text-xs" fill="#6b7280">
                70
              </text>
              <text x={40} y={140} textAnchor="end" className="text-xs" fill="#6b7280">
                80
              </text>
            </svg>
          </AnimatePresence>
        </div>

        <div className="text-sm text-gray-600 self-start">
          <div>
            Decision Boundary Equation:{' '}
            <span className="font-semibold">
              {w1.toFixed(3)}*x + {w2.toFixed(3)}*y + {b.toFixed(2)} = 0
            </span>
          </div>
          <div>
            Accuracy:{' '}
            <span className="font-semibold">{accuracy.toFixed(1)}%</span>
          </div>
          <div className="mt-2">
            <span className="inline-block w-4 h-4 bg-blue-400 rounded-full mr-1"></span> Normal Weight
            <span className="inline-block w-4 h-4 bg-red-400 rounded-full ml-4 mr-1"></span> Overweight
          </div>
        </div>
      </div>

      {/* Playback controls */}
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
