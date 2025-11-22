import React, { useState, useEffect } from 'react';
import { Search, Eye, Heart, Filter } from 'lucide-react';
import { Link } from 'react-router-dom'; 

export default function AllArtworksPage() {
  const [artworks, setArtworks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All'); // ✅ Category state
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Category list
  const categories = [
    'All', 
    'Abstract', 
    'Portrait', 
    'Landscape', 
    'Digital Art', 
    'Oil Painting', 
    'Watercolor', 
    'Sculpture',
    'Photography',
    'Mixed Media'
  ];

  // ✅ Fetch artworks with search and category filter
  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        setIsLoading(true);
        
        // Build URL with query parameters
        let url = 'http://localhost:3000/artworks';
        const params = new URLSearchParams();
        
        if (searchTerm) params.append('search', searchTerm);
        if (selectedCategory !== 'All') params.append('category', selectedCategory);
        
        // Use /search endpoint if filters are applied
        if (params.toString()) {
          url = `http://localhost:3000/search?${params.toString()}`;
        }

        console.log('Fetching from:', url); // Debug

        const response = await fetch(url);
        if (!response.ok) throw new Error('Data could not be fetched!');
        
        const data = await response.json();
        setArtworks(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error("Failed to fetch artworks:", err);
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce for better performance
    const timeoutId = setTimeout(() => {
      fetchArtworks();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, selectedCategory]); // ✅ Re-fetch when search or category changes

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-red-500 text-xl">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-3">
            Discover Artworks
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Explore {artworks.length} amazing artworks from talented artists
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by title or artist name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="text-black dark:text-white dark:bg-gray-800 w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
          />
        </div>

        {/* ✅ CATEGORY FILTER SECTION */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              Filter by Category
            </h3>
          </div>
          
          {/* Category Buttons */}
          <div className="flex flex-wrap gap-3">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-full font-medium transition-all duration-300 transform hover:scale-105 ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                }`}
              >
                {cat}
                {selectedCategory === cat && (
                  <span className="ml-2 inline-block w-2 h-2 bg-white rounded-full animate-pulse"></span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Showing Results</p>
              <p className="text-2xl font-bold text-purple-600">{artworks.length}</p>
            </div>
            {selectedCategory !== 'All' && (
              <div className="text-right">
                <p className="text-sm text-gray-600 dark:text-gray-400">Category</p>
                <p className="text-xl font-semibold text-gray-800 dark:text-white">
                  {selectedCategory}
                </p>
              </div>
            )}
            {searchTerm && (
              <div className="text-right">
                <p className="text-sm text-gray-600 dark:text-gray-400">Search</p>
                <p className="text-lg font-medium text-gray-800 dark:text-white truncate max-w-[150px]">
                  "{searchTerm}"
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Artworks Grid */}
        {artworks.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🎨</div>
            <p className="text-xl text-gray-500 dark:text-gray-400 mb-2">
              No artworks found
            </p>
            <p className="text-gray-400 dark:text-gray-500 mb-4">
              Try adjusting your search or filter
            </p>
            {(searchTerm || selectedCategory !== 'All') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('All');
                }}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {artworks.map((art) => (
              <div 
                key={art._id} 
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                {/* Image with Overlay */}
                <div className="relative group">
                  <img
                    src={art.imageUrl}
                    alt={art.title}
                    className="w-full h-56 object-cover"
                  />
                  
                 
                </div>

                <div className="p-5">
                  {/* Title */}
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 truncate">
                    {art.title}
                  </h3>

                  {/* Artist */}
                  <p className="text-gray-600 dark:text-gray-400 mb-3">
                    by <span className="font-medium">{art.artistName}</span>
                  </p>

                  {/* Category Badge */}
                  <span className="inline-block bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 text-xs font-semibold px-3 py-1 rounded-full mb-3">
                    {art.category}
                  </span>

                  {/* Likes Count */}
                  <div className="flex items-center mb-4 text-gray-600 dark:text-gray-400">
                    <Heart className="w-4 h-4 mr-2 text-red-500 fill-red-500" />
                    <span className="font-medium">{art.likes || 0} likes</span>
                  </div>

                  {/* View Details Button */}
                  <Link
                    to={`/details/${art._id}`}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-3 rounded-lg flex items-center justify-center gap-2 hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 font-medium"
                  >
                    <Eye className="w-5 h-5" /> 
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}