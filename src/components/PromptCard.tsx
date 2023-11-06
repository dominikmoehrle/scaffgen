// components/PromptCard.tsx
import React from "react";
import type { Scaffold, Scaffolds } from "../pages/library";

type PromptCardProps = {
  id: string;
  objective: string;
  grade: string;
  needs: string;
  scaffolds: Scaffolds;
};

const PromptCard: React.FC<PromptCardProps> = ({
  id,
  objective,
  grade,
  needs,
  scaffolds,
}) => {
  return (
    <div className="rounded-lg bg-white p-4 shadow-md">
      <h2 className="mb-2 text-xl font-bold">Lesson Objective: {objective}</h2>
      <p className="mb-2">
        <strong>Grade Level:</strong> {grade}
      </p>
      <p className="mb-2">
        <strong>Special Needs:</strong> {needs}
      </p>
      {/* Render the rest of your prompt data here */}
      {/* ... */}
    </div>
  );
};

export default PromptCard;
