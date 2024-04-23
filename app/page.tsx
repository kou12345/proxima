"use client";

import { useFormState } from "react-dom";
import { SubmitButton } from "./_components/SubmitButton";
import { State, questionAction } from "../server/actions/question";

const initialState: State = {
  success: false,
  error: "",
};

export default function Home() {
  const [state, formAction] = useFormState(questionAction, initialState);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-12">
      <h1 className="text-5xl font-bold mb-2 text-center">Vector Search</h1>
      <h2 className="text-2xl mb-4 text-center">Enter a question</h2>
      <form action={formAction} className="flex flex-col items-end space-x-4">
        <input
          type="text"
          name="question"
          className="w-80 max-w-xs p-2 border border-gray-300 rounded mb-4"
          placeholder="Enter text here"
        />
        <SubmitButton />
      </form>

      {state.success ? (
        <div className="mt-4">
          <h3 className="text-lg font-bold">Result</h3>
          <ul>
            {state.result.map((item, index) => (
              <li key={index}>
                <div className="my-2">
                  <p>{item.content}</p>
                  <p>Similarity: {item.similarity}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="mt-4 text-red-500 font-bold text-center">{state.error}</p>
      )}
    </main>
  );
}
