"use client";

import { useFormStatus } from "react-dom";

export const SubmitButton = () => {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className="w-24 h-10 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      disabled={pending}
    >
      Submit
    </button>
  );
};
