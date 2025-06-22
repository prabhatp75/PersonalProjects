import React from 'react';
import { GroceryItem } from '../../types';
import { motion } from 'framer-motion';

interface FavoriteItemsProps {
  items: GroceryItem[];
  onAddToCart: (item: GroceryItem) => void;
}

export const FavoriteItems: React.FC<FavoriteItemsProps> = ({ items, onAddToCart }) => {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-4">Favorite Items</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {items.filter(item => item.isFavorite).map(item => (
          <motion.div
            key={item.id}
            whileHover={{ scale: 1.05 }}
            className="bg-white p-4 rounded-lg shadow"
          >
            <div className="text-sm font-medium">{item.name}</div>
            <div className="text-gray-500 text-xs">
              ${item.pricePerUnit} per {item.unit}
            </div>
            <button
              onClick={() => onAddToCart(item)}
              className="mt-2 w-full bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700"
            >
              Add to Cart
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}; 