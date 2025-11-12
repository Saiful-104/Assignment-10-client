import React, { useState, useEffect } from "react";

import ArtworkCard from "../components/ArtworkCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { getArtworks, searchArtworks } from "../utils/api";
import toast from "react-hot-toast";

const ExploreArtworks = () => {
  const [artworks, setArtworks] = useState([]);
  const [filteredArtworks, setFilteredArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = [
    "All",
    "Painting",
    "Digital Art",
    "Photography",
    "Sculpture",
    "Illustration",
    "Mixed Media",
    "Drawing",
    "Printmaking"
  ];

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const data = await getArtworks();
        setArtworks(data);
        setFilteredArtworks(data);
      } catch (error) {
        toast.error("Failed to fetch artworks");
      } finally {
        setLoading(false);
      }
    };

    fetchArtworks();
  }, []);

  useEffect(() => {
    const filterArtworks = async () => {
      setLoading(true);
      try {
        const data = await searchArtworks(searchTerm, selectedCategory === "All" ? "" : selectedCategory);
        setFilteredArtworks(data);
      } catch (error) {
        toast.error("Failed to filter artworks");
      } finally {
        setLoading(false);
      }
    };

    const timerId = setTimeout(() => {
      if (searchTerm || selectedCategory !== "All") {
        filterArtworks();
      } else {
        setFilteredArtworks(artworks);
      }
    }, 500);

    return () => clearTimeout(timerId);
  }, [searchTerm, selectedCategory, artworks]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  if (loading && artworks.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen flex flex-col">
     
      
      <div className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Explore Artworks</h1>
        
        {/* Search and Filter Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="form-control w-full md:w-1/2">
              <input
                type="text"
                placeholder="Search by title or artist..."
                className="input input-bordered w-full"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`btn ${
                    selectedCategory === category
                      ? "btn-primary"
                      : "btn-outline"
                  }`}
                  onClick={() => handleCategoryChange(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Artworks Grid */}
        {loading ? (
          <LoadingSpinner />
        ) : filteredArtworks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredArtworks.map((artwork) => (
              <ArtworkCard key={artwork._id} artwork={artwork} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-2xl font-semibold mb-4">No artworks found</h3>
            <p className="text-gray-500">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
      
    
    </div>
  );
};

export default ExploreArtworks;