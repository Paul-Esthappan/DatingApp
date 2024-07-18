import React, { useState, useEffect } from "react";
import { useCountries } from "use-react-countries";
import { Button } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import InputField from "../../components/input/InputField";
import InputSelectBox from "../../components/input/InputSelectBox";
import FileUpload from "../../components/input/FileUpload";
import SplashScreen from "../SplashScreen/SplashScreen";
import { publicRequest } from "../../utils/axios/axios";
import { useDispatch } from "react-redux";
import { setUserAndToken } from "../../redux/slice/authSlice";

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

const Login = ({ isSignInPage }) => {
  const navigate = useNavigate();
  const { countries } = useCountries();
  const [country, setCountry] = useState(0);
  const { name, flags, countryCallingCode } = countries[country];
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    displayName: "",
    country: "",
    phoneNumber: "",
    dob: "",
    gender: "",
    designation: "",
    qualification: [],
    interests: "",
    drinkingHabits: "",
    smokingHabits: "",
    location: "", 
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [image, setImage] = useState(null);
  const [images, setImages] = useState([]);
  const [reels, setReels] = useState([]);
  const [showSplash, setShowSplash] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2000);
    return () => clearTimeout(timer);
  }, []);

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

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleFileChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleReelChange = (e) => {
    setReels(Array.from(e.target.files));
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setErrorMessage("");

  if (!isSignInPage && formData.password !== formData.confirmPassword) {
    setErrorMessage("Passwords do not match");
    setLoading(false);
    return;
  }

  try {
    let url;
    let data;
    if (isSignInPage) {
      data = {
        email: formData.email,
        password: formData.password,
      };
    } else {
      data = new FormData();
      data.append("email", formData.email);
      data.append("password", formData.password);
      data.append("displayName", formData.displayName);
      data.append("shortBio", formData.shortBio);
      data.append("country", formData.country);
      data.append("phoneNumber", formData.phoneNumber);
      data.append("dob", formData.dob);
      data.append("gender", formData.gender);
      data.append("designation", formData.designation);
      data.append("qualification", JSON.stringify(formData.qualification));
      data.append("interests", formData.interests);
      data.append("drinkingHabits", formData.drinkingHabits);
      data.append("smokingHabits", formData.smokingHabits);
      data.append("image", image);
      images.forEach((file) => data.append("images", file));
      reels.forEach((file) => data.append("reels", file));
      data.append("location", formData.location); // Include location in form data
    }

    url = isSignInPage ? "/api/auth/login" : "/api/auth/signup";

    const config = isSignInPage
      ? { headers: { "Content-Type": "application/json" } }
      : {};

    const response = await publicRequest.post(url, data, config);

    if (response.status === 200 || response.status === 201) {
      const { user, token } = response.data;
      dispatch(setUserAndToken({ user, token }));
      console.log("User details:", user);
      console.log("Token:", token);
      navigate("/account/employment");
    } else {
      throw new Error(response.data.message || "An error occurred.");
    }
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
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  const handleGoogleSignin = () => {
    console.log("Google Sign-In triggered");
    window.location.href = "http://localhost:3000/auth/login/federated/google";
  };

  return (
    <div className="flex justify-center bg-[#d2cfdf] h-screen overflow-scroll w-screen">
      <div className="max-w-7xl mt-10 h-full bg-white px-6 py-2 rounded-lg shadow-lg hover:cursor-pointer overflow-scroll ">
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
        <form onSubmit={handleSubmit} className="space-y-4 flex flex-col ">
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
                  name="displayName"
                  id="displayName"
                  label="UserName"
                  placeholder="ex: John Koya"
                  value={formData.displayName}
                  onChange={handleInputChange}
                />
                <InputField
                  type="textarea"
                  name="shortBio"
                  id="shortBio"
                  label="Short bio"
                  placeholder="ex: John Koya"
                  value={formData.shortBio}
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
                  placeholder="Your interests"
                  value={formData.interests}
                  onChange={handleInputChange}
                />
                <InputSelectBox
                  name="country"
                  id="country"
                  label="Country"
                  options={countryOptions}
                  value={formData.country}
                  onChange={handleInputChange}
                />
                <InputField
                  type="text"
                  name="phoneNumber"
                  id="phoneNumber"
                  label="Phone Number"
                  placeholder="Enter your phone number"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                />
                <InputSelectBox
                  name="gender"
                  id="gender"
                  label="Gender"
                  options={[
                    { value: "", label: "Select Gender" },
                    { value: "male", label: "Male" },
                    { value: "female", label: "Female" },
                  ]}
                  value={formData.gender}
                  onChange={handleInputChange}
                />
                <InputSelectBox
                  name="designation"
                  id="designation"
                  label="Designation"
                  options={designationOptions}
                  value={formData.designation}
                  onChange={handleInputChange}
                />
                <InputSelectBox
                  name="qualification"
                  id="qualification"
                  label="Qualification"
                  options={qualificationOptions}
                  multiple
                  value={formData.qualification}
                  onChange={handleInputChange}
                />
                <InputSelectBox
                  name="drinkingHabits"
                  id="drinkingHabits"
                  label="Drinking Habits"
                  options={habitsOptions}
                  value={formData.drinkingHabits}
                  onChange={handleInputChange}
                />
                <InputSelectBox
                  name="smokingHabits"
                  id="smokingHabits"
                  label="Smoking Habits"
                  options={habitsOptions}
                  value={formData.smokingHabits}
                  onChange={handleInputChange}
                />
                <InputField
                  type="text"
                  name="location"
                  id="location"
                  label="Location"
                  placeholder="Your location"
                  value={formData.location}
                  onChange={handleInputChange}
                />
                <FileUpload
                  name="image"
                  id="image"
                  label="Profile Picture"
                  onChange={handleImageChange}
                />
                <FileUpload
                  name="images"
                  id="images"
                  label="Images"
                  multiple
                  onChange={handleFileChange}
                />
                <FileUpload
                  name="reels"
                  id="reels"
                  label="Reels"
                  multiple
                  onChange={handleReelChange}
                />
              </>
            )}
          </div>
          {errorMessage && (
            <p className="text-red-500 text-center">{errorMessage}</p>
          )}
          <Button
            type="submit"
            color="blue"
            disabled={loading}
            className="w-full mt-4"
          >
            {loading ? "Processing..." : isSignInPage ? "Login" : "Sign Up"}
          </Button>
        </form>
        <div className="flex flex-col items-center mt-4">
          <p className="text-gray-600 text-sm mb-2">
            {isSignInPage
              ? "Don't have an account?"
              : "Already have an account?"}{" "}
            <span
              className="text-blue-500 cursor-pointer"
              onClick={() =>
                navigate(isSignInPage ? "/account/signup" : "/account/login")
              }
            >
              {isSignInPage ? "Sign Up" : "Login"}
            </span>
          </p>
          <Button
            onClick={handleGoogleSignin}
            color="red"
            className="flex items-center"
          >
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google logo"
              className="mr-2"
              width="20"
              height="20"
            />
            Sign in with Google
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
