import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { likeArtwork, favoriteArtwork } from "../utils/api";
import toast from "react-hot-toast";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";
import { HeartIcon as HeartOutlineIcon } from "@heroicons/react/24/outline";

const ArtworkCard = ({ artwork, showActions = true }) => {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [likesCount, setLikesCount] = useState(artwork.likes || 0);

  const handleLike = async () => {
    if (!user) {
      return toast.error("Please login to like artworks");
    }

    try {
      const result = await likeArtwork(artwork._id);
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
      const result = await favoriteArtwork(artwork._id);
      setIsFavorited(result.favorited);
      toast.success(result.favorited ? "Added to favorites" : "Removed from favorites");
    } catch (error) {
      toast.error("Failed to update favorites");
    }
  };

  return (
    <div className="card bg-base-100 shadow-xl h-full">
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
        <div className="card-actions justify-between items-center mt-2">
          <Link to={`/artwork/${artwork._id}`} className="btn btn-primary btn-sm">
            View Details
          </Link>
          
          {showActions && user && (
            <div className="flex gap-2">
              <button
                onClick={handleLike}
                className="btn btn-ghost btn-sm btn-circle"
              >
                {isLiked ? (
                  <HeartSolidIcon className="w-5 h-5 text-red-500" />
                ) : (
                  <HeartOutlineIcon className="w-5 h-5" />
                )}
              </button>
              <span className="text-sm">{likesCount}</span>
              
              <button
                onClick={handleFavorite}
                className="btn btn-ghost btn-sm btn-circle"
              >
                {isFavorited ? (
                  <HeartSolidIcon className="w-5 h-5 text-red-500" />
                ) : (
                  <HeartOutlineIcon className="w-5 h-5" />
                )}
              </button>
            </div>
          )}
        </div> 
      </div>
    </div>
  );
};

export default ArtworkCard;
