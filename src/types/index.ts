export interface Product {
  id: string;
  name: string;
  price: number;
  unit: string;
  emoji: string;
  category: string;
}

export type OfferType =
  | 'PERCENT_OFF'
  | 'BUY_N_GET_PERCENT_OFF_OTHER'
  | 'MULTI_BUY_DISCOUNT'
  | 'BUY_ONE_GET_ONE_FREE';

export interface Offer {
  id: string;
  description: string;
  type: OfferType;
  targetProductId: string;
  triggerProductId?: string;
  requiredQuantity: number;
  discountPercent?: number;
  payFor?: number;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface AppliedOffer {
  offerId: string;
  description: string;
  saving: number;
  freeItems?: { productName: string; quantity: number; value: number };
}

export interface BillLineItem {
  product: Product;
  quantity: number;
  lineTotal: number;
}

export interface Bill {
  lineItems: BillLineItem[];
  subtotal: number;
  appliedOffers: AppliedOffer[];
  totalSavings: number;
  total: number;
}
