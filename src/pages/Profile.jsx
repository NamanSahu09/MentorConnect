import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { FaHome, FaUserFriends, FaComments, FaCalendarAlt, FaSignOutAlt } from "react-icons/fa";
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
  const authInstance = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(authInstance, async (user) => {
      if (user) {
        try {
          const userRef = doc(db, "Users", user.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            setUserData(userSnap.data());
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

  // Hardcoded data until Firebase integration is finalized
  const student = {
    profilePhoto: "https://ui-avatars.com/api/?name=Student+3&background=0D8ABC&color=fff",
    name: "Student 3",
    email: "csm20040@tezu.ac.in",
    academic: {
      department: "Computer Science & Engineering",
      programme: "MCA",
      semester: "4th semester",
      enrollmentNo: "CSM20040",
      mentoredBy: "Mintu Kurmi",
      enrollmentYear: "2020"
    },
    contact: {
      email: "csm20040@tezu.ac.in",
      phone: "86576485965",
      address: "Titabor, Jorhat, Assam"
    },
    personal: {
      firstName: "Student",
      middleName: "",
      lastName: "3",
      bloodGroup: "B+ (positive)",
      homePlace: "Titabor",
      hobbies: "Singing, Stand up comedian",
      guardianName: "Mintu Kurmi",
      guardianPhone: "7865796548",
      guardianAddress: "Jorhat",
      familyDetails: "mon, dad, other - 3"
    },
    hostel: {
      isHostelBoarder: true,
      hostelName: "KMH",
      wardenName: "Deepak Kumar",
      wardenPhone: "7856485695",
      assistantWardenName: "Atul Borah",
      assistantPhone: "8965745632"
    },
    residenceContact: {
      responsiblePerson: "",
      contactNumber: "",
      address: ""
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-1/5 bg-white p-5 shadow-lg flex flex-col items-start space-y-6">
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
          className="w-full flex items-center justify-center space-x-2 text-red-500 px-4 py-2 rounded-lg bg-gray-200 transition-transform duration-300 ease-in-out hover:-translate-y-1 hover:scale-105 hover:bg-indigo-500 shadow-md hover:shadow-lg"
        >
          <FaSignOutAlt /> <span>Logout</span>
        </button>
      </aside>

      {/* Main Profile Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-6">Student Profile</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Photo */}
          <div className="bg-white shadow rounded-lg p-4 flex flex-col items-center">
            <img src={student.profilePhoto} alt="Profile" className="w-24 h-24 rounded-full mb-4" />
            <h2 className="text-xl font-semibold">{student.name}</h2>
            <p className="text-sm text-gray-500">{student.email}</p>
            <div className="mt-4 flex gap-3">
              <button className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">Change</button>
              <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Remove</button>
            </div>
          </div>

          {/* Academic Info */}
          <div className="bg-white shadow rounded-lg p-4">
            <h3 className="font-bold mb-2">Academic Information 🎓</h3>
            <p><strong>Department:</strong> {student.academic.department}</p>
            <p><strong>Programme:</strong> {student.academic.programme}</p>
            <p><strong>Semester:</strong> {student.academic.semester}</p>
            <p><strong>Enrollment Number:</strong> {student.academic.enrollmentNo}</p>
            <p><strong>Mentored By:</strong> {student.academic.mentoredBy}</p>
            <p><strong>Enrollment Year:</strong> {student.academic.enrollmentYear}</p>
          </div>

          {/* Contact Details */}
          <div className="bg-white shadow rounded-lg p-4">
            <h3 className="font-bold mb-2">Contact Details 📞</h3>
            <p><strong>Email ID:</strong> {student.contact.email}</p>
            <p><strong>Phone Number:</strong> {student.contact.phone}</p>
            <p><strong>Address:</strong> {student.contact.address}</p>
          </div>
        </div>

        {/* Personal Info */}
        <div className="mt-6 bg-white shadow rounded-lg p-4">
          <h3 className="font-bold mb-2">Personal Information 👤</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <p><strong>First Name:</strong> {student.personal.firstName}</p>
            <p><strong>Middle Name:</strong> {student.personal.middleName || "-"}</p>
            <p><strong>Last Name:</strong> {student.personal.lastName}</p>
            <p><strong>Blood Group:</strong> {student.personal.bloodGroup}</p>
            <p><strong>Home Place:</strong> {student.personal.homePlace}</p>
            <p><strong>Hobbies:</strong> {student.personal.hobbies}</p>
            <p><strong>Guardian Name:</strong> {student.personal.guardianName}</p>
            <p><strong>Guardian Ph No.:</strong> {student.personal.guardianPhone}</p>
            <p><strong>Guardian Address:</strong> {student.personal.guardianAddress}</p>
            <p><strong>Family Details:</strong> {student.personal.familyDetails}</p>
          </div>
        </div>

        {/* Hostel Info */}
        <div className="mt-6 bg-white shadow rounded-lg p-4">
          <h3 className="font-bold mb-2">Hostel Details 🏨</h3>
          {student.hostel.isHostelBoarder ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <p><strong>Hostel Name:</strong> {student.hostel.hostelName}</p>
              <p><strong>Warden’s Name:</strong> {student.hostel.wardenName}</p>
              <p><strong>Warden Ph No.:</strong> {student.hostel.wardenPhone}</p>
              <p><strong>Asst Warden’s Name:</strong> {student.hostel.assistantWardenName}</p>
              <p><strong>Ph No.:</strong> {student.hostel.assistantPhone}</p>
            </div>
          ) : (
            <div>
              <p><strong>Responsible Contact Person:</strong> {student.residenceContact.responsiblePerson || "N/A"}</p>
              <p><strong>Contact No.:</strong> {student.residenceContact.contactNumber || "N/A"}</p>
              <p><strong>Residence Address:</strong> {student.residenceContact.address || "N/A"}</p>
            </div>
          )}
        </div>

        <div className="text-right mt-6">
          <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">Update Information</button>
        </div>
      </main>
    </div>
  );
};

export default Profile;
