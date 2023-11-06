"use client";

import React, { useState, useEffect } from "react";
import ScaffoldComponent from "~/components/ScaffoldComponent";
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

  // Render your scaffold data here
  return (
    <div>
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
                status={warmup.status}
                content={warmup.content}
                onAccept={() =>
                  handleStatusChange(warmup.id, statusActions.accept)
                }
                onReject={() =>
                  handleStatusChange(warmup.id, statusActions.reject)
                }
                onModify={() =>
                  handleStatusChange(warmup.id, statusActions.modify)
                }
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
                status={choiceboard.status}
                content={choiceboard.content}
                onAccept={() =>
                  handleStatusChange(choiceboard.id, statusActions.accept)
                }
                onReject={() =>
                  handleStatusChange(choiceboard.id, statusActions.reject)
                }
                onModify={() =>
                  handleStatusChange(choiceboard.id, statusActions.modify)
                }
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
                content={misconception.content}
                status={misconception.status}
                onAccept={() =>
                  handleStatusChange(misconception.id, statusActions.accept)
                }
                onReject={() =>
                  handleStatusChange(misconception.id, statusActions.reject)
                }
                onModify={() =>
                  handleStatusChange(misconception.id, statusActions.modify)
                }
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
