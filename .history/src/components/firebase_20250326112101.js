// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyAz95w6pfWS2GLGTEtDjd9TUxxgGexA3xk",
  authDomain: "mentor-login-auth.firebaseapp.com",
  projectId: "mentor-login-auth",
  storageBucket: "mentor-login-auth.firebasestorage.app",
  messagingSenderId: "755291833002",
  appId: "1:755291833002:web:327fb4c1c72a5c848ec6d3",
  measurementId: "G-L32EEMZPZ7"
};

// Initialize Firebase
const Bpp = initializeApp(firebaseConfig);


export const auth=getAuth();
export const db = getFirestore(Bpp);
export default Bpp;