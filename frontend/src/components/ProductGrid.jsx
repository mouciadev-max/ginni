import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';

export default function ProductGrid({ products = [], loading = false }) {
  const [visibleCount, setVisibleCount] = useState(6);

  // Reset visible count when filter or category changes returning less items
  useEffect(() => {
    setVisibleCount(6);
  }, [products]);

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="rounded-xl bg-white overflow-hidden shadow-card">
            <div className="aspect-[3/4] shimmer" />
            <div className="p-3 sm:p-4 space-y-2">
              <div className="h-4 shimmer rounded w-3/4" />
              <div className="h-4 shimmer rounded w-1/2" />
              <div className="h-3 shimmer rounded w-2/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-400 font-sans text-lg">No products found</p>
      </div>
    );
  }

  const visibleProducts = products.slice(0, visibleCount);
  const hasMore = visibleCount < products.length;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
        {visibleProducts.map((product, i) => (
          <ProductCard key={product.id} product={product} index={i} />
        ))}
      </div>
      
      {hasMore && (
        <div className="text-center pt-2">
          <button 
            type="button"
            onClick={() => setVisibleCount(prev => prev + 6)}
            className="inline-block border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-2.5 rounded-full font-bold text-sm transition-colors uppercase tracking-wider"
          >
            View More
          </button>
        </div>
      )}
    </div>
  );
}
