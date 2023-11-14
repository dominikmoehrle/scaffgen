"use server";

import { nanoid } from "nanoid";
import OpenAI from "openai";
import { formatScaffolds } from "~/utils/scaffolds";
import supabase from "~/utils/supabaseClient";
import type { PromptData, Scaffold, Message } from "~/utils/types";

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
    easeUseRatings: [], // default value
    engagementRatings: [], // default value
    alignmentRatings: [], // default value
  }));
};

export async function getOpenAICompletion(
  lessonObjective: string,
  gradeLevel: string,
  specialNeeds: string,
) {
  const GPTInstruction = `You are an expert teacher assistant. You help them create scaffolds for their algebra classes. Given an objective, grade level, and special needs, you will generate 9 rather extensive scaffolds. Each scaffold is completely independent from the others and contains the entire exercise. 3 that can be used as a warmup, 3 as a choiceboard, and 3 as misconception. ONLY return a JSON with three arrays containing each the three warmups, choiceboards and misconceptions. Make sure to format each of the 9 scaffolds well. For each scaffold, go into detail what the exercise is, the reasoning for why it fulfills the criteria, what students learn through it and what the right approach is. DO NOT RETURN ANY OTHER TEXT BESIDES THE ARRAYS. IT MUST HAVE THIS STRUCTURE: {
        "warmups": ["warmup suggestion 1", "warmup suggestion 2", "warmup suggestion 3"],
        "choiceboards": ["choiceboard suggestion 1", "choiceboard suggestion 2", "choiceboard suggestion 3"],
        "misconceptions": ["misconception 1", "misconception 2", "misconception 3"]
      }. So warmup suggestion 1 should include the entire scaffold for the warmup as a string. Thanks!";`;
  const userPrompt = `The lesson objective is ${lessonObjective}, the grade level is ${gradeLevel}, and the special needs are ${specialNeeds}.`;

  const messages_body: Message[] = [
    {
      role: "system",
      content: GPTInstruction,
    },
  ];

  //

  messages_body.push({ role: "user", content: userPrompt });

  console.log("Running GPT...");
  console.log(messages_body);

  // Call OpenAI API to generate scaffold contents
  const gptResponse = await openai.chat.completions.create({
    messages: messages_body,
    model: "gpt-4",
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

  const { error } = await supabase.from("Prompt").insert({
    id: promptID,
    prompt_content: GPTInstruction + "\n" + userPrompt,
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
  return {
    id: promptID, // Provide the ID so the client can use it to fetch the data later
  };
}

export async function redoScaffoldOpenAI(
  prompt: PromptData,
  scaffold: Scaffold,
) {
  const GPTInstruction = `You are an expert teacher assistant. You have already helped the user create a scaffold. Your last example was not good enough and now it is on you to improve it`;
  const userPrompt = `The original prompt was the following: ${
    prompt.prompt_content
  }. You generated the following scaffolds: ${formatScaffolds(
    prompt.scaffolds,
  )}. The user did not like the following scaffold: ${
    scaffold.content
  } Please create a new one considering the all requirement. Just return one string for the new content. Thanks!`;

  const messages_body: Message[] = [
    {
      role: "system",
      content: GPTInstruction,
    },
  ];

  //

  messages_body.push({ role: "user", content: userPrompt });

  console.log("Running GPT...");
  console.log(messages_body);

  // Call OpenAI API to generate scaffold contents
  const gptResponse = await openai.chat.completions.create({
    messages: messages_body,
    model: "gpt-4",
  });

  console.log("Finished Running GPT");
  const botMessage = gptResponse.choices[0]?.message?.content ?? "";

  console.log(botMessage);

  // Prepare the response object with the ID
  return botMessage;
}
