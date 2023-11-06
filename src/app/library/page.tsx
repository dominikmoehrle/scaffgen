"use client";

import React, { useState, useEffect } from "react";
import { kv } from "@vercel/kv";

import { createClient } from "@supabase/supabase-js";

import supabase from "~/utils/supabaseClient";
import PromptCard from "~/components/PromptCard";

type Scaffold = {
  id: string;
  content: string;
  status: "IGNORED" | "ACCEPTED" | "BAD";
};

type Scaffolds = {
  warmups: Scaffold[];
  choiceboards: Scaffold[];
  misconceptions: Scaffold[];
};

type PromptData = {
  id: string;
  prompt_content: string;
  objective: string;
  grade: string;
  needs: string;
  scaffolds: Scaffolds;
};

export default function Library() {
  const [data, setData] = useState<PromptData[] | null>(null);
  const [loading, setLoading] = useState(true);

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

  // Render your scaffold data here
  return (
    <div className="container mx-auto p-4">
      <h1>All Generated Scaffolds</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data?.map((prompt) => (
          <PromptCard
            key={prompt.id}
            objective={prompt.objective}
            grade={prompt.grade}
            needs={prompt.needs}
            scaffolds={prompt.scaffolds}
          />
        ))}
      </div>
    </div>
  );
}
