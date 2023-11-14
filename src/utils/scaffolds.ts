import { type PromptData } from "./types";

export const formatScaffolds = (scaffolds: PromptData["scaffolds"]) => {
  let formattedString = "";

  // Format warmups
  formattedString += "Warmups:\n";
  scaffolds.warmups.forEach((scaffold, index) => {
    formattedString += `  ${index + 1}. ${scaffold.content}\n`;
  });

  // Format choiceboards
  formattedString += "\nChoiceboards:\n";
  scaffolds.choiceboards.forEach((scaffold, index) => {
    formattedString += `  ${index + 1}. ${scaffold.content}\n`;
  });

  // Format misconceptions
  formattedString += "\nMisconceptions:\n";
  scaffolds.misconceptions.forEach((scaffold, index) => {
    formattedString += `  ${index + 1}. ${scaffold.content}\n`;
  });

  return formattedString;
};
