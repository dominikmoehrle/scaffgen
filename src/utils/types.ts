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

export type Message = {
  role: "system" | "user";
  content: string;
};

export type ComboboxDemoProps = {
  value: string;
  onChange: (value: string) => void;
};
