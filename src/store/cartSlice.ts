import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { CartItem } from '../types';

export interface CartState {
  items: CartItem[];
  checkedOut: boolean;
}

const initialState: CartState = {
  items: [],
  checkedOut: false,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    incrementItem(state, action: PayloadAction<string>) {
      state.checkedOut = false;
      const existing = state.items.find((i) => i.productId === action.payload);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ productId: action.payload, quantity: 1 });
      }
    },
    decrementItem(state, action: PayloadAction<string>) {
      state.checkedOut = false;
      const idx = state.items.findIndex((i) => i.productId === action.payload);
      if (idx === -1) return;
      if (state.items[idx].quantity > 1) {
        state.items[idx].quantity -= 1;
      } else {
        state.items.splice(idx, 1);
      }
    },
    setItemQuantity(
      state,
      action: PayloadAction<{ productId: string; quantity: number }>,
    ) {
      state.checkedOut = false;
      const { productId, quantity } = action.payload;
      const idx = state.items.findIndex((i) => i.productId === productId);
      if (quantity <= 0) {
        if (idx !== -1) state.items.splice(idx, 1);
      } else if (idx !== -1) {
        state.items[idx].quantity = quantity;
      } else {
        state.items.push({ productId, quantity });
      }
    },
    removeItem(state, action: PayloadAction<string>) {
      state.checkedOut = false;
      state.items = state.items.filter((i) => i.productId !== action.payload);
    },
    checkout(state) {
      state.checkedOut = true;
    },
    clearCart(state) {
      state.items = [];
      state.checkedOut = false;
    },
  },
});

export const { incrementItem, decrementItem, setItemQuantity, removeItem, checkout, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
