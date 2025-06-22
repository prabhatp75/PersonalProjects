import { useState, useEffect } from 'react';
import { GroceryItem } from '../types';

export const useLocalStorage = (key: string, initialValue: GroceryItem[]) => {
  const [storedValue, setStoredValue] = useState<GroceryItem[]>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue] as const;
}; 