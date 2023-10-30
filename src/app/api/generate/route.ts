/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { replicateClient } from "@/utils/ReplicateClient";
import { QrGenerateRequest, QrGenerateResponse } from "@/utils/service";
import { NextRequest } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";
import { put } from "@vercel/blob";
import { nanoid } from "@/utils/utils";
import OpenAI from 'openai'

/**
 * Validates a request object.
 *
 * @param {QrGenerateRequest} request - The request object to be validated.
 * @throws {Error} Error message if URL or prompt is missing.
 */

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY, // defaults to process.env["OPENAI_API_KEY"]
});

const validateRequest = (request) => {
  if (!request.text) {
    throw new Error("URL is required");
  }
};


// const ratelimit = new Ratelimit({
//   redis: kv,
//   // Allow 20 requests from the same IP in 1 day.
//   limiter: Ratelimit.slidingWindow(20, "1 d"),
// });

export async function POST(request: NextRequest) {
  console.log("Everything created on server side!!!!!!");
  // const reqBody = (await request.json()) as QrGenerateRequest;

  // const ip = request.ip ?? "127.0.0.1";
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
  // const { success } = await ratelimit.limit(ip);
  // const success = true;
  const reqBody = (await request.json())
  const prompt = reqBody.text;
  console.log(prompt)

  console.log("Everything created on server side!!!!!!");

  /*if (!success && process.env.NODE_ENV !== "development") {
    return new Response("Too many requests. Please try again after 24h.", {
      status: 429,
    });
  }*/

  try {
    validateRequest(reqBody);
  } catch (e) {
    if (e instanceof Error) {
      return new Response(e.message, { status: 400 });
    }
  }

  let messages_body = [
    {
      role: "system",
      content:
        "Please generate a math word problem for the following math topic.",
    },
  ];

  messages_body.push({ role: "user", content: prompt })

  const gptResponse = await openai.chat.completions.create({
    // messages: messages,
    messages: messages_body,
    model: "gpt-3.5-turbo",
  });

  console.log("Finished Running GPT")
  const botMessage = gptResponse.choices[0].message.content;


  console.log(botMessage);
  messages_body.push({ role: "assistant", content: botMessage });

  const scaff_prompt = "Please provide key concepts students may need to be able to solve this problem";
  messages_body.push({ role: "user", content: scaff_prompt });

  const gptResponseScaff = await openai.chat.completions.create({
    // messages: messages,
    messages: messages_body,
    model: "gpt-3.5-turbo",
  });

  const botMessageScaff = gptResponseScaff.choices[0].message.content;

  console.log(botMessageScaff);

  const id = nanoid();
  const startTime = performance.now();


  // const imageUrl = await replicateClient.generateQrCode({
  //   url: reqBody.url,
  //   prompt: reqBody.prompt,
  //   qr_conditioning_scale: 2,
  //   num_inference_steps: 30,
  //   guidance_scale: 5,
  //   negative_prompt:
  //     "Longbody, lowres, bad anatomy, bad hands, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, blurry",
  // });

  const url = "";

  const endTime = performance.now();
  const durationMS = endTime - startTime;
  console.log("Everything created on server side!!!!!!");

  // convert output to a blob object
  //const file = await fetch(imageUrl).then((res) => res.blob());

  // upload & store in Vercel Blob
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
  //const { url } = await put(`${id}.png`, file, { access: "public" });

  // await kv.hset(id, {
  //   prompt: reqBody.prompt,
  //   image: url,
  //   website_url: reqBody.url,
  //   model_latency: Math.round(durationMS),
  // });

  /* const response: QrGenerateResponse = {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    image_url: url,
    model_latency_ms: Math.round(durationMS),
    id: id,
  };*/

  const response = gptResponseScaff

  console.log("EXITING...")

  return new Response(JSON.stringify(response), {
    status: 200,
  });
}