'use client';

import * as React from 'react';
import type { ReactElement } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Simulated network architecture for MLP visualization
const layers = [
  { name: 'Input', neurons: 4, x: 80 },  // Input layer with 4 neurons (BMI, Age, Gender, Activity)
  { name: 'Hidden 1', neurons: 6, x: 200 }, // First hidden layer with 6 neurons
  { name: 'Hidden 2', neurons: 4, x: 320 }, // Second hidden layer with 4 neurons
  { name: 'Output', neurons: 3, x: 440 }, // Output layer with 3 classes (Normal, Overweight, Obese)
];

// Predefined activation states
const activations = [
  [
    [0.2, 0.7, 0.5, 0.3], // Input layer
    [0, 0, 0, 0, 0, 0],   // Hidden layer 1 (not activated yet)
    [0, 0, 0, 0],         // Hidden layer 2 (not activated yet)
    [0, 0, 0],            // Output layer (not activated yet)
  ],
  [
    [0.2, 0.7, 0.5, 0.3], // Input layer
    [0.8, 0.3, 0.6, 0.2, 0.7, 0.5], // Hidden layer 1 (now activated)
    [0, 0, 0, 0],         // Hidden layer 2 (not activated yet)
    [0, 0, 0],            // Output layer (not activated yet)
  ],
  [
    [0.2, 0.7, 0.5, 0.3], // Input layer
    [0.8, 0.3, 0.6, 0.2, 0.7, 0.5], // Hidden layer 1
    [0.9, 0.4, 0.2, 0.7], // Hidden layer 2 (now activated)
    [0, 0, 0],            // Output layer (not activated yet)
  ],
  [
    [0.2, 0.7, 0.5, 0.3], // Input layer
    [0.8, 0.3, 0.6, 0.2, 0.7, 0.5], // Hidden layer 1
    [0.9, 0.4, 0.2, 0.7], // Hidden layer 2
    [0.1, 0.7, 0.2],      // Output layer (final prediction)
  ],
];

// Label for each neuron in the input and output layers
const inputLabels = ['BMI', 'Age', 'Gender', 'Activity'];
const outputLabels = ['Normal', 'Overweight', 'Obese'];

export function MultiLayerPerceptron() {
  const [isPlaying, setIsPlaying] = React.useState(true);
  const [speed, setSpeed] = React.useState(1);
  const [currentStep, setCurrentStep] = React.useState(0);
  const [showDetails, setShowDetails] = React.useState(false);

  // Update activation step at interval
  React.useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % activations.length);
    }, 1500 / speed);
    return () => clearInterval(timer);
  }, [isPlaying, speed]);

  // Calculate neuron positions
  const getNeuronY = (layerIndex: number, neuronIndex: number) => {
    const layerNeurons = layers[layerIndex].neurons;
    const spacing = 50;
    const totalHeight = (layerNeurons - 1) * spacing;
    const startY = 150 - totalHeight / 2;
    return startY + neuronIndex * spacing;
  };

  // Render connections between layers
  const renderConnections = () => {
    const connections: ReactElement[] = [];
    
    for (let l = 0; l < layers.length - 1; l++) {
      const currentLayer = layers[l];
      const nextLayer = layers[l + 1];
      
      for (let i = 0; i < currentLayer.neurons; i++) {
        const x1 = currentLayer.x;
        const y1 = getNeuronY(l, i);
        
        for (let j = 0; j < nextLayer.neurons; j++) {
          const x2 = nextLayer.x;
          const y2 = getNeuronY(l + 1, j);
          
          // Calculate strength based on step
          const strengthFactor = l < currentStep ? 1 : 0.2;
          
          connections.push(
            <motion.line
              key={`conn-${l}-${i}-${j}`}
              x1={x1 + 15}
              y1={y1}
              x2={x2 - 15}
              y2={y2}
              stroke="#9ca3af"
              strokeWidth={1}
              initial={{ opacity: 0 }}
              animate={{ opacity: strengthFactor }}
              transition={{ duration: 0.3 / speed }}
            />
          );
        }
      }
    }
    
    return connections;
  };

  // Render neurons for each layer
  const renderNeurons = () => {
    const neurons: ReactElement[] = [];
    
    layers.forEach((layer, layerIndex) => {
      const currentActivations = activations[currentStep][layerIndex];
      
      for (let i = 0; i < layer.neurons; i++) {
        const x = layer.x;
        const y = getNeuronY(layerIndex, i);
        const activation = currentActivations[i];
        
        // Add neuron
        neurons.push(
          <g key={`neuron-${layerIndex}-${i}`}>
            <motion.circle
              cx={x}
              cy={y}
              r={15}
              fill="#2563eb"
              initial={{ opacity: 0.3 }}
              animate={{ opacity: 0.3 + 0.7 * activation }}
              transition={{ duration: 0.5 / speed }}
            />
            {showDetails && (
              <text
                x={x}
                y={y + 5}
                textAnchor="middle"
                fill="#fff"
                fontSize={10}
              >
                {activation.toFixed(1)}
              </text>
            )}
            
            {/* Add labels for input and output neurons */}
            {layerIndex === 0 && (
              <text
                x={x - 35}
                y={y + 5}
                textAnchor="end"
                fill="#4b5563"
                fontSize={12}
              >
                {inputLabels[i]}
              </text>
            )}
            
            {layerIndex === layers.length - 1 && (
              <text
                x={x + 35}
                y={y + 5}
                textAnchor="start"
                fill="#4b5563"
                fontSize={12}
              >
                {outputLabels[i]}
              </text>
            )}
          </g>
        );
      }
      
      // Add layer label
      neurons.push(
        <text
          key={`label-${layerIndex}`}
          x={layer.x}
          y={5}
          textAnchor="middle"
          fill="#4b5563"
          fontSize={14}
        >
          {layer.name}
        </text>
      );
    });
    
    return neurons;
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 relative bg-white border border-gray-200 rounded-md">
      <div className="flex flex-col items-center space-y-4">
        <div className="h-[320px] w-full flex items-center justify-center">
          <AnimatePresence mode="wait">
            <svg width={600} height={300} viewBox="0 0 600 300">
              {/* Background */}
              <rect x={0} y={0} width={600} height={300} fill="#fff" />
              
              {/* Connections between neurons */}
              {renderConnections()}
              
              {/* Neurons */}
              {renderNeurons()}
              
              {/* Current step indicator */}
              <text
                x={15}
                y={300}
                fill="#4b5563"
                fontSize={12}
              >
                Phase: {
                  currentStep === 0 ? "Input Processing" :
                  currentStep === 1 ? "Hidden Layer 1 Activation" :
                  currentStep === 2 ? "Hidden Layer 2 Activation" :
                  "Output Prediction"
                }
              </text>
            </svg>
          </AnimatePresence>
        </div>
        
      </div>

      {/* Playback controls */}
      <div className="absolute bottom-4 right-4 flex items-center space-x-2">
        <label className="text-xs flex items-center">
          <input 
            type="checkbox" 
            className="mr-1" 
            checked={showDetails} 
            onChange={() => setShowDetails(!showDetails)} 
          />
          Show Values
        </label>
        
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
