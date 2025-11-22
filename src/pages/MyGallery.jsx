import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, X, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Await } from 'react-router';

export default function MyGalleryPage() {
 
  const {currentUser}=useAuth();

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

  const showToast =(msg)=>{
    setToast({ show: true, message: msg });
    setTimeout(() => setToast({ show: false, message: '' }), 2500);
  }

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
   useEffect(()=>{
     const myArtworks= async()=>{
      if(!currentUser){
        return;
      }
   const token = await currentUser.getIdToken();
   //console.log("User Token:", token);
   const res = await fetch('http://localhost:3000/my-artworks', {
     headers: {
       'Authorization': `Bearer ${token}`

     }
    });
    const data = await res.json();
    console.log("Fetched My Artworks:", data);
    setArtworks(data);
  }
  myArtworks();
   },[currentUser]) 

  const openUpdateModal = (art) => {
    setSelectedArtwork(art);
    setFormData({ ...art });
    setShowUpdateModal(true);
  };

  const closeUpdateModal = () => {
    setShowUpdateModal(false);
    setSelectedArtwork(null);
  };

    const handleUpdate = async () => {
  try {
    const token = await currentUser.getIdToken();
    const res = await fetch(`http://localhost:3000/artworks/${selectedArtwork._id}`, {
      method:"PUT",
      headers:{
        'Content-Type':'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(formData)
    });
    const data = await res.json();
    if(data.success){
      setArtworks(prev => prev.map(art => art._id === selectedArtwork._id ? {...art, ...formData} : art));
      showToast('Artwork updated successfully!');
      closeUpdateModal();
    }
  } catch(err){
    console.log(err);
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
  try {
    const token = await currentUser.getIdToken();
    const res = await fetch(`http://localhost:3000/artworks/${selectedArtwork._id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    const data = await res.json();
    if(data.success){
      setArtworks(prev => prev.filter(a => a._id !== selectedArtwork._id));
      showToast('Artwork deleted successfully!');
      closeDeleteModal();
    }
  } catch(err) {
    console.log(err);
  }
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
