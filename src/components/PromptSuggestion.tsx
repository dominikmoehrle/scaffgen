type PromptSuggestionProps = {
  suggestion: string;
  onClick: () => void;
  isLoading: boolean;
  className?: string; // Add this line to allow a className prop
};

/**
 * Renders a prompt suggestion pill-shaped button.
 */
export const PromptSuggestion: React.FC<PromptSuggestionProps> = ({
  suggestion,
  onClick,
  isLoading,
  className,
}) => {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    onClick();
  };

  return (
    <button
      type="button"
      className={`rounded-2xl border p-2 ${
        !isLoading ? "cursor-pointer" : "cursor-not-allowed"
      } transition hover:bg-gray-100 ${className}`}
      onClick={handleClick} // Use handleClick instead of onClick
      disabled={isLoading}
    >
      {suggestion}
    </button>
  );
};
