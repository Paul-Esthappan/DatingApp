import { Button } from '@material-tailwind/react';
import React from 'react'
import { useNavigate } from 'react-router-dom';

const SexualOrientation = () => {
    const navigate = useNavigate();
      const handleclick = (value) => {
        switch (value) {
          case "men":
            navigate("/dating/home");
            break;
          case "women":
            navigate("/dating/home");
            break;
          case "both":
            navigate("/dating/home");
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
          onClick={() => handleclick("men")}
          variant="gradient"
          color="deep-orange"
          className="mx-5"
        >
          MEN
        </Button>
        <Button
          onClick={() => handleclick("women")}
          variant="gradient"
          color="deep-orange"
          className="mx-5"
        >
          WOMEN
        </Button>
        <Button
          onClick={() => handleclick("both")}
          variant="gradient"
          color="deep-orange"
          className="mx-5"
        >
          BOTH
        </Button>
      </div>
    </div>
  );
}

export default SexualOrientation