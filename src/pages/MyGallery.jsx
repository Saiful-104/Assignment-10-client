import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, X, Check } from 'lucide-react';

export default function MyGalleryPage() {
  // Logged-in user
  const currentUser = {
    id: 1,
    name: "Sarah Anderson",
    email: "sarah.anderson@email.com"
  };

  // Initial artworks
  const initialArtworks = [
    {
      id: 1,
      imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5',
      title: 'Sunset Dreams',
      category: 'painting',
      medium: 'Oil on Canvas',
      description: 'A vibrant sunset over the ocean',
      dimensions: '36 x 48 inches',
      price: '1200',
      visibility: 'public',
      userName: 'Sarah Anderson',
      userEmail: 'sarah.anderson@email.com',
      likes: 245,
      views: 1823
    },
    {
      id: 2,
      imageUrl: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968',
      title: 'Abstract Emotions',
      category: 'mixed media',
      medium: 'Acrylic and Collage',
      description: 'Exploring human emotions through color',
      dimensions: '24 x 30 inches',
      price: '950',
      visibility: 'public',
      userName: 'Sarah Anderson',
      userEmail: 'sarah.anderson@email.com',
      likes: 167,
      views: 892
    }
  ];

  const [artworks, setArtworks] = useState([]);
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '' });
  const [formData, setFormData] = useState({
    imageUrl: '',
    title: '',
    category: '',
    medium: '',
    description: '',
    dimensions: '',
    price: '',
    visibility: 'public'
  });

  // Load artworks
  useEffect(() => {
    const saved = localStorage.getItem('userArtworks');
    if (saved) setArtworks(JSON.parse(saved));
    else {
      setArtworks(initialArtworks);
      localStorage.setItem('userArtworks', JSON.stringify(initialArtworks));
    }
  }, []);

  // Persist
  useEffect(() => {
    localStorage.setItem('userArtworks', JSON.stringify(artworks));
  }, [artworks]);

  const openUpdateModal = (art) => {
    setSelectedArtwork(art);
    setFormData({ ...art });
    setShowUpdateModal(true);
  };

  const closeUpdateModal = () => {
    setShowUpdateModal(false);
    setSelectedArtwork(null);
  };

  const handleUpdate = () => {
    setArtworks(prev =>
      prev.map(a => (a.id === selectedArtwork.id ? { ...selectedArtwork, ...formData } : a))
    );
    showToastNotification('Artwork updated successfully!');
    closeUpdateModal();
  };

  const openDeleteModal = (art) => {
    setSelectedArtwork(art);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedArtwork(null);
  };

  const handleDelete = () => {
    setArtworks(prev => prev.filter(a => a.id !== selectedArtwork.id));
    showToastNotification('Artwork deleted successfully!');
    closeDeleteModal();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const showToastNotification = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: '' }), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl text-gray-800 font-bold mb-6">My Gallery</h1>

        {artworks.length === 0 ? (
          <p className="text-gray-700">No artworks yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {artworks.map(art => (
              <div key={art.id} className="bg-white rounded-xl shadow overflow-hidden">
                <img src={art.imageUrl} alt={art.title} className="w-full h-64 object-cover" />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-700">{art.title}</h3>
                  <p className="text-sm text-gray-600">{art.medium}</p>
                  <div className="flex justify-between mt-3">
                    <button
                      onClick={() => openUpdateModal(art)}
                      className="flex-1 py-2 mr-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition flex items-center justify-center gap-2"
                    >
                      <Edit2 className="w-4 h-4" /> Update
                    </button>
                    <button
                      onClick={() => openDeleteModal(art)}
                      className="flex-1 py-2 ml-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition flex items-center justify-center gap-2"
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
            <div className="bg-white text-black rounded-2xl max-w-xl w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Update Artwork</h2>
                <button onClick={closeUpdateModal}><X className="w-6 h-6" /></button>
              </div>
              <div className="space-y-4">
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Title"
                />
                <input
                  type="text"
                  name="medium"
                  value={formData.medium}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Medium"
                />
                <input
                  type="text"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Price"
                />
              </div>
              <div className="flex gap-3 mt-4">
                <button onClick={closeUpdateModal} className="flex-1 py-2 rounded-lg bg-gray-200">Cancel</button>
                <button onClick={handleUpdate} className="flex-1 py-2 rounded-lg bg-blue-600 text-white">Update</button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Modal */}
        {showDeleteModal && selectedArtwork && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white text-orange-950 rounded-2xl max-w-md w-full p-6 text-center">
              <h2 className="text-2xl font-bold mb-2">Delete Artwork?</h2>
              <p className="text-gray-600 mb-4">Are you sure you want to delete "{selectedArtwork.title}"?</p>
              <div className="flex gap-3">
                <button onClick={closeDeleteModal} className="flex-1 py-2 rounded-lg bg-gray-200">Cancel</button>
                <button onClick={handleDelete} className="flex-1 py-2 rounded-lg bg-red-600 text-white">Delete</button>
              </div>
            </div>
          </div>
        )}

        {/* Toast */}
        {toast.show && (
          <div className="fixed bottom-8 right-8 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg">
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
