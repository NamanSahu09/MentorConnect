import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase";
import { FaBell } from "react-icons/fa";

const TopNav = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(db, "Users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUserData(userSnap.data());
        }
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="flex items-center justify-between p-4 bg-white shadow-md border-b-2">
      {/* Logo */}
      <h2 className="text-xl font-bold text-gray-700 flex items-center space-x-2">
        <span className="text-blue-500 text-xl font-bold">{`</>`}</span>
        <span>Mentor</span>
      </h2>

      {/* Right Section */}
      <div className="flex items-center space-x-6 ">
        {/* Notification Icon with Badge */}
        <div className="relative">
          <FaBell className="text-gray-600 text-xl cursor-pointer" />
          <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full px-1">2</span>
        </div>

        {/* User Profile */}
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">
            {userData ? userData.firstName.charAt(0).toUpperCase() + userData.lastName.charAt(0).toUpperCase() : "U"}
          </div>
          <div>
            <p className="text-gray-800 font-semibold">{userData ? `${userData.firstName} ${userData.lastName}` : "Loading..."}</p>
            <p className="text-sm text-gray-500">{userData ? userData.email : ""}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopNav;
