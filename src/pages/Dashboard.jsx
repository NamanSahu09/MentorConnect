import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { FaHome, FaUserFriends, FaComments, FaCalendarAlt, FaSignOutAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { auth, db } from "../components/firebase"; 
import { useNavigate, useLocation, Link } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";


import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";

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
  const [lastLogin, setLastLogin] = useState(null);
  const [postCount, setPostCount] = useState(0);       // ✅ Corrected
  const [commentCount, setCommentCount] = useState(0); // ✅ Corrected

  const navigate = useNavigate();
  const location = useLocation(); 
  const authInstance = getAuth();

  // ✅ Count fetching inside useEffect
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const postSnapshot = await getDocs(collection(db, "posts"));
        setPostCount(postSnapshot.size);

        const commentSnapshot = await getDocs(collection(db, "comments"));
        setCommentCount(commentSnapshot.size);
      } catch (err) {
        console.error("Error fetching post/comment count:", err);
      }
    };

    fetchCounts();
  }, []);

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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 my-6">
  {/* Total Mentees */}
  <div className="bg-white bg-opacity-70 backdrop-blur-md shadow-xl border border-gray-200 p-6 rounded-2xl flex items-center justify-between transition hover:scale-105">
    <div>
      <h3 className="text-gray-700 font-semibold text-lg">Total Mentees</h3>
      <p className="text-4xl font-bold text-red-500 mt-2">1</p>
    </div>
    <div className="text-red-500 text-5xl">
      👥
    </div>
  </div>

  {/* Total Posts */}
  <div className="bg-white bg-opacity-70 backdrop-blur-md shadow-xl border border-gray-200 p-6 rounded-2xl flex items-center justify-between transition hover:scale-105">
    <div>
      <h3 className="text-gray-700 font-semibold text-lg">Total Posts</h3>
      <p className="text-4xl font-bold text-purple-500 mt-2">{postCount}</p>
    </div>
    <div className="text-purple-500 text-5xl">
      📝
    </div>
  </div>

  {/* Total Comments */}
  <div className="bg-white bg-opacity-70 backdrop-blur-md shadow-xl border border-gray-200 p-6 rounded-2xl flex items-center justify-between transition hover:scale-105">
    <div>
      <h3 className="text-gray-700 font-semibold text-lg">Total Comments</h3>
      <p className="text-4xl font-bold text-blue-500 mt-2">{commentCount}</p>
    </div>
    <div className="text-blue-500 text-5xl">
      💬
    </div>
  </div>
</div>


        {/* Graph (Placeholder) */}
        <div className="bg-white p-5 rounded-lg shadow-md">
  <h2 className="text-lg font-bold mb-4">Activity Chart (Last 7 Days)</h2>
  <ResponsiveContainer width="100%" height={300}>
    <LineChart
      data={[
        { date: 'Apr 25', logins: 5, posts: 3, chats: 12 },
        { date: 'Apr 26', logins: 7, posts: 2, chats: 9 },
        { date: 'Apr 27', logins: 4, posts: 5, chats: 14 },
        { date: 'Apr 28', logins: 6, posts: 1, chats: 11 },
        { date: 'Apr 29', logins: 8, posts: 4, chats: 16 },
        { date: 'Apr 30', logins: 3, posts: 6, chats: 13 },
        { date: 'May 1',  logins: 9, posts: 7, chats: 18 },
      ]}
      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="logins" stroke="#8884d8" name="Logins" />
      <Line type="monotone" dataKey="posts" stroke="#82ca9d" name="Posts" />
      <Line type="monotone" dataKey="chats" stroke="#ff7300" name="Chats" />
    </LineChart>
  </ResponsiveContainer>
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
