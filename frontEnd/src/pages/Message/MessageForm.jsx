import React, { useState } from "react";
import axios from "axios";
import { userRequest } from "../../utils/axios/axios";

const MessageForm = ({ messageId }) => {
  const [content, setContent] = useState("");
    const [messageStatus, setMessageStatus] = useState("");
    const [toIdMessage, settoIdMessage] = useState(messageId);
    console.log("to id msg", messageId);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await userRequest.post("/api/message/add", {
        toUserId: messageId,
        content,
      });
      setMessageStatus(response.data.message);
      setContent(""); // Clear message content after sending
    } catch (error) {
      console.error("Error sending message:", error.message);
      setMessageStatus("Failed to send message");
    }
  };

  return (
    <div>
      <h2>Send a Message</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Message Content:
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </label>
        <button type="submit">Send Message</button>
      </form>
      {messageStatus && <p>{messageStatus}</p>}
    </div>
  );
};

export default MessageForm;
