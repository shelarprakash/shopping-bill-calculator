import type { CartItem, Offer, Product, AppliedOffer, Bill, BillLineItem } from '../types';
import { PRODUCTS } from '../data/products';
import { OFFERS } from '../data/offers';

const getProduct = (id: string): Product | undefined =>
  PRODUCTS.find((p) => p.id === id);

const getQuantity = (items: CartItem[], productId: string): number =>
  items.find((i) => i.productId === productId)?.quantity ?? 0;

const round2dp = (value: number): number => Math.round(value * 100) / 100;

const applyPercentOff = (
  offer: Offer,
  items: CartItem[],
): AppliedOffer | null => {
  const product = getProduct(offer.targetProductId);
  if (!product) return null;

  const qty = getQuantity(items, offer.targetProductId);
  if (qty < offer.requiredQuantity) return null;

  const saving = round2dp(product.price * (offer.discountPercent! / 100) * qty);
  if (saving <= 0) return null;

  return { offerId: offer.id, description: offer.description, saving };
};

const applyBuyNGetPercentOffOther = (
  offer: Offer,
  items: CartItem[],
): AppliedOffer | null => {
  const targetProduct = getProduct(offer.targetProductId);
  if (!targetProduct || !offer.triggerProductId) return null;

  const triggerQty = getQuantity(items, offer.triggerProductId);
  const targetQty = getQuantity(items, offer.targetProductId);

  const applications = Math.floor(triggerQty / offer.requiredQuantity);
  const discountedQty = Math.min(applications, targetQty);
  if (discountedQty <= 0) return null;

  const saving = round2dp(
    targetProduct.price * (offer.discountPercent! / 100) * discountedQty,
  );
  if (saving <= 0) return null;

  return { offerId: offer.id, description: offer.description, saving };
};

const applyMultiBuyDiscount = (
  offer: Offer,
  items: CartItem[],
): AppliedOffer | null => {
  const product = getProduct(offer.targetProductId);
  if (!product || offer.payFor === undefined) return null;

  const qty = getQuantity(items, offer.targetProductId);
  const completeSets = Math.floor(qty / offer.requiredQuantity);
  const freeItems = completeSets * (offer.requiredQuantity - offer.payFor);
  if (freeItems <= 0) return null;

  const saving = round2dp(product.price * freeItems);
  return { offerId: offer.id, description: offer.description, saving };
};

const applyBuyOneGetOneFree = (
  offer: Offer,
  items: CartItem[],
): AppliedOffer | null => {
  const product = getProduct(offer.targetProductId);
  if (!product) return null;

  const qty = getQuantity(items, offer.targetProductId);
  if (qty < offer.requiredQuantity) return null;

  // Free items are a bonus — no deduction from cart total
  const freeQty = qty;
  const freeValue = round2dp(product.price * freeQty);

  return {
    offerId: offer.id,
    description: offer.description,
    saving: 0,
    freeItems: { productName: product.name, quantity: freeQty, value: freeValue },
  };
};

const OFFER_HANDLERS: Record<
  Offer['type'],
  (offer: Offer, items: CartItem[]) => AppliedOffer | null
> = {
  PERCENT_OFF: applyPercentOff,
  BUY_N_GET_PERCENT_OFF_OTHER: applyBuyNGetPercentOffOther,
  MULTI_BUY_DISCOUNT: applyMultiBuyDiscount,
  BUY_ONE_GET_ONE_FREE: applyBuyOneGetOneFree,
};

export const calculateBill = (cartItems: CartItem[]): Bill => {
  const lineItems: BillLineItem[] = cartItems
    .filter((item) => item.quantity > 0)
    .reduce<BillLineItem[]>((acc, item) => {
      const product = getProduct(item.productId);
      if (!product) return acc;
      acc.push({
        product,
        quantity: item.quantity,
        lineTotal: round2dp(product.price * item.quantity),
      });
      return acc;
    }, []);

  const subtotal = round2dp(lineItems.reduce((sum, i) => sum + i.lineTotal, 0));

  const appliedOffers: AppliedOffer[] = OFFERS.reduce<AppliedOffer[]>(
    (acc, offer) => {
      const handler = OFFER_HANDLERS[offer.type];
      const result = handler(offer, cartItems);
      if (result) acc.push(result);
      return acc;
    },
    [],
  );

  const totalSavings = round2dp(
    appliedOffers.reduce((sum, o) => sum + o.saving, 0),
  );
  const total = round2dp(Math.max(0, subtotal - totalSavings));

  return { lineItems, subtotal, appliedOffers, totalSavings, total };
};
