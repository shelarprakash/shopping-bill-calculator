import { PRODUCTS } from '../data/products';
import { OFFERS } from '../data/offers';
import ProductCard from './ProductCard';
import { TagIcon } from './icons';

const ProductGrid = () => {
  const categories = [...new Set(PRODUCTS.map((p) => p.category))];

  return (
    <div className="space-y-6">
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <TagIcon className="w-5 h-5 text-amber-600" />
          <h2 className="font-semibold text-amber-800 text-sm">Current Special Offers</h2>
        </div>
        <ul className="space-y-1">
          {OFFERS.map((offer) => (
            <li key={offer.id} className="flex items-start gap-2 text-sm text-amber-700">
              <span className="mt-0.5 text-amber-500 flex-shrink-0">✦</span>
              {offer.description}
            </li>
          ))}
        </ul>
      </div>

      {categories.map((category) => (
        <section key={category}>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
            {category}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-3">
            {PRODUCTS.filter((p) => p.category === category).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default ProductGrid;
