import React from "react";
import { green_tick } from "../../assets";
import { useNavigate } from "react-router-dom";

const ThanksScreen = () => {
  const navigate = useNavigate();
  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center gap-4">
      <img src={green_tick} alt="green-tick" className="w-44" />
      <span className="text-3xl font-medium">Thank you for your response!</span>
      {/* <button
        className="bg-coolBlue text-white text-base font-medium p-3 hover:bg-coolBlue/50 mt-6 rounded-lg"
        onClick={() => navigate("/dashboard")}
      >
        Back to Dashboard
      </button> */}
    </div>
  );
};

export default ThanksScreen;
