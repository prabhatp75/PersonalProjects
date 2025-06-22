import React, { useState, useMemo } from 'react';
import { AddItemForm } from './AddItemForm';
import { ItemList } from './ItemList';
import { GroceryItem, Category, SortConfig, SortableFields } from '../../types';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { formatCurrency } from '../../utils/currency';
import { motion } from 'framer-motion';
import { FavoriteItems } from './FavoriteItems';
import { CategoryBreakdown } from './CategoryBreakdown';

const defaultCategories: Category[] = [
  { id: '1', name: 'Fruits & Vegetables', color: '#4CAF50' },
  { id: '2', name: 'Meat & Poultry', color: '#F44336' },
  { id: '3', name: 'Dairy', color: '#2196F3' },
  { id: '4', name: 'Pantry', color: '#FF9800' },
  { id: '5', name: 'Beverages', color: '#9C27B0' },
];

export const ShoppingCart: React.FC = () => {
  const [items, setItems] = useLocalStorage('shopping-cart', [] as GroceryItem[]);
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [editingItem, setEditingItem] = useState<GroceryItem | null>(null);

  const handleAddItem = (item: GroceryItem) => {
    setItems([...items, item]);
  };

  const handleDeleteItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleEditItem = (id: string) => {
    const itemToEdit = items.find(item => item.id === id);
    if (itemToEdit) {
      setEditingItem(itemToEdit);
    }
  };

  const handleUpdateItem = (updatedItem: GroceryItem) => {
    setItems(items.map(item => 
      item.id === updatedItem.id ? updatedItem : item
    ));
    setEditingItem(null);
  };

  const handleSort = (key: SortableFields) => {
    setSortConfig({
      key,
      direction:
        sortConfig?.key === key && sortConfig.direction === 'ascending'
          ? 'descending'
          : 'ascending',
    });
  };

  const handleToggleFavorite = (id: string) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
    ));
  };

  const handleAddFromFavorites = (favoriteItem: GroceryItem) => {
    const newItem = {
      ...favoriteItem,
      id: Date.now().toString(),
      dateAdded: new Date(),
      purchaseCount: (favoriteItem.purchaseCount || 0) + 1,
    };
    setItems([...items, newItem]);
  };

  const sortedAndFilteredItems = useMemo(() => {
    let filteredItems = items.filter((item) => {
      const matchesSearch = item.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory = !selectedCategory || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    if (sortConfig) {
      filteredItems.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          const comparison = aValue.localeCompare(bValue);
          return sortConfig.direction === 'ascending' ? comparison : -comparison;
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }

    return filteredItems;
  }, [items, searchTerm, selectedCategory, sortConfig]);

  const totalAmount = useMemo(() => {
    return sortedAndFilteredItems.reduce((sum, item) => sum + item.totalPrice, 0);
  }, [sortedAndFilteredItems]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">All Categories</option>
            {defaultCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <FavoriteItems
          items={items.filter(item => item.isFavorite)}
          onAddToCart={handleAddFromFavorites}
        />
      </motion.div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">
          {editingItem ? 'Edit Item' : 'Add New Item'}
        </h2>
        <AddItemForm 
          categories={defaultCategories} 
          onAdd={editingItem ? handleUpdateItem : handleAddItem}
          initialData={editingItem}
        />
        {editingItem && (
          <button
            onClick={() => setEditingItem(null)}
            className="mt-2 text-gray-600 hover:text-gray-800"
          >
            Cancel Editing
          </button>
        )}
      </div>

      <ItemList
        items={sortedAndFilteredItems}
        onDelete={handleDeleteItem}
        onEdit={handleEditItem}
        onToggleFavorite={handleToggleFavorite}
        sortConfig={sortConfig}
        onSort={handleSort}
      />

      <CategoryBreakdown items={items} />

      <motion.div
        className="mt-8 p-4 bg-gray-50 rounded-lg"
        animate={{ scale: items.length > 0 ? 1 : 0.95 }}
      >
        <div className="text-xl font-semibold text-gray-900">
          Total: {formatCurrency(totalAmount)}
        </div>
      </motion.div>
    </div>
  );
}; 