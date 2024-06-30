import { Button } from '@material-tailwind/react'
import React from 'react'
import { useNavigate } from 'react-router-dom';

const Relationship = () => {
  const navigate = useNavigate();

  const handleclick = (value) => {
    switch (value) {
      case "dating":
        navigate("/dating/sexualOrientation");
        break;
      case "matrimony":
        navigate("/matrimony/home");
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
          Short Term Fun
        </Button>
        <Button
          onClick={() => handleclick("matrimony")}
          variant="gradient"
          color="deep-orange"
          className="mx-5"
        >
          Life Partner
        </Button>
      </div>
    </div>
  );
}

export default Relationship