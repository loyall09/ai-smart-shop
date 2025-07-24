'use client';

import { Product } from '@/types';
import ProductCard from './ProductCard';

interface ProductListProps {
  products: Product[];
  recommendedProductIds?: string[];
  title?: string;
}

export default function ProductList({ 
  products, 
  recommendedProductIds = [], 
  title = "Products" 
}: ProductListProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg mb-4">No products found</div>
        <p className="text-gray-400">Try adjusting your search criteria</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        <span className="text-sm text-gray-500">
          {products.length} product{products.length !== 1 ? 's' : ''} found
        </span>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            isRecommended={recommendedProductIds.includes(product.id)}
          />
        ))}
      </div>
    </div>
  );
}