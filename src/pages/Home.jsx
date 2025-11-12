import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ArtworkCard from "../components/ArtworkCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { getLatestArtworks, getTopArtists } from "../utils/api";
import { Typewriter } from "react-simple-typewriter";

import { Fade } from "react-awesome-reveal";
import ImageGallery from "react-image-gallery";

const Home = () => {
  const [latestArtworks, setLatestArtworks] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [artworksData, artistsData] = await Promise.all([
          getLatestArtworks(),
          getTopArtists()
        ]);
        
        setLatestArtworks(artworksData);
        setTopArtists(artistsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const images = [
    {
      original: "https://i.ibb.co/6y2rF1q/art1.jpg",
      thumbnail: "https://i.ibb.co/6y2rF1q/art1.jpg",
      description: "Explore the world of digital art"
    },
    {
      original: "https://i.ibb.co/L8b3xJg/art2.jpg",
      thumbnail: "https://i.ibb.co/L8b3xJg/art2.jpg",
      description: "Discover talented artists from around the globe"
    },
    {
      original: "https://i.ibb.co/3s6T7mF/art3.jpg",
      thumbnail: "https://i.ibb.co/3s6T7mF/art3.jpg",
      description: "Share your creativity with the world"
    }
  ];

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen">
      
      
      {/* Hero Section with Banner */}
      <section className="hero bg-gradient-to-r from-primary to-secondary text-white py-20">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="text-center lg:text-left">
            <h1 className="text-5xl font-bold mb-6">
              Welcome to{" "}
              <span className="text-accent">Artify</span>
            </h1>
            <p className="text-xl mb-6">
              <Typewriter
                words={[
                  "Discover Amazing Artworks",
                  "Connect with Talented Artists",
                  "Share Your Creative Journey"
                ]}
                loop={0}
                cursor
                cursorStyle="_"
                typeSpeed={70}
                deleteSpeed={50}
                delaySpeed={1000}
              />
            </p>
            <div className="flex gap-4 justify-center lg:justify-start">
              <Link to="/explore" className="btn btn-accent">
                Explore Artworks
              </Link>
              <Link to="/register" className="btn btn-outline text-white border-white hover:bg-white hover:text-primary">
                Join Now
              </Link>
            </div>
          </div>
          <div className="card w-full lg:w-1/2 shadow-2xl">
            <ImageGallery
              items={images}
              showPlayButton={false}
              showFullscreenButton={false}
              showNav={false}
              autoPlay={true}
              slideInterval={3000}
            />
          </div>
        </div>
      </section>

      {/* Featured Artworks Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <Fade triggerOnce>
            <h2 className="text-4xl font-bold text-center mb-10">Featured Artworks</h2>
          </Fade>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestArtworks.map((artwork) => (
              <Fade key={artwork._id} triggerOnce>
                <ArtworkCard artwork={artwork} />
              </Fade>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <Link to="/explore" className="btn btn-primary">
              View All Artworks
            </Link>
          </div>
        </div>
      </section>

      {/* Top Artists Section */}
      <section className="py-16 px-4 bg-base-200">
        <div className="max-w-7xl mx-auto">
          <Fade triggerOnce>
            <h2 className="text-4xl font-bold text-center mb-10">Top Artists of the Week</h2>
          </Fade>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {topArtists.map((artist, index) => (
              <Fade key={index} triggerOnce delay={index * 100}>
                <div className="card bg-base-100 shadow-xl">
                  <div className="card-body items-center text-center">
                    <div className="avatar">
                      <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                        <img
                          src={`https://i.pravatar.cc/150?u=${artist._id}`}
                          alt={artist._id}
                        />
                      </div>
                    </div>
                    <h3 className="card-title">{artist._id}</h3>
                    <p className="text-sm opacity-70">{artist.count} Artworks</p>
                  </div>
                </div>
              </Fade>
            ))}
          </div>
        </div>
      </section>

      {/* Community Highlights Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <Fade triggerOnce>
            <h2 className="text-4xl font-bold text-center mb-10">Community Highlights</h2>
          </Fade>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Fade triggerOnce direction="left">
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h3 className="card-title">Join Our Creative Community</h3>
                  <p>
                    Connect with artists from around the world, share your work,
                    and get inspired by the creativity of others. Artify is more
                    than just a platform - it's a community where art comes to life.
                  </p>
                  <div className="card-actions justify-end">
                    <Link to="/register" className="btn btn-primary">
                      Join Now
                    </Link>
                  </div>
                </div>
              </div>
            </Fade>
            
            <Fade triggerOnce direction="right">
              <div className="card bg-base-100 shadow-xl">
                <figure className="h-64">
                  <img
                    src="https://i.ibb.co/6y2rF1q/art1.jpg"
                    alt="Community Art"
                    className="w-full h-full object-cover"
                  />
                </figure>
                <div className="card-body">
                  <h3 className="card-title">Featured Artist of the Month</h3>
                  <p>
                    Congratulations to our featured artist! Their unique style and
                    creative vision have captured the hearts of our community.
                  </p>
                  <div className="card-actions justify-end">
                    <button className="btn btn-primary">View Profile</button>
                  </div>
                </div>
              </div>
            </Fade>
          </div>
        </div>
      </section>

    
    </div>
  );
};

export default Home;