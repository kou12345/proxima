"use server";

import { createClient } from "@/utils/supabase/server";
import { loginSchema } from "../type/zodSchema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type State = {
  success: true;
} | {
  success: false;
  error: string;
};

export const login = async (
  _prevState: State,
  formData: FormData,
): Promise<State> => {
  const supabase = await createClient();

  const validation = loginSchema.safeParse({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  });

  console.log(validation);
  if (!validation.success) {
    return { success: false, error: "Invalid form data" };
  }

  const { error } = await supabase.auth.signInWithPassword(validation.data);
  console.log(error);
  if (error) {
    return { success: false, error: error.message };
  }

  // TODO layoutを指定する意味を理解する
  console.log("revalidatePath");
  revalidatePath("/", "layout");
  redirect("/");
};
