import React, { useState } from "react";
import { Scaffold } from "~/utils/types";

type ScaffoldProps = {
  id: string;
  content: string;
  status: Scaffold["status"];
  onAccept: (id: string) => void;
  onModify: (id: string) => void;
  onReject: (id: string) => void;
};

const ScaffoldComponent: React.FC<ScaffoldProps> = ({
  id,
  content,
  status,
  onAccept,
  onModify,
  onReject,
}) => {
  const [hovered, setHovered] = useState(false);

  const borderColor = () => {
    switch (status) {
      case "ACCEPTED":
        return "3px solid green";
      case "REJECTED":
        return "3px solid red";
      default:
        return "1px solid #ccc"; // Default border
    }
  };

  return (
    <div
      className="scaffold-grid-item"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        cursor: "pointer",
        border: borderColor(), // Apply the border color based on the status
      }}
    >
      <p>{content}</p>
      {hovered && (
        <div className="scaffold-buttons">
          <button onClick={() => onAccept(id)}>Accept</button>
          <button onClick={() => onModify(id)}>Modify</button>
          <button onClick={() => onReject(id)}>Reject</button>
        </div>
      )}
    </div>
  );
};

export default ScaffoldComponent;
