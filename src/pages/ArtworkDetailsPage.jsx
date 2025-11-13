import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Heart, Star } from "lucide-react";
import { AuthContext } from "../context/AuthContext";

export default function ArtworkDetailsPage() {
  const { id } = useParams(); // Get artwork ID from URL
  const [artwork, setArtwork] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
   const {user} = use(AuthContext)

  // Fetch artwork details from backend
  useEffect(() => {
    const fetchArtwork = async () => {
      try {
     
        const res = await fetch(`http://localhost:3000/artworks/${id}`, {
          headers: {
            Authorization: `Bearer ${user.a}`,
          },
        });
        const data = await res.json();
        if (data.success) {
          setArtwork(data.result);

          // Check if liked/favorited locally or via backend (optional)
          setIsLiked(data.result.liked || false);
          setIsFavorited(data.result.favorited || false);
        }
      } catch (err) {
        console.error("Failed to fetch artwork:", err);
      }
    };

    fetchArtwork();
  }, [id]);

  // Handle Like toggle
  const handleLike = async () => {

  
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`http://localhost:3000/artworks/${id}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
       console.log(data)
      if (data.success) {
        setIsLiked(data.liked);
        setArtwork(prev => ({
          ...prev,
          likes: prev.likes + (data.liked ? 1 : -1),
        }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Favorite toggle
  const handleFavorite = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`http://localhost:3000/artworks/${id}/favorite`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) setIsFavorited(data.favorited);
    } catch (err) {
      console.error(err);
    }
  };

  if (!artwork) return <div className="text-center py-20">Loading artwork...</div>;

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
            <h1 className="text-4xl text-blue-950 font-bold mb-2">{artwork.title}</h1>
            <p className="text-gray-600 text-lg mb-4">by {artwork.artistName}</p>
            <p className="text-gray-700 mb-4">
              <strong>Medium:</strong> {artwork.medium}
            </p>
            <p className="text-gray-700 mb-6">{artwork.description}</p>

            <div className="flex gap-3">
              <button
                onClick={handleLike}
                className={`flex-1 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 ${
                  isLiked ? "bg-red-500 text-white" : "bg-gray-100 text-gray-700"
                }`}
              >
                <Heart />
                {isLiked ? "Liked" : "Like"} ({artwork.likes})
              </button>

              <button
                onClick={handleFavorite}
                className={`flex-1 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 ${
                  isFavorited ? "bg-yellow-500 text-white" : "bg-gray-100 text-gray-700"
                }`}
              >
                <Star />
                {isFavorited ? "Favorited" : "Add to Favorites"}
              </button>
            </div>
          </div>
        </div>

        {/* Artist Info */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 text-center">
          <img
            src={artwork.artistPhoto}
            alt={artwork.artistName}
            className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-purple-100"
          />
          <h4 className="text-2xl font-bold mb-2">{artwork.artistName}</h4>
          <p className="text-gray-600 mb-4">
            Total Artworks: {artwork.artistTotalArtworks}
          </p>
        </div>
      </div>
    </div>
  );
}
