import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

import { addArtwork } from "../utils/api";
import toast from "react-hot-toast";

const AddArtwork = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    imageUrl: "",
    title: "",
    category: "Painting",
    medium: "",
    description: "",
    dimensions: "",
    price: "",
    visibility: "Public",
    artistName: "",
    userEmail: ""
  });

  const categories = [
    "Painting",
    "Digital Art",
    "Photography",
    "Sculpture",
    "Illustration",
    "Mixed Media",
    "Drawing",
    "Printmaking"
  ];

  const mediums = [
    "Oil",
    "Acrylic",
    "Watercolor",
    "Digital",
    "Photography",
    "Clay",
    "Metal",
    "Wood",
    "Pencil",
    "Charcoal",
    "Ink",
    "Mixed Media",
    "Other"
  ];

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        artistName: user.displayName || "",
        userEmail: user.email || ""
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("Adding artwork:", formData);
      await addArtwork(formData);
      toast.success("Artwork added successfully");
      navigate("/my-gallery");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      
      <div className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Add New Artwork</h1>
        
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image URL */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Image URL</span>
              </label>
              <input
                type="url"
                name="imageUrl"
                placeholder="https://example.com/artwork.jpg"
                className="input input-bordered"
                value={formData.imageUrl}
                onChange={handleChange}
                required
              />
            </div>
            
            {/* Title */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Title</span>
              </label>
              <input
                type="text"
                name="title"
                placeholder="Artwork title"
                className="input input-bordered"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
            
            {/* Category */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Category</span>
              </label>
              <select
                name="category"
                className="select select-bordered"
                value={formData.category}
                onChange={handleChange}
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Medium */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Medium/Tools</span>
              </label>
              <select
                name="medium"
                className="select select-bordered"
                value={formData.medium}
                onChange={handleChange}
              >
                <option value="">Select medium</option>
                {mediums.map(medium => (
                  <option key={medium} value={medium}>
                    {medium}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Description */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <textarea
                name="description"
                placeholder="Describe your artwork"
                className="textarea textarea-bordered h-24"
                value={formData.description}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            
            {/* Dimensions */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Dimensions (optional)</span>
              </label>
              <input
                type="text"
                name="dimensions"
                placeholder="e.g., 24x36 inches"
                className="input input-bordered"
                value={formData.dimensions}
                onChange={handleChange}
              />
            </div>
            
            {/* Price */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Price (optional)</span>
              </label>
              <input
                type="number"
                name="price"
                placeholder="0.00"
                className="input input-bordered"
                value={formData.price}
                onChange={handleChange}
                min="0"
                step="0.01"
              />
            </div>
            
            {/* Visibility */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Visibility</span>
              </label>
              <select
                name="visibility"
                className="select select-bordered"
                value={formData.visibility}
                onChange={handleChange}
              >
                <option value="Public">Public</option>
                <option value="Private">Private</option>
              </select>
            </div>
            
            {/* Artist Name (Read-only) */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Artist Name</span>
              </label>
              <input
                type="text"
                name="artistName"
                className="input input-bordered bg-gray-100"
                value={formData.artistName}
                readOnly
              />
            </div>
            
            {/* User Email (Read-only) */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">User Email</span>
              </label>
              <input
                type="email"
                name="userEmail"
                className="input input-bordered bg-gray-100"
                value={formData.userEmail}
                readOnly
              />
            </div>
            
            {/* Submit Button */}
            <div className="form-control mt-6">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? "Adding..." : "Add Artwork"}
              </button>
            </div>
          </form>
        </div>
      </div>
      
     
    </div>
  );
};

export default AddArtwork;