import { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { formatCurrency } from '../utils/formatCurrency';
import { TagIcon, ReceiptIcon } from './icons';

interface OrderLineItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  lineTotal: number;
}

interface OrderOffer {
  offerId: string;
  description: string;
  saving: number;
  freeItems?: { productName: string; quantity: number; value: number };
}

interface Order {
  id: string;
  lineItems: OrderLineItem[];
  subtotal: number;
  appliedOffers: OrderOffer[];
  totalSavings: number;
  total: number;
  createdAt: { seconds: number } | null;
}

interface OrderHistoryProps {
  onClose: () => void;
}

const OrderHistory = ({ onClose }: OrderHistoryProps) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        const fetched = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Order[];
        setOrders(fetched);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const formatDate = (timestamp: { seconds: number } | null) => {
    if (!timestamp) return 'Unknown date';
    return new Date(timestamp.seconds * 1000).toLocaleString('en-GB', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full overflow-hidden max-h-[90vh] flex flex-col">
        <div className="bg-brand-700 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ReceiptIcon className="w-5 h-5" />
            <h3 className="font-bold text-lg">Order History</h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white text-xl font-bold leading-none"
          >
            &times;
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading && (
            <div className="flex items-center justify-center py-16">
              <p className="text-gray-500">Loading orders...</p>
            </div>
          )}

          {error && (
            <div className="p-6">
              <p className="text-red-600 text-sm bg-red-50 p-3 rounded">{error}</p>
            </div>
          )}

          {!loading && !error && orders.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
              <span className="text-5xl mb-4">📋</span>
              <p className="text-gray-500 font-medium">No orders yet</p>
              <p className="text-gray-400 text-sm mt-1">
                Your saved orders will appear here
              </p>
            </div>
          )}

          {!loading && !error && orders.length > 0 && (
            <div className="divide-y divide-gray-100">
              {orders.map((order) => (
                <div key={order.id} className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-400">
                      {formatDate(order.createdAt)}
                    </p>
                    <p className="font-bold text-brand-700 text-lg">
                      {formatCurrency(order.total)}
                    </p>
                  </div>

                  {/* Line items */}
                  <div className="space-y-1">
                    {order.lineItems.map((item) => (
                      <div
                        key={item.productId}
                        className="flex justify-between text-sm text-gray-600"
                      >
                        <span>
                          {item.productName} × {item.quantity}
                        </span>
                        <span>{formatCurrency(item.lineTotal)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Subtotal */}
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Subtotal</span>
                    <span>{formatCurrency(order.subtotal)}</span>
                  </div>

                  {/* Offers */}
                  {order.appliedOffers.length > 0 && (
                    <div className="bg-green-50 border border-green-100 rounded-lg p-3 space-y-1">
                      <div className="flex items-center gap-1.5 text-green-700">
                        <TagIcon className="w-3 h-3" />
                        <span className="text-xs font-semibold uppercase tracking-wide">
                          Offers
                        </span>
                      </div>
                      {order.appliedOffers.map((offer) => (
                        <div
                          key={offer.offerId}
                          className="flex justify-between text-xs text-green-700"
                        >
                          <span>{offer.description}</span>
                          <span className="font-semibold flex-shrink-0 ml-2">
                            {offer.freeItems
                              ? `${offer.freeItems.quantity} FREE`
                              : `-${formatCurrency(offer.saving)}`}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-gray-100 px-6 py-4">
          <button
            onClick={onClose}
            className="w-full py-2.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;
