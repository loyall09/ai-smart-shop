'use client';

import { Product } from '@/types';
import Image from 'next/image';

interface ProductCardProps {
  product: Product;
  isRecommended?: boolean;
}

export default function ProductCard({ product, isRecommended = false }: ProductCardProps) {
  const { name, description, price, image, inStock, rating, category } = product;

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 ${
      isRecommended ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
    }`}>
      {isRecommended && (
        <div className="bg-blue-500 text-white text-xs font-bold px-2 py-1 text-center">
          AI Recommended ✨
        </div>
      )}
      
      <div className="relative h-48 w-full">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {!inStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-bold text-lg">Out of Stock</span>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">{name}</h3>
          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full ml-2 whitespace-nowrap">
            {category}
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{description}</p>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`h-4 w-4 ${i < Math.floor(rating) ? 'fill-current' : 'text-gray-300'}`}
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-sm text-gray-500 ml-1">({rating})</span>
          </div>
          <div className="text-2xl font-bold text-green-600">
            ${price.toFixed(2)}
          </div>
        </div>

        <button
          disabled={!inStock}
          className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
            inStock
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {inStock ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  );
}