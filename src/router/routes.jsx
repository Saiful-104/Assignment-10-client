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
import PrivateRoute from "./PrivateRoute";

  

    
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
                    element:(
                       <PrivateRoute>
                        <AddArtworkPage/>
                       </PrivateRoute>
                    ),

                   },

                   {
                    path:"/AllArtworks",
                    element:<AllArtworksPage/>,
                   },

                   {
                    path:"/details/:id",
                    element:(
                   <PrivateRoute>
                     <ArtworkDetailsPage/>
                   </PrivateRoute>
                    ),
                   },
                   {
                    path:"/my-gallery",
                    element:(
                   <PrivateRoute>
                     <MyGalleryPage/>
                   </PrivateRoute>
                    ),
                   },

                   {
                    path:"/my-favorites",
                  element:(
                   <PrivateRoute>
                   <MyFavoritesPage/>
                   </PrivateRoute>
                    ),
                   }

            ],
        },
        {
            path:"*",
            element:<NotFound/>,
},
    ])