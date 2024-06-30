import React from "react";
import { createBrowserRouter } from "react-router-dom";
import PrivateRoute from "../routes/PrivateRoute ";
import ErrorPage from "../Errorpage";
import Home from "../pages/Home/Home";
import Login from "../pages/LoginPage/Login";
import DatingRegisterPage from "../pages/LoginPage/DatingRegisterPage";
import Relationship from "../pages/LoginPage/Relationship";
import Layout from "../styles/Layout/Layout";
import Auth from "../pages/AuthPage/Auth";
import Services from "../pages/LoginPage/Services";
import Profile from "../pages/Profiles/Profile";
import SexualOrientation from "../pages/LoginPage/SexualOrientation";

const mainRoutes = [
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: (
          <PrivateRoute>
            <Services />
          </PrivateRoute>
        ),
      },
      {
        path: "/dating/home",
        element: (
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        ),
      },
      {
        path: "/dating/profile",
        element: (
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        ),
      },
    ],
    errorElement: <ErrorPage />,
  },
];

const authRoutes = [
  {
    path: "/account/login",
    element: <Login />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/account/signup",
    element: <Auth />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/account/register",
    element: <DatingRegisterPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/account/service",
    element: <Services />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/dating/relationship",
    element: <Relationship />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/dating/sexualOrientation",
    element: <SexualOrientation />,
    errorElement: <ErrorPage />,
  },
];

const router = createBrowserRouter([...mainRoutes, ...authRoutes]);

export default router;
