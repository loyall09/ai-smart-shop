'use client';

import { useState } from 'react';
import { Product, AIRecommendation } from '@/types';
import { getAIRecommendations } from '@/lib/gemini';

interface SurpriseButtonProps {
  products: Product[];
  onRecommendation: (recommendation: AIRecommendation) => void;
}

export default function SurpriseButton({ products, onRecommendation }: SurpriseButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [showInput, setShowInput] = useState(false);

  const handleSurpriseMe = async (query?: string) => {
    setIsLoading(true);
    try {
      const recommendation = await getAIRecommendations(products, query);
      onRecommendation(recommendation);
      if (query) {
        setUserInput('');
        setShowInput(false);
      }
    } catch (error) {
      console.error('Error getting recommendations:', error);
      // Handle error - maybe show a toast or fallback
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userInput.trim()) {
      handleSurpriseMe(userInput.trim());
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {!showInput ? (
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => handleSurpriseMe()}
            disabled={isLoading}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transform transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <span>✨</span>
            )}
            <span>{isLoading ? 'Getting recommendations...' : 'Surprise Me!'}</span>
          </button>
          
          <button
            onClick={() => setShowInput(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transform transition-all duration-200 hover:scale-105 flex items-center space-x-2"
          >
            <span>🤖</span>
            <span>Ask AI</span>
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="w-full max-w-md">
          <div className="flex flex-col space-y-3">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="What are you looking for? (e.g., 'workout gear', 'cozy night in')"
              className="w-full text-gray-800 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
            />
            <div className="flex space-x-2">
              <button
                type="submit"
                disabled={isLoading || !userInput.trim()}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <span>🚀</span>
                )}
                <span>{isLoading ? 'Thinking...' : 'Get Recommendations'}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowInput(false);
                  setUserInput('');
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}
      
      <p className="text-sm text-gray-800 text-center max-w-md">
        Let our AI discover perfect products for you based on your preferences or get a curated surprise selection!
      </p>
    </div>
  );
}