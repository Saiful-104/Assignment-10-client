import React, { useState, useEffect } from 'react';
import { Search, Eye, Heart } from 'lucide-react';
import { Link } from 'react-router';

export default function AllArtworksPage() {
  const dummyArtworks = [
    {
      id: 1,
      imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5',
      title: 'Sunset Dreams',
      artistName: 'Sarah Anderson',
      category: 'painting',
      likes: 245,
    },
    {
      id: 2,
      imageUrl: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912',
      title: 'Urban Chaos',
      artistName: 'Michael Chen',
      category: 'digital art',
      likes: 189,
    },
    {
      id: 3,
      imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f',
      title: 'Mountain Serenity',
      artistName: 'Emma Williams',
      category: 'photography',
      likes: 312,
    },
    {
      id: 4,
      imageUrl: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968',
      title: 'Abstract Emotions',
      artistName: 'Sarah Anderson',
      category: 'mixed media',
      likes: 167,
    }
  ];

  const [artworks, setArtworks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Simulate fetching public artworks from DB
    setArtworks(dummyArtworks);
  }, []);

  const filteredArtworks = artworks.filter(art =>
    art.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    art.artistName.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              <div key={art.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
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
                  <Link
                    to="/details"
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
