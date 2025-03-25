import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [role, setRole] = useState("Admin");
  const navigate = useNavigate();

  const handleNext = () => {
    if (role === "Mentor") navigate("/signin");
    else alert("Baaki roles ka setup baad me karenge");
  };

  return (
    <div className="flex h-screen">
      {/* Left Section */}
      <div className=" flex flex-col justify-center items-center p-10">
        <h1 className="text-4xl font-bold">
          Welcome to,<br /> <span className="text-blue-500">Student Mentoring System</span>
        </h1>
        <img src="/assets/Homementor.jpg" alt="Welcome" className="w-80 mt-5" />
      </div>

      {/* Right Section */}
      <div className="w-1/2 bg-blue-500 flex flex-col justify-center items-center text-white">
        <h2 className="text-lg mb-4">Select your role</h2>
        <div className="mb-4">
          <label className="mr-2">
            <input type="radio" value="Admin" checked={role === "Admin"} onChange={() => setRole("Admin")}/> Admin
          </label>
          <label className="mr-2">
            <input type="radio" value="Mentor" checked={role === "Mentor"} onChange={() => setRole("Mentor")}/> Mentor
          </label>
          <label>
            <input type="radio" value="Mentee" checked={role === "Mentee"} onChange={() => setRole("Mentee")} /> Mentee
          </label>
        </div>
        <button onClick={handleNext} className="bg-white text-blue-500 px-6 py-2 rounded-full">Next →</button>
      </div>
    </div>
  );
};

export default Home;
