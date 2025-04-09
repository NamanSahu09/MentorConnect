import React from "react";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FaHome, FaUserFriends, FaCalendarAlt, FaComments, FaSignOutAlt } from "react-icons/fa";

const authInstance = getAuth();

// Navigation items
const navItems = [
  { name: "Home", path: "/dashboard", icon: <FaHome /> },
  { name: "Post", path: "/post", icon: <FaUserFriends /> },
  { name: "Meetings", path: "/meetings", icon: <FaCalendarAlt /> },
  { name: "Chat", path: "/chat", icon: <FaComments /> },
  { name: "Profile", path: "/profile", icon: <FaUserFriends /> },
];

const LeftBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

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
    <aside className="w-full md:w-1/4 lg:w-1/5 p-4 space-y-6 bg-white shadow-lg rounded-xl">
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
        className="w-full flex items-center justify-center space-x-2 text-red-500 px-4 py-2 rounded-lg bg-gray-200 transition-transform duration-300 ease-in-out hover:-translate-y-1 hover:scale-105 hover:bg-indigo-500 hover:text-white shadow-md"
      >
        <FaSignOutAlt /> <span>Logout</span>
      </button>
    </aside>
  );
};

export default LeftBar;
