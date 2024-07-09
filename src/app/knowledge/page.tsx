"use client";

import { Button } from "@/components/ui/button";
import { usePdfToText } from "./hooks/usePdfToText";
import { ChangeEvent, FunctionComponent, RefObject } from "react";
import { Input } from "@/components/ui/input";
import { useSearch } from "./hooks/useSearch";

// TODO ファイルアップロードボタンとembedボタンは一つのボタンにする

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
  const { fileInputRef, isLoading, onClickUploadPDF, handleFileUpload } =
    usePdfToText();
  const { searchResults, handleSubmit } = useSearch();

  return (
    <div className=" my-8 flex w-full flex-col items-center">
      <form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Search"
          id="search-text"
          name="search-text"
        />
      </form>

      <UploadPDFButton
        isLoading={isLoading}
        fileInputRef={fileInputRef}
        handleFileUpload={handleFileUpload}
        onClickUploadPDF={onClickUploadPDF}
      />

      {searchResults}
    </div>
  );
}
