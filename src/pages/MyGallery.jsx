import React, { useState, useEffect } from "react";
import { Edit2, Trash2, X, Check } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function MyGalleryPage() {
  const { currentUser } = useAuth();

  const [artworks, setArtworks] = useState([]);
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "" });
  const [loading, setLoading] = useState(false);
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

  const showToast = (msg) => {
    setToast({ show: true, message: msg });
    setTimeout(() => setToast({ show: false, message: "" }), 2500);
  };

  // Fetch user's artworks
  useEffect(() => {
    const fetchMyArtworks = async () => {
      if (!currentUser) {
        return;
      }

      try {
        const token = await currentUser.getIdToken();
        const res = await fetch(
          "https://assingnment-10-server.vercel.app/my-artworks",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch artworks");
        }

        const data = await res.json();
        setArtworks(data);
      } catch (error) {
        console.error("Error fetching artworks:", error);
        showToast("Failed to load artworks");
      }
    };

    fetchMyArtworks();
  }, [currentUser]);

  const openUpdateModal = (art) => {
    setSelectedArtwork(art);
    setFormData({
      imageUrl: art.imageUrl || "",
      title: art.title || "",
      category: art.category || "",
      medium: art.medium || "",
      description: art.description || "",
      dimensions: art.dimensions || "",
      price: art.price?.toString() || "",
      visibility: art.visibility || "public",
    });
    setShowUpdateModal(true);
  };

  const closeUpdateModal = () => {
    setShowUpdateModal(false);
    setSelectedArtwork(null);
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
  };

  const handleUpdate = async () => {
    if (!selectedArtwork) return;

    setLoading(true);
    try {
      const token = await currentUser.getIdToken();

      // Prepare data with proper type conversion
      const updateData = {
        ...formData,
        price: formData.price ? Number(formData.price) : 0,
      };

      const res = await fetch(
        `https://assingnment-10-server.vercel.app/artworks/${selectedArtwork._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updateData),
        }
      );

      const data = await res.json();

      if (data.success) {
        // Update local state with the updated artwork
        setArtworks((prev) =>
          prev.map((art) =>
            art._id === selectedArtwork._id ? { ...art, ...updateData } : art
          )
        );
        showToast("Artwork updated successfully!");
        closeUpdateModal();
      } else {
        showToast(data.message || "Update failed");
      }
    } catch (err) {
      console.error("Update error:", err);
      showToast("Server error during update");
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = (art) => {
    setSelectedArtwork(art);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedArtwork(null);
  };

  const handleDelete = async () => {
    if (!selectedArtwork) return;

    setLoading(true);
    try {
      const token = await currentUser.getIdToken();
      const res = await fetch(
        `https://assingnment-10-server.vercel.app/artworks/${selectedArtwork._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (data.success) {
        setArtworks((prev) =>
          prev.filter((a) => a._id !== selectedArtwork._id)
        );
        showToast("Artwork deleted successfully!");
        closeDeleteModal();
      } else {
        showToast(data.message || "Delete failed");
      }
    } catch (err) {
      console.error("Delete error:", err);
      showToast("Server error during deletion");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Please log in to view your gallery.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl text-gray-800 font-bold mb-6">My Gallery</h1>

        {artworks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No artworks yet.</p>
            <p className="text-gray-500 mt-2">
              Start adding your artworks to build your gallery!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {artworks.map((art) => (
              <div
                key={art._id}
                className="bg-white rounded-xl shadow overflow-hidden hover:shadow-lg transition"
              >
                <img
                  src={art.imageUrl}
                  alt={art.title}
                  className="w-full h-64 object-cover"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/400x300?text=Image+Not+Found";
                  }}
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-700 truncate">
                    {art.title}
                  </h3>
                  <p className="text-sm text-gray-600">{art.medium}</p>
                  {art.price > 0 && (
                    <p className="text-sm text-green-600 font-semibold mt-1">
                      ${art.price}
                    </p>
                  )}
                  <div className="flex justify-between mt-3 gap-2">
                    <button
                      onClick={() => openUpdateModal(art)}
                      className="flex-1 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition flex items-center justify-center gap-2"
                      disabled={loading}
                    >
                      <Edit2 className="w-4 h-4" /> Update
                    </button>
                    <button
                      onClick={() => openDeleteModal(art)}
                      className="flex-1 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition flex items-center justify-center gap-2"
                      disabled={loading}
                    >
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Update Modal */}
        {showUpdateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white text-black rounded-2xl max-w-xl w-full p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Update Artwork</h2>
                <button
                  onClick={closeUpdateModal}
                  disabled={loading}
                  className="hover:bg-gray-100 rounded-full p-1"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Artwork title"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Medium *
                  </label>
                  <input
                    type="text"
                    name="medium"
                    value={formData.medium}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="e.g., Oil on Canvas, Digital Art"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="0"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="e.g., Abstract, Portrait"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Describe your artwork"
                    rows="3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dimensions
                  </label>
                  <input
                    type="text"
                    name="dimensions"
                    value={formData.dimensions}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="e.g., 24x36 inches"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={closeUpdateModal}
                  className="flex-1 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  className="flex-1 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Modal */}
        {showDeleteModal && selectedArtwork && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white text-orange-950 rounded-2xl max-w-md w-full p-6 text-center">
              <h2 className="text-2xl font-bold mb-2">Delete Artwork?</h2>
              <p className="text-gray-600 mb-4">
                Are you sure you want to delete "
                <strong>{selectedArtwork.title}</strong>"? This action cannot be
                undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={closeDeleteModal}
                  className="flex-1 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Toast Notification */}
        {toast.show && (
          <div className="fixed bottom-8 right-8 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg animate-fade-in">
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5" />
              <span>{toast.message}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
