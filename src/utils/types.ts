export type QrCodeControlNetRequest = {
  url: string;
  prompt: string;
  qr_conditioning_scale?: number;
  num_inference_steps?: number;
  guidance_scale?: number;
  negative_prompt?: string;
};

export type QrCodeControlNetResponse = [string];

export type Scaffold = {
  id: string;
  content: string;
  status: "IGNORED" | "ACCEPTED" | "REJECTED" | "MODIFIED";
  easeUseRatings: number[];
  engagementRatings: number[];
  alignmentRatings: number[];
};

export type Scaffolds = {
  warmups: Scaffold[];
  choiceboards: Scaffold[];
  misconceptions: Scaffold[];
};

export type PromptData = {
  id: string;
  prompt_content: string;
  objective: string;
  grade: string;
  needs: string;
  scaffolds: Scaffolds;
};

//End;
