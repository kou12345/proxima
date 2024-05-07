import { z } from "zod";

export const getTreeResponseSchema = z.array(
  z.object({
    path: z.string(),
  }),
);
