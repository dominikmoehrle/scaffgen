import React, { useState } from "react";
import { useToast } from "src/src/components/ui/use-toast";
import { Button } from "src/src/components/ui/button";
import supabase from "~/utils/supabaseClient";
import { PromptData, Scaffold } from "~/utils/types";
import { ReloadIcon } from "@radix-ui/react-icons";
import { MathJax } from "better-react-mathjax";
import parse from "html-react-parser";

const Star = ({ selected, onSelect }) => (
  <span
    style={{
      color: selected ? "rgb(31, 41, 55)" : "gray",
      cursor: "pointer",
      fontSize: "20px",
    }}
    onClick={onSelect}
  >
    ★
  </span>
);

const processContent = (latexContent: string) => {
  if (typeof latexContent !== "string") {
    console.error("Invalid content type:", typeof latexContent);
    return "";
  }
  let processedContent = latexContent;
  console.log("hereeee");
  console.log(processedContent);

  processedContent = processedContent.replace(
    /\\textbf\{([^}]+)\}/g,
    "<strong>$1</strong>",
  );

  // Replace \textbf{...} with <strong>...</strong>
  // The '\\s*' allows for any whitespace characters including newlines before \textbf
  processedContent = processedContent.replace(
    /\\?extbf\{([^}]+)\}/g,
    "<strong>$1</strong>",
  );

  // Replace \n and \\newline with <br/>
  processedContent = processedContent.replace(/\\newline/g, "<br/>");
  processedContent = processedContent.replace(/\\n/g, "<br/>");
  return processedContent;
};

type ScaffoldComponentProps = {
  id: string;
  content: string;
  status: Scaffold["status"];
  easeUseRatings: number[];
  category: string;
  prompt: PromptData;
  engagementRatings: number[];
  alignmentRatings: number[];
  onRedo: (scaffoldId: string, callback?: () => void) => void;
};

const ScaffoldComponent = ({
  id,
  content,
  status,
  category,
  prompt,
  easeUseRatings,
  engagementRatings,
  alignmentRatings,
  onRedo,
}: ScaffoldComponentProps) => {
  const [hovered, setHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [ratings, setRatings] = useState({});
  const { toast } = useToast();

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(String(content));
      toast({
        title: "Copied Scaffold to Clipboard",
      });
    } catch (error) {
      console.error(error);
    }
  };

  const updateRatings = async (
    newRating: number,
    metric: "easeOfUse" | "engagement" | "alignment",
  ) => {
    try {
      switch (metric) {
        case "easeOfUse":
          easeUseRatings.push(newRating);
          break;
        case "engagement":
          engagementRatings.push(newRating);
          break;
        case "alignment":
          alignmentRatings.push(newRating);
          break;
      }
      console.log("wuhuuuuu");
      console.log(prompt.scaffolds);
      console.log("scaffold Id to update is " + id);
      console.log("scaffold content to update is " + content);
      console.log(
        "scaffold category to update is " + prompt.scaffolds[category],
      );
      console.log("Ease UseRating is ");
      console.log(easeUseRatings);
      console.log("metric is : " + metric);

      const updatedScaffold = {
        ...prompt.scaffolds[category].find((s) => s.id === id),
        easeUseRatings,
        engagementRatings,
        alignmentRatings,
      };

      // Update the specific category within scaffolds
      const updatedCategoryScaffolds = prompt.scaffolds[category].map((s) =>
        s.id === id ? updatedScaffold : s,
      );

      // Update the entire scaffolds object with the updated category
      const updatedScaffolds = {
        ...prompt.scaffolds,
        [category]: updatedCategoryScaffolds,
      };

      console.log("Entire scaffolds category is updated");
      console.log(updatedScaffolds);

      const { error } = await supabase
        .from("Prompt")
        .update({ scaffolds: updatedScaffolds })
        .eq("id", prompt.id);

      if (error) throw error;
      console.log("Updated Ratings:", updatedCategoryScaffolds);
    } catch (error) {
      console.error("Error updating ratings:", error);
    }
  };

  const onSelectStar = async (
    metric: "easeOfUse" | "engagement" | "alignment",
    newRating: number,
  ) => {
    const updatedRatings = { ...ratings, [metric]: newRating };
    setRatings(updatedRatings);
    console.log("Ratings set to ", updatedRatings[metric]);

    // Ensure correct types and order of arguments when calling updateRatings
    await updateRatings(newRating, metric); // Assuming scaffoldId is available
  };

  const renderStars = (metric: "easeOfUse" | "engagement" | "alignment") => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        selected={index < (ratings[metric] || 0)}
        onSelect={() => onSelectStar(metric, index + 1)}
      />
    ));
  };

  return (
    <div
      className="scaffold-grid-item"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        cursor: "pointer",
        padding: "10px",
        margin: "10px",
        backgroundColor: "white",
      }}
    >
      {hovered && (
        <div style={{ position: "absolute", marginTop: "16px" }}>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <Button
              onClick={handleCopyToClipboard}
              className="copy-paste-buttons"
            >
              ✂️ Copy
            </Button>
            {isLoading ? (
              <Button className="copy-paste-buttons" disabled>
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button
                onClick={() => {
                  setIsLoading(true);
                  toast({
                    title: "Creating a new Scaffold",
                  });
                  onRedo(id, () => {
                    console.log("Callback called");
                    setIsLoading(false);
                  });
                }}
                className="copy-paste-buttons"
              >
                🔄 Redo
              </Button>
            )}
          </div>
          <div className="scaffold-buttons">
            <h1
              style={{
                marginBottom: "20px",
                marginTop: "20px",
                fontSize: "30px",
                fontWeight: "bold",
                color: "#333",
                textAlign: "center",
              }}
            >
              <strong>Rate this Scaffold</strong>
            </h1>
            <div style={{ marginBottom: "10px" }}>
              <strong style={{ marginRight: "20px" }}>Ease of Use</strong>{" "}
              {renderStars("easeOfUse")}
            </div>
            <div style={{ marginBottom: "10px" }}>
              <strong style={{ marginRight: "20px" }}>
                Student Engagement
              </strong>{" "}
              {renderStars("engagement")}
            </div>
            <div style={{ marginBottom: "10px" }}>
              <strong style={{ marginRight: "20px" }}>
                Lesson-Objective Alignment
              </strong>{" "}
              {renderStars("alignment")}
            </div>
          </div>
        </div>
      )}
      <MathJax>
        {parse(processContent(content))}{" "}
        {/* Use parse to convert HTML string to React components */}
      </MathJax>
    </div>
  );
};

export default ScaffoldComponent;
