import React, { useState } from 'react'
import InputField from '../../components/input/InputField';
import InputSelectBox from '../../components/input/InputSelectBox';
import FileUpload from '../../components/input/FileUpload';
import { Button } from '@material-tailwind/react';
import InputRadioButton from '../../components/input/InputRadioButton';
import { setUserAndToken } from '../../redux/slice/authSlice';

const DatingRegisterPage = () => {
    const [country, setCountry] = useState(0);

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

    const DesignationOptions = [
   
      { value: "student", label: "Student" },
      { value: "employee", label: "Employee" },
      { value: "selfEmployed", label: "Self Employed" },
      { value: "business", label: "Business" },
    ];

    const designationOptions = [
      { value: "", label: "Select Designation" },
      { value: "admin", label: "Admin" },
      { value: "other", label: "Other" },
    ];

    const EducationOptions = [
      { value: "phd", label: "Phd" },
      { value: "master", label: "Master" },
      { value: "degree", label: "Degree" },
      { value: "other", label: "Other" },
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
        const response = await publicRequest.post(formData);

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
        console.error(error);
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
          User Registration Form
        </h1>
        <h3 className="text-gray-600 text-sm text-center mb-4">
          Please register to continue
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4 flex flex-col">
          <div className="grid md:grid-cols-2 gap-4">
            <InputField
              type="date"
              label="Date of Birth"
              id="dateOfBirth"
              name="dateOfBirth"
              placeholder="12/01/2010"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
            />
            <InputSelectBox
              label="Designation"
              name="designation"
              value={formData.designation}
              onChange={handleInputChange}
              options={DesignationOptions}
              className="mb-4"
            />
            <InputSelectBox
              label="Education"
              name="education"
              value={formData.education}
              onChange={handleInputChange}
              options={EducationOptions}
              className="mb-4"
            />
            <InputField
              type="text"
              label="Location"
              id="location"
              name="location"
              placeholder="Location : city, town"
              value={formData.location}
              onChange={handleInputChange}
            />
            <div>
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
            </div>
            <div>
              <label
                htmlFor="Smoking"
                className="block text-xs font-medium text-gray-700"
              >
                Smoking Habit
              </label>
              <div className="flex items-center px-4 space-x-4">
                <InputRadioButton
                  label="Yes"
                  type="radio"
                  id="yes"
                  name="smokingHabit"
                  value="yes"
                  checked={formData.smokingHabit === "yes"}
                  onChange={handleInputChange}
                />
                <InputRadioButton
                  type="radio"
                  label="No"
                  id="no"
                  name="smokingHabit"
                  value="no"
                  checked={formData.smokingHabit === "No"}
                  onChange={handleInputChange}
                />
                <InputRadioButton
                  type="radio"
                  label="Occasionally"
                  id="occasionally"
                  name="smokingHabit"
                  value="occasionally"
                  checked={formData.smokingHabit === "occasionally"}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="Drinking"
                className="block text-xs font-medium text-gray-700"
              >
                Drinking Habit
              </label>
              <div className="flex items-center px-4 space-x-4">
                <InputRadioButton
                  label="Yes"
                  type="radio"
                  id="yes"
                  name="drinkingHabit"
                  value="yes"
                  checked={formData.drinkingHabit === "yes"}
                  onChange={handleInputChange}
                />
                <InputRadioButton
                  type="radio"
                  label="No"
                  id="no"
                  name="drinkingHabit"
                  value="no"
                  checked={formData.drinkingHabit === "No"}
                  onChange={handleInputChange}
                />
                <InputRadioButton
                  type="radio"
                  label="Occasionally"
                  id="occasionally"
                  name="drinkingHabit"
                  value="occasionally"
                  checked={formData.drinkingHabit === "occasionally"}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <InputField
              type="text"
              label="Hobbies"
              id="hobbies"
              name="hobbies"
              placeholder="Hobbies seperate with comma , eg Dancing, Drawing"
              value={formData.hobbies}
              onChange={handleInputChange}
            />

            <InputField
              type="text"
              label="Interests"
              id="interests"
              name="interests"
              placeholder="Interests seperate with comma , eg Dancing, Drawing"
              value={formData.interests}
              onChange={handleInputChange}
            />
            <InputField
              type="text"
              label="Preferences"
              id="preferences"
              name="preferences"
              placeholder="Preferences seperate with comma , eg Dancing, Drawing"
              value={formData.preferences}
              onChange={handleInputChange}
            />
            <FileUpload
              label="Upload Images"
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
            <FileUpload
              label="Upload Short Video"
              onChange={handleFileChange}
              multiple={true}
              accept=".mp4"
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
          </div>

          <Button type="submit" disabled={loading} variant="filled" size="lg">
            Register
          </Button>
          {errorMessage && (
            <p className="text-red-500 text-sm">{errorMessage}</p>
          )}
        </form>
      </div>
    </div>
  );
}

export default DatingRegisterPage