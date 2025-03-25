import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { FaHome, FaUserFriends, FaComments, FaCalendarAlt, FaSignOutAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { auth, db } from "../components/firebase"; 
import { useNavigate, useLocation, Link } from "react-router-dom";



// Navigation items

const navItems = [
  { name: "Home", path: "/dashboard", icon: <FaHome /> },
  { name: "Post", path: "/post", icon: <FaUserFriends /> },
  { name: "Meetings", path: "/meetings", icon: <FaCalendarAlt /> },
  { name: "Chat", path: "/chat", icon: <FaComments /> },
  { name: "Profile", path: "/profile", icon: <FaUserFriends /> },
];

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const location = useLocation(); 

  const authInstance = getAuth(); 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(authInstance, async (user) => {
      if (user) {
        try {
          const userRef = doc(db, "Users", user.uid); 
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) 
            {
            const data = userSnap.data();
            setUserData(data);

         
            const hasLoggedInBefore = localStorage.getItem("hasLoggedIn");
            if (!hasLoggedInBefore) {
              toast.success(`Welcome, ${data.firstName}!`, {
                position: "top-center",
                autoClose: 3000,
                theme: "colored",
              });
              localStorage.setItem("hasLoggedIn", "true"); 
            }
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        localStorage.removeItem("hasLoggedIn"); 
        navigate("/signin");
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
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition duration-300 ${
                location.pathname === item.path
                  ? "bg-blue-500 text-white font-bold shadow-lg"
                  : "text-gray-600 hover:text-blue-500"
              }`}
            >
              {item.icon} <span>{item.name}</span>
            </Link>
          ))}
        </nav>

       <button
  onClick={handleLogout}
  className="mt-4 mr-2 flex items-center space-x-2 text-red-500 px-4 py-2 rounded-lg bg-gray-200 transition-transform duration-300 ease-in-out hover:-translate-y-1 hover:scale-105 hover:bg-indigo-500  shadow-md hover:shadow-lg">
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
          <li className="py-2 border-b">Mintu Moni Kurmi - 13th Feb 2025, 4:30 pm</li>
          <li className="py-2">Mintu Moni Kurmi - 12th Feb 2025</li>
        </ul>

        <h2 className="mt-6 text-lg font-bold">Held Meetings</h2>
        <ul className="mt-3">
          <li className="py-2 border-b">Mintu Moni Kurmi - 12th Feb 2025, 7:06 pm</li>
        </ul>
      </aside>
    </div>
  );
};

export default Dashboard;
