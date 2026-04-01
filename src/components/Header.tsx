import { ShoppingCartIcon } from './icons';
import { useAppSelector } from '../store';

const Header = () => {
  const itemCount = useAppSelector((state) =>
    state.cart.items.reduce((sum, i) => sum + i.quantity, 0),
  );

  return (
    <header className="bg-brand-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🛒</span>
          <div>
            <h1 className="text-xl font-bold leading-tight">Smart Basket</h1>
            <p className="text-brand-100 text-xs">Special offers applied automatically</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-brand-800 rounded-full px-4 py-2">
          <ShoppingCartIcon className="w-5 h-5" />
          <span className="font-semibold text-sm">{itemCount} item{itemCount !== 1 ? 's' : ''}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
