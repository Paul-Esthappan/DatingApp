import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { userRequest } from "../../utils/axios/axios";

const DonNotShowPage = () => {
  const currentUser = useSelector((state) => state.auth.user);
  const [donNotShow, setDonNotShow] = useState([]);

  useEffect(() => {
    const fetchDonNotShow = async () => {
      try {
        const response = await userRequest.get(
          `/api/interactions/don-not-show/${currentUser._id}`
        );
        setDonNotShow(response.data);
      } catch (error) {
        console.error("Error fetching don't show users:", error);
      }
    };
    fetchDonNotShow();
  }, [currentUser._id]);

  return (
    <div>
      <h1>Don't Show Users</h1>
      <ul>
        {donNotShow.map((user) => (
          <li key={user._id}>{user.displayName}</li>
        ))}
      </ul>
    </div>
  );
};

export default DonNotShowPage;
