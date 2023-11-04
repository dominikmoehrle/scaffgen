"use client";

import React, { useState, useEffect } from "react";
import { kv } from "@vercel/kv";

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ffyzcipgdiaoofpfwlvz.supabase.co";
// eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function Page({ params }: { params: { id: string } }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (params.id) {
        // Make sure params.id is not undefined
        try {
          //const scaffoldData = await getAllKv(params.id);
          const { data, error } = await supabase.from("prompt").select();
          if (data) {
            setData(data);
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

    fetchData();
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
        <strong>Lesson Objective:</strong> {data.lessonObjective}
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
          {data.gen_content.warmups.map((warmup) => (
            <li key={warmup.id}>{warmup.content}</li>
          ))}
        </ul>
      </div>
      {/* Repeat for choiceboards and misconceptions */}
    </div>
  );
}

async function getAllKv(id: string) {
  const data = await kv.hgetall<{
    lessonObjective: string;
    gradeLevel: string;
    specialNeeds: string;
  }>(id);

  return data;
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
