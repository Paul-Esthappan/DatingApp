import React, { useEffect } from "react";
import ProfileCard from "../../components/cards/ProfileCard";
import { useNavigate } from "react-router-dom";
import { userRequest } from "../../utils/axios/axios";
import { useSelector } from "react-redux";

const Home = () => {
  const navigate = useNavigate();
  const userId = useSelector((state) => state.auth.user?._id);
  console.log("useroin",userId);

  useEffect(() => {
    if (!userId) {
      navigate("/account/login");
    } else {
      const fetchUser = async () => {
        try {
          const { data: user } = await userRequest.get(
            `/api/auth/fetchuser/${userId}`
          );
          console.log("user", user);
        } catch (error) {
          console.error(error);
        }
      };
      fetchUser();
    }
  }, [userId, navigate]);

  return (
    <div className="mt-10">
      <ProfileCard title="Near you" url="/api/users/location" />
      <ProfileCard title="Designation" url="/api/users/designation" />
      <ProfileCard title="Education" url="/api/users/qualification" />
    </div>
  );
};

export default Home;
