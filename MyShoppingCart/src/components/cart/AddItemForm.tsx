import React, { useState, useEffect } from 'react';
import { GroceryItem, Category } from '../../types';

interface AddItemFormProps {
  categories: Category[];
  onAdd: (item: GroceryItem) => void;
  initialData?: GroceryItem | null;
}

export const AddItemForm: React.FC<AddItemFormProps> = ({ categories, onAdd, initialData }) => {
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    unit: 'kg' as 'kg' | 'lbs',
    pricePerUnit: '',
    category: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        quantity: initialData.quantity.toString(),
        unit: initialData.unit,
        pricePerUnit: initialData.pricePerUnit.toString(),
        category: initialData.category,
      });
    } else {
      setFormData({
        name: '',
        quantity: '',
        unit: 'kg',
        pricePerUnit: '',
        category: '',
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const item: GroceryItem = {
      id: initialData?.id || Date.now().toString(),
      name: formData.name,
      quantity: parseFloat(formData.quantity),
      unit: formData.unit,
      pricePerUnit: parseFloat(formData.pricePerUnit),
      totalPrice: parseFloat(formData.quantity) * parseFloat(formData.pricePerUnit),
      category: formData.category,
      dateAdded: initialData?.dateAdded || new Date(),
    };

    onAdd(item);
    
    if (!initialData) {
      setFormData({
        name: '',
        quantity: '',
        unit: 'kg',
        pricePerUnit: '',
        category: '',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 p-4 bg-white rounded shadow">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Item Name</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Quantity</label>
          <input
            type="number"
            step="0.01"
            required
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Unit</label>
          <select
            value={formData.unit}
            onChange={(e) => setFormData({ ...formData, unit: e.target.value as 'kg' | 'lbs' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="kg">kg</option>
            <option value="lbs">lbs</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Price per Unit ($)</label>
          <input
            type="number"
            step="0.01"
            required
            value={formData.pricePerUnit}
            onChange={(e) => setFormData({ ...formData, pricePerUnit: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          type="submit"
          className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
          </svg>
          {initialData ? 'Update Item' : 'Add Item'}
        </button>
      </div>
    </form>
  );
}; 