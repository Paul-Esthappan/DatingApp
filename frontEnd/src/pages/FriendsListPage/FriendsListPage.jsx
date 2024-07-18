import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { userRequest, backendUrl } from "../../utils/axios/axios";
import { useNavigate } from "react-router-dom";
import { Button } from "@material-tailwind/react";


const FriendsListPage = () => {
  const currentUser = useSelector((state) => state.auth.user);
  const [friends, setFriends] = useState([]);
  const [sentRequests, setSentRequests] = useState({
    pending: [],
    accepted: [],
    rejected: [],
  });
  const [receivedRequests, setReceivedRequests] = useState({
    pending: [],
    accepted: [],
    rejected: [],
  });
  const [activeTab, setActiveTab] = useState("friends");
  const [activeSentTab, setActiveSentTab] = useState("pending");
  const [activeReceivedTab, setActiveReceivedTab] = useState("pending");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await userRequest.get("/api/interactions/friends");
        setFriends(response.data.friends || []); 
      } catch (error) {
        setError("Error fetching friends");
      }
    };

    const fetchSentRequests = async (status) => {
      try {
        const response = await userRequest.get(
          `/api/interactions/sent-friend-requests?status=${status}`
        );
        setSentRequests((prev) => ({ ...prev, [status]: response.data || [] })); // Handle null or undefined response.data
      } catch (error) {
        setError("Error fetching sent friend requests");
      }
    };

    const fetchReceivedRequests = async (status) => {
      try {
        const response = await userRequest.get(
          `/api/interactions/received-friend-requests?status=${status}`
        );
        setReceivedRequests((prev) => ({
          ...prev,
          [status]: response.data || [],
        })); // Handle null or undefined response.data
      } catch (error) {
        setError("Error fetching received friend requests");
      }
    };

    Promise.all([
      fetchFriends(),
      fetchSentRequests("pending"),
      fetchSentRequests("accepted"),
      fetchSentRequests("rejected"),
      fetchReceivedRequests("pending"),
      fetchReceivedRequests("accepted"),
      fetchReceivedRequests("rejected"),
    ])
      .then(() => setLoading(false))
      .catch(() => {
        setLoading(false);
        setError("Failed to fetch data");
      });
  }, [currentUser._id]);

  if (loading) {
    return <div>Loading...</div>; // Loading indicator while fetching data
  }

  if (error) {
    return <div>Error: {error}</div>; // Display error message if fetching fails
  }

  const renderRequests = (requests) => {
    if (requests.length === 0) {
      return <div>No results found.</div>; // Render message for no results
    }
    console.log("requests are",requests);

    return requests.map((request) => (
      <div className="flex p-1 justify-between" key={request.userId}>
        <img
          src={`${backendUrl}${request.image}`}
          alt="Profile"
          className="w-8 h-8 rounded-full object-cover"
        />
        <li
          className="cursor-pointer text-blue-600 hover:underline"
          onClick={() => navigate(`/dating/profile/${request.userId}`)}
        >
          {request.displayName}
        </li>
        <Button>Accept</Button>
      </div>
    ));
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-semibold mb-4">Friend Requests</h1>
      <div className="flex mb-4">
        <button
          onClick={() => setActiveTab("friends")}
          className={`px-4 py-2 rounded-t-lg ${
            activeTab === "friends"
              ? "bg-blue-500 text-white"
              : "bg-gray-300 text-black"
          }`}
        >
          Friends
        </button>
        <button
          onClick={() => setActiveTab("received")}
          className={`px-4 py-2 rounded-t-lg ${
            activeTab === "received"
              ? "bg-blue-500 text-white"
              : "bg-gray-300 text-black"
          }`}
        >
          Received Requests
        </button>
        <button
          onClick={() => setActiveTab("sent")}
          className={`px-4 py-2 rounded-t-lg ${
            activeTab === "sent"
              ? "bg-blue-500 text-white"
              : "bg-gray-300 text-black"
          }`}
        >
          Sent Requests
        </button>
      </div>
      <div className="bg-gray-100 p-4 rounded-b-lg">
        {activeTab === "friends" && <ul>{renderRequests(friends)}</ul>}
        {activeTab === "received" && (
          <>
            <div className="flex mb-4">
              <button
                onClick={() => setActiveReceivedTab("pending")}
                className={`px-4 py-2 rounded-t-lg ${
                  activeReceivedTab === "pending"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300 text-black"
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setActiveReceivedTab("accepted")}
                className={`px-4 py-2 rounded-t-lg ${
                  activeReceivedTab === "accepted"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300 text-black"
                }`}
              >
                Accepted
              </button>
              <button
                onClick={() => setActiveReceivedTab("rejected")}
                className={`px-4 py-2 rounded-t-lg ${
                  activeReceivedTab === "rejected"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300 text-black"
                }`}
              >
                Rejected
              </button>
            </div>
            <ul>{renderRequests(receivedRequests[activeReceivedTab])}</ul>
          </>
        )}
        {activeTab === "sent" && (
          <>
            <div className="flex mb-4">
              <button
                onClick={() => setActiveSentTab("pending")}
                className={`px-4 py-2 rounded-t-lg ${
                  activeSentTab === "pending"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300 text-black"
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setActiveSentTab("accepted")}
                className={`px-4 py-2 rounded-t-lg ${
                  activeSentTab === "accepted"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300 text-black"
                }`}
              >
                Accepted
              </button>
              <button
                onClick={() => setActiveSentTab("rejected")}
                className={`px-4 py-2 rounded-t-lg ${
                  activeSentTab === "rejected"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300 text-black"
                }`}
              >
                Rejected
              </button>
            </div>
            <ul>{renderRequests(sentRequests[activeSentTab])}</ul>
          </>
        )}
      </div>
    </div>
  );
};

export default FriendsListPage;
