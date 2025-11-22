import React, { useState, useEffect } from 'react';
import { Star, Trash2, Heart, Loader } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function MyFavoritesPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [favorites, setFavorites] = useState([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [artworkToRemove, setArtworkToRemove] = useState(null);
  const [loading, setLoading] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '' });

  const showToast = (msg) => {
    setToast({ show: true, message: msg });
    setTimeout(() => setToast({ show: false, message: '' }), 2500);
  };

  // Fetch favorites from backend
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!currentUser) return;
      
      try {
        setLoading(true);
        const token = await currentUser.getIdToken();
        const res = await fetch('http://localhost:3000/my-favorites', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error('Failed to fetch favorites');
        }

        const data = await res.json();
        setFavorites(data); // Backend now returns array directly
      } catch (error) {
        console.error("Error fetching favorites:", error);
        showToast("Failed to load favorites");
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [currentUser]);

  const handleRemoveFavorite = (artwork) => {
    setArtworkToRemove(artwork);
    setShowConfirmDialog(true);
  };

  const confirmRemoveFavorite = async () => {
    if (!artworkToRemove || !currentUser) return;

    setRemoving(true);
    try {
      const token = await currentUser.getIdToken();
      const res = await fetch(`http://localhost:3000/my-favorites/${artworkToRemove._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.success) {
        // Remove from local state
        setFavorites(prev => prev.filter(art => art._id !== artworkToRemove._id));
        showToast('Removed from favorites');
      } else {
        showToast(data.message || 'Failed to remove favorite');
      }
    } catch (error) {
      console.error("Error removing favorite:", error);
      showToast("Failed to remove favorite");
    } finally {
      setRemoving(false);
      setShowConfirmDialog(false);
      setArtworkToRemove(null);
    }
  };

  const handleViewArtwork = (artworkId) => {
    navigate(`/artworks/${artworkId}`);
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Please log in to view your favorites.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Heart className="w-8 h-8 text-red-500 fill-red-500" />
          <h1 className="text-3xl font-bold text-gray-800">My Favorites</h1>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-3 text-gray-600">Loading favorites...</span>
          </div>
        ) : favorites.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg mb-2">No favorites yet</p>
            <p className="text-gray-500 text-sm mb-6">
              Start exploring artworks and add them to your favorites!
            </p>
            <button
              onClick={() => navigate('/artworks')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Browse Artworks
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map(art => (
              <div 
                key={art._id} 
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition overflow-hidden relative group"
              >
                {/* Remove button */}
                <button
                  onClick={() => handleRemoveFavorite(art)}
                  className="absolute top-3 right-3 z-10 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition opacity-0 group-hover:opacity-100 shadow-lg"
                  title="Remove from favorites"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                {/* Artwork image - clickable */}
                <div 
                  onClick={() => handleViewArtwork(art._id)}
                  className="cursor-pointer overflow-hidden"
                >
                  <img 
                    src={art.imageUrl} 
                    alt={art.title} 
                    className="w-full h-56 object-cover hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
                    }}
                  />
                </div>

                {/* Artwork details */}
                <div className="p-4">
                  <h3 
                    onClick={() => handleViewArtwork(art._id)}
                    className="font-bold text-gray-800 text-lg mb-1 hover:text-blue-600 cursor-pointer truncate"
                  >
                    {art.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">by {art.artistName || 'Unknown Artist'}</p>
                  
                  {/* Additional info */}
                  <div className="flex items-center justify-between text-sm text-gray-500 pt-2 border-t">
                    <span>{art.medium || 'Mixed Media'}</span>
                    {art.price > 0 && (
                      <span className="text-green-600 font-semibold">${art.price}</span>
                    )}
                  </div>

                  {/* View button */}
                  <button
                    onClick={() => handleViewArtwork(art._id)}
                    className="w-full mt-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Confirmation Dialog */}
        {showConfirmDialog && artworkToRemove && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <Trash2 className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-xl text-gray-800 font-bold">Remove from Favorites?</h3>
              </div>
              
              <p className="text-gray-600 mb-6">
                Are you sure you want to remove "<strong>{artworkToRemove.title}</strong>" from your favorites?
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowConfirmDialog(false);
                    setArtworkToRemove(null);
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition"
                  disabled={removing}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmRemoveFavorite}
                  className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                  disabled={removing}
                >
                  {removing ? 'Removing...' : 'Remove'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Toast Notification */}
        {toast.show && (
          <div className="fixed bottom-8 right-8 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg animate-fade-in z-50">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5" />
              <span>{toast.message}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}