import * as React from "react";
import "./index.css";

import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";

import { persistor, store } from "./redux/store";
import {  Provider, useSelector } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import ErrorPage from "./Errorpage";
import Auth from "./features/Authorizarion/Auth";
import Layout from "./styles/Layout/Layout";
import Home from "./pages/Home/Home";
import { ThemeProvider } from "@material-tailwind/react";
import Login from "./pages/LoginPage/Login";
import DatingRegisterPage from "./pages/LoginPage/DatingRegisterPage";
import Relationship from "./pages/LoginPage/Relationship";

const PriviteRoute = ({ children }) => {
  const isFormPage = window.location.pathname.includes("account");
  const token = useSelector((state) => state.auth.token);
  const isLoggedIn = !!token;
  console.log("access TOKEN", token, "ISLOGGEDiN vALUE", isLoggedIn);

  if (isLoggedIn && !isFormPage) {
    return children;
  } else if (!isLoggedIn && isFormPage) {
    return children;
  } else {
    const redirectURL = isLoggedIn ? "/" : "/account/signin";
    return <Navigate to={redirectURL} replace />;
  }
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/home",
        element: (
          <PriviteRoute>
            <Home />
          </PriviteRoute>
        ),
      },
      {
        path: "/account/signin",
        element: (
          <PriviteRoute>
            <Home />
          </PriviteRoute>
        ),
      },
      {
        path: "/login/LOG",
        element: (
          <PriviteRoute>
            <Login />
          </PriviteRoute>
        ),
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <DatingRegisterPage />,
      },
      {
        path: "/relationship",
        element: <Relationship />,
      },
    ],
  },
]);

const container = document.getElementById("root");

const root = ReactDOM.createRoot(container);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RouterProvider router={router} />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);