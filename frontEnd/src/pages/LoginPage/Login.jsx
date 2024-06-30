import React, { useState, useEffect } from "react";
import { useCountries } from "use-react-countries";
import { Button } from "@material-tailwind/react";
import InputField from "../../components/input/InputField";
import InputSelectBox from "../../components/input/InputSelectBox";
import InputMobileNumber from "../../components/input/InputMobileNumber";
import FileUpload from "../../components/input/FileUpload";
import SplashScreen from "../SplashScreen.jsx/SplashScreen";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { publicRequest } from "../../utils/axios/axios";

const Login = ({ isSignInPage }) => {
  const navigate = useNavigate();
  const { countries } = useCountries();
  const [country, setCountry] = useState(0);
  const { name, flags, countryCallingCode } = countries[country];

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    userName: "",
    country: "",
    phoneNumber: "",
    dob: "",
    gender: "",
    designation: "",
    createdDate: "",
    qualification: [],
    interests: "",
    drinkingHabits: "",
    smokingHabits: "",
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedReels, setSelectedReels] = useState([]);
  const [showSplash, setShowSplash] = useState(true); // Initial state for splash screen

  useEffect(() => {
    // Hide splash screen after 2 seconds
    const timer = setTimeout(() => setShowSplash(false), 2000);
    return () => clearTimeout(timer); // Cleanup timer
  }, []);

  const countryOptions = [
    { value: "", label: "Select Country" },
    { value: "india", label: "India" },
    { value: "china", label: "China" },
  ];

  const designationOptions = [
    { value: "", label: "Select Designation" },
    { value: "admin", label: "Admin" },
    { value: "other", label: "Other" },
  ];

  const qualificationOptions = [
    { value: "BCA", label: "BCA" },
    { value: "MCA", label: "MCA" },
    { value: "MBA", label: "MBA" },
  ];

  const habitsOptions = [
    { value: "Yes", label: "Yes" },
    { value: "No", label: "No" },
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData((prevFormData) => {
        const newValues = checked
          ? [...prevFormData[name], value]
          : prevFormData[name].filter((v) => v !== value);
        return { ...prevFormData, [name]: newValues };
      });
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  const handleFileChange = (files) => {
    setSelectedFiles(files);
  };

  const handleReelChange = (files) => {
    setSelectedReels(files);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    // Validate password and confirm password
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      // Prepare form data for signup or login
      let url;
      let data;

      if (isSignInPage) {
        // Login case
        url = "/auth/login";
        data = {
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          password: formData.password,
        };
        navigate('/home')
      } else {
        // Signup case
        url = "/auth/signup";
        data = new FormData();

        for (const key in formData) {
          if (Array.isArray(formData[key])) {
            formData[key].forEach((item) => data.append(key, item));
          } else {
            data.append(key, formData[key]);
          }
        }

        selectedFiles.forEach((file) => {
          data.append("files", file);
        });

        selectedReels.forEach((file) => {
          data.append("reels", file);
        });
        navigate("/account/service");
      }

      // Send data to the backend
      const response = await axios.post(`${publicRequest}${url}`, data, {
        headers: {
          "Content-Type": isSignInPage
            ? "application/json"
            : "multipart/form-data",
        },
      });
      const { user, token } = response.data;

      // Assuming you have a function to set user and token in your Redux store
      // dispatch(setUserAndToken({ user, token }));

      // Redirect to home page
      navigate("/service");

      // Clear form
      setFormData({
        email: "",
        password: "",
        confirmPassword: "",
        userName: "",
        country: "",
        phoneNumber: "",
        dob: "",
        gender: "",
        designation: "",
        createdDate: "",
        qualification: [],
        interests: "",
        drinkingHabits: "",
        smokingHabits: "",
      });
      setSelectedFiles([]);
      setSelectedReels([]);
    } catch (error) {
      console.error(`${isSignInPage ? "Login" : "Signup"} failed:`, error);
      setErrorMessage(
        `${isSignInPage ? "Login" : "Registration"} failed. Please try again.`
      );
    } finally {
      setLoading(false);
    }
  };

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const ageDifMs = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDifMs); // milliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  const handleGoogleSignin = async () => {
    try {
      const responce = await axios.get(
        "http://localhost:3000/login/federated/google"
      );
      console.log("g responce", responce);
    } catch (error) {}
  };

  return (
    <div className="flex justify-center items-center bg-[#d2cfdf] h-full overflow-scroll">
      <div className="max-w-7xl bg-white px-6 py-2 rounded-lg shadow-lg hover:cursor-pointer">
        <button
          className="flex w-full justify-end"
          onClick={() => navigate("/")}
        >
          X
        </button>
        <h1 className="text-xl font-bold text-center text-slate-600">
          {isSignInPage ? "Login" : "User Registration Form"}
        </h1>
        <h3 className="text-gray-600 text-sm text-center mb-4">
          {isSignInPage
            ? "Please login to continue."
            : "Please register to continue"}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4 flex flex-col">
          <div className="grid md:grid-cols-2 gap-4">
            <InputField
              type="email"
              label="Email Id"
              id="email"
              name="email"
              placeholder="Email id? ex:john@email.com"
              value={formData.email}
              onChange={handleInputChange}
            />
            <InputField
              type="password"
              label="Password"
              name="password"
              id="password"
              placeholder="********"
              value={formData.password}
              onChange={handleInputChange}
            />
            {!isSignInPage && (
              <>
                <InputField
                  type="password"
                  label="Confirm Password"
                  name="confirmPassword"
                  id="confirmPassword"
                  placeholder="********"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                />
                <InputField
                  type="text"
                  name="userName"
                  id="userName"
                  label="UserName"
                  placeholder="ex: John Koya"
                  value={formData.userName}
                  onChange={handleInputChange}
                />
                <InputField
                  type="date"
                  name="dob"
                  id="dob"
                  label="Date of Birth"
                  value={formData.dob}
                  onChange={handleInputChange}
                />
                {formData.dob && <p>Age: {calculateAge(formData.dob)} years</p>}
                <InputField
                  type="text"
                  name="interests"
                  id="interests"
                  label="Interests"
                  placeholder="Enter your interests"
                  value={formData.interests}
                  onChange={handleInputChange}
                />
                <InputSelectBox
                  label="Drinking Habits"
                  name="drinkingHabits"
                  value={formData.drinkingHabits}
                  onChange={handleInputChange}
                  options={habitsOptions}
                />
                <InputSelectBox
                  label="Smoking Habits"
                  name="smokingHabits"
                  value={formData.smokingHabits}
                  onChange={handleInputChange}
                  options={habitsOptions}
                />
                <InputSelectBox
                  label="Country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  options={countryOptions}
                  className="mb-4"
                />
                <InputMobileNumber
                  type="tel"
                  label="Phone Number"
                  name="phoneNumber"
                  placeholder="Phone Number"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                />
                <FileUpload
                  label="Upload Profile Picture"
                  onChange={handleFileChange}
                  multiple={false}
                  accept=".jpg,.png"
                />
                <FileUpload
                  label="Upload Images"
                  onChange={handleFileChange}
                  multiple={true}
                  accept=".jpg,.png"
                />
                <FileUpload
                  label="Upload Short Reels"
                  onChange={handleReelChange}
                  multiple={true}
                  accept=".mp4,.mov"
                />
                {selectedFiles.length > 0 && (
                  <div className="mt-4">
                    <h2 className="text-xl">Selected Files:</h2>
                    <ul>
                      {selectedFiles.map((file, index) => (
                        <li key={index}>{file.name}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {selectedReels.length > 0 && (
                  <div className="mt-4">
                    <h2 className="text-xl">Selected Reels:</h2>
                    <ul>
                      {selectedReels.map((file, index) => (
                        <li key={index}>{file.name}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
          </div>

          <Button type="submit" disabled={loading} variant="filled" size="lg">
            {isSignInPage ? "Login" : "Register"}
          </Button>
          {errorMessage && (
            <p className="text-red-500 text-sm">{errorMessage}</p>
          )}
        </form>
        {isSignInPage ?
          <Button className="w-full my-2" onClick={handleGoogleSignin}>
            Login with Google
          </Button> : ''}
        <p className="text-center mt-4 text-sm text-gray-700">
          {isSignInPage ? "New user?" : "Already have an account?"}
          <a
            className="px-2 hover:text-blue-800 hover:text-lg"
            variant="text"
            onClick={() =>
              navigate(isSignInPage ? "/account/signup" : "/account/login")
            }
          >
            {isSignInPage ? "Sign up" : "Log in"}
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
