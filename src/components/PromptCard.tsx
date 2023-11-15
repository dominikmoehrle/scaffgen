// components/PromptCard.tsx
import React from "react";
import { type Scaffolds } from "~/utils/types";

type PromptCardProps = {
  id: string;
  objective: string;
  grade: string;
  needs: string;
  scaffolds: Scaffolds;
  onClick: () => void;
};

const PromptCard: React.FC<PromptCardProps> = ({
  id,
  objective,
  grade,
  needs,
  scaffolds,
  onClick,
}) => {
  return (
    <div
      className="cursor-pointer rounded-lg bg-white p-4 shadow-md"
      onClick={onClick}
    >
      <h2 className="mb-2 text-xl font-bold">
        {objective} ({grade})
      </h2>

      <p className="mb-2">
        <strong></strong> {needs}
      </p>
    </div>
  );
};

export default PromptCard;
