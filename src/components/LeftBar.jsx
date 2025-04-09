import React from "react";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FaHome, FaUserFriends, FaCalendarAlt, FaComments, FaSignOutAlt } from "react-icons/fa";

const authInstance = getAuth();

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
    <aside className="h-full flex flex-col justify-between bg-white shadow-lg p-4 w-full">

    
      
  {/* Navigation */}
  <nav className="space-y-4 mb-6">
    {navItems.map((item) => (
      <Link
        key={item.name}
        to={item.path}
        className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition duration-300 ${
          location.pathname === item.path
            ? "bg-blue-500 text-white font-bold shadow-lg"
            : "text-blue-600 hover:text-blue-800"
        }`}
      >
        {item.icon} <span>{item.name}</span>
      </Link>
    ))}
    <div className="pt-4 border-t">
    <button
        onClick={handleLogout}
        className="w-full flex items-center justify-center space-x-2 text-red-500 px-4 py-2 rounded-lg bg-gray-200 transition-transform duration-300 ease-in-out hover:-translate-y-1 hover:scale-105 hover:bg-indigo-500 shadow-md hover:shadow-lg bg-"
      >
        <FaSignOutAlt /> <span>Logout</span>
      </button>
  </div>
  </nav>

  {/* Logout Button */}
  
</aside>


  );
};

export default LeftBar;
