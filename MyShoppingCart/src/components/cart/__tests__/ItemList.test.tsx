import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ItemList } from '../ItemList';

describe('ItemList', () => {
  const mockItems = [
    { id: '1', name: 'Banana', quantity: 30, unit: 'kg', pricePerUnit: 10, totalPrice: 300, category: '1', dateAdded: new Date() },
    { id: '2', name: 'Egg', quantity: 10, unit: 'lbs', pricePerUnit: 6, totalPrice: 60, category: '2', dateAdded: new Date() }
  ];

  const mockHandlers = {
    onDelete: jest.fn(),
    onEdit: jest.fn(),
    onToggleFavorite: jest.fn(),
    onSort: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render all items', () => {
    render(
      <ItemList
        items={mockItems}
        sortConfig={null}
        {...mockHandlers}
      />
    );
    
    expect(screen.getByText('Banana')).toBeInTheDocument();
    expect(screen.getByText('Egg')).toBeInTheDocument();
    expect(screen.getByText('30 kg')).toBeInTheDocument();
    expect(screen.getByText('10 lbs')).toBeInTheDocument();
  });

  it('should call onDelete when delete button is clicked', () => {
    render(
      <ItemList
        items={mockItems}
        sortConfig={null}
        {...mockHandlers}
      />
    );
    
    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);
    
    expect(mockHandlers.onDelete).toHaveBeenCalledWith('1');
  });

  it('should call onEdit when edit button is clicked', () => {
    render(
      <ItemList
        items={mockItems}
        sortConfig={null}
        {...mockHandlers}
      />
    );
    
    const editButtons = screen.getAllByText('Edit');
    fireEvent.click(editButtons[0]);
    
    expect(mockHandlers.onEdit).toHaveBeenCalledWith('1');
  });

  it('should sort items when header is clicked', () => {
    render(
      <ItemList
        items={mockItems}
        sortConfig={null}
        {...mockHandlers}
      />
    );
    
    fireEvent.click(screen.getByText('Name'));
    
    expect(mockHandlers.onSort).toHaveBeenCalledWith('name');
  });
}); 