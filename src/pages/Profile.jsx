// Mentor Profile Page with Detailed Academic Background and Photo Upload
import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  FaHome,
  FaUserFriends,
  FaComments,
  FaCalendarAlt,
  FaSignOutAlt,
} from "react-icons/fa";
import { auth, db } from "../components/firebase";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { toast } from "react-toastify";

const navItems = [
  { name: "Home", path: "/dashboard", icon: <FaHome /> },
  { name: "Post", path: "/post", icon: <FaUserFriends /> },
  { name: "Meetings", path: "/meetings", icon: <FaCalendarAlt /> },
  { name: "Chat", path: "/chat", icon: <FaComments /> },
  { name: "Profile", path: "/profile", icon: <FaUserFriends /> },
];

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [photoURL, setPhotoURL] = useState("");
  const authInstance = getAuth();
  const storage = getStorage();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(authInstance, async (user) => {
      if (user) {
        try {
          const userRef = doc(db, "Users", user.uid);
          const userSnap = await getDoc(userRef);
  
          if (userSnap.exists()) {
            const data = userSnap.data();
            setUserData(data);
            setFormData(data);
            setPhotoURL(data.photoURL || "");
          } else {
            // 👇 DEFAULT USER FILL HO JAYEGA FIRESTORE ME
            const defaultData = {
              email: user.email,
              firstName: user.displayName?.split(" ")[0] || "",
              lastName: user.displayName?.split(" ")[1] || "",
              role: "Mentor",
              photoURL: user.photoURL || "",
            };
            await setDoc(userRef, defaultData);
            setUserData(defaultData);
            setFormData(defaultData);
            setPhotoURL(defaultData.photoURL || "");
          }
        } catch (err) {
          toast.error("Failed to load profile data");
          console.error(err);
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
      toast.info("Logged out successfully!");
      navigate("/signin");
    } catch {
      toast.error("Logout failed!");
    }
  };

  const handleUpdate = async () => {
    try {
      const user = auth.currentUser;
      const ref = doc(db, "Users", user.uid);
      const dataToSave = { ...formData, photoURL };
      await setDoc(ref, dataToSave, { merge: true });
      toast.success("Profile updated!");
      setEditMode(false);
      const updatedSnap = await getDoc(ref);
      if (updatedSnap.exists()) setUserData(updatedSnap.data());
    } catch {
      toast.error("Update failed");
    }
  };

// const handleLogout1 = async () => {
//   try {
//     const user1 = auth.currentUser;
//     const ref1 = doc(db, "Users" , user.uid);
//     const dataToSave1 = { ...formData, photoURL};

//   }
//   catch{
//     toast.error("Update Failed");
//   }
// }

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const user = auth.currentUser;
    const storageRef = ref(storage, `profilePhotos/${user.uid}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    setPhotoURL(downloadURL);
    setFormData((prev) => ({ ...prev, photoURL: downloadURL }));
    toast.success("Photo uploaded!");
  };

  const renderInput = (label, field, type = "text") => (
    <div className="flex flex-col">
      <label className="font-semibold mb-1">{label}</label>
      <input
        type={type}
        className="border p-2 rounded"
        value={formData[field] || ""}
        onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
      />
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-100">

      <aside className="w-1/5 bg-white p-5 shadow-lg flex flex-col items-start space-y-6">
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

      <main className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-6">Mentor Profile</h1>

        {!userData ? (
          <p>Loading...</p>
        ) : !editMode ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white shadow rounded-lg p-4 flex flex-col items-center">
              <img
                src={photoURL || `https://ui-avatars.com/api/?name=${userData.firstName || "M"}&background=0D8ABC&color=fff`}
                alt="Profile"
                className="w-24 h-24 rounded-full mb-4"
              />
              <h2 className="text-xl font-semibold">
                {`${userData.firstName || ""} ${userData.middleName || ""} ${userData.lastName || ""}`}
              </h2>
              <p className="text-sm text-gray-500">{userData.email || "—"}</p>
            </div>

            <div className="bg-white shadow rounded-lg p-4">
              <h3 className="font-bold mb-2">Academic Background 📘</h3>
              <p><strong>Department:</strong> {userData.department || "—"}</p>
              <p><strong>Programme:</strong> {userData.programme || "—"}</p>
              <p><strong>Qualification:</strong> {userData.qualification || "—"}</p>
              <p><strong>University/College:</strong> {userData.educationInstitute || "—"}</p>
              <p><strong>Experience:</strong> {userData.experience || "—"}</p>
              <p><strong>Specialization:</strong> {userData.specialization || "—"}</p>
            </div>

            <div className="bg-white shadow rounded-lg p-4">
              <h3 className="font-bold mb-2">Contact Details 📞</h3>
              <p><strong>Email ID:</strong> {userData.email || "—"}</p>
              <p><strong>Phone Number:</strong> {userData.phone || "—"}</p>
              <p><strong>Address:</strong> {userData.address || "—"}</p>
            </div>

            <div className="text-right col-span-3">
              <button
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                onClick={() => setEditMode(true)}
              >
                Update Information
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white p-6 rounded shadow-md">
            <h2 className="text-xl font-bold mb-4">Edit Mentor Profile</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {renderInput("First Name", "firstName")}
              {renderInput("Middle Name", "middleName")}
              {renderInput("Last Name", "lastName")}
              {renderInput("Email", "email")}
              {renderInput("Phone Number", "phone")}
              {renderInput("Address", "address")}
              {renderInput("Department", "department")}
              {renderInput("Programme", "programme")}
              {renderInput("Qualification", "qualification")}
              {renderInput("University/Institute", "educationInstitute")}
              {renderInput("Experience (Years)", "experience")}
              {renderInput("Specialization", "specialization")}
              {renderInput("Hobbies", "hobbies")}
              
              <div className="flex flex-col">
                <label className="font-semibold mb-1">Profile Photo</label>
                <input type="file" accept="image/*" onChange={handlePhotoUpload} />
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <button onClick={() => setEditMode(false)} className="bg-gray-400 text-white px-4 py-2 rounded">
                Cancel
              </button>
              <button onClick={handleUpdate} className="bg-green-600 text-white px-4 py-2 rounded">
                Save
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Profile;