# Implementation Guide for Assignment-10

## 🎯 Summary of What's Been Completed

### ✅ **Done**

1. **PrivateRoute Protection** - All required pages wrapped with `PrivateRoute`:

   - `/add-artwork` (AddArtwork)
   - `/artwork/:id` (ArtworkDetails)
   - `/my-gallery` (MyGallery)
   - `/my-favorites` (MyFavorites)

2. **LoadingSpinner Component** - Created at `src/components/LoadingSpinner.jsx`

3. **Page Structure** - All 4 required private pages created with:

   - Basic UI using Tailwind CSS
   - Form validation
   - Error handling with modals
   - Local storage persistence

4. **Route Configuration** - Clean, organized routes with PrivateRoute wrapper

5. **Auth Integration** - Firebase auth wired in with:
   - Login/Register pages
   - AuthProvider wrapping entire app
   - Loading states for auth checks

### 🔄 **How to Replace Dummy Data with MongoDB/Backend**

#### **1. For AllArtworksPage (Filter by Category)**

**File:** `src/pages/AllArtworksPage.jsx`

Replace the dummy data fetch with:

```javascript
useEffect(() => {
  const fetchArtworks = async () => {
    setLoading(true);
    try {
      // MongoDB query: db.artworks.find({category: selectedCategory})
      const response = await fetch(
        selectedCategory === "All"
          ? "/api/artworks"
          : `/api/artworks?category=${selectedCategory}`
      );
      const data = await response.json();
      setFilteredArtworks(data);
    } catch (error) {
      toast.error("Failed to fetch artworks");
    } finally {
      setLoading(false);
    }
  };
  fetchArtworks();
}, [selectedCategory]);
```

---

#### **2. For ArtworkDetailsPage (Like System - MongoDB $inc and $push/$pull)**

**File:** `src/pages/ArtworkDetailsPage.jsx`

**Backend Logic (MongoDB):**

```javascript
// LIKE (Increase) - MongoDB pattern
db.artworks.findByIdAndUpdate(artworkId, {
  $inc: { likes: 1 }, // Increase like count
  $push: { likedBy: userId }, // Add user to likedBy array
});

// UNLIKE (Decrease) - MongoDB pattern
db.artworks.findByIdAndUpdate(artworkId, {
  $inc: { likes: -1 }, // Decrease like count
  $pull: { likedBy: userId }, // Remove user from likedBy array
});
```

**Frontend Replace This:**

```javascript
const handleLike = async () => {
  try {
    const response = await fetch(`/api/artworks/${selectedId}/like`, {
      method: isLiked ? "DELETE" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: currentUser.id }),
    });
    const data = await response.json();
    setLikeCount(data.likes);
    setIsLiked(!isLiked);
    toast.success(isLiked ? "Removed from likes" : "Added to likes!");
  } catch (error) {
    toast.error("Failed to update like");
  }
};
```

---

#### **3. For MyGalleryPage (User's Artworks)**

**File:** `src/pages/MyGallery.jsx`

Replace dummy data with:

```javascript
useEffect(() => {
  const fetchMyArtworks = async () => {
    setLoading(true);
    try {
      // MongoDB: db.artworks.find({userId: currentUser.id})
      const response = await fetch("/api/my-artworks", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      const data = await response.json();
      setArtworks(data);
    } catch (error) {
      toast.error("Failed to fetch your artworks");
    } finally {
      setLoading(false);
    }
  };
  fetchMyArtworks();
}, []);
```

**For Update:**

