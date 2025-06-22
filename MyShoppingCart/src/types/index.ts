export interface GroceryItem {
  id: string;
  name: string;
  quantity: number;
  unit: 'kg' | 'lbs';
  pricePerUnit: number;
  totalPrice: number;
  category: string;
  dateAdded: Date;
  isFavorite?: boolean;
  purchaseCount?: number; // For frequently bought tracking
}

export type SortableFields = keyof Pick<GroceryItem, 'name' | 'quantity' | 'pricePerUnit' | 'totalPrice' | 'category'>;

export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface SortConfig {
  key: SortableFields;
  direction: 'ascending' | 'descending';
} 