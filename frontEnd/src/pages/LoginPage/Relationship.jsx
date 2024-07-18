// src/pages/Relationship.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@material-tailwind/react";
import axios from "axios";
import { useSelector } from "react-redux";
import { userRequest } from "../../utils/axios/axios";

const Relationship = () => {
  const [step, setStep] = useState(1);
  const [relationshipType, setRelationshipType] = useState("");
  const [sexualOrientation, setSexualOrientation] = useState("");
  const navigate = useNavigate();
  const userId = useSelector((state) => state.auth.user._id); 

  const handleRelationshipClick = (value) => {
    setRelationshipType(value);
    if (value === "shortTerm") {
      setStep(2); // Move to the next step if dating is selected
    } else {
      // For matrimony, you might want to handle it differently or redirect immediately
      navigate("/matrimony/home");
    }
  };

  const handleSexualOrientationClick = async (value) => {
    setSexualOrientation(value);

    // Prepare the data for submission
    const formData = {
      relationship: relationshipType,
      sexualOrientation: value,
      matrimonyRegistered: relationshipType === "longTerm", // Set this field based on relationship type
    };

    try {
      const response = await userRequest.post(`/api/dating/add/${userId}`, formData);
      if (response.status === 201) {
        navigate("/dating/home");
      }
    } catch (error) {
      console.error("Error submitting dating data:", error);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
      {step === 1 && (
        <div className="text-center">
          <h1 className="font-bold text-4xl text-red-400 mb-6">
            What would you like to do?
          </h1>
          <div className="flex justify-center">
            <Button
              onClick={() => handleRelationshipClick("shortTerm")}
              variant="gradient"
              color="deep-orange"
              className="mx-5"
            >
              Short Term Relationship
            </Button>
            <Button
              onClick={() => handleRelationshipClick("longTerm")}
              variant="gradient"
              color="deep-orange"
              className="mx-5"
            >
              Life Term Relationship
            </Button>
          </div>
        </div>
      )}
      {step === 2 && (
        <div className="text-center">
          <h1 className="font-bold text-4xl text-red-400 mb-6">
            Your Sexual Orientation
          </h1>
          <div className="flex justify-center">
            <Button
              onClick={() => handleSexualOrientationClick("men")}
              variant="gradient"
              color="deep-orange"
              className="mx-5"
            >
              MEN
            </Button>
            <Button
              onClick={() => handleSexualOrientationClick("women")}
              variant="gradient"
              color="deep-orange"
              className="mx-5"
            >
              WOMEN
            </Button>
            <Button
              onClick={() => handleSexualOrientationClick("both")}
              variant="gradient"
              color="deep-orange"
              className="mx-5"
            >
              BOTH
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Relationship;
