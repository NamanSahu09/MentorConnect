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
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const Post = () => {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState("");
  const [user, setUser] = useState(null);
  const [selectedPostId, setSelectedPostId] = useState(null);

  // 🔐 Fetch user and posts
  useEffect(() => {
    onAuthStateChanged(auth, (u) => {
      if (u) setUser(u);
    });

    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedPosts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPosts(fetchedPosts);

      // Select first post for comment
      if (!selectedPostId && fetchedPosts.length > 0) {
        setSelectedPostId(fetchedPosts[0].id);
      }
    });

    return () => unsubscribe();
  }, []);

  // 💬 Fetch comments of selected post
  useEffect(() => {
    if (selectedPostId) {
      const q = query(
        collection(db, "posts", selectedPostId, "comments"),
        orderBy("createdAt", "asc")
      );
      return onSnapshot(q, (snapshot) => {
        setComments(snapshot.docs.map(doc => doc.data()));
      });
    }
  }, [selectedPostId]);

  // 💾 Add comment
  const handleCommentSubmit = async () => {
    if (!user || !commentInput.trim() || !selectedPostId) return;

    await addDoc(collection(db, "posts", selectedPostId, "comments"), {
      text: commentInput,
      author: user.displayName || "Anonymous",
      createdAt: serverTimestamp(),
    });

    setCommentInput("");
  };

  return (
    <>
      <TopNav />

      <div className="flex bg-gray-100 min-h-[100vh]">
        {/* Sidebar */}
        <div className="w-1/5 bg-white shadow-md flex flex-col h-[100vh]">
          <LeftBar />
        </div>

        {/* Middle Section - Posts */}
        <div className="w-3/5 p-6 space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="bg-white p-4 rounded-lg shadow">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-bold text-gray-700">{post.author}</h4>
                <p className="text-xs text-gray-500">
                  {post.createdAt?.toDate().toLocaleString() || "Just now"}
                </p>
              </div>
              <p className="text-gray-800 mb-2">{post.description}</p>
              <div className="text-sm text-gray-500 flex gap-4">
                <span>🗨 {comments.length} comments</span>
                <button
                  className="text-blue-500 font-semibold"
                  onClick={() => setSelectedPostId(post.id)}
                >
                  reply
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Right Section - Comments */}
        <div className="w-1/5 bg-white border-l flex flex-col h-[100vh] p-4">
          <div className="flex-1 overflow-y-auto pr-1">
            <h3 className="font-bold text-lg mb-3">Comments</h3>
            <div className="space-y-3 text-sm">
              {comments.map((c, i) => (
                <div key={i} className="bg-gray-100 p-2 rounded">
                  <strong className="text-blue-600">{c.author}</strong> – {c.text}
                </div>
              ))}
            </div>
          </div>

          {/* Comment Input */}
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
