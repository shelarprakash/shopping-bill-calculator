import { describe, it, expect } from 'vitest';
import cartReducer, {
  incrementItem,
  decrementItem,
  setItemQuantity,
  removeItem,
  checkout,
  clearCart,
} from '../store/cartSlice';
import type { CartState } from '../store/cartSlice';

const emptyState: CartState = { items: [], checkedOut: false };

describe('cartSlice', () => {
  describe('incrementItem', () => {
    it('adds a new item with quantity 1 when not in cart', () => {
      const state = cartReducer(emptyState, incrementItem('soup'));
      expect(state.items).toEqual([{ productId: 'soup', quantity: 1 }]);
    });

    it('increments quantity of existing item', () => {
      const initial: CartState = { items: [{ productId: 'soup', quantity: 2 }], checkedOut: false };
      const state = cartReducer(initial, incrementItem('soup'));
      expect(state.items[0].quantity).toBe(3);
    });

    it('resets checkedOut when item is added', () => {
      const initial: CartState = { items: [{ productId: 'soup', quantity: 1 }], checkedOut: true };
      const state = cartReducer(initial, incrementItem('soup'));
      expect(state.checkedOut).toBe(false);
    });
  });

  describe('decrementItem', () => {
    it('decrements quantity when > 1', () => {
      const initial: CartState = { items: [{ productId: 'milk', quantity: 3 }], checkedOut: false };
      const state = cartReducer(initial, decrementItem('milk'));
      expect(state.items[0].quantity).toBe(2);
    });

    it('removes item when quantity reaches 0', () => {
      const initial: CartState = { items: [{ productId: 'milk', quantity: 1 }], checkedOut: false };
      const state = cartReducer(initial, decrementItem('milk'));
      expect(state.items).toHaveLength(0);
    });

    it('does nothing for product not in cart', () => {
      const state = cartReducer(emptyState, decrementItem('unknown'));
      expect(state.items).toHaveLength(0);
    });
  });

  describe('setItemQuantity', () => {
    it('sets quantity for existing item', () => {
      const initial: CartState = { items: [{ productId: 'bread', quantity: 1 }], checkedOut: false };
      const state = cartReducer(initial, setItemQuantity({ productId: 'bread', quantity: 5 }));
      expect(state.items[0].quantity).toBe(5);
    });

    it('adds new item if not in cart', () => {
      const state = cartReducer(emptyState, setItemQuantity({ productId: 'bread', quantity: 3 }));
      expect(state.items).toEqual([{ productId: 'bread', quantity: 3 }]);
    });

    it('removes item when quantity set to 0', () => {
      const initial: CartState = { items: [{ productId: 'bread', quantity: 2 }], checkedOut: false };
      const state = cartReducer(initial, setItemQuantity({ productId: 'bread', quantity: 0 }));
      expect(state.items).toHaveLength(0);
    });
  });

  describe('removeItem', () => {
    it('removes the item entirely', () => {
      const initial: CartState = {
        items: [
          { productId: 'soup', quantity: 3 },
          { productId: 'milk', quantity: 1 },
        ],
        checkedOut: false,
      };
      const state = cartReducer(initial, removeItem('soup'));
      expect(state.items).toHaveLength(1);
      expect(state.items[0].productId).toBe('milk');
    });
  });

  describe('checkout', () => {
    it('sets checkedOut to true', () => {
      const initial: CartState = { items: [{ productId: 'soup', quantity: 1 }], checkedOut: false };
      const state = cartReducer(initial, checkout());
      expect(state.checkedOut).toBe(true);
    });
  });

  describe('clearCart', () => {
    it('removes all items and resets checkedOut', () => {
      const initial: CartState = {
        items: [
          { productId: 'soup', quantity: 3 },
          { productId: 'milk', quantity: 1 },
        ],
        checkedOut: true,
      };
      const state = cartReducer(initial, clearCart());
      expect(state.items).toHaveLength(0);
      expect(state.checkedOut).toBe(false);
    });
  });
});
