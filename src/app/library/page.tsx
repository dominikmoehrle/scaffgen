"use client";

import React, { useState, useEffect } from "react";
import { kv } from "@vercel/kv";

import { createClient } from "@supabase/supabase-js";

import supabase from "~/utils/supabaseClient";
import PromptCard from "~/components/PromptCard";
import { Scaffolds, type PromptData, Scaffold } from "~/utils/types";
import { useRouter } from "next/navigation";

export default function Library() {
  const [data, setData] = useState<PromptData[] | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchData = async () => {
    // Make sure params.id is not undefined
    try {
      //const scaffoldData = await getAllKv(params.id);
      const { data: fetchedData, error } = await supabase
        .from("Prompt")
        .select();
      if (fetchedData && fetchedData.length > 0) {
        setData(fetchedData as PromptData[]);
      } else {
        // Handle no data found
      }
    } catch (error) {
      console.error("Error fetching scaffold data:", error);
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData().catch((error) => {
      console.error("Error in fetchData:", error);
    });
  }, []); // Depend on `id` so it re-runs when `id` changes

  const calculateOverallAverageRatings = (scaffolds: Scaffolds) => {
    const calculateAverage = (ratings: number[]) => {
      if (ratings.length === 0) return 0;
      return ratings.reduce((acc, curr) => acc + curr, 0) / ratings.length;
    };

    const allEaseUseRatings = [
      ...scaffolds.warmups.flatMap((s) => s.easeUseRatings),
      ...scaffolds.choiceboards.flatMap((s) => s.easeUseRatings),
      ...scaffolds.misconceptions.flatMap((s) => s.easeUseRatings),
    ];

    const allEngagementRatings = [
      ...scaffolds.warmups.flatMap((s) => s.engagementRatings),
      ...scaffolds.choiceboards.flatMap((s) => s.engagementRatings),
      ...scaffolds.misconceptions.flatMap((s) => s.engagementRatings),
    ];

    const allAlignmentRatings = [
      ...scaffolds.warmups.flatMap((s) => s.alignmentRatings),
      ...scaffolds.choiceboards.flatMap((s) => s.alignmentRatings),
      ...scaffolds.misconceptions.flatMap((s) => s.alignmentRatings),
    ];

    return {
      easeOfUse: calculateAverage(allEaseUseRatings),
      engagement: calculateAverage(allEngagementRatings),
      alignment: calculateAverage(allAlignmentRatings),
    };
  };
  // Render your scaffold data here
  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-2 text-xl font-bold">All Generated Scaffolds</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data?.map((prompt) => (
          <PromptCard
            key={prompt.id}
            objective={prompt.objective}
            grade={prompt.grade}
            needs={prompt.needs}
            scaffolds={prompt.scaffolds}
            id={prompt.id}
            easeOfUse={
              calculateOverallAverageRatings(prompt.scaffolds).easeOfUse
            }
            alignment={
              calculateOverallAverageRatings(prompt.scaffolds).alignment
            }
            engagement={
              calculateOverallAverageRatings(prompt.scaffolds).engagement
            }
            onClick={() => router.push(`/start/${prompt.id}`)}
          />
        ))}
      </div>
    </div>
  );
}
