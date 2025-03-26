import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaHome, FaUserFriends, FaComments, FaCalendarAlt, FaSignOutAlt } from "react-icons/fa";

const navItems = [
  { name: "Home", path: "/dashboard", icon: <FaHome /> },
  { name: "Post", path: "/post", icon: <FaUserFriends /> },
  { name: "Meetings", path: "/meetings", icon: <FaCalendarAlt /> },
  { name: "Chat", path: "/chat", icon: <FaComments /> },
  { name: "Profile", path: "/profile", icon: <FaUserFriends /> },
];

const Sidebar = ({ handleLogout }) => {
  const location = useLocation();

  return (
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
        className="w-full flex items-center justify-center space-x-2 text-red-500 px-4 py-2 rounded-lg bg-gray-200 transition-transform duration-300 ease-in-out hover:-translate-y-1 hover:scale-105 hover:bg-indigo-500 shadow-md hover:shadow-lg"
      >
        <FaSignOutAlt /> <span>Logout</span>
      </button>
    </aside>
  );
};

export default Sidebar;
