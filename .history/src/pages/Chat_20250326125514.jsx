import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { FaHome, FaUserFriends, FaComments, FaCalendarAlt, FaSignOutAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { auth } from "../components/firebase";
import { useNavigate, useLocation, Link } from "react-router-dom";
import TopNav from "../components/TopNav";

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
      if (user) {
        setUser(user);
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
    <>
    <TopNav />

    <div className="flex h-screen bg-gray-100 w-full">

      
      {/* Sidebar */}
      <aside className="w-1/5 min-w-[250px] bg-white p-5 shadow-lg flex flex-col items-start space-y-6">

        <h2 className="text-xl font-bold text-gray-700 flex items-center space-x-2">
          {/* <span className="text-blue-500 text-xl font-bold">{`</>`}</span>
          <span>Mentor</span> */}
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

      {/* Main Chat Section */}
      <main className="flex-1 p-4 flex flex-col">
        <h1 className="text-2xl font-semibold mb-4">Chat Room</h1>
        <div className="flex-1 bg-white rounded-lg shadow-md p-5 overflow-y-auto">
          <p className="text-gray-500 text-center">Chat feature coming soon...</p>
        </div>
        <div className="mt-4 flex">
          <input
            type="text"
            className="flex-1 p-2 border border-gray-300 rounded-lg"
            placeholder="Type your message..."
          /> &nbsp;
          <button className="ml-2 px-14 py-2 bg-blue-500 text-white rounded-lg">Send</button>
        </div>
      </main>
    </div>
    </>
  );
};

export default Chat;
