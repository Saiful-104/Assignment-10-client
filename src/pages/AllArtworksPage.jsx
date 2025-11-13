// AllArtworksPage.js

import React, { useState, useEffect } from 'react';
import { Search, Eye, Heart } from 'lucide-react';
// This import is likely 'react-router-dom', not 'react-router'
import { Link } from 'react-router-dom'; 

export default function AllArtworksPage() {
  // We no longer need dummyArtworks
  
  const [artworks, setArtworks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Add loading and error states for real data fetching
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // This function fetches data from YOUR backend
    const fetchArtworks = async () => {
      try {
        // 1. Fetch from your backend's endpoint
        const response = await fetch('http://localhost:3000/artworks');

        if (!response.ok) {
          throw new Error('Data could not be fetched!');
        }
        
        const data = await response.json();
        
        setArtworks(data); // 2. Set the data from your API
        setError(null);
      } catch (err) {
        setError(err.message); // 3. Set error if fetching fails
        console.error("Failed to fetch artworks:", err);
      } finally {
        setIsLoading(false); // 4. Stop loading (on success or error)
      }
    };

    fetchArtworks(); // Call the function
  }, []); // The empty array [] means this runs once when the component loads

  // This filter logic now runs on the REAL data from your API
  const filteredArtworks = artworks.filter(art =>
    art.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    art.artistName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 5. Add loading and error messages
  if (isLoading) {
    return <div className="min-h-screen flex justify-center items-center"><p>Loading artworks...</p></div>;
  }

  if (error) {
    return <div className="min-h-screen flex justify-center items-center"><p>Error: {error}</p></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Discover Artworks</h1>

        {/* Search */}
        <div className="mb-8 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black" />
          <input
            type="text"
            placeholder="Search by title or artist..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className=" text-black w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Artworks */}
        {filteredArtworks.length === 0 ? (
          <p className="text-center text-gray-500">No artworks found</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArtworks.map(art => (
              // 6. Use art._id (from MongoDB) as the key
              <div key={art._id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <img
                  src={art.imageUrl}
                  alt={art.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-900">{art.title}</h3>
                  <p className="text-gray-600 mb-1">by {art.artistName}</p>
                  <span className="inline-block bg-purple-100 text-purple-600 text-xs font-semibold px-2 py-1 rounded-full mb-2">
                    {art.category}
                  </span>
                  {/* Likes Count */}
                  <div className="flex items-center mb-3 text-gray-600">
                    <Heart className="w-4 h-4 mr-1 text-red-500" />
                    <span>{art.likes} likes</span>
                  </div>
                  {/* View Details Button */}
                  {/* 7. Link to the specific detail page using art._id */}
                  <Link
                  to={`/details/${art._id}`}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4" /> View Details
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