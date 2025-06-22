import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ShoppingCart } from '../ShoppingCart';

describe('ShoppingCart', () => {
  it('should render shopping cart with initial empty state', () => {
    render(<ShoppingCart />);
    
    expect(screen.getByText('Shopping Cart')).toBeInTheDocument();
    expect(screen.getByText('Total: $0.00')).toBeInTheDocument();
    expect(screen.getByText('Favorite Items')).toBeInTheDocument();
    expect(screen.getByText('Category Breakdown')).toBeInTheDocument();
  });

  it('should add new item to cart', async () => {
    render(<ShoppingCart />);
    
    // Fill out the form
    await userEvent.type(screen.getByLabelText('Item Name'), 'Banana');
    await userEvent.type(screen.getByLabelText('Quantity'), '30');
    await userEvent.selectOptions(screen.getByLabelText('Unit'), 'kg');
    await userEvent.type(screen.getByLabelText('Price per Unit ($)'), '10');
    await userEvent.selectOptions(screen.getByLabelText('Category'), '1');
    
    // Submit the form
    fireEvent.click(screen.getByText('Add Item'));
    
    // Verify item was added
    expect(screen.getByText('Banana')).toBeInTheDocument();
    expect(screen.getByText('30 kg')).toBeInTheDocument();
    expect(screen.getByText('$300.00')).toBeInTheDocument();
  });

  it('should delete item from cart', async () => {
    render(<ShoppingCart />);
    
    // Add an item first
    await userEvent.type(screen.getByLabelText('Item Name'), 'Banana');
    await userEvent.type(screen.getByLabelText('Quantity'), '30');
    fireEvent.click(screen.getByText('Add Item'));
    
    // Delete the item
    fireEvent.click(screen.getByText('Delete'));
    
    // Verify item was removed
    expect(screen.queryByText('Banana')).not.toBeInTheDocument();
  });

  it('should update total price correctly', async () => {
    render(<ShoppingCart />);
    
    // Add multiple items
    const items = [
      { name: 'Banana', quantity: '30', price: '10', total: '300.00' },
      { name: 'Apple', quantity: '5', price: '7', total: '35.00' }
    ];
    
    for (const item of items) {
      await userEvent.type(screen.getByLabelText('Item Name'), item.name);
      await userEvent.type(screen.getByLabelText('Quantity'), item.quantity);
      await userEvent.type(screen.getByLabelText('Price per Unit ($)'), item.price);
      fireEvent.click(screen.getByText('Add Item'));
    }
    
    expect(screen.getByText('Total: $335.00')).toBeInTheDocument();
  });
}); 