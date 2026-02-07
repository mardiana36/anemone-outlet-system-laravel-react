import React from 'react';
import { FaBoxOpen, FaShoppingCart, FaChartBar } from 'react-icons/fa';

const ICONS = {
  product: FaBoxOpen,
  order: FaShoppingCart,
  dashboard: FaChartBar,
};

const EmptyState = ({ 
  icon = 'product', 
  title = 'No data found', 
  description = 'There is no data to display at the moment.',
  action = null 
}) => {
  const IconComponent = ICONS[icon] || FaBoxOpen;

  return (
    <div className="text-center py-12 px-4">
      <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-gray-100 mb-6">
        <IconComponent className="h-12 w-12 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 max-w-md mx-auto">{description}</p>
      {action && (
        <div className="mt-6">
          {action}
        </div>
      )}
    </div>
  );
};

export default EmptyState;