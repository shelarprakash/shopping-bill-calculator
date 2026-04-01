import type { Offer } from '../types';

export const OFFERS: Offer[] = [
  {
    id: 'offer-cheese-bogof',
    description: 'Buy a Cheese, get a second Cheese free!',
    type: 'BUY_ONE_GET_ONE_FREE',
    targetProductId: 'cheese',
    requiredQuantity: 1,
  },
  {
    id: 'offer-soup-bread',
    description: 'Buy a Soup, get a half price Bread!',
    type: 'BUY_N_GET_PERCENT_OFF_OTHER',
    targetProductId: 'bread',
    triggerProductId: 'soup',
    requiredQuantity: 1,
    discountPercent: 50,
  },
  {
    id: 'offer-butter',
    description: 'Get a third off Butter!',
    type: 'PERCENT_OFF',
    targetProductId: 'butter',
    requiredQuantity: 1,
    discountPercent: 100 / 3,
  },
];
