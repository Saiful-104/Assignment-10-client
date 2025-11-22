import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { Heart, Star } from "lucide-react";
import { AuthContext } from "../context/AuthContext";

export default function ArtworkDetailsPage() {
  const { id } = useParams();
  const [artwork, setArtwork] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { currentUser } = useContext(AuthContext);
  const user=currentUser

  // artwork details from backend
  useEffect(() => {
    const fetchArtwork = async () => {
      try {
        setLoading(true);
      
        const res = await fetch(`http://localhost:3000/artworks/${id}`,{
          headers:{
            Authorization:user?.accessToken ? `Bearer ${user.accessToken}` : "",
          },
        });
 
        const data = await res.json();
        console.log("Fetched data:", data); // Debug log

        if (data.success) {
          setArtwork(data.result);
          setIsLiked(data.result.liked );
          setIsFavorited(data.result.favorited );
        } 
      } catch (err) {
        console.error("Failed to fetch artwork:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

      fetchArtwork();
    
  }, [id,user]);

  // Handle Like toggle
  const handleLike = async () => {
    if (!user || !user.accessToken) {
      alert("Please login to like artworks");
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/artworks/${id}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.accessToken}`,
         // console.log({Authorization})
        },
      });

      if (!res.ok) {
        throw new Error("Failed to like artwork");
      }

      const data = await res.json();
      if (data.success) {
        setIsLiked(data.liked);
        setArtwork((prev) => ({
          ...prev,
          likes: prev.likes + (data.liked ? 1 : -1),
        }));
      }
    } catch (err) {
      console.error("Error liking artwork:", err);
      alert("Failed to like artwork");
    }
  };

  // Handle Favorite toggle
  const handleFavorite = async () => {
    if (!user || !user.accessToken) {
      alert("Please login to favorite artworks");
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/artworks/${id}/favorite`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.accessToken}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to favorite artwork");
      }

      const data = await res.json();
      if (data.success) {
        setIsFavorited(data.favorited);
      }
    } catch (err) {
      console.error("Error favoriting artwork:", err);
      alert("Failed to favorite artwork");
    }
  };

  // ✅ FIX 4: Better loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading artwork...</p>
        </div>
      </div>
    );
  }

  // ✅ FIX 5: Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-red-500 mb-4">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // ✅ FIX 6: Check if artwork exists
  if (!artwork) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600">Artwork not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Artwork Details */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-2xl overflow-hidden">
          <img
            src={artwork.imageUrl}
            alt={artwork.title}
            className="w-full h-96 object-cover"
          />
          <div className="p-8">
            <h1 className="text-4xl text-blue-950 font-bold mb-2">
              {artwork.title}
            </h1>
            <p className="text-gray-600 text-lg mb-4">by {artwork.artistName}</p>
            <p className="text-gray-700 mb-4">
              <strong>Medium:</strong> {artwork.medium}
            </p>
            <p className="text-gray-700 mb-6">{artwork.description}</p>

            <div className="flex gap-3">
              <button
                onClick={handleLike}
                className={`flex-1 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
                  isLiked
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Heart fill={isLiked ? "currentColor" : "none"} />
                {isLiked ? "Liked" : "Like"} ({artwork.likes || 0})
              </button>

              <button
                onClick={handleFavorite}
                className={`flex-1 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
                  isFavorited
                    ? "bg-yellow-500 text-white hover:bg-yellow-600"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Star fill={isFavorited ? "currentColor" : "none"} />
                {isFavorited ? "Favorited" : "Add to Favorites"}
              </button>
            </div>
          </div>
        </div>

        {/* Artist Info */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 text-center">
          <img
            src={artwork.imageUrl || "https://via.placeholder.com/150"}
            alt={artwork.artistName}
            className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-purple-100 object-cover"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/150";
            }}
          />
          <h4 className="text-blue-600 text-2xl font-bold mb-2">{artwork.artistName}</h4>
          <p className="text-gray-700 mb-4">
            Total Artworks: {artwork.artistTotalArtworks || 0}
          </p>
        </div>
      </div>
    </div>
  );
}