import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { userRequest } from "../../utils/axios/axios"; // Adjust your axios request setup as per your project

const Blocked = () => {
  const currentUser = useSelector((state) => state.auth.user);
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlockedUsers = async () => {
      try {
        const response = await userRequest.get(
          `/api/interactions/blockedUsers`
        );
        console.log("block", response);
        setBlockedUsers(response.data.blockedUsers || []);
        setLoading(false);
      } catch (error) {
        setError("Error fetching blocked users");
        setLoading(false);
      }
    };

    fetchBlockedUsers();
  }, [blockedUsers]);

    const handleUnblockUser = async (userIdToUnblock) => {
    try {
      const response = await userRequest.put(`/api/interactions/unblockUser`,{
          userIdToUnblock
      });
        console.log("respoas",response);
      if (response.status==200) {
        alert("user unblocked");
        setBlockedUsers(
          blockedUsers.filter((user) => user.userId !== userIdToUnblock)
        );
      } else {
        setError("Failed to unblock user");
      }
    } catch (error) {
      setError("Failed to unblock user");
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Loading indicator while fetching data
  }

  if (error) {
    return <div>Error: {error}</div>; // Display error message if fetching fails
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-semibold mb-4">Blocked Users</h1>
      <div className="bg-gray-100 p-4 rounded-b-lg">
        {blockedUsers.length === 0 && <div>No blocked users found.</div>}
        {blockedUsers.map((user) => (
          <div
            key={user.userId}
            className="flex justify-between p-2 items-center border-b border-gray-300"
          >
            <div className="flex items-center">
              <img
                src={`${user.image}`}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover mr-2"
              />
              <span className="text-blue-600 cursor-pointer hover:underline">
                {user.displayName}
              </span>
            </div>
            <button
              onClick={() => handleUnblockUser(user._id)}
              className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
            >
              Unblock
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blocked;
