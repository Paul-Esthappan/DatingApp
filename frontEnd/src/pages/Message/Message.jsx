import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // Assuming you're using React Router for routing
import { userRequest } from "../../utils/axios/axios";

const Message = () => {
    const { id } = useParams(); 
    console.log("User id",id);
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const [messageStatus, setMessageStatus] = useState("");
  const [toUserName, setToUserName] = useState("");

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await userRequest.get(`/api/messages/chat/${id}`);
          setMessages(response.data.messages);
          console.log("chat responce",response);

        const userResponse = await userRequest.get(`/api/auth/fetchuser/${id}`);
        console.log("user responce",userResponse);
        setToUserName(userResponse.data.displayName);
      } catch (error) {
        console.error("Error fetching messages:", error.message);
      }
    };

    fetchMessages();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await userRequest.post("/api/messages/add", {
        id,
        content,
      });
      setMessageStatus(response.data.message);
      setContent("");

      const messagesResponse = await userRequest.get(
        `/api/messages/chat/${id}`
      );
      setMessages(messagesResponse.data.messages);
    } catch (error) {
      console.error("Error sending message:", error.message);
      setMessageStatus("Failed to send message");
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Chat with {toUserName}</h2>
      <div className="bg-gray-100 p-4 rounded-lg mb-4">
        <h3 className="text-xl font-semibold mb-2">Messages</h3>
        <ul className="space-y-2">
          {messages.map((message) => (
            <li
              key={message._id}
              className={`p-2 rounded-lg ${
                message.from._id === id
                  ? "bg-white text-left"
                  : "bg-green-100 text-right"
              }`}
            >
              <span className="font-bold">{message.from.name}: </span>
              <span>{message.content}</span>
              <div className="text-xs text-gray-500">
                {new Date(message.timestamp).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-gray-100 p-4 rounded-lg">
        <h3 className="text-xl font-semibold mb-2">Send a Message</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2">Message Content:</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded-lg"
          >
            Send Message
          </button>
        </form>
        {messageStatus && <p className="mt-2 text-red-500">{messageStatus}</p>}
      </div>
    </div>
  );
};

export default Message;
