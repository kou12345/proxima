import { embedding } from "@/server/actions/embedding";
import React, { FunctionComponent } from "react";
import { PdfTextContent } from "./usePdfToText";
import { Button } from "@/components/ui/button";

export const EmbeddingButton: FunctionComponent<{
  pdfTextContents: PdfTextContent[];
}> = ({ pdfTextContents }) => {
  const handleClickEmbedding = async () => {
    await embedding(pdfTextContents[0].text);
  };

  return <Button onClick={handleClickEmbedding}>Embedding</Button>;
};
