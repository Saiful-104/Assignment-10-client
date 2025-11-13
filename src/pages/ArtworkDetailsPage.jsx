import React, { useState, useEffect } from 'react';
import { Heart, Star, ArrowLeft, Calendar, DollarSign, Ruler, Palette, Eye, Share2, MessageCircle } from 'lucide-react';

export default function ArtworkDetailsPage() {
  // For demo purposes, we'll use the first artwork
  const [selectedId, setSelectedId] = useState('1');
  
  // Dummy artworks data (simulating DB)
  const dummyArtworks = [
    {
      id: '1',
      imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5',
      title: 'Sunset Dreams',
      artistName: 'Sarah Anderson',
      artistPhoto: 'https://i.pravatar.cc/150?img=47',
      artistBio: 'Contemporary artist specializing in oil paintings and mixed media. Based in San Francisco.',
      artistTotalArtworks: 24,
      category: 'Painting',
      medium: 'Oil on Canvas',
      description: 'A vibrant exploration of sunset hues over the Pacific Ocean. This piece captures the fleeting moment when day transitions to night, with bold brushstrokes and a rich color palette that evokes both tranquility and intensity. The layered technique creates depth and movement, inviting viewers to lose themselves in the scene.',
      dimensions: '36 x 48 inches',
      price: 1200,
      likes: 245,
      views: 1823,
      visibility: 'public',
      createdAt: '2024-01-15',
      tags: ['sunset', 'ocean', 'contemporary', 'colorful']
    },
    {
      id: '2',
      imageUrl: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912',
      title: 'Urban Chaos',
      artistName: 'Michael Chen',
      artistPhoto: 'https://i.pravatar.cc/150?img=12',
      artistBio: 'Digital artist and illustrator exploring the intersection of technology and human experience.',
      artistTotalArtworks: 18,
      category: 'Digital Art',
      medium: 'Digital (Procreate)',
      description: 'An abstract representation of modern city life, where geometric shapes and vibrant colors collide to create a sense of organized chaos. This digital piece reflects the overwhelming yet exciting nature of urban environments.',
      dimensions: 'Digital - 4000 x 5000 px',
      price: 800,
      likes: 189,
      views: 1456,
      visibility: 'public',
      createdAt: '2024-02-10',
      tags: ['abstract', 'urban', 'digital', 'modern']
    },
    {
      id: '3',
      imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f',
      title: 'Mountain Serenity',
      artistName: 'Emma Williams',
      artistPhoto: 'https://i.pravatar.cc/150?img=32',
      artistBio: 'Nature photographer with a passion for capturing the raw beauty of landscapes around the world.',
      artistTotalArtworks: 31,
      category: 'Photography',
      medium: 'Digital Photography',
      description: 'Captured during a solo hiking trip in the Rocky Mountains at dawn. The soft morning light filtering through the mist creates an ethereal atmosphere that speaks to the peaceful solitude found in nature.',
      dimensions: '24 x 36 inches (Print)',
      price: 450,
      likes: 312,
      views: 2104,
      visibility: 'public',
      createdAt: '2024-01-20',
      tags: ['nature', 'mountains', 'landscape', 'serene']
    }
  ];

  const [artwork, setArtwork] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [loading, setLoading] = useState(true);

  // Simulate fetching artwork from DB
  useEffect(() => {
    setLoading(true);
    // In real app: fetch(`/api/artworks/${selectedId}`)
    const foundArtwork = dummyArtworks.find(art => art.id === selectedId);
    
    if (foundArtwork) {
      setArtwork(foundArtwork);
      setLikeCount(foundArtwork.likes);
      
      // Check if user already liked/favorited (from localStorage)
      const liked = localStorage.getItem(`liked_${selectedId}`) === 'true';
      const favorited = localStorage.getItem(`favorited_${selectedId}`) === 'true';
      setIsLiked(liked);
      setIsFavorited(favorited);
    }
    
    setLoading(false);
  }, [selectedId]);

  const handleLike = () => {
    if (isLiked) {
      // Unlike
      setLikeCount(prev => prev - 1);
      setIsLiked(false);
      localStorage.removeItem(`liked_${selectedId}`);
      showToastMessage('Removed from likes');
    } else {
      // Like
      setLikeCount(prev => prev + 1);
      setIsLiked(true);
      localStorage.setItem(`liked_${selectedId}`, 'true');
      showToastMessage('Added to likes! ❤️');
      
      // In real app: 
      // await fetch(`/api/artworks/${selectedId}/like`, { method: 'POST' })
    }
  };

  const handleFavorite = () => {
    if (isFavorited) {
      // Remove from favorites
      setIsFavorited(false);
      localStorage.removeItem(`favorited_${selectedId}`);
      showToastMessage('Removed from favorites');
    } else {
      // Add to favorites
      setIsFavorited(true);
      localStorage.setItem(`favorited_${selectedId}`, 'true');
      showToastMessage('Added to favorites! ⭐');
      
      // In real app:
      // await fetch(`/api/favorites`, { 
      //   method: 'POST',
      //   body: JSON.stringify({ artworkId: selectedId })
      // })
    }
  };

  const showToastMessage = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: artwork.title,
        text: `Check out "${artwork.title}" by ${artwork.artistName}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToastMessage('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading artwork...</p>
        </div>
      </div>
    );
  }

  if (!artwork) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Artwork not found</h2>
          <p className="text-gray-600">Please select an artwork to view</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Artwork Selector for Demo */}
        <div className="mb-6 bg-white rounded-xl shadow-md p-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Select Artwork to View:
          </label>
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="1">Sunset Dreams by Sarah Anderson</option>
            <option value="2">Urban Chaos by Michael Chen</option>
            <option value="3">Mountain Serenity by Emma Williams</option>
          </select>
        </div>

        {/* Back Button */}
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition mb-6 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition" />
          <span className="font-medium">Back to Gallery</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Image */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
              <div className="relative aspect-square bg-gray-100">
                <img
                  src={artwork.imageUrl}
                  alt={artwork.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-white rounded-full px-4 py-2 text-sm font-semibold text-purple-600 shadow-lg">
                  {artwork.category}
                </div>
              </div>

              <div className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                      {artwork.title}
                    </h1>
                    <p className="text-gray-600 text-lg">by {artwork.artistName}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-purple-600 mb-1">
                      ${artwork.price}
                    </div>
                    <div className="flex items-center gap-1 text-gray-500 text-sm">
                      <Eye className="w-4 h-4" />
                      {artwork.views} views
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mb-6">
                  <button
                    onClick={handleLike}
                    className={`flex-1 py-4 rounded-xl font-semibold transition flex items-center justify-center gap-2 ${
                      isLiked
                        ? 'bg-red-500 text-white hover:bg-red-600'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                    {isLiked ? 'Liked' : 'Like'} ({likeCount})
                  </button>

                  <button
                    onClick={handleFavorite}
                    className={`flex-1 py-4 rounded-xl font-semibold transition flex items-center justify-center gap-2 ${
                      isFavorited
                        ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Star className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
                    {isFavorited ? 'Favorited' : 'Add to Favorites'}
                  </button>

                  <button
                    onClick={handleShare}
                    className="px-6 py-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Description</h3>
                  <p className="text-gray-700 leading-relaxed">{artwork.description}</p>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-purple-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-purple-600 mb-2">
                      <Palette className="w-5 h-5" />
                      <span className="font-semibold">Medium</span>
                    </div>
                    <p className="text-gray-700">{artwork.medium}</p>
                  </div>

                  <div className="bg-blue-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-blue-600 mb-2">
                      <Ruler className="w-5 h-5" />
                      <span className="font-semibold">Dimensions</span>
                    </div>
                    <p className="text-gray-700">{artwork.dimensions}</p>
                  </div>

                  <div className="bg-green-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-green-600 mb-2">
                      <Calendar className="w-5 h-5" />
                      <span className="font-semibold">Created</span>
                    </div>
                    <p className="text-gray-700">
                      {new Date(artwork.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>

                  <div className="bg-orange-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-orange-600 mb-2">
                      <DollarSign className="w-5 h-5" />
                      <span className="font-semibold">Price</span>
                    </div>
                    <p className="text-gray-700">${artwork.price} USD</p>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {artwork.tags.map(tag => (
                    <span
                      key={tag}
                      className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-200 transition cursor-pointer"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Artist Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-2xl p-6 sticky top-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">About the Artist</h3>

              <div className="text-center mb-6">
                <img
                  src={artwork.artistPhoto}
                  alt={artwork.artistName}
                  className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-purple-100 shadow-lg"
                />
                <h4 className="text-2xl font-bold text-gray-900 mb-2">
                  {artwork.artistName}
                </h4>
                <p className="text-gray-600 mb-4">{artwork.artistBio}</p>

                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 mb-4">
                  <div className="text-3xl font-bold text-purple-600 mb-1">
                    {artwork.artistTotalArtworks}
                  </div>
                  <div className="text-gray-600 font-medium">Total Artworks</div>
                </div>

                <button
                  onClick={() => alert('Artist profile page - to be implemented')}
                  className="block w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl hover:from-purple-700 hover:to-blue-700 transition font-semibold"
                >
                  View Artist Profile
                </button>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h4 className="font-bold text-gray-900 mb-4">Connect</h4>
                <div className="space-y-3">
                  <button className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200 transition flex items-center justify-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    Send Message
                  </button>
                  <button className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200 transition">
                    Follow Artist
                  </button>
                </div>
              </div>

              <div className="border-t border-gray-200 mt-6 pt-6">
                <h4 className="font-bold text-gray-900 mb-4">Stats</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Likes</span>
                    <span className="font-bold text-gray-900">{likeCount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Views</span>
                    <span className="font-bold text-gray-900">{artwork.views}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Category</span>
                    <span className="font-bold text-gray-900">{artwork.category}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-8 right-8 bg-gray-900 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-slide-up z-50">
          <div className="bg-white rounded-full p-1">
            <Heart className="w-5 h-5 text-red-500 fill-current" />
          </div>
          <p className="font-medium">{toastMessage}</p>
        </div>
      )}

      <style>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}