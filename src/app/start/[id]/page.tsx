"use client";

import { MathJaxContext } from "better-react-mathjax";
import React, { useState, useEffect } from "react";
import ScaffoldComponent from "~/components/ScaffoldComponent";
import { redoScaffoldOpenAI } from "~/components/openAi";
import supabase from "~/utils/supabaseClient";
import type { PromptData, Scaffolds, Scaffold } from "~/utils/types";

export default function Page({ params }: { params: { id: string } }) {
  const [data, setData] = useState<PromptData | null>(null);

  const statusActions = {
    accept: "ACCEPTED" as Scaffold["status"],
    reject: "REJECTED" as Scaffold["status"],
    modify: "MODIFIED" as Scaffold["status"],
  };

  const fetchData = async () => {
    if (params.id) {
      try {
        const { data: fetchedData } = await supabase
          .from("Prompt")
          .select()
          .eq("id", params.id);
        if (fetchedData && fetchedData.length > 0) {
          setData(fetchedData[0] as PromptData);
        }
        console.log(
          "Raw data from Supabase:",
          data?.scaffolds.warmups[0]?.content,
        );
      } catch (error) {
        console.error("Error fetching scaffold data:", error);
        // Handle error
      }
    }
  };

  useEffect(() => {
    fetchData().catch((error) => {
      console.error("Error in fetchData:", error);
    });
  }, [params.id]); // Depend on `id` so it re-runs when `id` changes

  if (!data) {
    return (
      <div>
        <strong>No scaffold data found for</strong> {params.id}.
      </div>
    );
  }

  async function handleStatusChange(
    scaffoldId: string,
    status: Scaffold["status"],
  ) {
    if (!data) {
      console.error("No data to update");
      return;
    }

    // Update the scaffolds within the data state object
    const updatedScaffolds: Scaffolds = {
      warmups: data.scaffolds.warmups.map((scaffold) =>
        scaffold.id === scaffoldId ? { ...scaffold, status } : scaffold,
      ),
      choiceboards: data.scaffolds.choiceboards.map((scaffold) =>
        scaffold.id === scaffoldId ? { ...scaffold, status } : scaffold,
      ),
      misconceptions: data.scaffolds.misconceptions.map((scaffold) =>
        scaffold.id === scaffoldId ? { ...scaffold, status } : scaffold,
      ),
    };

    // Update the state with the new scaffolds data
    setData((prevData) => {
      if (prevData === null) return null;

      return {
        ...prevData,
        scaffolds: updatedScaffolds,
      };
    });

    // Attempt to update the database
    const { error } = await supabase
      .from("Prompt")
      .update({ scaffolds: updatedScaffolds })
      .match({ id: params.id });

    if (error) {
      console.error("Error updating scaffold status:", error.message);
    }
  }

  async function handleRedo(scaffoldId: string, callback?: () => void) {
    if (!data) {
      console.error("No data to update");
      return;
    }
    const scaffold = [
      ...data.scaffolds.warmups,
      ...data.scaffolds.choiceboards,
      ...data.scaffolds.misconceptions,
    ].find((s) => s.id === scaffoldId);

    if (!scaffold) {
      console.error("Scaffold not found");
      return;
    }

    // Get the scaffold category ('warmups', 'choiceboards', 'misconceptions')
    const scaffoldCategory = Object.keys(data.scaffolds).find((category) =>
      data.scaffolds[category].some((s) => s.id === scaffoldId),
    );

    const newContent = await redoScaffoldOpenAI(data, scaffold);
    console.log("Fetch successful");

    // Update the state with the new scaffolds data
    if (scaffoldCategory) {
      data.scaffolds[scaffoldCategory] = data.scaffolds[scaffoldCategory].map(
        (s) =>
          s.id === scaffoldId
            ? {
                ...s,
                content: newContent,
                easeUseRatings: [],
                engagementRatings: [],
                alignmentRatings: [],
              }
            : s,
      );
    }

    setData({ ...data });
    console.log("Data updated");

    try {
      // Attempt to update the database
      const { error } = await supabase
        .from("Prompt")
        .update({ scaffolds: data.scaffolds })
        .match({ id: params.id });

      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      console.error("Error updating scaffold status:", error.message || error);
    }

    if (callback) {
      console.log("callback called");
      callback();
    } else {
      console.log("no callback found");
    }
  }

  // Render your scaffold data here
  return (
    <div>
      <MathJaxContext>
        <div className="scaffold-overview-container">
          <h1 className="scaffold-header">Scaffold Data</h1>
          <div className="scaffold-detail">
            <strong className="scaffold-detail-title">Lesson Objective:</strong>
            <span className="scaffold-detail-content">{data.objective}</span>
          </div>
          <div className="scaffold-detail">
            <strong className="scaffold-detail-title">Grade Level:</strong>
            <span className="scaffold-detail-content">{data.grade}</span>
          </div>
          <div className="scaffold-detail">
            <strong className="scaffold-detail-title">Special Needs:</strong>
            <span className="scaffold-detail-content">{data.needs}</span>
          </div>
        </div>

        <div className="scaffold-grid-container">
          <section>
            <h2 className="scaffold-title">Warmups</h2>
            <div className="scaffold-grid">
              {data?.scaffolds.warmups?.map((warmup) => (
                <ScaffoldComponent
                  key={warmup.id}
                  id={warmup.id}
                  category="warmups"
                  status={warmup.status}
                  content={warmup.content}
                  prompt={data}
                  easeUseRatings={warmup.easeUseRatings}
                  engagementRatings={warmup.engagementRatings}
                  alignmentRatings={warmup.alignmentRatings}
                  onRedo={handleRedo}
                />
              ))}
            </div>
          </section>
          <section>
            <h2 className="scaffold-title">Choiceboards</h2>
            <div className="scaffold-grid">
              {data?.scaffolds.choiceboards?.map((choiceboard) => (
                <ScaffoldComponent
                  key={choiceboard.id}
                  id={choiceboard.id}
                  category="choiceboards"
                  status={choiceboard.status}
                  content={choiceboard.content}
                  prompt={data}
                  easeUseRatings={choiceboard.easeUseRatings}
                  engagementRatings={choiceboard.engagementRatings}
                  alignmentRatings={choiceboard.alignmentRatings}
                  onRedo={handleRedo}
                />
              ))}
            </div>
          </section>
          <section>
            <h2 className="scaffold-title">Misconceptions</h2>
            <div className="scaffold-grid">
              {data?.scaffolds.misconceptions?.map((misconception) => (
                <ScaffoldComponent
                  key={misconception.id}
                  id={misconception.id}
                  category="misconceptions"
                  status={misconception.status}
                  content={misconception.content}
                  prompt={data}
                  easeUseRatings={misconception.easeUseRatings}
                  engagementRatings={misconception.engagementRatings}
                  alignmentRatings={misconception.alignmentRatings}
                  onRedo={handleRedo}
                />
              ))}
            </div>
          </section>
        </div>
      </MathJaxContext>
    </div>
  );
}
