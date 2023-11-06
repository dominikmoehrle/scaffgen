"use server";

import { nanoid } from "@/utils/utils";
import OpenAI from "openai";
import supabase from "~/utils/supabaseClient";
import type { Scaffold } from "~/utils/types";

// Create a single supabase client for interacting with your database

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_KEY ?? "", // defaults to process.env["OPENAI_API_KEY"]
});

// Helper function to create Scaffold objects from an array of strings
const createScaffoldsFromArray = (array: string[]): Scaffold[] => {
  return array.map((content) => ({
    id: nanoid(),
    content: content, //.trim()??
    status: "IGNORED", // default status
  }));
};

export async function getOpenAICompletion(
  lessonObjective: string,
  gradeLevel: string,
  specialNeeds: string,
) {
  type Message = {
    role: "system" | "user" | "assistant";
    content: string;
  };

  const GPTInstruction =
    "You are an expert teacher assistant. You help them create scaffolds for their algebra classes. Given an objective, grade level, and special needs, you will generate 9 scaffolds. 3 that can be used as a warmup, 3 as a choiceboard, and 3 as misconception. ONLY return a JSON with three arrays that represent each scaffold type and are labelled as warmups, choiceboards and misconceptions. DO NOT RETURN ANY OTHER TEXT BESIDES THE ARRAYS. Thanks!";
  const userPrompt = `The lesson objective is ${lessonObjective}, the grade level is ${gradeLevel}, and the special needs are ${specialNeeds}.`;
  const contentToStore = GPTInstruction + "\n" + userPrompt;

  const messages_body: Message[] = [
    {
      role: "system",
      content: GPTInstruction,
    },
  ];

  //

  // Call OpenAI API to generate scaffold contents
  const gptResponse = await openai.chat.completions.create({
    messages: messages_body,
    model: "gpt-3.5-turbo",
  });

  console.log("Finished Running GPT");
  const botMessage = gptResponse.choices[0]?.message?.content ?? "";

  console.log(botMessage);

  // Parse the JSON response to get the scaffold contents
  const scaffoldData = JSON.parse(botMessage) as {
    warmups: string[];
    choiceboards: string[];
    misconceptions: string[];
  };
  const warmups = createScaffoldsFromArray(scaffoldData.warmups);
  const choiceboards = createScaffoldsFromArray(scaffoldData.choiceboards);
  const misconceptions = createScaffoldsFromArray(scaffoldData.misconceptions);

  const promptID = nanoid();

  messages_body.push({ role: "assistant", content: botMessage });

  const scaff_prompt = userPrompt;
  messages_body.push({ role: "user", content: scaff_prompt });

  const { error } = await supabase.from("Prompt").insert({
    id: promptID,
    prompt_content: contentToStore,
    grade: gradeLevel,
    needs: specialNeeds,
    objective: lessonObjective,
    scaffolds: {
      warmups: warmups,
      choiceboards: choiceboards,
      misconceptions: misconceptions,
    },
  });

  if (error) {
    console.log("ERROR");
    console.log(error.message);
  }

  console.log("Data saved to Supabase and exiting...");

  // Prepare the response object with the ID
  const response = {
    id: promptID, // Provide the ID so the client can use it to fetch the data later
  };

  // Return the response as JSON, including the ID
  return response;
}
