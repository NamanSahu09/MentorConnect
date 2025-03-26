import { useState } from "react";
import { FaSearch, FaPlus } from "react-icons/fa";
import { AiOutlineSend } from "react-icons/ai";

const ChatScreen = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello student this is your mentor", sender: "mentor", time: "June 12, 2022 3:01 PM" },
    { id: 2, text: "Yes sir hello, How are you?", sender: "student", time: "June 12, 2022 3:02 PM" },
    { id: 3, text: "Yes yes I am fine how about you", sender: "mentor", time: "June 12, 2022 3:02 PM" },
    { id: 4, text: "Hello sir I am good", sender: "student", time: "June 12, 2022 3:28 PM" },
    { id: 5, text: "sir I had a question", sender: "student", time: "June 12, 2022 3:28 PM" },
    { id: 6, text: "about the question", sender: "student", time: "June 12, 2022 3:28 PM" },
    { id: 7, text: "The question you gave", sender: "student", time: "June 12, 2022 3:29 PM" },
  ]);

  const [newMessage, setNewMessage] = useState("");

  const sendMessage = () => {
    if (newMessage.trim() !== "") {
      setMessages([...messages, { id: messages.length + 1, text: newMessage, sender: "student", time: "Just now" }]);
      setNewMessage("");
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-1/4 bg-white p-4 border-r">
        <h2 className="text-xl font-semibold mb-4">Chat</h2>
        <div className="relative mb-4">
          <input type="text" placeholder="Search chat..." className="w-full p-2 pl-8 border rounded" />
          <FaSearch className="absolute left-2 top-2 text-gray-400" />
        </div>
        <div className="p-2 border rounded flex items-center justify-between cursor-pointer">
          <div className="flex items-center gap-2">
            <div className="bg-blue-500 text-white w-10 h-10 flex items-center justify-center rounded-full">ST</div>
            <div>
              <h3 className="font-medium">Student 3</h3>
              <p className="text-sm text-gray-500">The question you gave</p>
            </div>
          </div>
          <span className="text-xs text-gray-500">Today at 2:29 PM</span>
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col">
        <div className="bg-gray-200 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-500 text-white w-10 h-10 flex items-center justify-center rounded-full">ST</div>
            <h3 className="font-medium">Student 3</h3>
          </div>
          <button className="bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2">
            <FaPlus /> Create a chat
          </button>
        </div>

        <div className="flex-1 p-4 overflow-y-auto bg-white">
          {messages.map((msg) => (
            <div key={msg.id} className={`mb-2 flex ${msg.sender === "student" ? "justify-end" : "justify-start"}`}>
              <div className={`p-3 rounded-lg max-w-xs ${msg.sender === "student" ? "bg-blue-500 text-white" : "bg-gray-200"}`}>
                <p>{msg.text}</p>
                <span className="block text-xs mt-1 text-gray-400">{msg.time}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="p-4 border-t flex items-center bg-white">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type something..."
            className="flex-1 p-2 border rounded"
          />
          <button onClick={sendMessage} className="bg-green-500 text-white p-2 ml-2 rounded flex items-center gap-2">
            Send <AiOutlineSend />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatScreen;
