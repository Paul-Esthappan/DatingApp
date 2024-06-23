import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";


const Layout = () => {
  return (
    <div className="w-screen h-full overflow-scroll scrollbar-hide">
      <Header />
      <main>
        <Outlet /> {/* This will render the matched child route */}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
