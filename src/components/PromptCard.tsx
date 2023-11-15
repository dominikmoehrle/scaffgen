import React from "react";
import { type Scaffolds } from "~/utils/types";

type PromptCardProps = {
  id: string;
  objective: string;
  grade: string;
  needs: string;
  easeOfUse: number;
  alignment: number;
  engagement: number;
  scaffolds: Scaffolds;
  onClick: () => void;
};

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  return (
    <div style={{ display: "inline" }}>
      {[...Array(5)].map((_, i) => (
        <span key={i} style={{ color: i < rating ? "gold" : "lightgray" }}>
          ★
        </span>
      ))}
    </div>
  );
};

const getRandomColor = () => {
  const colors = [
    "#ffadad",
    "#ffd6a5",
    "#fdffb6",
    "#caffbf",
    "#9bf6ff",
    "#a0c4ff",
    "#bdb2ff",
    "#ffc6ff",
  ]; // Example colors
  return colors[Math.floor(Math.random() * colors.length)];
};

const PromptCard: React.FC<PromptCardProps> = ({
  id,
  objective,
  grade,
  needs,
  scaffolds,
  onClick,
  easeOfUse,
  alignment,
  engagement,
}) => {
  const backgroundColor = getRandomColor();
  const cardStyle = {
    background: `linear-gradient(${backgroundColor}60, ${backgroundColor}20)`, // Gradient from solid to transparent
    cursor: "pointer",
    borderRadius: "10px",
    padding: "16px",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
    // other styles
  };
  return (
    <div style={cardStyle} onClick={onClick}>
      <h2 className="mb-2 text-xl font-bold">
        {objective} ({grade})
      </h2>

      <p className="mb-2">
        <strong>Engagement</strong> <StarRating rating={engagement} />
      </p>
      <p className="mb-2">
        <strong>Usability</strong> <StarRating rating={easeOfUse} />
      </p>
      <p className="mb-2">
        <strong>Alignment</strong> <StarRating rating={alignment} />
      </p>
    </div>
  );
};

export default PromptCard;
