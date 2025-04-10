
import TopNav from "../components/TopNav";
import LeftBar from "../components/leftBar";

import { useEffect, useState } from "react";
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


useEffect(() => {
  onAuthStateChanged(auth, (u) => {
    if (u) setUser(u);
  });

  const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
  const unsubscribe = onSnapshot(q, (snapshot) => {
    setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    if (!selectedPostId && snapshot.docs.length > 0) {
      setSelectedPostId(snapshot.docs[0].id);
    }
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



const handleAddPost = async () => {
  await addDoc(collection(db, "posts"), {
    author: user?.displayName || "Anonymous",
    description: "This is a new post.",
    createdAt: serverTimestamp(),
  });
};



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

      <div className="w-1/5 bg-white shadow-md flex flex-col h-[100vh]">
       <LeftBar />
       </div>


        {/* Middle Section - Posts */}
        <div className="w-3/5 p-6 space-y-4">
          {/* Each post */}
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-bold text-gray-700">Mintu Moni Kurmi</h4>
              <p className="text-xs text-gray-500">June 22, 2022 · 2:11 PM</p>
            </div>
            <p className="text-gray-800 mb-2">
              Tomorrow we will be meeting in the dept to discuss some important topics, do come in time.
            </p>
            <div className="text-sm text-gray-500 flex gap-4">
              <span>🗨 2 comments</span>
              <button className="text-blue-500 font-semibold">reply</button>
            </div>
          </div>

          {/* Another post */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h4 className="font-bold text-gray-700">Student 3</h4>
            <p className="text-sm text-gray-500">June 22, 2022 · 2:34 PM</p>
            <p className="text-blue-600 underline mt-1">w3school</p>
          </div>
        </div>

       
       {/* Right Section - Comments */}
       <div className="w-1/5 bg-white border-l flex flex-col h-[100vh] p-4">
  {/* Top - Comments */}
  <div className="flex-1 overflow-y-auto pr-1">
    <h3 className="font-bold text-lg mb-3">Comments</h3>
    <div className="space-y-3 text-sm">
      <div className="bg-gray-100 p-2 rounded">
        <strong className="text-blue-600">Student 3</strong> – yes sir, I will be present there
      </div>
      <div className="bg-gray-100 p-2 rounded">
        <strong className="text-purple-600">Mintu Moni Kurmi</strong> – Ok come soon
      </div>
    </div>
     {/* Bottom - Input */}
     <div className="mt-3">
  <input
    type="text"
    value={commentInput}
    onChange={(e) => setCommentInput(e.target.value)}
    placeholder="Type a comment..."
    className="w-full px-3 py-2 border rounded mb-2"
  />

  <div className="flex gap-2">
    <button
      onClick={handleCommentSubmit}
      className="w-1/2 bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
    >
      Submit
    </button>

    <button
      onClick={handleAddPost}
      className="w-1/2 bg-green-600 text-white py-2 rounded hover:bg-green-700"
    >
      Post
    </button>
  </div>
</div>


  </div>
  </div>

 
</div>

      </div>
    </>
  );
};

export default Post;
