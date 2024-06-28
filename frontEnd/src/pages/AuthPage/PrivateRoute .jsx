import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const token = useSelector((state) => state.auth.token);
  const isLoggedIn = !!token;

  return isLoggedIn ? children : <Navigate to="/account/login" replace />;
};

export default PrivateRoute;
