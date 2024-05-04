"use server";

export type State = {
  error?: string;
};

export const createContext = async (_prevState: State, formData: FormData) => {
  const context = formData.get("context") as string;
  console.log(context);

  // TODO urlは.envから取得する Authorizationは認証情報から取得する
  const response = await fetch(
    "http://127.0.0.1:54321/functions/v1/embedding",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization":
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0",
      },
      body: JSON.stringify({ content: context }),
    },
  );

  if (!response.ok) {
    console.error("Failed to fetch the answer.");
    return { error: "Failed to fetch the answer." };
  }

  const data = await response.json();
  console.log(data);

  return {};
};
