import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../hooks/useTheme";
import { Tooltip } from "react-tooltip";
import toast from "react-hot-toast";

const Navbar = () => {
  const { user, logOut } = useAuth();
  const [theme, toggleTheme] = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logOut();
      localStorage.removeItem("token");
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      toast.error("Failed to log out");
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="navbar bg-base-100 shadow-lg">
      <div className="navbar-start">
        <div className="dropdown">
          <label
            tabIndex={0}
            className="btn btn-ghost lg:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className={`menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52 ${
              isMenuOpen ? "block" : "hidden"
            }`}
          >
            <li>
              <Link to="/" className={isActive("/") ? "active" : ""}>
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/explore"
                className={isActive("/explore") ? "active" : ""}
              >
                Explore Artworks
              </Link>
            </li>
            {user && (
              <>
                <li>
                  <Link
                    to="/add-artwork"
                    className={isActive("/add-artwork") ? "active" : ""}
                  >
                    Add Artwork
                  </Link>
                </li>
                <li>
                  <Link
                    to="/my-gallery"
                    className={isActive("/my-gallery") ? "active" : ""}
                  >
                    My Gallery
                  </Link>
                </li>
                <li>
                  <Link
                    to="/my-favorites"
                    className={isActive("/my-favorites") ? "active" : ""}
                  >
                    My Favorites
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
        <Link to="/" className="btn btn-ghost normal-case text-xl font-bold">
          <span className="text-primary">Artify</span>
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link to="/" className={isActive("/") ? "active" : ""}>
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/explore"
              className={isActive("/explore") ? "active" : ""}
            >
              Explore Artworks
            </Link>
          </li>
          {user && (
            <>
              <li>
                <Link
                  to="/add-artwork"
                  className={isActive("/add-artwork") ? "active" : ""}
                >
                  Add Artwork
                </Link>
              </li>
              <li>
                <Link
                  to="/my-gallery"
                  className={isActive("/my-gallery") ? "active" : ""}
                >
                  My Gallery
                </Link>
              </li>
              <li>
                <Link
                  to="/my-favorites"
                  className={isActive("/my-favorites") ? "active" : ""}
                >
                  My Favorites
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
      <div className="navbar-end">
        <button
          className="btn btn-ghost btn-circle"
          onClick={toggleTheme}
          data-tooltip-id="theme-tooltip"
          data-tooltip-content={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          )}
        </button>
        <Tooltip id="theme-tooltip" />

        {user ? (
          <div className="dropdown dropdown-end">
            <label
              tabIndex={0}
              className="btn btn-ghost btn-circle avatar"
              data-tooltip-id="profile-tooltip"
              data-tooltip-content={user.displayName || "User Profile"}
            >
              <div className="w-10 rounded-full">
                <img
                  referrerPolicy="no-referrer"
                  alt="User Profile"
                  src={user.photoURL || "https://i.ibb.co/vHJXmQ7/user.png"}
                />
              </div>
            </label>
            <Tooltip id="profile-tooltip" />
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li className="text-center font-semibold">
                {user.displayName || "User"}
              </li>
              <li>
                <button onClick={handleLogout}>Logout</button>
              </li>
            </ul>
          </div>
        ) : (
          <div className="flex gap-2">
            <Link to="/login" className="btn btn-outline btn-primary">
              Login
            </Link>
            <Link to="/register" className="btn btn-primary">
              Register
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;