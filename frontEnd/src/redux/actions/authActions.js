import axios from "axios";
import { setUserAndToken } from "../slice/authSlice";

export const loginUser = (userData) => async (dispatch) => {
  try {
    const response = await axios.post(`/api/auth/login`, userData);
    const { user, token } = response.data;
    dispatch(setUserAndToken({ user, token }));
  } catch (error) {
    console.error("Login failed", error);
    throw error;
  }
};

export const registerUser = (formData) => async (dispatch) => {
  try {
    const response = await axios.post(`/api/auth/signup`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    const { user, token } = response.data;
    dispatch(setUserAndToken({ user, token }));
  } catch (error) {
    console.error("Registration failed", error);
    throw error;
  }
};
