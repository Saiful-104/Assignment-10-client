import { createBrowserRouter } from "react-router";
import MainLayout from "../layout/MainLayout";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import NotFound from "../pages/NotFound";
import AddArtworkPage from "../pages/AddArtwork";
import AllArtworksPage from "../pages/AllArtworksPage";
import ArtworkDetailsPage from "../pages/ArtworkDetailsPage";
import MyGalleryPage from "../pages/MyGallery";
import MyFavoritesPage from "../pages/MyFavorites";

  

    
   export  const router = createBrowserRouter([
        {
            path:"/",
            element: <MainLayout/>,

            children:[

                   {
                     index:true,

                     element: <Home/>,
                   },

                   {
                    path:"/login",
                      element:<Login/>,
                   },

                   {
                    path: "/register",
                    element:<Register/>
                   },
                   {
                    path:"/add-artwork",
                    element:<AddArtworkPage/>,

                   },

                   {
                    path:"/AllArtworks",
                    element:<AllArtworksPage/>,
                   },

                   {
                    path:"/details",
                    element:<ArtworkDetailsPage/>
                   },
                   {
                    path:"/my-gallery",
                    element:<MyGalleryPage/>,
                   },

                   {
                    path:"/my-favorites",
                    element:<MyFavoritesPage/>,
                   }

            ],
        },
        {
            path:"*",
            element:<NotFound/>,
},
    ])