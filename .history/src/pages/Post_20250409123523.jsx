import React, { useEffect, useState } from "react";
import TopNav from "../components/TopNav";
import LeftBar from "../components/leftBar";
import { db, auth } from "../components/firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
  doc,
  updateDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const Post = () => {
  const [posts, setPosts] = useState([]);
  const [commentInput, setCommentInput] = useState("");
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [user, setUser] = useState(null);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    onAuthStateChanged(auth, (u) => {
      if (u) setUser(u);
    });

    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (selectedPostId) {
      const q = query(collection(db, "posts", selectedPostId, "comments"), orderBy("createdAt", "asc"));
      return onSnapshot(q, (snapshot) => {
        setComments(snapshot.docs.map(doc => doc.data()));
      });
    }
  }, [selectedPostId]);

  const handleCommentSubmit = async () => {
    if (!user || !commentInput.trim()) return;
  
    if (!selectedPostId) {
      alert("⚠️ Please select a post to comment on.");
      return;
    }
  
    try {
      await addDoc(collection(db, "posts", selectedPostId, "comments"), {
        text: commentInput,
        author: user.displayName || "Anonymous",
        createdAt: serverTimestamp(),
      });
  
      setCommentInput("");
    } catch (error) {
      console.error("🔥 Firestore comment error:", error);
    }
  };
  

  return (
    <>
      <TopNav />
      <div className="flex bg-gray-100 min-h-[100vh]">

        {/* Sidebar */}
        <div className="w-1/5 bg-white shadow-md flex flex-col h-[100vh]">
          <LeftBar />
        </div>

        {/* Middle - Posts */}
        <div className="w-3/5 p-6 space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="bg-white p-4 rounded-lg shadow">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-bold text-gray-700">{post.author || "Unknown"}</h4>
                <p className="text-xs text-gray-500">
                  {post.createdAt?.toDate().toLocaleString() || "Just now"}
                </p>
              </div>
              <p className="text-gray-800 mb-2">{post.description}</p>
              <div className="text-sm text-gray-500 flex gap-4">
                <button
                  onClick={() => setSelectedPostId(post.id)}
                  className="text-blue-500 font-semibold"
                >
                  💬 Comments
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Right - Comments */}
        <div className="w-1/5 bg-white border-l flex flex-col h-[100vh] p-4">
          <div className="flex-1 overflow-y-auto pr-1">
            <h3 className="font-bold text-lg mb-3">Comments</h3>
            {comments.map((c, index) => (
              <div key={index} className="bg-gray-100 p-2 rounded mb-2 text-sm">
                <strong className="text-blue-600">{c.author}</strong> – {c.text}
              </div>
            ))}
          </div>
          <div className="mt-3">
            <input
              type="text"
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              placeholder="Type a comment..."
              className="w-full px-3 py-2 border rounded"
            />
            <button
              onClick={handleCommentSubmit}
              className="mt-2 w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Post;
