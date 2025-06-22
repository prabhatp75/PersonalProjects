import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AddItemForm } from '../AddItemForm';

describe('AddItemForm', () => {
  const mockOnAdd = jest.fn();
  const mockCategories = [
    { id: '1', name: 'Fruits & Vegetables', color: '#4CAF50' },
    { id: '2', name: 'Dairy', color: '#2196F3' }
  ];

  beforeEach(() => {
    mockOnAdd.mockClear();
  });

  it('should render all form fields', () => {
    render(<AddItemForm categories={mockCategories} onAdd={mockOnAdd} />);
    
    expect(screen.getByLabelText('Item Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Quantity')).toBeInTheDocument();
    expect(screen.getByLabelText('Unit')).toBeInTheDocument();
    expect(screen.getByLabelText('Price per Unit ($)')).toBeInTheDocument();
    expect(screen.getByLabelText('Category')).toBeInTheDocument();
  });

  it('should validate required fields', async () => {
    render(<AddItemForm categories={mockCategories} onAdd={mockOnAdd} />);
    
    fireEvent.click(screen.getByText('Add Item'));
    
    expect(mockOnAdd).not.toHaveBeenCalled();
    expect(screen.getByLabelText('Item Name')).toBeRequired();
    expect(screen.getByLabelText('Quantity')).toBeRequired();
    expect(screen.getByLabelText('Price per Unit ($)')).toBeRequired();
  });

  it('should call onAdd with correct data when form is submitted', async () => {
    render(<AddItemForm categories={mockCategories} onAdd={mockOnAdd} />);
    
    await userEvent.type(screen.getByLabelText('Item Name'), 'Banana');
    await userEvent.type(screen.getByLabelText('Quantity'), '30');
    await userEvent.type(screen.getByLabelText('Price per Unit ($)'), '10');
    await userEvent.selectOptions(screen.getByLabelText('Category'), '1');
    
    fireEvent.click(screen.getByText('Add Item'));
    
    expect(mockOnAdd).toHaveBeenCalledWith(expect.objectContaining({
      name: 'Banana',
      quantity: 30,
      pricePerUnit: 10,
      category: '1',
      unit: 'kg'
    }));
  });
}); 