import type { Product } from '../types';
import { useAppDispatch, useAppSelector } from '../store';
import { incrementItem, decrementItem } from '../store/cartSlice';
import { formatCurrency } from '../utils/formatCurrency';
import { PlusIcon, MinusIcon } from './icons';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const dispatch = useAppDispatch();
  const quantity =
    useAppSelector(
      (state) =>
        state.cart.items.find((i) => i.productId === product.id)?.quantity,
    ) ?? 0;

  const inCart = quantity > 0;

  return (
    <div
      className={`relative bg-white rounded-xl shadow-sm border-2 transition-all duration-200 flex flex-col ${
        inCart ? 'border-brand-500 shadow-brand-100 shadow-md' : 'border-gray-100 hover:border-gray-200 hover:shadow-md'
      }`}
      data-testid={`product-card-${product.id}`}
    >
      {inCart && (
        <div className="absolute -top-2 -right-2 bg-brand-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shadow">
          {quantity}
        </div>
      )}

      <div className="p-4 flex-1 flex flex-col items-center text-center gap-2">
        <div className="text-4xl" aria-hidden="true">{product.emoji}</div>
        <div>
          <h3 className="font-semibold text-gray-800 text-sm">{product.name}</h3>
          <p className="text-xs text-gray-400">per {product.unit}</p>
        </div>
        <p className="text-brand-700 font-bold text-lg">{formatCurrency(product.price)}</p>
      </div>

      <div className="border-t border-gray-100 p-3">
        {inCart ? (
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={() => dispatch(decrementItem(product.id))}
              aria-label={`Remove one ${product.name}`}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-red-100 text-gray-600 hover:text-red-600 flex items-center justify-center transition-colors"
            >
              <MinusIcon className="w-4 h-4" />
            </button>
            <span className="font-semibold text-gray-700 text-sm w-6 text-center">
              {quantity}
            </span>
            <button
              onClick={() => dispatch(incrementItem(product.id))}
              aria-label={`Add one ${product.name}`}
              className="w-8 h-8 rounded-full bg-brand-100 hover:bg-brand-500 text-brand-700 hover:text-white flex items-center justify-center transition-colors"
            >
              <PlusIcon className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => dispatch(incrementItem(product.id))}
            aria-label={`Add ${product.name} to cart`}
            className="w-full py-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-1"
          >
            <PlusIcon className="w-4 h-4" />
            Add
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
