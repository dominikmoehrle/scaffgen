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
  const GPTInstruction = `You are an expert math teacher creating instructional scaffolds.`;
  const userPrompt = `The lesson objective is ${lessonObjective}, the grade level is ${gradeLevel}, and the special needs are ${specialNeeds}. `;
  const userPromptWarmupOne = `Create a warmup math task for ${gradeLevel} students that activates and reviews their prior knowledge and skills. The learning objective for this lesson is ${lessonObjective}. Create a brief task (5-10 minutes) that allows students to explore and review these skills. The task should engage students in the content they will learn in todays lesson.`
  const userPromptWarmupTwo = `Write a sentence about planes.`
  const userPromptWarmupThree = `Write a sentence about cooking.`

  const WarmupPrompts = [userPromptWarmupOne, userPromptWarmupTwo, userPromptWarmupThree]

  //
  let warmupOutputs: string[] = [];

  for (var prompt in WarmupPrompts) {

    const messages_body: Message[] = [
      {
        role: "system",
        content: GPTInstruction,
      },
    ];
    messages_body.push({ role: "user", content: WarmupPrompts[prompt]});

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
    warmupOutputs.push(botMessage);
  }

  let warmups: Scaffold[] = [];
  //let choiceboards: Scaffold[] = [];
  //let misconceptions: Scaffold[] = [];


  try {
    // Parse the JSON response to get the scaffold contents
    //const scaffoldData = JSON.parse(botMessage) as {
      //warmups: string[];
      //choiceboards: string[];
      //misconceptions: string[];
    //};
    warmups = createScaffoldsFromArray(warmupOutputs);
    //choiceboards = createScaffoldsFromArray(scaffoldData.choiceboards);
    //misconceptions = createScaffoldsFromArray(scaffoldData.misconceptions);
  } catch (error) {
    console.error("Error"); // Handle the error appropriately
    //console.log(botMessage);
  }

  const promptID = nanoid();

  const { error } = await supabase.from("Prompt").insert({
    id: promptID,
    prompt_content: GPTInstruction + "\n" + userPrompt,
    grade: gradeLevel,
    needs: specialNeeds,
    objective: lessonObjective,
    scaffolds: {
      warmups: warmups,
      //choiceboards: choiceboards,
      //misconceptions: misconceptions,
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

  try {
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
  } catch (error) {
    console.error("Error calling OpenAI:", (error as Error).message); // Handle the error appropriately
    // Handle the error appropriately
    // Depending on your application's structure, you might want to rethrow the error or return a default value
  }
}

