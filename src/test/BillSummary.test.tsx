import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '../store/cartSlice';
import BillSummary from '../components/BillSummary';
import type { CartItem } from '../types';

const makeStore = (items: CartItem[] = [], checkedOut = false) =>
  configureStore({
    reducer: { cart: cartReducer },
    preloadedState: { cart: { items, checkedOut } },
  });

const renderWithStore = (items: CartItem[] = [], checkedOut = false) =>
  render(
    <Provider store={makeStore(items, checkedOut)}>
      <BillSummary />
    </Provider>,
  );

describe('BillSummary', () => {
  it('shows empty state when cart is empty', () => {
    renderWithStore();
    expect(screen.getByText(/your basket is empty/i)).toBeInTheDocument();
  });

  it('displays line items and subtotal', () => {
    renderWithStore([{ productId: 'milk', quantity: 2 }]);
    expect(screen.getByText('Milk')).toBeInTheDocument();
    expect(screen.getByTestId('subtotal')).toHaveTextContent('£1.00');
  });

  it('shows checkout button before checkout', () => {
    renderWithStore([{ productId: 'milk', quantity: 1 }]);
    expect(screen.getByTestId('checkout-btn')).toBeInTheDocument();
    expect(screen.queryByTestId('total')).not.toBeInTheDocument();
  });

  it('opens dialog on checkout click and shows saved receipt after save', async () => {
    const user = userEvent.setup();
    renderWithStore([
      { productId: 'soup', quantity: 1 },
      { productId: 'bread', quantity: 1 },
    ]);
    await user.click(screen.getByTestId('checkout-btn'));
    expect(screen.getByText('Your Order Summary')).toBeInTheDocument();

    // Click Save Order → shows saved receipt
    await user.click(screen.getByTestId('checkout-confirm'));
    expect(screen.getByText('Order Saved!')).toBeInTheDocument();
    expect(screen.getByText('Grand Total')).toBeInTheDocument();

    // Click Done → applies offers to bill
    await user.click(screen.getByTestId('checkout-done'));
    expect(screen.getByTestId('offer-offer-soup-bread')).toBeInTheDocument();
    expect(screen.getByTestId('total-savings')).toHaveTextContent('-£0.55');
    expect(screen.getByTestId('total')).toHaveTextContent('£1.15');
  });

  it('closes dialog when Go Back is clicked', async () => {
    const user = userEvent.setup();
    renderWithStore([{ productId: 'milk', quantity: 1 }]);
    await user.click(screen.getByTestId('checkout-btn'));
    expect(screen.getByText('Your Order Summary')).toBeInTheDocument();
    await user.click(screen.getByTestId('checkout-cancel'));
    expect(screen.queryByText('Your Order Summary')).not.toBeInTheDocument();
  });

  it('does not show offers before checkout', () => {
    renderWithStore([
      { productId: 'soup', quantity: 1 },
      { productId: 'bread', quantity: 1 },
    ]);
    expect(screen.queryByTestId('offer-offer-soup-bread')).not.toBeInTheDocument();
  });

  it('clears cart when "Clear basket" button is clicked', async () => {
    const user = userEvent.setup();
    renderWithStore([{ productId: 'milk', quantity: 1 }]);
    await user.click(screen.getByText(/clear basket/i));
    expect(screen.getByText(/your basket is empty/i)).toBeInTheDocument();
  });
});
