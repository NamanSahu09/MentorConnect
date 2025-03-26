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
  const [lastLogin, setLastLogin] = useState(null);

  const authInstance = getAuth(); 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(authInstance, async (user) => {
      if (user) {
        try {
          const userRef = doc(db, "Users", user.uid);
          const userSnap = await getDoc(userRef);
  
          if (userSnap.exists()) {
            const data = userSnap.data();
            setUserData(data);
  
            // Convert Firestore timestamp to readable format
            if (data.lastLogin) {
              setLastLogin(data.lastLogin.toDate().toLocaleString());
            }
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        navigate("/signin");
      }
    });
  
    return () => unsubscribe();
  }, []);
  


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
      <aside className="w-1/5 bg-white p-5 shadow-lg flex flex-col items-start space-y-6">
  {/* Logo & Title */}
  <h2 className="text-xl font-bold text-gray-700 flex items-center space-x-2">
    <span className="text-blue-500 text-xl font-bold">{`</>`}</span> 
    <span>Mentor</span>
  </h2>

  {/* Navigation */}
  <nav className="w-full space-y-4">
    {navItems.map((item) => (
      <Link
        key={item.name}
        to={item.path}
        className={`flex items-center space-x-2 w-full px-3 py-2 rounded-lg transition duration-300 ${
          location.pathname === item.path
            ? "bg-blue-500 text-white font-bold shadow-lg"
            : "text-gray-600 hover:text-blue-500"
        }`}
      >
        {item.icon} <span>{item.name}</span>
      </Link>
    ))}
  </nav>

  {/* Logout Button */}
  <button
    onClick={handleLogout}
    className="w-full flex items-center justify-center space-x-2 text-red-500 px-4 py-2 rounded-lg bg-gray-200 transition-transform duration-300 ease-in-out hover:-translate-y-1 hover:scale-105 hover:bg-indigo-500 shadow-md hover:shadow-lg bg-"
  >
    <FaSignOutAlt /> <span>Logout</span>
  </button>
</aside>

      {/* Main Content */}
      <main className="flex-1 p-4">
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
          <ul className="mt-4 bg-white p-5 rounded-lg shadow-md">
    {lastLogin ? (
      <li className="flex justify-between py-2 border-b">
        LOGIN <span>{lastLogin}</span>
      </li>
    ) : (
      <li className="text-gray-500">No login record found</li>
    )}
    <li className="flex justify-between py-2 border-b">
      COMMENT CREATED <span>12th May 2025, 3:27 pm</span>
    </li>
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
