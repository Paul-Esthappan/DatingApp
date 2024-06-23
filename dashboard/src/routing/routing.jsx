import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Home from '../pages/homescreen/homescreen';
import LoginScreen from '../pages/login_screen/login_screen';
import Navbar from '../pages/header/navbar';
import SwipeGallery from '../pages/swip/swip';
import Profile from '../pages/profile/Profile';
const Routing = () => {
    return (
      <>
        <Router>
          <Routes>
            <Route path="/" element={<LoginScreen />}></Route>
            <Route path="/dashboard" element={<Home />}></Route>
            <Route path="/swip" element={<SwipeGallery />}></Route>
            <Route path="/profile" element={<Profile />}></Route>
          </Routes>
        </Router>
      </>
    );
  };
  
  export default Routing;