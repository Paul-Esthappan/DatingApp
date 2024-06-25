import { Button } from '@material-tailwind/react'
import React from 'react'
import { Navigate } from 'react-router-dom'

const Relationship = () => {
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
          onClick={() => Navigate("/")}
        >
          X
        </button>
        <h1 className="text-xl font-bold text-center text-slate-600">
          Are you looking for a Life Partner or Boyfriend
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4 flex flex-col">
          <div className="grid md:grid-cols-2 gap-4">
            <Button>Boy Friend</Button>
            <Button>Life Partner</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Relationship