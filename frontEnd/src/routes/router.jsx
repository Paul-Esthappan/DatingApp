import React from "react";
import { createBrowserRouter } from "react-router-dom";
import PrivateRoute from "../pages/AuthPage/PrivateRoute ";
import ErrorPage from "./ErrorPage";
import Home from "./pages/Home/Home";
import Login from "./pages/LoginPage/Login";
import DatingRegisterPage from "./pages/LoginPage/DatingRegisterPage";
import Relationship from "./pages/LoginPage/Relationship";
import Layout from "./styles/Layout/Layout";
import Auth from "./pages/AuthPage/Auth";

const mainRoutes = [
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: (
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        ),
      },
      {
        path: "/home",
        element: (
          <PrivateRoute>
            <Home />
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
    path: "/account/relationship",
    element: <Relationship />,
    errorElement: <ErrorPage />,
  },
];

const router = createBrowserRouter([...mainRoutes, ...authRoutes]);

export default router;
