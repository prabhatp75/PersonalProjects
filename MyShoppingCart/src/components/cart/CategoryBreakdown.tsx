import React from 'react';
import { GroceryItem } from '../../types';

interface CategoryBreakdown {
  items: GroceryItem[];
}

export const CategoryBreakdown: React.FC<CategoryBreakdown> = ({ items }) => {
  const categoryTotals = items.reduce((acc, item) => {
    const category = item.category;
    acc[category] = (acc[category] || 0) + item.totalPrice;
    return acc;
  }, {} as Record<string, number>);

  const total = Object.values(categoryTotals).reduce((sum, value) => sum + value, 0);

  return (
    <div className="mt-8 bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Category Breakdown</h2>
      <div className="space-y-4">
        {Object.entries(categoryTotals).map(([category, amount]) => {
          const percentage = ((amount / total) * 100).toFixed(1);
          return (
            <div key={category} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{category}</span>
                <span>${amount.toFixed(2)} ({percentage}%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}; 