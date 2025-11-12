import React from "react";
import { Link } from "react-router-dom";
import { HomeIcon } from "@heroicons/react/24/outline";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-base-200">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-primary">404</h1>
        <h2 className="text-3xl font-semibold mt-4 mb-2">Oops! Page Not Found</h2>
        <p className="text-lg mb-8 max-w-md mx-auto">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link to="/" className="btn btn-primary">
          <HomeIcon className="w-5 h-5 mr-2" />
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;