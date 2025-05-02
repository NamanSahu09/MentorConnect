// Full refactored Chat.jsx with 1-to-1 chat support AND public all-chat feature

import React, { useState, useEffect, useRef } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  getDocs,
} from "firebase/firestore";
import { db } from "../components/firebase";
import {
  FaHome,
  FaUserFriends,
  FaComments,
  FaCalendarAlt,
  FaSignOutAlt,
} from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useLocation, Link } from "react-router-dom";
import TopNav from "../components/TopNav";

const Chat = () => {
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const authInstance = getAuth();

  const [user, setUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [chatId, setChatId] = useState("all_chat");
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // Current user setup
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

  // Fetch all users except current
  useEffect(() => {
    const fetchUsers = async () => {
      const usersSnapshot = await getDocs(collection(db, "Users"));
      const usersList = usersSnapshot.docs
        .map((doc) => ({ uid: doc.id, ...doc.data() }))
        .filter((u) => u.uid !== user?.uid);
      setAllUsers(usersList);
    };
    if (user) fetchUsers();
  }, [user]);

  // Set chat ID
  useEffect(() => {
    if (selectedUser && user) {
      const id =
        user.uid < selectedUser.uid
          ? `${user.uid}_${selectedUser.uid}`
          : `${selectedUser.uid}_${user.uid}`;
      setChatId(id);
    } else {
      setChatId("all_chat");
    }
  }, [selectedUser, user]);

  // Fetch chat messages
  useEffect(() => {
    if (!chatId) return;
    const q = query(collection(db, "messages", chatId, "chat"), orderBy("timestamp"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [chatId]);

  const sendMessage = async () => {
    if (newMessage.trim() === "") return;
    try {
      await addDoc(collection(db, "messages", chatId, "chat"), {
        text: newMessage,
        sender: user?.uid,
        senderName: user?.displayName,
        timestamp: serverTimestamp(),
      });
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar Navigation */}
        <aside className="w-1/5 min-w-[250px] bg-white p-5 shadow-lg flex flex-col items-start space-y-6">
          <nav className="w-full space-y-4">
            {["Home", "Post", "Meetings", "Chat", "Profile"].map((name, index) => (
              <Link
                key={name}
                to={name === "Home" ? "/dashboard" : `/${name.toLowerCase()}`}
                className={`flex items-center space-x-2 w-full px-3 py-2 rounded-lg transition duration-300 ${
                  location.pathname ===
                  (name === "Home" ? "/dashboard" : `/${name.toLowerCase()}`)
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

        {/* Chat Panel */}
        <main className="flex-1 p-4 flex flex-col bg-gray-100 shadow-md">
          <h1 className="text-2xl font-semibold mb-4">Chat Room</h1>
          <div className="flex border border-gray-300 rounded-lg overflow-hidden h-full">
            {/* User List */}
            <div className="w-1/3 bg-gray-50 p-4 border-r overflow-y-auto">
              <input
                type="text"
                className="w-full p-2 mb-4 border rounded-lg"
                placeholder="Search users..."
              />
              <div
                onClick={() => setSelectedUser(null)}
                className={`p-2 cursor-pointer rounded-md mb-2 ${!selectedUser ? "bg-blue-100 font-bold" : "hover:bg-gray-200"}`}
              >
                🌍 All Chat
              </div>
              {allUsers.map((u) => (
                <div
                  key={u.uid}
                  onClick={() => setSelectedUser(u)}
                  className={`p-2 cursor-pointer rounded-md mb-2 ${
                    selectedUser?.uid === u.uid
                      ? "bg-blue-100 font-bold"
                      : "hover:bg-gray-200"
                  }`}
                >
                  {u.firstName + " " + u.lastName}
                </div>
              ))}
            </div>

            {/* Chat Box */}
            <div className="w-2/3 flex flex-col p-4">
              <div className="flex-1 overflow-y-auto bg-white p-4 rounded-lg shadow-md">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`mb-2 flex ${msg.sender === user?.uid ? "justify-end" : "justify-start"} items-center`}
                  >
                    <div
                      className={`px-3 py-2 rounded-md inline-block max-w-sm text-sm shadow-md ${msg.sender === user?.uid ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}
                    >
                      <p className="text-xs font-semibold">
                        {msg.senderName || "User"} <span className="text-[10px] text-gray-500">{msg.timestamp?.seconds ? new Date(msg.timestamp.seconds * 1000).toLocaleTimeString() : "Just now"}</span>
                      </p>
                      <p className="mt-1">{msg.text}</p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef}></div>
              </div>

              <div className="mt-4 flex">
                <input
                  type="text"
                  className="flex-1 p-2 border border-gray-300 rounded-lg"
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                />
                <button
                  className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
                  onClick={sendMessage}
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Chat;
