import { z } from "zod";
import { Database } from "./database.types";
import { login } from "../actions/login";

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
