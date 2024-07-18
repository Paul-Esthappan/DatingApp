import React, { useEffect, useState } from "react";
import { Button } from "@material-tailwind/react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import { userRequest } from "../../utils/axios/axios";
import { useSelector } from "react-redux"; // Import useSelector from Redux

const Profile = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [shortlisted, setShortlisted] = useState(false);
  const [friend, setFriend] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sentRequestStatus, setSentRequestStatus] = useState(null);
  const [receivedRequestStatus, setReceivedRequestStatus] = useState(null);
  const [reels, setReels] = useState([]); // State to store reels
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const currentUser = useSelector((state) => state.auth.user); // Redux selector for logged-in user

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await userRequest.get(`/api/auth/fetchuser/${id}`);
        console.log("Profile response fetch", response.data);
        setUser(response.data);

        // Handle interaction data
        const interaction = response.data.interaction || {};
        setShortlisted(interaction.shortlisted?.length > 0 || false);
        setFriend(interaction.friends?.length > 0 || false);
        setHidden(interaction.hiddenFeeds?.length > 0 || false);
        setSentRequestStatus(interaction.sentRequests?.[0]?.status || null);
        setReceivedRequestStatus(
          interaction.receivedRequests?.[0]?.status || null
        );
        setReels(response.data.reels || []); // Set reels from response data
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUserData();
  }, [id]);


  const backendUrl = "http://localhost:3000/";
  const allImages = user ? [user.image, ...(user.images || [])] : [];

  const handleRequest = async () => {
    setIsLoading(true);
    try {
      await userRequest.post(`/api/interactions/sendRequest`, {
        toUserId: id,
      });
      alert("Request sent!");
      setSentRequestStatus("pending");
      setIsLoading(false);
    } catch (error) {
      console.error("Error sending request:", error);
      setIsLoading(false);
    }
  };

  const acceptRequest = async () => {
    setIsLoading(true);
    try {
      await userRequest.post(`/api/interactions/acceptRequest`, {
        fromUserId: id,
      });
      alert("Accepted request!");
      setReceivedRequestStatus("pending");
      setIsLoading(false);
    } catch (error) {
      console.error("Error accepting request:", error);
      setIsLoading(false);
    }
  };

  const handleCancelRequest = async () => {
    try {
      await userRequest.post(`/api/interactions/cancelRequest`, {
        toUserId: id,
      });
      alert("Request canceled!");
      setSentRequestStatus("canceled");
    } catch (error) {
      console.error("Error canceling request:", error);
    }
  };

  const handleCancelAccept = async () => {
    try {
      await userRequest.post(`/api/interactions/cancelAcceptedRequest`, {
        toUserId: id,
      });
      alert("Canceled accept!");
      setSentRequestStatus("canceled");
    } catch (error) {
      console.error("Error canceling accept:", error);
    }
  };

  const handleReject = async () => {
    try {
      await userRequest.post(`/api/interactions/rejectReceivedRequest`, {
        fromUserId: id,
      });
      alert("Request rejected!");
      setReceivedRequestStatus("rejected");
    } catch (error) {
      console.error("Error rejecting request:", error);
    }
  };

  const handleShortlist = async () => {
    try {
      await userRequest.post(`/api/interactions/shortlistUser`, {
        userIdToShortlist: id,
      });
      setShortlisted(true);
      alert("User shortlisted!");
    } catch (error) {
      console.error("Error shortlisting user:", error);
    }
  };

  const handleRemoveShortlist = async () => {
    try {
      await userRequest.post(`/api/interactions/removeShortList`, {
        userIdToRemove: id,
      });
      setShortlisted(false);
      alert("User removed from shortlist!");
    } catch (error) {
      console.error("Error removing shortlist user:", error);
    }
  };

  const handleMessage = () => {
    console.log("user isss",user._id);
    if (user && user._id) {
      navigate(`/dating/message/${user._id}`); // Navigate to messaging page with user ID
    }
  };

  const handleAddFriend = async () => {
    try {
      await userRequest.post(`/api/interactions/addFriend`, {
        userIdToAdd: id,
      });
      setFriend(true);
      alert("Friend added!");
    } catch (error) {
      console.error("Error adding friend:", error);
    }
  };

  const handleUnfriend = async () => {
    try {
      await userRequest.post(`/api/interactions/removeFriend`, { userId: id });
      setFriend(false);
      alert("Friend removed!");
    } catch (error) {
      console.error("Error removing friend:", error);
    }
  };

  const handleBlock = async () => {
    try {
      await userRequest.post(`/api/interactions/blockUser`, {
        userIdToBlock: id,
      });
      setHidden(true);
      alert("User blocked!");
    } catch (error) {
      console.error("Error blocking user:", error);
    }
  };

  const handleUnblock = async () => {
    try {
      await userRequest.post(`/api/interactions/unblockUser`, {
        userIdToUnblock: id,
      });
      setHidden(false);
      alert("User unblocked!");
    } catch (error) {
      console.error("Error unblocking user:", error);
    }
  };

  const showNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === allImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const showPreviousImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? allImages.length - 1 : prevIndex - 1
    );
  };

  if (!user || !currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-5 relative w-screen h-full flex flex-col lg:flex-row items-center justify-center bg-gray-50">
      {/* Left Section - Profile Picture and Details */}
      <div className="relative h-[400px] sm:h-[500px] lg:h-[800px] w-full lg:w-[400px] flex flex-col items-center p-4 bg-white shadow-md rounded-md">
        <div className="relative w-full h-full flex items-center justify-center">
          <img
            className="w-full h-full object-cover rounded-md"
            src={`${backendUrl}${allImages[currentImageIndex]}`}
            alt="Profile"
          />
          {allImages.length > 1 && (
            <>
              <FaArrowLeft
                onClick={showPreviousImage}
                className="absolute left-4 text-3xl bg-white p-2 rounded-full cursor-pointer shadow-md"
              />
              <FaArrowRight
                onClick={showNextImage}
                className="absolute right-4 text-3xl bg-white p-2 rounded-full cursor-pointer shadow-md"
              />
            </>
          )}
        </div>

        <div className="absolute bottom-0 w-full p-4 bg-gradient-to-t from-black via-transparent to-transparent text-white flex flex-col items-center">
          <div className="text-center mb-4">
            <div className="flex justify-center items-center">
              <h1 className="text-2xl font-bold">
                {user.displayName || "Anonymous"}
              </h1>
              <h1 className="text-2xl px-2">
                {new Date().getFullYear() - new Date(user.dob).getFullYear()}{" "}
                years
              </h1>
            </div>
            <h5 className="text-lg">{user.designation || "Unknown"}</h5>
            <h1 className="text-2xl font-bold">
              {user.location || "Location not specified"}
            </h1>
          </div>
        </div>
      </div>

      {/* Right Section - Details, Images, Reels, and Actions */}
      <div className="w-full lg:w-[48%] p-4 bg-white text-gray-700 shadow-lg rounded-md mt-10 lg:mt-0 lg:ml-10 flex flex-col items-center">
        <h1 className="text-2xl font-semibold mb-4">Details</h1>
        <div className="mb-4">
          <p>
            <span className="font-semibold">Bio:</span>{" "}
            {user.shortBio || "Not specified"}
          </p>
          <p>
            <span className="font-semibold">Smoking Habits:</span>{" "}
            {user.smokingHabits || "Not specified"}
          </p>
          <p>
            <span className="font-semibold">Drinking Habits:</span>{" "}
            {user.drinkingHabits || "Not specified"}
          </p>
          <p>
            <span className="font-semibold">Qualification:</span>{" "}
            {user.qualification || "Not specified"}
          </p>
          <p>
            <span className="font-semibold">Interests:</span>{" "}
            {user.interests || "Not specified"}
          </p>
        </div>

        {/* Display Images */}
        <h1 className="text-2xl font-semibold mb-4">Images</h1>
        <div className="flex items-center justify-center space-x-4 mb-6">
          {allImages.map((image, index) => (
            <img
              key={index}
              className={`h-24 w-24 object-cover rounded-full ${
                index === currentImageIndex ? "border-2 border-blue-500" : ""
              }`}
              src={`${backendUrl}${image}`}
              alt={`Image ${index}`}
              onClick={() => setCurrentImageIndex(index)}
            />
          ))}
        </div>

        {/* Display Reels */}
        {reels.length > 0 && (
          <>
            <h1 className="text-2xl font-semibold mb-4">Reels</h1>
            <div className="flex items-center justify-center space-x-4 mb-6">
              {reels.map((reel, index) => (
                <video
                  key={index}
                  controls
                  className="h-24 w-24 object-cover rounded-full"
                >
                  <source src={`${backendUrl}${reel}`} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ))}
            </div>
          </>
        )}

        {/* Actions */}
        <div className="flex  items-center lg:items-start">
          <Button
            className="mb-2 mx-2"
            onClick={
              sentRequestStatus === "pending"
                ? handleCancelRequest
                : handleRequest
            }
          >
            {sentRequestStatus === "pending" ? "Cancel Sent" : "Send Request"}
          </Button>
          <Button
            disabled={isLoading}
            className="mb-2 mx-2"
            onClick={
              receivedRequestStatus === "pending" ? acceptRequest : handleReject
            }
          >
            {receivedRequestStatus === "pending" ? "Accept" : "Reject"}
          </Button>
          <Button
            className="mb-2 mx-2"
            onClick={shortlisted ? handleRemoveShortlist : handleShortlist}
          >
            {shortlisted ? "Remove Shortlist" : "Shortlist"}
          </Button>
          <Button
            className="mb-2 mx-2"
            onClick={friend ? handleUnfriend : handleAddFriend}
          >
            {friend ? "Unfriend" : "Add Friend"}
          </Button>
          <Button
            className="mb-2 mx-2"
            onClick={hidden ? handleUnblock : handleBlock}
          >
            {hidden ? "Unblock" : "Block"}
          </Button>
          <Button onClick={handleMessage}>Message</Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
