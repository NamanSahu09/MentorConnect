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
        <main className="flex-1 p-4 flex flex-col bg-gray-100 bg-[url('https://www.transparenttextures.com/patterns/asfalt-light.png')] shadow-md">
  <h1 className="text-2xl font-semibold mb-4">Chat Room</h1>
  <div className="flex border border-gray-300 rounded-lg overflow-hidden">
    
    {/* Left Pane - Chat List */}
    <div className="w-1/3 bg-gray-50 p-4 border-r">
      <input
        type="text"
        className="w-full p-2 mb-4 border rounded-lg"
        placeholder="Search chat..."
      />
      <div className="bg-white p-3 rounded-lg shadow mb-2 cursor-pointer flex items-center">
        <FaUser className="text-blue-500 mr-2" />
        <div>
          <p className="font-bold">Student 3</p>
          <p className="text-sm text-gray-500">The question you gave</p>
        </div>
      </div>
    </div>

    {/* Right Pane - Chat Window */}
    <div className="w-2/3 flex flex-col p-4">
      <div className="flex-1 overflow-y-auto bg-white p-4 rounded-lg shadow-md w-3/4 mx-auto">
        
        {/* Student Message */}
        <div className="mb-4 flex items-center space-x-2">
          <img src="https://via.placeholder.com/40" className="w-10 h-10 rounded-full" />
          <div>
            <p className="text-gray-700 font-semibold">Student 3 <span className="text-xs text-gray-400">8:15 PM</span></p>
            <p className="bg-gray-200 p-2 rounded-lg inline-block">Hello sir, I am having doubt in this problem</p>
          </div>
        </div>

        {/* Mentor Reply */}
        <div className="mb-4 flex justify-end items-center space-x-2">
          <div>
            <p className="text-right text-gray-700 font-semibold">You <span className="text-xs text-gray-400">8:16 PM</span></p>
            <p className="bg-blue-500 text-white p-2 rounded-lg inline-block">Ok, tell what is the query.</p>
          </div>
          <img src="https://via.placeholder.com/40" className="w-10 h-10 rounded-full" />
        </div>

      </div>

      {/* Message Input */}
      <div className="mt-4 flex w-3/4 mx-auto">
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
      
    </>
  );
};

export default Chat;
