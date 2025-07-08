'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface ProjectCardProps {
  title: string;
  description: string;
  link: string;
  image?: string;
  tags?: string[];
  external?: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  description,
  link,
  image,
  tags = [],
  external = false,
}) => {
  const cardContent = (
    <motion.div 
      whileHover={{ y: -5 }}
      className="h-full p-5 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex flex-col"
    >
      <h3 className="text-lg font-medium text-gray-900 dark:text-zinc-200 mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-zinc-400 text-sm mb-4 flex-grow">{description}</p>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-1 bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );

  if (external) {
    return (
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="block h-full"
      >
        {cardContent}
      </a>
    );
  }

  return (
    <Link href={link} className="block h-full">
      {cardContent}
    </Link>
  );
}

function ProjectGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-6 mt-6 mb-8">
      {children}
    </div>
  );
}

// Export the components
export { ProjectCard, ProjectGrid };
