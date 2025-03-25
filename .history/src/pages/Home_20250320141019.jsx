import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import mentorGif from "../assets/mentorHome.gif"; 
import bg1 from "../assets/bg-2.png"
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
      <div className="w-1/2 flex flex-col justify-center items-center p-10">
        <h1 className="text-4xl font-bold">
          Welcome to,<br /> <span className="text-blue-500">Student Mentoring System</span>
        </h1>
        <img src={bg1} alt="Welcome" className="w-70 " />


      </div>

      {/* Right Section */}
      <div className="w-1/2 bg-blue-500 flex flex-col justify-center items-center text-white p-10">
      <img src={mentorGif} alt="Welcome" className="w-70 rounded-lg shadow-lg" />
        <h2 className="text-lg mb-4">Select your role</h2>
        <div className="mb-4">
          <label className="mr-2">
            <input type="radio" value="Admin" checked={role === "Admin"} onChange={() => setRole("Admin")}/> Admin
          </label>
          <label className="mr-2">
            <input type="radio" value="Mentor" checked={role === "Mentor"} onChange={() => setRole("Mentor")}/> Mentor
          </label>
          <label>
            <input type="radio" value="Mentee" checked={role === "Mentee"} onChange={() => setRole("Mentee")}/> Mentee
          </label>
        </div>
        <button onClick={handleNext} className="bg-white text-blue-500 px-6 py-2 rounded-full">Next</button>
      </div>
    </div>
  );
};

export default Home;
