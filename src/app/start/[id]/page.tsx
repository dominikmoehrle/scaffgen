"use client";

import React, { useState, useEffect } from "react";
import { kv } from "@vercel/kv";

import { createClient } from "@supabase/supabase-js";

import supabase from "~/utils/supabaseClient";

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

export default function Page({ params }: { params: { id: string } }) {
  const [data, setData] = useState<PromptData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (params.id) {
      // Make sure params.id is not undefined
      try {
        //const scaffoldData = await getAllKv(params.id);
        const { data: fetchedData, error } = await supabase
          .from("Prompt")
          .select()
          .eq("id", params.id);
        if (fetchedData && fetchedData.length > 0) {
          setData(fetchedData[0] as PromptData);
        } else {
          // Handle no data found
        }
      } catch (error) {
        console.error("Error fetching scaffold data:", error);
        // Handle error
      } finally {
        setLoading(false);
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

  // Render your scaffold data here
  return (
    <div>
      <h1>Scaffold Data</h1>
      {/* Render your data here */}
      <div>
        <strong>Lesson Objective:</strong> {data.objective}
      </div>
      <div>
        <strong>Grade Level:</strong> {data.grade}
      </div>
      <div>
        <strong>Special Needs:</strong> {data.needs}
      </div>
      <div>
        <strong>Warmups:</strong>
        <ul>
          {data?.scaffolds.warmups?.map((warmup) => (
            <li key={warmup.id}>{warmup.content}</li>
          ))}
        </ul>
      </div>
      <div>
        <strong>Choiceboards:</strong>
        <ul>
          {data?.scaffolds.choiceboards?.map((choiceboard) => (
            <li key={choiceboard.id}>{choiceboard.content}</li>
          ))}
        </ul>
      </div>
      <div>
        <strong>Misconceptions:</strong>
        <ul>
          {data?.scaffolds.misconceptions?.map((misconception) => (
            <li key={misconception.id}>{misconception.content}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// export async function generateMetadata({
//   params,
// }: {
//   params: {
//     id: string;
//   };
// }): Promise<Metadata | undefined> {
//   const data = await getAllKv(params.id);
//   if (!data) {
//     return;
//   }

//   const title = `QrGPT: ${data.prompt}`;
//   const description = `A QR code generated from qrGPT.io linking to: ${data.website_url}`;
//   const image = data.image || "https://qrGPT.io/og-image.png";

//   return {
//     title,
//     description,
//     openGraph: {
//       title,
//       description,
//       images: [
//         {
//           url: image,
//         },
//       ],
//     },
//     twitter: {
//       card: "summary_large_image",
//       title,
//       description,
//       images: [image],
//       creator: "@nutlope",
//     },
//   };
// }

// export default async function Results({
//   params,
// }: {
//   params: {
//     id: string;
//   };
// }) {
//   const data = await getAllKv(params.id);
//   if (!data) {
//     notFound();
//   }
//   return (
//     <div>
//       Hello, world! {data.prompt} {data.image} {params.id}
//     </div>
//   );
// }
