import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { FaHome, FaUserFriends, FaComments, FaCalendarAlt, FaSignOutAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { auth } from "../components/firebase";
import { useNavigate, useLocation, Link } from "react-router-dom";
import TopNav from "../components/TopNav";

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
          {/* <h2 className="text-xl font-bold text-gray-700 flex items-center space-x-2">Mentor</h2> */}
          <nav className="w-full space-y-4">
            {["Home", "Post", "Meetings", "Chat", "Profile"].map((name, index) => (
              <Link
                key={name}
                to={`/${name.toLowerCase()}`}
                className={`flex items-center space-x-2 w-full px-3 py-2 rounded-lg transition duration-300 ${
                  location.pathname === `/${name.toLowerCase()}`
                    ? "bg-blue-500 text-white font-bold shadow-lg"
                    : "text-gray-600 hover:text-blue-500"
                }`}
              >
                {index === 0 ? <FaHome /> : index === 1 ? <FaUserFriends /> : index === 2 ? <FaCalendarAlt /> : index === 3 ? <FaComments /> : <FaUserFriends />}
                <span>{name}</span>
              </Link>
            ))}
          </nav>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 text-red-500 px-4 py-2 rounded-lg bg-gray-200 hover:bg-red-500 hover:text-white shadow-md"
          >
            <FaSignOutAlt /> <span>Logout</span>
          </button>
        </aside>
        
        {/* Main Chat Section */}
        <main className="flex-1 p-4 flex flex-col bg-white shadow-md">
          <h1 className="text-2xl font-semibold mb-4">Chat Room</h1>
          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            <div className="w-full bg-gray-100 p-4 border-r">
              <input
                type="text"
                className="w-full p-2 mb-4 border rounded-lg"
                placeholder="Search chat..."
              />
              <div className="bg-white p-3 rounded-lg shadow mb-2 cursor-pointer">
                <p className="font-bold">Student 3</p>
                <p className="text-sm text-gray-500">The question you gave</p>
              </div>
            </div>
            <div className="w-full flex flex-col p-4">
              <div className="flex-1 overflow-y-auto bg-gray-50 p-3 rounded-lg">
                <div className="mb-4 text-left">
                  <p className="bg-gray-200 p-2 rounded-lg inline-block">Hello sir, this is your mentor</p>
                </div>
                <div className="mb-4 text-right">
                  <p className="bg-blue-500 text-white p-2 rounded-lg inline-block">Yes sir, I am fine. How about you?</p>
                </div>
              </div>
              <div className="mt-4 flex">
                <input
                  type="text"
                  className="flex-1 p-2 border border-gray-300 rounded-lg"
                  placeholder="Type your message..."
                />
                <button className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg">Send</button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Chat;
