import axios from "axios";

export const  baseUrl = 'http://localhost:5001/api';

// Create a common instance for public requests
export const publicRequest = axios.create({
  baseURL: baseUrl,
});

// Attempt to retrieve user data from local storage
const persistedRoot = localStorage.getItem('persist:root');
const userData = persistedRoot ? JSON.parse(JSON.parse(persistedRoot).auth) : null;
const userToken = userData?.token;

// Create an instance for authenticated requests with the user token
export const userRequest = axios.create({
  baseURL: baseUrl,
  headers: { token: `Bearer ${userToken}` },
});
