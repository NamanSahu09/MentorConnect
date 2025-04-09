import React from "react";
import TopNav from "../components/TopNav";
import LeftBar from "../components/LeftBar";

const Post = () => {
  return (
    <>
      <TopNav />

      {/* FLEX layout */}
      <div className="flex min-h-screen bg-gradient-to-r from-blue-100 to-indigo-200">
        
        {/* Sidebar */}
        <div className="w-full md:w-1/4 lg:w-1/5 p-4">
          <LeftBar />
        </div>

        {/* Post Form */}
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-2xl shadow-md w-full max-w-xl">
            <h2 className="text-2xl font-bold mb-4 text-center text-gray-700">Create New Post</h2>

            <form className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-gray-600 font-semibold mb-1">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  placeholder="Enter your post title"
                />
              </div>

              <div>
                <label htmlFor="desc" className="block text-gray-600 font-semibold mb-1">
                  Description
                </label>
                <textarea
                  id="desc"
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
                  placeholder="Write something awesome..."
                ></textarea>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-6 rounded-lg transition"
                >
                  Post
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </>
  );
};

export default Post;
