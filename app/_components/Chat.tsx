"use client";

import { State, completions } from "@/server/actions/completions";
import { useFormState } from "react-dom";
import { SubmitButton } from "./SubmitButton";
import { useState, useEffect } from "react";

const initialState: State = {
  success: false,
  error: "",
};

export const Chat = () => {
  const [state, formAction] = useFormState(completions, initialState);
  const [history, setHistory] = useState<{ role: string; text: string }[]>([]);

  useEffect(() => {
    if (state.success) {
      setHistory((prevHistory) => [
        ...prevHistory,
        { role: "user", text: state.prompt },
        { role: "model", text: state.response },
      ]);
    }
  }, [state]);

  return (
    <div>
      <div className="mb-4">
        {history.map((message, index) => (
          <div
            key={index}
            className={`mb-2 ${message.role === "user" ? "text-right" : ""}`}
          >
            <span
              className={
                message.role === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }
              style={{
                padding: "0.5rem",
                borderRadius: "0.5rem",
                display: "inline-block",
              }}
            >
              {message.text}
            </span>
          </div>
        ))}
      </div>
      <form action={formAction}>
        <input
          type="text"
          name="prompt"
          className="w-80 max-w-xs p-2 border border-gray-300 rounded mb-4"
          placeholder="Enter text here"
        />
        <SubmitButton>submit</SubmitButton>
      </form>

      {!state.success && <div>{state.error}</div>}
    </div>
  );
};
