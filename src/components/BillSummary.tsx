import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { useCartBill } from '../hooks/useCartBill';
import { clearCart, removeItem, decrementItem, incrementItem, checkout } from '../store/cartSlice';
import { formatCurrency } from '../utils/formatCurrency';
import { TagIcon, TrashIcon, ReceiptIcon, MinusIcon, PlusIcon } from './icons';
import CheckoutDialog from './CheckoutDialog';

const BillSummary = () => {
  const dispatch = useAppDispatch();
  const bill = useCartBill();
  const checkedOut = useAppSelector((state) => state.cart.checkedOut);
  const isEmpty = bill.lineItems.length === 0;
  const [showDialog, setShowDialog] = useState(false);

  const handleCheckoutClick = () => {
    setShowDialog(true);
  };

  const handleConfirm = () => {
    setShowDialog(false);
    dispatch(checkout());
  };

  const handleCancel = () => {
    setShowDialog(false);
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full">
        <div className="bg-brand-700 text-white px-5 py-4 flex items-center gap-2">
          <ReceiptIcon className="w-5 h-5" />
          <h2 className="font-bold text-lg">Your Bill</h2>
        </div>

        {isEmpty ? (
          <div className="flex-1 flex flex-col items-center justify-center py-16 px-6 text-center">
            <span className="text-5xl mb-4">🛒</span>
            <p className="text-gray-500 font-medium">Your basket is empty</p>
            <p className="text-gray-400 text-sm mt-1">Add some products to see your bill</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto">
            <div className="divide-y divide-gray-50">
              {bill.lineItems.map(({ product, quantity, lineTotal }) => (
                <div
                  key={product.id}
                  className="px-5 py-3 flex items-center gap-3"
                  data-testid={`bill-item-${product.id}`}
                >
                  <span className="text-2xl flex-shrink-0">{product.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 text-sm truncate">{product.name}</p>
                    <p className="text-xs text-gray-400">
                      {quantity} × {formatCurrency(product.price)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => dispatch(decrementItem(product.id))}
                      className="w-6 h-6 rounded-full bg-gray-100 hover:bg-red-100 text-gray-500 hover:text-red-500 flex items-center justify-center transition-colors"
                      aria-label={`Remove one ${product.name}`}
                    >
                      <MinusIcon className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => dispatch(incrementItem(product.id))}
                      className="w-6 h-6 rounded-full bg-gray-100 hover:bg-brand-100 text-gray-500 hover:text-brand-700 flex items-center justify-center transition-colors"
                      aria-label={`Add one ${product.name}`}
                    >
                      <PlusIcon className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => dispatch(removeItem(product.id))}
                      className="w-6 h-6 rounded-full bg-gray-100 hover:bg-red-100 text-gray-500 hover:text-red-500 flex items-center justify-center transition-colors ml-1"
                      aria-label={`Remove ${product.name} from cart`}
                    >
                      <TrashIcon className="w-3 h-3" />
                    </button>
                  </div>
                  <p className="font-semibold text-gray-800 text-sm w-14 text-right flex-shrink-0">
                    {formatCurrency(lineTotal)}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 mx-5 my-3" />

            <div className="px-5 space-y-2 pb-3">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Subtotal</span>
                <span data-testid="subtotal">{formatCurrency(bill.subtotal)}</span>
              </div>

              {checkedOut && bill.appliedOffers.length > 0 && (
                <div className="bg-green-50 border border-green-100 rounded-lg p-3 space-y-2">
                  <div className="flex items-center gap-1.5 text-green-700">
                    <TagIcon className="w-4 h-4" />
                    <span className="text-xs font-semibold uppercase tracking-wide">Offers Applied</span>
                  </div>
                  {bill.appliedOffers.map((offer) => (
                    <div
                      key={offer.offerId}
                      className="flex justify-between text-sm"
                      data-testid={`offer-${offer.offerId}`}
                    >
                      <span className="text-green-700 text-xs pr-2">{offer.description}</span>
                      <span className="text-green-700 font-semibold text-xs flex-shrink-0">
                        {offer.freeItems
                          ? `${offer.freeItems.quantity} FREE (worth ${formatCurrency(offer.freeItems.value)})`
                          : `-${formatCurrency(offer.saving)}`}
                      </span>
                    </div>
                  ))}
                  {bill.totalSavings > 0 && (
                    <div className="flex justify-between text-sm border-t border-green-200 pt-2">
                      <span className="text-green-800 font-semibold">Total savings</span>
                      <span className="text-green-800 font-bold" data-testid="total-savings">
                        -{formatCurrency(bill.totalSavings)}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {!isEmpty && (
          <div className="border-t border-gray-100 p-5 space-y-3 bg-gray-50">
            {checkedOut ? (
              <>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-800 text-lg">Total</span>
                  <span
                    className="font-bold text-brand-700 text-2xl"
                    data-testid="total"
                  >
                    {formatCurrency(bill.total)}
                  </span>
                </div>
                {bill.totalSavings > 0 && (
                  <p className="text-xs text-green-600 text-center font-medium">
                    You saved {formatCurrency(bill.totalSavings)} with special offers!
                  </p>
                )}
              </>
            ) : (
              <button
                onClick={handleCheckoutClick}
                className="w-full py-3 text-sm font-semibold text-white bg-brand-700 hover:bg-brand-800 rounded-lg transition-colors"
                data-testid="checkout-btn"
              >
                Checkout
              </button>
            )}
            <button
              onClick={() => dispatch(clearCart())}
              className="w-full py-2 text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-gray-200 hover:border-red-200"
            >
              Clear basket
            </button>
          </div>
        )}
      </div>

      {showDialog && (
        <CheckoutDialog
          bill={bill}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </>
  );
};

export default BillSummary;
