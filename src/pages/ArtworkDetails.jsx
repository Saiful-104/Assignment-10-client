import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

import LoadingSpinner from "../components/LoadingSpinner";
import { getArtwork, likeArtwork, favoriteArtwork } from "../utils/api";
import { getUser } from "../utils/api";
import toast from "react-hot-toast";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";
import { HeartIcon as HeartOutlineIcon } from "@heroicons/react/24/outline";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

const ArtworkDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [artwork, setArtwork] = useState(null);
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  useEffect(() => {
    const fetchArtwork = async () => {
      try {
        const data = await getArtwork(id);
        setArtwork(data.result);
        setLikesCount(data.result.likes || 0);
        
        // Fetch artist info
        try {
          const artistData = await getUser();
          setArtist(artistData);
        } catch (error) {
          console.error("Error fetching artist info:", error);
        }
      } catch (error) {
        toast.error("Failed to fetch artwork details");
        navigate("/explore");
      } finally {
        setLoading(false);
      }
    };

    fetchArtwork();
  }, [id, navigate]);

  const handleLike = async () => {
    if (!user) {
      return toast.error("Please login to like artworks");
    }

    try {
      const result = await likeArtwork(id);
      setIsLiked(result.liked);
      setLikesCount(prev => result.liked ? prev + 1 : prev - 1);
    } catch (error) {
      toast.error("Failed to update like");
    }
  };

  const handleFavorite = async () => {
    if (!user) {
      return toast.error("Please login to favorite artworks");
    }

    try {
      const result = await favoriteArtwork(id);
      setIsFavorited(result.favorited);
      toast.success(result.favorited ? "Added to favorites" : "Removed from favorites");
    } catch (error) {
      toast.error("Failed to update favorites");
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!artwork) {
    return (
      <div className="min-h-screen flex flex-col">
        
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Artwork not found</h2>
            <button
              className="btn btn-primary"
              onClick={() => navigate("/explore")}
            >
              Back to Explore
            </button>
          </div>
        </div>
     
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
     
      <div className="flex-grow container mx-auto px-4 py-8">
        <button
          className="btn btn-ghost mb-4"
          onClick={() => navigate(-1)}
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back
        </button>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Artwork Image */}
          <div className="rounded-lg overflow-hidden shadow-xl">
            <img
              src={artwork.imageUrl}
              alt={artwork.title}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Artwork Details */}
          <div className="space-y-4">
            <h1 className="text-3xl font-bold">{artwork.title}</h1>
            
            <div className="flex items-center gap-4">
              <div className="badge badge-outline badge-lg">{artwork.category}</div>
              <div className="badge badge-outline badge-lg">{artwork.medium}</div>
            </div>
            
            <div className="divider"></div>
            
            <div>
              <h2 className="text-xl font-semibold mb-2">Description</h2>
              <p>{artwork.description}</p>
            </div>
            
            {artwork.dimensions && (
              <div>
                <h2 className="text-xl font-semibold mb-2">Dimensions</h2>
                <p>{artwork.dimensions}</p>
              </div>
            )}
            
            {artwork.price && (
              <div>
                <h2 className="text-xl font-semibold mb-2">Price</h2>
                <p className="text-2xl font-bold text-primary">${artwork.price}</p>
              </div>
            )}
            
            <div className="divider"></div>
            
            {/* Artist Info */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Artist Information</h2>
              <div className="flex items-center gap-4">
                <div className="avatar">
                  <div className="w-16 rounded-full">
                    <img
                      src={artist?.photoURL || "https://i.ibb.co/vHJXmQ7/user.png"}
                      alt={artwork.artistName}
                    />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium">{artwork.artistName}</h3>
                  <p className="text-sm opacity-70">{artwork.userEmail}</p>
                </div>
              </div>
            </div>
            
            <div className="divider"></div>
            
            {/* Actions */}
            <div className="flex gap-4">
              <button
                onClick={handleLike}
                className="btn btn-outline btn-primary"
              >
                {isLiked ? (
                  <HeartSolidIcon className="w-5 h-5 text-red-500" />
                ) : (
                  <HeartOutlineIcon className="w-5 h-5" />
                )}
                {likesCount} Likes
              </button>
              
              <button
                onClick={handleFavorite}
                className="btn btn-outline btn-secondary"
              >
                {isFavorited ? (
                  <HeartSolidIcon className="w-5 h-5 text-red-500" />
                ) : (
                  <HeartOutlineIcon className="w-5 h-5" />
                )}
                {isFavorited ? "Favorited" : "Add to Favorites"}
              </button>
            </div>
          </div>
        </div>
      </div>
      
     
    </div>
  );
};

export default ArtworkDetails;