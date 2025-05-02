import React, { useEffect, useState } from "react";
import { CalendarIcon } from "lucide-react";
import { FaHome, FaUserFriends, FaComments, FaCalendarAlt, FaSignOutAlt } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { db, auth } from "../components/firebase";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const navItems = [
  { name: "Home", path: "/dashboard", icon: <FaHome /> },
  { name: "Post", path: "/post", icon: <FaUserFriends /> },
  { name: "Meetings", path: "/meetings", icon: <FaCalendarAlt /> },
  { name: "Chat", path: "/chat", icon: <FaComments /> },
  { name: "Profile", path: "/profile", icon: <FaUserFriends /> },
];

export default function MeetingsPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [datetime, setDatetime] = useState("");
  const [meetings, setMeetings] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) setUser(u);
      else navigate("/signin");
    });

    const q = query(collection(db, "meetings"), orderBy("createdAt", "desc"));
    const unsubMeetings = onSnapshot(q, (snap) => {
      const results = [];
      snap.forEach((doc) => results.push({ id: doc.id, ...doc.data() }));
      setMeetings(results);
    });

    return () => {
      unsub();
      unsubMeetings();
    };
  }, []);

  const handleSchedule = async () => {
    if (!description || !link || !datetime || !user) return;
    await addDoc(collection(db, "meetings"), {
      description,
      link,
      datetime,
      createdAt: serverTimestamp(),
      createdBy: user.displayName || user.email,
    });
    setDescription("");
    setLink("");
    setDatetime("");
  };

  const handleLogout = () => {
    navigate("/signin");
  };

  return (
    <div className="flex h-screen font-sans bg-gray-50">
      {/* Sidebar */}
      <aside className="w-1/4 bg-white p-5 shadow-lg flex flex-col items-start space-y-6">
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
          className="w-full flex items-center justify-center space-x-2 text-red-500 px-4 py-2 rounded-lg bg-black hover:bg-indigo-500 hover:text-white transition"
        >
          <FaSignOutAlt /> <span>Logout</span>
        </button>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Meetings List (60%) */}
        <div className="w-[60%] p-6 overflow-y-auto">
          <h2 className="text-lg font-semibold mb-4">All meetings</h2>
          {meetings.map((m) => (
            <div key={m.id} className="bg-white rounded shadow p-4 mb-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold">
                    {m.createdBy?.[0]?.toUpperCase() || "M"}
                  </div>
                  <div>
                    <p className="font-semibold">{m.createdBy || "Anonymous"}</p>
                    <p className="text-sm text-gray-500">
                      {m.createdAt?.seconds
                        ? new Date(m.createdAt.seconds * 1000).toLocaleDateString()
                        : "—"}
                    </p>
                  </div>
                </div>
              </div>
              <p className="mt-3">{m.description}</p>
              <a href={m.link} target="_blank" rel="noreferrer" className="text-blue-600 text-sm">
                {m.link}
              </a>
              <div className="mt-2">
                <span className="text-xs text-blue-600 bg-blue-100 rounded-full px-3 py-1">CSM20040</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Meeting on: {new Date(m.datetime).toLocaleString()}
              </p>
            </div>
          ))}
        </div>

        {/* Schedule Meeting (40%) */}
        <div className="w-[40%] p-6 border-l bg-white h-full">
          <h2 className="text-lg font-semibold mb-4">Schedule a meeting</h2>
          <textarea
            placeholder="Meeting description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="url"
            placeholder="Meeting link"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="w-full px-3 py-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <div className="flex items-center gap-2 mb-4">
  <div className="relative w-full">
    <input
      type="datetime-local"
      value={datetime}
      onChange={(e) => setDatetime(e.target.value)}
      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10"
    />
    <CalendarIcon className="absolute right-3 top-2.5 h-5 w-5 text-gray-500 pointer-events-none" />
  </div>
</div>
          <button
            onClick={handleSchedule}
            className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded-md"
          >
            Schedule
          </button>
        </div>
      </div>
    </div>
  );
}
