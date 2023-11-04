/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { NextRequest } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";
import { nanoid } from "@/utils/utils";
import OpenAI from "openai";

// Create a single supabase client for interacting with your database

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ffyzcipgdiaoofpfwlvz.supabase.co";
// eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Validates a request object.
 *
 * @param {QrGenerateRequest} request - The request object to be validated.
 * @throws {Error} Error message if URL or prompt is missing.
 */

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY ?? "", // defaults to process.env["OPENAI_API_KEY"]
});

const validateRequest = (request: { text?: string }) => {
  if (!request.text) {
    throw new Error("URL is required");
  }
};

interface Scaffold {
  id: string;
  content: string;
  status: "ignored" | "accepted" | "bad";
}

//LATER IDEA MEASURE HOW MUCH PROGRESS FROM PROMPT TO MODIFICATION PASSES

// const ratelimit = new Ratelimit({
//   redis: kv,
//   // Allow 20 requests from the same IP in 1 day.
//   limiter: Ratelimit.slidingWindow(20, "1 d"),
// });

/* Output of GPT -> HAS to look like this
{
  "warmups": ["warmup suggestion 1", "warmup suggestion 2", "warmup suggestion 3"],
  "choiceboards": ["choiceboard suggestion 1", "choiceboard suggestion 2", "choiceboard suggestion 3"],
  "misconceptions": ["misconception 1", "misconception 2", "misconception 3"]
}
*/
// Helper function to create Scaffold objects from an array of strings
const createScaffoldsFromArray = (array: string[]): Scaffold[] => {
  return array.map((content) => ({
    id: nanoid(),
    content: content, //.trim()??
    status: "ignored", // default status
  }));
};

export async function POST(request: NextRequest) {
  console.log("Processing request on server side...");
  // const reqBody = (await request.json()) as QrGenerateRequest;

  // const ip = request.ip ?? "127.0.0.1";
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
  // const { success } = await ratelimit.limit(ip);
  // const success = true;
  const reqBody = await request.json();

  const lessonObjective = reqBody.lessonObjective as string;
  const gradeLevel = reqBody.gradeLevel as string;
  const specialNeeds = reqBody.needs as string;

  console.log(lessonObjective, gradeLevel, specialNeeds);

  console.log("Everything created on server side!!!!!!");

  /*if (!success && process.env.NODE_ENV !== "development") {
    return new Response("Too many requests. Please try again after 24h.", {
      status: 429,
    });
  }*/

  // try {
  //   validateRequest(reqBody);
  // } catch (e) {
  //   if (e instanceof Error) {
  //     return new Response(e.message, { status: 400 });
  //   }
  // }
  const GPTInstruction =
    "You are an expert teacher assistant. You help them create scaffolds for their algebra classes. Given an objective, grade level, and special needs, you will generate 9 scaffolds. 3 that can be used as a warmup, 3 as a choiceboard, and 3 as misconception. ONLY return a JSON with three arrays that represent each scaffold type and are labelled as warmups, choiceboards and misconceptions. DO NOT RETURN ANY OTHER TEXT BESIDES THE ARRAYS. Thanks!";
  const userPrompt = `The lesson objective is ${lessonObjective}, the grade level is ${gradeLevel}, and the special needs are ${specialNeeds}.`;
  const contentToStore = GPTInstruction + "\n" + userPrompt;

  const messages_body = [
    {
      role: "system",
      content: GPTInstruction,
    },
  ];

  // Call OpenAI API to generate scaffold contents
  const gptResponse = await openai.chat.completions.create({
    messages: messages_body,
    model: "gpt-3.5-turbo",
  });

  console.log("Finished Running GPT");
  const botMessage = gptResponse.choices[0].message.content;

  console.log(botMessage);

  // Parse the JSON response to get the scaffold contents
  const scaffoldData = JSON.parse(botMessage);
  const warmups = createScaffoldsFromArray(scaffoldData.warmups);
  const choiceboards = createScaffoldsFromArray(scaffoldData.choiceboards);
  const misconceptions = createScaffoldsFromArray(scaffoldData.misconceptions);

  const promptID = nanoid();

  messages_body.push({ role: "assistant", content: botMessage });

  const scaff_prompt = userPrompt;
  messages_body.push({ role: "user", content: scaff_prompt });

  const startTime = performance.now();

  // // Prepare the data to be saved in Vercel KV
  // const kvData = {
  //   lessonObjective: lessonObjective,
  //   grade: gradeLevel, // Assuming these fields are part of the request
  //   needs: specialNeeds,
  //   gen_content: {
  //     warmups,
  //     choiceboards,
  //     misconceptions,
  //   },
  // };

  // // Save the scaffold data to Vercel KV
  // await kv.hset(promptID, kvData);

  const { error } = await supabase.from("prompt").insert({
    id: promptID,
    promptContent: contentToStore,
    grade: gradeLevel,
    needs: specialNeeds,
    objective: lessonObjective,
    scaffolds: botMessage,
  });

  // const imageUrl = await replicateClient.generateQrCode({
  //   url: reqBody.url,
  //   prompt: reqBody.prompt,
  //   qr_conditioning_scale: 2,
  //   num_inference_steps: 30,
  //   guidance_scale: 5,
  //   negative_prompt:
  //     "Longbody, lowres, bad anatomy, bad hands, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, blurry",
  // });

  // const endTime = performance.now();
  // const durationMS = endTime - startTime;
  // console.log("Everything created on server side!!!!!!");

  // At the end of the POST function
  console.log("Data saved to Supabase and exiting...");

  // Prepare the response object with the ID
  const response = {
    id: promptID, // Provide the ID so the client can use it to fetch the data later
  };

  // Return the response as JSON, including the ID
  return new Response(JSON.stringify(response), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
