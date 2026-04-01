import { Provider } from 'react-redux';
import { store } from './store';
import Header from './components/Header';
import ProductGrid from './components/ProductGrid';
import BillSummary from './components/BillSummary';

const App = () => (
  <Provider store={store}>
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:items-start">
          <div className="lg:col-span-2">
            <ProductGrid />
          </div>
          <div className="lg:sticky lg:top-6">
            <BillSummary />
          </div>
        </div>
      </main>
      <footer className="text-center py-4 text-xs text-gray-400 border-t border-gray-100">
        Smart Basket &mdash; Special offers applied automatically at checkout
      </footer>
    </div>
  </Provider>
);

export default App;
