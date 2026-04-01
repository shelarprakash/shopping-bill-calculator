import type { Product } from '../types';

export const PRODUCTS: Product[] = [
  {
    id: 'bread',
    name: 'Bread',
    price: 1.10,
    unit: 'loaf',
    emoji: '🍞',
    category: 'Bakery',
  },
  {
    id: 'milk',
    name: 'Milk',
    price: 0.50,
    unit: 'bottle',
    emoji: '🥛',
    category: 'Dairy',
  },
  {
    id: 'cheese',
    name: 'Cheese',
    price: 0.90,
    unit: 'pack',
    emoji: '🧀',
    category: 'Dairy',
  },
  {
    id: 'soup',
    name: 'Soup',
    price: 0.60,
    unit: 'tin',
    emoji: '🥫',
    category: 'Pantry',
  },
  {
    id: 'butter',
    name: 'Butter',
    price: 1.20,
    unit: 'pack',
    emoji: '🧈',
    category: 'Dairy',
  },
];
