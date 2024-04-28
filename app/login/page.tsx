"use client";

import { State, login } from "@/server/actions/login";
import { SubmitButton } from "../_components/SubmitButton";
import { useFormState } from "react-dom";
import { Input } from "../_components/Input";

const initialState: State = {
  success: false,
  error: "",
};

export default function LoginPage() {
  const [state, formAction] = useFormState(login, initialState);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" action={formAction}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <Input
                type="email"
                name="email"
                placeholder="Email address"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <Input
                type="password"
                name="password"
                placeholder="Password"
                required
              />
            </div>
          </div>

          <div className="flex justify-end">
            <SubmitButton>Sign in</SubmitButton>
          </div>
        </form>

        {!state.success && state.error && (
          <div className="mt-4 text-center text-red-600">{state.error}</div>
        )}
      </div>
    </div>
  );
}
