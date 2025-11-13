import React, { useState } from "react";
import { Upload, Check, X } from "lucide-react";

export default function AddArtworkPage() {
  const currentUser = {
    name: "Sarah Anderson",
    email: "sarah.anderson@email.com",
  };

  const [formData, setFormData] = useState({
    imageUrl: "",
    title: "",
    category: "",
    medium: "",
    description: "",
    dimensions: "",
    price: "",
    visibility: "public",
  });

  const [showToast, setShowToast] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

     const handleSubmit = async(e)=>{
      e.preventDefault();

      const artworkData ={
        ...formData,
         userName: currentUser.name,
    userEmail: currentUser.email,
    createdAt: new Date().toISOString(),

      };
       try {
    const res = await fetch("http://localhost:3000/artworks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(artworkData),
    });

    const data = await res.json();

    if (data.success) {
      console.log("Artwork added:", data.result);
      setShowToast(true);

      // Reset form
      setFormData({
        imageUrl: "",
        title: "",
        category: "",
        medium: "",
        description: "",
        dimensions: "",
        price: "",
        visibility: "public",
      });

      setTimeout(() => setShowToast(false), 3000);
    } else {
      console.error("Failed to add artwork");
    }
  } catch (error) {
    console.error("Error:", error);
  }
     }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-md p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Add New Artwork</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Image URL */}
          <input
            type="text"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            placeholder="Image URL"
            className="w-full text-gray-800 p-3 border rounded-xl focus:ring-2 focus:ring-purple-500"
            required
          />

          {/* Title */}
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Title"
            className="w-full p-3 text-gray-700 border rounded-xl focus:ring-2 focus:ring-purple-500"
            required
          />

          {/* Category */}
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="Category"
            className="w-full text-gray-800 p-3 border rounded-xl focus:ring-2 focus:ring-purple-500"
            required
          />

          {/* Medium/Tools */}
          <input
            type="text"
            name="medium"
            value={formData.medium}
            onChange={handleChange}
            placeholder="Medium/Tools"
            className="w-full p-3  text-gray-800 border rounded-xl focus:ring-2 focus:ring-purple-500"
            required
          />

          {/* Description */}
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full p-3  text-gray-800 border rounded-xl focus:ring-2 focus:ring-purple-500"
            rows="3"
            required
          />

          {/* Dimensions (optional) */}
          <input
            type="text"
            name="dimensions"
            value={formData.dimensions}
            onChange={handleChange}
            placeholder="Dimensions (optional)"
            className="w-full  text-gray-800 p-3 border rounded-xl focus:ring-2 focus:ring-purple-500"
          />

          {/* Price (optional) */}
          <input
            type="text"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Price (optional)"
            className="w-full  text-gray-800 p-3 border rounded-xl focus:ring-2 focus:ring-purple-500"
          />

          {/* Visibility */}
          <div className="flex items-center gap-6">
            <label className="flex   text-gray-800 items-center gap-2">
              <input
                type="radio"
                name="visibility"
                value="public"
                checked={formData.visibility === "public"}
                onChange={handleChange}
              />
              Public
            </label>
            <label className="flex   text-gray-800 items-center gap-2">
              <input
                type="radio"
                name="visibility"
                value="private"
                checked={formData.visibility === "private"}
                onChange={handleChange}
              />
              Private
            </label>
          </div>

          {/* User Info */}
          <div className= "  text-gray-800 bg-gray-50 p-4 rounded-xl border">
            <p><strong>Name:</strong> {currentUser.name}</p>
            <p><strong>Email:</strong> {currentUser.email}</p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-purple-600 text-white font-semibold py-3 rounded-xl hover:bg-purple-700 transition"
          >
            <Upload className="inline-block w-5 h-5 mr-2 mb-1" />
            Add Artwork
          </button>
        </form>
      </div>

      {/* Toast */}
      {showToast && (
        <div className="fixed bottom-8 right-8 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-3">
          <Check className="w-5 h-5" />
          <p>Artwork added successfully!</p>
          <button onClick={() => setShowToast(false)}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
