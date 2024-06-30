import React from "react";
import ProfileCard from "../../components/cards/ProfileCard";

const Home = () => {
  const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  const array2 = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const array3 = [1, 2, 3, 4, 5, 6];
  return (
    <div className="w-screen h-screen">
      <ProfileCard title="Preference" array={array} />
      <ProfileCard title="Education" array={array2} />
      <ProfileCard title="Industry" array={array3} />
    </div>
  );
};

export default Home;