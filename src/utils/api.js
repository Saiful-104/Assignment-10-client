const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Helper to get common headers
const getHeaders = () => {
  const headers = { "Content-Type": "application/json" };
  const token = localStorage.getItem("token");
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
};

// Get user's favorite artworks
export const getMyFavorites = async (userId) => {
  const res = await fetch(`${API_BASE_URL}/favorites/${userId}`, {
    method: "GET",
    headers: getHeaders(),
  });
  const data = await res.json();
  return data;
};

// Fetch all artworks
export const getArtworks = async () => {
  const res = await fetch(`${API_BASE_URL}/artworks`, {
    method: "GET",
    headers: getHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch artworks");
  return data;
};

// Fetch single artwork by ID
export const getArtwork = async (id) => {
  const res = await fetch(`${API_BASE_URL}/artworks/${id}`, {
    method: "GET",
    headers: getHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch artwork");
  return data;
};

// Fetch latest artworks
export const getLatestArtworks = async () => {
  const res = await fetch(`${API_BASE_URL}/latest-artworks`, {
    method: "GET",
    headers: getHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch latest artworks");
  return data;
};

// ✅ Fetch top artists (ADD THIS)
export const getTopArtists = async () => {
  const res = await fetch(`${API_BASE_URL}/top-artists`, {
    method: "GET",
    headers: getHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch top artists");
  return data;
};

// Fetch my artworks
export const getMyArtworks = async () => {
  const res = await fetch(`${API_BASE_URL}/my-artworks`, {
    method: "GET",
    headers: getHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch my artworks");
  return data;
};

// Search artworks
export const searchArtworks = async (query, category) => {
  const params = new URLSearchParams();
  if (query) params.append("search", query);
  if (category) params.append("category", category);

  const res = await fetch(`${API_BASE_URL}/search?${params.toString()}`, {
    method: "GET",
    headers: getHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to search artworks");
  return data;
};

// Add a new artwork
export const addArtwork = async (artworkData) => {
  const res = await fetch(`${API_BASE_URL}/artworks`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(artworkData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to add artwork");
  return data;
};

// Update artwork
export const updateArtwork = async (id, artworkData) => {
  const res = await fetch(`${API_BASE_URL}/artworks/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(artworkData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to update artwork");
  return data;
};

// Delete artwork
export const deleteArtwork = async (id) => {
  const res = await fetch(`${API_BASE_URL}/artworks/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to delete artwork");
  return data;
};

// Like artwork
export const likeArtwork = async (id) => {
  const res = await fetch(`${API_BASE_URL}/artworks/${id}/like`, {
    method: "POST",
    headers: getHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to like artwork");
  return data;
};

// Favorite artwork
export const favoriteArtwork = async (id) => {
  const res = await fetch(`${API_BASE_URL}/artworks/${id}/favorite`, {
    method: "POST",
    headers: getHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to favorite artwork");
  return data;
};

// Get current user
export const getUser = async () => {
  const res = await fetch(`${API_BASE_URL}/user`, {
    method: "GET",
    headers: getHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to get user info");
  return data;
};

// Update user
export const updateUser = async (userData) => {
  const res = await fetch(`${API_BASE_URL}/user`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(userData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to update user");
  return data;
};
