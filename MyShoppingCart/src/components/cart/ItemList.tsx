import React from 'react';
import { GroceryItem, SortConfig, SortableFields } from '../../types';
import { formatCurrency } from '../../utils/currency';
import { motion, AnimatePresence } from 'framer-motion';

interface ItemListProps {
  items: GroceryItem[];
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  sortConfig: SortConfig | null;
  onSort: (key: SortableFields) => void;
}

export const ItemList: React.FC<ItemListProps> = ({
  items,
  onDelete,
  onEdit,
  onToggleFavorite,
  sortConfig,
  onSort,
}) => {
  const getSortIndicator = (key: keyof GroceryItem) => {
    if (sortConfig?.key === key) {
      return sortConfig.direction === 'ascending' ? ' ↑' : ' ↓';
    }
    return '';
  };

  return (
    <div className="mt-8 overflow-x-auto">
      <div className="inline-block min-w-full align-middle">
        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer"
                  onClick={() => onSort('name')}
                >
                  Name{getSortIndicator('name')}
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer"
                  onClick={() => onSort('quantity')}
                >
                  Quantity{getSortIndicator('quantity')}
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer"
                  onClick={() => onSort('pricePerUnit')}
                >
                  Price per Unit{getSortIndicator('pricePerUnit')}
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer"
                  onClick={() => onSort('totalPrice')}
                >
                  Total Price{getSortIndicator('totalPrice')}
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer"
                  onClick={() => onSort('category')}
                >
                  Category{getSortIndicator('category')}
                </th>
                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              <AnimatePresence>
                {items.map((item) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.2 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                      <div className="flex items-center">
                        <button
                          onClick={() => onToggleFavorite(item.id)}
                          className="mr-2 focus:outline-none"
                        >
                          {item.isFavorite ? (
                            <span className="text-yellow-400">★</span>
                          ) : (
                            <span className="text-gray-300 hover:text-yellow-400">☆</span>
                          )}
                        </button>
                        {item.name}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {item.quantity} {item.unit}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {formatCurrency(item.pricePerUnit)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {formatCurrency(item.totalPrice)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {item.category}
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => onEdit(item.id)}
                          className="inline-flex items-center px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                          Edit
                        </button>
                        <button
                          onClick={() => onDelete(item.id)}
                          className="inline-flex items-center px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}; 