import React, { useEffect, useState } from "react";
import axios from "axios";
import { userRequest } from "../../utils/axios/axios";
import { useDispatch, useSelector } from "react-redux";
import {
  FaArrowLeft,
  FaArrowRight,
  FaEdit,
  FaTrash,
  FaSave,
  FaPlus,
  FaUpload,
} from "react-icons/fa";
import { setUserAndToken } from "../../redux/slice/authSlice";

const UserProfile = () => {
  const [userDetails, setUserDetails] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [newImages, setNewImages] = useState([]);
  const [newProfilePic, setNewProfilePic] = useState(null);
  const userId = useSelector((state) => state.auth.user._id);
  const backendUrl = "http://localhost:3000/";
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await userRequest.get(`/api/auth/fetchuser/${userId}`);
        setUserDetails(response.data);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, [userId]);

  const allImages = userDetails
    ? [userDetails.image, ...(userDetails.images || [])]
    : [];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails({ ...userDetails, [name]: value });
  };

  const handleImageChange = (e) => {
    setNewImages([...newImages, ...Array.from(e.target.files)]);
  };

  const handleProfilePicChange = (e) => {
    setNewProfilePic(e.target.files[0]);
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      for (const key in userDetails) {
        formData.append(key, userDetails[key]);
      }
      newImages.forEach((image, index) => {
        formData.append(`images[${index}]`, image);
      });
      if (newProfilePic) {
        formData.append("image", newProfilePic);
      }

      const response = await userRequest.put(`/api/update/${userId}`, formData);
      setUserDetails(response.data);
      setEditMode(false);
      dispatch(setUserAndToken({ user: response.data }));
    } catch (error) {
      console.error("Error updating user details:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await userRequest.delete(`/api/auth/delete/${userId}`);
      // Redirect or update UI after successful deletion
    } catch (error) {
      console.error("Error deleting user account:", error);
    }
  };

  const showPreviousImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? allImages.length - 1 : prevIndex - 1
    );
  };

  const showNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === allImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-semibold mb-4">User Profile</h1>
      {editMode ? (
        <div>
          <label className="block mb-2">
            Display Name:
            <input
              type="text"
              name="displayName"
              value={userDetails.displayName || ""}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded"
            />
          </label>
          <label className="block mb-2">
            Country:
            <input
              type="text"
              name="country"
              value={userDetails.country || ""}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded"
            />
          </label>
          <label className="block mb-2">
            Phone Number:
            <input
              type="text"
              name="phoneNumber"
              value={userDetails.phoneNumber || ""}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded"
            />
          </label>
          <label className="block mb-2">
            Date of Birth:
            <input
              type="date"
              name="dob"
              value={userDetails.dob || ""}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded"
            />
          </label>
          <label className="block mb-2">
            Bio:
            <input
              type="text"
              name="gender"
              value={userDetails.shortBio || ""}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded"
            />
          </label>
          <label className="block mb-2">
            Gender:
            <input
              type="text"
              name="gender"
              value={userDetails.gender || ""}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded"
            />
          </label>
          <label className="block mb-2">
            Designation:
            <input
              type="text"
              name="designation"
              value={userDetails.designation || ""}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded"
            />
          </label>
          <label className="block mb-2">
            Qualification:
            <input
              type="text"
              name="qualification"
              value={userDetails.qualification || ""}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded"
            />
          </label>
          <label className="block mb-2">
            Interests:
            <input
              type="text"
              name="interests"
              value={userDetails.interests || ""}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded"
            />
          </label>
          <label className="block mb-2">
            Profile Picture:
            <input type="file" onChange={handleProfilePicChange} />
          </label>
          <label className="block mb-2">
            Additional Images:
            <input type="file" multiple onChange={handleImageChange} />
          </label>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            <FaSave className="inline mr-2" />
            Save
          </button>
        </div>
      ) : (
        <div>
          <div className="relative mb-4">
            {allImages.length > 0 && (
              <img
                className="w-full h-64 object-cover rounded-md"
                src={`${backendUrl}${allImages[currentImageIndex]}`}
                alt="Profile"
              />
            )}
            {allImages.length > 1 && (
              <>
                <FaArrowLeft
                  onClick={showPreviousImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-3xl bg-white p-2 rounded-full cursor-pointer shadow-md"
                />
                <FaArrowRight
                  onClick={showNextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-3xl bg-white p-2 rounded-full cursor-pointer shadow-md"
                />
              </>
            )}
          </div>
          <p className="mb-2">
            <strong>Display Name:</strong> {userDetails.displayName}
          </p>
          <p className="mb-2">
            <strong>Bio:</strong> {userDetails.shortBio}
          </p>
          <p className="mb-2">
            <strong>Country:</strong> {userDetails.country}
          </p>
          <p className="mb-2">
            <strong>Phone Number:</strong> {userDetails.phoneNumber}
          </p>
          <p className="mb-2">
            <strong>Date of Birth:</strong> {userDetails.dob}
          </p>
          <p className="mb-2">
            <strong>Gender:</strong> {userDetails.gender}
          </p>
          <p className="mb-2">
            <strong>Designation:</strong> {userDetails.designation}
          </p>
          <p className="mb-2">
            <strong>Qualification:</strong> {userDetails.qualification}
          </p>
          <p className="mb-4">
            <strong>Interests:</strong> {userDetails.interests}
          </p>
          <button
            onClick={() => setEditMode(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2"
          >
            <FaEdit className="inline mr-2" />
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            <FaTrash className="inline mr-2" />
            Delete Account
          </button>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
