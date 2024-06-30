import React from "react";
import { FaHeart, FaHeartBroken, FaInfoCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ProfileCard = (props) => {
  const navigate = useNavigate();
  const handleProfile = () => {
    navigate('/dating/profile')
  }
  return (
    <div className="bg-gray-200 rounded-lg h-[32%] my-1 w-full">
      <h5>{props.title}</h5>
      <div className="flex absolute overflow-scroll">
        {props.array.map((e) => {
          return (
            <div className="relative flex flex-col w-[195px] shadow-lg mx-1 " onClick={handleProfile}>
              <img
                className="w-full h-full object-cover rounded-lg"
                src="https://docs.material-tailwind.com/img/team-3.jpg"
                alt="profile-picture"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                <p className="text-white text-sm font-medium">
                  Natalie Paisley
                </p>
                <p className="text-white text-xs">CEO / Co-Founder -{e}</p>
                <div className="flex justify-around">
                  <FaHeart className="text-xl text-red-700 cursor-pointer hover:text-red-500" />
                  <FaHeartBroken className="text-xl text-white cursor-pointer hover:text-red-500 mx-2" />
                  <FaInfoCircle className="text-xl cursor-pointer text-white hover:text-blue-500" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProfileCard;
