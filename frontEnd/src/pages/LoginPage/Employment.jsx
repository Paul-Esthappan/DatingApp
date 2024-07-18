import React, { useState } from "react";
import { Button } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import InputField from "../../components/input/InputField";
import InputSelectBox from "../../components/input/InputSelectBox";
import axios from "axios";
import { useSelector } from "react-redux";
import { userRequest } from "../../utils/axios/axios";

const expertLevels = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "expert", label: "Expert" },
];

const Employment = () => {
  const [selection, setSelection] = useState(null);
  const [formData, setFormData] = useState({
    companyName: "",
    designation: "",
    companyLocation: "",
    professionTitle: "",
    expertiseLevel: "",
  });

  const userId = useSelector((state) => state.auth.user._id);
  const navigate = useNavigate();

  const handleClick = (value) => {
    setSelection(value);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    // Await the response from the post request
    const response = await userRequest.post(
      `/api/employment/add/${userId}`,
      formData
    );
    
    // Log the entire response to understand its structure
    console.log("the res", response);
    
    // Access the status code from the response
    if (response.status === 201) {
      navigate("/account/relationship");
    }
  } catch (error) {
    console.error("Error submitting employment data:", error);
  }
};

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-blue-gray-50">
      {!selection ? (
        <div className="flex justify-center items-center">
          <Button
            onClick={() => handleClick("employment")}
            variant="gradient"
            color="deep-orange"
            className="mx-5"
          >
            Employee / Employer
          </Button>
          <Button
            onClick={() => handleClick("jobSeeker")}
            variant="gradient"
            color="deep-orange"
            className="mx-5"
          >
            Job Seeker
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          {selection === "employment" && (
            <>
              <h1>Employee / Employer</h1>
              <InputField
                id="companyName"
                label="Company Name"
                name="companyName"
                placeholder="Name of your Organization"
                type="text"
                value={formData.companyName}
                onChange={handleChange}
              />
              <InputField
                id="designation"
                label="Designation"
                name="designation"
                placeholder="Your Designation"
                type="text"
                value={formData.designation}
                onChange={handleChange}
              />
              <InputField
                id="companyLocation"
                label="Location"
                name="companyLocation"
                placeholder="Location of your Organization"
                type="text"
                value={formData.companyLocation}
                onChange={handleChange}
              />
            </>
          )}
          {selection === "jobSeeker" && (
            <>
              <h1>Job Seeker</h1>
              <InputField
                id="professionTitle"
                label="Profession Title"
                name="professionTitle"
                placeholder="e.g. Software Developer"
                type="text"
                value={formData.professionTitle}
                onChange={handleChange}
              />
              <InputSelectBox
                name="expertiseLevel"
                id="expertiseLevel"
                label="Expertise Level"
                options={expertLevels}
                value={formData.expertiseLevel}
                onChange={handleChange}
              />
            </>
          )}
          <Button type="submit">Next</Button>
          {selection === "employment" ? (
            <p onClick={() => handleClick("jobSeeker")}>
              Not an Employee or Employer? Click here
            </p>
          ) : (
            <p onClick={() => handleClick("employment")}>
              Not a Job Seeker? Click here
            </p>
          )}
        </form>
      )}
    </div>
  );
};

export default Employment;
