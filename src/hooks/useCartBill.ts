import { useMemo } from 'react';
import { useAppSelector } from '../store';
import { calculateBill } from '../utils/offerEngine';
import type { Bill } from '../types';

export const useCartBill = (): Bill => {
  const items = useAppSelector((state) => state.cart.items);
  return useMemo(() => calculateBill(items), [items]);
};
