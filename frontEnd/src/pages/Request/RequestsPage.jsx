import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { backendUrl, userRequest } from "../../utils/axios/axios";
import { Button } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";

const RequestsPage = () => {
  const currentUser = useSelector((state) => state.auth.user);
  const [receivedPendingStatus, setReceivedPendingStatus] = useState([]);
  const [receivedAcceptedStatus, setReceivedAcceptedStatus] = useState([]);
  const [receivedRejectedStatus, setReceivedRejectedStatus] = useState([]);

  const [sentPendingStatus, setSentPendingStatus] = useState([]);
  const [sentAcceptedStatus, setSentAcceptedStatus] = useState([]);
  const [sentRejectedStatus, setSentRejectedStatus] = useState([]);

  const [activeTab, setActiveTab] = useState("received");
  const [activeReceivedTab, setActiveReceivedTab] = useState("pending");
  const [activeSentTab, setActiveSentTab] = useState("pending");

  const [loading, setLoading] = useState(true); // State for loading indicator
  const [error, setError] = useState(null); // State for error handling

  const navigate = useNavigate();

  useEffect(() => {
    const fetchReceivedPendingRequests = async () => {
      try {
        const response = await userRequest.get(
          `/api/interactions/receivedRequests`,
          {
            params: { status: "pending" },
          }
        );
        setReceivedPendingStatus(response.data);
      } catch (error) {
        setError("Error fetching received requests");
      }
    };
    const fetchReceivedAcceptedRequests = async () => {
      try {
        const response = await userRequest.get(
          `/api/interactions/receivedRequests`,
          {
            params: { status: "accepted" },
          }
        );
        setReceivedAcceptedStatus(response.data);
      } catch (error) {
        setError("Error fetching received requests");
      }
    };
    const fetchReceivedRejectedRequests = async () => {
      try {
        const response = await userRequest.get(
          `/api/interactions/receivedRequests`,
          {
            params: { status: "rejected" },
          }
        );
        setReceivedRejectedStatus(response.data);
      } catch (error) {
        setError("Error fetching received requests");
      }
    };

    const fetchSentPendingStatus = async () => {
      try {
        const response = await userRequest.get(
          `/api/interactions/sentRequest`,
          {
            params: { status: "pending" },
          }
        );
        setSentPendingStatus(response.data);
      } catch (error) {
        setError("Error fetching sent requests");
      }
    };

    const fetchSentAcceptedStatus = async () => {
      try {
        const response = await userRequest.get(
          `/api/interactions/sentRequest`,
          {
            params: { status: "accepted" },
          }
        );
        setSentAcceptedStatus(response.data);
      } catch (error) {
        setError("Error fetching sent requests");
      }
    };

    const fetchSentRejectedStatus = async () => {
      try {
        const response = await userRequest.get(
          `/api/interactions/sentRequest`,
          {
            params: { status: "rejected" },
          }
        );
        setSentRejectedStatus(response.data);
      } catch (error) {
        setError("Error fetching sent requests");
      }
    };

    Promise.all([
      fetchReceivedPendingRequests(),
      fetchReceivedAcceptedRequests(),
      fetchReceivedRejectedRequests(),
      fetchSentPendingStatus(),
      fetchSentAcceptedStatus(),
      fetchSentRejectedStatus(),
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
    return requests.map((request) => (
      <div className="flex justify-between p-1" key={request._id}>
        <img
          src={`${backendUrl}${request.image}`}
          alt="image not found"
          className="w-5 h-5"
        />
        <li
          onClick={() => {
            navigate(`/dating/profile/${request.userId}`);
          }}
        >
          {request.displayName}
        </li>
      </div>
    ));
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-semibold mb-4">User Requests</h1>
      <div className="flex mb-4">
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
            {activeReceivedTab === "pending" && (
              <ul>{renderRequests(receivedPendingStatus)}</ul>
            )}
            {activeReceivedTab === "accepted" && (
              <ul>{renderRequests(receivedAcceptedStatus)}</ul>
            )}
            {activeReceivedTab === "rejected" && (
              <ul>{renderRequests(receivedRejectedStatus)}</ul>
            )}
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
            {activeSentTab === "pending" && (
              <ul>{renderRequests(sentPendingStatus)}</ul>
            )}
            {activeSentTab === "accepted" && (
              <ul>{renderRequests(sentAcceptedStatus)}</ul>
            )}
            {activeSentTab === "rejected" && (
              <ul>{renderRequests(sentRejectedStatus)}</ul>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default RequestsPage;
