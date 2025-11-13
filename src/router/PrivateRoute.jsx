import React, { useContext } from 'react';

import {AuthContext} from '../context/AuthContext'
import { Navigate } from 'react-router';
import { RotatingLines } from "react-loader-spinner";

const PrivateRoute = ({children}) => {

    const {currentUser,loading} = useContext(AuthContext)

    if(loading){
         return (
      <div className="flex justify-center items-center h-screen">
        <RotatingLines
          visible={true}
          height="80"
          width="80"
          color="#4f46e5"
          strokeWidth="5"
          animationDuration="0.75"
          ariaLabel="rotating-lines-loading"
        />
      </div>
    );
    }
     if (!currentUser) {
    return <Navigate state={location?.pathname} to="/login"></Navigate>;
  }

  return children;
    
};

export default PrivateRoute;