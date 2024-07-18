import React, { useEffect, useState } from "react";
import { FaHeart, FaHeartBroken, FaInfoCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { userRequest } from "../../utils/axios/axios";

const ProfileCard = ({ title, url }) => {
  const [users, setUsers] = useState([]);
  const [userInteraction, setuserInteraction] = useState([])
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.auth.user);
  const backendUrl = "http://localhost:3000/";

  const fetchData = async () => {
    try {
      const response = await userRequest.get(`${url}`);
      setUsers(response.data);
      const res = await userRequest.get("/api/interactions/userInteraction");
      console.log("res",res);
      setuserInteraction(res.data)
      console.log("user intractionres",userInteraction);
      console.log("responce loaction",response);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [url]);

  const calculateAge = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const handleProfile = (selectedUser) => {
    navigate(`/dating/profile/${selectedUser._id}`);
  };

  const sendFriendRequest = async (userId) => {
    try {
      await userRequest.post(`/api/interactions/send-request`, { userId });
      alert("Friend request sent!");
    } catch (error) {
      console.error("Error sending friend request:", error);
    }
  };

  const blockUser = async (userId) => {
    try {
      await userRequest.post(`/api/interactions/block`, { userId });
      alert("User blocked!");
    } catch (error) {
      console.error("Error blocking user:", error);
    }
  };

  return (
    <div className="bg-gray-200 rounded-lg h-auto my-4 overflow-x-scroll p-4">
      <h5 className="text-xl font-semibold mb-4">{title}</h5>
      <div className="flex space-x-4">
        {users.map((user, index) => (
          <div
            key={index}
            className="w-[25%] flex-shrink-0 flex relative shadow-lg mx-2 cursor-pointer"
            onClick={() => handleProfile(user)}
          >
            <img
              className="w-full h-64 object-cover rounded-lg"
              src={`${backendUrl}${user.images[1]}`}
              alt="profile-picture"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 rounded-b-lg">
              <p className="text-white text-lg font-medium">
                {user.displayName} - {calculateAge(user.dob)}
              </p>
              <p className="text-white text-sm">{user.qualification}</p>
              <div className="flex justify-around mt-2">
                <FaHeart
                  className="text-2xl text-red-700 cursor-pointer hover:text-red-500"
                  onClick={() => sendFriendRequest(user._id)}
                />
                <FaHeartBroken
                  className="text-2xl text-white cursor-pointer hover:text-red-500 mx-2"
                  onClick={() => blockUser(user._id)}
                />
                <FaInfoCircle className="text-2xl cursor-pointer text-white hover:text-blue-500" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileCard;
