import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import { getMyArtworks, deleteArtwork } from "../utils/api";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

const MyGallery = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const data = await getMyArtworks();
        setArtworks(data);
      } catch (error) {
        toast.error("Failed to fetch your artworks");
      } finally {
        setLoading(false);
      }
    };

    fetchArtworks();
  }, []);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deleteArtwork(id);
        setArtworks(artworks.filter(artwork => artwork._id !== id));
        toast.success("Artwork deleted successfully");
      } catch (error) {
        toast.error("Failed to delete artwork");
      }
    }
  };

  const handleEdit = (id) => {
    navigate(`/update-artwork/${id}`);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen flex flex-col">
  
      
      <div className="flex-grow container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">My Gallery</h1>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/add-artwork")}
          >
            Add New Artwork
          </button>
        </div>
        
        {artworks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {artworks.map((artwork) => (
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
                  <div className="badge badge-outline">{artwork.category}</div>
                  <div className="badge badge-outline">{artwork.medium}</div>
                  <div className="card-actions justify-end">
                    <button
                      className="btn btn-outline btn-primary btn-sm"
                      onClick={() => handleEdit(artwork._id)}
                    >
                      <PencilIcon className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      className="btn btn-outline btn-error btn-sm"
                      onClick={() => handleDelete(artwork._id)}
                    >
                      <TrashIcon className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-2xl font-semibold mb-4">You haven't added any artworks yet</h3>
            <button
              className="btn btn-primary"
              onClick={() => navigate("/add-artwork")}
            >
              Add Your First Artwork
            </button>
          </div>
        )}
      </div>
      
   
    </div>
  );
};

export default MyGallery;