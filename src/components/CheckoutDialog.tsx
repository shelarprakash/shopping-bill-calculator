import { useState } from 'react';
import { formatCurrency } from '../utils/formatCurrency';
import { TagIcon, ReceiptIcon } from './icons';
import type { Bill } from '../types';

interface CheckoutDialogProps {
  bill: Bill;
  onConfirm: () => void;
  onCancel: () => void;
}

const CheckoutDialog = ({ bill, onConfirm, onCancel }: CheckoutDialogProps) => {
  const [saved, setSaved] = useState(false);

  const applicableOffers = bill.appliedOffers;
  const hasOffers = applicableOffers.length > 0;

  if (saved) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden max-h-[90vh] flex flex-col">
          <div className="bg-green-600 text-white px-6 py-4 flex items-center gap-2">
            <span className="text-xl">✅</span>
            <h3 className="font-bold text-lg">Order Saved!</h3>
          </div>

          <div className="p-6 space-y-4 overflow-y-auto flex-1">
            {/* Items */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
                Items Purchased
              </p>
              <div className="space-y-2">
                {bill.lineItems.map(({ product, quantity, lineTotal }) => (
                  <div key={product.id} className="flex items-center gap-3">
                    <span className="text-xl flex-shrink-0">{product.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800">{product.name}</p>
                      <p className="text-xs text-gray-400">
                        {quantity} × {formatCurrency(product.price)}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-gray-800 flex-shrink-0">
                      {formatCurrency(lineTotal)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-100" />

            <div className="flex justify-between text-sm text-gray-500">
              <span>Subtotal</span>
              <span>{formatCurrency(bill.subtotal)}</span>
            </div>

            {/* Offers */}
            {hasOffers && (
              <div className="bg-green-50 border border-green-100 rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-1.5 text-green-700">
                  <TagIcon className="w-4 h-4" />
                  <span className="text-xs font-semibold uppercase tracking-wide">Offers Applied</span>
                </div>
                {applicableOffers.map((offer) => (
                  <div key={offer.offerId} className="flex justify-between text-sm gap-2">
                    <span className="text-green-700">{offer.description}</span>
                    <span className="text-green-700 font-semibold flex-shrink-0">
                      {offer.freeItems
                        ? `${offer.freeItems.quantity} FREE (worth ${formatCurrency(offer.freeItems.value)})`
                        : `-${formatCurrency(offer.saving)}`}
                    </span>
                  </div>
                ))}
                {bill.totalSavings > 0 && (
                  <div className="border-t border-green-200 pt-2 flex justify-between text-sm">
                    <span className="text-green-800 font-semibold">Total savings</span>
                    <span className="text-green-800 font-bold">
                      -{formatCurrency(bill.totalSavings)}
                    </span>
                  </div>
                )}
              </div>
            )}

            {!hasOffers && (
              <p className="text-sm text-gray-400 italic">No special offers applied.</p>
            )}

            <div className="border-t border-gray-100" />

            {/* Grand Total */}
            <div className="bg-brand-700 text-white rounded-lg p-4 flex justify-between items-center">
              <span className="font-bold text-lg">Grand Total</span>
              <span className="font-bold text-2xl">{formatCurrency(bill.total)}</span>
            </div>

            {bill.totalSavings > 0 && (
              <p className="text-xs text-green-600 text-center font-medium">
                You saved {formatCurrency(bill.totalSavings)} with special offers!
              </p>
            )}

            {applicableOffers.some((o) => o.freeItems) && (
              <p className="text-xs text-green-600 text-center font-medium">
                Plus free items worth{' '}
                {formatCurrency(
                  applicableOffers.reduce((sum, o) => sum + (o.freeItems?.value ?? 0), 0),
                )}
                !
              </p>
            )}
          </div>

          <div className="border-t border-gray-100 px-6 py-4">
            <button
              onClick={onConfirm}
              className="w-full py-2.5 text-sm font-semibold text-white bg-brand-700 hover:bg-brand-800 rounded-lg transition-colors"
              data-testid="checkout-done"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden max-h-[90vh] flex flex-col">
        <div className="bg-brand-700 text-white px-6 py-4 flex items-center gap-2">
          <ReceiptIcon className="w-5 h-5" />
          <h3 className="font-bold text-lg">Your Order Summary</h3>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* Items chosen */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
              Your Items
            </p>
            <div className="space-y-2">
              {bill.lineItems.map(({ product, quantity, lineTotal }) => (
                <div key={product.id} className="flex items-center gap-3">
                  <span className="text-xl flex-shrink-0">{product.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800">{product.name}</p>
                    <p className="text-xs text-gray-400">
                      {quantity} × {formatCurrency(product.price)}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-gray-800 flex-shrink-0">
                    {formatCurrency(lineTotal)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-100" />

          <div className="flex justify-between text-sm text-gray-500">
            <span>Subtotal</span>
            <span>{formatCurrency(bill.subtotal)}</span>
          </div>

          {hasOffers && (
            <div className="bg-green-50 border border-green-100 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-1.5 text-green-700">
                <TagIcon className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase tracking-wide">Offers Applied</span>
              </div>
              {applicableOffers.map((offer) => (
                <div key={offer.offerId} className="flex justify-between text-sm gap-2">
                  <span className="text-green-700">{offer.description}</span>
                  <span className="text-green-700 font-semibold flex-shrink-0">
                    {offer.freeItems
                      ? `${offer.freeItems.quantity} FREE (worth ${formatCurrency(offer.freeItems.value)})`
                      : `-${formatCurrency(offer.saving)}`}
                  </span>
                </div>
              ))}
              {bill.totalSavings > 0 && (
                <div className="border-t border-green-200 pt-2 flex justify-between text-sm">
                  <span className="text-green-800 font-semibold">Total savings</span>
                  <span className="text-green-800 font-bold">
                    -{formatCurrency(bill.totalSavings)}
                  </span>
                </div>
              )}
            </div>
          )}

          {!hasOffers && (
            <p className="text-sm text-gray-400 italic">No special offers apply to your basket.</p>
          )}

          <div className="border-t border-gray-100" />

          <div className="flex justify-between items-center">
            <span className="font-bold text-gray-800 text-lg">Grand Total</span>
            <span className="font-bold text-brand-700 text-2xl">{formatCurrency(bill.total)}</span>
          </div>
        </div>

        <div className="border-t border-gray-100 px-6 py-4 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            data-testid="checkout-cancel"
          >
            Go Back
          </button>
          <button
            onClick={() => setSaved(true)}
            className="flex-1 py-2.5 text-sm font-semibold text-white bg-brand-700 hover:bg-brand-800 rounded-lg transition-colors"
            data-testid="checkout-confirm"
          >
            Save Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutDialog;
