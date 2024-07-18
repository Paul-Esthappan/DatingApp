import axios from "axios";

export const baseURL = 'http://localhost:3000';

// Attempt to retrieve user data from local storage
const persistedRoot = localStorage.getItem('persist:root');
const userData = persistedRoot ? JSON.parse(JSON.parse(persistedRoot).auth) : null;
const userToken = userData?.token;
const userId = userData?._id

// Create an instance for authenticated requests with the user token
export const userRequest = axios.create({
  baseURL,
  headers: { Authorization: `Bearer ${userToken}` },
  // 'userId': userId
});

// Create a common instance for public requests
export const publicRequest = axios.create({
  baseURL,
});

console.log("userreqtoken", userToken);

export const backendUrl = "http://localhost:3000";