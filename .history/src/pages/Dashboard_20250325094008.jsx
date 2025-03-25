import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { FaHome, FaUserFriends, FaComments, FaCalendarAlt, FaSignOutAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { auth, db } from "../components/firebase"; // Firebase Import
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const authInstance = getAuth(); // Firebase Auth Instance

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(authInstance, async (user) => {
      if (user) {
        try {
          const userRef = doc(db, "Users", user.uid); 
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            const data = userSnap.data();
            setUserData(data);

            // Welcome message toast
            toast.success(`Welcome, ${data.firstName}!`, {
              position: "top-center",
              autoClose: 3000,
              theme: "colored",
            });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        navigate("/signin"); // Redirect if not logged in
      }
    });

    return () => unsubscribe();
  }, [authInstance, navigate]);

  const handleLogout = async () => {
    try {
      await signOut(authInstance);
      toast.info("Logged out successfully!", { position: "top-center" });
      navigate("/signin");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed!");
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-1/5 bg-white p-5 shadow-lg">
        <h2 className="text-xl font-bold text-gray-700 mb-5">Mentor</h2>
        <nav className="space-y-8">
          <a href="#" className="flex items-center space-x-2 text-blue-500">
            <FaHome /> <span>Home</span>
          </a>
          <a href="#" className="flex items-center space-x-2 text-gray-600 hover:text-blue-500">
            <FaUserFriends /> <span>Post</span>
          </a>
          <a href="#" className="flex items-center space-x-2 text-gray-600 hover:text-blue-500">
            <FaCalendarAlt /> <span>Meetings</span>
          </a>
          <a href="#" className="flex items-center space-x-2 text-gray-600 hover:text-blue-500">
            <FaComments /> <span>Chat</span>
          </a>
          <a href="#" className="flex items-center space-x-2 text-gray-600 hover:text-blue-500">
            <FaUserFriends /> <span>Profile</span>
          </a>
        </nav>
        <button onClick={handleLogout} className="mt-2 flex items-center space-x-1 text-red-500 space-x-2">
          <FaSignOutAlt /> <span>Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-semibold">
          Welcome back, {userData ? userData.firstName : "Loading..."}!
        </h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4 my-6">
          <div className="bg-red-500 text-white p-5 rounded-lg">
            <h3 className="text-lg">Total Mentees</h3>
            <p className="text-3xl font-bold">1</p>
          </div>
          <div className="bg-purple-500 text-white p-5 rounded-lg">
            <h3 className="text-lg">Total Posts</h3>
            <p className="text-3xl font-bold">5</p>
          </div>
          <div className="bg-blue-500 text-white p-5 rounded-lg">
            <h3 className="text-lg">Total Comments</h3>
            <p className="text-3xl font-bold">3</p>
          </div>
        </div>

        {/* Graph (Placeholder) */}
        <div className="bg-white p-5 rounded-lg shadow-md">
          <h2 className="text-lg font-bold">Activity Chart</h2>
          <div className="h-40 bg-gray-200 mt-3 flex items-center justify-center text-gray-500">
            Chart Placeholder
          </div>
        </div>

        {/* Activities */}
        <div className="mt-6">
          <h2 className="text-xl font-bold">Activities last 7 days</h2>
          <ul className="bg-white p-5 rounded-lg shadow-md">
            <li className="flex justify-between py-2 border-b">LOGIN <span>12th May 2025, 7:05 pm</span></li>
            <li className="flex justify-between py-2 border-b">COMMENT CREATED <span>12th May 2025, 3:27 pm</span></li>
            <li className="flex justify-between py-2">LOGIN <span>12th June 2022, 3:26 pm</span></li>
          </ul>
        </div>
      </main>

      {/* Right Sidebar */}
      <aside className="w-1/4 p-5 bg-white shadow-lg">
        <h2 className="text-lg font-bold">Upcoming Meetings</h2>
        <ul className="mt-3">
          <li className="py-2 border-b">Mintu Moni Kurmi - 13th June 2022, 4:30 pm</li>
          <li className="py-2">Mintu Moni Kurmi - 12th June 2022</li>
        </ul>

        <h2 className="mt-6 text-lg font-bold">Held Meetings</h2>
        <ul className="mt-3">
          <li className="py-2 border-b">Mintu Moni Kurmi - 12th June 2022, 7:06 pm</li>
        </ul>
      </aside>
    </div>
  );
};

export default Dashboard;
