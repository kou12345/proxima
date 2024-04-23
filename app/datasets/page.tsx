"use client";

import { SubmitButton } from "../_components/SubmitButton";
import { State, createContext } from "../../server/actions/context";
import { useFormState } from "react-dom";
import { useRef } from "react";

const initialState: State = {};

export default function Page() {
  const [state, formAction] = useFormState(createContext, initialState);
  const ref = useRef<HTMLFormElement>(null);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Context Input</h1>
      <form
        ref={ref}
        action={async (formData) => {
          await formAction(formData);
          ref.current?.reset();
        }}
        className="w-full max-w-lg"
      >
        <div className="flex flex-col mb-4">
          <label htmlFor="context" className="mb-2 font-bold text-lg">
            Context:
          </label>
          <textarea
            id="context"
            name="context"
            rows={5}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your context here"
          />
        </div>
        <div className="flex justify-end">
          <SubmitButton />
        </div>
      </form>
      {state.error && (
        <div className="mt-8 p-4 bg-red-100 text-red-800 rounded-md">
          {state.error}
        </div>
      )}
    </div>
  );
}
