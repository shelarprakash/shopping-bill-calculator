import { describe, it, expect } from 'vitest';
import { calculateBill } from '../utils/offerEngine';
import type { CartItem } from '../types';

const item = (productId: string, quantity: number): CartItem => ({
  productId,
  quantity,
});

describe('calculateBill', () => {
  describe('no offers', () => {
    it('returns zero totals for empty cart', () => {
      const bill = calculateBill([]);
      expect(bill.subtotal).toBe(0);
      expect(bill.total).toBe(0);
      expect(bill.appliedOffers).toHaveLength(0);
    });

    it('calculates subtotal for single item', () => {
      const bill = calculateBill([item('milk', 1)]);
      expect(bill.subtotal).toBe(0.50);
      expect(bill.total).toBe(0.50);
      expect(bill.totalSavings).toBe(0);
    });

    it('calculates subtotal for multiple items', () => {
      // soup 60p × 2 = 1.20, milk 50p × 1 = 0.50 → 1.70
      const bill = calculateBill([item('soup', 2), item('milk', 1)]);
      expect(bill.subtotal).toBe(1.70);
      expect(bill.total).toBe(1.70);
    });
  });

  describe('offer: Buy a Cheese, get a second Cheese free', () => {
    it('does not apply with 1 cheese (need at least 2 for BOGOF)', () => {
      const bill = calculateBill([item('cheese', 1)]);
      const offerApplied = bill.appliedOffers.find(
        (o) => o.offerId === 'offer-cheese-bogof',
      );
      expect(offerApplied).toBeUndefined();
      expect(bill.total).toBe(0.90);
    });

    it('applies for 2 cheese — buy 2 pay for 1', () => {
      const bill = calculateBill([item('cheese', 2)]);
      const offerApplied = bill.appliedOffers.find(
        (o) => o.offerId === 'offer-cheese-bogof',
      );
      expect(offerApplied).toBeDefined();
      expect(offerApplied?.saving).toBe(0.90);
      expect(offerApplied?.freeItems).toEqual({
        productName: 'Cheese',
        quantity: 1,
        value: 0.90,
      });
      // Pay for 1 cheese: 2 × £0.90 - £0.90 = £0.90
      expect(bill.total).toBe(0.90);
    });

    it('applies for 3 cheese — 1 free, pay for 2', () => {
      const bill = calculateBill([item('cheese', 3)]);
      const offerApplied = bill.appliedOffers.find(
        (o) => o.offerId === 'offer-cheese-bogof',
      );
      expect(offerApplied?.saving).toBe(0.90);
      expect(offerApplied?.freeItems?.quantity).toBe(1);
      // 3 × £0.90 - £0.90 = £1.80
      expect(bill.total).toBe(1.80);
    });

    it('applies for 4 cheese — 2 free, pay for 2', () => {
      const bill = calculateBill([item('cheese', 4)]);
      const offerApplied = bill.appliedOffers.find(
        (o) => o.offerId === 'offer-cheese-bogof',
      );
      expect(offerApplied?.saving).toBe(1.80);
      expect(offerApplied?.freeItems?.quantity).toBe(2);
      // 4 × £0.90 - £1.80 = £1.80
      expect(bill.total).toBe(1.80);
    });
  });

  describe('offer: Buy a Soup, get half price Bread', () => {
    it('does NOT apply with soup but no bread', () => {
      const bill = calculateBill([item('soup', 1)]);
      const offerApplied = bill.appliedOffers.find(
        (o) => o.offerId === 'offer-soup-bread',
      );
      expect(offerApplied).toBeUndefined();
    });

    it('does NOT apply with bread but no soup', () => {
      const bill = calculateBill([item('bread', 1)]);
      const offerApplied = bill.appliedOffers.find(
        (o) => o.offerId === 'offer-soup-bread',
      );
      expect(offerApplied).toBeUndefined();
    });

    it('applies half-price bread with 1 soup and 1 bread', () => {
      const bill = calculateBill([item('soup', 1), item('bread', 1)]);
      const offerApplied = bill.appliedOffers.find(
        (o) => o.offerId === 'offer-soup-bread',
      );
      expect(offerApplied).toBeDefined();
      // bread £1.10 × 50% = 55p saving
      expect(offerApplied?.saving).toBe(0.55);
      // 60p + £1.10 - 55p = £1.15
      expect(bill.total).toBe(1.15);
    });

    it('applies to multiple breads with multiple soups', () => {
      const bill = calculateBill([item('soup', 3), item('bread', 2)]);
      const offerApplied = bill.appliedOffers.find(
        (o) => o.offerId === 'offer-soup-bread',
      );
      // 3 soups → 3 applications, but only 2 breads → 2 discounted
      // 2 × £1.10 × 50% = £1.10 saving
      expect(offerApplied?.saving).toBe(1.10);
    });

    it('limits discount to number of soups', () => {
      const bill = calculateBill([item('soup', 1), item('bread', 3)]);
      const offerApplied = bill.appliedOffers.find(
        (o) => o.offerId === 'offer-soup-bread',
      );
      // 1 soup → 1 application, 3 breads but only 1 discounted
      // 1 × £1.10 × 50% = 55p saving
      expect(offerApplied?.saving).toBe(0.55);
    });
  });

  describe('offer: Get a third off Butter', () => {
    it('applies a third off for 1 butter', () => {
      const bill = calculateBill([item('butter', 1)]);
      const offerApplied = bill.appliedOffers.find(
        (o) => o.offerId === 'offer-butter',
      );
      expect(offerApplied).toBeDefined();
      // £1.20 × (1/3) = 40p saving
      expect(offerApplied?.saving).toBe(0.40);
      // £1.20 - 40p = 80p
      expect(bill.total).toBe(0.80);
    });

    it('applies a third off for 3 butter', () => {
      const bill = calculateBill([item('butter', 3)]);
      const offerApplied = bill.appliedOffers.find(
        (o) => o.offerId === 'offer-butter',
      );
      // 3 × £1.20 × (1/3) = £1.20 saving
      expect(offerApplied?.saving).toBe(1.20);
      // 3 × £1.20 - £1.20 = £2.40
      expect(bill.total).toBe(2.40);
    });
  });

  describe('multiple offers in same cart', () => {
    it('applies all applicable offers independently', () => {
      const bill = calculateBill([
        item('soup', 1),
        item('bread', 1),
        item('cheese', 2),
        item('butter', 1),
      ]);
      expect(bill.appliedOffers).toHaveLength(3);
      // 0.90 (cheese BOGOF) + 0.55 (bread half price) + 0.40 (butter third off) = 1.85
      expect(bill.totalSavings).toBe(1.85);
      const cheeseOffer = bill.appliedOffers.find(
        (o) => o.offerId === 'offer-cheese-bogof',
      );
      expect(cheeseOffer?.saving).toBe(0.90);
      expect(cheeseOffer?.freeItems?.quantity).toBe(1);
    });
  });
});
