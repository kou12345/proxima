import { VectorSearchResponseSchema } from "../type/zodSchema";

export type State = {
  success: true;
  result: {
    content: string;
    similarity: number;
  }[];
} | {
  success: false;
  error: string;
};

export const questionAction = async (
  _prevState: State,
  formData: FormData,
): Promise<State> => {
  const question = formData.get("question") as string;

  const response = await fetch(
    "http://127.0.0.1:54321/functions/v1/vector-search",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization":
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0",
      },
      body: JSON.stringify({ query: question }),
    },
  );

  if (!response.ok) {
    console.error("Failed to fetch the answer.");
    return { success: false, error: "Failed to fetch the answer." };
  }

  const data = await response.json();

  const validate = VectorSearchResponseSchema.safeParse(data);
  if (!validate.success) {
    console.error("Failed to validate the response.", validate.error);
    return { success: false, error: "Failed to validate the response." };
  }

  return {
    success: true,
    result: data.map((item: { content: string; similarity: number }) => ({
      content: item.content,
      similarity: item.similarity,
    })),
  };
};
