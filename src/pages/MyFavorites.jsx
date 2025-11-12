import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

import LoadingSpinner from "../components/LoadingSpinner";
import { getMyFavorites, favoriteArtwork } from "../utils/api";
import toast from "react-hot-toast";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";

const MyFavorites = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const data = await getMyFavorites();
        setFavorites(data);
      } catch (error) {
        toast.error("Failed to fetch your favorites");
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const handleUnfavorite = async (id) => {
    try {
      await favoriteArtwork(id);
      setFavorites(favorites.filter(artwork => artwork._id !== id));
      toast.success("Removed from favorites");
    } catch (error) {
      toast.error("Failed to remove from favorites");
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen flex flex-col">
     
      
      <div className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">My Favorites</h1>
        
        {favorites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((artwork) => (
              <div key={artwork._id} className="card bg-base-100 shadow-xl">
                <figure className="h-64">
                  <img
                    src={artwork.imageUrl}
                    alt={artwork.title}
                    className="w-full h-full object-cover"
                  />
                </figure>
                <div className="card-body">
                  <h2 className="card-title">{artwork.title}</h2>
                  <p className="text-sm opacity-70">By {artwork.artistName}</p>
                  <div className="badge badge-outline">{artwork.category}</div>
                  <div className="card-actions justify-between items-center">
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => navigate(`/artwork/${artwork._id}`)}
                    >
                      View Details
                    </button>
                    <button
                      className="btn btn-ghost btn-sm btn-circle"
                      onClick={() => handleUnfavorite(artwork._id)}
                    >
                      <HeartSolidIcon className="w-5 h-5 text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-2xl font-semibold mb-4">You haven't favorited any artworks yet</h3>
            <button
              className="btn btn-primary"
              onClick={() => navigate("/explore")}
            >
              Explore Artworks
            </button>
          </div>
        )}
      </div>
      
     
    </div>
  );
};

export default MyFavorites;