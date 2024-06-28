// src/components/SplashScreen.jsx
import React, { useEffect, useState } from "react";
import AppLogo from '../../assets/AppLogo.jpeg'

const SplashScreen = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 2000); // Minimum 2 seconds

    return () => clearTimeout(timer); // Cleanup timer
  }, [onFinish]);

  return (
    <div className="flex justify-center items-center h-screen bg-red-900">
      <div className="text-center">
              <img src={AppLogo} alt="Logo" className="w-80 h-80 rounded-2xl" />
        <div className="mt-4 flex justify-center items-center">
          <svg
            className="animate-spin h-5 w-5 text-blue-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.964 7.964 0 014 12H0c0 2.623 1.008 5 2.667 6.667l1.333-1.376z"
            ></path>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
