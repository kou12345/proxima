import { z } from "zod";

export const getTreeResponseSchema = z.array(
  z.object({
    path: z.string(),
  }),
);

export const extractTaskRequestSchema = z.object({
  path: z.string(),
});

export const extractTaskResponseSchema = z.object({
  text: z.string(),
});
