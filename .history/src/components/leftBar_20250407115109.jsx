import React, { useEffect, useState } from "react";

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
};



const leftBar = () => {
  return (
    <>
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

    
    </>
  );
};

export default leftBar