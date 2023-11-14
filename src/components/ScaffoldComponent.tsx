import React, { useState } from "react";
import { useToast } from "src/src/components/ui/use-toast";
import { Button } from "src/src/components/ui/button";
import supabase from "~/utils/supabaseClient";
import { Scaffold } from "~/utils/types";

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

type ScaffoldComponentProps = {
  id: string;
  content: string;
  status: Scaffold["status"];
  easeUseRatings: number[];
  engagementRatings: number[];
  alignmentRatings: number[];
};

const ScaffoldComponent = ({
  id,
  content,
  status,
  easeUseRatings,
  engagementRatings,
  alignmentRatings,
}: ScaffoldComponentProps) => {
  const [hovered, setHovered] = useState(false);
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

  const handleRedo = (id: string) => {
    // Add your redo functionality here
    toast({
      title: "Creating a new Scaffold",
    });
  };

  const updateRatings = async (
    scaffoldId: string,
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
      const { data, error } = await supabase
        .from("Prompt")
        .update({
          easeUseRating: easeUseRatings,
          engagementRating: engagementRatings,
          alignmentRating: alignmentRatings,
        })
        .eq("id", scaffoldId);
      if (error) throw error;
      console.log("Updated Ratings:", data);
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
    await updateRatings(id, updatedRatings[metric], metric);
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
      <h3>Rate this Scaffold</h3>
      <p>{content}</p>

      {hovered && (
        <div className="scaffold-buttons">
          <div style={{ marginBottom: "10px" }}>
            <strong>Ease of Use:</strong> {renderStars("easeOfUse", id)}
          </div>
          <div style={{ marginBottom: "10px" }}>
            <strong>Student Engagement:</strong> {renderStars("engagement", id)}
          </div>
          <div style={{ marginBottom: "10px" }}>
            <strong>Lesson-Objective Alignment:</strong>{" "}
            {renderStars("alignment", id)}
          </div>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <button
              onClick={handleCopyToClipboard}
              className="copy-paste-buttons"
            >
              ✂️ Copy
            </button>
            <button
              onClick={() => handleRedo(id)}
              className="copy-paste-buttons"
            >
              🔄 Redo
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScaffoldComponent;
