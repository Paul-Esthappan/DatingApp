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
import Profile from "../pages/Profiles/Profile";
import SexualOrientation from "../pages/LoginPage/SexualOrientation";
import Employment from "../pages/LoginPage/Employment";
import BlockedUsersPage from "../pages/BlockedUsersPage/BlockedUsersPage";
import DonNotShowPage from "../pages/DonNotShowPage/DonNotShowPage";
import FriendsListPage from "../pages/FriendsListPage/FriendsListPage";
import UserProfile from "../pages/UserProfile/UserProfile";
import RequestsPage from "../pages/Request/RequestsPage";
import ShortListPage from "../pages/ShortList/ShortListPage";
import Blocked from "../pages/Blocked/Blocked";
import Message from "../pages/Message/Message";


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
        path: "/dating/home",
        element: (
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        ),
      },
      {
        path: "/dating/user_profile",
        element: (
          <PrivateRoute>
            <UserProfile />
          </PrivateRoute>
        ),
      },
      {
        path: "/dating/requests_page",
        element: (
          <PrivateRoute>
            <RequestsPage />
          </PrivateRoute>
        ),
      },
      {
        path: "/dating/shortListPage",
        element: (
          <PrivateRoute>
            <ShortListPage />
          </PrivateRoute>
        ),
      },
      {
        path: "/dating/blocked",
        element: (
          <PrivateRoute>
            <Blocked />
          </PrivateRoute>
        ),
      },

      {
        path: "/dating/dontShow",
        element: (
          <PrivateRoute>
            <DonNotShowPage />
          </PrivateRoute>
        ),
      },
      {
        path: "/dating/friends",
        element: (
          <PrivateRoute>
            <FriendsListPage />
          </PrivateRoute>
        ),
      },
      {
        path: "/dating/message/:id",
        element: (
          <PrivateRoute>
            <Message />
          </PrivateRoute>
        ),
      },

      {
        path: "/dating/profile/:id",
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
    element: <Login isSignInPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/account/signup",
    element: <Auth />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/account/login",
    element: <Login isSignInPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/account/employment",
    element: <Employment />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/account/relationship",
    element: <Relationship />,
    errorElement: <ErrorPage />,
  },

  // {
  //   path: "/account/register",
  //   element: <DatingRegisterPage />,
  //   errorElement: <ErrorPage />,
  // },


];

const router = createBrowserRouter([...mainRoutes, ...authRoutes]);

export default router;
