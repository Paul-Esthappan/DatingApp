import { Button } from "@material-tailwind/react";
import React from "react";
import { useNavigate } from "react-router-dom";

const Services = () => {
  const navigate = useNavigate();

  const handleclick = (value) => {
    switch (value) {
      case "dating":
        navigate("/dating/relationship");
        break;
      case "matrimony":
        navigate("/matrimony/home");
        break;
      case "jobPortal":
        navigate("/jobPortal/home");
        break;
      case "studyAbroad":
        navigate("/studyAbroad/home");
        break;
      case "ecommerce":
        navigate("/ecommerce/home");
        break;
      default:
        break;
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <div>
        <h1 className="font-bold text-6xl text-red-400 my-6">
          What would you like to do?
        </h1>
      </div>
      <div className="flex justify-center items-center">
        <Button
          onClick={() => handleclick("dating")}
          variant="gradient"
          color="deep-orange"
          className="mx-5"
        >
          Dating
        </Button>
        <Button
          onClick={() => handleclick("matrimony")}
          variant="gradient"
          color="deep-orange"
          className="mx-5"
        >
          Matrimony
        </Button>
        <Button
          onClick={() => handleclick("jobPortal")}
          variant="gradient"
          color="deep-orange"
          className="mx-5"
        >
          Job Portal
        </Button>
        <Button
          onClick={() => handleclick("studyAbroad")}
          variant="gradient"
          color="deep-orange"
          className="mx-5"
        >
          Study Abroad
        </Button>
        <Button
          onClick={() => handleclick("ecommerce")}
          variant="gradient"
          color="deep-orange"
          className="mx-5"
        >
          Shop Online
        </Button>
      </div>
    </div>
  );
};

export default Services;
