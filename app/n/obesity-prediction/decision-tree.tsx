'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TreeNode {
	id: string;
	label: string;
	left?: TreeNode;
	right?: TreeNode;
}

// Predefined tree structures for different fields.
const treeOptions: Record<string, TreeNode> = {
	BMI: {
		id: 'root',
		label: 'BMI ≥ 25?',
		left: { id: 'left', label: 'Normal' },
		right: { id: 'right', label: 'Overweight' },
	},
	Age: {
		id: 'root',
		label: 'Age ≥ 40?',
		left: { id: 'left', label: 'Young' },
		right: { id: 'right', label: 'Old' },
	},
	Cholesterol: {
		id: 'root',
		label: 'Cholesterol > 200?',
		left: { id: 'left', label: 'Normal' },
		right: { id: 'right', label: 'High' },
	},
};

const positions = {
	root: { x: 300, y: 50 },
	left: { x: 150, y: 150 },
	right: { x: 450, y: 150 },
};

export function DecisionTree() {
	const [selectedField, setSelectedField] = React.useState('BMI');
	const tree = treeOptions[selectedField];

	// Updated: add exit and layout props for smoother transitions.
	const renderNode = (pos: { x: number; y: number }, label: string, key: string) => (
		<motion.g
			key={key}
			layout
			initial={{ opacity: 0, scale: 0.8 }}
			animate={{ opacity: 1, scale: 1 }}
			exit={{ opacity: 0, scale: 0.8 }}
			transition={{ duration: 0.5 }}
		>
			<motion.circle cx={pos.x} cy={pos.y} r={40} fill="#2563eb" />
			<motion.text
				x={pos.x}
				y={pos.y + 5}
				textAnchor="middle"
				fill="#fff"
				className="text-sm"
			>
				{label}
			</motion.text>
		</motion.g>
	);

	// Updated: add exit and layout for smooth removal/insertion of lines.
	const renderLine = (start: { x: number; y: number }, end: { x: number; y: number }, key: string) => (
		<motion.line
			key={key}
			layout
			x1={start.x}
			y1={start.y + 20}
			x2={end.x}
			y2={end.y - 20}
			stroke="#9ca3af"
			strokeWidth={2}
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.5 }}
		/>
	);

	return (
		<div className="w-full max-w-4xl mx-auto p-4 relative bg-white border border-gray-200 rounded-md">
			<div className="flex flex-col items-center space-y-4">
				{/* SVG Container */}
				<div className="h-[320px] w-full flex items-center justify-center">
					<AnimatePresence mode="wait">
						<svg width={600} height={300} viewBox="0 0 600 300">
							{/* ...existing background or grid code if any... */}
							{/* Lines connecting root to child nodes */}
							{tree.left && renderLine(positions.root, positions.left, 'line-left')}
							{tree.right && renderLine(positions.root, positions.right, 'line-right')}
							{/* Render nodes */}
							{renderNode(positions.root, tree.label, 'node-root')}
							{tree.left && renderNode(positions.left, tree.left.label, 'node-left')}
							{tree.right && renderNode(positions.right, tree.right.label, 'node-right')}
						</svg>
					</AnimatePresence>
				</div>
				{/* Information about decision tree */}
				<div className="text-sm text-gray-600 self-start">
					<div>
						Select Field to Build Decision Tree:
						<select
							value={selectedField}
							className="ml-2 p-1 border border-gray-300 rounded"
							onChange={(e) => setSelectedField(e.target.value)}
						>
							<option value="BMI">BMI</option>
							<option value="Age">Age</option>
							<option value="Cholesterol">Cholesterol</option>
						</select>
					</div>
					<p className="mt-2">
						A decision tree makes decisions based on splitting data by chosen fields. The
						root node shows the primary decision, with branch nodes representing outcomes.
					</p>
				</div>
			</div>
		</div>
	);
}
