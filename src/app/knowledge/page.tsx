"use client";

import { Button } from "@/components/ui/button";
import { usePdfToText } from "./usePdfToText";
import { ChangeEvent, FunctionComponent, RefObject } from "react";
import { H2 } from "@/components/Typography/H2";
import { P } from "@/components/Typography/P";
import { EmbeddingButton } from "./EmbeddingButton";

const UploadPDFButton: FunctionComponent<{
  isLoading: boolean;
  fileInputRef: RefObject<HTMLInputElement>;
  handleFileUpload: (event: ChangeEvent<HTMLInputElement>) => Promise<void>;
  onClickUploadPDF: () => Promise<void>;
}> = ({ isLoading, fileInputRef, handleFileUpload, onClickUploadPDF }) => {
  return (
    <>
      <input
        type="file"
        accept=".pdf"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileUpload}
      />

      <Button
        onClick={onClickUploadPDF}
        className="mx-2 mb-4"
        disabled={isLoading}
      >
        {isLoading ? "Loading..." : "Upload PDF"}
      </Button>
    </>
  );
};

export default function Page() {
  const {
    pdfTextContents,
    fileInputRef,
    isLoading,
    onClickUploadPDF,
    handleFileUpload,
  } = usePdfToText();

  return (
    <div className=" my-8 flex flex-col items-center">
      <UploadPDFButton
        isLoading={isLoading}
        fileInputRef={fileInputRef}
        handleFileUpload={handleFileUpload}
        onClickUploadPDF={onClickUploadPDF}
      />

      <EmbeddingButton pdfTextContents={pdfTextContents} />

      {pdfTextContents.map((pdfTextContent) => (
        <div key={pdfTextContent.pageNumber} className="min-w-full text-left">
          <H2>Page {pdfTextContent.pageNumber}</H2>
          <P>{pdfTextContent.text}</P>
        </div>
      ))}
    </div>
  );
}
