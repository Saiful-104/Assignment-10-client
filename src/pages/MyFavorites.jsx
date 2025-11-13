import React, { useState, useEffect } from 'react';
import { Star, Trash2 } from 'lucide-react';

export default function MyFavoritesPage() {
  const allArtworks = [
    { id: '1', title: 'Sunset Dreams', artistName: 'Sarah Anderson', imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5' },
    { id: '2', title: 'Urban Chaos', artistName: 'Michael Chen', imageUrl: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912' },
    { id: '3', title: 'Mountain Serenity', artistName: 'Emma Williams', imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f' },
    { id: '4', title: 'Abstract Emotions', artistName: 'Sarah Anderson', imageUrl: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968' },
    { id: '5', title: 'Geometric Harmony', artistName: 'David Martinez', imageUrl: 'https://images.unsplash.com/photo-1549887534-1541e9326642' },
  ];

  const [favorites, setFavorites] = useState([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [artworkToRemove, setArtworkToRemove] = useState(null);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = () => {
    const favoritedArtworks = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('favorited_')) {
        const artworkId = key.replace('favorited_', '');
        const artwork = allArtworks.find(art => art.id === artworkId);
        if (artwork) favoritedArtworks.push(artwork);
      }
    }
    setFavorites(favoritedArtworks);
  };

  const handleRemoveFavorite = (artworkId) => {
    setArtworkToRemove(artworkId);
    setShowConfirmDialog(true);
  };

  const confirmRemoveFavorite = () => {
    if (artworkToRemove) {
      localStorage.removeItem(`favorited_${artworkToRemove}`);
      setFavorites(prev => prev.filter(art => art.id !== artworkToRemove));
    }
    setShowConfirmDialog(false);
    setArtworkToRemove(null);
  };

  return (
    <div className="min-h-screen  py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">My Favorites</h1>

        {favorites.length === 0 ? (
          <p className="">No favorites yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {favorites.map(art => (
              <div key={art.id} className="bg-white rounded-xl shadow p-4 relative">
                <button
                  onClick={() => handleRemoveFavorite(art.id)}
                  className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <img src={art.imageUrl} alt={art.title} className="w-full h-48 object-cover rounded-lg mb-3" />
                <h3 className="font-bold text-gray-700 text-lg">{art.title}</h3>
                <p className="text-gray-600 text-sm">by {art.artistName}</p>
              </div>
            ))}
          </div>
        )}

        {showConfirmDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full">
              <h3 className="text-xl text-gray-700 font-bold mb-4">Remove from Favorites?</h3>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowConfirmDialog(false)}
                  className="flex-1 bg-red-500 text-white py-2 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmRemoveFavorite}
                  className="flex-1 bg-red-500 text-white py-2 rounded-lg"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
