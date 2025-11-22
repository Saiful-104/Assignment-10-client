// src/components/Navbar.jsx
import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";

// Icons
import { FaBars, FaTimes, FaSignOutAlt, FaMoon, FaSun } from "react-icons/fa";

// Libraries
import { Typewriter } from "react-simple-typewriter";
import { Fade } from "react-awesome-reveal";

const Navbar = () => {
  const { currentUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  // Theme state
  //const [theme, setTheme] = useState("light");
   const [theme, setTheme] = useState(localStorage.getItem('theme') || "light")

  // Load theme on start
useEffect(() => {
    const html = document.querySelector('html')
     html.setAttribute("data-theme", theme)
     localStorage.setItem("theme", theme)
  }, [theme])

  // Toggle theme
  const handleTheme = (checked) => {
    setTheme(checked ? "dark": "light")
  }

  // Logout function
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const navLinkClass = ({ isActive }) =>
    `block px-3 py-2 rounded-md text-sm font-medium transition ${
      isActive
        ? "text-indigo-600 font-semibold"
        : "text-gray-700 dark:text-gray-300 hover:text-indigo-500"
    }`;

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50">
      <Fade>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            {/* Logo with typewriter */}
            <NavLink
              to="/"
              className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400"
            >
              <Typewriter
                words={["Artify", "Creative Hub", "Inspire Art"]}
                cursor
                cursorStyle="|"
                typeSpeed={80}
                deleteSpeed={50}
                delaySpeed={1500}
              />
            </NavLink>

            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-6 items-center">
              <NavLink to="/" className={navLinkClass}>Home</NavLink>
              <NavLink to="/AllArtworks" className={navLinkClass}>AllArtworks</NavLink>

              {currentUser && (
                <>
                  <NavLink to="/add-artwork" className={navLinkClass}>Add Artwork</NavLink>
                  <NavLink to="/my-gallery" className={navLinkClass}>My Gallery</NavLink>
                  <NavLink to="/my-favorites" className={navLinkClass}>My Favorites</NavLink>
                </>
              )}
            </div>

            {/* Theme + User Options */}
            <div className="hidden md:flex items-center space-x-4">

              {/* Theme button */}
             <button
  onClick={() => handleTheme(theme === "light")}
  className="text-xl text-gray-700 dark:text-gray-300"
>
  {theme === "light" ? <FaMoon /> : <FaSun />}
</button>


              {/* Auth User */}
              {currentUser ? (
                <div
                  className="relative"
                  onMouseLeave={() => setShowDropdown(false)}
                >
                  <button
                    onMouseEnter={() => setShowDropdown(true)}
                    onClick={() => setShowDropdown((p) => !p)}
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

                  {/* Dropdown */}
                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-300 dark:border-gray-700">
                      <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 border-b">
                        {currentUser.displayName || "User"}
                      </div>

                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <FaSignOutAlt className="mr-2" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <NavLink to="/login" className={navLinkClass}>Login</NavLink>
                  <NavLink
                    to="/register"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-700"
                  >
                    Register
                  </NavLink>
                </>
              )}
            </div>

            {/* Mobile toggle button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-gray-700 dark:text-gray-300"
            >
              {isOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
            </button>
          </div>
        </div>
      </Fade>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          <div className="px-4 py-3 space-y-2">

            {/* Theme button */}
            <button
  onClick={() => handleTheme(theme === "light")}
  className="flex items-center gap-2 text-gray-700 dark:text-gray-300 py-2"
>
  {theme === "light" ? <FaMoon /> : <FaSun />}
  {theme === "light" ? "Dark Mode" : "Light Mode"}
</button>

            
            <NavLink to="/" className={navLinkClass}>Home</NavLink>
            <NavLink to="/AllArtworks" className={navLinkClass}>AllArtworks</NavLink>

            {currentUser && (
              <>
                <NavLink to="/add-artwork" className={navLinkClass}>Add Artwork</NavLink>
                <NavLink to="/my-gallery" className={navLinkClass}>My Gallery</NavLink>
                <NavLink to="/my-favorites" className={navLinkClass}>My Favorites</NavLink>
              </>
            )}

            <div className="border-t pt-2">
              {currentUser ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md"
                >
                  <FaSignOutAlt className="mr-2" />
                  Logout
                </button>
              ) : (
                <>
                  <NavLink to="/login" className={navLinkClass}>Login</NavLink>
                  <NavLink
                    to="/register"
                    className="block px-4 py-2 bg-indigo-600 text-white rounded-md text-center"
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
