import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ExploreArtworks from "../pages/ExploreArtworks";
import ArtworkDetails from "../pages/ArtworkDetails";
import AddArtwork from "../pages/AddArtwork";
import MyGallery from "../pages/MyGallery";
import MyFavorites from "../pages/MyFavorites";
import NotFound from "../pages/NotFound";
import PrivateRoute from "./PrivateRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "/", element: <Home/> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      { path: "/explore", element: <ExploreArtworks /> },
      { path: "/artwork/:id", element: <ArtworkDetails /> },
      {
        path: "/add-artwork",
        element: (
          <PrivateRoute>
            <AddArtwork />
          </PrivateRoute>
        ),
      },
      {
        path: "/my-gallery",
        element: (
          <PrivateRoute>
            <MyGallery />
          </PrivateRoute>
        ),
      },
      {
        path: "/my-favorites",
        element: (
          <PrivateRoute>
            <MyFavorites />
          </PrivateRoute>
        ),
      },
      { path: "*", element: <NotFound /> },
    ],
  },
]);
