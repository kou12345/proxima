import { z } from "zod";
import { Database } from "./database.types";

type MatchDocumentsDot =
  Database["public"]["Functions"]["match_documents_dot"]["Returns"];

export const VectorSearchResponseSchema = z.array(
  z.object({
    id: z.number(),
    content: z.string(),
    similarity: z.number(),
  }),
) satisfies z.ZodType<MatchDocumentsDot>;

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const CodeReviewSchema = z.object({
  codeDescription: z.string().min(1),
  code: z.string().min(1),
});

export const SupplementaryCodeFormSchema = z.object({
  supplementaryCode: z.array(CodeReviewSchema),
});

export const ChatRequestSchema = z.object({
  prompt: z.string().min(1),
});
