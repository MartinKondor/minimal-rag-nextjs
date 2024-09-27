'use client';

import React from 'react';

export function StepItem({
  icon,
  step,
  title,
  description,
}: {
  icon: React.ReactNode;
  step: number;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start space-x-3 p-3 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
      <div className="flex-shrink-0 bg-purple-100 dark:bg-purple-800 p-2 rounded-full">
        {icon}
      </div>
      <div>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          Step {step}: {title}
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {description}
        </p>
      </div>
    </div>
  );
}
