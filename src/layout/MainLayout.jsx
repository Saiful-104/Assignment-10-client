import { Outlet } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Toaster } from "react-hot-toast";

const MainLayout = () => {
  return (
    <div>
      <div className="max-w-7xl mx-auto">
        <Navbar />
        <div className="mt-4">
          <Outlet />
        </div>
        <Footer />
      </div>
      <Toaster position="top-right" />
    </div>
  );
};

export default MainLayout;
