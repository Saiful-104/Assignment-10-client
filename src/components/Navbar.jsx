// src/components/Navbar.jsx
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import { FaBars, FaTimes, FaSignOutAlt } from "react-icons/fa";

const Navbar = () => {
  const { currentUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  const navLinkClass = ({ isActive }) =>
    `block px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
      isActive
        ? "text-indigo-600 font-semibold"
        : "text-gray-700 hover:text-indigo-500"
    }`;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navbar container */}
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <NavLink
              to="/"
              className="text-2xl font-extrabold text-indigo-600 tracking-wide"
            >
              Artify
            </NavLink>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex space-x-6 items-center">
            <NavLink to="/" className={navLinkClass}>
              Home
            </NavLink>
            <NavLink to="/AllArtworks" className={navLinkClass}>
              AllArtworks
            </NavLink>

            {currentUser && (
              <>
                <NavLink to="/add-artwork" className={navLinkClass}>
                  Add Artwork
                </NavLink>
                <NavLink to="/my-gallery" className={navLinkClass}>
                  My Gallery
                </NavLink>
                <NavLink to="/my-favorites" className={navLinkClass}>
                  My Favorites
                </NavLink>
              </>
            )}
          </div>

          {/* User / Auth buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center focus:outline-none"
                >
                  <img
                    className="h-9 w-9 rounded-full border-2 border-indigo-500 object-cover"
                    src={
                      currentUser.photoURL ||
                      "https://picsum.photos/seed/user/40/40.jpg"
                    }
                    alt="User"
                  />
                </button>
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg border border-gray-100">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b">
                      {currentUser.displayName || "User"}
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <FaSignOutAlt className="mr-2" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition"
                >
                  Register
                </NavLink>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-indigo-600 focus:outline-none"
            >
              {isOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-lg border-t border-gray-100">
          <div className="px-4 pt-2 pb-3 space-y-1">
            <NavLink
              to="/"
              className={navLinkClass}
              onClick={() => setIsOpen(false)}
            >
              Home
            </NavLink>
            <NavLink
              to="/explore"
              className={navLinkClass}
              onClick={() => setIsOpen(false)}
            >
              Explore
            </NavLink>

            {currentUser && (
              <>
                <NavLink
                  to="/add-artwork"
                  className={navLinkClass}
                  onClick={() => setIsOpen(false)}
                >
                  Add Artwork
                </NavLink>
                <NavLink
                  to="/my-gallery"
                  className={navLinkClass}
                  onClick={() => setIsOpen(false)}
                >
                  My Gallery
                </NavLink>
                <NavLink
                  to="/my-favorites"
                  className={navLinkClass}
                  onClick={() => setIsOpen(false)}
                >
                  My Favorites
                </NavLink>
              </>
            )}

            <div className="border-t pt-3">
              {currentUser ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md text-sm font-medium"
                >
                  <FaSignOutAlt className="mr-2" /> Logout
                </button>
              ) : (
                <>
                  <NavLink
                    to="/login"
                    className={navLinkClass}
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </NavLink>
                  <NavLink
                    to="/register"
                    className="block bg-indigo-600 text-white px-4 py-2 rounded-md text-center text-sm font-medium hover:bg-indigo-700"
                    onClick={() => setIsOpen(false)}
                  >
                    Register
                  </NavLink>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
