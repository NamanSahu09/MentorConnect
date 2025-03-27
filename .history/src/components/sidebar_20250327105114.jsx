import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { FaHome, FaUserFriends, FaComments, FaCalendarAlt, FaSignOutAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { auth } from "../components/firebase";
import { useNavigate, useLocation, Link } from "react-router-dom";

const navItems = [
  { name: "Home", path: "/dashboard", icon: <FaHome /> },
  { name: "Post", path: "/post", icon: <FaUserFriends /> },
  { name: "Meetings", path: "/meetings", icon: <FaCalendarAlt /> },
  { name: "Chat", path: "/chat", icon: <FaComments /> },
  { name: "Profile", path: "/profile", icon: <FaUserFriends /> },
];

const Chat = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const authInstance = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(authInstance, (user) => {
      if (user) 
        {
        setUser(user);
        } 
      else {
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
    <>
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-50% bg-white p-5 shadow-lg flex flex-col items-start space-y-6">
        <h2 className="text-xl font-bold text-gray-700 flex items-center space-x-2">
          <span className="text-blue-500 text-xl font-bold">{`</>`}</span>
          <span>Mentor</span>
        </h2>
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
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-2 text-red-500 px-4 py-2 rounded-lg bg-gray-200 transition-transform duration-300 ease-in-out hover:-translate-y-1 hover:scale-105 hover:bg-indigo-500 shadow-md hover:shadow-lg"
        >
          <FaSignOutAlt /> <span>Logout</span>
        </button>
      </aside>

      </>
    );
  };

export default sidebar;