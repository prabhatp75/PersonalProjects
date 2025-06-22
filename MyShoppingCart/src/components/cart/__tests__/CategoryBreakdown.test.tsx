import React from 'react';
import { render, screen } from '@testing-library/react';
import { CategoryBreakdown } from '../CategoryBreakdown';

describe('CategoryBreakdown', () => {
  const mockItems = [
    { id: '1', name: 'Banana', quantity: 30, unit: 'kg', pricePerUnit: 10, totalPrice: 300, category: '1', dateAdded: new Date() },
    { id: '2', name: 'Egg', quantity: 10, unit: 'lbs', pricePerUnit: 6, totalPrice: 60, category: '2', dateAdded: new Date() }
  ];

  it('should render category breakdown correctly', () => {
    render(<CategoryBreakdown items={mockItems} />);
    
    expect(screen.getByText('Category Breakdown')).toBeInTheDocument();
    expect(screen.getByText('$300.00 (81.2%)')).toBeInTheDocument();
    expect(screen.getByText('$60.00 (14.6%)')).toBeInTheDocument();
  });

  it('should render empty state when no items', () => {
    render(<CategoryBreakdown items={[]} />);
    
    expect(screen.getByText('Category Breakdown')).toBeInTheDocument();
    expect(screen.queryByText('$')).not.toBeInTheDocument();
  });
}); 