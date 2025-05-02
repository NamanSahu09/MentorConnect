import React, { useEffect, useState } from "react";
import TopNav from "../components/TopNav";
import LeftBar from "../components/LeftBar";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import {
  collection,
  getDocs,
  onSnapshot,
  doc,
  getDoc,
} from "firebase/firestore";
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
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { auth, db } from "../components/firebase";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [lastLogin, setLastLogin] = useState(null);
  const [postCount, setPostCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [lastPostDate, setLastPostDate] = useState("");
  const [activityData, setActivityData] = useState([]);
  const [meetings, setMeetings] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(db, "Users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const data = userSnap.data();
          setUserData(data);
          if (data.lastLogin) {
            setLastLogin(data.lastLogin.toDate().toLocaleString());
          }
        }
      } else {
        navigate("/signin");
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchPostData = async () => {
      const postSnapshot = await getDocs(collection(db, "posts"));
      const postDocs = postSnapshot.docs;
      setPostCount(postDocs.length);

      let latest = null;
      let commentsTotal = 0;
      const activityMap = {};

      for (let docu of postDocs) {
        const data = docu.data();
        const created = data.createdAt?.toDate?.() || new Date(data.createdAt);
        if (created) {
          const dateKey = created.toISOString().split("T")[0];
          activityMap[dateKey] = activityMap[dateKey] || { date: dateKey, posts: 0, comments: 0, logins: 0 };
          activityMap[dateKey].posts += 1;

          if (!latest || created > latest) {
            latest = created;
          }
        }

        const commentSnap = await getDocs(collection(db, "posts", docu.id, "comments"));
        commentsTotal += commentSnap.size;

        commentSnap.forEach((cmt) => {
          const c = cmt.data();
          const commentDate = c.createdAt?.toDate?.() || new Date(c.createdAt);
          const dateKey = commentDate.toISOString().split("T")[0];
          activityMap[dateKey] = activityMap[dateKey] || { date: dateKey, posts: 0, comments: 0, logins: 0 };
          activityMap[dateKey].comments += 1;
        });
      }

      const loginSnapshot = await getDocs(collection(db, "logins"));
      loginSnapshot.forEach((docu) => {
        const data = docu.data();
        const loginDate = data.timestamp?.toDate?.() || new Date(data.timestamp);
        const dateKey = loginDate.toISOString().split("T")[0];
        activityMap[dateKey] = activityMap[dateKey] || { date: dateKey, posts: 0, comments: 0, logins: 0 };
        activityMap[dateKey].logins += 1;
      });

      setCommentCount(commentsTotal);
      if (latest) setLastPostDate(latest.toLocaleString());

      const sortedActivity = Object.values(activityMap).sort((a, b) =>
        a.date.localeCompare(b.date)
      );

      setActivityData(sortedActivity.slice(-7));
    };

    fetchPostData();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "meetings"), (snapshot) => {
      const all = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMeetings(all);
    });

    return () => unsubscribe();
  }, []);

  const upcomingMeetings = meetings.filter((m) => new Date(m.datetime) > new Date());
  const heldMeetings = meetings.filter((m) => new Date(m.datetime) <= new Date());

  return (
    <>
      <TopNav />
      <div className="flex bg-gray-100 min-h-[100vh]">
        <div className="w-1/5 bg-white shadow-md flex flex-col h-[100vh]">
          <LeftBar />
        </div>

        <main className="w-4/5 p-6 overflow-y-auto">
          <h1 className="text-3xl font-semibold text-gray-800 mb-6">
            Welcome, {userData?.firstName || "User"}!
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card label="Total Mentees" value="1" icon="👥" color="red" />
            <Card label="Total Posts" value={postCount} icon="📝" color="purple" />
            <Card label="Total Comments" value={commentCount} icon="💬" color="blue" />
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-lg font-bold mb-2">Activity Chart (Last 7 Days)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="posts" stroke="#7e5bef" />
                <Line type="monotone" dataKey="comments" stroke="#14b8a6" />
                <Line type="monotone" dataKey="logins" stroke="#f97316" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-5 rounded-lg shadow-md mb-8">
            <h2 className="text-lg font-bold mb-2">Recent Activity</h2>
            <ul>
              {lastLogin && <li className="py-2 text-sm border-b">✅ Last Login: {lastLogin}</li>}
              {lastPostDate && <li className="py-2 text-sm border-b">🕒 Last Post Created: {lastPostDate}</li>}
            </ul>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <MeetingCard title="Upcoming Meetings" meetings={upcomingMeetings} />
            <MeetingCard title="Held Meetings" meetings={heldMeetings} />
          </div>
        </main>
      </div>
    </>
  );
};

const Card = ({ label, value, icon, color }) => (
  <div className={`bg-white border-t-4 border-${color}-400 p-5 rounded-lg shadow-md`}>
    <div className="flex justify-between items-center">
      <div>
        <h3 className="text-gray-700 font-semibold">{label}</h3>
        <p className={`text-3xl font-bold text-${color}-500 mt-1`}>{value}</p>
      </div>
      <div className={`text-${color}-400 text-4xl`}>{icon}</div>
    </div>
  </div>
);

const MeetingCard = ({ title, meetings }) => (
  <div className="bg-white p-5 rounded-lg shadow-md">
    <h2 className="text-lg font-bold mb-3">{title}</h2>
    <ul className="space-y-2 text-sm text-gray-700">
      {meetings.length > 0 ? (
        meetings.map((m, i) => (
          <li key={i} className="border-b pb-2">
            <strong>{m.description}</strong><br />
            {new Date(m.datetime).toLocaleString()}<br />
            <a
              href={m.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              Join Meeting
            </a>
          </li>
        ))
      ) : (
        <li className="text-gray-400">No meetings found</li>
      )}
    </ul>
  </div>
);

export default Dashboard;
  