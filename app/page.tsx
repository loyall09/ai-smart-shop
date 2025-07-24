'use client';

import { useState, useEffect, useMemo } from 'react';
import { Product, AIRecommendation } from '@/types';
import SearchBar from './components/SearchBar';
import ProductList from './components/ProductList';
import SurpriseButton from './components/SurpriseButton';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [aiRecommendation, setAiRecommendation] = useState<AIRecommendation | null>(null);
  const [showRecommendations, setShowRecommendations] = useState(false);

  // Load products on component mount
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch('/products.json');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error loading products:', error);
      }
    };

    loadProducts();
  }, []);

  // Get unique categories
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(products.map(p => p.category))];
    return uniqueCategories.sort();
  }, [products]);

  // Filter products based on search and category
  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.tags.some(tag => tag.toLowerCase().includes(query)) ||
        product.category.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    return filtered;
  }, [products, searchQuery, selectedCategory]);

  const handleAIRecommendation = (recommendation: AIRecommendation) => {
    setAiRecommendation(recommendation);
    setShowRecommendations(true);
    // Clear search filters to show all products with recommendations highlighted
    setSearchQuery('');
    setSelectedCategory('');
  };

  const clearRecommendations = () => {
    setShowRecommendations(false);
    setAiRecommendation(null);
  };

  const displayProducts = showRecommendations ? products : filteredProducts;
  const recommendedIds = aiRecommendation ? aiRecommendation.products.map(p => p.id) : [];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center py-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          Discover Amazing Products with AI
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Search through our curated collection or let our AI recommend products just for you
        </p>
        
        {/* AI Recommendation Section */}
        <div className="mb-8">
          <SurpriseButton 
            products={products} 
            onRecommendation={handleAIRecommendation}
          />
        </div>
      </div>

      {/* AI Recommendation Display */}
      {showRecommendations && aiRecommendation && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                🎯 {aiRecommendation.theme}
              </h3>
              <p className="text-gray-600">{aiRecommendation.reason}</p>
            </div>
            <button
              onClick={clearRecommendations}
              className="text-gray-500 hover:text-gray-700 p-1"
              title="Clear recommendations"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {aiRecommendation.products.map((product) => (
              <div key={product.id} className="bg-white rounded-lg p-4 border-2 border-blue-300">
                <div className="flex items-center space-x-3">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-800">{product.name}</h4>
                    <p className="text-green-600 font-bold">${product.price.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search and Filter Section */}
      <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
        <SearchBar onSearch={(query: string) => setSearchQuery(query)} />
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === '' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All Categories
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Products Section */}
      <ProductList 
        products={displayProducts}
        recommendedProductIds={recommendedIds}
        title={showRecommendations ? 'All Products (AI Recommended items highlighted)' : 'Products'}
      />
    </div>
  );
}