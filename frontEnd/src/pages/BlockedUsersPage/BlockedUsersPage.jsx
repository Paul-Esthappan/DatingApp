import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { userRequest } from "../../utils/axios/axios";

const BlockedUsersPage = () => {
  const currentUser = useSelector((state) => state.auth.user);
  const [blockedUsers, setBlockedUsers] = useState([]);

  useEffect(() => {
    const fetchBlockedUsers = async () => {
      try {
        const response = await userRequest.get(`/api/interactions/blocked-users/${currentUser._id}`);
        setBlockedUsers(response.data);
      } catch (error) {
        console.error("Error fetching blocked users:", error);
      }
    };
    fetchBlockedUsers();
  }, [currentUser._id]);

  return (
    <div>
      <h1>Blocked Users</h1>
      <ul>
        {blockedUsers.map((user) => (
          <li key={user._id}>{user.displayName}</li>
        ))}
      </ul>
    </div>
  );
};

export default BlockedUsersPage;
