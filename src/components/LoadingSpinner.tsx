import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <div className="relative h-14 w-14">
        <div className="absolute inset-0 rounded-full border-4 border-primary-100" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary-600 border-r-accent-500 animate-spin" />
      </div>
      <p className="text-sm font-medium text-gray-500 animate-pulse">Chargement des produits…</p>
    </div>
  );
};

export default LoadingSpinner;
