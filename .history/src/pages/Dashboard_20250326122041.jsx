import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { auth, db } from "../components/firebase"; 
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/sidebar"; // ✅ Import Sidebar Component

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const [lastLogin, setLastLogin] = useState(null);
  const authInstance = getAuth(); 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(authInstance, async (user) => {
      if (user) {
        try {
          const userRef = doc(db, "Users", user.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            const data = userSnap.data();
            setUserData(data);

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
      <Sidebar handleLogout={handleLogout} />  {/* ✅ Using Sidebar Component */}

      {/* Main Content */}
      <main className="flex-1 p-4">
        <h1 className="text-2xl font-semibold">
          Welcome back, {userData ? userData.firstName : "Loading..."}!
        </h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4 my-6">
          <div className="bg-red-500 text-white p-5 rounded-lg">
            <h3 className="text-lg">Total Mentees</h3>
            <p className="text-3xl font-bold">1</p>
          </div>
          <div className="bg-purple-500 text-white p-5 rounded-lg">
            <h3 className="text-lg">Total Posts</h3>
            <p className="text-3xl font-bold">5</p>
          </div>
          <div className="bg-blue-500 text-white p-5 rounded-lg">
            <h3 className="text-lg">Total Comments</h3>
            <p className="text-3xl font-bold">3</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
