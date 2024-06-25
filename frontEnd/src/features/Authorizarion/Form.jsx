// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { publicRequest } from "../../utils/axios/axios";
// import { useDispatch } from "react-redux";
// import { setUserAndToken } from "../../redux/authSlice";
// import InputRadioButton from "../../components/input/InputRadioButton";
// import InputSelectBox from "../../components/input/InputSelectBox";
// import InputCheckBox from "../../components/input/InputCheckBox";
// import InputField from "../../components/input/InputField";
// import { Button } from "@material-tailwind/react";


// const Form = ({ isSignInPage }) => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//     userName: "",
//     country: "",
//     phoneNumber: "",
//     dob: "",
//     gender: "",
//     designation: "",
//     createdDate: "",
//     qualification: [],
//   });
//   const [loading, setLoading] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");

//    const countryOptions = [
//      { value: "", label: "Select Country" },
//      { value: "india", label: "India" },
//      { value: "china", label: "China" },
//    ];
   
//   const designationOptions = [
//     { value: "", label: "Select Designation" },
//     { value: "admin", label: "Admin" },
//     { value: "other", label: "Other" },
//   ];

//     const qualificationOptions = [
//       { value: "BCA", label: "BCA" },
//       { value: "MCA", label: "MCA" },
//       { value: "MBA", label: "MBA" },
//     ];

//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;

//     if (type === "checkbox") {
//       setFormData((prevFormData) => {
//         const newValues = checked
//           ? [...prevFormData[name], value]
//           : prevFormData[name].filter((v) => v !== value);
//         return { ...prevFormData, [name]: newValues };
//       });
//     } else {
//       setFormData((prevFormData) => ({
//         ...prevFormData,
//         [name]: value,
//       }));
//     }
//   };


//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setErrorMessage("");

//     try {
//       const response = await publicRequest.post(
//         `${!isSignInPage ? "/auth/signup" : "/auth/signin"}`,
//         formData
//       );

//       const { user, token } = response.data;
//       dispatch(setUserAndToken({ user, token }));
//       navigate("/home");

//       // Clear form data on successful submission
//       setFormData({
//         email: "",
//         password: "",
//         userName: "",
//         country: "",
//         phoneNumber: "",
//         dob: "",
//         gender: "",
//         designation: "",
//         createdDate: "",
//         qualification: [],
//       });
//     } catch (error) {
//       console.error(`${!isSignInPage ? "signup" : "login"} failed:`, error);
//       setErrorMessage("Registration failed. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex justify-center items-center h-screen bg-[#d2cfdf]">
//       <div className="max-w-md w-full bg-white px-6 py-2 rounded-lg shadow-lg">
//         <button
//           className="flex w-full justify-end"
//           onClick={() => navigate("/")}
//         >
//           X
//         </button>
//         <h1 className="text-xl font-bold text-center text-slate-600">
//           User Registation Form
//         </h1>
//         <h3 className="text-gray-600 text-sm text-center mb-4">
//           {!isSignInPage
//             ? "Please register to continue"
//             : "Please login to continue."}
//         </h3>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <InputField
//             type="email"
//             label="Email Id"
//             id="email"
//             name="email"
//             placeholder="Email id? ex:john@email.com"
//             value={formData.email}
//             onChange={handleInputChange}
//           />
//           <InputField
//             type="password"
//             label="Password"
//             name="password"
//             id="password"
//             placeholder="********"
//             value={formData.password}
//             onChange={handleInputChange}
//           />
//           {!isSignInPage && (
//             <>
//               <InputField
//                 type="text"
//                 name="userName"
//                 id="userName"
//                 label="UserName"
//                 placeholder="ex: John Koya"
//                 value={formData.userName}
//                 onChange={handleInputChange}
//               />
//               <InputSelectBox
//                 label="Country"
//                 name="country"
//                 value={formData.country}
//                 onChange={handleInputChange}
//                 options={countryOptions}
//                 className="mb-4"
//               />
//               {/* <InputSelectBox
//                 label="Designation"
//                 name="designation"
//                 value={formData.designation}
//                 onChange={handleInputChange}
//                 options={designationOptions}
//                 className="mb-4"
//               /> */}
//               <InputField
//                 type="tel"
//                 label="Phone Number"
//                 name="phoneNumber"
//                 placeholder="Phone Number"
//                 value={formData.phoneNumber}
//                 onChange={handleInputChange}
//               />
//               <InputField
//                 type="date"
//                 label="Date of Birth"
//                 name="dob"
//                 value={formData.dob}
//                 onChange={handleInputChange}
//               />
//               <div>
//                 <label
//                   htmlFor="male"
//                   className="block text-xs font-medium text-gray-700"
//                 >
//                   Gender
//                 </label>
//                 <div className="flex items-center px-4 space-x-4">
//                   <InputRadioButton
//                     label="Male"
//                     type="radio"
//                     id="male"
//                     name="gender"
//                     value="male"
//                     checked={formData.gender === "male"}
//                     onChange={handleInputChange}
//                   />
//                   <InputRadioButton
//                     type="radio"
//                     label="Female"
//                     id="female"
//                     name="gender"
//                     value="female"
//                     checked={formData.gender === "female"}
//                     onChange={handleInputChange}
//                   />
//                   <InputRadioButton
//                     type="radio"
//                     label="Other"
//                     id="other"
//                     name="gender"
//                     value="other"
//                     checked={formData.gender === "other"}
//                     onChange={handleInputChange}
//                   />
//                 </div>
//               </div>
//               <InputCheckBox
//                 label="Qualification"
//                 name="qualification"
//                 options={qualificationOptions}
//                 formData={formData}
//                 onChange={handleInputChange}
//                 className="mb-4"
//               />
//             </>
//           )}
//           <Button type="submit" disabled={loading} variant="primary" size="xl">
//             {isSignInPage ? "Login" : "Register"}
//           </Button>
//           {errorMessage && (
//             <p className="text-red-500 text-sm">{errorMessage}</p>
//           )}
//         </form>
//         <p
//           className="text-center mt-4 text-sm text-gray-700"
//           onClick={() =>
//             navigate(isSignInPage ? "/account/signup" : "/account/signin")
//           }
//         >
//           {isSignInPage
//             ? "New user? Sign up"
//             : "Already have an account? Log in"}
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Form;
