import React from "react";
import TopNav from "../components/TopNav";
import LeftBar from "../components/LeftBar";
import { getFirestore, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const db = getFirestore();
const auth = getAuth();
const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;

const Payment = () => {
  const handlePayment = async () => {
    const amount = 100 * 100; // ₹100 in paisa

    const options = {
      key: razorpayKey,
      amount: amount,
      currency: "INR",
      name: "MentorConnect Premium",
      description: "Unlock premium mentorship features",
      image: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
      handler: async function (response) {
        console.log("✅ Payment success", response);
        alert("Payment Successful! Payment ID: " + response.razorpay_payment_id);

        try {
          const user = auth.currentUser;
          if (user) {
            const userRef = doc(db, "Users", user.uid);
            await updateDoc(userRef, {
              premium: true,
              paymentId: response.razorpay_payment_id,
              premiumSince: serverTimestamp(),
            });
            console.log("🔥 Premium access granted in Firestore");
          }
        } catch (error) {
          console.error("❌ Firestore update failed:", error);
        }
      },
      prefill: {
        name: "Naman Swastik",
        email: "naman@example.com",
      },
      theme: {
        color: "#6366f1",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <>
      <TopNav />
      <div className="flex bg-gray-100 min-h-[100vh]">
        <div className="w-1/5 bg-white shadow-md flex flex-col h-[100vh]">
          <LeftBar />
        </div>

        <main className="w-4/5 p-6 overflow-y-auto">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Unlock Premium Access
            </h1>
            <p className="text-gray-600 mb-6 text-sm">
              Get direct access to top mentors, 1-on-1 doubt sessions, and personalized support.
            </p>
            <img
              src="https://cdni.iconscout.com/illustration/premium/thumb/online-payment-4818123-4006506.png"
              alt="payment"
              className="w-40 h-40 mx-auto mb-6"
            />
            <button
              onClick={handlePayment}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition"
            >
              Pay ₹100 to Go Premium
            </button>
            <p className="text-xs text-gray-400 mt-4">
              Powered by Razorpay • Test Mode
            </p>
          </div>
        </main>
      </div>
    </>
  );
};

export default Payment;
