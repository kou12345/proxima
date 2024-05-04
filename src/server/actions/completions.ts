"use server";

import { chatGemini } from "../gemini/chat";

export type State = {
  success: true;
  prompt: string;
  response: string;
} | {
  success: false;
  error: string;
};

export const completions = async (
  _prevState: State,
  formData: FormData,
): Promise<State> => {
  const prompt = formData.get("prompt") as string;
  console.log(prompt);

  const res = await chatGemini(prompt);

  return { success: true, prompt: prompt, response: res };
};
