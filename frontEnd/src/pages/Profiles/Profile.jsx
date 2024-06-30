import React from "react";
import SampleDp from "../../assets/SampleDp.jpeg";
import { FaHeart, FaHeartBroken } from "react-icons/fa";

const profileData = {
  name: "Soman",
  age: 12,
    designation: "Manager",
  
};


const Profile = () => {
  return (
    <div className="relative w-screen h-full flex flex-row items-center overflow-auto">
      <div className="relative h-screen flex flex-col">
        <img
          className="w-full h-full object-contain"
          src={SampleDp}
          alt="Profile"
        />
        <div className="absolute bottom-0 w-full p-4 bg-gradient-to-t from-black via-transparent to-transparent text-white flex flex-row justify-between items-center items-center">
          <div className="flex flex-col items-center mb-4">
            <div className="flex justify-center items-center">
              <h1 className="text-2xl font-bold">{profileData.name}</h1>
              <h1 className="text-2xl px-2">{profileData.age}</h1>
            </div>
            <h5 className="text-lg">{profileData.designation}</h5>
          </div>
          <div className="flex space-x-6">
            <div className="flex flex-col items-center">
              <FaHeartBroken className="text-red-900 text-4xl bg-white rounded-full p-2" />
              <p>Dislike</p>
            </div>
            <div className="flex flex-col items-center">
              <FaHeart className="text-red-900 text-4xl bg-white rounded-full p-2" />
              <p>Like</p>
            </div>
          </div>
        </div>
      </div>
      {/* Bio Section */}
      <div className="w-full lg:w-[48%] p-4 bg-white text-black shadow-lg flex flex-col">
        <h1 className="mb-4">Bio</h1>
        <p className="mb-4">Additional info about the user goes here.</p>
        <p className="mb-4">More details about interests, background, etc.</p>
      </div>
    </div>
  );
};

export default Profile;
