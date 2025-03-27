import React from "react";
import googleLogo from "../assets/googlesignin.jpeg";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
function SignInGoogle()
{
  const navigate = useNavigate();

  function googleLogin() {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();

    signInWithPopup(auth, provider).then(async (result) => {
      console.log(result);

      if (result.user) {
        toast.success("User signed in successfully!", {
          position: "top-center",
          autoClose: 3000,
          theme: "colored",
        });

        h 
      }
    }).catch((error) => {
      console.error("Google Sign-in Error:", error);
      toast.error(error.message, { position: "top-center" });
    });
  }



  return (
    <div className="flex flex-col items-center">
      <p className="continue-p text-gray-600 font-medium my-2">
        -- Or continue with --
      </p>
      <div className="cursor-pointer" style={{display:"flex",justifyContent:"center"}} onClick={googleLogin}>
        <img 
          src={googleLogo} 
          alt="Sign in with Google" 
          width="60%"
          className="hover:opacity-80 transition"
        />
      </div>
    </div>
  );
};

export default SignInGoogle;
