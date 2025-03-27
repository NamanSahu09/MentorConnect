import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import SignInGoogle from "../components/signInGoogle"; 
import bg from "../assets/login.png"
import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../components/firebase";


//const db = getFirestore();

const SignIn = () => {
  const navigate = useNavigate();
  const auth = getAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      await signInWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
      
      if (user) {
        // Save login timestamp in Firestore
        await setDoc(doc(db, "Users", user.uid), {
          lastLogin: serverTimestamp(),
        }, { merge: true });
  
        console.log("Logged in user:", user);
  
        toast.success("User signed in successfully!", {
          position: "top-center",
          autoClose: 3000,
          theme: "colored",
        });
  
        navigate("/dashboard");
      }
    } catch (err) {
      console.log(err);
      toast.error(err.message, { position: "top-center" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Section */}
      <div className="w-1/2 flex flex-col justify-center items-center p-50">
        <h1 className="text-4xl font-bold">
          <span className="text-blue-500">Mentor</span>
          <span className="text-inherit"> Sign In</span>
        </h1>
        <img src={bg} alt="Sign In" className="w-80 mt-8" />
      </div>

      {/* Right Section */}
      <div className="w-1/2 bg-gray-800 flex flex-col justify-center items-center text-white p-50">
        <div className="bg-gray-900 p-10 rounded-2xl shadow-lg w-96">
          <h2 className="text-3xl font-semibold text-center text-blue-400 mb-6">Sign In</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center text-white">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
                className="mr-2 cursor-pointer"
              />
              <span className="text-gray-300">&nbsp;Show password</span>
            </div>

            <button
              type="submit"
              className={`w-full p-3 mt-3 rounded-lg font-semibold bg-blue-500 hover:bg-blue-500 transition ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          {/* Google Sign-In Component */}
          <div className="mt-4">
            <SignInGoogle />
          </div>

          <p className="mt-4 text-center text-gray-300">
            Don't have an account?{" "}
            <span
              className="text-blue-400 cursor-pointer hover:underline"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
