
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";

const Home = () => {
  const [featuredArtworks, setFeaturedArtworks] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [communityHighlights, setCommunityHighlights] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      title: "Discover Amazing Art",
      description:
        "Explore a diverse collection of artworks from talented artists worldwide.",
      image: "https://picsum.photos/seed/slide1/1200/400.jpg",
    },
    {
      id: 2,
      title: "Trending Artists",
      description:
        "Meet the artists who are making waves in the art community.",
      image: "https://picsum.photos/seed/slide2/1200/400.jpg",
    },
    {
      id: 3,
      title: "Join Our Community",
      description:
        "Share your own art and connect with fellow art enthusiasts.",
      image: "https://picsum.photos/seed/slide3/1200/400.jpg",
    },
  ];

  useEffect(() => {
    const fetchFeaturedArtworks = async () => {
      try {
        const artworksQuery = query(
          collection(db, "artworks"),
          orderBy("createdAt", "desc"),
          limit(6)
        );
        const querySnapshot = await getDocs(artworksQuery);
        const artworks = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFeaturedArtworks(artworks);
      } catch (error) {
        console.error("Error fetching featured artworks:", error);
        // Use dummy data if Firebase is not set up
        setFeaturedArtworks([
          {
            id: 1,
            title: "Sunset Dreams",
            artistName: "Jane Doe",
            category: "Landscape",
            imageUrl: "https://picsum.photos/seed/art1/300/400.jpg",
          },
          {
            id: 2,
            title: "Urban Chaos",
            artistName: "John Smith",
            category: "Abstract",
            imageUrl: "https://picsum.photos/seed/art2/300/400.jpg",
          },
          {
            id: 3,
            title: "Nature's Beauty",
            artistName: "Emily Johnson",
            category: "Nature",
            imageUrl: "https://picsum.photos/seed/art3/300/400.jpg",
          },
          {
            id: 4,
            title: "Digital Dreams",
            artistName: "Michael Brown",
            category: "Digital",
            imageUrl: "https://picsum.photos/seed/art4/300/400.jpg",
          },
          {
            id: 5,
            title: "Portrait of Time",
            artistName: "Sarah Wilson",
            category: "Portrait",
            imageUrl: "https://picsum.photos/seed/art5/300/400.jpg",
          },
          {
            id: 6,
            title: "Abstract Thoughts",
            artistName: "David Lee",
            category: "Abstract",
            imageUrl: "https://picsum.photos/seed/art6/300/400.jpg",
          },
        ]);
      }
    };

    const fetchTopArtists = async () => {
      // Dummy data for top artists
      setTopArtists([
        {
          id: 1,
          name: "Jane Doe",
          avatar: "https://picsum.photos/seed/artist1/100/100.jpg",
          followers: 1234,
        },
        {
          id: 2,
          name: "John Smith",
          avatar: "https://picsum.photos/seed/artist2/100/100.jpg",
          followers: 987,
        },
        {
          id: 3,
          name: "Emily Johnson",
          avatar: "https://picsum.photos/seed/artist3/100/100.jpg",
          followers: 856,
        },
        {
          id: 4,
          name: "Michael Brown",
          avatar: "https://picsum.photos/seed/artist4/100/100.jpg",
          followers: 743,
        },
      ]);
    };

    const fetchCommunityHighlights = async () => {
      // Dummy data for community highlights
      setCommunityHighlights([
        {
          id: 1,
          title: "Weekly Art Challenge",
          description:
            "Join our weekly art challenge and showcase your creativity!",
          image: "https://picsum.photos/seed/highlight1/400/250.jpg",
        },
        {
          id: 2,
          title: "Artist Spotlight",
          description:
            "This week we're featuring the incredible work of Alex Turner.",
          image: "https://picsum.photos/seed/highlight2/400/250.jpg",
        },
      ]);
    };

    fetchFeaturedArtworks();
    fetchTopArtists();
    fetchCommunityHighlights();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner/Slider */}
      <div className="relative h-96 overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <div className="text-center text-white">
                <h2 className="text-4xl font-bold mb-4">{slide.title}</h2>
                <p className="text-xl max-w-2xl mx-auto">{slide.description}</p>
              </div>
            </div>
          </div>
        ))}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full ${
                index === currentSlide ? "bg-white" : "bg-white bg-opacity-50"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Featured Artworks Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">
          Featured Artworks
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredArtworks.map((artwork) => (
            <div
              key={artwork.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <img
                src={artwork.imageUrl}
                alt={artwork.title}
                className="w-full h-64 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {artwork.title}
                </h3>
                <p className="text-gray-600 mb-1">by {artwork.artistName}</p>
                <p className="text-gray-500 text-sm mb-4">{artwork.category}</p>
                <Link
                  to={`/artwork/${artwork.id}`}
                  className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition duration-300"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Artists Section */}
      <div className="bg-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            Top Artists of the Week
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {topArtists.map((artist) => (
              <div
                key={artist.id}
                className="bg-white rounded-lg shadow-md p-6 text-center"
              >
                <img
                  src={artist.avatar}
                  alt={artist.name}
                  className="w-20 h-20 rounded-full mx-auto mb-4"
                />
                <h3 className="text-lg font-semibold text-gray-800">
                  {artist.name}
                </h3>
                <p className="text-gray-600">{artist.followers} followers</p>
                <Link
                  to={`/artist/${artist.id}`}
                  className="mt-4 inline-block text-indigo-600 hover:text-indigo-800"
                >
                  View Profile
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Community Highlights Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">
          Community Highlights
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {communityHighlights.map((highlight) => (
            <div
              key={highlight.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <img
                src={highlight.image}
                alt={highlight.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {highlight.title}
                </h3>
                <p className="text-gray-600">{highlight.description}</p>
                <button className="mt-4 text-indigo-600 hover:text-indigo-800 font-medium">
                  Learn More
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
