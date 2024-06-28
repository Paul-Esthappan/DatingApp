import React, { useState, useEffect } from "react";
import { useCountries } from "use-react-countries";
import { Button } from "@material-tailwind/react";
import InputField from "../../components/input/InputField";
import InputSelectBox from "../../components/input/InputSelectBox";
import InputMobileNumber from "../../components/input/InputMobileNumber";
import FileUpload from "../../components/input/FileUpload";
import SplashScreen from "../SplashScreen.jsx/SplashScreen";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios for API requests
import { publicRequest } from "../../utils/axios/axios";

const Login = ({ isSignInPage }) => {
  const navigate = useNavigate();
  const { countries } = useCountries();
  const [country, setCountry] = useState(0);
  const { name, flags, countryCallingCode } = countries[country];

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    userName: "",
    country: "",
    phoneNumber: "",
    dob: "",
    gender: "",
    designation: "",
    createdDate: "",
    qualification: [],
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

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
      }

      // Send data to the backend
      const response = await axios.post(url, data, {
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
      navigate("/home");

      // Clear form
      setFormData({
        email: "",
        password: "",
        userName: "",
        country: "",
        phoneNumber: "",
        dob: "",
        gender: "",
        designation: "",
        createdDate: "",
        qualification: [],
      });
      setSelectedFiles([]);
    } catch (error) {
      console.error(`${isSignInPage ? "login" : "signup"} failed:`, error);
      setErrorMessage(
        `${isSignInPage ? "Login" : "Registration"} failed. Please try again.`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignin = async () => {
     try {
       const response = await axios.post(publicRequest, "/auth/google");
       if (response.data.success) {
         navigate("/");
       } else {
         console.log("Invalid username or password");
       }
     } catch (error) {
       console.log(error);
     }
  };
  
  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <div className="flex justify-center items-center h-screen bg-[#d2cfdf]">
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
                  type="text"
                  name="userName"
                  id="userName"
                  label="UserName"
                  placeholder="ex: John Koya"
                  value={formData.userName}
                  onChange={handleInputChange}
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
                  label="Upload Dp"
                  onChange={handleFileChange}
                  multiple={true}
                  accept=".jpg,.png,.pdf"
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
        <Button className="w-full my-2" onClick={handleGoogleSignin}>
          Login with Google
        </Button>
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