```javascript
const handleUpdate = async () => {
  try {
    // MongoDB: db.artworks.findByIdAndUpdate(artworkId, {...update})
    const response = await fetch(`/api/artworks/${selectedArtwork.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const updated = await response.json();
    setArtworks((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
    toast.success("Artwork updated!");
    closeUpdateModal();
  } catch (error) {
    toast.error("Update failed");
  }
};
```

**For Delete:**

```javascript
const handleDelete = async () => {
  try {
    // MongoDB: db.artworks.findByIdAndDelete(artworkId)
    await fetch(`/api/artworks/${selectedArtwork.id}`, { method: "DELETE" });
    setArtworks((prev) => prev.filter((a) => a.id !== selectedArtwork.id));
    toast.success("Artwork deleted!");
    closeDeleteModal();
  } catch (error) {
    toast.error("Delete failed");
  }
};
```

---

#### **4. For MyFavoritesPage (Add to Favorites - MongoDB $push/$pull)**

**File:** `src/pages/MyFavorites.jsx`

**Backend MongoDB Pattern:**

```javascript
// ADD to favorites - MongoDB $push
db.users.findByIdAndUpdate(userId, {
  $push: { favorites: artworkId },
});

// REMOVE from favorites - MongoDB $pull
db.users.findByIdAndUpdate(userId, {
  $pull: { favorites: artworkId },
});
```

**Frontend Replace:**

```javascript
useEffect(() => {
  const fetchFavorites = async () => {
    try {
      // MongoDB: db.users.findById(userId).select('favorites')
      const response = await fetch("/api/my-favorites", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const data = await response.json();
      // data will be array of favorite artwork objects
      setFavorites(data);
    } catch (error) {
      toast.error("Failed to load favorites");
    }
  };
  fetchFavorites();
}, []);

const confirmRemoveFavorite = async () => {
  try {
    // Backend removes from db.users.favorites array
    await fetch(`/api/favorites/${artworkToRemove}`, { method: "DELETE" });
    setFavorites((prev) => prev.filter((art) => art.id !== artworkToRemove));
    toast.success("Removed from favorites");
    setShowConfirmDialog(false);
  } catch (error) {
    toast.error("Failed to remove favorite");
  }
};
```

---

#### **5. For AddArtworkPage (Create New Artwork)**

**File:** `src/pages/AddArtwork.jsx`

Replace form submission:

```javascript
const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateForm()) return;

  const artworkData = {
    ...formData,
    userId: currentUser.id,
    userName: currentUser.displayName,
    userEmail: currentUser.email,
    likes: 0,
    likedBy: [],
    createdAt: new Date().toISOString(),
  };

  try {
    // MongoDB: db.artworks.insertOne(artworkData)
    const response = await fetch("/api/artworks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(artworkData),
    });

    if (response.ok) {
      const saved = await response.json();
      toast.success("Artwork added successfully!");
      setFormData({
        /* reset form */
      });
      setImagePreview("");
      // Optionally redirect to artwork details
      navigate(`/artwork/${saved._id}`);
    }
  } catch (error) {
    toast.error("Failed to add artwork");
  }
};
```

---

## 📚 **Libraries Integration Guide**

### **react-image-gallery** - For ArtworkDetailsPage

```javascript
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";

const images = artworkList.map((art) => ({
  original: art.imageUrl,
  thumbnail: art.imageUrl,
  description: art.title,
}));

<ImageGallery items={images} showBullets showIndex />;
```

### **react-simple-typewriter** - For Home Page Banner

```javascript
import { Typewriter } from "react-simple-typewriter";

<h1>
  <Typewriter
    words={["Discover Art", "Share Creativity", "Join Community"]}
    loop
    cursor
    cursorStyle="_"
    typeSpeed={50}
    deleteSpeed={40}
    delaySpeed={2000}
  />
</h1>;
```

### **react-awesome-reveal** - For Animations

```javascript
import { Reveal } from "react-awesome-reveal";
import { keyframes } from "react-awesome-reveal";

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translate3d(0, 40px, 0);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
`;

<Reveal keyframes={fadeInUp} duration={600}>
  <YourComponent />
</Reveal>;
```

---

## 🎨 **Theme Toggle (Dark/Light Mode)**

**File to modify:** `src/components/Navbar.jsx`

Add this code:

```javascript
const [darkMode, setDarkMode] = useState(() => {
  return localStorage.getItem("theme") === "dark";
});

useEffect(() => {
  const theme = darkMode ? "dark" : "light";
  localStorage.setItem("theme", theme);
  document.documentElement.classList.toggle("dark", darkMode);
}, [darkMode]);

// Add button in navbar:
<button
  onClick={() => setDarkMode(!darkMode)}
  className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
>
  {darkMode ? <Sun size={20} /> : <Moon size={20} />}
</button>;
```

Then in your CSS/tailwind config, all dark mode classes will work automatically.

---

## ✨ **Final Checklist**

- [x] PrivateRoute protection on all 4 pages
- [x] LoadingSpinner created
- [x] Navbar/Footer visible except on 404
- [x] All pages have basic structure
- [ ] **TODO:** Connect to MongoDB backend
- [ ] **TODO:** Implement like system with $inc/$push/$pull
- [ ] **TODO:** Add filter dropdown working with backend
- [ ] **TODO:** Theme toggle in navbar
- [ ] **TODO:** Integrate all 3 libraries
- [ ] **TODO:** Add loading states to data fetches
- [ ] **TODO:** Test all features end-to-end

---

## 📝 **Key Notes**

1. **Dummy data:** All pages use dummy/localStorage data. Replace fetch calls with your backend endpoints.
2. **MongoDB Patterns:**
   - `$inc`: Increase/decrease number fields (likes)
   - `$push`: Add to array (likedBy, favorites)
   - `$pull`: Remove from array
3. **Error Handling:** Use toast/Swal for all user feedback
4. **Auth:** User info comes from `useAuth()` hook
5. **Routing:** All protected pages redirect to `/login` if not authenticated
