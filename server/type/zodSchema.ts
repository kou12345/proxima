import { z } from "zod";
import { Database } from "../../supabase/functions/_shared/database.types";

type MatchDocumentsDot =
  Database["public"]["Functions"]["match_documents_dot"]["Returns"];

export const VectorSearchResponseSchema = z.array(
  z.object({
    id: z.number(),
    content: z.string(),
    similarity: z.number(),
  }),
) satisfies z.ZodType<MatchDocumentsDot>;
