import React, { useState } from "react";
import { userRequest } from "../../utils/axios/axios";

const MarkAsReadButton = ({ messageId }) => {
  const [markStatus, setMarkStatus] = useState("");

  const handleMarkAsRead = async () => {
    try {
      const response = await userRequest.post("/api/message/markRead", {
        messageId,
      });
      setMarkStatus(response.data.message);
    } catch (error) {
      console.error("Error marking message as read:", error.message);
      setMarkStatus("Failed to mark message as read");
    }
  };

  return (
    <div>
      <button onClick={handleMarkAsRead}>Mark as Read</button>
      {markStatus && <p>{markStatus}</p>}
    </div>
  );
};

export default MarkAsReadButton;
