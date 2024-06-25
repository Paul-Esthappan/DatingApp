import React, { useState } from "react";
import { useCountries } from "use-react-countries";
import { Button } from "@material-tailwind/react";
import InputField from "../../components/input/InputField";
import InputSelectBox from "../../components/input/InputSelectBox";
import InputRadioButton from "../../components/input/InputRadioButton";
import InputCheckBox from "../../components/input/InputCheckBox";
import InputMobileNumber from "../../components/input/InputMobileNumber";
import FileUpload from "../../components/input/FileUpload";

const Login = ({ isSignInPage }) => {
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
    // Handle file processing or storage here
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      // Assuming a function `publicRequest` for making API requests
      const response = await publicRequest.post(
        `${!isSignInPage ? "/auth/signup" : "/auth/signin"}`,
        formData
      );

      // Assuming a function `dispatch` and a `navigate` function for routing
      const { user, token } = response.data;
      dispatch(setUserAndToken({ user, token }));
      navigate("/home");

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
      console.error(`${!isSignInPage ? "signup" : "login"} failed:`, error);
      setErrorMessage("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-[#d2cfdf]">
      <div className="max-w-7xl bg-white px-6 py-2 rounded-lg shadow-lg">
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
          {!isSignInPage
            ? "Please register to continue"
            : "Please login to continue."}
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
                {/* <div>
                  <label
                    htmlFor="male"
                    className="block text-xs font-medium text-gray-700"
                  >
                    Gender
                  </label>
                  <div className="flex items-center px-4 space-x-4">
                    <InputRadioButton
                      label="Male"
                      type="radio"
                      id="male"
                      name="gender"
                      value="male"
                      checked={formData.gender === "male"}
                      onChange={handleInputChange}
                    />
                    <InputRadioButton
                      type="radio"
                      label="Female"
                      id="female"
                      name="gender"
                      value="female"
                      checked={formData.gender === "female"}
                      onChange={handleInputChange}
                    />
                    <InputRadioButton
                      type="radio"
                      label="Other"
                      id="other"
                      name="gender"
                      value="other"
                      checked={formData.gender === "other"}
                      onChange={handleInputChange}
                    />
                  </div>
                </div> */}
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
        <p
          className="text-center mt-4 text-sm text-gray-700"
          onClick={() =>
            navigate(isSignInPage ? "/account/signup" : "/account/signin")
          }
        >
          {isSignInPage
            ? "New user? Sign up"
            : "Already have an account? Log in"}
        </p>
      </div>
    </div>
  );
};

export default Login;
